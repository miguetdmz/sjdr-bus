// M-06: lugar reservado de «Calcula tu ruta» (D-15). Solo un aviso: no hay campos
// de origen y destino ni ningún cálculo. La primera pantalla («Rutas») no cambia.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { avisoCalcula, NO_DISPONIBLE } from '../../web/src/calcula.ts';

const leer = (r) => readFileSync(new URL(`../../web/${r}`, import.meta.url), 'utf8');
const html = leer('index.html');
const main = leer('src/main.ts');
const calcula = leer('src/calcula.ts');

test('calcula: dos pestañas, «Rutas» activa al cargar', () => {
  assert.match(html, /<nav class="pestanas"[^>]*aria-label=/);
  assert.match(html, /id="pestana-rutas" class="activo" aria-pressed="true"[^>]*>Rutas</);
  assert.match(html, /id="pestana-calcula" aria-pressed="false"[^>]*>Calcula tu ruta</);
  assert.match(html, /<section id="modo-calcula"[^>]* hidden><\/section>/);
  // El selector y el sentido siguen en la primera pantalla, una sola vez: desde
  // D-48 viven en la barra de arriba, fuera del menú (prueba en app.test.mjs).
  const barra = html.slice(html.indexOf('id="barra"'), html.indexOf('</header>'));
  assert.match(barra, /id="ruta"/);
  assert.match(barra, /name="sentido"/);
  assert.equal((html.match(/id="ruta"/g) ?? []).length, 1);
});

test('calcula: el aviso dice qué hará, que no está disponible y qué dato falta', () => {
  const a = avisoCalcula();
  assert.equal(a.estado, NO_DISPONIBLE);
  const datos = a.parrafos.map((p) => p.dato);
  assert.ok(datos.includes('Qué hará'));
  assert.ok(datos.includes('Qué dato falta'));
  const falta = a.parrafos.find((p) => p.dato === 'Qué dato falta').texto;
  assert.match(falta, /paradas de cada ruta, en orden y por sentido/);
});

test('calcula: sin campos de origen y destino, sin cálculo y sin cifras', () => {
  const seccion = html.slice(html.indexOf('id="modo-calcula"'), html.indexOf('</section>', html.indexOf('id="modo-calcula"')));
  assert.doesNotMatch(seccion, /<input|<select|<textarea/);
  assert.doesNotMatch(calcula, /createElement\('(input|select|textarea)'\)|<input/);
  const bloque = main.slice(main.indexOf('function llenarCalcula'), main.indexOf('function ponerModo'));
  assert.doesNotMatch(bloque, /createElement\('(input|select|textarea|form)'\)/);
  // Ninguna cifra, ningún tiempo y ninguna ruta propuesta en el aviso.
  const texto = JSON.stringify(avisoCalcula());
  assert.doesNotMatch(texto, /\d/);
  assert.doesNotMatch(texto, /\bmin\b|en vivo/i);
});
