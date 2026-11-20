// D-36 (Miguel, 19 nov 2026): las rutas 031 y 044 ya no existen. Si reaparecen en
// algún dato derivado o en la lista de bajas, la prueba falla (como un poka-yoke).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { inventario, numerosSoloInventario, RUTAS_DADAS_DE_BAJA } from '../lib/handoff.mjs';

const raiz = new URL('../../', import.meta.url).pathname;
const leer = (r) => readFileSync(`${raiz}${r}`, 'utf8');
const BAJAS = ['018', '024C', '031'];

test('D-36, D-39 y D-40: la lista de bajas es exactamente 018, 024C y 031, cada una con su decisión', () => {
  assert.deepEqual(Object.keys(RUTAS_DADAS_DE_BAJA).sort(), BAJAS);
  for (const n of BAJAS) assert.match(RUTAS_DADAS_DE_BAJA[n], ({ '018': /^D-40/, '024C': /^D-39/, '031': /^D-36/ })[n]);
});

test('D-36, D-39 y D-40: 018, 024C y 031 no reaparecen en el inventario ni en ningún dato derivado', () => {
  assert.equal(inventario().length, 39);
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
    assert.doesNotMatch(leer(f), /PITSA|Las Torres|Nuevo San Isidro/, f);
  }
});

test('D-37: la ruta 036 se llama «Visthá – 5 de Mayo», sin «(CERESO)»', () => {
  const routes = readFileSync(new URL('../../datos/gtfs-sjr/routes.txt', import.meta.url), 'utf8');
  assert.match(routes, /^U-036,SJR-CONC,036,Visthá – 5 de Mayo,3$/m);
  assert.doesNotMatch(routes, /CERESO/);
});

test('D-40: la 044 «Valle Dorado II – Centro» volvió (Miguel confirmó que existe)', () => {
  assert.ok(inventario().some((r) => r.numero === '044'));
  assert.match(leer('datos/gtfs-sjr/routes.txt'), /^U-044,SJR-CONC,044,Valle Dorado II – Centro,3$/m);
});
