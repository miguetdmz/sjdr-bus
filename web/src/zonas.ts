// D-50, respuesta 5 (y D-46): inicio y fin de la ruta como zona probable.
// Lógica pura, sin DOM. Como la tolerancia de una cota en el plano: se dibuja el
// rango donde probablemente está la parada, no un punto que aparente exactitud.
// No hay trayectoria: sin trazo verificado no se dibuja ninguna línea (D-49).
import type { Ruta, ZonaExtremo } from './datos.ts';
import type { NombreSentido } from './detalle.ts';

export const LEYENDA_ZONA = 'En proceso de verificación · ESTIMADO';

export interface ZonaParaMapa {
  papel: 'Inicio' | 'Fin';
  titulo: string;
  lat: number;
  lon: number;
  radio_m: number;
  lineas: string[];
}

export interface ZonasRuta {
  zonas: ZonaParaMapa[];
  faltantes: string[];
}

function titulo(papel: string, z: ZonaExtremo): string {
  return z.cerca_de ? `${papel}: ${z.lugar} (cerca de ${z.cerca_de})` : `${papel}: ${z.lugar}`;
}

// D-18: la ida sale del origen; la vuelta, del destino. Mismos dos lugares,
// papeles intercambiados (no se copia ninguna cifra de un sentido al otro).
export function zonasRuta(ruta: Ruta, sentido: NombreSentido): ZonasRuta {
  const { origen, destino } = ruta.extremos;
  const [inicio, fin] = sentido === 'ida' ? [origen, destino] : [destino, origen];
  const zonas: ZonaParaMapa[] = [];
  const faltantes: string[] = [];
  for (const [papel, z] of [['Inicio', inicio], ['Fin', fin]] as const) {
    if (z.faltante || z.lat == null || z.lon == null || z.radio_m == null) {
      faltantes.push(`${papel}: ${z.lugar} · FALTANTE`);
      continue;
    }
    const lineas = [LEYENDA_ZONA, `Zona aproximada de ${z.radio_m} m alrededor del punto más probable`];
    if (z.cerca_de) lineas.push(`Sin punto propio todavía: se muestra la zona de ${z.cerca_de}, el lugar conocido más cercano`);
    lineas.push(`Estado: ${z.estado}`);
    if (z.fuente) lineas.push(`Fuente: ${z.fuente}`);
    zonas.push({ papel, titulo: titulo(papel, z), lat: z.lat, lon: z.lon, radio_m: z.radio_m, lineas });
  }
  return { zonas, faltantes };
}
