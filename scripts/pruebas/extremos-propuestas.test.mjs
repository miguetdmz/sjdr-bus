// R-03 (D-34): lugares de OSM y propuestas de extremos (Miguel confirma después).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { armar, MUNICIPIO } from '../proponer-extremos.mjs';

const raiz = new URL('../../', import.meta.url).pathname;
const leer = (r) => readFileSync(`${raiz}${r}`, 'utf8');
const lugaresOsm = JSON.parse(leer('datos/cache/overpass/lugares.json'));
const prop = JSON.parse(leer('datos/investigacion/extremos-propuestas.json'));
const ext = JSON.parse(leer('datos/investigacion/extremos.json'));
const HUELLA = '4a52d85b51f0468f982ed4545b502ea79d31e452085626f51c86545efa9aa5d7';

test('lugares.json declara la huella de la consulta y trae el esquema pedido', () => {
  assert.equal(lugaresOsm.fuente.sha256_respuesta, HUELLA);
  assert.equal(lugaresOsm.fuente.consultado, '2026-11-19T15:16:47-06:00');
  assert.match(lugaresOsm.fuente.licencia, /ODbL/);
  assert.equal(lugaresOsm.resumen.lugares, lugaresOsm.lugares.length);
  for (const l of lugaresOsm.lugares) {
    assert.match(l.osm, /^(node|way|relation)\/\d+$/);
    assert.ok(l.nombre);
    assert.equal(l.centro.length, 2);
    for (const n of l.centro) assert.ok(Number(n.toFixed(5)) === n, `${l.osm} a 5 decimales`);
  }
  assert.doesNotMatch(leer('datos/cache/overpass/lugares.json'), /csrf|_token/i);
});

test('si existe la respuesta completa (fuera de git), coincide con la huella', { skip: !existsSync(`${raiz}referencias/overpass-2026-11-19/lugares-respuesta.json`) }, () => {
  const h = createHash('sha256').update(readFileSync(`${raiz}referencias/overpass-2026-11-19/lugares-respuesta.json`)).digest('hex');
  assert.equal(h, HUELLA);
});

test('propuestas: están exactamente los 27 lugares sin coordenada (28 menos el duplicado de La Rueda, D-35)', () => {
  const sin = ext.lugares.filter((l) => l.lat === null).map((l) => l.lugar).sort();
  assert.equal(sin.length, 27);
  assert.deepEqual(prop.lugares.map((l) => l.nombre).sort(), sin);
  assert.equal(prop.resumen.lugares, 27);
  assert.equal(prop.resumen.con_candidato + prop.resumen.sin_candidato, 27);
});

test('propuestas: el archivo coincide con lo que genera el programa (segunda corrida idempotente)', () => {
  assert.deepEqual(armar(), prop);
});

test('propuestas: candidatos reales de lugares.json, máximo 3, dentro del municipio', () => {
  const porId = new Map(lugaresOsm.lugares.map((l) => [l.osm, l]));
  for (const l of prop.lugares) {
    assert.ok(l.candidatos.length <= 3, l.nombre);
    for (const c of l.candidatos) {
      const o = porId.get(c.osm);
      assert.ok(o, `${l.nombre}: ${c.osm} no está en lugares.json`);
      assert.deepEqual(c.centro, o.centro, `${l.nombre}: coordenada igual a la de OSM, sin corregir`);
      assert.ok(c.centro[0] >= MUNICIPIO.sur && c.centro[0] <= MUNICIPIO.norte && c.centro[1] >= MUNICIPIO.oeste && c.centro[1] <= MUNICIPIO.este, `${l.nombre} fuera del municipio`);
      assert.ok(c.razon && c.puntaje >= 40 && c.puntaje <= 100, l.nombre);
    }
    if (!l.candidatos.length) assert.ok(l.nota, `${l.nombre}: sin candidato debe decirlo`);
  }
});

test('propuestas: Ezequiel Montes queda fuera del municipio, sin candidato; Bridge no se propone', () => {
  const em = prop.lugares.find((l) => l.nombre === 'Ezequiel Montes');
  assert.equal(em.candidatos.length, 0);
  assert.match(em.nota, /fuera del municipio/);
  const ut = prop.lugares.find((l) => l.nombre.includes('UTSJR'));
  assert.ok(!ut.candidatos.some((c) => /Bridge/.test(c.nombre)));
  assert.ok(ut.descartados.some((d) => d.osm === 'node/10791340913'));
});

test('propuestas: ninguna coordenada prohibida de la lección 4', () => {
  const reglas = leer('scripts/reglas.mjs');
  const prohibidas = [...reglas.matchAll(/\['(-?\d+\.\d+)', '(-?\d+\.\d+)'/g)].map((m) => [m[1], m[2]]);
  assert.ok(prohibidas.length >= 1, 'se leyeron las coordenadas prohibidas');
  for (const f of ['datos/investigacion/extremos-propuestas.json', 'datos/cache/overpass/lugares.json']) {
    const t = leer(f);
    for (const [lat, lon] of prohibidas) assert.ok(!(t.includes(lat) && t.includes(lon)), `${f} trae ${lat}, ${lon}`);
  }
  for (const l of prop.lugares) for (const c of l.candidatos) {
    for (const [lat, lon] of prohibidas) assert.ok(!(String(c.centro[0]) === lat && String(c.centro[1]) === lon), l.nombre);
  }
});

test('la página de confirmación existe, usa la clave acordada y no entra a la app', () => {
  const h = leer('web/confirmar-extremos.html').replace(/<\/?b>/g, '');
  assert.match(h, /sjdr-extremos-decisiones-v1/);
  assert.match(h, /POR VERIFICAR EN CAMPO aunque las apruebes/);
  assert.match(h, /Tus respuestas se guardan solas en esta computadora\. Al terminar, avísale a Claude en el chat\./);
  assert.doesNotMatch(leer('web/index.html'), /confirmar-extremos/);
});

test('D-35: «Nuevo Parque Industrial» reemplaza a «Col. Industrial Nuevo San Juan» y La Rueda no se duplica', () => {
  const ext = JSON.parse(readFileSync(new URL('../../datos/investigacion/extremos.json', import.meta.url), 'utf8'));
  const nombres = ext.lugares.map((l) => l.lugar);
  assert.ok(nombres.includes('Nuevo Parque Industrial'));
  assert.ok(!nombres.includes('Col. Industrial Nuevo San Juan'));
  assert.ok(nombres.includes('Fracc. La Rueda'));
  assert.ok(!nombres.includes('La Rueda'));
  assert.equal(ext.rutas.find((r) => r.numero === '004').origen, 'Nuevo Parque Industrial');
});
