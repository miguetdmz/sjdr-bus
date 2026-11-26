// D-76 (R-03 fase 1, hallazgo b; Miguel, 26 nov 2026, 1:31 pm: «Sí, con A y B»): las
// REFERENCIA de negocio se cruzan contra los 294 lugares de OSM ya guardados. Un punto nuevo
// solo si un único lugar comparte 2 o más palabras (sin contar el nombre de la ciudad, ajuste A)
// y queda a ≤ 150 m de la calle; lo dudoso va a Miguel en orden de Pareto; lo que está a más de
// 300 m no se pregunta (ajuste B). Los puntos nuevos no entran a la página de campo hasta la
// fase 4. Estas pruebas revisan las reglas, no los conteos del día (lección 11), y recalculan
// por su cuenta nombre y distancia en vez de creerle a los campos del archivo.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { armarCampoApp } from '../datos-app.mjs';

const leer = (r) => JSON.parse(readFileSync(new URL(`../../${r}`, import.meta.url), 'utf8'));
const cruces = leer('datos/investigacion/cruces.json');
const dudosos = leer('datos/investigacion/lugares-dudosos.json');
const lugares = leer('datos/cache/overpass/lugares-amplio.json').lugares;
const tramos = leer('datos/cache/overpass/calles.json').tramos;

const todos = cruces.rutas.filter((r) => r.cruces).flatMap((r) => r.cruces.map((c) => ({ ...c, ruta: r.numero, route_id: r.route_id })));
const d76 = todos.filter((c) => c.metodo === 'D-76');
const NEGOCIO = /la referencia es un negocio o lugar que OSM no tiene/;
const refNegocio = todos.filter((c) => c.estado === 'REFERENCIA' && NEGOCIO.test(c.nota ?? ''));
const clave = (c) => `${c.texto}|${c.osm_calle}`;
const porClave = new Map(dudosos.clasificacion.map((x) => [clave(x), x]));

// Palabras de un nombre, sin acentos, tipo de vía, palabras vacías ni nombre de la ciudad (ajuste A).
const FUERA = new Set(['DE', 'DEL', 'LA', 'LAS', 'LOS', 'EL', 'Y', 'E', 'AV', 'AVENIDA', 'CALLE', 'BOULEVARD', 'BLVD',
  'CARRETERA', 'CARR', 'CIRCUITO', 'PROLONGACION', 'PRIVADA', 'CERRADA', 'CALZADA', 'ANDADOR', 'CAMINO',
  'SAN', 'JUAN', 'RIO', 'SJR', 'QUERETARO']);
const palabras = (t) => new Set(String(t).normalize('NFD').replace(/[̀-ͯ]/g, '').toUpperCase()
  .split(/[^A-Z0-9]+/).filter((w) => w.length >= 3 && !FUERA.has(w)));
const comunes = (a, b) => { const B = palabras(b); return [...palabras(a)].filter((w) => B.has(w)).length; };

// Distancia de un punto a una calle de OSM (metros, plana: suficiente a escala de ciudad).
const ML = 110574, MO = 111320 * Math.cos((20.39 * Math.PI) / 180);
function aCalle(nombre, p) {
  let m = Infinity;
  for (const t of tramos) {
    if (t.nombre !== nombre) continue;
    for (let i = 1; i < t.trazo.length; i++) {
      const [a, b] = [t.trazo[i - 1], t.trazo[i]];
      const ax = a[1] * MO, ay = a[0] * ML, dx = b[1] * MO - ax, dy = b[0] * ML - ay, L = dx * dx + dy * dy;
      const px = p[1] * MO, py = p[0] * ML;
      const k = L ? Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / L)) : 0;
      m = Math.min(m, Math.hypot(px - ax - k * dx, py - ay - k * dy));
    }
  }
  return m;
}
const cumple = (referencia, calle, l) => comunes(referencia, l.nombre) >= 2 && aCalle(calle, l.centro) <= 150;

test('D-76: cada punto nuevo sale de una REFERENCIA de negocio, con lugar de OSM, ESTIMADO y su evidencia', () => {
  assert.ok(d76.length > 0, 'el hallazgo b no dejó ningún punto');
  for (const c of d76) {
    const id = `${c.ruta} #${c.orden} ${c.texto}`;
    assert.deepEqual([c.estado, c.etiqueta, c.antes], ['UBICADO POR LUGAR', 'ESTIMADO', 'REFERENCIA'], id);
    assert.match(c.nota_antes, NEGOCIO, id);
    assert.match(c.evidencia, /D-76/, id);
    const osm = c.osm_lugar.match(/\(((?:node|way|relation)\/\d+)\)$/)?.[1];
    const l = lugares.find((x) => x.osm === osm);
    assert.ok(l, `${id}: el lugar no está en los 294 de lugares-amplio.json`);
    assert.deepEqual([c.lat, c.lon], l.centro, `${id}: el punto no es el del lugar`);
  }
});

test('D-76: el lugar queda a ≤ 150 m de la calle del cruce (medido aquí, no leído del archivo)', () => {
  for (const c of d76) {
    const d = aCalle(c.osm_calle, [c.lat, c.lon]);
    assert.ok(d <= 150, `${c.ruta} #${c.orden} ${c.texto}: a ${Math.round(d)} m de ${c.osm_calle}`);
    assert.ok(Math.abs(d - c.distancia_calle_m) <= 2, `${c.ruta} #${c.orden}: dice ${c.distancia_calle_m} m y mide ${Math.round(d)} m`);
  }
});

test('D-76 ajuste A: el nombre de la ciudad no cuenta («SAN JUAN DEL RÍO» no es la Unidad Deportiva)', () => {
  for (const c of d76) {
    const ref = porClave.get(clave(c))?.referencia;
    assert.ok(ref, `${c.ruta} #${c.orden}: sin renglón en lugares-dudosos.json`);
    const l = c.osm_lugar.replace(/ \([^()]*\)$/, '');
    assert.ok(comunes(ref, l) >= 2, `${c.ruta} #${c.orden} «${ref}» → «${l}»: menos de 2 palabras en común sin contar la ciudad`);
  }
});

test('D-76: si dos lugares cumplen, no se adivina (único lugar o se pregunta)', () => {
  for (const c of d76) {
    const ref = porClave.get(clave(c)).referencia;
    const n = lugares.filter((l) => cumple(ref, c.osm_calle, l)).length;
    assert.equal(n, 1, `${c.ruta} #${c.orden} «${ref}»: ${n} lugares cumplen`);
  }
});

test('D-76: las REFERENCIA de negocio salen todas con estado y motivo; las cuentas cuadran', () => {
  const r = dudosos.resumen;
  assert.equal(r.referencias_de_negocio, refNegocio.length + d76.length);
  assert.equal(dudosos.clasificacion.reduce((n, x) => n + x.veces, 0), r.referencias_de_negocio);
  for (const c of refNegocio) {
    const x = porClave.get(clave(c));
    assert.ok(x && ['DUDOSO', 'SIGUE REFERENCIA'].includes(x.estado) && x.motivo, `${c.ruta} #${c.orden} ${c.texto}: sin estado`);
  }
  for (const c of d76) assert.equal(porClave.get(clave(c))?.estado, 'UBICADO POR LUGAR', `${c.ruta} #${c.orden}`);
  for (const x of dudosos.clasificacion) {
    const enCruces = todos.filter((c) => clave(c) === clave(x));
    assert.equal(enCruces.length, x.veces, `${x.texto}: dice ${x.veces} veces y hay ${enCruces.length}`);
  }
});

test('D-76: los dudosos van en orden de Pareto, con sus candidatos; lo de más de 300 m no se pregunta (ajuste B)', () => {
  const v = dudosos.dudosos.map((x) => x.veces);
  assert.deepEqual(v, [...v].sort((a, b) => b - a), 'no van los que más se repiten primero');
  for (const x of dudosos.dudosos) {
    assert.equal(x.estado, 'DUDOSO', x.texto);
    assert.ok(x.candidatos.length > 0 && x.motivo, x.texto);
    assert.ok(x.candidatos[0].distancia_calle_m <= 300, `${x.texto}: el más cercano está a ${x.candidatos[0].distancia_calle_m} m`);
  }
});

test('D-76: los puntos nuevos no entran a la página de campo hasta la revisión de Miguel (fase 4)', () => {
  const campo = armarCampoApp();
  const permitidos = new Map();
  for (const c of todos) if (c.lat != null && c.metodo !== 'D-76') {
    if (!permitidos.has(c.route_id)) permitidos.set(c.route_id, new Set());
    permitidos.get(c.route_id).add(`${c.lat},${c.lon}`);
  }
  for (const r of campo.rutas) for (const s of Object.values(r.sentidos)) for (const p of s.paradas) {
    if (p.lat == null) continue;
    assert.ok(permitidos.get(r.route_id)?.has(`${p.lat},${p.lon}`), `${r.numero} ${p.texto}: punto que no viene de un cruce anterior a D-76`);
  }
});

// Nada más cambia (D-76 criterio 5): contra la versión de `main` de antes de D-76, deshaciendo
// los puntos nuevos, cruces.json queda idéntico. Solo corre donde hay historia de git y `main`
// aún no trae D-76 (en GitHub Actions el clon es corto: se salta y lo dice).
const base = (() => {
  try {
    const t = execFileSync('git', ['show', 'origin/main:datos/investigacion/cruces.json'], { cwd: new URL('../../', import.meta.url), encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], maxBuffer: 64 << 20 });
    const j = JSON.parse(t);
    return j.rutas.some((r) => r.cruces?.some((c) => c.metodo === 'D-76')) ? null : j;
  } catch { return null; }
})();
test('D-76: fuera de REFERENCIA de negocio → UBICADO POR LUGAR, ningún cruce cambia (contra main)', { skip: base ? false : 'sin origin/main de antes de D-76 (clon corto o ya integrado)' }, () => {
  const deshacer = (c) => (c.metodo === 'D-76'
    ? { orden: c.orden, texto: c.texto, calle: c.calle, cruce_con: c.cruce_con, estado: 'REFERENCIA', osm_calle: c.osm_calle, nota: c.nota_antes }
    : c);
  const limpiar = (o) => JSON.parse(JSON.stringify(o));
  assert.equal(cruces.rutas.length, base.rutas.length);
  cruces.rutas.forEach((r, i) => {
    const b = base.rutas[i];
    const { cruces: rc, conteo: _c, ...resto } = r, { cruces: bc, conteo: _b, ...restoB } = b;
    assert.deepEqual(resto, restoB, r.numero);
    if (!rc) return assert.equal(bc, undefined, r.numero);
    assert.deepEqual(limpiar(rc.map(deshacer)), bc, `${r.numero}: cambió algo fuera del hallazgo b`);
  });
});
