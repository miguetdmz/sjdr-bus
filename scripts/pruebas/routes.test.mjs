// N-01: routes.txt contiene exactamente las 42 rutas de HANDOFF §4, en ese orden,
// con los textos exactos y las claves de D-08.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { leerCSV } from '../lib/csv.mjs';
import { inventario } from '../lib/handoff.mjs';

const rutas = leerCSV(new URL('../../datos/gtfs-sjr/routes.txt', import.meta.url).pathname);
const fuente = inventario();

test('routes.txt: 42 rutas, 40 urbanas y 2 intermunicipales', () => {
  assert.equal(fuente.length, 42, 'HANDOFF §4 debía tener 42 filas');
  assert.equal(rutas.length, 42);
  assert.equal(rutas.filter((r) => r.route_id.startsWith('U-')).length, 40);
  assert.equal(rutas.filter((r) => r.route_id.startsWith('I-')).length, 2);
});

test('routes.txt: mismo orden y mismos textos que HANDOFF §4; claves según D-08', () => {
  fuente.forEach(({ numero, nombre, tipo }, i) => {
    const r = rutas[i];
    const prefijo = { Urbana: 'U', Intermunicipal: 'I' }[tipo];
    assert.ok(prefijo, `tipo desconocido en §4: «${tipo}»`);
    assert.equal(r.route_id, `${prefijo}-${numero}`, `fila ${i + 1}`);
    assert.equal(r.route_short_name, numero, `fila ${i + 1}`);
    assert.equal(r.route_long_name, nombre, `fila ${i + 1}`);
    // D-19: las intermunicipales (062 y 023) llevan su propia agencia, por verificar.
    assert.equal(r.agency_id, tipo === 'Intermunicipal' ? 'SJR-INTER' : 'SJR-CONC', `fila ${i + 1}`);
    assert.equal(r.route_type, '3', `fila ${i + 1} (3 = autobús)`);
  });
});

test('routes.txt: ningún route_id repetido; la 23 urbana y la 023 intermunicipal no chocan', () => {
  const ids = rutas.map((r) => r.route_id);
  assert.equal(new Set(ids).size, ids.length);
  assert.deepEqual(
    rutas.filter((r) => ['23', '023'].includes(r.route_short_name)).map((r) => r.route_id),
    ['U-23', 'I-023'],
  );
  assert.deepEqual(ids.slice(0, 2), ['U-001', 'U-002']);
  assert.deepEqual(ids.slice(-2), ['I-062', 'I-023']);
});
