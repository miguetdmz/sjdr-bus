#!/usr/bin/env node
// R-02 (D-24): origen y destino de las 40 rutas vigentes (D-36) con coordenada.
// Orden de fuentes: 1) coordenadas verificadas de HANDOFF §11.3; 2) parada de OSM
// (N-08) con el mismo nombre; 3) Nominatim, una consulta por segundo, en caché.
// Todo lo nuevo entra POR VERIFICAR. Lo que cae fuera del municipio, no coincide en
// nombre, es una calle o tiene dos candidatos lejanos se descarta (lección 4): el
// extremo queda SIN COORDENADA. Nada se corrige a ojo: toda coordenada sale tal
// cual de §11.3, de stops.txt o de una respuesta guardada en caché.
//
//   node scripts/extremos.mjs --consultar   consulta Nominatim lo que falte en caché
//   node scripts/extremos.mjs               arma datos/investigacion/extremos.json (sin red)
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { leerCSV } from './lib/csv.mjs';
import { tablaDeSeccion } from './lib/handoff.mjs';

const raiz = new URL('..', import.meta.url).pathname;
const CACHE = 'datos/cache/nominatim';
const SALIDA = 'datos/investigacion/extremos.json';
const json = (v) => JSON.stringify(v, null, 2) + '\n';
const norm = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/ª/g, 'A').toUpperCase()
  .replace(/[^A-Z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();

// Rectángulo del municipio de San Juan del Río (ESTIMADO, trazado a mano alrededor
// del municipio; sirve para descartar resultados como la Central de Cadereyta).
export const MUNICIPIO = { sur: 20.25, norte: 20.5, oeste: -100.15, este: -99.85 };
const dentro = (lat, lon, c = MUNICIPIO) => lat >= c.sur && lat <= c.norte && lon >= c.oeste && lon <= c.este;

// HANDOFF §11.3: {lugar normalizado → [lat, lon]} tal cual vienen escritas.
const verificadas = new Map(tablaDeSeccion('### 11.3').map(([lugar, lat, lon]) => [norm(lugar), { lugar, lat, lon }]));

// Cómo se resuelve cada extremo del inventario. Definido ANTES de ver respuestas.
//   ref: lugar de §11.3 que se usa; zona: true si es punto de referencia de una
//   zona y no la terminal; q: consulta a Nominatim; nombres: nombres aceptados
//   (normalizados); fuera: área esperada si el lugar está fuera del municipio;
//   instalacion: true si es un edificio o instalación (acepta cualquier tipo de
//   OSM menos calle). Sin esa marca es colonia o localidad: solo se acepta
//   place/* o boundary/* (un parque o mercado con el mismo nombre no prueba que
//   sea el extremo; regla endurecida el 19 nov 2026 tras ver «Las Torres» = parque).
export const LUGARES = {
  'Centro': { ref: 'Plaza Independencia', zona: true },
  'San Juan del Río': { ref: 'Plaza Independencia', zona: true },
  'Pedregoso': { ref: 'Pedregoso' },
  'Hospital General': { ref: 'Hospital General' },
  'Las Águilas': { ref: 'Las Águilas' },
  'Loma Alta': { ref: 'Loma Alta' },
  'San Pedro Ahuacatlán': { ref: 'San Pedro Ahuacatlán' },
  'Tequisquiapan': { ref: 'Tequisquiapan' },
  'Parque Industrial': { ref: 'Parque Industrial' },
  'Central de Autobuses': { q: 'Central de Autobuses, San Juan del Río, Querétaro', nombres: ['CENTRAL DE AUTOBUSES', 'CENTRAL DE AUTOBUSES SAN JUAN DEL RIO', 'TERMINAL DE AUTOBUSES SAN JUAN DEL RIO', 'CENTRAL CAMIONERA', 'CENTRAL CAMIONERA SAN JUAN DEL RIO'], instalacion: true },
  '5 de Mayo': { q: '5 de Mayo, San Juan del Río, Querétaro', nombres: ['5 DE MAYO', 'CINCO DE MAYO', 'PARADERO 5 DE MAYO'] },
  'Universidad Tecnológica (UTSJR)': { q: 'Universidad Tecnológica de San Juan del Río', nombres: ['UNIVERSIDAD TECNOLOGICA DE SAN JUAN DEL RIO', 'UTSJR'], instalacion: true },
  'Infonavit La Paz': { q: 'Infonavit La Paz, San Juan del Río', nombres: ['INFONAVIT LA PAZ'] },
  'Valle Real': { q: 'Valle Real, San Juan del Río', nombres: ['VALLE REAL'] },
  'La Peña': { q: 'La Peña, San Juan del Río', nombres: ['LA PENA'] },
  'Francisco Villa': { q: 'Francisco Villa, San Juan del Río', nombres: ['FRANCISCO VILLA', 'COLONIA FRANCISCO VILLA'] },
  // D-35: Miguel corrige el nombre del lugar (el inventario dice «Col. Industrial Nuevo San Juan»).
  'Nuevo Parque Industrial': { q: 'Nuevo San Juan, San Juan del Río', nombres: ['NUEVO PARQUE INDUSTRIAL', 'PARQUE INDUSTRIAL NUEVO SAN JUAN', 'INDUSTRIAL NUEVO SAN JUAN'] },
  'Col. Industrial Nuevo San Juan': { q: 'Nuevo San Juan, San Juan del Río', nombres: ['INDUSTRIAL NUEVO SAN JUAN', 'COLONIA INDUSTRIAL NUEVO SAN JUAN', 'NUEVO SAN JUAN'] },
  'Pedregoso 2ª Sección': { q: 'Pedregoso 2a Sección, San Juan del Río', nombres: ['PEDREGOSO 2A SECCION', 'PEDREGOSO SEGUNDA SECCION', 'EL PEDREGOSO 2A SECCION'] },
  'San Isidro': { q: 'San Isidro, San Juan del Río', nombres: ['SAN ISIDRO'] },
  'Fracc. La Rueda': { q: 'La Rueda, San Juan del Río', nombres: ['LA RUEDA', 'FRACCIONAMIENTO LA RUEDA'] },
  'La Rueda': { q: 'La Rueda, San Juan del Río', nombres: ['LA RUEDA', 'FRACCIONAMIENTO LA RUEDA'] },
  'Cerro Gordo': { q: 'Cerro Gordo, San Juan del Río', nombres: ['CERRO GORDO'] },
  'Carrizo': { q: 'El Carrizo, San Juan del Río', nombres: ['CARRIZO', 'EL CARRIZO'] },
  'Granjas Banthí': { q: 'Granjas Banthí, San Juan del Río', nombres: ['GRANJAS BANTHI'] },
  'Solares Banthí': { q: 'Solares Banthí, San Juan del Río', nombres: ['SOLARES BANTHI'] },
  'Barrio de la Cruz': { q: 'Barrio de la Cruz, San Juan del Río', nombres: ['BARRIO DE LA CRUZ'] },
  'Lomas del Pedregal': { q: 'Lomas del Pedregal, San Juan del Río', nombres: ['LOMAS DEL PEDREGAL'] },
  'Praderas del Sol': { q: 'Praderas del Sol, San Juan del Río', nombres: ['PRADERAS DEL SOL'] },
  'Las Torres': { q: 'Las Torres, San Juan del Río', nombres: ['LAS TORRES'] },
  'Rancho de Enmedio': { q: 'Rancho de Enmedio, San Juan del Río', nombres: ['RANCHO DE ENMEDIO', 'RANCHO DE EN MEDIO'] },
    'Visthá': { q: 'Visthá, San Juan del Río', nombres: ['VISTHA'] },
  'Manantiales / Nogales': { compuesto: 'el inventario nombra dos lugares como un solo extremo' },
  'Manantiales': { q: 'Manantiales, San Juan del Río', nombres: ['MANANTIALES'] },
  'Nogales': { q: 'Nogales, San Juan del Río', nombres: ['NOGALES', 'LOS NOGALES'] },
  'IMSS': { q: 'IMSS, San Juan del Río', nombres: ['IMSS'], instalacion: true },
  'Valle Dorado I': { q: 'Valle Dorado, San Juan del Río', nombres: ['VALLE DORADO I', 'VALLE DORADO 1', 'VALLE DORADO PRIMERA SECCION'] },
  'Valle Dorado II': { q: 'Valle Dorado, San Juan del Río', nombres: ['VALLE DORADO II', 'VALLE DORADO 2', 'VALLE DORADO SEGUNDA SECCION'] },
  'Ezequiel Montes': { q: 'Ezequiel Montes, Querétaro', nombres: ['EZEQUIEL MONTES'], fuera: 'otro municipio (destino de la intermunicipal 023)' },
};

const slug = (q) => norm(q).toLowerCase().replace(/ /g, '-');
const archivoCache = (q) => `${raiz}${CACHE}/${slug(q)}.json`;

// ---------------------------------------------------------------------------
// Consulta (solo con --consultar): una por segundo, nunca repetida.
if (process.argv[2] === '--consultar') {
  mkdirSync(`${raiz}${CACHE}`, { recursive: true });
  const consultas = [...new Set(Object.values(LUGARES).filter((l) => l.q).map((l) => l.q))];
  for (const q of consultas) {
    if (existsSync(archivoCache(q))) continue;
    const url = new URL('https://nominatim.openstreetmap.org/search');
    url.search = new URLSearchParams({ q, format: 'jsonv2', limit: '5', countrycodes: 'mx', addressdetails: '0', 'accept-language': 'es' });
    const r = await fetch(url, { headers: { 'User-Agent': 'SJDRbus-datos/0.1 (proyecto ciudadano de codigo abierto)' } });
    const consultado = new Date().toLocaleString('sv-SE', { timeZone: 'America/Mexico_City' }).replace(' ', 'T') + '-06:00';
    if (!r.ok) { console.error(`NOMINATIM ${r.status} en «${q}»: se detiene`); process.exit(1); }
    writeFileSync(archivoCache(q), json({ consulta: q, url: url.toString(), consultado, respuesta: await r.json() }));
    console.log(`NOMINATIM: «${q}» guardada`);
    await new Promise((ok) => setTimeout(ok, 1100));
  }
}

// ---------------------------------------------------------------------------
// Armado (sin red).
const paradas = leerCSV(`${raiz}datos/gtfs-sjr/stops.txt`);
const km = (a, b) => {
  const r = (g) => (g * Math.PI) / 180;
  const h = Math.sin(r(b.lat - a.lat) / 2) ** 2 + Math.cos(r(a.lat)) * Math.cos(r(b.lat)) * Math.sin(r(b.lon - a.lon) / 2) ** 2;
  return 12742 * Math.asin(Math.sqrt(h));
};

function resolver(lugar) {
  const def = LUGARES[lugar];
  if (!def) throw new Error(`extremo sin regla: «${lugar}»`);
  const sin = (motivo) => ({ lugar, lat: null, lon: null, estado: 'SIN COORDENADA · POR VERIFICAR', motivo });
  if (def.compuesto) return sin(def.compuesto);
  if (def.ref) {
    const v = verificadas.get(norm(def.ref));
    return {
      lugar, lat: v.lat, lon: v.lon,
      punto: def.zona ? `${v.lugar} (punto de referencia de la zona, no la terminal)` : v.lugar,
      fuente: 'HANDOFF §11.3 (verificada en la práctica con Nominatim)',
      estado: def.zona ? 'REFERENCIA DE ZONA · POR VERIFICAR' : 'VERIFICADA (HANDOFF §11.3)',
    };
  }
  const p = paradas.find((s) => def.nombres.includes(norm(s.stop_name)));
  if (p) return { lugar, lat: p.stop_lat, lon: p.stop_lon, punto: p.stop_name, fuente: `OpenStreetMap ${p.osm_id} (stops.txt, consulta ${p.fecha})`, estado: 'POR VERIFICAR' };
  if (!existsSync(archivoCache(def.q))) return sin(`falta la consulta a Nominatim «${def.q}» en caché`);
  const cache = JSON.parse(readFileSync(archivoCache(def.q), 'utf8'));
  const validos = [];
  const descartes = [];
  for (const r of cache.respuesta) {
    const nombre = r.name || r.display_name.split(',')[0];
    const lat = Number(r.lat), lon = Number(r.lon);
    if (!def.nombres.includes(norm(nombre))) descartes.push(`«${nombre}»: el nombre no coincide`);
    else if (r.category === 'highway') descartes.push(`«${nombre}»: es una calle, no el lugar`);
    else if (!def.instalacion && !['place', 'boundary'].includes(r.category)) descartes.push(`«${nombre}»: es ${r.category}/${r.type}, no una colonia o localidad`);
    else if (def.fuera ? dentro(lat, lon) || !/Quer[eé]taro/.test(r.display_name) : !dentro(lat, lon)) descartes.push(`«${nombre}»: fuera del área esperada`);
    else validos.push({ r, nombre, lat, lon });
  }
  if (!validos.length) return { ...sin('ningún resultado de Nominatim pasa las reglas'), descartes, consulta: def.q };
  const lejos = validos.some((v) => km(v, validos[0]) > 1.5);
  if (lejos) return { ...sin('dos o más resultados con el mismo nombre a más de 1.5 km: ambiguo'), descartes, consulta: def.q };
  const v = validos[0];
  return {
    lugar, lat: v.r.lat, lon: v.r.lon, punto: v.r.display_name,
    fuente: `Nominatim (OpenStreetMap) ${v.r.osm_type}/${v.r.osm_id}, consulta ${cache.consultado.slice(0, 10)}`,
    tipo_osm: `${v.r.category}/${v.r.type}`,
    estado: 'POR VERIFICAR', consulta: def.q,
  };
}

// D-35 (Miguel, 19 nov 2026): correcciones de conocimiento local. El nombre
// de la ruta en routes.txt no cambia (es el del inventario y la página oficial);
// solo el lugar donde se ubica el extremo.
const CORRECCIONES = {
  'Col. Industrial Nuevo San Juan': 'Nuevo Parque Industrial',
  'La Rueda': 'Fracc. La Rueda', // es el mismo lugar: se elimina el duplicado
  'Visthá (CERESO)': 'Visthá', // D-37: es el mismo lugar; el nombre correcto es «Visthá»
};
// Decisión que respalda cada corrección (va en el campo «correccion» de la ruta).
const MARCA = { 'Visthá (CERESO)': 'D-37' };
const corregir = (n) => CORRECCIONES[n] ?? n;

const rutas = leerCSV(`${raiz}datos/gtfs-sjr/routes.txt`);
const resueltos = new Map();
const rut = rutas.map((r) => {
  const partes = r.route_long_name.split(' – ');
  const [origenInv, destinoInv] = [partes[0], partes.slice(1).join(' – ')];
  // «Manantiales – Nogales – IMSS» tiene tres nombres: origen = el primero,
  // destino = el último; el de en medio no es extremo.
  const finInv = partes.length > 2 ? partes.at(-1) : destinoInv;
  const [origen, fin] = [corregir(origenInv), corregir(finInv)];
  const corregidos = [origenInv, finInv].filter((n) => corregir(n) !== n);
  for (const l of [origen, fin]) if (!resueltos.has(l)) resueltos.set(l, resolver(l));
  return {
    route_id: r.route_id, numero: r.route_short_name, nombre: r.route_long_name,
    origen: origen, destino: fin,
    correccion: corregidos.length ? corregidos.map((n) => `${MARCA[n] ?? 'D-35'}: «${n}» se ubica como «${corregir(n)}» (Miguel, 19 nov 2026)`).join('; ') : undefined,
    nota: partes.length > 2 ? `el nombre trae ${partes.length} lugares; «${partes.slice(1, -1).join(', ')}» queda como punto intermedio, no extremo` : undefined,
    sentidos: 'sentido 0 va de origen a destino y sentido 1 de destino a origen (D-18); las coordenadas son de los lugares, no de las paradas de cada sentido',
  };
});

const lugares = [...resueltos.values()];
const con = lugares.filter((l) => l.lat !== null).length;
writeFileSync(`${raiz}${SALIDA}`, json({
  tarea: 'R-02 (D-24)',
  como_leer: [
    'Cada extremo trae su fuente. Lo que no viene de HANDOFF §11.3 entra POR VERIFICAR.',
    '«Centro» y «San Juan del Río» usan Plaza Independencia como punto de referencia de la zona, no como terminal.',
    'SIN COORDENADA: ningún resultado pasó las reglas (nombre exacto, dentro del municipio, no es calle, sin ambigüedad). No se corrige a ojo (lección 4).',
    `Rectángulo del municipio (ESTIMADO): ${JSON.stringify(MUNICIPIO)}.`,
  ],
  resumen: { rutas: rut.length, lugares: lugares.length, con_coordenada: con, sin_coordenada: lugares.length - con },
  lugares,
  rutas: rut,
}));
console.log(`EXTREMOS: ${lugares.length} lugares; ${con} con coordenada y ${lugares.length - con} sin coordenada → ${SALIDA}`);
