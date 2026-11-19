#!/usr/bin/env node
// R-03 (D-34): propone, para cada extremo sin coordenada, hasta 3 candidatos de
// OpenStreetMap. Sin red: lee extremos.json y datos/cache/overpass/lugares.json.
// NO decide nada: toda propuesta la aprueba, mueve o rechaza Miguel en
// web/confirmar-extremos.html (poka-yoke D-34). Nada se corrige a ojo (lección 4).
//
// Puntaje (0-100, ESTIMADO, solo sirve para ordenar):
//   nombre igual tras normalizar ............ 80
//   un nombre contiene al otro (palabras) ... 65
//   palabras compartidas (Jaccard) ≥ 0.5 .... 60 × Jaccard
//   nombre parecido (Levenshtein ≥ 0.75) ..... 60 × parecido
//   tipo que coincide con la regla del lugar . +20 (o 60 si solo coincide el tipo)
//   colonia/localidad y es place/landuse ..... +15
//   lugar de «2ª Sección» (otra sección) ..... tope 50
// Mínimo para proponer: 40.
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const raiz = new URL('..', import.meta.url).pathname;
const SALIDA = 'datos/investigacion/extremos-propuestas.json';
export const MUNICIPIO = { sur: 20.25, norte: 20.5, oeste: -100.15, este: -99.85 };
const dentro = ([lat, lon]) => lat >= MUNICIPIO.sur && lat <= MUNICIPIO.norte && lon >= MUNICIPIO.oeste && lon <= MUNICIPIO.este;

const SIGLAS = (s) => s.replace(/\b(?:[A-Za-z]\.){2,}[A-Za-z]?/g, (m) => m.replace(/\./g, '')); // C.E.R.E.S.O → CERESO
export const norm = (s) => SIGLAS(s).normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/ª/g, 'A').toUpperCase()
  .replace(/[^A-Z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
const PREFIJOS = /\b(COL|COLONIA|FRACC|FRACCIONAMIENTO)\b/g;
const VACIAS = new Set(['DE', 'DEL', 'LA', 'LAS', 'LOS', 'EL', 'Y']);
const ROMANOS = new Set(['I', 'II', 'III']);
export function palabras(s) {
  return norm(s).replace(PREFIJOS, ' ').split(' ').filter((p) => p && !VACIAS.has(p) && !ROMANOS.has(p));
}
function levenshtein(a, b) {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++) {
    d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  }
  return d[a.length][b.length];
}

// Reglas de tipo, definidas ANTES de ver los resultados.
//   tipo: función(lugarOSM) → true si el tipo coincide; texto: cómo se explica.
//   soloTipo: se puede proponer por tipo aunque el nombre no se parezca.
//   excluir: ids de OSM descartados con su razón (lección 4).
const IMSS = (l) => /\bIMSS\b|SEGURO SOCIAL/i.test(`${l.nombre} ${l.operator ?? ''}`);
const REGLAS = {
  'Central de Autobuses': {
    tipo: (l) => l.amenity === 'bus_station' || l.public_transport === 'station',
    texto: 'tipo coincide: estación de autobuses', soloTipo: true,
    pista: [/CAMIONERA/, 25, 'el nombre dice «camionera» (sinónimo de central de autobuses)'], // si no, el desempate sería por id
  },
  'Universidad Tecnológica (UTSJR)': {
    tipo: (l) => /^(university|college)$/.test(l.amenity ?? '') && /\bUT\b|UNIVERSIDAD TECNOLOGICA/.test(norm(l.nombre)),
    texto: 'tipo coincide: universidad, y el nombre dice UT / Universidad Tecnológica', soloTipo: true,
    excluir: { 'node/10791340913': '«Universidad Tecnológica Bridge» es un lugar distinto (lección 4)' },
  },
  'IMSS': {
    tipo: (l) => /^(hospital|clinic)$/.test(l.amenity ?? '') && IMSS(l),
    texto: 'tipo coincide: hospital o clínica del IMSS', soloTipo: true,
  },
  'Visthá (CERESO)': {
    tipo: (l) => l.amenity === 'prison',
    texto: 'tipo coincide: penal (amenity=prison)', soloTipo: true,
    pista: [/CERESO/, 20, 'el nombre dice CERESO'],
  },
};
const FUERA = { 'Ezequiel Montes': 'fuera del municipio: sin candidato (la consulta cubre solo San Juan del Río; no se inventa)' };

function puntuar(nombreLugar, l, regla) {
  const a = palabras(nombreLugar);
  const b = palabras(l.nombre);
  const razones = [];
  let p = 0;
  if (a.length && b.length) {
    const A = new Set(a), B = new Set(b);
    const comun = [...A].filter((x) => B.has(x)).length;
    const jac = comun / new Set([...A, ...B]).size;
    const ra = a.join(' '), rb = b.join(' ');
    const lev = 1 - levenshtein(ra, rb) / Math.max(ra.length, rb.length);
    if (ra === rb) { p = 80; razones.push('nombre igual'); }
    else if (comun && (comun === A.size || comun === B.size)) { p = 65; razones.push('un nombre contiene al otro'); }
    else if (jac >= 0.5) { p = Math.round(60 * jac); razones.push('comparten palabras del nombre'); }
    else if (lev >= 0.75) { p = Math.round(60 * lev); razones.push(`nombre parecido («${l.nombre}»)`); }
  }
  const tipoOk = regla?.tipo(l) ?? false;
  if (tipoOk) { p = p ? p + 20 : 60; razones.push(regla.texto); }
  if (tipoOk && regla.pista && regla.pista[0].test(norm(l.nombre))) { p += regla.pista[1]; razones.push(regla.pista[2]); }
  if (!tipoOk && !regla && p && (l.place || l.landuse === 'residential')) { p += 15; razones.push('es colonia o localidad en OSM'); }
  if (!tipoOk && !regla && p && !(l.place || l.landuse === 'residential')) razones.push(`tipo distinto (${l.amenity ?? l.public_transport ?? l.landuse}): coincide solo el nombre`);
  if (p && /\bSECCION\b/.test(norm(nombreLugar)) && p > 50) { p = 50; razones.push('el extremo es otra sección: solo referencia de la zona'); }
  return { puntaje: Math.min(p, 100), razon: razones.join('; ') };
}

export function proponer(nombreLugar, lugares) {
  if (FUERA[nombreLugar]) return { candidatos: [], nota: FUERA[nombreLugar], descartados: [] };
  const partes = nombreLugar.includes(' / ') ? nombreLugar.split(' / ') : [nombreLugar];
  const regla = REGLAS[nombreLugar];
  const descartados = [];
  const mejores = new Map();
  for (const parte of partes) for (const l of lugares) {
    if (regla?.excluir?.[l.osm]) { descartados.push({ osm: l.osm, nombre: l.nombre, razon: regla.excluir[l.osm] }); continue; }
    if (!dentro(l.centro)) continue;
    const { puntaje, razon } = puntuar(parte, l, regla);
    if (puntaje < 40) continue;
    const previo = mejores.get(l.osm);
    if (!previo || previo.puntaje < puntaje) {
      mejores.set(l.osm, {
        osm: l.osm, nombre: l.nombre,
        tipo: l.amenity ?? l.public_transport ?? l.place ?? (l.landuse && `landuse=${l.landuse}`) ?? null,
        etiquetas: Object.fromEntries(['amenity', 'place', 'landuse', 'public_transport', 'operator'].filter((k) => l[k]).map((k) => [k, l[k]])),
        centro: l.centro, puntaje,
        razon: partes.length > 1 ? `${razon} (parte «${parte}»)` : razon,
      });
    }
  }
  const candidatos = [...mejores.values()].sort((a, b) => b.puntaje - a.puntaje || a.osm.localeCompare(b.osm)).slice(0, 3);
  return { candidatos, nota: candidatos.length ? null : 'sin candidato en OpenStreetMap (nombre ni tipo coinciden)', descartados: [...new Map(descartados.map((d) => [d.osm, d])).values()] };
}

export function armar() {
  const ext = JSON.parse(readFileSync(`${raiz}datos/investigacion/extremos.json`, 'utf8'));
  const osm = JSON.parse(readFileSync(`${raiz}datos/cache/overpass/lugares.json`, 'utf8'));
  const usan = new Map();
  for (const r of ext.rutas) for (const n of new Set([r.origen, r.destino])) {
    if (!usan.has(n)) usan.set(n, []);
    usan.get(n).push(r.numero);
  }
  const sin = ext.lugares.filter((l) => l.lat === null);
  const lugares = sin.map((l) => {
    const rutas = usan.get(l.lugar) ?? [];
    return { nombre: l.lugar, rutas, ...proponer(l.lugar, osm.lugares) };
  }).sort((a, b) => (b.nombre === 'Central de Autobuses') - (a.nombre === 'Central de Autobuses') || b.rutas.length - a.rutas.length || a.nombre.localeCompare(b.nombre, 'es'));
  return {
    tarea: 'R-03 (D-34)',
    fuente: {
      extremos: 'datos/investigacion/extremos.json',
      lugares_osm: 'datos/cache/overpass/lugares.json',
      sha256_lugares_osm: osm.fuente.sha256_respuesta,
      consultado: osm.fuente.consultado,
      generado: '2026-11-19',
      licencia: osm.fuente.licencia,
    },
    como_leer: [
      'PROPUESTAS, no ubicaciones: ninguna entra a los datos sin que Miguel la apruebe, la mueva o la rechace en web/confirmar-extremos.html (D-34).',
      'puntaje 0-100 (ESTIMADO): solo ordena candidatos; no mide qué tan correcto es. La razón dice por qué se propuso.',
      'El punto de una colonia es su centro en OSM, no donde da vuelta el camión. Todo queda POR VERIFICAR EN CAMPO aunque se apruebe.',
      'Los lugares sin candidato se quedan sin coordenada (no se completan con datos supuestos).',
    ],
    resumen: { lugares: lugares.length, con_candidato: lugares.filter((l) => l.candidatos.length).length, sin_candidato: lugares.filter((l) => !l.candidatos.length).length },
    lugares,
  };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const s = armar();
  writeFileSync(`${raiz}${SALIDA}`, JSON.stringify(s, null, 2) + '\n');
  console.log(`extremos-propuestas.json: ${s.resumen.lugares} lugares, ${s.resumen.con_candidato} con candidato, ${s.resumen.sin_candidato} sin candidato.`);
  for (const l of s.lugares) {
    const c = l.candidatos[0];
    console.log(`${l.nombre} [rutas ${l.rutas.join(',')}] → ${c ? `${c.nombre} (${c.osm}, ${c.tipo}, ${c.puntaje}) · ${c.razon}${l.candidatos.length > 1 ? ` · +${l.candidatos.length - 1}` : ''}` : l.nota}`);
  }
}
