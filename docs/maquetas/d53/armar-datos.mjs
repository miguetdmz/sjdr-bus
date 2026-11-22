// D-53 · maqueta (D-54): extrae de los datos reales de la app lo que la maqueta
// necesita y lo deja en datos-maqueta.js, para abrir la maqueta sin servidor.
// No inventa nada: copia campos de web/public/datos/rutas.json y paradas.json
// (se generan con `npm run datos-app`) y anota su huella sha256.
// Uso: node docs/maquetas/d53/armar-datos.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const aqui = dirname(fileURLToPath(import.meta.url));
const raiz = join(aqui, '..', '..', '..');
const leer = (r) => readFileSync(join(raiz, r), 'utf8');
const huella = (t) => createHash('sha256').update(t).digest('hex').slice(0, 16);

const textoRutas = leer('web/public/datos/rutas.json');
const textoParadas = leer('web/public/datos/paradas.json');
const rutas = JSON.parse(textoRutas).rutas.map((r) => ({
  route_id: r.route_id,
  numero: r.numero, // nombre oficial: solo en los datos, nunca en pantalla (D-53, 6:23 pm)
  nombre: r.nombre,
  tipo: r.tipo,
  grupo: r.grupo,
  extremos: r.extremos,
  sentidos: r.sentidos ?? null,
}));
const paradas = JSON.parse(textoParadas).paradas.map((p) => ({ nombre: p.nombre, lat: p.lat, lon: p.lon }));

const salida =
  `// Generado por armar-datos.mjs. No se edita a mano.\n` +
  `// Fuente: web/public/datos/rutas.json (sha256 ${huella(textoRutas)}…) y ` +
  `web/public/datos/paradas.json (sha256 ${huella(textoParadas)}…).\n` +
  `window.MAQUETA = ${JSON.stringify({ rutas, paradas })};\n`;
writeFileSync(join(aqui, 'datos-maqueta.js'), salida);
console.log(`datos-maqueta.js: ${rutas.length} rutas, ${paradas.length} paradas`);
