#!/usr/bin/env node
// M-02: arma los datos que lee la app (web/public/datos/rutas.json) a partir de
// los archivos del GTFS-SJR y de las fichas. Como una hoja de ruta de producción
// que se imprime desde el plano: la app no tiene datos escritos a mano, y si el
// plano cambia, la hoja se vuelve a imprimir sola antes de compilar.
//
// Fuentes:
//   datos/gtfs-sjr/routes.txt  → orden, route_id, número y nombre (HANDOFF §4, D-08)
//   datos/fichas/rutas.json    → grupo, nivel, fuente, fecha y cifras por sentido
//
// No calcula nada: no hay tiempos, frecuencias ni trazos. Solo copia.
//
// Uso:
//   node scripts/datos-app.mjs            escribe web/public/datos/rutas.json
//   node scripts/datos-app.mjs --salida=<archivo>
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { leerCSV } from './lib/csv.mjs';

const raiz = fileURLToPath(new URL('..', import.meta.url));

// Tipo según el prefijo del route_id (D-08): U- urbana, I- intermunicipal.
const TIPOS = { U: 'urbana', I: 'intermunicipal' };

export function armarDatosApp() {
  const rutas = leerCSV(join(raiz, 'datos/gtfs-sjr/routes.txt'));
  const fichas = JSON.parse(readFileSync(join(raiz, 'datos/fichas/rutas.json'), 'utf8'));
  const porId = new Map(fichas.rutas.map((f) => [f.route_id, f]));
  if (porId.size !== rutas.length) {
    throw new Error(`routes.txt tiene ${rutas.length} rutas y las fichas ${porId.size}`);
  }

  return {
    descripcion:
      'Datos de la app SJDRbus (nombre provisional). Archivo generado por scripts/datos-app.mjs desde datos/gtfs-sjr/routes.txt y datos/fichas/rutas.json; no se edita a mano. Las cifras por sentido son referencia Moovit (D-07), no fuente oficial.',
    licencia: fichas.licencia,
    actualizado: fichas.actualizado,
    rutas: rutas.map((r) => {
      const ficha = porId.get(r.route_id);
      if (!ficha) throw new Error(`la ruta ${r.route_id} de routes.txt no tiene ficha`);
      const tipo = TIPOS[r.route_id.split('-')[0]];
      if (!tipo) throw new Error(`route_id sin prefijo de tipo (D-08): ${r.route_id}`);
      const ruta = {
        route_id: r.route_id,
        numero: r.route_short_name,
        nombre: r.route_long_name,
        tipo,
        grupo: ficha.grupo,
        nivel: ficha.nivel_precision,
        fuente: ficha.fuente,
        fecha: ficha.fecha,
      };
      if (ficha.grupo === 'verificada') {
        // Cada sentido con sus propias cifras (lección 2): se copian tal cual.
        ruta.sentidos = { ida: ficha.sentidos.ida, vuelta: ficha.sentidos.vuelta };
      }
      return ruta;
    }),
  };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const arg = process.argv.find((a) => a.startsWith('--salida='));
  const salida = arg ? arg.slice(9) : join(raiz, 'web/public/datos/rutas.json');
  const datos = armarDatosApp();
  mkdirSync(dirname(salida), { recursive: true });
  writeFileSync(salida, JSON.stringify(datos, null, 2) + '\n');
  console.log(`DATOS DE LA APP: ${datos.rutas.length} rutas → ${salida.replace(raiz, '')}`);
}
