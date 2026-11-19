#!/usr/bin/env node
// N-08 (D-16): arma datos/gtfs-sjr/stops.txt a partir de la respuesta de Overpass
// que ya está guardada en el repositorio (datos/cache/overpass/). No consulta
// ningún servicio: es como surtir desde el almacén, no volver a comprar.
// Cada parada entra en cuarentena: identificador de OSM, fuente, fecha y la marca
// POR VERIFICAR EN CAMPO. No se asigna a ninguna ruta, no se ordena y su
// coordenada se copia tal cual (no se redondea ni se mueve).
import { readFileSync, writeFileSync } from 'node:fs';

const raiz = new URL('..', import.meta.url).pathname;
const meta = JSON.parse(readFileSync(`${raiz}datos/cache/overpass/paradas.meta.json`, 'utf8'));
const respuesta = JSON.parse(readFileSync(`${raiz}${meta.respuesta}`, 'utf8'));
const fecha = meta.consultado.slice(0, 10); // hora de México (D-09)

export const MARCA = 'POR VERIFICAR EN CAMPO';
export const FUENTE = 'OpenStreetMap (Overpass)';
export const COLUMNAS = ['stop_id', 'stop_name', 'stop_desc', 'stop_lat', 'stop_lon', 'stop_url', 'osm_id', 'fuente', 'fecha', 'estado'];

const csv = (v) => (/[",\n]/.test(String(v)) ? `"${String(v).replace(/"/g, '""')}"` : String(v));

const nodos = respuesta.elements
  .filter((e) => e.type === 'node')
  .sort((a, b) => a.id - b.id); // orden por identificador, no por ruta

const filas = nodos.map((n) => {
  const osm = `node/${n.id}`;
  const nombre = n.tags?.name?.trim();
  return [
    `OSM-N${n.id}`,
    nombre || `Parada sin nombre en OSM (${osm})`,
    `${MARCA}. Fuente: ${FUENTE}, ${osm}, consulta ${fecha}. No asignada a ninguna ruta.`,
    String(n.lat),
    String(n.lon),
    `https://www.openstreetmap.org/${osm}`,
    osm,
    FUENTE,
    fecha,
    MARCA,
  ];
});

const texto = [COLUMNAS, ...filas].map((f) => f.map(csv).join(',')).join('\n') + '\n';
writeFileSync(`${raiz}datos/gtfs-sjr/stops.txt`, texto);
console.log(`PARADAS: ${filas.length} desde OpenStreetMap → datos/gtfs-sjr/stops.txt (${MARCA})`);
