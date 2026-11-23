// D-56 fase 2 · maqueta (D-54): extrae de datos/cache/overpass/lugares.json (OSM,
// consulta del 19 nov 2026) lo que la maqueta necesita y lo deja en
// lugares-maqueta.js, para abrir la maqueta sin servidor. No inventa nada: copia
// nombre, coordenada y etiqueta de OSM, y anota la huella sha256. Quita las
// coordenadas prohibidas (lección 4) y lo que no es un destino (colonias sin nombre).
// Uso: node docs/maquetas/d56f2/armar-lugares.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const aqui = dirname(fileURLToPath(import.meta.url));
const raiz = join(aqui, '..', '..', '..');
const texto = readFileSync(join(raiz, 'datos/cache/overpass/lugares.json'), 'utf8');
const huella = createHash('sha256').update(texto).digest('hex').slice(0, 16);
const j = JSON.parse(texto);

// Tipo en español a partir de la etiqueta de OSM (no es un dato nuevo: es su traducción).
const TIPO = {
  'amenity=hospital': 'Hospital', 'amenity=clinic': 'Clínica', 'amenity=university': 'Escuela',
  'amenity=college': 'Escuela', 'amenity=bus_station': 'Central de autobuses',
  'amenity=marketplace': 'Mercado', 'amenity=prison': 'Centro penitenciario',
  'public_transport=station': 'Terminal', 'place=suburb': 'Colonia', 'place=neighbourhood': 'Colonia',
  'place=quarter': 'Barrio', 'place=village': 'Localidad', 'place=hamlet': 'Localidad',
  'place=locality': 'Localidad', 'place=town': 'Ciudad', 'place=city': 'Ciudad',
  'landuse=residential': 'Fraccionamiento', 'landuse=industrial': 'Zona industrial',
};
// Lección 4: «Universidad Tecnológica Bridge» fue un error de geocodificación.
const FUERA = new Set(['Universidad Tecnológica Bridge']);

const lugares = [];
for (const l of j.lugares) {
  if (FUERA.has(l.nombre)) continue;
  const clave = ['amenity', 'public_transport', 'place', 'landuse'].map((k) => (l[k] ? `${k}=${l[k]}` : '')).find((c) => TIPO[c]);
  if (!clave) continue;
  lugares.push({ nombre: l.nombre, tipo: TIPO[clave], osm: l.osm, lat: l.centro[0], lon: l.centro[1] });
}

const salida =
  `// Generado por armar-lugares.mjs. No se edita a mano.\n` +
  `// Fuente: datos/cache/overpass/lugares.json (sha256 ${huella}…), OpenStreetMap, consulta del ${j.fuente.consultado.slice(0, 10)}. ODbL 1.0.\n` +
  `window.LUGARES = ${JSON.stringify({ consultado: j.fuente.consultado, lugares })};\n`;
writeFileSync(join(aqui, 'lugares-maqueta.js'), salida);
console.log(`lugares-maqueta.js: ${lugares.length} lugares (de ${j.lugares.length}); sha256 ${huella}`);
