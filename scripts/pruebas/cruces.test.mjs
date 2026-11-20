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
    // única excepción: la 023, que solo trae el bloque de lugares de la lista mezclada con la 23 (D-43)
    if (r.usable_sin_revision && r.numero === '023') { assert.equal(c.cruces, undefined); assert.match(c.estado, /D-43.*POR VERIFICAR/); }
    else if (r.usable_sin_revision) assert.ok(c.cruces?.length > 0, `${r.numero}: sin cruces`);
    else { assert.equal(c.cruces, undefined, `${r.numero}: usa una lista descartada`); assert.match(c.estado, /D-33/); }
  }
  assert.equal(usadas.length, oficiales.rutas.filter((r) => r.usable_sin_revision && r.numero !== '023').length);
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
    // única excepción: calle que OSM dibuja corta y Miguel confirmó (D-43), hasta 50 m y dicho en la evidencia
    const m = Number(c.evidencia.match(/\((\d+) m\)/)[1]);
    if (m > 30) {
      assert.ok([c.osm_calle, c.osm_cruce].includes('Cerrada de Uruguay') && m <= 50, `${id}: cruce a más de 30 m`);
      assert.match(c.evidencia, /Miguel confirmó que llega \(D-43\)/, id);
    }
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
  // 25: eran 27, pero 2 venían repetidos en la 023 con la lista mezclada de la 23 (D-43, 20 nov 2026)
  assert.ok(ubicados.length >= 25, `solo ${ubicados.length} cruces de Jurica ubicados`);
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

test('cruces: un rumbo suelto («PONIENTE», «ORIENTE») se queda con el nombre anterior, no empieza el siguiente (20 nov 2026)', () => {
  // «CALLE 5 PONIENTE C. CONSTITUYENTES»: el corte va después de PONIENTE.
  for (const c of todos) {
    const ws = c.calle.split(/\s+/);
    if (/^(PONIENTE|ORIENTE|PTE\.?|OTE\.?)$/.test(ws[0])) {
      assert.match(ws[1] ?? '', /^\d+$/, `${c.ruta} #${c.orden}: «${c.texto}» empieza con un rumbo suelto`);
    }
  }
  // efecto medido: Constituyentes con 4 Poniente, Epigmenio González y Santa Fe ya tienen punto
  const ok = todos.filter((c) => /CONSTITUYENTES-(CALLE 4 PONIENTE|EPIGMENIO GONZÁLEZ|SANTA FE)$/.test(c.texto) && c.estado === 'UBICADO');
  assert.ok(ok.length >= 5, `solo ${ok.length}`);
  for (const c of ok) assert.equal(c.osm_calle, 'Avenida Constituyentes');
  // y «PONIENTE 2» (Avenida Dos Poniente, escrita al revés) sigue sirviendo
  assert.ok(todos.some((c) => /^(PONIENTE )?2-ÁLVARO OBREGÓN$/.test(c.texto) && c.osm_calle === 'Avenida Dos Poniente'));
});

test('cruces: «Uruguay» de la 015B = Cerrada de Uruguay entre Veracruz y Av. Francia (Miguel, D-43), nunca la Calle Uruguay lejana', () => {
  const u = todos.filter((c) => c.ruta === '015B' && /URUGUAY/.test(c.texto));
  assert.equal(u.length, 8);
  for (const c of u) {
    assert.equal(c.estado, 'UBICADO', `#${c.orden}`);
    assert.ok([c.osm_calle, c.osm_cruce].includes('Cerrada de Uruguay'), `#${c.orden}`);
    assert.ok(Math.abs(c.lat - 20.3997) < 0.001 && Math.abs(c.lon + 99.9593) < 0.001, `#${c.orden}: fuera de la cerrada`);
  }
  assert.ok(!todos.some((c) => [c.osm_calle, c.osm_cruce].includes('Calle Uruguay')));
});

test('cruces: Sierra Paracaima y Sierra Tezonco son laterales de la Av. Lomas de San Juan (Miguel, D-43): referencia sin punto', () => {
  const l = todos.filter((c) => /LOMAS DE SAN JUAN-(CALLE )?SIERRA (PARACAIMA|TEZONCO)/.test(c.texto));
  assert.equal(l.length, 6);
  for (const c of l) {
    assert.equal(c.estado, 'REFERENCIA', `${c.ruta} #${c.orden}`);
    assert.equal(c.lat, undefined);
    assert.match(c.nota, /no es cruce: .* lateral (oriente|poniente)/);
  }
});

test('cruces: la misma calle dos veces seguidas («20 DE NOVIEMBRE 20 DE NOVIEMBRE», «LA PALMA LA PALMA») se corta a la mitad sin duda (20 nov 2026)', () => {
  const m = todos.filter((c) => c.ruta === '046' && /^(C\. MAURILIO MORELOS-20 DE NOVIEMBRE|20 DE NOVIEMBRE-5 DE MAYO)$/.test(c.texto));
  assert.ok(m.length >= 5 && m.every((c) => c.estado === 'UBICADO'), m.map((c) => `#${c.orden} ${c.estado}`).join(', '));
  // mismo dato, mismo punto: la 046 coincide con la 008 en esos cruces
  const p008 = todos.find((c) => c.ruta === '008' && c.texto === '20 DE NOVIEMBRE-5 DE MAYO');
  for (const c of m.filter((x) => x.texto === p008.texto)) assert.deepEqual([c.lat, c.lon], [p008.lat, p008.lon]);
  const palma = todos.filter((c) => c.ruta === '002' && /^(MANDARINA-LA PALMA|LA PALMA-MANDARINA|TAMARINDO-LA PALMA|LA PALMA-HIGUERA)$/.test(c.texto));
  assert.equal(palma.length, 4);
  for (const c of palma) assert.equal(c.estado, 'UBICADO', `002 #${c.orden}`);
});

test('cruces: un pedazo repetido idéntico (la misma parada en ida y vuelta) no vuelve dudoso el corte: la 046 ubica Hidalgo × 20 de Noviembre y Dos Poniente × Álvaro Obregón como la 008 (20 nov 2026)', () => {
  for (const texto of ['C.MIGUEL HIDALGO-20 DE NOVIEMBRE', 'PONIENTE 2-ÁLVARO OBREGÓN']) {
    const ref = todos.find((c) => c.ruta === '008' && c.texto === texto);
    assert.equal(ref?.estado, 'UBICADO', `008 ${texto}`);
    const m = todos.filter((c) => c.ruta === '046' && c.texto === texto);
    assert.equal(m.length, 2, `046 ${texto}: debe salir en ida y en vuelta, con el mismo corte`);
    // mismo dato, mismo punto (lección 3)
    for (const c of m) assert.deepEqual([c.estado, c.lat, c.lon], ['UBICADO', ref.lat, ref.lon], `046 #${c.orden}`);
  }
  // el corte nunca deja «PONIENTE» pegado a 20 de Noviembre ni un «2» suelto
  assert.ok(!todos.some((c) => c.ruta === '046' && /20 DE NOVIEMBRE PONIENTE$|^2-/.test(c.texto)));
});

test('cruces: la lista mezclada de la 23 y la 023 se separa (Miguel, D-43): calles de Lomas del Pedregal a la 23, lugares a la 023, sin puntos en la 023', () => {
  const t23 = oficiales.rutas.find((r) => r.numero === '23').lista_texto;
  const r23 = cruces.rutas.find((r) => r.numero === '23');
  const r023 = cruces.rutas.find((r) => r.numero === '023');
  // la 023 se queda con el bloque de lugares, completo y tal cual viene en la página; ningún punto
  assert.ok(r023.lugares_texto.startsWith('LAS CRUCITAS ') && r023.lugares_texto.endsWith(' SECUNDARIA NOGAL'));
  assert.ok(t23.includes(r023.lugares_texto) && !r023.lugares_texto.includes('-'));
  assert.equal(r023.cruces, undefined);
  // la 23 no trae nada del bloque de lugares y conserva sus cruces de Lomas del Pedregal
  for (const c of r23.cruces) assert.ok(!/CRUCITAS|TERMAS DEL REY|SECUNDARIA NOGAL/.test(c.texto), `23 #${c.orden}`);
  assert.ok(r23.cruces.filter((c) => Number.isFinite(c.lat)).length >= 22);
  assert.ok(r23.cruces.some((c) => c.texto === 'DE LA CANTERA-DEL GRANITO' && c.estado === 'UBICADO'));
});

test('cruces: «MEXICAN FEDERAL HWY 120» = carretera San Juan del Río - Xilitla (Miguel, D-43): sus negocios confirman la calle, sin punto propio', () => {
  const f = todos.filter((c) => c.ruta === '032' && /^MEXICAN FEDERAL HWY 120-/.test(c.texto));
  assert.equal(f.length, 4);
  for (const c of f) {
    assert.deepEqual([c.estado, c.osm_calle, c.lat], ['REFERENCIA', 'San Juan del Río - Xilitla', undefined], `032 #${c.orden}`);
  }
  // «MÉXICO 120 – BENITO JUÁREZ»: en OSM la carretera no toca ninguna Benito Juárez; no se inventa el cruce
  const bj = todos.find((c) => c.ruta === '032' && c.texto === 'MÉXICO 120-BENITO JUÁREZ');
  assert.ok(['SIN UBICAR', 'CALLES SIN CRUCE EN OSM'].includes(bj.estado) && bj.lat === undefined);
});
