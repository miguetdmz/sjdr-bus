// D-56 fase 2: extrae el catálogo amplio de lugares con nombre de la respuesta de
// Overpass (consulta datos/cache/overpass/lugares-amplio.overpassql, tipos
// aprobados por Miguel el 22 nov 2026). Como la recepción de material: la caja
// completa se queda en el almacén de afuera (referencias/, fuera de git, lección 8)
// y a la línea entra solo la pieza revisada, con su huella sha256.
// Al repositorio entra solo: id de OSM, nombre, tipo en español (traducción de su
// etiqueta, no un dato nuevo), etiqueta de OSM y centro (5 decimales, ~1 m).
// Uso: node scripts/lugares-amplio.mjs referencias/overpass-2026-11-22/lugares-amplio-respuesta.json
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';

const HUELLA = 'aee71d9915ee2e3eca6be1b706680d2d160d1ba7e2c982bc1be4e067d1dd300f';
const CONSULTADO = '2026-11-22T21:57:15-06:00';

// Tipo que se ve en la app, por etiqueta de OSM, en orden de prioridad (un lugar con
// dos etiquetas toma la primera que aparezca aquí). Los de R-03 como en la maqueta
// (docs/maquetas/d56f2/armar-lugares.mjs); los nuevos como en tipos-propuestos.md.
export const TIPOS = [
  ['amenity', 'hospital', 'Hospital'],
  ['amenity', 'clinic', 'Clínica'],
  ['amenity', 'university', 'Escuela'],
  ['amenity', 'college', 'Escuela'],
  ['amenity', 'school', 'Escuela'],
  ['amenity', 'bus_station', 'Central de autobuses'],
  ['amenity', 'marketplace', 'Mercado'],
  ['amenity', 'prison', 'Centro penitenciario'],
  ['amenity', 'place_of_worship', 'Templo'],
  ['amenity', 'bank', 'Banco'],
  ['amenity', 'townhall', 'Gobierno'],
  ['amenity', 'police', 'Servicio público'],
  ['amenity', 'fire_station', 'Servicio público'],
  ['amenity', 'post_office', 'Servicio público'],
  ['amenity', 'cinema', 'Cultura'],
  ['amenity', 'theatre', 'Cultura'],
  ['amenity', 'library', 'Cultura'],
  ['shop', 'mall', 'Plaza comercial'],
  ['shop', 'supermarket', 'Supermercado'],
  ['shop', 'department_store', 'Tienda'],
  ['office', 'government', 'Gobierno'],
  ['tourism', 'museum', 'Cultura'],
  ['tourism', 'hotel', 'Hotel'],
  ['leisure', 'stadium', 'Deportivo'],
  ['leisure', 'sports_centre', 'Deportivo'],
  ['leisure', 'park', 'Parque'],
  ['public_transport', 'station', 'Terminal'],
  ['place', 'city', 'Ciudad'],
  ['place', 'town', 'Ciudad'],
  ['place', 'suburb', 'Colonia'],
  ['place', 'neighbourhood', 'Colonia'],
  ['place', 'quarter', 'Barrio'],
  ['place', 'village', 'Localidad'],
  ['place', 'hamlet', 'Localidad'],
  ['place', 'locality', 'Localidad'],
  ['landuse', 'residential', 'Fraccionamiento'],
  ['landuse', 'industrial', 'Zona industrial'],
];

// Lección 4: «Universidad Tecnológica Bridge» fue un error de geocodificación; no
// entra al catálogo aunque esté en OSM.
const FUERA = new Set(['Universidad Tecnológica Bridge']);

const entrada = process.argv[2];
if (!entrada) throw new Error('Falta la ruta de la respuesta de Overpass.');
const bruto = readFileSync(entrada);
const huella = createHash('sha256').update(bruto).digest('hex');
if (huella !== HUELLA) throw new Error(`La respuesta no es la consultada el 22 nov 2026 (sha256 ${huella}).`);

const r = JSON.parse(bruto.toString('utf8'));
const redondeo = (n) => Number(n.toFixed(5));
const fuera = [];
const sinTipo = [];
const lugares = [];
for (const e of r.elements) {
  const nombre = e.tags?.name?.trim();
  if (!nombre) continue;
  if (FUERA.has(nombre)) {
    fuera.push(`${e.type}/${e.id} ${nombre}`);
    continue;
  }
  const t = TIPOS.find(([k, v]) => e.tags[k] === v);
  if (!t) {
    sinTipo.push(`${e.type}/${e.id} ${nombre}`);
    continue;
  }
  const c = e.type === 'node' ? { lat: e.lat, lon: e.lon } : e.center;
  if (!c || typeof c.lat !== 'number' || typeof c.lon !== 'number') throw new Error(`${e.type}/${e.id} sin coordenada`);
  lugares.push({ osm: `${e.type}/${e.id}`, nombre, tipo: t[2], etiqueta: `${t[0]}=${t[1]}`, centro: [redondeo(c.lat), redondeo(c.lon)] });
}
if (sinTipo.length) throw new Error(`Lugares sin tipo en la tabla: ${sinTipo.join('; ')}`);
lugares.sort((a, b) => a.nombre.localeCompare(b.nombre, 'es') || a.osm.localeCompare(b.osm));

const porTipo = {};
for (const l of lugares) porTipo[l.tipo] = (porTipo[l.tipo] ?? 0) + 1;

const salida = {
  tarea: 'D-56 fase 2 (catálogo amplio de lugares)',
  fuente: {
    servicio: 'https://overpass-api.de/api/interpreter',
    consulta: 'datos/cache/overpass/lugares-amplio.overpassql',
    tipos_aprobados: 'docs/maquetas/d56f2/tipos-propuestos.md (Miguel, 22 nov 2026)',
    consultado: CONSULTADO,
    osm_base: r.osm3s?.timestamp_osm_base ?? null,
    peticiones: 1,
    sha256_respuesta: HUELLA,
    respuesta_completa: 'referencias/overpass-2026-11-22/lugares-amplio-respuesta.json (fuera de git)',
    licencia: 'Datos © colaboradores de OpenStreetMap, ODbL 1.0',
  },
  como_leer: [
    'Cada elemento es un lugar con nombre de OpenStreetMap (nodo, vía o relación) dentro del municipio de San Juan del Río.',
    'tipo: la etiqueta de OSM en español (etiqueta: la original). No es un dato nuevo.',
    'centro: [latitud, longitud] con 5 decimales; en vías y relaciones es el centro de su caja, no un acceso.',
    'Son lugares de OSM, no ubicaciones confirmadas: toda distancia que se calcule con ellos es ESTIMADA, en línea recta y POR VERIFICAR.',
  ],
  fuera_del_catalogo: fuera.map((f) => `${f} (lección 4: error de geocodificación conocido)`),
  resumen: { lugares: lugares.length, por_tipo: porTipo },
  lugares,
};

writeFileSync('datos/cache/overpass/lugares-amplio.json', JSON.stringify(salida) + '\n');
console.log(`lugares-amplio.json: ${lugares.length} lugares; fuera: ${fuera.length}`);
console.log(Object.entries(porTipo).sort((a, b) => b[1] - a[1]).map(([t, n]) => `  ${t}: ${n}`).join('\n'));
