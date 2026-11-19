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
  assert.match(css, /\.m-gris/);
  assert.match(css, /\.pestanas/);
});

// E-02: menú lateral animado desde 768 px.
test('app: botón de menú accesible y panel lateral animado desde 768 px', () => {
  assert.match(html, /<button[^>]*id="boton-menu"[^>]*aria-label="Menú de rutas"/);
  assert.match(html, /id="boton-menu"[^>]*aria-expanded=/);
  assert.match(html, /id="boton-menu"[^>]*aria-controls="hoja"/);
  assert.equal((html.match(/id="ruta"/g) ?? []).length, 1);
  const ancho = css.slice(css.indexOf('@media (min-width: 768px)'));
  assert.ok(css.includes('@media (min-width: 768px)'));
  assert.match(ancho, /transform: translateX/);
  assert.match(ancho, /transition: transform/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(main, /key === 'Escape'/);
});
