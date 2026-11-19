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

export interface Ruta {
  route_id: string;
  numero: string;
  nombre: string;
  tipo: 'urbana' | 'intermunicipal';
  grupo: 'verificada' | 'solo-inventario';
  nivel: 'A' | 'B' | 'C';
  fuente: string;
  fecha: string;
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
