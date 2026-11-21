// R-03 (D-34): extrae los lugares con nombre de la respuesta de Overpass.
// La respuesta completa vive en referencias/ (fuera de git, lección 8); aquí se
// comprueba su huella sha256 y al repositorio entra solo nombre, etiquetas útiles,
// id de OSM y centro (5 decimales, ~1 m).
// Uso: node scripts/lugares-osm.mjs referencias/overpass-2026-11-19/lugares-respuesta.json
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';

const HUELLA = '4a52d85b51f0468f982ed4545b502ea79d31e452085626f51c86545efa9aa5d7';
const entrada = process.argv[2];
if (!entrada) throw new Error('Falta la ruta de la respuesta de Overpass.');

const bruto = readFileSync(entrada);
const huella = createHash('sha256').update(bruto).digest('hex');
if (huella !== HUELLA) throw new Error(`La respuesta no es la consultada el 19 nov 2026 (sha256 ${huella}).`);

const r = JSON.parse(bruto.toString('utf8'));
const redondeo = (n) => Number(n.toFixed(5));
const ETIQUETAS = ['amenity', 'place', 'landuse', 'public_transport', 'operator'];

const lugares = r.elements
  .filter((e) => e.tags?.name)
  .map((e) => {
    const c = e.type === 'node' ? { lat: e.lat, lon: e.lon } : e.center;
    if (!c || typeof c.lat !== 'number' || typeof c.lon !== 'number') throw new Error(`${e.type}/${e.id} sin coordenada`);
    const lugar = { osm: `${e.type}/${e.id}`, nombre: e.tags.name };
    for (const k of ETIQUETAS) if (e.tags[k]) lugar[k] = e.tags[k];
    lugar.centro = [redondeo(c.lat), redondeo(c.lon)];
    return lugar;
  })
  .sort((a, b) => a.nombre.localeCompare(b.nombre, 'es') || a.osm.localeCompare(b.osm));

const salida = {
  tarea: 'R-03 (D-34)',
  fuente: {
    servicio: 'https://overpass-api.de/api/interpreter',
    consulta: 'datos/cache/overpass/lugares.overpassql',
    consultado: '2026-11-19T15:16:47-06:00',
    osm_base: r.osm3s?.timestamp_osm_base ?? null,
    peticiones: 1,
    sha256_respuesta: HUELLA,
    respuesta_completa: 'referencias/overpass-2026-11-19/lugares-respuesta.json (fuera de git)',
    licencia: 'Datos © colaboradores de OpenStreetMap, ODbL 1.0',
  },
  como_leer: [
    'Cada elemento es un lugar con nombre de OpenStreetMap (nodo, vía o relación) dentro del municipio.',
    'centro: [latitud, longitud] con 5 decimales; en vías y relaciones es el centro de su caja, no un acceso.',
    'Son candidatos, no ubicaciones confirmadas: todo lo que se use queda POR VERIFICAR EN CAMPO.',
  ],
  resumen: { lugares: lugares.length },
  lugares,
};

writeFileSync('datos/cache/overpass/lugares.json', JSON.stringify(salida) + '\n');
console.log(`lugares.json: ${salida.resumen.lugares} lugares.`);
