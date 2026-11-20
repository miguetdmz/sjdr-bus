// R-01 (D-24, D-25): calles oficiales por ruta desde la página pública de rutas.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { leerCSV } from '../lib/csv.mjs';

const raiz = new URL('../../', import.meta.url).pathname;
const leer = (r) => readFileSync(`${raiz}${r}`, 'utf8');
const rutas = leerCSV(`${raiz}datos/gtfs-sjr/routes.txt`);
const meta = JSON.parse(leer('datos/cache/qrobus/rutas.meta.json'));
const cache = JSON.parse(leer('datos/cache/qrobus/rutas-sjr.json'));
const calles = JSON.parse(leer('datos/investigacion/calles-oficiales.json'));
const porId = new Map(calles.rutas.map((r) => [r.route_id, r]));

test('R-01: una sola descarga, con fecha y huella; la página completa no entra a git', () => {
  assert.equal(meta.url, 'https://qrobus.gob.mx/Rutas');
  assert.match(meta.consultado, /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}-06:00$/, 'hora de México');
  assert.match(meta.sha256, /^[0-9a-f]{64}$/);
  assert.equal(meta.renglones_guardados, 42);
  assert.match(meta.pagina_completa, /^referencias\//, 'la página con llave de sesión se queda fuera de git');
  const texto = leer('datos/cache/qrobus/rutas-sjr.json');
  assert.doesNotMatch(texto, /csrf|_token|<meta/i, 'la caché no trae la llave de sesión');
});

test('R-01: no se llamaron las consultas internas del mapa (D-25)', () => {
  for (const f of ['datos/cache/qrobus/rutas.meta.json', 'datos/cache/qrobus/rutas-sjr.json', 'datos/investigacion/calles-oficiales.json', 'scripts/calles-oficiales.mjs']) {
    assert.doesNotMatch(leer(f).replace(/sin llamar consultas internas/g, ''), /rutaMostrar|paradasTimeline/, f);
  }
});

test('R-01: 39 rutas en el orden de routes.txt, cada una con su lista o «sin lista»', () => {
  assert.equal(calles.rutas.length, 39);
  rutas.forEach((r, i) => assert.equal(calles.rutas[i].route_id, r.route_id));
  for (const r of calles.rutas) {
    assert.ok(['con lista', 'sin lista'].includes(r.estado), r.route_id);
    assert.equal(r.estado === 'con lista', Boolean(r.lista_texto), r.route_id);
    assert.match(r.fuente, /qrobus\.gob\.mx\/Rutas.*consulta \d{4}-\d{2}-\d{2}/, `${r.route_id}: fuente`);
    assert.equal(r.fecha, meta.consultado.slice(0, 10), `${r.route_id}: fecha`);
    assert.match(r.estado_dato, /ESTIMADO/, `${r.route_id}: no se presenta como verificado`);
  }
});

test('R-01: cada lista es copia exacta de la página y el nombre coincide con el inventario', () => {
  for (const r of calles.rutas) {
    const c = cache.find((f) => f.route_id === r.route_id);
    assert.equal(c.data_ruta, r.numero, r.route_id);
    if (r.lista_texto) assert.ok(c.data_buscar.includes(r.lista_texto), `${r.route_id}: el texto no se alteró`);
    assert.ok(r.nombre_coincide, `${r.route_id}: «${r.nombre_inventario}» vs «${r.nombre_pagina}»`);
  }
});

test('R-01: las listas con calles de Querétaro quedan marcadas y no se usan sin revisión', () => {
  for (const r of calles.rutas) {
    assert.equal(r.usable_sin_revision, r.calles_de_queretaro.length === 0, r.route_id);
    assert.equal(Boolean(r.marca), !r.usable_sin_revision, r.route_id);
    if (r.lista_texto && /BERNARDO QUINTANA/i.test(r.lista_texto)) assert.equal(r.usable_sin_revision, false, `${r.route_id}: Bernardo Quintana`);
  }
  // «Manantiales de Tlacote» es calle de San Juan: no debe marcar la 042 ni la 046.
  for (const id of ['U-042', 'U-046']) assert.ok(porId.get(id).usable_sin_revision, `${id}: falso positivo de Tlacote`);
  assert.equal(calles.resumen.marcadas_revisar, calles.rutas.filter((r) => !r.usable_sin_revision).length);
});

test('R-01: la lista no asigna sentido (regla 10)', () => {
  for (const r of calles.rutas) assert.match(r.sentido, /^no indicado/, r.route_id);
});
