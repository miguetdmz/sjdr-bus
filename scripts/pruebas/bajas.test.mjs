// D-36 (Miguel, 19 nov 2026): las rutas 031 y 044 ya no existen. Si reaparecen en
// algún dato derivado o en la lista de bajas, la prueba falla (como un poka-yoke).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { inventario, numerosSoloInventario, RUTAS_DADAS_DE_BAJA } from '../lib/handoff.mjs';

const raiz = new URL('../../', import.meta.url).pathname;
const leer = (r) => readFileSync(`${raiz}${r}`, 'utf8');
const BAJAS = ['031', '044'];

test('D-36: la lista de bajas es exactamente 031 y 044, cada una con su decisión', () => {
  assert.deepEqual(Object.keys(RUTAS_DADAS_DE_BAJA).sort(), BAJAS);
  for (const n of BAJAS) assert.match(RUTAS_DADAS_DE_BAJA[n], /^D-36/);
});

test('D-36: 031 y 044 no reaparecen en el inventario ni en ningún dato derivado', () => {
  assert.equal(inventario().length, 40);
  for (const n of BAJAS) {
    assert.ok(!inventario().some((r) => r.numero === n), `inventario: ${n}`);
    assert.ok(!numerosSoloInventario().some((r) => r.numero === n), `solo inventario: ${n}`);
  }
  const ids = BAJAS.map((n) => `U-${n}`);
  for (const id of ids) {
    assert.doesNotMatch(leer('datos/gtfs-sjr/routes.txt'), new RegExp(`^${id},`, 'm'), `routes.txt: ${id}`);
    for (const f of ['datos/fichas/rutas.json', 'datos/investigacion/matriz.csv', 'datos/investigacion/calles-oficiales.json', 'datos/investigacion/extremos.json', 'web/public/datos/rutas.json']) {
      assert.ok(!leer(f).includes(`"${id}"`) && !new RegExp(`^${id},`, 'm').test(leer(f)), `${f}: ${id}`);
    }
  }
  for (const f of ['datos/investigacion/extremos.json', 'datos/investigacion/extremos-propuestas.json']) {
    assert.doesNotMatch(leer(f), /PITSA|Valle Dorado II/, f);
  }
});
