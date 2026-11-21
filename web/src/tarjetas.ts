// D-50: selector visual de rutas. Lógica pura, sin DOM, para probarla sin navegador.
// Como el tablero de kanban de una línea: cada tarjeta es una ruta, todas a la
// vista y en el orden de routes.txt; el color solo ayuda a distinguirlas.

export interface RutaParaTarjeta {
  route_id: string;
  numero: string;
  nombre: string;
  tipo: 'urbana' | 'intermunicipal';
}

// Respuesta 2 de D-50: «R» para urbanas y «T» para intermunicipales, sin ceros
// a la izquierda y con su letra (009B → R9B). Así la urbana 23 (R23) nunca se
// confunde con la intermunicipal 023 (T23).
export function insignia(ruta: Pick<RutaParaTarjeta, 'numero' | 'tipo'>): string {
  const sinCeros = ruta.numero.replace(/^0+(?=\d)/, '');
  return `${ruta.tipo === 'intermunicipal' ? 'T' : 'R'}${sinCeros}`;
}

export interface ColorTarjeta {
  fondo: string;
  texto: string;
  // Color de la insignia dentro del camioncito blanco (contraste AA sobre blanco).
  insignia: string;
}

// D-53, 4 (Miguel, 20 nov 2026): 20 colores propios en rotación (antes 4, D-50),
// para que no se sientan repetidos. Ninguno es oficial (regla 4) y no significan
// nada de la ruta; la app lo dice (AVISO_COLORES). Paleta de la maqueta aprobada
// (docs/maquetas/d53/). Los 4 claros llevan texto e insignia oscuros; todos
// cumplen AA (≥ 4.5), lo revisa scripts/pruebas/tarjetas.test.mjs.
const OSCURO = '#12262d';
const FONDOS = [
  '#0d7a72', '#b5462c', '#1d5b8f', '#f0a032', '#12262d', '#2e7d32', '#9c3d6e', '#8a5a00', '#0f6e8c', '#c2410c',
  '#3d5a40', '#e8b84a', '#7a3b2e', '#1b7f5a', '#a33b3b', '#5b6b2f', '#9ad1c8', '#2f4a6d', '#f2c6a0', '#6d4c41',
];
const CLAROS = new Set(['#f0a032', '#e8b84a', '#9ad1c8', '#f2c6a0']);
export const ROTACION: ColorTarjeta[] = FONDOS.map((fondo) =>
  CLAROS.has(fondo) ? { fondo, texto: OSCURO, insignia: OSCURO } : { fondo, texto: '#ffffff', insignia: fondo },
);
// Las intermunicipales llevan un color aparte, fuera de la rotación.
export const COLOR_INTERMUNICIPAL: ColorTarjeta = { fondo: '#4b3f8f', texto: '#ffffff', insignia: '#4b3f8f' };

export const AVISO_COLORES = 'Los colores solo ayudan a distinguir las tarjetas; no indican nada de la ruta.';

// El color va por posición entre las urbanas, para que alternen sin saltos.
export function colorTarjeta(rutas: RutaParaTarjeta[], indice: number): ColorTarjeta {
  const r = rutas[indice];
  if (r.tipo === 'intermunicipal') return COLOR_INTERMUNICIPAL;
  const posicion = rutas.slice(0, indice).filter((x) => x.tipo === 'urbana').length;
  return ROTACION[posicion % ROTACION.length];
}

// Contraste WCAG 2.1 entre dos colores #rrggbb (AA pide ≥ 4.5 para texto normal).
function luminancia(hex: string): number {
  const canal = (i: number) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * canal(1) + 0.7152 * canal(3) + 0.0722 * canal(5);
}

export function contraste(a: string, b: string): number {
  const [x, y] = [luminancia(a), luminancia(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
}

// Respuesta 4 de D-50: «Tus rutas recientes». Solo en el navegador del teléfono
// (localStorage), sin cookies ni servidor. Hasta 3, la más nueva primero.
export const CLAVE_RECIENTES = 'sjdrbus.recientes';
export const MAX_RECIENTES = 3;

export function agregarReciente(lista: string[], id: string): string[] {
  return [id, ...lista.filter((x) => x !== id)].slice(0, MAX_RECIENTES);
}

// Lo guardado se limpia: solo rutas que existen hoy, sin repetir, hasta 3.
export function leerRecientes(guardado: string | null, idsValidos: Set<string>): string[] {
  let lista: unknown;
  try {
    lista = JSON.parse(guardado ?? '[]');
  } catch {
    return [];
  }
  if (!Array.isArray(lista)) return [];
  const limpia = lista.filter((x): x is string => typeof x === 'string' && idsValidos.has(x));
  return [...new Set(limpia)].slice(0, MAX_RECIENTES);
}
