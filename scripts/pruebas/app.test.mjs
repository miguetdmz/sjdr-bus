// M-01: esqueleto de la app. Comprueba en el código fuente de web/ lo que pide la
// cola: nombre visible (D-28), leyenda de iniciativa independiente, mapa de
// OpenStreetMap con atribución y centro en Plaza Independencia (HANDOFF §11.3).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';

const leer = (r) => readFileSync(new URL(`../../web/${r}`, import.meta.url), 'utf8');
const html = leer('index.html');
const main = leer('src/main.ts');
const css = leer('src/estilos.css');

test('app: nombre visible «SJDR Bus» (D-28) y leyenda de iniciativa independiente', () => {
  assert.match(html, /<h1 class="nombre">SJDR Bus<\/h1>/);
  assert.match(html, /<title>SJDR Bus<\/title>/);
  assert.doesNotMatch(html, /nombre provisional/);
  assert.match(html, /Iniciativa ciudadana independiente/);
});

test('app: mapa de OpenStreetMap; vista inicial de la ciudad completa, como la maqueta de D-53', () => {
  assert.match(main, /tile\.openstreetmap\.org/);
  assert.match(html, /openstreetmap\.org\/copyright/);
  // D-53: la vista inicial es la de la maqueta aprobada (la ciudad completa);
  // Plaza Independencia (HANDOFF §11.3) queda dentro de ella.
  assert.match(main, /VISTA_CIUDAD: L\.LatLngTuple = \[20\.389, -99\.975\]/);
  assert.match(main, /20\.38883, -99\.99639/);
});

test('app: fuentes del sistema, ninguna fuente descargada', () => {
  assert.match(css, /font-family: system-ui/);
  assert.doesNotMatch(css + html, /@font-face|@import url|\.woff2?/);
});

// E-01 (D-30): ningún texto de tiempo calculado ni «en vivo» (llegan con R-06 y B4).
test('app: sin tiempo calculado ni «en vivo» en el HTML ni en el código', () => {
  const dir = new URL('../../web/src/', import.meta.url);
  const fuentes = [['index.html', html.replace(/<!--[\s\S]*?-->/g, '')]];
  for (const f of readdirSync(dir).filter((n) => n.endsWith('.ts'))) {
    const t = readFileSync(new URL(f, dir), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
    fuentes.push([f, t]);
  }
  for (const [nombre, texto] of fuentes) {
    assert.doesNotMatch(texto, /≈\s*\d+\s*min/, `${nombre}: tiempo calculado`);
    assert.doesNotMatch(texto, /en vivo/i, `${nombre}: «en vivo» sin GPS real`);
  }
});

test('app: sin franja de ejemplo y con la paleta D-30', () => {
  assert.doesNotMatch(html, /EJEMPLO DE DISEÑO/);
  for (const c of ['--tinta: #12262d', '--primario: #0d7a72', '--acento: #f0a032', '--fondo: #f4f2ec']) {
    assert.ok(css.includes(c), c);
  }
  assert.match(css, /\.leaflet-tile-pane \{ filter: grayscale/);
  assert.match(css, /\.parada-toque svg/);
  assert.match(css, /\.pestanas/);
});

// D-48: el menú lateral (antes E-02) es el mismo en teléfono y computadora.
test('app: botón de menú accesible y menú lateral animado, cerrado al cargar', () => {
  assert.match(html, /<button[^>]*id="boton-menu"[^>]*aria-label="Menú de rutas"/);
  assert.match(html, /id="boton-menu"[^>]*aria-expanded="false"/);
  assert.match(html, /id="boton-menu"[^>]*aria-controls="hoja"/);
  assert.match(html, /<aside class="hoja cerrada" id="hoja"/);
  assert.match(css, /\.hoja\.cerrada \{[^}]*transform: translateX/);
  assert.match(css, /transition: transform/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(main, /key === 'Escape'/);
});

// Regla 5 (D-53): la primera pantalla es mapa + ☰ + «¿A dónde quieres ir?» +
// botón de paradas, con la leyenda; todo FUERA del menú lateral, que empieza
// cerrado. La ruta y su sentido se eligen DENTRO del menú.
test('app: arriba ☰, «¿A dónde quieres ir?» y paradas; ruta y sentido dentro del menú (regla 5, D-53)', () => {
  const sinComentarios = html.replace(/<!--[\s\S]*?-->/g, '');
  const ini = sinComentarios.indexOf('id="hoja"');
  const fin = sinComentarios.indexOf('</aside>', ini);
  assert.ok(ini > 0 && fin > ini, 'existe el menú lateral');
  const menu = sinComentarios.slice(ini, fin);
  const fuera = sinComentarios.slice(0, ini) + sinComentarios.slice(fin);
  for (const [que, re] of [['menú', /id="boton-menu"/], ['destino', /id="boton-destino"/], ['paradas', /id="boton-paradas"/], ['leyenda', /Iniciativa ciudadana independiente/]]) {
    assert.match(fuera, re, `${que} visible fuera del menú`);
  }
  for (const [que, re] of [['tarjetas', /id="tarjetas"/], ['sentido', /class="sentido"/]]) {
    assert.match(menu, re, `${que} dentro del menú`);
    assert.doesNotMatch(fuera, re, `${que} no está fuera del menú`);
  }
});

// D-49: el sentido aparece solo con ruta elegida (vive dentro de #ruta-elegida).
test('app: el sentido solo se ve con ruta elegida (D-49, D-53)', () => {
  const bloque = html.slice(html.indexOf('id="ruta-elegida"'), html.indexOf('id="modo-calcula"'));
  assert.match(html, /<div class="ruta-elegida" id="ruta-elegida" hidden>/);
  assert.match(bloque, /class="sentido"/);
  assert.match(main, /rutaElegida\.hidden = !ruta/);
});

// D-53, ajustes 1 y 2: un solo pie legal con la atribución de Leaflet y OSM.
test('app: pie legal único con la atribución (regla 6), sin el control suelto de Leaflet', () => {
  const pie = html.match(/<p class="pie" id="pie">([\s\S]*?)<\/p>/)?.[1] ?? '';
  for (const t of ['Iniciativa ciudadana independiente', 'no oficial', 'datos en proceso de validación', 'href="https://leafletjs.com"', 'href="https://www.openstreetmap.org/copyright"']) {
    assert.ok(pie.includes(t), t);
  }
  assert.match(main, /attributionControl: false/);
  assert.doesNotMatch(main, /L\.control\s*\.attribution/);
});
