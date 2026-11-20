// M-05: paradas de OpenStreetMap en el mapa. Mismo número de puntos que filas de
// stops.txt, cada una con la marca POR VERIFICAR EN CAMPO, y ninguna ligada a una ruta.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { leerCSV } from '../lib/csv.mjs';
import { armarParadasApp } from '../datos-app.mjs';
import { fichaParada, fechaLegible, MARCA_POR_VERIFICAR, FUENTE_OSM, SIN_NOMBRE } from '../../web/src/paradas.ts';

const stops = leerCSV(new URL('../../datos/gtfs-sjr/stops.txt', import.meta.url).pathname);
const { paradas } = armarParadasApp();
const main = readFileSync(new URL('../../web/src/main.ts', import.meta.url), 'utf8');

test('paradas de la app: tantas como filas de stops.txt, con la misma coordenada', () => {
  assert.ok(stops.length > 0);
  assert.equal(paradas.length, stops.length);
  paradas.forEach((p, i) => {
    assert.equal(p.stop_id, stops[i].stop_id);
    assert.equal(p.lat, Number(stops[i].stop_lat), `${p.stop_id}: no se mueve ninguna coordenada`);
    assert.equal(p.lon, Number(stops[i].stop_lon), `${p.stop_id}: no se mueve ninguna coordenada`);
    assert.ok(p.osm_id && p.fuente && p.fecha, `${p.stop_id}: identificador de OSM, fuente y fecha`);
  });
});

test('paradas de la app: cada punto muestra fuente, fecha y la marca POR VERIFICAR EN CAMPO', () => {
  for (const p of paradas) {
    assert.equal(p.estado, MARCA_POR_VERIFICAR, p.stop_id);
    const f = fichaParada(p);
    assert.ok(f.lineas.includes(FUENTE_OSM), p.stop_id);
    assert.ok(f.lineas.includes(MARCA_POR_VERIFICAR), p.stop_id);
    assert.ok(f.lineas.some((l) => l.includes(fechaLegible(p.fecha))), p.stop_id);
  }
  assert.equal(fechaLegible('2026-11-18'), '18 nov 2026');
});

test('paradas de la app: el nombre solo se muestra si OSM lo trae', () => {
  for (const [p, s] of paradas.map((p, i) => [p, stops[i]])) {
    if (s.stop_name.startsWith('Parada sin nombre en OSM')) {
      assert.equal(p.nombre, null, p.stop_id);
      assert.equal(fichaParada(p).nombre, SIN_NOMBRE);
    } else {
      assert.equal(p.nombre, s.stop_name, p.stop_id);
    }
  }
});

test('paradas de la app: ninguna parada se asigna a una ruta', () => {
  for (const p of paradas) {
    for (const campo of Object.keys(p)) assert.doesNotMatch(campo, /route|ruta|trip|viaje|sentido|orden|sequence/i, `${p.stop_id}.${campo}`);
  }
  // En la app, la capa de paradas no depende de la ruta elegida.
  const dibujo = main.slice(main.indexOf('function dibujarParadas'), main.indexOf('// Control para mostrar'));
  assert.doesNotMatch(dibujo, /estado\.ruta|selector/);
});

test('paradas de la app: hay un control para mostrar u ocultar la capa', () => {
  assert.match(main, /control-paradas/);
  assert.match(main, /aria-pressed/);
  assert.match(main, /capaParadas\.remove\(\)/);
});
