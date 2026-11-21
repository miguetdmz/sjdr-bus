// D-55: lógica de la tarjeta partida y de la bienvenida, sin navegador
// (docs/evidencia/d55/criterios.md). Revisa la regla, no el conteo del día
// (lección 11). Los datos salen de armarDatosApp(), no de web/public/datos, que
// no está en git (lección 5).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { armarDatosApp } from '../datos-app.mjs';
import { CLAVE_BIENVENIDA, LETRA_MAX, LETRA_MIN, elegirLetra, gruposNombre, pesoLetra } from '../../web/src/tarjetas.ts';

const rutas = armarDatosApp().rutas;
const html = readFileSync(new URL('../../web/index.html', import.meta.url), 'utf8');
const main = readFileSync(new URL('../../web/src/main.ts', import.meta.url), 'utf8');
const css = readFileSync(new URL('../../web/src/estilos.css', import.meta.url), 'utf8');

test('t6: el «–» nunca queda solo; va pegado a la palabra vecina más corta', () => {
  assert.deepEqual(gruposNombre('Pedregoso – Centro'), [
    { texto: 'Pedregoso', pegado: false },
    { texto: '– Centro', pegado: true },
  ]);
  assert.deepEqual(gruposNombre('Sur – Tequisquiapan'), [
    { texto: 'Sur –', pegado: true },
    { texto: 'Tequisquiapan', pegado: false },
  ]);
  // Empate: con la de antes (como la maqueta).
  assert.equal(gruposNombre('Uno – Dos')[0].texto, 'Uno –');
});

test('t1 y t6: con todas las rutas, el nombre no cambia y ningún «–» queda suelto', () => {
  for (const r of rutas) {
    const g = gruposNombre(r.nombre);
    assert.equal(g.map((x) => x.texto).join(' '), r.nombre, r.route_id);
    assert.ok(!g.some((x) => x.texto.trim() === '–'), `${r.route_id}: «–» solo`);
    for (const x of g.filter((y) => y.texto.includes('–'))) assert.ok(x.pegado, `${r.route_id}: «–» sin pegar`);
  }
});

test('t7: la letra es la más grande que cabe, entre 11 y 7.5 px; debajo de 9 px, delgada', () => {
  assert.equal(elegirLetra(() => true), LETRA_MAX);
  assert.equal(elegirLetra(() => false), LETRA_MIN);
  assert.equal(elegirLetra((px) => px <= 9.3), 9.25);
  // Nunca sale del rango, sin importar dónde empiece a caber.
  for (let tope = 5; tope <= 12; tope += 0.1) {
    const f = elegirLetra((px) => px <= tope);
    assert.ok(f >= LETRA_MIN && f <= LETRA_MAX, `tope ${tope}: ${f}`);
  }
  assert.equal(pesoLetra(8.75), 300);
  assert.equal(pesoLetra(9), 400);
  assert.equal(pesoLetra(11), 400);
});

test('t5: el nombre de la tarjeta partida no parte palabras (sin guiones de corte)', () => {
  const regla = css.match(/\.tarjeta-ruta\.partida \.tarjeta-nombre \{[^}]*\}/)?.[0] ?? '';
  assert.match(regla, /hyphens:\s*manual/);
  assert.match(regla, /overflow-wrap:\s*normal/);
  assert.doesNotMatch(css, /hyphens:\s*auto/);
});

test('b1: la bienvenida trae los mismos textos que la maqueta aprobada', () => {
  for (const t of [
    'Así funciona',
    '<strong>Elige tu ruta</strong> en el menú ☰ y mira dónde empieza y dónde termina.',
    '<strong>Escribe a dónde quieres ir</strong> y ve qué rutas empiezan o terminan cerca.',
    '<strong>Toca el camión</strong> de arriba para ver las paradas en el mapa.',
    '>Elegir ruta<',
    '>¿A dónde quieres ir?<',
    'Sale solo la primera vez. Se recuerda en este dispositivo, sin cookies.',
  ]) assert.ok(html.includes(t), t);
});

test('b3: la bienvenida se recuerda con localStorage, nunca con cookies', () => {
  assert.match(CLAVE_BIENVENIDA, /^sjdrbus\./);
  assert.match(main, /localStorage\.setItem\(CLAVE_BIENVENIDA/);
  assert.doesNotMatch(main, /document\.cookie/);
  assert.doesNotMatch(html, /document\.cookie/);
});
