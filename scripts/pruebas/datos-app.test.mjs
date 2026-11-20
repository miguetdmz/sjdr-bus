// M-02: los datos de la app salen de routes.txt y de las fichas, sin cifras nuevas.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { leerCSV } from '../lib/csv.mjs';
import { armarDatosApp } from '../datos-app.mjs';

const routes = leerCSV(new URL('../../datos/gtfs-sjr/routes.txt', import.meta.url).pathname);
const fichas = JSON.parse(readFileSync(new URL('../../datos/fichas/rutas.json', import.meta.url), 'utf8'));
const datos = armarDatosApp();

test('datos de la app: 39 rutas en el orden de routes.txt, con número y nombre', () => {
  assert.equal(datos.rutas.length, 39);
  datos.rutas.forEach((r, i) => {
    assert.equal(r.route_id, routes[i].route_id, `fila ${i + 1}`);
    assert.equal(r.numero, routes[i].route_short_name, `fila ${i + 1}`);
    assert.equal(r.nombre, routes[i].route_long_name, `fila ${i + 1}`);
  });
  assert.equal(datos.rutas.filter((r) => r.tipo === 'urbana').length, 37);
  assert.equal(datos.rutas.filter((r) => r.tipo === 'intermunicipal').length, 2);
});

test('datos de la app: 10 verificadas y 29 de solo inventario', () => {
  assert.equal(datos.rutas.filter((r) => r.grupo === 'verificada').length, 10);
  assert.equal(datos.rutas.filter((r) => r.grupo === 'solo-inventario').length, 29);
});

test('datos de la app: ninguna cifra que no esté en las fichas', () => {
  for (const r of datos.rutas) {
    const f = fichas.rutas.find((x) => x.route_id === r.route_id);
    assert.equal(r.grupo, f.grupo);
    assert.equal(r.nivel, f.nivel_precision);
    assert.equal(r.fuente, f.fuente);
    assert.equal(r.fecha, f.fecha);
    if (r.grupo === 'verificada') {
      assert.deepEqual(r.sentidos, { ida: f.sentidos.ida, vuelta: f.sentidos.vuelta }, r.route_id);
    } else {
      assert.equal(r.sentidos, undefined, `${r.route_id} no debe traer cifras`);
    }
    // Sin frecuencia, tiempos calculados ni trazos.
    const texto = JSON.stringify(r);
    assert.doesNotMatch(texto, /frecuencia|shape|trazo"|estimado/i, r.route_id);
  }
});

test('datos de la app: la 001 vuelta conserva 23 paradas / 16 min', () => {
  const r = datos.rutas.find((x) => x.route_id === 'U-001');
  assert.equal(r.sentidos.vuelta.paradas, 23);
  assert.equal(r.sentidos.vuelta.duracion_min, 16);
  assert.equal(r.sentidos.ida.paradas, 29);
});
