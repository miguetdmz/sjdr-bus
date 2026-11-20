#!/usr/bin/env node
// M-07: revisa que la compilación de la app (web/dist/) traiga lo necesario para
// instalarla: manifiesto, íconos y service worker, y que el service worker guarde
// la app y sus datos pero ninguna tesela del mapa. Como la inspección final de
// empaque: no basta con que la pieza se fabrique, tiene que salir con todo.
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const dist = fileURLToPath(new URL('../web/dist/', import.meta.url));
const fallas = [];
const falla = (m) => fallas.push(m);

const manifiestoRuta = join(dist, 'manifest.webmanifest');
if (!existsSync(manifiestoRuta)) falla('falta manifest.webmanifest');
else {
  const m = JSON.parse(readFileSync(manifiestoRuta, 'utf8'));
  for (const icono of m.icons ?? []) if (!existsSync(join(dist, icono.src))) falla(`falta el ícono ${icono.src}`);
}
const html = readFileSync(join(dist, 'index.html'), 'utf8');
for (const ref of ['manifest.webmanifest', 'iconos/apple-touch-icon.png', 'iconos/icono.svg']) {
  if (!html.includes(ref)) falla(`index.html no enlaza ${ref}`);
}
const swRuta = join(dist, 'sw.js');
if (!existsSync(swRuta)) falla('falta sw.js');
else {
  const sw = readFileSync(swRuta, 'utf8');
  const lista = JSON.parse(sw.match(/const ARCHIVOS = (\[[\s\S]*?\]);/)?.[1] ?? '[]');
  for (const a of ['./', './datos/rutas.json', './datos/paradas.json', './manifest.webmanifest']) {
    if (!lista.includes(a)) falla(`el service worker no guarda ${a}`);
  }
  for (const a of lista) {
    if (/^https?:|openstreetmap|tile/i.test(a)) falla(`el service worker guarda algo de fuera de la app: ${a}`);
    else if (a !== './' && !existsSync(join(dist, a))) falla(`el service worker pide un archivo que no existe: ${a}`);
  }
  if (!lista.some((a) => /^\.\/assets\/.+\.js$/.test(a))) falla('el service worker no guarda el código de la app');
  if (sw.includes('__VERSION__') || sw.includes('__ARCHIVOS__')) falla('sw.js quedó sin armar');
}

if (fallas.length) {
  for (const f of fallas) console.error(`COMPILACIÓN: ${f}`);
  process.exit(1);
}
console.log('COMPILACIÓN: manifiesto, íconos y service worker en orden');
