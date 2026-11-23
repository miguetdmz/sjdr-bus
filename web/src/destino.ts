// D-53, 7 (respuesta de Miguel, 20 nov 2026, 6:29 pm: «sí, las 3»): primera
// versión de «¿A dónde quieres ir?». Lógica pura, sin DOM, para probarla sin
// navegador. Como el almacén con su catálogo de piezas: solo se busca lo que
// está dado de alta; nada se pide fuera (regla 7: nunca Nominatim en vivo).
//   (a) el destino se busca en un catálogo guardado: los lugares de inicio y fin
//       de las rutas (rutas.json);
//   (b) con el GPS del teléfono, la parada de OpenStreetMap más cercana, en
//       línea recta (estimado, por verificar en campo); la ubicación no sale
//       del teléfono;
//   (c) las rutas que empiezan o terminan a 1 km o menos del destino (estimado).
// Lo demás (qué ruta tomar, recorrido, camino a pie) llega en fases posteriores.
import type { Ruta, ZonaExtremo } from './datos.ts';

export interface Punto {
  lat: number;
  lon: number;
}

// Un lugar del catálogo: inicio o fin de ruta (con radio de su zona) o lugar con
// nombre de OpenStreetMap (D-56 fase 2: con tipo e id de OSM, sin radio).
export interface LugarCatalogo extends Punto {
  lugar: string;
  radio_m?: number;
  cerca_de?: string;
  tipo?: string;
  osm?: string;
}

// D-56 fase 2: un lugar de web/public/datos/lugares.json (de lugares-amplio.json).
export interface LugarOSM extends Punto {
  nombre: string;
  tipo: string;
  osm: string;
}

export interface DatosLugares {
  consultado: string;
  lugares: LugarOSM[];
}

// Criterio de trabajo de D-53 (c): hasta 1 km en línea recta. ESTIMADO.
export const RADIO_CERCA_M = 1000;

export const LEYENDA_CERCA = 'estimado · distancia en línea recta a la zona de inicio o fin de cada ruta, hasta 1 km.';
export const PROXIMAMENTE =
  'Próximamente (fases posteriores): qué ruta tomar desde tu parada, el recorrido de cada ruta y el camino a pie por calles.';
// D-56 fase 2: el catálogo ya trae los lugares de OpenStreetMap; si no está, se dice
// así, sin inventarlo (docs/maquetas/d56f2/tipos-propuestos.md).
export const SIN_RESULTADOS =
  'No está entre los lugares guardados: los de inicio o fin de ruta y los lugares con nombre de OpenStreetMap.';

const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

// D-56 fase 2: «Lugares: OpenStreetMap, consulta del 22 nov 2026.»
export function leyendaLugares(consultado: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(consultado);
  const fecha = m ? `${Number(m[3])} ${MESES[Number(m[2]) - 1]} ${m[1]}` : consultado;
  return `Lugares: OpenStreetMap, consulta del ${fecha}.`;
}

// Ajuste «Resultados» (maqueta aprobada por Miguel, 22 nov 2026, 10:40 pm): la lista
// enseña 5 y un botón para ver 5 más, para que no se llene de relleno.
export const VISIBLES_LISTA = 5;
export function textoVerMas(quedan: number): string {
  return `Ver ${Math.min(VISIBLES_LISTA, quedan)} más · quedan ${quedan}`;
}

// D-56 fase 2: cada fila dice su tipo y su fuente.
export function textoFila(l: LugarCatalogo): string {
  if (l.osm) return `${l.tipo} · OpenStreetMap`;
  return l.cerca_de ? `Inicio o fin de ruta · zona aproximada, cerca de ${l.cerca_de}` : 'Inicio o fin de ruta · zona aproximada';
}

function conPunto(z: ZonaExtremo): z is ZonaExtremo & { lat: number; lon: number; radio_m: number } {
  return !z.faltante && z.lat != null && z.lon != null && z.radio_m != null;
}

// Los lugares de inicio y fin de todas las rutas, sin repetir y sin FALTANTES.
export function catalogo(rutas: Ruta[]): LugarCatalogo[] {
  const m = new Map<string, LugarCatalogo>();
  for (const r of rutas) {
    for (const z of [r.extremos.origen, r.extremos.destino]) {
      if (!conPunto(z) || m.has(z.lugar)) continue;
      const l: LugarCatalogo = { lugar: z.lugar, lat: z.lat, lon: z.lon, radio_m: z.radio_m };
      if (z.cerca_de) l.cerca_de = z.cerca_de;
      m.set(z.lugar, l);
    }
  }
  return [...m.values()];
}

// D-56 fase 2 (como la maqueta): primero los lugares de inicio y fin de ruta, después
// los de OpenStreetMap, sin repetir nombres (sin acentos ni mayúsculas).
export function catalogoAmplio(rutas: Ruta[], osm: LugarOSM[]): LugarCatalogo[] {
  const lista = catalogo(rutas);
  const vistos = new Set(lista.map((l) => normalizar(l.lugar)));
  for (const o of osm) {
    const clave = normalizar(o.nombre);
    if (vistos.has(clave)) continue;
    vistos.add(clave);
    lista.push({ lugar: o.nombre, lat: o.lat, lon: o.lon, tipo: o.tipo, osm: o.osm });
  }
  return lista;
}

export async function cargarLugares(): Promise<DatosLugares> {
  const respuesta = await fetch(new URL('datos/lugares.json', document.baseURI));
  if (!respuesta.ok) throw new Error(`No se pudieron leer los lugares (${respuesta.status})`);
  return respuesta.json();
}

// Sin acentos ni mayúsculas: «hospital general» encuentra «Hospital General».
export function normalizar(t: string): string {
  return t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
}

export function buscar(lugares: LugarCatalogo[], texto: string): LugarCatalogo[] {
  const t = normalizar(texto);
  if (!t) return [];
  return lugares.filter((l) => normalizar(l.lugar).includes(t));
}

// Distancia en línea recta (haversine), en metros. No es el camino por calles.
export function distancia(a: Punto, b: Punto): number {
  const R = 6371000;
  const rad = Math.PI / 180;
  const dLat = (b.lat - a.lat) * rad;
  const dLon = (b.lon - a.lon) * rad;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * rad) * Math.cos(b.lat * rad) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

// «a 600 m», «a 1.2 km»; a menos de 50 m, «ahí».
export function textoDistancia(m: number): string {
  if (m < 50) return 'ahí';
  return m < 1000 ? `a ${Math.round(m / 10) * 10} m` : `a ${(m / 1000).toFixed(1)} km`;
}

export interface RutaCerca {
  ruta: Ruta;
  metros: number;
}

// Rutas cuyo inicio o fin queda a RADIO_CERCA_M o menos, de la más cercana a la
// más lejana (empate: orden de routes.txt).
export function rutasCerca(rutas: Ruta[], destino: Punto, radio = RADIO_CERCA_M): RutaCerca[] {
  const lista: RutaCerca[] = [];
  for (const ruta of rutas) {
    const puntos = [ruta.extremos.origen, ruta.extremos.destino].filter(conPunto);
    if (!puntos.length) continue;
    const metros = Math.min(...puntos.map((z) => distancia(destino, z)));
    if (metros <= radio) lista.push({ ruta, metros });
  }
  return lista.sort((a, b) => a.metros - b.metros);
}

// La parada más cercana a un punto (la del GPS), en línea recta.
export function masCercana<T extends Punto>(puntos: T[], desde: Punto): { punto: T; metros: number } | null {
  let mejor: { punto: T; metros: number } | null = null;
  for (const p of puntos) {
    const metros = distancia(desde, p);
    if (!mejor || metros < mejor.metros) mejor = { punto: p, metros };
  }
  return mejor;
}
