// M-03: opciones del selector de ruta (HANDOFF §11.8). Lógica pura, sin DOM,
// para poder probarla sin navegador. El orden es el de routes.txt (HANDOFF §4).

export interface RutaParaSelector {
  route_id: string;
  numero: string;
  nombre: string;
  tipo: 'urbana' | 'intermunicipal';
}

export interface OpcionSelector {
  valor: string;
  texto: string;
}

export interface GrupoSelector {
  etiqueta: 'Urbanas' | 'Intermunicipales';
  opciones: OpcionSelector[];
}

// «001 — Pedregoso – Centro»: número + raya + origen – destino, como en §4.
export function textoOpcion(ruta: RutaParaSelector): string {
  return `${ruta.numero} — ${ruta.nombre}`;
}

export function gruposSelector(rutas: RutaParaSelector[]): GrupoSelector[] {
  const grupo = (tipo: RutaParaSelector['tipo']) =>
    rutas.filter((r) => r.tipo === tipo).map((r) => ({ valor: r.route_id, texto: textoOpcion(r) }));
  return [
    { etiqueta: 'Urbanas', opciones: grupo('urbana') },
    { etiqueta: 'Intermunicipales', opciones: grupo('intermunicipal') },
  ];
}
