// M-05: paradas de OpenStreetMap en el mapa (N-08, D-16).
// Lógica pura, sin DOM, para poder probarla sin navegador.
// Las paradas NO se ligan a ninguna ruta: son las que ya existen en OSM, todas
// POR VERIFICAR EN CAMPO. Se dibujan como puntos grises pequeños.

export interface Parada {
  stop_id: string;
  nombre: string | null;
  lat: number;
  lon: number;
  osm_id: string;
  url: string;
  fuente: string;
  fecha: string;
  estado: string;
}

export interface DatosParadas {
  paradas: Parada[];
}

export const MARCA_POR_VERIFICAR = 'POR VERIFICAR EN CAMPO';
export const FUENTE_OSM = 'Fuente: OpenStreetMap';
export const SIN_NOMBRE = 'Parada sin nombre en OpenStreetMap';
export const NO_ASIGNADA = 'No está ligada a ninguna ruta todavía.';

export interface FichaParada {
  nombre: string;
  lineas: string[];
}

const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

// «2026-11-18» → «18 nov 2026». Si no tiene esa forma, se deja tal cual.
export function fechaLegible(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m || Number(m[2]) < 1 || Number(m[2]) > 12) return iso;
  return `${Number(m[3])} ${MESES[Number(m[2]) - 1]} ${m[1]}`;
}

// Lo que se ve al tocar una parada: nombre (si OSM lo trae), fuente, fecha y la marca.
export function fichaParada(p: Parada): FichaParada {
  return {
    nombre: p.nombre ?? SIN_NOMBRE,
    lineas: [FUENTE_OSM, `Consulta del ${fechaLegible(p.fecha)}`, MARCA_POR_VERIFICAR, NO_ASIGNADA],
  };
}

export async function cargarParadas(): Promise<DatosParadas> {
  const respuesta = await fetch(new URL('datos/paradas.json', document.baseURI));
  if (!respuesta.ok) throw new Error(`No se pudieron leer las paradas (${respuesta.status})`);
  return respuesta.json();
}
