// M-03: selector de ruta y control de sentido (HANDOFF §11.8, D-18).
// La lógica del selector (web/src/selector.ts) se prueba con Node, que entiende
// TypeScript simple. La prueba en navegador real llega con M-08.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { armarDatosApp } from '../datos-app.mjs';
import { inventario } from '../lib/handoff.mjs';
import { gruposSelector } from '../../web/src/selector.ts';

const rutas = armarDatosApp().rutas;
const grupos = gruposSelector(rutas);
const html = readFileSync(new URL('../../web/index.html', import.meta.url), 'utf8');
const css = readFileSync(new URL('../../web/src/estilos.css', import.meta.url), 'utf8');

test('selector: 40 opciones agrupadas 38 Urbanas + 2 Intermunicipales', () => {
  assert.deepEqual(grupos.map((g) => g.etiqueta), ['Urbanas', 'Intermunicipales']);
  assert.equal(grupos[0].opciones.length, 38);
  assert.equal(grupos[1].opciones.length, 2);
});

test('selector: orden y textos de HANDOFF §4 («001 — Pedregoso – Centro»)', () => {
  const opciones = grupos.flatMap((g) => g.opciones);
  const esperado = inventario().map(({ numero, nombre }) => `${numero} — ${nombre}`);
  assert.deepEqual(opciones.map((o) => o.texto), esperado);
  assert.equal(opciones[0].texto, '001 — Pedregoso – Centro');
  assert.deepEqual(opciones.slice(-2).map((o) => o.valor), ['I-062', 'I-023']);
});

test('selector: <select> nativo con <label> «Ruta» y estado inicial sin ruta', () => {
  assert.match(html, /<label for="ruta">Ruta<\/label>/);
  assert.match(html, /<select id="ruta"/);
  assert.match(html, /<option value="" disabled selected>Selecciona tu ruta<\/option>/);
  // Nunca texto libre, y nada de listas, rejillas ni tarjetas de rutas.
  assert.doesNotMatch(html, /<input[^>]+type="(text|search)"|<datalist|<ul|<ol|<table|class="[^"]*(tarjeta|card|chip)/);
});

test('sentido: control segmentado aparte, Ida (0) y Vuelta (1), operable con teclado', () => {
  assert.match(html, /<fieldset class="sentido">\s*<legend>Sentido<\/legend>/);
  const radios = [...html.matchAll(/<input type="radio" name="sentido" value="(\w+)"/g)].map((m) => m[1]);
  assert.deepEqual(radios, ['ida', 'vuelta']);
  // Botones de radio nativos: se recorren con Tab y flechas. Foco visible.
  assert.match(css, /\.segmento input:focus-visible \+ span/);
  assert.match(css, /select:focus-visible/);
});

test('áreas táctiles de al menos 44 px', () => {
  const alturas = [...css.matchAll(/min-height: (\d+)px/g)].map((m) => Number(m[1]));
  assert.ok(alturas.length >= 2);
  for (const a of alturas) assert.ok(a >= 44, `min-height ${a}px < 44px`);
});
