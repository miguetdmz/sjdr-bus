// M-06: lugar reservado de «Calcula tu ruta» (D-15, B6).
// Solo un aviso: qué hará, que todavía no está disponible y qué dato falta.
// Sin campos de origen y destino y sin ningún cálculo ni simulación.
// Lógica pura, sin DOM, para poder probarla sin navegador.

export interface AvisoCalcula {
  titulo: string;
  estado: string;
  parrafos: { dato: string; texto: string }[];
}

export const NO_DISPONIBLE = 'Todavía no está disponible';

export function avisoCalcula(): AvisoCalcula {
  return {
    titulo: 'Calcula tu ruta',
    estado: NO_DISPONIBLE,
    parrafos: [
      {
        dato: 'Qué hará',
        texto:
          'Dirás dónde estás y a dónde vas, y la app te dirá qué ruta tomar, o qué combinación de rutas y dónde transbordar cuando no haya una directa.',
      },
      {
        dato: 'Qué dato falta',
        texto:
          'Las paradas de cada ruta, en orden y por sentido (ida y vuelta). Sin ese dato no se puede saber dónde se cruzan dos rutas. Hoy no lo tenemos para ninguna ruta.',
      },
      {
        dato: 'Mientras tanto',
        texto: 'Usa la pestaña «Rutas» para ver la información que sí tenemos de cada ruta, con su fuente.',
      },
    ],
  };
}
