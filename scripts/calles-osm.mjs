// R-03 (D-32): extrae las calles con nombre de la respuesta de Overpass.
// La respuesta completa vive en referencias/ (fuera de git, lección 8); aquí
// se comprueba su huella sha256 y al repositorio entra solo nombre, tipo, id
// de OSM y trazo (5 decimales, ~1 m) de cada tramo.
// Uso: node scripts/calles-osm.mjs referencias/overpass-2026-11-19/calles-respuesta.json
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';

const HUELLA = '0a2efad1e9ba1554e466491f80584e4a2d1319eb8da1880f745e80622ef9761d';
const entrada = process.argv[2];
if (!entrada) throw new Error('Falta la ruta de la respuesta de Overpass.');

const bruto = readFileSync(entrada);
const huella = createHash('sha256').update(bruto).digest('hex');
if (huella !== HUELLA) throw new Error(`La respuesta no es la consultada el 19 nov 2026 (sha256 ${huella}).`);

const r = JSON.parse(bruto.toString('utf8'));
const tramos = r.elements
  .filter((e) => e.type === 'way' && e.tags?.name && Array.isArray(e.geometry))
  .map((e) => ({
    osm: `way/${e.id}`,
    nombre: e.tags.name,
    tipo: e.tags.highway,
    trazo: e.geometry.map((p) => [Number(p.lat.toFixed(5)), Number(p.lon.toFixed(5))]),
  }))
  .sort((a, b) => a.nombre.localeCompare(b.nombre, 'es') || a.osm.localeCompare(b.osm));

const salida = {
  tarea: 'R-03 (D-32)',
  fuente: {
    servicio: 'https://overpass-api.de/api/interpreter',
    consulta: 'datos/cache/overpass/calles.overpassql',
    consultado: '2026-11-19T14:39:55-06:00',
    osm_base: r.osm3s?.timestamp_osm_base ?? null,
    peticiones: 1,
    sha256_respuesta: HUELLA,
    respuesta_completa: 'referencias/overpass-2026-11-19/calles-respuesta.json (fuera de git)',
    licencia: 'Datos © colaboradores de OpenStreetMap, ODbL 1.0',
  },
  como_leer: [
    'Cada tramo es una vía (way) de OpenStreetMap con nombre; una calle puede tener varios tramos.',
    'trazo: lista de [latitud, longitud] con 5 decimales.',
    'Estos nombres solo sirven para separar y ubicar cruces; todo cruce ubicado con ellos queda POR VERIFICAR.',
  ],
  resumen: { tramos: tramos.length, nombres: new Set(tramos.map((t) => t.nombre)).size },
  tramos,
};

writeFileSync('datos/cache/overpass/calles.json', JSON.stringify(salida) + '\n');
console.log(`calles.json: ${salida.resumen.tramos} tramos, ${salida.resumen.nombres} nombres.`);
