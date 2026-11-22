#!/usr/bin/env node
// M-02: arma los datos que lee la app (web/public/datos/rutas.json) a partir de
// los archivos del GTFS-SJR y de las fichas. Como una hoja de ruta de producción
// que se imprime desde el plano: la app no tiene datos escritos a mano, y si el
// plano cambia, la hoja se vuelve a imprimir sola antes de compilar.
//
// Fuentes:
//   datos/gtfs-sjr/routes.txt  → orden, route_id, número y nombre (HANDOFF §4, D-08)
//   datos/fichas/rutas.json    → grupo, nivel, fuente, fecha y cifras por sentido
//   datos/gtfs-sjr/stops.txt   → paradas de OpenStreetMap (M-05, N-08), POR
//                                VERIFICAR EN CAMPO y sin asignar a ninguna ruta
//
// No calcula nada: no hay tiempos, frecuencias ni trazos. Solo copia.
//
// Uso:
//   node scripts/datos-app.mjs            escribe web/public/datos/rutas.json y paradas.json
//   node scripts/datos-app.mjs --salida=<archivo>
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { leerCSV } from './lib/csv.mjs';

const raiz = fileURLToPath(new URL('..', import.meta.url));

// Tipo según el prefijo del route_id (D-08): U- urbana, I- intermunicipal.
const TIPOS = { U: 'urbana', I: 'intermunicipal' };

// D-50 (respuesta 5): cada extremo de ruta como zona probable. Los puntos salen
// de extremos-finales.json (R-03); radios y zonas por cercanía, de
// zonas-probables.json. Nada se mueve ni se inventa: un FALTANTE sin zona por
// cercanía queda como FALTANTE, sin coordenada.
const ESTADOS_RADIO = ['VERIFICADA', 'UBICADO POR MIGUEL', 'POR VERIFICAR', 'REFERENCIA DE ZONA'];

function radioDe(estado, radios) {
  const clave = ESTADOS_RADIO.find((e) => estado.startsWith(e));
  if (!clave) throw new Error(`estado de extremo sin radio en zonas-probables.json: ${estado}`);
  return radios[clave];
}

function zonaDe(l, lugares, zonas) {
  if (l.lat != null && l.lon != null) {
    return { lugar: l.lugar, lat: l.lat, lon: l.lon, radio_m: radioDe(l.estado, zonas.radios_m), estado: l.estado, fuente: l.fuente };
  }
  const c = zonas.cercania.find((x) => x.lugar === l.lugar);
  if (!c) return { lugar: l.lugar, faltante: true, estado: l.estado };
  const ref = lugares.find((x) => x.lugar === c.cerca_de && x.lat != null);
  if (!ref) throw new Error(`zona por cercanía sin lugar conocido: ${c.cerca_de}`);
  return {
    lugar: l.lugar,
    lat: ref.lat,
    lon: ref.lon,
    radio_m: zonas.radios_m.CERCANIA,
    estado: l.estado,
    cerca_de: c.cerca_de,
    fuente: `Zona por cercanía (D-50): ${c.evidencia} Punto de referencia: ${ref.fuente}`,
  };
}

// Origen y destino según el nombre «Origen – Destino» (D-18: la ida sale del
// origen). Se busca entre los lugares que dicen servir a esa ruta; si el nombre
// del lugar no es idéntico al del nombre de la ruta (p. ej. 004 «Col. Industrial
// Nuevo San Juan» → «Nuevo Parque Industrial»), se toma el único que sobra.
export function extremosDeRuta(numero, nombre, lugares, zonas) {
  const partes = nombre.split(' – ').map((p) => p.trim());
  const propios = lugares.filter((l) => l.rutas.includes(numero));
  const porNombre = (n) => propios.find((l) => l.lugar === n);
  let origen = porNombre(partes[0]);
  let destino = porNombre(partes[partes.length - 1]);
  const sobran = propios.filter((l) => l !== origen && l !== destino);
  if (!origen && sobran.length === 1 && destino) origen = sobran[0];
  if (!destino && sobran.length === 1 && origen) destino = sobran[0];
  if (!origen || !destino || origen === destino) {
    throw new Error(`la ruta ${numero} no tiene dos extremos claros en extremos-finales.json`);
  }
  return { origen: zonaDe(origen, lugares, zonas), destino: zonaDe(destino, lugares, zonas) };
}

export function armarDatosApp() {
  const rutas = leerCSV(join(raiz, 'datos/gtfs-sjr/routes.txt'));
  const lugares = JSON.parse(readFileSync(join(raiz, 'datos/investigacion/extremos-finales.json'), 'utf8')).lugares;
  const zonas = JSON.parse(readFileSync(join(raiz, 'datos/investigacion/zonas-probables.json'), 'utf8'));
  const fichas = JSON.parse(readFileSync(join(raiz, 'datos/fichas/rutas.json'), 'utf8'));
  const porId = new Map(fichas.rutas.map((f) => [f.route_id, f]));
  if (porId.size !== rutas.length) {
    throw new Error(`routes.txt tiene ${rutas.length} rutas y las fichas ${porId.size}`);
  }

  return {
    descripcion:
      'Datos de la app SJDR Bus. Archivo generado por scripts/datos-app.mjs desde datos/gtfs-sjr/routes.txt y datos/fichas/rutas.json; no se edita a mano. Las cifras por sentido son referencia Moovit (D-07), no fuente oficial.',
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
        extremos: extremosDeRuta(r.route_short_name, r.route_long_name, lugares, zonas),
      };
      if (ficha.grupo === 'verificada') {
        // Cada sentido con sus propias cifras (lección 2): se copian tal cual.
        ruta.sentidos = { ida: ficha.sentidos.ida, vuelta: ficha.sentidos.vuelta };
      }
      return ruta;
    }),
  };
}

// M-05: paradas de OpenStreetMap para la capa del mapa. Se copian tal cual de
// stops.txt: ninguna coordenada se mueve y ninguna parada se liga a una ruta
// (el orden por ruta y sentido sale de campo o de la AMEQ).
// Cuando OSM no trae nombre, N-08 escribió «Parada sin nombre en OSM (…)»; la
// app no lo presenta como nombre: queda en null.
const SIN_NOMBRE = /^Parada sin nombre en OSM \(/;

export function armarParadasApp() {
  const paradas = leerCSV(join(raiz, 'datos/gtfs-sjr/stops.txt'));
  return {
    descripcion:
      'Paradas de autobús que ya existen en OpenStreetMap dentro de San Juan del Río. Archivo generado por scripts/datos-app.mjs desde datos/gtfs-sjr/stops.txt; no se edita a mano. Todas POR VERIFICAR EN CAMPO y sin asignar a ninguna ruta.',
    licencia: 'ODbL 1.0 · © colaboradores de OpenStreetMap',
    paradas: paradas.map((p) => {
      const lat = Number(p.stop_lat);
      const lon = Number(p.stop_lon);
      if (!Number.isFinite(lat) || !Number.isFinite(lon)) throw new Error(`parada sin coordenada: ${p.stop_id}`);
      if (!p.osm_id || !p.fuente || !p.fecha || !p.estado) throw new Error(`parada sin identificador, fuente, fecha o estado: ${p.stop_id}`);
      return {
        stop_id: p.stop_id,
        nombre: SIN_NOMBRE.test(p.stop_name) ? null : p.stop_name,
        lat,
        lon,
        osm_id: p.osm_id,
        url: p.stop_url,
        fuente: p.fuente,
        fecha: p.fecha,
        estado: p.estado,
      };
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
  const salidaParadas = join(dirname(salida), 'paradas.json');
  const paradas = armarParadasApp();
  writeFileSync(salidaParadas, JSON.stringify(paradas, null, 2) + '\n');
  console.log(`DATOS DE LA APP: ${paradas.paradas.length} paradas → ${salidaParadas.replace(raiz, '')}`);
}
