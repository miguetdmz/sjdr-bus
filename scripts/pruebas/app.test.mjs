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

test('app: mapa de OpenStreetMap con atribución, centrado en Plaza Independencia', () => {
  assert.match(main, /tile\.openstreetmap\.org/);
  assert.match(main, /openstreetmap\.org\/copyright/);
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
  assert.equal((html.match(/id="ruta"/g) ?? []).length, 1);
  assert.match(css, /\.hoja\.cerrada \{[^}]*transform: translateX/);
  assert.match(css, /transition: transform/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(main, /key === 'Escape'/);
});

// D-48 + regla 5: lo que la primera pantalla debe mostrar sin tocar nada
// (selector, sentido y leyenda) vive FUERA del menú lateral, que empieza cerrado.
test('app: selector, sentido y leyenda quedan fuera del menú lateral (regla 5, D-48)', () => {
  const sinComentarios = html.replace(/<!--[\s\S]*?-->/g, '');
  const ini = sinComentarios.indexOf('id="hoja"');
  const fin = sinComentarios.indexOf('</aside>', ini);
  assert.ok(ini > 0 && fin > ini, 'existe el menú lateral');
  const menu = sinComentarios.slice(ini, fin);
  const fuera = sinComentarios.slice(0, ini) + sinComentarios.slice(fin);
  for (const [que, re] of [['selector', /id="ruta"/], ['sentido', /class="sentido"/], ['leyenda', /Iniciativa ciudadana independiente/]]) {
    assert.match(fuera, re, `${que} visible fuera del menú`);
  }
  assert.doesNotMatch(menu, /id="ruta"|class="sentido"/);
});

// D-49: el sentido empieza oculto y aparece solo con ruta elegida.
test('app: el sentido empieza oculto y lo muestra la ruta elegida (D-49)', () => {
  assert.match(html, /<fieldset class="sentido" id="sentido" hidden>/);
  assert.match(main, /campoSentido\.hidden = !estado\.ruta/);
});
