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
    // únicas excepciones: calle o par que OSM dibuja corto y Miguel confirmó (D-43), con su tope y dicho en la evidencia
    const m = Number(c.evidencia.match(/\((\d+) m\)/)[1]);
    if (m > 30) {
      const par = [c.osm_calle, c.osm_cruce].sort().join('|');
      const ok = ([c.osm_calle, c.osm_cruce].includes('Cerrada de Uruguay') && m <= 50)
        || (par === 'Avenida Universidad|Circuito Querétaro Norte' && m <= 40);
      assert.ok(ok, `${id}: cruce a más de 30 m`);
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
  const estados = ['UBICADO', 'UBICADO POR LUGAR', 'APROXIMADO', 'REFERENCIA', 'CALLES SIN CRUCE EN OSM', 'SIN UBICAR'];
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
  // «MÉXICO 120 – BENITO JUÁREZ»: la carretera no toca ninguna Benito Juárez, pero en la ciudad sigue en
  // línea recta como Av. Central, que sí la toca (0 m): el punto sale de esa continuación, no se inventa (20 nov 2026)
  const bj = todos.find((c) => c.ruta === '032' && c.texto === 'MÉXICO 120-BENITO JUÁREZ');
  assert.equal(bj.estado, 'UBICADO');
  assert.match(bj.correcciones.join(' '), /continuación: «MÉXICO 120» \(OSM «San Juan del Río - Xilitla»\) sigue en línea recta como «Avenida Central»/);
});

test('cruces: Matamoros sigue como Calle Fundadores hasta la Av. Hidalgo; la misma calle de la lista va por la misma calle de OSM (20 nov 2026)', () => {
  const mm = todos.filter((c) => c.texto === 'MIGUEL HIDALGO NTE.-MARIANO MATAMOROS');
  assert.deepEqual(mm.map((c) => c.ruta).sort(), ['002', '030', '047']);
  // mismo dato, mismo punto (lección 3): las tres en Av. Hidalgo × Fundadores, con la continuación anotada
  for (const c of mm) {
    assert.deepEqual([c.estado, c.osm_calle, c.osm_cruce, c.lat, c.lon], ['UBICADO', 'Avenida Miguel Hidalgo', 'Calle Fundadores', 20.39004, -99.99658], `${c.ruta} #${c.orden}`);
    assert.ok(c.correcciones.some((x) => /continuación: .*Calle Mariano Matamoros.*Calle Fundadores/.test(x)));
  }
  // «HIDALGO-C. MIGUEL HIDALGO» cae en el mismo punto en todas las rutas
  const h = todos.filter((c) => c.texto === 'HIDALGO-C. MIGUEL HIDALGO');
  assert.ok(h.length >= 6);
  assert.equal(new Set(h.map((c) => `${c.lat},${c.lon}`)).size, 1, h.map((c) => `${c.ruta}#${c.orden} ${c.lat},${c.lon}`).join(' '));
  // el número de casa pegado al nombre en OSM no cambia la calle: Águila Africana conserva su nombre exacto
  const ag = todos.find((c) => c.ruta === '039' && c.texto === 'AGUÍLA AFRICANA-AGUÍLA BLANCA');
  assert.equal(ag.osm_calle, 'Calle Águila Africana');
});

test('cruces: «CARRETERA SAN JUAN DEL RÍO-TEQUISQUIAPAN KM 3.2-WALMART» es una sola parada: el Walmart sobre el Paseo Central (Miguel, D-43), sin punto propio', () => {
  for (const ruta of ['009B', '016', '030']) {
    const w = todos.filter((c) => c.ruta === ruta && /WALMART|TEQUISQUIAPAN/.test(c.texto));
    assert.equal(w.length, 1, `${ruta}: el guion de la carretera no debe partir la parada en dos`);
    assert.deepEqual([w[0].texto, w[0].estado, w[0].osm_calle, w[0].lat], ['CARRETERA SAN JUAN DEL RÍO–TEQUISQUIAPAN KM 3.2-WALMART', 'REFERENCIA', 'Avenida Central', undefined], ruta);
  }
});

test('cruces: Av. Universidad llega al Circuito Querétaro Norte (Miguel, D-43): tolerancia de 40 m solo para ese par, a 32 m en OSM', () => {
  const u = todos.filter((c) => c.texto === 'AV. UNIVERSIDAD-CTO. QUERÉTARO NORTE');
  assert.deepEqual(u.map((c) => c.ruta).sort(), ['011B', '015B']);
  for (const c of u) {
    assert.deepEqual([c.estado, c.lat, c.lon], ['UBICADO', 20.38708, -99.94657], `${c.ruta} #${c.orden}`);
    assert.match(c.evidencia, /\(32 m\).*Miguel confirmó que llega/);
  }
  // la tolerancia es del par, no de la calle: ningún otro cruce del Circuito Querétaro Norte pasa de 30 m
  for (const c of todos.filter((x) => x.estado === 'UBICADO' && [x.osm_calle, x.osm_cruce].includes('Circuito Querétaro Norte') && ![x.osm_calle, x.osm_cruce].includes('Avenida Universidad'))) {
    assert.ok(Number(c.evidencia.match(/\((\d+) m\)/)[1]) <= 30, `${c.ruta} #${c.orden}`);
  }
});

test('cruces: cada cruce sin ubicar en medio alarga el salto permitido 300 m: la 009B ubica Constituyentes × Santa Fe como la 032 y la 047 (20 nov 2026)', () => {
  const sf = todos.filter((c) => c.texto === 'C. CONSTITUYENTES-SANTA FE');
  assert.deepEqual(sf.map((c) => c.ruta).sort(), ['009B', '032', '047']);
  for (const c of sf) assert.deepEqual([c.estado, c.lat, c.lon], ['UBICADO', 20.3963, -99.98798], `${c.ruta} #${c.orden}`);
  // el mismo cruce, el mismo punto: OSM tiene dos ramales de la Carretera a Santa Cruz Nieto que tocan la Av. Central (a 222 m); la 009B usa el de la 030
  const sc = todos.filter((c) => c.osm_calle === 'Avenida Central' && c.osm_cruce === 'Carretera a Santa Cruz Nieto');
  assert.deepEqual(sc.map((c) => `${c.ruta} ${c.lat},${c.lon}`).sort(), ['009B 20.39921,-99.98309', '030 20.39921,-99.98309']);
});

test('cruces: primera calle escrita dos veces, «3O» = 3º y una errata dentro de un nombre que OSM trae completo (20 nov 2026)', () => {
  const ver = (ruta, texto, osm, lat, lon) => {
    const c = todos.find((x) => x.ruta === ruta && x.texto === texto);
    assert.ok(c, `${ruta}: falta «${texto}»`);
    assert.deepEqual([c.estado, c.osm_calle, c.osm_cruce, c.lat, c.lon], ['UBICADO', ...osm, lat, lon], `${ruta} #${c.orden}`);
  };
  // «PASEO LOMA ALTA PASEO LOMA ALTA-LOMA DEL RIO» y «HIDALGO HIDALGO-…»: una sola calle
  for (const r of ['011', '011B']) ver(r, 'PASEO LOMA ALTA-LOMA DEL RIO', ['Paseo Loma Alta', 'Calle Loma Del Río'], 20.37585, -99.92503);
  ver('008', 'HIDALGO-C. MIGUEL HIDALGO', ['Avenida Miguel Hidalgo', 'Avenida Miguel Hidalgo y Costilla'], 20.38652, -99.99722);
  assert.ok(!todos.some((c) => /^(PASEO LOMA ALTA PASEO LOMA ALTA|HIDALGO HIDALGO)\b/.test(c.texto)));
  ver('022', 'ARTICULO 3O-FERNANDO DE TAPIA', ['Calle Artículo Tercero', 'Prolongación Fernando de Tapia'], 20.38319, -99.99226);
  ver('015B', 'GUADALUPE VICTORIA-PROL. BENITO JUÁRREZ', ['Calle Guadalupe Victoria', 'Prolongación Benito Juárez García'], 20.39607, -99.95706);
});

test('cruces: APROXIMADO (Miguel, D-45): punto ESTIMADO de nivel C, con método, a un salto razonable de sus vecinos; lo que queda POR VERIFICAR dice por qué', () => {
  const ML = 110574, MO = 111320 * Math.cos((20.39 * Math.PI) / 180);
  const d = (a, b) => Math.hypot((a.lat - b.lat) * ML, (a.lon - b.lon) * MO);
  const metodos = ['cercanía', 'numeración', 'entre vecinos', 'mismo texto'];
  const aprox = todos.filter((c) => c.estado === 'APROXIMADO');
  // cuántos: los que van subiendo a UBICADO con arreglos de evidencia bajan este número (bien)
  assert.ok(aprox.length > 0, 'sin APROXIMADOS');
  for (const c of aprox) {
    const id = `${c.ruta} #${c.orden} ${c.texto}`;
    // (a) etiqueta, nivel y método
    assert.deepEqual([c.etiqueta, c.precision], ['ESTIMADO', 'C'], id);
    assert.ok(metodos.includes(c.metodo), id);
    assert.ok(Number.isFinite(c.lat) && Number.isFinite(c.lon) && c.evidencia && /D-45/.test(c.verificacion), id);
    assert.ok(nombresOsm.has(c.osm_calle), id);
    assert.ok(['CALLES SIN CRUCE EN OSM', 'SIN UBICAR'].includes(c.antes), id);
    // (b) salto máximo a sus vecinos ubicados: 3 km + 300 m por cruce sin ubicar en medio
    const lista = usadas.find((r) => r.numero === c.ruta).cruces;
    const i = lista.findIndex((x) => x.orden === c.orden);
    const real = (x) => x.estado === 'UBICADO' || x.estado === 'UBICADO POR LUGAR';
    let prev = -1, next = -1;
    for (let j = i - 1; j >= 0; j--) if (real(lista[j])) { prev = j; break; }
    for (let j = i + 1; j < lista.length; j++) if (real(lista[j])) { next = j; break; }
    assert.ok(prev >= 0 || next >= 0, `${id}: sin vecinos ubicados`);
    for (const j of [prev, next]) if (j >= 0) assert.ok(d(c, lista[j]) <= 3000 + 300 * (Math.abs(i - j) - 1), `${id}: salto con #${lista[j].orden}`);
  }
  // (c) D-45 no toca los UBICADOS: ninguno trae método ni estado anterior, y no
  // bajan de los 690 que había al aplicarla (los arreglos con evidencia los suben)
  const ubic = todos.filter((c) => c.estado === 'UBICADO');
  for (const c of ubic) assert.ok(c.metodo === undefined && c.antes === undefined && c.precision === undefined, `${c.ruta} #${c.orden}`);
  assert.ok(ubic.length >= 690, `UBICADOS: ${ubic.length}`);
  // (d) lo que queda POR VERIFICAR dice por qué ningún método lo alcanzó
  const quedan = todos.filter((c) => c.estado === 'CALLES SIN CRUCE EN OSM' || c.estado === 'SIN UBICAR');
  assert.ok(quedan.length < 53, `POR VERIFICAR: ${quedan.length}`);
  for (const c of quedan) assert.match(c.nota, /Sin aproximación \(D-45\): /, `${c.ruta} #${c.orden}`);
  // casos revisados a mano (20 nov 2026)
  const en = (texto) => aprox.filter((c) => c.texto === texto);
  // Constituyentes: la 3 entre la 1 y la 4 Poniente; la 5 entre la 4 y la 8; la 9, un número más allá de la 8
  for (const [t, lat] of [['C. COSTITUYENTES-CALLE TRES PTE.', 20.39993], ['CALLE CONSTITUYENTES-CALLE 5 PONIENTE', 20.4042], ['CALLE CONSTITUYENTES-AV. 9 PONIENTE', 20.41357]]) {
    assert.ok(en(t).length >= 1, t);
    for (const c of en(t)) assert.deepEqual([c.metodo, c.osm_calle, c.lat], [en(t)[0].metodo, 'Avenida Constituyentes', lat], t);
  }
  // Corregidora × San José: entre Zaragoza y Matamoros, sin ir y regresar (la San José de OSM quedaba más allá de Matamoros)
  for (const c of en('C. CORREGIDORA-SAN JOSE')) assert.deepEqual([c.metodo, c.osm_calle, c.lat, c.lon], ['entre vecinos', 'Calle Corregidora', 20.38964, -100.0013]);
  // La Palma × Chabacano: sus vecinos van por la Avenida La Palma; la «Avenida de las Palmas» no sirve
  assert.ok(!todos.some((c) => c.osm_calle === 'Avenida de las Palmas' && c.texto === 'LA PALMA-CHABACANO'));
});

test('cruces: «CARRETERA QUERÉTARO 300» = Carretera Panamericana a Querétaro (Miguel, D-43): la Secretaría de Finanzas confirma la calle, sin punto propio', () => {
  const c = todos.find((x) => x.ruta === '002' && x.texto === 'CARRETERA QUERÉTARO 300-SECRETARIA DE FINANZAS');
  assert.deepEqual([c.estado, c.osm_calle, c.lat], ['REFERENCIA', 'Carretera Panamericana a Querétaro', undefined]);
});

test('cruces: una calle completa entre dos guiones cierra un cruce y abre el siguiente: «JURICA-SAN JUAN DEL RÍO-MERCADO JUÁREZ» (022, 20 nov 2026)', () => {
  const j = todos.find((c) => c.ruta === '022' && c.texto === 'JURICA-SAN JUAN DEL RÍO');
  assert.deepEqual([j.estado, j.osm_calle, j.osm_cruce], ['UBICADO', 'Avenida Belisario Domínguez', 'Avenida Central']);
  // el mismo cruce que las 5 rutas que escriben «CARR. SAN JUAN DEL RÍO-JURICA» (a 4 m: el punto medio depende de qué calle va primero)
  const otro = todos.find((c) => c.texto === 'CARR. SAN JUAN DEL RÍO-JURICA');
  assert.ok(Math.hypot((j.lat - otro.lat) * 110574, (j.lon - otro.lon) * 104300) < 10);
  const m = todos.find((c) => c.ruta === '022' && c.texto === 'SAN JUAN DEL RÍO-MERCADO JUÁREZ');
  assert.deepEqual([m.estado, m.osm_calle, m.lat], ['REFERENCIA', 'Avenida Central', undefined]);
  assert.ok(!todos.some((c) => c.ruta === '022' && /^(JURICA-SAN JUAN|DEL RÍO-MERCADO)/.test(c.texto) && c.texto !== 'JURICA-SAN JUAN DEL RÍO'));
});

test('cruces: «El Cerezo» = Acceso a Visthá (Miguel, D-43) y la 032, circuito desde Visthá, no toma calles homónimas a 5 km', () => {
  const r = (t) => todos.find((c) => c.ruta === '032' && c.texto === t);
  assert.deepEqual([r('EL CEREZO-SALINAS').estado, r('EL CEREZO-SALINAS').osm_calle, r('EL CEREZO-SALINAS').lat], ['UBICADO', 'Acceso a Visthá', 20.44401]);
  assert.deepEqual([r('EL CEREZO-JOSE BALLESTEROS LOPÉZ').estado, r('EL CEREZO-JOSE BALLESTEROS LOPÉZ').osm_calle], ['UBICADO', 'Acceso a Visthá']);
  // los primeros cruces de la 032 (sale de Visthá, 20.44656, -99.97522) no caen a 5 km al poniente
  for (const t of ['MIGUEL HIDALGO-VENUSTIANO CARRANZA', 'VENUSTIANO CARRANZA-FRANCISCO VILLA']) {
    const c = r(t);
    assert.ok(c.lat === undefined || Math.hypot((c.lat - 20.44656) * 110574, (c.lon + 99.97522) * 104300) < 3000, `032 #${c.orden}`);
  }
});

test('cruces: «MÉXICO 120» es la misma Federal 120 (D-43) y en la ciudad sigue como Av. Central; Ocho Oriente × Av. Central, un solo punto en las tres rutas', () => {
  const c = todos.find((x) => x.ruta === '032' && x.texto === 'MÉXICO 120-BENITO JUÁREZ');
  assert.deepEqual([c.estado, c.osm_calle, c.osm_cruce, c.lat, c.lon], ['UBICADO', 'Avenida Central', 'Avenida Benito Juárez', 20.42234, -99.97777]);
  const ocho = todos.filter((x) => ['CARR. MÉXICO 120-AV. 8 ORIENTE', 'AV. 8 ORIENTE-PASEO CENTRAL'].includes(x.texto));
  assert.equal(ocho.length, 3);
  assert.deepEqual([...new Set(ocho.map((x) => `${x.estado} ${x.lat},${x.lon}`))], ['UBICADO 20.41111,-99.98153']);
});

test('cruces: «CAR. ESTATAL 122» = Acceso a Visthá (Miguel, D-43): las dos puntas del circuito de la 032 en el mismo punto', () => {
  const p = ['FRANCISCO VILLA-CAR. ESTATAL 122', 'CAR. ESTATAL 122-FRANCISCO VILLA'].map((t) => todos.find((c) => c.ruta === '032' && c.texto === t));
  for (const c of p) assert.deepEqual([c.estado, c.lat, c.lon], ['UBICADO', 20.44601, -99.97442], `032 #${c.orden}`);
  assert.ok(p.every((c) => [c.osm_calle, c.osm_cruce].includes('Acceso a Visthá')));
});
