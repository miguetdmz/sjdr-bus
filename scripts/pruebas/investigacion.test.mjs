// Lote de investigación (D-22): I-01 catálogo, I-02 matriz, I-03 Pareto.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { leerCSV } from '../lib/csv.mjs';

const raiz = new URL('../../', import.meta.url).pathname;
const leer = (r) => readFileSync(`${raiz}${r}`, 'utf8');
const { fuentes } = JSON.parse(leer('datos/investigacion/fuentes.json'));
const matriz = leerCSV(`${raiz}datos/investigacion/matriz.csv`);
const pet = leerCSV(`${raiz}datos/investigacion/pet-2022-sjr-urbano.csv`);
const rutas = leerCSV(`${raiz}datos/gtfs-sjr/routes.txt`);
const reporte = leer('docs/investigacion/pareto-cobertura.md');

test('I-01: cada fuente tiene URL, fechas, tipo, cobertura y si es oficial', () => {
  for (const f of fuentes) {
    assert.ok(f.id && f.titulo, JSON.stringify(f));
    assert.ok(f.url === null ? /no publicado/.test(f.publicado) : /^https:\/\//.test(f.url), `${f.id}: URL`);
    assert.match(f.consultado, /^\d{4}-\d{2}-\d{2}/, `${f.id}: fecha de consulta`);
    assert.ok(f.publicado, `${f.id}: fecha de publicación (o [sin verificar])`);
    assert.equal(typeof f.oficial, 'boolean', `${f.id}: oficial`);
    assert.ok(Array.isArray(f.tipo) && f.cubre, `${f.id}: tipo y cobertura`);
  }
  assert.ok(!fuentes.some((f) => /moovit/i.test(f.id)), 'Moovit va aparte, nunca como fuente abierta (D-22)');
});

test('I-01: la tabla del PET 2022 tiene 41 renglones y la 1 coincide con la pág. 21740', () => {
  assert.equal(pet.length, 41);
  const r1 = pet[0];
  assert.deepEqual([r1.ruta, r1.vehiculos, r1.ida_km, r1.regreso_km, r1.ida_min, r1.regreso_min, r1.pagina], ['1', '8', '6.84', '5.79', '25', '18', '21740']);
});

test('I-02: 40 rutas × 2 sentidos, en el orden de routes.txt', () => {
  assert.equal(matriz.length, 80);
  rutas.forEach((r, i) => {
    assert.equal(matriz[2 * i].route_id, r.route_id);
    assert.deepEqual([matriz[2 * i].sentido, matriz[2 * i + 1].sentido], ['0', '1']);
  });
});

test('I-02: el nivel de confianza se puede recalcular desde las celdas', () => {
  for (const f of matriz) {
    const esperado = f.pet_2022 || f.sombra_2025 ? 'media' : 'baja';
    assert.equal(f.confianza, esperado, `${f.route_id} sentido ${f.sentido}`);
  }
});

test('I-02: ningún sentido hereda los datos del otro (regla 10)', () => {
  for (const f of matriz.filter((m) => m.pet_2022)) {
    const p = pet.find((x) => f.motivo.includes(`pág. ${x.pagina}`) && x.vehiculos === f.vehiculos_oficial && (f.sentido === '0' ? x.ida_km : x.regreso_km) === f.km_oficial);
    assert.ok(p, `${f.route_id} sentido ${f.sentido}: km de su propio sentido`);
    assert.equal(f.min_oficial, f.sentido === '0' ? p.ida_min : p.regreso_min);
  }
});

test('I-03: el reporte cuadra con la matriz', () => {
  for (const c of ['alta', 'media', 'baja']) {
    const n = matriz.filter((f) => f.confianza === c).length;
    assert.match(reporte, new RegExp(`\\*\\*${c[0].toUpperCase()}${c.slice(1)}\\*\\* \\([^)]*\\): ${n}\\.`));
  }
  assert.match(reporte, /D-06\): 001 .*002 .*005 .*012 .*040 /);
});

test('I-04: la matriz incluye las relaciones de OSM sin subir la confianza ni elegir sentido', () => {
  const meta = JSON.parse(leer('datos/cache/overpass/rutas.meta.json'));
  assert.equal(meta.peticiones, 1, 'una sola consulta');
  assert.match(meta.consultado, /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}-06:00$/);
  const rels = JSON.parse(leer(meta.respuesta)).elements.filter((e) => e.type === 'relation').map((e) => `rel/${e.id}`);
  const enMatriz = new Set(matriz.flatMap((f) => f.osm_relacion.match(/rel\/\d+/g) ?? []));
  assert.ok(enMatriz.size > 0, 'la matriz trae relaciones de OSM');
  for (const r of enMatriz) assert.ok(rels.includes(r), `${r} no está en la caché`);
  for (let i = 0; i < matriz.length; i += 2) assert.equal(matriz[i].osm_relacion, matriz[i + 1].osm_relacion, `${matriz[i].route_id}: OSM no distingue sentido`);
  assert.ok(fuentes.some((f) => f.id === 'osm-relaciones-bus' && f.oficial === false), 'anotada en I-01, no oficial');
});
