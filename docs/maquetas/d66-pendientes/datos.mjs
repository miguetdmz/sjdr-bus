// D-74 · Maqueta: datos de la página de campo por sentido.
// Lista: datos/cache/qrobus/paradas-sentido.json (D-71, solo texto, cada sentido con su propia respuesta).
// Punto: solo si el mismo texto oficial está en la lista general de ESA ruta (datos/investigacion/cruces.json)
// con punto; misma normalización que scripts/paradas-sentido.mjs. Ningún punto se inventa ni se mueve.
// Uso: node docs/maquetas/d66-pendientes/datos.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { titulo } from '../../../scripts/datos-app.mjs';
const raiz = new URL('../../../', import.meta.url).pathname;
const norma = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toUpperCase().replace(/[^A-Z0-9]+/g, ' ').trim();
const leer = (p) => JSON.parse(readFileSync(raiz + p, 'utf8'));
const ps = leer('datos/cache/qrobus/paradas-sentido.json');
const cr = leer('datos/investigacion/cruces.json');
const rutasTxt = readFileSync(raiz + 'datos/gtfs-sjr/routes.txt', 'utf8').trim().split('\n').slice(1).map((l) => l.split(',')[0]);
const porId = new Map(cr.rutas.map((r) => [r.route_id, r]));
const porPs = new Map(ps.rutas.map((r) => [r.route_id, r]));
const SENT = [['IDA', 'I'], ['REGRESO', 'V']];
let total = 0, conPunto = 0;
const rutas = rutasTxt.map((id) => {
  const r = porPs.get(id), c = porId.get(id);
  const puntos = new Map();
  if (c && Array.isArray(c.cruces)) for (const x of c.cruces) if (x.lat != null && x.lon != null && !puntos.has(norma(x.texto))) puntos.set(norma(x.texto), x);
  const sentidos = {};
  for (const [s, letra] of SENT) {
    const v = r.sentidos[s];
    sentidos[s] = {
      letra,
      paradas: (v.paradas ?? []).map((p) => {
        total++; const x = puntos.get(norma(p.nombre)); if (x) conPunto++;
        return { orden: p.orden, numero: p.numero ?? null, nombre: p.nombre.split(/\s*-\s*/).map(titulo).join(' – '),
          ...(x ? { lat: x.lat, lon: x.lon, estado_punto: x.estado } : {}) };
      }),
    };
  }
  return { route_id: id, numero: r.numero, nombre: r.nombre, tipo: id.startsWith('T') || id.startsWith('I') ? 'intermunicipal' : 'urbana', sentidos };
});
writeFileSync(new URL('./campo-sentido.json', import.meta.url), JSON.stringify({
  descripcion: 'MAQUETA D-74. Lista oficial por sentido (D-71, solo texto) con punto prestado de la lista general de la misma ruta cuando el texto coincide.',
  fuente_lista: ps.fuente, resumen: { paradas: total, con_punto: conPunto }, rutas }) + '\n');
console.log(`MAQUETA D-74: ${rutas.length} rutas, ${total} paradas, ${conPunto} con punto`);
