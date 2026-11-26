// D-76 (visual para decidir, antes de construir): cruza las REFERENCIA de negocio de
// datos/investigacion/cruces.json contra los 294 lugares de OSM ya guardados
// (datos/cache/overpass/lugares-amplio.json, D-56) y mide la distancia de cada lugar a la
// calle OSM del cruce (datos/cache/overpass/calles.json). Cero consultas nuevas.
// Clasifica con el criterio D-76 PROPUESTA y escribe datos.js para mapa.html.
// No toca cruces.json ni la app. Toda distancia es ESTIMADA (OSM, en línea recta).
// Uso: node docs/evidencia/d76/candidatos.mjs
import { readFileSync, writeFileSync } from 'node:fs';
const leer = (f) => JSON.parse(readFileSync(new URL(`../../../${f}`, import.meta.url)));
const cruces = leer('datos/investigacion/cruces.json');
const lugares = leer('datos/cache/overpass/lugares-amplio.json').lugares;
const tramos = leer('datos/cache/overpass/calles.json').tramos;

// Normalización: la misma idea que scripts/cruces.mjs (núcleo sin tipo de vía, título ni
// palabras vacías; palabras de 3 letras o más).
const ABREV = { AV: 'AVENIDA', AVE: 'AVENIDA', C: 'CALLE', BLVD: 'BOULEVARD', CAR: 'CARRETERA', CARR: 'CARRETERA',
  PROL: 'PROLONGACION', PRIV: 'PRIVADA', LIC: 'LICENCIADO', GRAL: 'GENERAL', PROF: 'PROFESOR', DR: 'DOCTOR',
  STA: 'SANTA', STO: 'SANTO', FCO: 'FRANCISCO', NO: 'NUMERO', NUM: 'NUMERO', FRACC: 'FRACCIONAMIENTO', COL: 'COLONIA' };
const TIPOS = new Set(['AVENIDA', 'CALLE', 'BOULEVARD', 'CARRETERA', 'CIRCUITO', 'PROLONGACION', 'PRIVADA',
  'CERRADA', 'CALZADA', 'ANDADOR', 'CAMINO', 'LIBRAMIENTO', 'RETORNO', 'PASAJE']);
const TITULOS = new Set(['LICENCIADO', 'GENERAL', 'PROFESOR', 'PROFESORA', 'ARQUITECTO', 'INGENIERO', 'DOCTOR',
  'DOCTORA', 'CORONEL', 'CAPITAN', 'MAESTRO', 'MAESTRA', 'PRESIDENTE']);
const VACIAS = new Set(['DE', 'DEL', 'LA', 'LAS', 'LOS', 'EL', 'Y', 'E']);
// Ajuste que sale de este visual: el nombre de la ciudad no identifica un lugar
// («SAN JUAN DEL RÍO» ≠ «Unidad Deportiva San Juan del Río»).
const CIUDAD = new Set(['SAN', 'JUAN', 'RIO', 'SJR', 'QUERETARO']);
// Palabras que marcan el lado del negocio (las mismas de LUGAR en scripts/cruces.mjs).
const LUGAR = new Set(['PARQUE', 'PLAZA', 'PRIMARIA', 'SECUNDARIA', 'PREPARATORIA', 'ESCUELA', 'COLEGIO',
  'INSTITUTO', 'UNIDAD', 'HOSPITAL', 'CLINICA', 'IMSS', 'ISSSTE', 'TIENDA', 'OXXO', 'SORIANA', 'BODEGA',
  'MERCADO', 'IGLESIA', 'TEMPLO', 'PARROQUIA', 'CENTRO', 'GASOLINERA', 'FARMACIA', 'OFFICE', 'WALMART',
  'AURRERA', 'COPPEL', 'ELEKTRA', 'TELMEX', 'CFE', 'PANTEON', 'CAPILLA', 'JARDIN', 'DEPORTIVA', 'AUDITORIO',
  'PRESIDENCIA', 'TERMINAL', 'FABRICA', 'EMPRESA', 'KINDER', 'CBTIS', 'CONALEP', 'COBAQ', 'UTSJR', 'MONUMENTO']);
const nucleo = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toUpperCase()
  .replace(/[.,;:"'()#–-]/g, ' ').split(/\s+/).filter(Boolean).map((w) => ABREV[w] ?? w)
  .filter((w) => !TIPOS.has(w) && !TITULOS.has(w) && !VACIAS.has(w) && w.length >= 3);

// Distancia en metros (aprox. plana, suficiente a escala de ciudad).
const M_LAT = 110_574, M_LON = 111_320 * Math.cos((20.39 * Math.PI) / 180);
function distSeg(p, a, b) {
  const [px, py] = [p[1] * M_LON, p[0] * M_LAT], [ax, ay] = [a[1] * M_LON, a[0] * M_LAT], [bx, by] = [b[1] * M_LON, b[0] * M_LAT];
  const dx = bx - ax, dy = by - ay, L = dx * dx + dy * dy;
  const t = L ? Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / L)) : 0;
  const qx = ax + t * dx, qy = ay + t * dy;
  return { d: Math.hypot(px - qx, py - qy), q: [qy / M_LAT, qx / M_LON] };
}
const porCalle = new Map();
for (const t of tramos) { if (!porCalle.has(t.nombre)) porCalle.set(t.nombre, []); porCalle.get(t.nombre).push(t.trazo); }
function aCalle(nombre, p) {
  let r = { d: Infinity, q: null };
  for (const tr of porCalle.get(nombre) ?? []) for (let i = 1; i < tr.length; i++) { const x = distSeg(p, tr[i - 1], tr[i]); if (x.d < r.d) r = x; }
  return r;
}

const TOPE = 150; // D-76 criterio 3c (ESTIMADO)
const casos = new Map(); // un caso por texto + calle (la misma parada en varias rutas)
let universo = 0;
for (const r of cruces.rutas) for (const x of r.cruces ?? []) {
  if (x.estado !== 'REFERENCIA' || !/negocio/.test(x.nota ?? '')) continue;
  universo++;
  const nc = new Set(nucleo(x.osm_calle));
  const lados = [x.calle, x.cruce_con].filter(Boolean);
  // El lado de la referencia es el que no se parece a la calle de OSM.
  const esLugar = (t) => nucleo(t).some((w) => LUGAR.has(w));
  const ref = lados.length < 2 ? lados[0] ?? x.texto
    : esLugar(lados[1]) && !esLugar(lados[0]) ? lados[1]
    : esLugar(lados[0]) && !esLugar(lados[1]) ? lados[0]
    : nucleo(lados[0]).some((w) => nc.has(w)) ? lados[1] : lados[0];
  const k = `${x.texto}|${x.osm_calle}`;
  if (!casos.has(k)) casos.set(k, { texto: x.texto, referencia: ref, osm_calle: x.osm_calle, rutas: [], veces: 0 });
  const c = casos.get(k); c.veces++; if (!c.rutas.includes(r.numero)) c.rutas.push(r.numero);
}
function clasificar(c, sinCiudad) {
  const ws = nucleo(c.referencia).filter((w) => !sinCiudad || !CIUDAD.has(w));
  const cands = [];
  for (const l of lugares) {
    const lw = new Set(nucleo(l.nombre).filter((w) => !sinCiudad || !CIUDAD.has(w)));
    const comunes = ws.filter((w) => lw.has(w)).length;
    const cobertura = ws.length ? comunes / ws.length : 0;
    if (cobertura < 0.6 || comunes < 1) continue;
    const { d, q } = aCalle(c.osm_calle, l.centro);
    cands.push({ nombre: l.nombre, osm: l.osm, tipo: l.tipo, centro: l.centro, comunes, cobertura: +cobertura.toFixed(2),
      distancia_calle_m: Math.round(d), punto_calle: q && q.map((v) => +v.toFixed(5)), nombre_ok: comunes >= 2 });
  }
  if (!cands.length) return { estado: 'SIGUE REFERENCIA', motivo: 'ningún lugar de los 294 con nombre parecido', candidatos: [] };
  cands.sort((a, b) => a.distancia_calle_m - b.distancia_calle_m);
  const buenos = cands.filter((x) => x.nombre_ok && x.distancia_calle_m <= TOPE);
  let estado, motivo;
  if (buenos.length === 1) { estado = 'PUNTO NUEVO'; motivo = `${buenos[0].nombre} a ${buenos[0].distancia_calle_m} m de ${c.osm_calle}`; }
  else if (buenos.length > 1) { estado = 'DUDOSO'; motivo = `${buenos.length} lugares cumplen (no se adivina)`; }
  else if (cands.some((x) => !x.nombre_ok && x.distancia_calle_m <= TOPE)) { estado = 'DUDOSO'; motivo = 'una sola palabra en común'; }
  else if (cands[0].distancia_calle_m <= 300) { estado = 'DUDOSO'; motivo = `el más cercano está a ${cands[0].distancia_calle_m} m (más de 150 m)`; }
  else { estado = 'DUDOSO LEJANO'; motivo = `el más cercano está a ${cands[0].distancia_calle_m} m: casi seguro otro lugar`; }
  return { estado, motivo, candidatos: cands.slice(0, 5) };
}
const salida = [];
for (const c of casos.values()) {
  const escrito = clasificar(c, false), ajustado = clasificar(c, true);
  const falso = escrito.estado === 'PUNTO NUEVO' && ajustado.estado !== 'PUNTO NUEVO';
  salida.push(falso
    ? { ...c, estado: 'FALSO ACEPTADO', motivo: `el criterio escrito lo aceptaba (${escrito.motivo}); solo coincide el nombre de la ciudad`, candidatos: escrito.candidatos }
    : { ...c, ...ajustado });
}
// Para el mapa: los tramos de la calle del cruce cerca del primer candidato (≤ 2 km).
for (const s of salida) {
  if (!s.candidatos.length) continue;
  const c0 = s.candidatos[0].centro;
  s.trazos_calle = (porCalle.get(s.osm_calle) ?? []).filter((tr) => tr.some((p) => distSeg(p, c0, c0).d <= 2000));
}
const orden = { 'PUNTO NUEVO': 0, DUDOSO: 1, 'FALSO ACEPTADO': 2, 'DUDOSO LEJANO': 3, 'SIGUE REFERENCIA': 4 };
salida.sort((a, b) => orden[a.estado] - orden[b.estado] || b.veces - a.veces || a.texto.localeCompare(b.texto));
const cuenta = (e) => salida.filter((s) => s.estado === e).reduce((n, s) => n + s.veces, 0);
const casosDe = (e) => salida.filter((s) => s.estado === e).length;
const resumen = { referencias_de_negocio: universo, paradas_distintas: salida.length,
  ...Object.fromEntries(Object.keys(orden).map((e) => [e, { veces_en_listas: cuenta(e), paradas_distintas: casosDe(e) }])) };
const datos = { generado: 'docs/evidencia/d76/candidatos.mjs', nota: 'ESTIMADO: distancias en línea recta sobre OSM, no medidas en campo. Visual para decidir D-76; no cambia ningún dato.', tope_m: TOPE, resumen, casos: salida };
writeFileSync(new URL('./candidatos.json', import.meta.url), JSON.stringify(datos, null, 1) + '\n');
writeFileSync(new URL('./datos.js', import.meta.url), `window.D76 = ${JSON.stringify(datos)};\n`);
console.log(JSON.stringify(resumen, null, 1));
for (const s of salida.filter((s) => s.estado !== 'SIGUE REFERENCIA')) console.log(`${s.estado.padEnd(14)} ×${s.veces} ${s.rutas.join(',')} «${s.texto}» → ${s.motivo}`);
