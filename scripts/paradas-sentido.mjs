#!/usr/bin/env node
// D-71 · Paradas oficiales por sentido (R-03 paso 1).
//
// Dos pasos, como recibir material y luego surtirlo:
//   1) Recepción (una sola vez, con la lectura única ya hecha en referencias/):
//        node scripts/paradas-sentido.mjs --extraer <carpeta de la lectura>
//      Toma de cada respuesta SOLO el texto: número oficial (P-), nombre y orden.
//      Escribe datos/cache/qrobus/paradas-sentido.json y su .meta.json (huellas).
//   2) Surtido (cualquier vez, sin red):
//        node scripts/paradas-sentido.mjs
//      Cruza las paradas oficiales con la lista general (cruces.json) y escribe
//      datos/investigacion/paradas-cruce.json. Es un conteo: no cambia cruces.json.
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join } from 'node:path';
import { leerCSV } from './lib/csv.mjs';
import { leerSentido } from './lib/paradas-sentido.mjs';

const raiz = new URL('..', import.meta.url).pathname;
const CACHE = `${raiz}datos/cache/qrobus/paradas-sentido.json`;
const META = `${raiz}datos/cache/qrobus/paradas-sentido.meta.json`;
const CRUCE = `${raiz}datos/investigacion/paradas-cruce.json`;
const SENTIDOS = [['IDA', 0, 'ida'], ['REGRESO', 1, 'regreso']];

const json = (v) => JSON.stringify(v, null, 2) + '\n';
const sha = (b) => createHash('sha256').update(b).digest('hex');
const rutas = leerCSV(`${raiz}datos/gtfs-sjr/routes.txt`);

// ---------------------------------------------------------------------------
// 1) Recepción
if (process.argv[2] === '--extraer') {
  const carpeta = process.argv[3];
  if (!carpeta) { console.error('Uso: --extraer <carpeta de la lectura>'); process.exit(1); }
  const bitacora = JSON.parse(readFileSync(join(carpeta, 'bitacora.json'), 'utf8'));
  const archivos = new Set(readdirSync(join(carpeta, 'respuestas')));
  const huellas = [];
  const salida = rutas.map((r) => {
    const sentidos = {};
    for (const [nombre, dir, sufijo] of SENTIDOS) {
      const archivo = `${r.route_short_name}-${sufijo}.json`;
      const consulta = bitacora.consultas.find((c) => c.ruta === r.route_short_name && c.direccion === dir);
      if (!archivos.has(archivo) || !consulta) {
        sentidos[nombre] = { estado: 'sin datos', motivo: 'no hay respuesta guardada de la lectura' };
        continue;
      }
      const crudo = readFileSync(join(carpeta, 'respuestas', archivo));
      const huella = sha(crudo);
      if (huella !== consulta.sha256) throw new Error(`${archivo}: la huella no coincide con la bitácora`);
      huellas.push({ ruta: r.route_short_name, sentido: nombre, consultado: consulta.consultado, status_http: consulta.status, intentos: consulta.intentos, bytes: consulta.bytes, sha256: huella });
      sentidos[nombre] = { ...leerSentido(crudo.toString('utf8')), sha256_respuesta: huella };
    }
    // Regla 10: si la vuelta salió igual a la ida, se anota; solo vale si las dos respuestas son idénticas.
    const ida = sentidos.IDA.paradas, reg = sentidos.REGRESO.paradas;
    if (ida && reg && JSON.stringify(ida) === JSON.stringify(reg)) {
      sentidos.IDA.igual_al_otro_sentido = true;
      sentidos.REGRESO.igual_al_otro_sentido = true;
    }
    return { route_id: r.route_id, numero: r.route_short_name, nombre: r.route_long_name, sentidos };
  });
  const contar = (e) => salida.reduce((n, r) => n + Object.values(r.sentidos).filter((s) => s.estado === e).length, 0);
  writeFileSync(CACHE, json({
    tarea: 'B3 · R-03 paso 1 · paradas oficiales por sentido (D-71)',
    fuente: 'qrobus.gob.mx/Rutas, «Ver ruta» (consulta /Rutas/paradasTimeline), lectura única del 25 nov 2026',
    aviso: 'Iniciativa independiente: el texto de las paradas es de la página pública de la AMEQ; la AMEQ no opera ni respalda esta app. Solo texto: sin coordenadas ni trazo (D-71).',
    como_leer: 'Por ruta, en el orden de routes.txt; cada sentido con su propia respuesta (regla 10). «sin datos» lleva su motivo. Una parada «con datos» NO está ubicada: es el texto oficial, sin punto.',
    resumen: { ruta_sentidos: contar('con datos') + contar('sin datos'), con_datos: contar('con datos'), sin_datos: contar('sin datos') },
    rutas: salida,
  }));
  writeFileSync(META, json({
    url_pagina: bitacora.pagina.url,
    url_consulta: 'https://qrobus.gob.mx/Rutas/paradasTimeline (POST: ruta, direccion 0 = IDA, 1 = REGRESO)',
    metodo: '1 descarga de la página (sesión) y 1 consulta por ruta y sentido, pausa de 2.5 s (scripts/leer-paradas-qrobus.mjs). Se guarda solo sNombre partido en número P- y nombre, y su orden; el campo rutasParada no se guarda.',
    pagina: { consultado: bitacora.pagina.consultado, status_http: bitacora.pagina.status, bytes: bitacora.pagina.bytes, sha256: bitacora.pagina.sha256 },
    copia_completa: 'referencias/fuentes-2026-11-25/qrobus-paradas/ (fuera de git: la página trae una llave de sesión)',
    respuestas: huellas,
    sha256_extraido: sha(readFileSync(CACHE)),
  }));
  console.log(`PARADAS POR SENTIDO: ${contar('con datos')} con datos, ${contar('sin datos')} sin datos → ${CACHE.replace(raiz, '')}`);
  process.exit(0);
}

// ---------------------------------------------------------------------------
// 2) Surtido: cruce con la lista general de R-01 (cruces.json).
const norma = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toUpperCase().replace(/[^A-Z0-9]+/g, ' ').trim();
const paradas = JSON.parse(readFileSync(CACHE, 'utf8'));
const cruces = JSON.parse(readFileSync(`${raiz}datos/investigacion/cruces.json`, 'utf8'));
const porRuta = paradas.rutas.map((r) => {
  const general = cruces.rutas.find((c) => c.route_id === r.route_id);
  if (!general?.cruces) {
    return { route_id: r.route_id, numero: r.numero, lista_general: 'sin lista usable (cruces.json)' };
  }
  const textos = new Map(general.cruces.map((c) => [norma(c.texto), c]));
  const usados = new Set();
  const sentidos = {};
  for (const [nombre] of SENTIDOS) {
    const s = r.sentidos[nombre];
    if (s.estado !== 'con datos') { sentidos[nombre] = { estado: s.estado, motivo: s.motivo }; continue; }
    const sinPareja = [];
    let coinciden = 0;
    for (const p of s.paradas) {
      const c = textos.get(norma(p.nombre));
      if (c) { coinciden += 1; usados.add(c.orden); } else sinPareja.push(`${p.numero ?? 's/n'} ${p.nombre}`);
    }
    sentidos[nombre] = { paradas: s.paradas.length, coinciden_con_lista_general: coinciden, sin_pareja: sinPareja };
  }
  const sobran = general.cruces.filter((c) => !usados.has(c.orden)).map((c) => `${c.orden}. ${c.texto}`);
  return { route_id: r.route_id, numero: r.numero, lista_general: general.cruces.length, sentidos, de_la_lista_general_sin_parada_oficial: sobran };
});
writeFileSync(CRUCE, json({
  tarea: 'B3 · R-03 paso 1 · cruce de paradas oficiales por sentido con cruces.json (D-71, criterio 7)',
  como_leer: 'Coincidir = el mismo texto (sin acentos ni signos) que un renglón de la lista general de esa ruta. Es un conteo: no cambia ningún UBICADO ni ningún dato de cruces.json.',
  resumen: {
    rutas_con_lista_general: porRuta.filter((r) => r.sentidos).length,
    paradas_oficiales_en_esas_rutas: porRuta.reduce((n, r) => n + Object.values(r.sentidos ?? {}).reduce((m, s) => m + (s.paradas ?? 0), 0), 0),
    coinciden: porRuta.reduce((n, r) => n + Object.values(r.sentidos ?? {}).reduce((m, s) => m + (s.coinciden_con_lista_general ?? 0), 0), 0),
  },
  rutas: porRuta,
}));
console.log(`CRUCE: ${CRUCE.replace(raiz, '')}`);
