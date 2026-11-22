// M-04: detalle de la ruta elegida, del sentido elegido (HANDOFF §5.1, §5.3, §11.8).
// Lógica pura, sin DOM, para poder probarla sin navegador.
// Nada se calcula: solo se muestran las cifras de la ficha, cada una con su fuente.
// Sin tiempos calculados, sin frecuencia y sin trazo (todo está en nivel C).
import type { Ruta } from './datos.ts';
import { textoOpcion } from './selector.ts';

export type NombreSentido = 'ida' | 'vuelta';

export interface FilaDetalle {
  dato: string;
  valor: string;
  fuente?: string;
}

export interface Detalle {
  titulo: string;
  etiquetas: string[];
  filas: FilaDetalle[];
  aviso?: string;
}

export const FUENTE_MOOVIT = 'referencia Moovit, consulta nov 2026 · no es fuente oficial';
export const ETIQUETA_NIVEL_C = 'Nivel C · recorrido por verificar';
export const EN_VERIFICACION = 'Datos de paradas y recorrido en verificación';

const TIPOS = { urbana: 'Urbana', intermunicipal: 'Intermunicipal' } as const;
// D-18: sentido 0 = ida, sentido 1 = vuelta.
const SENTIDOS = { ida: 'Ida (sentido 0)', vuelta: 'Vuelta (sentido 1)' } as const;

export function detalleRuta(ruta: Ruta, sentido: NombreSentido): Detalle {
  const titulo = textoOpcion(ruta);
  const tipo: FilaDetalle = { dato: 'Tipo', valor: TIPOS[ruta.tipo] };

  if (ruta.grupo !== 'verificada' || !ruta.sentidos) {
    return { titulo, etiquetas: [ETIQUETA_NIVEL_C], filas: [tipo], aviso: EN_VERIFICACION };
  }

  // Siempre las cifras del sentido elegido; nunca las del otro (lección 2).
  const s = ruta.sentidos[sentido];
  const horario = s.horario
    ? { dato: 'Horario', valor: `${s.horario.inicio} a ${s.horario.fin}`, fuente: FUENTE_MOOVIT }
    : { dato: 'Horario', valor: 'Por verificar en campo' };

  return {
    titulo,
    etiquetas: [ETIQUETA_NIVEL_C],
    filas: [
      tipo,
      { dato: 'Sentido', valor: SENTIDOS[sentido] },
      { dato: 'Paradas', valor: String(s.paradas), fuente: FUENTE_MOOVIT },
      { dato: 'Duración del recorrido', valor: `${s.duracion_min} min`, fuente: FUENTE_MOOVIT },
      horario,
    ],
    aviso: 'El recorrido todavía no se dibuja en el mapa: está por verificar.',
  };
}

// --- D-52: vista del detalle, más visual y sin fuentes en pantalla -------------
// La fuente de cada cifra sigue en los datos y en detalleRuta(); la pantalla solo
// lleva la leyenda general LEYENDA_VALIDACION (cambio de la regla 1, D-52).
export const LEYENDA_VALIDACION = 'Datos en proceso de validación';

// Escala visual de la duración (D-52): 3 puntos hasta 29 min, 4 desde 30, y uno
// más cada 10 min. Como un indicador de nivel: dice «corta o larga» de un vistazo;
// el número exacto va al lado.
export function puntosDuracion(minutos: number): number {
  return Math.max(3, Math.floor(minutos / 10) + 1);
}

export interface VistaDetalle {
  tipo: string;
  sentido: string;
  paradas: number | null;
  duracion: { minutos: number; puntos: number } | null;
  horario: string | null;
  nivel: string;
  notas: string[];
}

export function vistaDetalle(ruta: Ruta, sentido: NombreSentido): VistaDetalle {
  const base = {
    tipo: TIPOS[ruta.tipo],
    sentido: sentido === 'ida' ? 'Ida' : 'Vuelta',
    nivel: ETIQUETA_NIVEL_C,
  };
  if (ruta.grupo !== 'verificada' || !ruta.sentidos) {
    return { ...base, paradas: null, duracion: null, horario: null, notas: [EN_VERIFICACION] };
  }
  // Siempre las cifras del sentido elegido; nunca las del otro (lección 2).
  const s = ruta.sentidos[sentido];
  return {
    ...base,
    paradas: s.paradas,
    duracion: { minutos: s.duracion_min, puntos: puntosDuracion(s.duracion_min) },
    horario: s.horario ? `${s.horario.inicio} a ${s.horario.fin}` : 'Por verificar en campo',
    notas: ['El recorrido todavía no se dibuja en el mapa: está por verificar.'],
  };
}
