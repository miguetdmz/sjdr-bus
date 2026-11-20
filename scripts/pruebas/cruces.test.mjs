// R-03, hallazgo a (D-32, D-33, D-42): los cruces de las listas oficiales se
// separan y ubican solo con evidencia del mapa; lo que no la tiene queda a la
// vista como POR VERIFICAR, nunca con un dato supuesto.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const leer = (r) => JSON.parse(readFileSync(new URL(`../../${r}`, import.meta.url), 'utf8'));
const cruces = leer('datos/investigacion/cruces.json');
const oficiales = leer('datos/investigacion/calles-oficiales.json');
const osm = leer('datos/cache/overpass/calles.json');
const nombresOsm = new Set(osm.tramos.map((t) => t.nombre));
const usadas = cruces.rutas.filter((r) => r.cruces);
const todos = usadas.flatMap((r) => r.cruces.map((c) => ({ ...c, ruta: r.numero })));

test('cruces: una ruta por cada ruta de R-01; las 20 listas mezcladas con Querétaro no se usan (D-33)', () => {
  assert.deepEqual(cruces.rutas.map((r) => r.numero), oficiales.rutas.map((r) => r.numero));
  for (const r of oficiales.rutas) {
    const c = cruces.rutas.find((x) => x.numero === r.numero);
    if (r.usable_sin_revision) assert.ok(c.cruces?.length > 0, `${r.numero}: sin cruces`);
    else { assert.equal(c.cruces, undefined, `${r.numero}: usa una lista descartada`); assert.match(c.estado, /D-33/); }
  }
  assert.equal(usadas.length, oficiales.rutas.filter((r) => r.usable_sin_revision).length);
});

test('cruces: ningún sentido asignado todavía (hallazgo c, regla 10)', () => {
  for (const r of usadas) assert.match(r.sentido, /sin asignar/);
});

test('cruces: todo punto UBICADO trae las dos calles de OSM y su evidencia', () => {
  for (const c of todos.filter((x) => x.estado === 'UBICADO')) {
    const id = `${c.ruta} #${c.orden} ${c.texto}`;
    assert.ok(Number.isFinite(c.lat) && Number.isFinite(c.lon), id);
    assert.ok(nombresOsm.has(c.osm_calle) && nombresOsm.has(c.osm_cruce), `${id}: calle que no está en OSM`);
    assert.notEqual(c.osm_calle, c.osm_cruce, id);
    assert.match(c.evidencia, /se tocan en OSM \((\d+) m\)/, id);
    assert.ok(Number(c.evidencia.match(/\((\d+) m\)/)[1]) <= 30, `${id}: cruce a más de 30 m`);
  }
});

test('cruces: las correcciones (erratas, abreviaturas, continuaciones) solo existen con prueba del mapa', () => {
  for (const c of todos.filter((x) => x.correcciones)) {
    assert.equal(c.estado, 'UBICADO', `${c.ruta} #${c.orden}: corrección sin cruce comprobado`);
  }
});

test('cruces: sin punto no hay coordenada, y lo que no se pudo ubicar dice POR VERIFICAR', () => {
  for (const c of todos) {
    const id = `${c.ruta} #${c.orden} ${c.texto}`;
    if (c.estado === 'REFERENCIA') { assert.equal(c.lat, undefined, id); assert.ok(nombresOsm.has(c.osm_calle), id); }
    if (c.estado === 'CALLES SIN CRUCE EN OSM' || c.estado === 'SIN UBICAR') {
      assert.equal(c.lat, undefined, id);
      assert.match(c.nota, /POR VERIFICAR/, id);
    }
  }
});

test('cruces: los nombres no quedan partidos (lección de la 001: «CARR. SAN JUAN DEL RÍO»)', () => {
  const cola = /\s(DE|DEL|LA|LAS|LOS|Y|AV\.?|CALLE|C\.|CARR\.?)$/;
  const osmDel = (c) => [c.osm_calle, c.osm_cruce].some((n) => n && /\bdel?\b/i.test(n));
  for (const c of todos) {
    // un corte dudoso (nombre con su propio guion) se acepta solo si queda POR VERIFICAR
    if (c.estado === 'SIN UBICAR' && /propio guion/.test(c.nota)) continue;
    for (const t of [c.calle, c.cruce_con].filter(Boolean)) {
      assert.doesNotMatch(t, cola, `${c.ruta} #${c.orden}: «${t}» termina partido`);
      assert.doesNotMatch(t, /^Y\s/, `${c.ruta} #${c.orden}: «${t}» empieza partido`);
      // «DEL …» solo si es una calle real de OSM que así se llama («Calle del Abedúl»)
      if (/^DEL\s/.test(t)) assert.ok(osmDel(c), `${c.ruta} #${c.orden}: «${t}» empieza partido`);
    }
  }
  const r001 = usadas.find((r) => r.numero === '001');
  assert.ok(r001.cruces.some((c) => c.calle === 'CARR. SAN JUAN DEL RÍO'));
});

test('cruces: el resumen cuadra con el detalle', () => {
  const { resumen } = cruces;
  assert.equal(resumen.cruces, todos.length);
  const estados = ['UBICADO', 'UBICADO POR LUGAR', 'REFERENCIA', 'CALLES SIN CRUCE EN OSM', 'SIN UBICAR'];
  assert.equal(estados.reduce((s, e) => s + resumen[e], 0), todos.length);
  for (const e of estados) assert.equal(resumen[e], todos.filter((c) => c.estado === e).length, e);
});

test('cruces: «SIN REFERENCIA» es casilla vacía de la lista, nunca parte de un nombre (20 nov 2026)', () => {
  for (const c of todos) assert.doesNotMatch(c.texto, /SIN REFERENCIA/, `${c.ruta} #${c.orden}: ${c.texto}`);
});

test('cruces: alias «Jurica» = Av. Belisario Domínguez (D-43) pasa la prueba del mapa y nunca usa la Privada Jurica lejana', () => {
  const jurica = todos.filter((c) => /JURICA/.test(c.texto));
  const ubicados = jurica.filter((c) => c.estado === 'UBICADO');
  assert.ok(ubicados.length >= 27, `solo ${ubicados.length} cruces de Jurica ubicados`);
  for (const c of ubicados) {
    assert.ok([c.osm_calle, c.osm_cruce].includes('Avenida Belisario Domínguez'), `${c.ruta} #${c.orden}`);
    assert.match(c.evidencia, /se tocan en OSM/);
  }
  assert.ok(!jurica.some((c) => [c.osm_calle, c.osm_cruce].includes('Privada Jurica')));
});

test('cruces: número con cifra = con letra («AV. 1 PONIENTE» = «Avenida Uno Poniente»), siempre con prueba del mapa', () => {
  const uno = todos.filter((c) => /AV\. 1 PONIENTE/.test(c.texto) && c.estado === 'UBICADO');
  assert.ok(uno.length >= 3, `solo ${uno.length}`);
  for (const c of uno) { assert.ok([c.osm_calle, c.osm_cruce].includes('Avenida Uno Poniente')); assert.match(c.evidencia, /se tocan en OSM/); }
});

test('cruces: Río Moctezuma sigue como Gral. Francisco Villa hasta la Av. Central (D-43), sin perder sus otros cruces', () => {
  const rm = todos.filter((c) => /RÍO MOCTEZUMA/.test(c.texto));
  const conCarr = rm.filter((c) => /SAN JUAN DEL RÍO/.test(c.texto));
  assert.ok(conCarr.length >= 6 && conCarr.every((c) => c.estado === 'UBICADO' && c.osm_calle === 'Calle General Francisco Villa'));
  assert.ok(rm.filter((c) => c.estado === 'UBICADO' && c.osm_calle === 'Avenida Río Moctezuma').length >= 30);
});

test('cruces: «Sagitario» junto a la Av. Hidalgo es un negocio (Miguel, D-43): confirma la calle, sin punto propio', () => {
  const s = todos.filter((c) => /HIDALGO-SAGITARIO/.test(c.texto));
  assert.ok(s.length >= 5);
  for (const c of s) { assert.equal(c.estado, 'REFERENCIA'); assert.equal(c.lat, undefined); }
});
