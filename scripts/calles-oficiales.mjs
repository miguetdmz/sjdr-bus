#!/usr/bin/env node
// R-01 (D-24, D-25): calles oficiales por ruta, desde la página pública de rutas
// de la AMEQ (https://qrobus.gob.mx/Rutas). Solo las listas visibles en la
// página (atributo data-buscar); nunca las consultas internas del mapa (D-25).
//
// Dos pasos, como recibir material y luego surtirlo:
//   1) Recepción (una sola vez, con la página ya descargada):
//        node scripts/calles-oficiales.mjs --extraer <página.html> <consultado ISO>
//      Copia TAL CUAL los 42 renglones de San Juan del Río a
//      datos/cache/qrobus/rutas-sjr.json y su huella a rutas.meta.json. La página
//      completa se queda fuera de git (referencias/): trae una llave de sesión.
//   2) Surtido (cualquier vez, sin red):
//        node scripts/calles-oficiales.mjs
//      Arma datos/investigacion/calles-oficiales.json desde la caché.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { leerCSV } from './lib/csv.mjs';

const raiz = new URL('..', import.meta.url).pathname;
const CACHE = 'datos/cache/qrobus';
const SALIDA = 'datos/investigacion/calles-oficiales.json';
const URL_PAGINA = 'https://qrobus.gob.mx/Rutas';

const rutas = leerCSV(`${raiz}datos/gtfs-sjr/routes.txt`);
const json = (v) => JSON.stringify(v, null, 2) + '\n';

import { MARCAS_QUERETARO } from './lib/queretaro.mjs';
export { MARCAS_QUERETARO };

const sinAcentos = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toUpperCase();
const nombreIgual = (a, b) => {
  const n = (s) => sinAcentos(s).replace(/ª/g, 'A').replace(/\([^)]*\)/g, '').replace(/FRACCIONAMIENTO/g, 'FRACC')
    .replace(/EN MEDIO/g, 'ENMEDIO').replace(/[^A-Z0-9]/g, '');
  return n(a) === n(b);
};

// ---------------------------------------------------------------------------
// 1) Recepción
if (process.argv[2] === '--extraer') {
  const [, , , archivo, consultado] = process.argv;
  if (!archivo || !/^\d{4}-\d{2}-\d{2}T/.test(consultado ?? '')) {
    console.error('Uso: --extraer <página.html> <consultado ISO, hora de México>');
    process.exit(1);
  }
  const bytes = readFileSync(archivo);
  const html = new TextDecoder('utf-8').decode(bytes);
  const re = /<tr class="verRuta[^"]*"\s+data-id="(\d+)"\s+data-ruta="([^"]*)"\s+data-nombre="([^"]*)"\s+data-buscar="([^"]*)"/g;
  const filas = [...html.matchAll(re)].map((m) => ({ data_id: m[1], data_ruta: m[2], data_nombre: m[3], data_buscar: m[4] }));
  const elegidas = rutas.map((r) => {
    const c = filas.filter((f) => f.data_ruta === r.route_short_name);
    if (c.length !== 1) throw new Error(`${r.route_id}: ${c.length} renglones con el número ${r.route_short_name}`);
    return { route_id: r.route_id, ...c[0] };
  });
  mkdirSync(`${raiz}${CACHE}`, { recursive: true });
  writeFileSync(`${raiz}${CACHE}/rutas-sjr.json`, json(elegidas));
  writeFileSync(`${raiz}${CACHE}/rutas.meta.json`, json({
    url: URL_PAGINA,
    consultado,
    metodo: 'una sola descarga GET de la página pública (curl), sin llamar consultas internas (D-25)',
    bytes: bytes.length,
    sha256: createHash('sha256').update(bytes).digest('hex'),
    renglones_en_pagina: filas.length,
    renglones_guardados: elegidas.length,
    pagina_completa: 'referencias/fuentes-2026-11-19/qrobus-rutas/ (fuera de git: trae una llave de sesión csrf)',
    nota: 'rutas-sjr.json copia tal cual los atributos data-id, data-ruta, data-nombre y data-buscar de los renglones cuyo número coincide con routes.txt.',
  }));
  console.log(`RECEPCIÓN: ${filas.length} renglones en la página; ${elegidas.length} de San Juan → ${CACHE}/rutas-sjr.json`);
}

// ---------------------------------------------------------------------------
// 2) Surtido
const meta = JSON.parse(readFileSync(`${raiz}${CACHE}/rutas.meta.json`, 'utf8'));
const cache = JSON.parse(readFileSync(`${raiz}${CACHE}/rutas-sjr.json`, 'utf8'));
const fecha = meta.consultado.slice(0, 10);
const fuente = `Página pública de rutas de la AMEQ (${URL_PAGINA}), consulta ${fecha}`;

const salida = rutas.map((r) => {
  const c = cache.find((f) => f.route_id === r.route_id);
  // data-buscar = «NOMBRE, NÚMERO,  lista». El nombre puede traer comas, así que
  // se corta después de «, NÚMERO,».
  const sep = `, ${c.data_ruta},`;
  const corte = c.data_buscar.indexOf(sep);
  const texto = corte >= 0 ? c.data_buscar.slice(corte + sep.length).trim() : '';
  const plano = sinAcentos(texto);
  const marcas = MARCAS_QUERETARO.filter((m) => new RegExp(`(^|[^A-Z])${m}([^A-Z]|$)`).test(plano));
  const revisar = marcas.length > 0;
  return {
    route_id: r.route_id,
    numero: r.route_short_name,
    nombre_inventario: r.route_long_name,
    nombre_pagina: c.data_nombre,
    nombre_coincide: nombreIgual(r.route_long_name, c.data_nombre),
    data_id: c.data_id,
    estado: texto ? 'con lista' : 'sin lista',
    lista_texto: texto || null,
    caracteres: texto.length,
    acentos_perdidos: (texto.match(/\?/g) ?? []).length,
    sentido: 'no indicado: la página no separa ida y vuelta (regla 10: no se asigna sentido con esta lista sola)',
    separacion: 'no confiable: la página separa los cruces solo con espacios; se divide en R-03 con nombres de calle',
    calles_de_queretaro: marcas,
    marca: revisar ? 'REVISAR: la lista mezcla calles de la ciudad de Querétaro' : null,
    usable_sin_revision: !revisar,
    fuente,
    fecha,
    estado_dato: 'ESTIMADO · POR VERIFICAR',
  };
});

const marcadas = salida.filter((s) => !s.usable_sin_revision).length;
writeFileSync(`${raiz}${SALIDA}`, json({
  tarea: 'R-01 (D-24, D-25)',
  fuente: { url: URL_PAGINA, oficial: true, editor: 'AMEQ', consultado: meta.consultado, sha256: meta.sha256 },
  como_leer: [
    'lista_texto es copia exacta del atributo data-buscar de la página, sin el nombre ni el número.',
    'Una lista sin marca NO está verificada: solo no trae calles reconocidas de la ciudad de Querétaro.',
    'Las rutas con marca REVISAR no se usan en R-03 sin revisión de Miguel.',
    'Los «?» dentro del texto son acentos que la página ya trae perdidos; no se corrigen.',
    `Criterio de calles de Querétaro: ${MARCAS_QUERETARO.join(', ')} [sin verificar con mapa].`,
  ],
  resumen: { rutas: salida.length, con_lista: salida.filter((s) => s.lista_texto).length, marcadas_revisar: marcadas, usables_sin_revision: salida.length - marcadas },
  rutas: salida,
}));
console.log(`CALLES OFICIALES: ${salida.length} rutas; ${marcadas} marcadas REVISAR → ${SALIDA}`);
