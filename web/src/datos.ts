// Tipos de web/public/datos/rutas.json, que arma scripts/datos-app.mjs (M-02).
// La app solo lee este archivo; no tiene datos escritos a mano.

export interface Horario {
  inicio: string;
  fin: string;
}

export interface Sentido {
  paradas: number;
  duracion_min: number;
  horario: Horario | null;
  horario_estado?: string;
  fuente: string;
  fecha_consulta: string;
}

// D-50: extremo de la ruta como zona probable (scripts/datos-app.mjs).
export interface ZonaExtremo {
  lugar: string;
  estado: string;
  lat?: number;
  lon?: number;
  radio_m?: number;
  fuente?: string;
  cerca_de?: string;
  faltante?: true;
}

export interface Ruta {
  route_id: string;
  numero: string;
  nombre: string;
  tipo: 'urbana' | 'intermunicipal';
  grupo: 'verificada' | 'solo-inventario';
  nivel: 'A' | 'B' | 'C';
  fuente: string;
  fecha: string;
  extremos: { origen: ZonaExtremo; destino: ZonaExtremo };
  sentidos?: { ida: Sentido; vuelta: Sentido };
}

export interface DatosApp {
  actualizado: string;
  rutas: Ruta[];
}

export async function cargarDatos(): Promise<DatosApp> {
  const respuesta = await fetch(new URL('datos/rutas.json', document.baseURI));
  if (!respuesta.ok) throw new Error(`No se pudieron leer los datos de rutas (${respuesta.status})`);
  return respuesta.json();
}
