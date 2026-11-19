#!/usr/bin/env node
// Candado «solo open source» (N-04, CLAUDE.md § Licencias).
// Como un control de recibo de materia prima: ninguna pieza entra a la línea si su
// certificado (la licencia) no está en la lista aprobada y anotado en el registro.
//
// Revisa las dependencias DIRECTAS de package.json (dependencies, devDependencies,
// optionalDependencies y peerDependencies) y falla si alguna:
//   - tiene una licencia que no es MIT, BSD-2-Clause, BSD-3-Clause, ISC o Apache-2.0, o
//   - no aparece en la tabla de docs/LICENCIAS.md.
// Las dependencias INDIRECTAS (las que traen las directas) solo se listan como aviso
// cuando su licencia no está en la lista.
//
// La licencia se lee de package-lock.json (npm la anota ahí) y, si no está, de
// node_modules/<paquete>/package.json.
//
// Uso:
//   node scripts/licencias.mjs                      revisa el repositorio
//   node scripts/licencias.mjs --carpeta=<carpeta>  revisa otra carpeta con su propio
//                                                   package.json, package-lock.json y
//                                                   LICENCIAS.md (lo usan las pruebas)
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const PERMITIDAS = new Set(['MIT', 'BSD-2-Clause', 'BSD-3-Clause', 'ISC', 'Apache-2.0']);

const raiz = new URL('..', import.meta.url).pathname;
const argCarpeta = process.argv.find((a) => a.startsWith('--carpeta='))?.slice(10);
const carpeta = argCarpeta ?? raiz;
const registro = argCarpeta ? join(carpeta, 'LICENCIAS.md') : join(raiz, 'docs', 'LICENCIAS.md');

const leerJSON = (ruta) => JSON.parse(readFileSync(ruta, 'utf8'));
const paquete = leerJSON(join(carpeta, 'package.json'));
const rutaLock = join(carpeta, 'package-lock.json');
const lock = existsSync(rutaLock) ? leerJSON(rutaLock) : null;
const textoRegistro = existsSync(registro) ? readFileSync(registro, 'utf8') : '';

// Licencia de un paquete instalado en la ruta «node_modules/…» del lockfile.
function licenciaDe(rutaModulo) {
  const desdeLock = lock?.packages?.[rutaModulo]?.license;
  if (desdeLock) return desdeLock;
  const pj = join(carpeta, rutaModulo, 'package.json');
  if (!existsSync(pj)) return null;
  const datos = leerJSON(pj);
  if (typeof datos.license === 'string') return datos.license;
  if (datos.license?.type) return datos.license.type; // formato antiguo
  if (Array.isArray(datos.licenses)) return datos.licenses.map((l) => l.type ?? l).join(' OR ');
  return null;
}

// ¿La expresión SPDX es aceptable? «A OR B»: basta una permitida (se elige esa).
// «A AND B»: todas deben estar permitidas. Si mezcla AND y OR, se pide revisarla a mano.
function permitida(expresion) {
  const limpia = expresion.replace(/[()]/g, ' ').trim();
  const tieneAnd = / AND /i.test(limpia);
  const tieneOr = / OR /i.test(limpia);
  if (tieneAnd && tieneOr) return false;
  const partes = limpia.split(/ AND | OR /i).map((p) => p.trim());
  return tieneOr ? partes.some((p) => PERMITIDAS.has(p)) : partes.every((p) => PERMITIDAS.has(p));
}

// ¿El paquete está en la tabla del registro? Primera columna: «| nombre |» o «| `nombre` |».
function anotada(nombre) {
  const escapado = nombre.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&');
  return new RegExp(`^\\|\\s*\`?${escapado}\`?\\s*\\|`, 'm').test(textoRegistro);
}

const directas = Object.keys({
  ...paquete.dependencies,
  ...paquete.devDependencies,
  ...paquete.optionalDependencies,
  ...paquete.peerDependencies,
}).sort();

const fallas = [];
for (const nombre of directas) {
  const licencia = licenciaDe(`node_modules/${nombre}`);
  if (!licencia) {
    fallas.push(`${nombre}: no se encontró su licencia (¿falta package-lock.json o npm install?)`);
    continue;
  }
  if (!permitida(licencia)) fallas.push(`${nombre}: licencia «${licencia}» no permitida (solo ${[...PERMITIDAS].join(', ')})`);
  if (!anotada(nombre)) fallas.push(`${nombre}: no está anotada en ${argCarpeta ? 'LICENCIAS.md' : 'docs/LICENCIAS.md'}`);
}

// Indirectas: solo aviso.
const avisos = [];
const indirectas = Object.keys(lock?.packages ?? {}).filter(
  (ruta) => ruta.startsWith('node_modules/') && !directas.some((d) => ruta === `node_modules/${d}`),
);
for (const ruta of indirectas) {
  const licencia = licenciaDe(ruta);
  if (!licencia || !permitida(licencia)) avisos.push(`${ruta.replace(/^.*node_modules\//, '')}: «${licencia ?? 'sin licencia declarada'}»`);
}

if (avisos.length) {
  console.log(`LICENCIAS: aviso, ${avisos.length} dependencia(s) indirecta(s) fuera de la lista (no hace fallar):`);
  for (const a of avisos) console.log(`  · ${a}`);
}
if (fallas.length) {
  console.error(`LICENCIAS: ${fallas.length} falla(s)`);
  for (const f of fallas) console.error(`  ✗ ${f}`);
  process.exit(1);
}
console.log(`LICENCIAS: todo en orden (${directas.length} directa(s), ${indirectas.length} indirecta(s))`);
