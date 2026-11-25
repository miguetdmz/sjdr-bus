// D-70 (Miguel, 25 nov 2026, 1:01 am): las rutas de San Juan que lista qrobus.gob.mx/Rutas
// son la referencia del inventario (deshace las bajas de D-36, D-39 y D-40). Si una ruta de
// la referencia falta o sobra en el inventario o en un dato derivado, la prueba falla y la
// nombra (poka-yoke contra la lista patrón).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import * as handoff from '../lib/handoff.mjs';
import { leerCSV } from '../lib/csv.mjs';
import { REFERENCIA } from '../lib/referencia.mjs';

const { inventario } = handoff;
const raiz = new URL('../../', import.meta.url).pathname;
const leer = (r) => readFileSync(`${raiz}${r}`, 'utf8');
const diferencias = (lista) => ({
  faltan: REFERENCIA.filter((n) => !lista.includes(n)),
  sobran: lista.filter((n) => !REFERENCIA.includes(n)),
});
const VUELVEN = ['018', '024C', '031'];

test('D-70: la referencia son las 42 rutas de San Juan de la página oficial, sin repetidas', () => {
  assert.equal(new Set(REFERENCIA).size, REFERENCIA.length);
  assert.equal(REFERENCIA.length, 42, 'la página del 19 nov (revisada el 25 nov) lista 42 de San Juan');
  for (const n of VUELVEN) assert.ok(REFERENCIA.includes(n), n);
});

test('D-70: el inventario y routes.txt traen exactamente las rutas de la referencia', () => {
  assert.deepEqual(diferencias(inventario().map((r) => r.numero)), { faltan: [], sobran: [] }, 'inventario');
  const routes = leerCSV(`${raiz}datos/gtfs-sjr/routes.txt`).map((r) => r.route_short_name);
  assert.deepEqual(diferencias(routes), { faltan: [], sobran: [] }, 'routes.txt');
  assert.equal(new Set(routes).size, routes.length, 'routes.txt sin números repetidos');
});

test('D-70: no queda lista de bajas', () => {
  assert.equal('RUTAS_DADAS_DE_BAJA' in handoff, false);
});

test('D-70: cada dato derivado trae todas las rutas de routes.txt', () => {
  const ids = leerCSV(`${raiz}datos/gtfs-sjr/routes.txt`).map((r) => r.route_id);
  // web/public/datos/rutas.json no está en git (lo arma datos-app): se revisa solo si existe (lección 5).
  const archivos = ['datos/fichas/rutas.json', 'datos/investigacion/calles-oficiales.json', 'datos/investigacion/extremos.json', 'web/public/datos/rutas.json'].filter((x) => existsSync(`${raiz}${x}`));
  for (const f of archivos) {
    const rutas = JSON.parse(leer(f)).rutas.map((r) => r.route_id);
    assert.deepEqual(rutas, ids, f);
  }
  const matriz = leer('datos/investigacion/matriz.csv');
  for (const id of ids) assert.match(matriz, new RegExp(`^${id},`, 'm'), `matriz.csv: ${id}`);
});

test('D-70: los extremos de las rutas que vuelven no traen el «rechazado» de la baja y no tienen punto supuesto', () => {
  const decisiones = JSON.parse(leer('datos/investigacion/extremos-decisiones.json')).decisiones;
  const finales = JSON.parse(leer('datos/investigacion/extremos-finales.json')).lugares;
  for (const lugar of ['Nuevo San Isidro', 'Las Torres', 'PITSA']) {
    assert.notEqual(decisiones[lugar]?.estado, 'rechazado', lugar);
    const l = finales.find((x) => x.lugar === lugar);
    assert.ok(l, `${lugar} en extremos-finales`);
    // Sin punto confirmado, FALTANTE (D-41); nunca un punto sin fuente.
    if (l.lat === null) assert.match(l.estado, /^FALTANTE \(D-41\)/, lugar);
    else assert.ok(l.fuente, `${lugar}: punto sin fuente`);
  }
});

test('D-37: la ruta 036 se llama «Visthá – 5 de Mayo», sin «(CERESO)»', () => {
  const routes = leer('datos/gtfs-sjr/routes.txt');
  assert.match(routes, /^U-036,SJR-CONC,036,Visthá – 5 de Mayo,3$/m);
  assert.doesNotMatch(routes, /CERESO/);
});

test('D-40: la 044 «Valle Dorado II – Centro» sigue (Miguel confirmó que existe)', () => {
  assert.ok(inventario().some((r) => r.numero === '044'));
  assert.match(leer('datos/gtfs-sjr/routes.txt'), /^U-044,SJR-CONC,044,Valle Dorado II – Centro,3$/m);
});
