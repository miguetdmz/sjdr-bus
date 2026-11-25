// R-02 (D-24): extremos de cada ruta con coordenada, fuente y estado.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { REFERENCIA } from '../lib/referencia.mjs';
import { readFileSync, readdirSync } from 'node:fs';
import { leerCSV } from '../lib/csv.mjs';
import { tablaDeSeccion } from '../lib/handoff.mjs';

const raiz = new URL('../../', import.meta.url).pathname;
const ext = JSON.parse(readFileSync(`${raiz}datos/investigacion/extremos.json`, 'utf8'));
const rutas = leerCSV(`${raiz}datos/gtfs-sjr/routes.txt`);
const verificadas = tablaDeSeccion('### 11.3').map(([lugar, lat, lon]) => ({ lugar, lat, lon }));
const cacheDir = `${raiz}datos/cache/nominatim/`;
const caches = readdirSync(cacheDir).map((f) => JSON.parse(readFileSync(cacheDir + f, 'utf8')));
const PROHIBIDAS = [['20.70044', '-99.81309'], ['20.39020', '-100.00150'], ['20.37650', '-99.93850'], ['20.38300', '-100.01000']];

test('R-02: las 42 rutas de la referencia (D-70) en orden y cada extremo tiene su ficha de lugar', () => {
  assert.equal(ext.rutas.length, REFERENCIA.length);
  rutas.forEach((r, i) => assert.equal(ext.rutas[i].route_id, r.route_id));
  const lugares = new Set(ext.lugares.map((l) => l.lugar));
  for (const r of ext.rutas) for (const l of [r.origen, r.destino]) assert.ok(lugares.has(l), `${r.route_id}: «${l}»`);
});

test('R-02: toda coordenada tiene fuente y se puede rastrear tal cual (nada corregido a ojo)', () => {
  for (const l of ext.lugares) {
    if (l.lat === null) {
      assert.match(l.estado, /SIN COORDENADA · POR VERIFICAR/, l.lugar);
      assert.ok(l.motivo, `${l.lugar}: sin motivo`);
      continue;
    }
    assert.ok(l.fuente, `${l.lugar}: sin fuente`);
    if (/HANDOFF §11\.3/.test(l.fuente)) {
      assert.ok(verificadas.some((v) => v.lat === l.lat && v.lon === l.lon), `${l.lugar}: no coincide con §11.3`);
    } else {
      const [, tipo, id] = l.fuente.match(/(node|way|relation)\/(\d+)/);
      const hallado = caches.flatMap((c) => c.respuesta).find((r) => r.osm_type === tipo && String(r.osm_id) === id);
      assert.ok(hallado, `${l.lugar}: ${tipo}/${id} no está en la caché`);
      assert.deepEqual([hallado.lat, hallado.lon], [l.lat, l.lon], `${l.lugar}: coordenada alterada`);
      assert.match(l.estado, /POR VERIFICAR/, `${l.lugar}: lo nuevo entra POR VERIFICAR`);
      assert.match(l.tipo_osm, /^(place|boundary)\//, `${l.lugar}: una colonia o localidad no se toma de un parque, mercado o calle`);
    }
  }
});

test('R-02: ninguna coordenada prohibida y todo dentro del municipio', () => {
  const texto = JSON.stringify(ext);
  for (const [lat, lon] of PROHIBIDAS) assert.ok(!(texto.includes(lat) && texto.includes(lon)), `coordenada prohibida ${lat}, ${lon}`);
  for (const l of ext.lugares.filter((x) => x.lat !== null && x.lugar !== 'Tequisquiapan')) {
    const [lat, lon] = [Number(l.lat), Number(l.lon)];
    assert.ok(lat >= 20.25 && lat <= 20.5 && lon >= -100.15 && lon <= -99.85, `${l.lugar}: fuera del municipio`);
  }
});

test('R-02: cada consulta a Nominatim está guardada una sola vez, con fecha', () => {
  const consultas = caches.map((c) => c.consulta);
  assert.equal(new Set(consultas).size, consultas.length, 'consulta repetida');
  for (const c of caches) assert.match(c.consultado, /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}-06:00$/, c.consulta);
});

test('R-02: «Centro» es punto de referencia de zona, no terminal', () => {
  const centro = ext.lugares.find((l) => l.lugar === 'Centro');
  assert.match(centro.estado, /REFERENCIA DE ZONA/);
});
