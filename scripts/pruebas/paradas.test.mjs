// N-08 (D-16): paradas desde OpenStreetMap, en cuarentena.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { leerCSV } from '../lib/csv.mjs';

const raiz = new URL('../../', import.meta.url).pathname;
const paradas = leerCSV(`${raiz}datos/gtfs-sjr/stops.txt`);
const meta = JSON.parse(readFileSync(`${raiz}datos/cache/overpass/paradas.meta.json`, 'utf8'));
const crudo = JSON.parse(readFileSync(`${raiz}${meta.respuesta}`, 'utf8')).elements;
const porId = new Map(crudo.map((e) => [`node/${e.id}`, e]));

test('paradas: hay paradas y cada una sale de un nodo de la respuesta guardada', () => {
  assert.ok(paradas.length > 0);
  assert.equal(paradas.length, crudo.length, 'una fila por nodo de Overpass, sin agregar ni quitar');
  assert.equal(new Set(paradas.map((p) => p.stop_id)).size, paradas.length, 'stop_id repetido');
});

test('paradas: cada una tiene identificador de OSM, fuente, fecha y la marca POR VERIFICAR EN CAMPO', () => {
  for (const p of paradas) {
    assert.match(p.osm_id, /^node\/\d+$/, p.stop_id);
    assert.equal(p.stop_id, `OSM-N${p.osm_id.slice(5)}`);
    assert.equal(p.fuente, 'OpenStreetMap (Overpass)');
    assert.equal(p.fecha, meta.consultado.slice(0, 10));
    assert.equal(p.estado, 'POR VERIFICAR EN CAMPO');
    assert.match(p.stop_desc, /POR VERIFICAR EN CAMPO/);
  }
});

test('paradas: ninguna coordenada se inventa ni se mueve (igual a la de OSM)', () => {
  for (const p of paradas) {
    const n = porId.get(p.osm_id);
    assert.ok(n, `${p.osm_id} no está en la respuesta guardada`);
    assert.equal(Number(p.stop_lat), n.lat);
    assert.equal(Number(p.stop_lon), n.lon);
    const nombre = n.tags?.name?.trim();
    if (nombre) assert.equal(p.stop_name, nombre);
    else assert.match(p.stop_name, /^Parada sin nombre en OSM/);
  }
});

test('paradas: ninguna usa las coordenadas prohibidas de scripts/reglas.mjs', () => {
  const reglas = readFileSync(`${raiz}scripts/reglas.mjs`, 'utf8');
  const prohibidas = [...reglas.matchAll(/\['(-?\d+\.\d+)', '(-?\d+\.\d+)'/g)].map((m) => [Number(m[1]), Number(m[2])]);
  assert.ok(prohibidas.length >= 4);
  for (const p of paradas) {
    for (const [lat, lon] of prohibidas) {
      const cerca = Math.abs(Number(p.stop_lat) - lat) < 1e-4 && Math.abs(Number(p.stop_lon) - lon) < 1e-4;
      assert.ok(!cerca, `${p.stop_id} cae en una coordenada prohibida`);
    }
  }
});

test('paradas: no se asignan a rutas (stops.txt no tiene columna de ruta ni orden)', () => {
  const columnas = Object.keys(paradas[0]);
  for (const c of ['route_id', 'stop_sequence', 'parent_station']) assert.ok(!columnas.includes(c), c);
});
