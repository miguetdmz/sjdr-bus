#!/usr/bin/env node
// Revisión automática de las reglas del proyecto (CLAUDE.md, D-11).
// Convierte en prueba las lecciones del trabajo de la práctica (docs/REVISION-HANDOFF.md).
//
// Uso:
//   node scripts/reglas.mjs                 revisa el repositorio
//   node scripts/reglas.mjs --app=<carpeta> revisa otra carpeta como si fuera la app
//                                           (lo usan las pruebas)
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const raiz = new URL('..', import.meta.url).pathname;
const argApp = process.argv.find((a) => a.startsWith('--app='));
const soloApp = Boolean(argApp);
const carpetaApp = argApp ? argApp.slice(6) : join(raiz, 'web');

const EXTENSIONES = /\.(html?|css|js|mjs|cjs|ts|tsx|jsx|json|webmanifest|svg|txt|csv|geojson)$/i;

// La app nunca consulta estos servicios en vivo ni usa Google (HANDOFF §11.6, §14-10).
const DOMINIOS_PROHIBIDOS_EN_APP = [
  ['router.project-osrm.org', 'OSRM se consulta solo al construir el dato (M-13)'],
  ['nominatim.openstreetmap.org', 'Nominatim se consulta solo al construir el dato'],
  ['overpass-api.de', 'Overpass se consulta solo al construir el dato'],
  ['maps.googleapis.com', 'Cero Google Maps'],
  ['maps.google.', 'Cero Google Maps'],
  ['fonts.googleapis.com', 'Fuentes locales, sin Google (M-15)'],
  ['fonts.gstatic.com', 'Fuentes locales, sin Google (M-15)'],
];

// La app no usa la marca del gobierno como nombre (D-02, M-01).
const MARCA = /qrob[uú]s/i;

// Coordenadas que nunca deben aparecer en datos ni en la app (HANDOFF §11.3, M-10).
const COORDENADAS_PROHIBIDAS = [
  ['20.70044', '-99.81309', 'Central de Autobuses de Cadereyta (error de Nominatim)'],
  ['20.39020', '-100.00150', 'Central inventada en la práctica'],
  ['20.37650', '-99.93850', 'UTSJR inventada en la práctica'],
  ['20.38300', '-100.01000', 'Francisco Villa inventada en la práctica'],
];

const fallas = [];
const falla = (archivo, motivo) => fallas.push(`${relative(raiz, archivo) || archivo}: ${motivo}`);

function archivos(carpeta) {
  if (!existsSync(carpeta)) return [];
  return readdirSync(carpeta, { recursive: true })
    .map((r) => join(carpeta, r))
    .filter((r) => !r.includes('node_modules') && !r.includes('/dist/'))
    .filter((r) => statSync(r).isFile() && EXTENSIONES.test(r));
}

// Lección 8: una página descargada puede traer una llave de sesión (csrf). Nada
// con llave entra a datos/ ni a la app; la copia completa va a referencias/.
const LLAVE_DE_SESION = /csrf[-_]token["']?\s+content=|name=["']_token["']\s+value=/i;
function revisarLlaves(archivo, texto) {
  if (LLAVE_DE_SESION.test(texto)) falla(archivo, 'trae una llave de sesión de página web (lección 8): guarda la copia completa en referencias/');
}

function revisarCoordenadas(archivo, texto) {
  for (const [lat, lon, que] of COORDENADAS_PROHIBIDAS) {
    if (texto.includes(lat) && texto.includes(lon)) falla(archivo, `coordenada prohibida ${lat}, ${lon} (${que})`);
  }
}

// 1. La app.
for (const archivo of archivos(carpetaApp)) {
  const texto = readFileSync(archivo, 'utf8');
  for (const [dominio, motivo] of DOMINIOS_PROHIBIDOS_EN_APP) {
    if (texto.includes(dominio)) falla(archivo, `usa ${dominio}: ${motivo}`);
  }
  if (MARCA.test(texto)) falla(archivo, 'usa la marca Qrobús en la app (D-02)');
  revisarCoordenadas(archivo, texto);
  revisarLlaves(archivo, texto);
}

if (!soloApp) {
  // 2. Los datos.
  for (const archivo of archivos(join(raiz, 'datos'))) {
    const texto = readFileSync(archivo, 'utf8');
    revisarCoordenadas(archivo, texto);
    revisarLlaves(archivo, texto);
  }

  // 3. Archivos que no pueden faltar.
  for (const f of ['CLAUDE.md', 'README.md', 'LICENSE', 'datos/LICENSE', 'docs/PLAN.md', 'docs/DECISIONES.md', 'docs/HANDOFF.md', 'docs/REVISION-HANDOFF.md']) {
    if (!existsSync(join(raiz, f))) falla(f, 'falta este archivo');
  }

  // 4. El material de la práctica no se sube a GitHub (D-07).
  const git = (...a) => execFileSync('git', a, { cwd: raiz, encoding: 'utf8' }).trim();
  if (git('ls-files', 'referencias')) falla('referencias/', 'está en git y no debe subirse (D-07)');
  try {
    git('check-ignore', '-q', 'referencias/prueba.html');
  } catch {
    falla('.gitignore', 'referencias/ no está ignorada (D-07)');
  }
}

if (fallas.length) {
  console.error(`REGLAS: ${fallas.length} falla(s)`);
  for (const f of fallas) console.error(`  ✗ ${f}`);
  process.exit(1);
}
console.log('REGLAS: todo en orden');
