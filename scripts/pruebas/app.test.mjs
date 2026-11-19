// M-01: esqueleto de la app. Comprueba en el código fuente de web/ lo que pide la
// cola: nombre provisional, leyenda de iniciativa independiente, mapa de
// OpenStreetMap con atribución y centro en Plaza Independencia (HANDOFF §11.3).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const leer = (r) => readFileSync(new URL(`../../web/${r}`, import.meta.url), 'utf8');
const html = leer('index.html');
const main = leer('src/main.ts');
const css = leer('src/estilos.css');

test('app: nombre provisional y leyenda de iniciativa independiente visibles', () => {
  assert.match(html, /SJDRbus <span[^>]*>\(nombre provisional\)<\/span>/);
  assert.match(html, /<title>SJDRbus \(nombre provisional\)<\/title>/);
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
