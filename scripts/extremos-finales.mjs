#!/usr/bin/env node
// R-03 (D-34, D-41): extremos finales = lo automático de R-02 + lo que Miguel
// confirmó en la página de extremos. Sin red.
//   entrada: datos/investigacion/extremos.json (R-02)
//            datos/investigacion/extremos-decisiones.json (respuestas de Miguel)
//   salida:  datos/investigacion/extremos-finales.json
// Prioridad: el punto de Miguel manda sobre Nominatim/OSM; HANDOFF §11.3 se
// queda como está. Todo punto de Miguel queda POR VERIFICAR EN CAMPO. Lo que no
// tiene punto queda FALTANTE (D-41): se completa con la retroalimentación de la
// gente; nunca se rellena con un dato supuesto.
import { readFileSync, writeFileSync } from 'node:fs';

const raiz = new URL('..', import.meta.url).pathname;
const leer = (r) => JSON.parse(readFileSync(`${raiz}${r}`, 'utf8'));
const ext = leer('datos/investigacion/extremos.json');
const { decisiones } = leer('datos/investigacion/extremos-decisiones.json');

// Decisiones guardadas con un nombre que luego se corrigió (D-37).
const ALIAS = { 'Visthá (CERESO)': 'Visthá' };
const porLugar = new Map();
for (const [nombre, d] of Object.entries(decisiones)) {
  const lugar = ALIAS[nombre] ?? nombre;
  const previa = porLugar.get(lugar);
  if (!previa || previa.fecha < d.fecha) porLugar.set(lugar, { ...d, guardado_como: nombre });
}

const rutasDe = (lugar) => ext.rutas.filter((r) => r.origen === lugar || r.destino === lugar).map((r) => r.numero);
const fecha = (iso) => new Date(iso).toLocaleString('sv-SE', { timeZone: 'America/Mexico_City' }).slice(0, 16).replace(' ', 'T') + '-06:00';

const lugares = ext.lugares.map((l) => {
  const d = porLugar.get(l.lugar);
  const base = { lugar: l.lugar, rutas: rutasDe(l.lugar) };
  if (d?.coordenada) {
    return {
      ...base, lat: d.coordenada[0], lon: d.coordenada[1],
      estado: 'UBICADO POR MIGUEL · POR VERIFICAR EN CAMPO',
      fuente: `Miguel, página de extremos (${d.estado}${d.candidato_osm ? `, propuesta OSM ${d.candidato_osm}` : ''}), ${fecha(d.fecha)}`,
      antes: l.lat !== null ? { lat: Number(l.lat), lon: Number(l.lon), fuente: l.fuente } : undefined,
    };
  }
  if (l.lat !== null) return { ...base, lat: Number(l.lat), lon: Number(l.lon), estado: l.estado, fuente: l.fuente ?? 'R-02' };
  return {
    ...base, lat: null, lon: null,
    estado: 'FALTANTE (D-41) · se completa con la retroalimentación de la gente',
    motivo: d?.estado === 'rechazado'
      ? `Miguel rechazó la propuesta (${fecha(d.fecha)}); ${l.motivo ?? 'sin punto'}`
      : 'sin punto: ni OpenStreetMap ni Miguel lo ubicaron todavía',
  };
});

const con = lugares.filter((l) => l.lat !== null);
const salida = {
  tarea: 'R-03 (D-34, D-41)',
  como_leer: [
    'Un renglón por lugar que es extremo de alguna ruta vigente.',
    'UBICADO POR MIGUEL: punto puesto o aprobado por Miguel en la página de extremos; POR VERIFICAR EN CAMPO.',
    'FALTANTE (D-41): no tiene punto. La app lo muestra como faltante; nunca se completa con un dato supuesto.',
    'antes: la coordenada automática que el punto de Miguel reemplazó, para poder compararla.',
  ],
  resumen: {
    lugares: lugares.length,
    con_coordenada: con.length,
    de_miguel: con.filter((l) => l.estado.startsWith('UBICADO POR MIGUEL')).length,
    faltantes: lugares.length - con.length,
  },
  lugares,
};
writeFileSync(`${raiz}datos/investigacion/extremos-finales.json`, JSON.stringify(salida, null, 2) + '\n');
console.log(`EXTREMOS FINALES: ${salida.resumen.lugares} lugares; ${salida.resumen.con_coordenada} con punto (${salida.resumen.de_miguel} de Miguel), ${salida.resumen.faltantes} faltantes: ${lugares.filter((l) => l.lat === null).map((l) => l.lugar).join(', ')}`);
