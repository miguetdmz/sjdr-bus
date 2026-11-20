#!/usr/bin/env node
// R-03, hallazgo a (D-32, D-42): separa y ubica los cruces de las listas
// oficiales de R-01 con las calles de OpenStreetMap. Sin red.
//   entrada: datos/investigacion/calles-oficiales.json (R-01; solo las 19
//            listas usables, D-33)
//            datos/cache/overpass/calles.json (D-32)
//            datos/cache/overpass/lugares.json (D-34)
//   salida:  datos/investigacion/cruces.json
//
// La página oficial pega los cruces «CALLE A-CALLE B» uno tras otro, separados
// solo con espacios. Antes de dejar algo POR VERIFICAR se arregla el dato con
// evidencia (D-42):
//   1. Nombres partidos: se elige el corte que mejor coincide con calles reales
//      y con nombres que la misma lista repite («CARR. SAN JUAN DEL RÍO» no se
//      parte en «CARR. SAN JUAN» + «DEL RÍO»).
//   2. Abreviaturas y erratas («LIC.», «GRAL.», «COBARUBIAS», «GELEANA»): se
//      aceptan solo si la calle corregida de verdad toca a la otra calle del
//      cruce en el mapa de OSM (a 30 m o menos). Sin esa prueba no hay
//      corrección (lección 4).
//   3. Negocios y lugares («OFFICE DEPOT», «PARQUE LAS GARZAS»): no son calles.
//      Si el lugar está en OSM junto a la calle, se ubica ahí; si no, el cruce
//      queda como REFERENCIA: confirma la calle por donde pasa el camión, pero
//      no aporta un punto propio.
// Los cruces quedan en el orden de la lista oficial, que todavía junta ida y
// vuelta (hallazgo c): aquí no se asigna sentido (regla 10).
import { readFileSync, writeFileSync } from 'node:fs';

const raiz = new URL('..', import.meta.url).pathname;
const leer = (r) => JSON.parse(readFileSync(`${raiz}${r}`, 'utf8'));
const oficiales = leer('datos/investigacion/calles-oficiales.json');
const osm = leer('datos/cache/overpass/calles.json');
const lugares = leer('datos/cache/overpass/lugares.json');
const extremosRutas = leer('datos/investigacion/extremos.json').rutas;
const extremosFinales = leer('datos/investigacion/extremos-finales.json').lugares;

const UMBRAL_CRUCE_M = 30; // dos calles «se tocan» si sus trazos quedan a ≤ 30 m (ESTIMADO)
const UMBRAL_LUGAR_M = 300; // un lugar de OSM cuenta para el cruce si queda a ≤ 300 m de la calle

// ---------- normalización de nombres ----------
const ABREV = {
  AV: 'AVENIDA', AVE: 'AVENIDA', C: 'CALLE', CALL: 'CALLE', BLVD: 'BOULEVARD', BLV: 'BOULEVARD',
  CARR: 'CARRETERA', CARRET: 'CARRETERA', CTO: 'CIRCUITO', CIR: 'CIRCUITO', PROL: 'PROLONGACION',
  PRIV: 'PRIVADA', CDA: 'CERRADA', CALZ: 'CALZADA', AND: 'ANDADOR', LIC: 'LICENCIADO', LICDO: 'LICENCIADO',
  GRAL: 'GENERAL', GENL: 'GENERAL', PROF: 'PROFESOR', PROFA: 'PROFESORA', PROFR: 'PROFESOR',
  ARQ: 'ARQUITECTO', ING: 'INGENIERO', DR: 'DOCTOR', DRA: 'DOCTORA', STA: 'SANTA', STO: 'SANTO',
  SN: 'SAN', FCO: 'FRANCISCO', JOSE: 'JOSE', MA: 'MARIA', NO: 'NUMERO', NUM: 'NUMERO', FRACC: 'FRACCIONAMIENTO',
  COL: 'COLONIA', CAM: 'CAMINO', LIB: 'LIBRAMIENTO',
};
const TIPOS = new Set(['AVENIDA', 'CALLE', 'BOULEVARD', 'CARRETERA', 'CIRCUITO', 'PROLONGACION', 'PRIVADA',
  'CERRADA', 'CALZADA', 'ANDADOR', 'CAMINO', 'LIBRAMIENTO', 'RETORNO', 'PASAJE']);
const TITULOS = new Set(['LICENCIADO', 'GENERAL', 'PROFESOR', 'PROFESORA', 'ARQUITECTO', 'INGENIERO',
  'DOCTOR', 'DOCTORA', 'CORONEL', 'CAPITAN', 'MAESTRO', 'MAESTRA', 'PRESIDENTE']);
const VACIAS = new Set(['DE', 'DEL', 'LA', 'LAS', 'LOS', 'EL', 'Y', 'E']);
// Un pedazo de nombre no puede empezar con estas palabras ni ser solo un rumbo.
const NO_INICIA = new Set(['DE', 'DEL', 'LA', 'LAS', 'LOS', 'Y', 'E']);
const RUMBOS = new Set(['NORTE', 'SUR', 'ORIENTE', 'PONIENTE', 'OTE', 'PTE', 'NTE']);
// Nombres de pila: solos no identifican una calle («VICENTE»), pero sí pueden
// sobrar en el nombre oficial («BENITO JUÁREZ» → OSM «Avenida Juárez»).
const NOMBRES_PILA = new Set(['BENITO', 'FRANCISCO', 'JOSE', 'MARIA', 'MIGUEL', 'VICENTE', 'IGNACIO', 'JUAN',
  'MANUEL', 'EMILIANO', 'PAVON', 'COSTILLA', 'IGN', 'R']);

const ORDINALES = { 1: 'PRIMERO', 2: 'SEGUNDO', 3: 'TERCERO', 4: 'CUARTO', 5: 'QUINTO' };
const LUGAR = new Set(['PARQUE', 'PLAZA', 'PRIMARIA', 'SECUNDARIA', 'PREPARATORIA', 'ESCUELA', 'COLEGIO',
  'INSTITUTO', 'UNIDAD', 'HOSPITAL', 'CLINICA', 'IMSS', 'ISSSTE', 'TIENDA', 'OXXO', 'SORIANA', 'BODEGA',
  'MERCADO', 'IGLESIA', 'TEMPLO', 'PARROQUIA', 'CENTRO', 'GASOLINERA', 'FARMACIA', 'OFFICE', 'WALMART',
  'AURRERA', 'COPPEL', 'ELEKTRA', 'TELMEX', 'CFE', 'PANTEON', 'CAPILLA', 'JARDIN', 'DEPORTIVA', 'AUDITORIO',
  'PRESIDENCIA', 'TERMINAL', 'FABRICA', 'EMPRESA', 'KINDER', 'JARDIN', 'CBTIS', 'CONALEP', 'COBAQ', 'UTSJR']);
const sinAcentos = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '');
const palabras = (s) => sinAcentos(s).toUpperCase().replace(/[°º]/g, '').replace(/[.,;:"'()#]/g, ' ')
  .split(/\s+/).filter(Boolean).map((w) => ABREV[w] ?? w);
// Núcleo: sin tipo de vía ni títulos; con rumbo aparte.
const nucleo = (s) => palabras(s).filter((w) => !TIPOS.has(w) && !TITULOS.has(w));
const clave = (s) => nucleo(s).join(' ');
const sinRumbo = (ws) => ws.filter((w) => !RUMBOS.has(w));

function lev(a, b, max) {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  let prev = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    let minFila = i;
    for (let j = 1; j <= b.length; j++) {
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      if (cur[j] < minFila) minFila = cur[j];
    }
    if (minFila > max) return max + 1;
    prev = cur;
  }
  return prev[b.length];
}

// ---------- calles de OSM: por nombre, con índice espacial ----------
const CELDA = 0.002; // ~200 m
const celda = (lat, lon) => `${Math.floor(lat / CELDA)}:${Math.floor(lon / CELDA)}`;
const calles = new Map(); // nombre OSM -> { nombre, nucleo, clave, segs: [[p,q]], celdas:Set }
for (const t of osm.tramos) {
  let c = calles.get(t.nombre);
  if (!c) {
    const nu = nucleo(t.nombre);
    c = { nombre: t.nombre, nucleo: nu, clave: nu.join(' '), claveSR: sinRumbo(nu).join(' '), segs: [], celdas: new Map() };
    calles.set(t.nombre, c);
  }
  for (let i = 1; i < t.trazo.length; i++) {
    const s = [t.trazo[i - 1], t.trazo[i]];
    const idx = c.segs.push(s) - 1;
    for (const p of s) {
      const k = celda(p[0], p[1]);
      if (!c.celdas.has(k)) c.celdas.set(k, []);
      c.celdas.get(k).push(idx);
    }
  }
}
const listaCalles = [...calles.values()];
const porClave = new Map();
for (const c of listaCalles) {
  for (const k of new Set([c.clave, c.claveSR])) {
    if (!porClave.has(k)) porClave.set(k, []);
    porClave.get(k).push(c);
  }
}

// Continuaciones: OSM a veces cambia el nombre de una calle a media cuadra
// (la «Francisco Javier Mina» de la lista sigue en OSM como «Claustros»). Una
// calle es continuación de otra si un tramo empieza justo donde termina el
// otro (≤ 5 m) y sigue en la misma dirección (≤ 25°). Solo un paso.
const extremosTramos = [];
for (const t of osm.tramos) {
  if (t.trazo.length < 2) continue;
  const [p0, p1] = [t.trazo[0], t.trazo[1]];
  const [q0, q1] = [t.trazo[t.trazo.length - 1], t.trazo[t.trazo.length - 2]];
  // dirección «hacia afuera» del tramo en cada punta
  extremosTramos.push({ nombre: t.nombre, p: p0, hacia: [p0[0] - p1[0], p0[1] - p1[1]] });
  extremosTramos.push({ nombre: t.nombre, p: q0, hacia: [q0[0] - q1[0], q0[1] - q1[1]] });
}
const continuaciones = new Map(); // nombre -> Set(nombre)
{
  const porCelda = new Map();
  for (const e of extremosTramos) {
    const k = `${Math.floor(e.p[0] / 0.0002)}:${Math.floor(e.p[1] / 0.0002)}`;
    if (!porCelda.has(k)) porCelda.set(k, []);
    porCelda.get(k).push(e);
  }
  const ang = (u, v) => {
    const a = [u[0] * 110574, u[1] * 104300], b = [v[0] * 110574, v[1] * 104300];
    const c = (a[0] * b[0] + a[1] * b[1]) / (Math.hypot(...a) * Math.hypot(...b) || 1);
    return (Math.acos(Math.max(-1, Math.min(1, c))) * 180) / Math.PI;
  };
  for (const e of extremosTramos) {
    const [a, b] = [Math.floor(e.p[0] / 0.0002), Math.floor(e.p[1] / 0.0002)];
    for (let i = -1; i <= 1; i++) for (let j = -1; j <= 1; j++) {
      for (const f of porCelda.get(`${a + i}:${b + j}`) ?? []) {
        if (f.nombre === e.nombre) continue;
        const d = Math.hypot((e.p[0] - f.p[0]) * 110574, (e.p[1] - f.p[1]) * 104300);
        // e sale hacia afuera; f también: si siguen en línea, apuntan en sentidos opuestos
        if (d <= 5 && ang(e.hacia, f.hacia) >= 155) {
          if (!continuaciones.has(e.nombre)) continuaciones.set(e.nombre, new Set());
          continuaciones.get(e.nombre).add(f.nombre);
        }
      }
    }
  }
}

// metros entre dos puntos (aprox. plana, suficiente a escala de ciudad)
const M_LAT = 110574;
const M_LON = 111320 * Math.cos((20.39 * Math.PI) / 180);
const dist = (a, b) => Math.hypot((a[0] - b[0]) * M_LAT, (a[1] - b[1]) * M_LON);
function distPuntoSeg(p, [a, b]) {
  const ax = a[1] * M_LON, ay = a[0] * M_LAT, bx = b[1] * M_LON, by = b[0] * M_LAT;
  const px = p[1] * M_LON, py = p[0] * M_LAT;
  const dx = bx - ax, dy = by - ay;
  const l2 = dx * dx + dy * dy;
  const t = l2 ? Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / l2)) : 0;
  const qx = ax + t * dx, qy = ay + t * dy;
  return { d: Math.hypot(px - qx, py - qy), q: [qy / M_LAT, qx / M_LON] };
}
const vecinas = (k) => {
  const [a, b] = k.split(':').map(Number);
  const r = [];
  for (let i = -1; i <= 1; i++) for (let j = -1; j <= 1; j++) r.push(`${a + i}:${b + j}`);
  return r;
};

// Todos los lugares donde dos calles se tocan (≤ umbral), agrupados a 80 m.
const memoCruce = new Map();
function crucesEntre(c1, c2) {
  const k = c1.nombre < c2.nombre ? `${c1.nombre}|${c2.nombre}` : `${c2.nombre}|${c1.nombre}`;
  if (memoCruce.has(k)) return memoCruce.get(k);
  const puntos = [];
  for (const [ck, idx1] of c1.celdas) {
    for (const vk of vecinas(ck)) {
      const idx2 = c2.celdas.get(vk);
      if (!idx2) continue;
      for (const i of idx1) for (const j of idx2) {
        const s1 = c1.segs[i], s2 = c2.segs[j];
        for (const [p, s] of [[s1[0], s2], [s1[1], s2], [s2[0], s1], [s2[1], s1]]) {
          const { d, q } = distPuntoSeg(p, s);
          if (d <= UMBRAL_CRUCE_M) puntos.push({ d, p: [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2] });
        }
      }
    }
  }
  puntos.sort((a, b) => a.d - b.d);
  const grupos = [];
  for (const pt of puntos) if (!grupos.some((g) => dist(g.p, pt.p) < 80)) grupos.push(pt);
  memoCruce.set(k, grupos);
  return grupos;
}
function distCalle(c, p) {
  let mejor = Infinity;
  const k = celda(p[0], p[1]);
  const [a, b] = k.split(':').map(Number);
  const R = 2; // ±2 celdas (~400 m)
  for (let i = -R; i <= R; i++) for (let j = -R; j <= R; j++) {
    for (const idx of c.celdas.get(`${a + i}:${b + j}`) ?? []) mejor = Math.min(mejor, distPuntoSeg(p, c.segs[idx]).d);
  }
  return mejor;
}

// ---------- candidatos de calle para un texto ----------
// tipo: exacto (1.0) · contenido (0.8: uno contiene al otro) · errata (0.7)
const memoCand = new Map();
// Alias locales confirmados por Miguel (D-43): el nombre de la lista oficial
// que la gente usa → la calle de OSM. También aquí se exige la prueba del mapa.
const ALIAS_MIGUEL = {
  'PASEO CENTRAL': 'Avenida Central', // Miguel, 19 nov 2026, 10:05 pm
  INDEPENDENCIA: 'Avenida Juárez', // junto al Jardín Independencia; Miguel, 19 nov 2026, 10:10 pm
  'CARRETERA SAN JUAN DEL RIO': 'Avenida Central', // dentro de la ciudad; Miguel, 19 nov 2026, 10:12 pm
};
const aliasPorClave = new Map(Object.entries(ALIAS_MIGUEL).map(([k, v]) => [clave(k), v]));

function candidatos(texto) {
  if (memoCand.has(texto)) return memoCand.get(texto);
  const nu = nucleo(texto);
  const cl = nu.join(' ');
  const clSR = sinRumbo(nu).join(' ');
  const res = new Map();
  const poner = (c, tipo, score) => { const v = res.get(c.nombre); if (!v || v.score < score) res.set(c.nombre, { calle: c, tipo, score }); };
  if (cl) {
    // alias de Miguel: igual o con una errata («PACESO CENTRAL»)
    for (const [k, v] of aliasPorClave) {
      const max = k.length >= 7 ? 1 : 0;
      if ((k === cl || lev(k, cl, max) <= max) && calles.has(v)) poner(calles.get(v), 'alias de Miguel (D-43)', 1);
    }
    for (const c of porClave.get(cl) ?? []) poner(c, 'exacto', 1);
    for (const c of porClave.get(clSR) ?? []) poner(c, 'exacto', 0.95);
    // número como ordinal: «ARTICULO 3°» → «Artículo Tercero»
    const nuOrd = nu.map((w) => ORDINALES[w] ?? w).join(' ');
    if (nuOrd !== cl) for (const c of porClave.get(nuOrd) ?? []) poner(c, 'ordinal', 0.9);
    const sig = sinRumbo(nu).filter((w) => !VACIAS.has(w));
    const largo = sig.join('').length;
    for (const c of listaCalles) {
      if (res.has(c.nombre)) continue;
      const cs = sinRumbo(c.nucleo).filter((w) => !VACIAS.has(w));
      if (!cs.length || !sig.length) continue;
      // contenido: el nombre oficial está completo dentro del de OSM (OSM trae el
      // nombre más largo: «MERCEDES CAMACHO» → «Profesora Mercedes Camacho»).
      // Al revés no: un texto largo que contiene una calle corta suele ser un
      // corte mal hecho. Una inicial («R.») cuenta como la palabra que empieza así.
      if (sig.length <= cs.length && sig.join('').length >= 5 && !(sig.length === 1 && NOMBRES_PILA.has(sig[0]))) {
        let i = 0;
        for (const w of cs) if (i < sig.length && (w === sig[i] || (sig[i].length === 1 && w[0] === sig[i]))) i++;
        if (i === sig.length) { poner(c, 'contenido', 0.5 + 0.3 * (sig.length / cs.length)); continue; }
      }
      // parcial: OSM trae el nombre corto y el oficial le agrega UN nombre de
      // pila o título («BENITO JUÁREZ» → «Avenida Juárez»). Solo vale con la
      // prueba del mapa.
      if (cs.length === sig.length - 1 && cs.join('').length >= 5) {
        let i = 0;
        let sobra = null;
        for (const w of sig) { if (i < cs.length && w === cs[i]) i++; else sobra = w; }
        if (i === cs.length && NOMBRES_PILA.has(sobra)) { poner(c, 'parcial', 0.55); continue; }
      }
      // errata: distancia de edición pequeña sobre el núcleo
      if (largo >= 5) {
        const max = largo >= 7 ? 2 : 1;
        const a = sig.join(' '), b = cs.join(' ');
        if (Math.abs(a.length - b.length) <= max && a[0] === b[0] && lev(a, b, max) <= max) poner(c, 'errata', 0.7);
      }
    }
  }
  const out = [...res.values()].sort((a, b) => b.score - a.score).slice(0, 12);
  memoCand.set(texto, out);
  return out;
}

// ---------- lugares de OSM (negocios, escuelas, clínicas…) ----------
function lugarDe(texto, cerca) {
  const ws = new Set(nucleo(texto).filter((w) => !VACIAS.has(w) && w.length >= 3));
  if (!ws.size) return null;
  let mejor = null;
  for (const l of lugares.lugares) {
    const lw = new Set(nucleo(l.nombre).filter((w) => !VACIAS.has(w) && w.length >= 3));
    let comunes = 0;
    for (const w of ws) if (lw.has(w)) comunes++;
    const cobertura = comunes / ws.size;
    if (cobertura < 0.6 || comunes < 2) continue;
    if (cerca && distCalle(cerca, l.centro) > UMBRAL_LUGAR_M) continue;
    if (!mejor || cobertura > mejor.cobertura) mejor = { lugar: l, cobertura };
  }
  return mejor?.lugar ?? null;
}

// ---------- separación de una lista ----------
function puntajeTexto(ws, repetidos) {
  if (!ws.length) return -Infinity;
  // Empezar con «DE», «DEL», «LA»… solo vale si es una calle real («Del
  // Granito», «De la Cantera»).
  if (NO_INICIA.has(ws[0]) && !candidatos(ws.join(' ')).some((x) => x.score >= 0.95)) return -5;
  if (ws.every((w) => RUMBOS.has(w))) return -5;
  const ultima = ws[ws.length - 1];
  if (TIPOS.has(ultima) || NO_INICIA.has(ultima) || TITULOS.has(ultima) || LUGAR.has(ultima)) return -5;
  const t = ws.join(' ');
  // Para decidir el corte no cuentan las coincidencias débiles (parcial,
  // continuación): un texto con una palabra de sobra no debe ganar el corte.
  const c = candidatos(t).filter((x) => x.tipo !== 'parcial');
  let s = c.length ? c[0].score : 0;
  if (repetidos.has(clave(t))) s += 0.6; // la lista misma lo repite como nombre completo
  return s;
}

// Nombres que la lista repite completos entre guiones: «…-X Y Z-…» se cuenta
// cuando un mismo texto aparece como pedazo de varios cortes posibles.
function nombresRepetidos(partes) {
  // propio: aparece como principio o final de un pedazo (o es el primero o el
  // último de la lista). entero: es un pedazo completo entre dos guiones. Un
  // pedazo entero que se repite casi siempre es la misma parada en ida y en
  // vuelta, así que solo cuenta si el nombre también aparece como propio.
  const propio = new Map();
  const entero = new Map();
  const suma = (m, o) => { const c = clave(o); if (c.split(' ').length >= 2 || c.length >= 6) m.set(c, (m.get(c) ?? 0) + 1); };
  partes.forEach((p, i) => {
    const w = p.trim().split(/\s+/);
    const opciones = new Set();
    if (i === 0 || i === partes.length - 1) opciones.add(w.join(' '));
    else suma(entero, w.join(' '));
    for (let k = 1; k < w.length; k++) { opciones.add(w.slice(0, k).join(' ')); opciones.add(w.slice(k).join(' ')); }
    for (const o of opciones) suma(propio, o);
  });
  const cuenta = new Map(propio);
  for (const [c, n] of entero) if (propio.has(c)) cuenta.set(c, propio.get(c) + n);
  // Si un nombre repetido cabe dentro de otro más largo que se repite igual o
  // más («SAN JUAN» dentro de «SAN JUAN DEL RIO»), para el puntaje solo cuenta
  // el largo; para no cortar a la mitad, cuentan todos.
  const rep = [...cuenta].filter(([, n]) => n >= 2);
  const largos = new Set(rep.filter(([c, n]) => !rep.some(([d, m]) => d !== c && d.includes(c) && m >= n)).map(([c]) => c));
  largos.todos = new Set(rep.map(([c]) => c));
  return largos;
}

const esLugar = (texto) => LUGAR.has(palabras(texto)[0]);
// Un negocio o lugar («PLAZA MORELOS», «PARQUE LAS GARZAS») solo se toma como
// calle si OSM tiene una calle con ese nombre exacto.
const candidatosCalle = (texto) => (esLugar(texto) ? candidatos(texto).filter((c) => c.tipo === 'exacto') : candidatos(texto));

// Todas las formas de ubicar el cruce: cada par de calles candidatas que se
// tocan, con cada lugar donde se tocan. Ordenadas de mejor a peor nombre.
const memoPar = new Map();
function opcionesCruce(textoA, textoB) {
  const k = `${textoA}|${textoB}`;
  if (memoPar.has(k)) return memoPar.get(k);
  const ca = candidatosCalle(textoA), cb = candidatosCalle(textoB);
  const ops = [];
  for (const a of ca) for (const b of cb) {
    if (a.calle === b.calle) continue;
    for (const x of crucesEntre(a.calle, b.calle)) ops.push({ s: a.score + b.score, a, b, x });
  }
  // Sin cruce directo: probar la continuación en línea recta de cualquiera de
  // las dos calles (cuesta 0.3 de puntaje y queda anotada).
  if (!ops.length) {
    const extender = (lista) => lista.flatMap((c) => [...(continuaciones.get(c.calle.nombre) ?? [])]
      .map((n) => ({ calle: calles.get(n), tipo: 'continuación', score: c.score - 0.3, de: c })));
    for (const [la, lb] of [[extender(ca), cb], [ca, extender(cb)]]) {
      for (const a of la) for (const b of lb) {
        if (a.calle === b.calle) continue;
        for (const x of crucesEntre(a.calle, b.calle)) ops.push({ s: a.score + b.score, a, b, x });
      }
    }
  }
  ops.sort((m, n) => n.s - m.s || m.x.d - n.x.d);
  memoPar.set(k, ops);
  return ops;
}
const mejorParCalles = (A, B) => opcionesCruce(A, B)[0] ?? null;

// ¿El corte cae a la mitad de un nombre repetido de 2+ palabras? (5 puntos)
function partido(c, repetidos) {
  const ws = [...c.izq, ...(c.medio ?? []), ...c.der];
  const cortes = [c.izq.length, c.izq.length + (c.medio?.length ?? 0)].filter((k) => k > 0 && k < ws.length);
  for (let a = 0; a < ws.length; a++) for (let b = a + 2; b <= ws.length; b++) {
    const k = cortes.find((x) => x > a && x < b);
    if (k === undefined) continue;
    // a los dos lados del corte debe quedar algo del nombre (no solo «AV.»)
    if (!nucleo(ws.slice(a, k).join(' ')).length || !nucleo(ws.slice(k, b).join(' ')).length) continue;
    const cl = clave(ws.slice(a, b).join(' '));
    // solo cuenta si el nombre repetido existe en OSM (filtra pedazos sueltos
    // que se repiten porque ida y vuelta repiten paradas)
    if (cl.includes(' ') && (repetidos.todos ?? repetidos).has(cl) && (candidatos(cl)[0]?.score ?? 0) >= 0.7) return 5;
  }
  return 0;
}

function separar(texto) {
  const partes = texto.split('-');
  const repetidos = nombresRepetidos(partes);
  const n = partes.length;
  // opciones de corte del pedazo i (1..n-2): [B_i, A_{i+1}]
  const cortes = partes.map((p, i) => {
    const w = p.trim().split(/\s+/);
    if (i === 0 || i === n - 1) return [{ izq: w, der: w }];
    const r = [];
    for (let k = 1; k < w.length; k++) r.push({ izq: w.slice(0, k), der: w.slice(k), medio: [] });
    // A veces la lista trae una calle suelta, sin cruce, entre dos cruces
    // («…-LEONARDO BRAVO CALLE FRANCISCO JAVIER MINA 5 DE MAYO-…»): corte en tres.
    for (let k = 1; k < w.length - 1; k++) for (let m = k + 1; m < w.length; m++) {
      r.push({ izq: w.slice(0, k), medio: w.slice(k, m), der: w.slice(m) });
    }
    return r.length ? r : [{ izq: w, der: [], medio: [] }];
  });
  const pt = (ws) => (ws.length ? puntajeTexto(palabras(ws.join(' ')), repetidos) : -Infinity);
  // programación dinámica: estado = corte elegido en el pedazo i
  let dp = cortes[0].map((c) => ({ s: 0, camino: [c] }));
  for (let i = 1; i < n; i++) {
    const nuevo = [];
    for (const c of cortes[i]) {
      let mejor = null;
      for (const prev of dp) {
        const ult = prev.camino[prev.camino.length - 1];
        const A = ult.der.join(' ');
        const B = c.izq.join(' ');
        let s = prev.s + pt(ult.der) + pt(c.izq);
        // no cortar a la mitad un nombre que la lista repite («SAN JUAN | DEL RÍO»)
        s -= partido(c, repetidos);
        // la calle suelta solo se acepta si es una calle exacta de OSM; cuesta un poco
        if (c.medio?.length) {
          const cm = candidatos(c.medio.join(' '))[0];
          s += cm && cm.score >= 0.95 && !NO_INICIA.has(palabras(c.medio[0])[0]) ? cm.score - 1.2 : -10;
        }
        if (A && B && mejorParCalles(A, B)) s += 1; // las dos calles se tocan en el mapa
        if (!mejor || s > mejor.s) mejor = { s, camino: [...prev.camino, c] };
      }
      nuevo.push(mejor);
    }
    dp = nuevo;
  }
  const camino = dp.sort((a, b) => b.s - a.s)[0].camino;
  const pares = [];
  // Si el mejor corte de un pedazo parte un nombre que la lista repite, es
  // porque el nombre trae su propio guion («JURICA-SAN JUAN DEL RÍO»): los dos
  // cruces que tocan ese corte quedan dudosos (POR VERIFICAR), sin adivinar.
  const dudoso = camino.map((c, i) => i > 0 && i < n - 1 && partido(c, repetidos) > 0);
  for (let i = 1; i < n; i++) {
    const par = [camino[i - 1].der.join(' '), camino[i].izq.join(' ')];
    par.dudoso = dudoso[i - 1] || dudoso[i];
    pares.push(par);
    if (camino[i].medio?.length) pares.push([camino[i].medio.join(' '), '']);
  }
  return pares;
}

// ---------- ubicar cada cruce ----------
// Una calle con el mismo nombre existe en varios pueblos del municipio, así que
// cada cruce puede tener varias ubicaciones posibles. Se eligen todas a la vez
// (programación dinámica, como un Viterbi): la lista va parada tras parada, así
// que la mejor elección es la que junta buenos nombres con saltos cortos entre
// cruces seguidos. Un error ya no arrastra a los siguientes.
//   - Corredor: solo cuentan ubicaciones cerca de la ruta: el círculo que
//     cubre sus dos extremos (extremos-finales.json) más 3 km. Sin extremos,
//     el centro de las mejores opciones con 8 km.
//   - Salto máximo entre dos cruces ubicados seguidos: 3 km (ESTIMADO).
const SALTO_MAX_M = 3000;
const MARGEN_M = 3000;
function mediana(nums) { const v = [...nums].sort((a, b) => a - b); return v[Math.floor(v.length / 2)]; }
function corredor(numero, pares) {
  const r = extremosRutas.find((x) => x.numero === numero);
  const pts = r ? [r.origen, r.destino].map((l) => extremosFinales.find((x) => x.lugar === l)).filter((x) => x?.lat != null).map((x) => [x.lat, x.lon]) : [];
  if (pts.length === 2) {
    const c = [(pts[0][0] + pts[1][0]) / 2, (pts[0][1] + pts[1][1]) / 2];
    return { centro: c, radio: dist(pts[0], pts[1]) / 2 + MARGEN_M, fuente: 'extremos de la ruta' };
  }
  const primeras = pares.map(([A, B]) => (B ? opcionesCruce(A, B)[0] : null)).filter(Boolean);
  if (!primeras.length) return null;
  return { centro: [mediana(primeras.map((o) => o.x.p[0])), mediana(primeras.map((o) => o.x.p[1]))], radio: 8000, fuente: 'mediana de los cruces' };
}
function elegir(pares, cor) {
  const ops = pares.map(([A, B], i) => (B && !pares[i].dudoso ? opcionesCruce(A, B) : []).filter((o) => !cor || dist(o.x.p, cor.centro) <= cor.radio).slice(0, 30));
  // mejor[i][k]: mejor puntaje terminando con la opción k del cruce i
  const mejor = ops.map((l) => l.map(() => ({ v: -Infinity, prev: null })));
  let top = { v: 0, i: -1, k: -1 };
  for (let i = 0; i < ops.length; i++) {
    ops[i].forEach((o, k) => {
      const gana = 2 + o.s;
      let m = { v: gana, prev: null }; // empezar aquí
      for (let j = Math.max(0, i - 6); j < i; j++) {
        ops[j].forEach((q, h) => {
          const d = dist(q.x.p, o.x.p);
          if (d > SALTO_MAX_M) return;
          const v = mejor[j][h].v + gana - d / 1000;
          if (v > m.v) m = { v, prev: [j, h] };
        });
      }
      // también puede venir del mejor camino que termina antes de i - 6
      if (top.v > 0 && top.i < i - 6 && top.v + gana > m.v) m = { v: top.v + gana, prev: [top.i, top.k] };
      mejor[i][k] = m;
    });
    ops[i].forEach((o, k) => { if (mejor[i][k].v > top.v) top = { v: mejor[i][k].v, i, k }; });
    // el mejor camino terminado hasta i (para saltar tramos sin ubicar)
  }
  const elegido = new Array(pares.length).fill(null);
  let cur = top.i >= 0 ? [top.i, top.k] : null;
  while (cur) { elegido[cur[0]] = ops[cur[0]][cur[1]]; cur = mejor[cur[0]][cur[1]].prev; }
  return elegido;
}
function ubicar(pares, numero) {
  const cor = corredor(numero, pares);
  const elegido = elegir(pares, cor);
  const dentro = (p) => !cor || dist(p, cor.centro) <= cor.radio;
  return pares.map(([A, B], i) => {
    const base = { orden: i + 1, texto: B ? `${A}-${B}` : A, calle: A, cruce_con: B || null };
    if (!B) {
      const ca = candidatosCalle(A)[0];
      return ca
        ? { ...base, estado: 'REFERENCIA', osm_calle: ca.calle.nombre, nota: 'calle suelta en la lista, sin cruce: confirma la calle, sin punto propio' }
        : { ...base, estado: 'SIN UBICAR', nota: 'calle suelta que no aparece en OSM: POR VERIFICAR' };
    }
    if (pares[i].dudoso) {
      return { ...base, estado: 'SIN UBICAR', nota: 'el nombre parece traer su propio guion y el corte no es seguro: POR VERIFICAR' };
    }
    const par = elegido[i];
    if (par) {
      const correcciones = [par.a, par.b].filter((c) => c.tipo !== 'exacto').map((c) => (c.tipo === 'continuación'
        ? `continuación: «${c === par.a ? A : B}» (OSM «${c.de.calle.nombre}») sigue en línea recta como «${c.calle.nombre}»`
        : `${c.tipo}: «${c === par.a ? A : B}» → «${c.calle.nombre}»`));
      return {
        ...base, estado: 'UBICADO', lat: Number(par.x.p[0].toFixed(5)), lon: Number(par.x.p[1].toFixed(5)),
        osm_calle: par.a.calle.nombre, osm_cruce: par.b.calle.nombre,
        evidencia: `las dos calles se tocan en OSM (${Math.round(par.x.d)} m), dentro del corredor de la ruta`,
        correcciones: correcciones.length ? correcciones : undefined,
      };
    }
    // Si el primer texto es un negocio y el segundo una calle, la calle es el segundo.
    const [tCalle, tRef] = esLugar(A) && !esLugar(B) ? [B, A] : [A, B];
    const ca = candidatosCalle(tCalle)[0];
    const lugar = lugarDe(tRef, ca?.calle);
    if (ca && lugar && dentro(lugar.centro)) {
      return {
        ...base, estado: 'UBICADO POR LUGAR', lat: lugar.centro[0], lon: lugar.centro[1],
        osm_calle: ca.calle.nombre, osm_lugar: `${lugar.nombre} (${lugar.osm})`,
        evidencia: `el lugar está en OSM a ≤ ${UMBRAL_LUGAR_M} m de la calle, dentro del corredor de la ruta`,
      };
    }
    if (ca) {
      const cb = candidatosCalle(tRef)[0];
      if (cb && !esLugar(tRef)) {
        return {
          ...base, estado: 'CALLES SIN CRUCE EN OSM', osm_calle: ca.calle.nombre,
          nota: `las dos calles existen en OSM («${ca.calle.nombre}», «${cb.calle.nombre}») pero no se tocan cerca de la ruta: POR VERIFICAR`,
        };
      }
      return {
        ...base, estado: 'REFERENCIA', osm_calle: ca.calle.nombre,
        nota: 'la calle existe en OSM; la referencia es un negocio o lugar que OSM no tiene: confirma la calle, sin punto propio',
      };
    }
    return { ...base, estado: 'SIN UBICAR', nota: 'la calle no aparece en OSM: POR VERIFICAR' };
  });
}

// ---------- salida ----------
const ESTADOS = ['UBICADO', 'UBICADO POR LUGAR', 'REFERENCIA', 'CALLES SIN CRUCE EN OSM', 'SIN UBICAR'];
const rutas = [];
for (const r of oficiales.rutas) {
  if (!r.usable_sin_revision) {
    rutas.push({ route_id: r.route_id, numero: r.numero, estado: 'lista oficial descartada (D-33): mezcla calles de Querétaro' });
    continue;
  }
  const cruces = ubicar(separar(r.lista_texto), r.numero);
  const conteo = Object.fromEntries(ESTADOS.map((e) => [e, cruces.filter((c) => c.estado === e).length]));
  rutas.push({
    route_id: r.route_id, numero: r.numero, nombre: r.nombre_inventario,
    sentido: 'sin asignar: la lista junta ida y vuelta (hallazgo c, regla 10)',
    total: cruces.length, conteo, cruces,
  });
}
const usadas = rutas.filter((r) => r.cruces);
const total = usadas.reduce((s, r) => s + r.total, 0);
const resumen = { rutas_con_lista_usable: usadas.length, cruces: total };
for (const e of ESTADOS) resumen[e] = usadas.reduce((s, r) => s + r.conteo[e], 0);
resumen.con_correccion = usadas.reduce((s, r) => s + r.cruces.filter((c) => c.correcciones?.length).length, 0);

writeFileSync(`${raiz}datos/investigacion/cruces.json`, JSON.stringify({
  tarea: 'R-03, hallazgo a (D-32, D-42)',
  fuente: {
    lista: oficiales.fuente,
    calles: 'OpenStreetMap vía Overpass, 19 nov 2026 (datos/cache/overpass/calles.json), ODbL 1.0',
    lugares: 'OpenStreetMap vía Overpass, 19 nov 2026 (datos/cache/overpass/lugares.json), ODbL 1.0',
  },
  como_leer: [
    'UBICADO: las dos calles del cruce existen en OSM y se tocan (≤ 30 m); el punto es donde se tocan. Las abreviaturas y erratas corregidas se anotan en «correcciones» y solo se aceptan con esa prueba.',
    'UBICADO POR LUGAR: el cruce es un lugar que OSM tiene junto a la calle.',
    'REFERENCIA: la calle existe en OSM y el cruce es un negocio que OSM no tiene; confirma la calle por donde pasa el camión, sin punto propio.',
    'CALLES SIN CRUCE EN OSM / SIN UBICAR: POR VERIFICAR.',
    'Orden = el de la lista oficial. El sentido aún no se asigna (hallazgo c, regla 10).',
    'Todo punto es ESTIMADO a partir de OSM, no medido en campo.',
  ],
  resumen,
  rutas,
}, null, 1) + '\n');
console.log('cruces.json:', JSON.stringify(resumen));
