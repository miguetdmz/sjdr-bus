#!/usr/bin/env node
// Arma el ZIP del feed GTFS-SJR y lo pasa por el validador de MobilityData (N-07).
// Como el empaque final de una pieza: se juntan los .txt del feed en una sola caja
// (el ZIP que piden Google Maps y los validadores) y la caja entera pasa por inspección.
//
// Uso:
//   node scripts/empaquetar-gtfs.mjs                      feed real: datos/gtfs-sjr
//   node scripts/empaquetar-gtfs.mjs --carpeta=<carpeta>  otra carpeta (lo usan las pruebas)
//   … --salida=<archivo.zip>                              dónde dejar el ZIP
//   … --fecha=AAAA-MM-DD                                  fecha para el validador
//
// El ZIP va por defecto a dist/gtfs-sjr-v<versión de feed_info.txt>.zip (dist/ no se
// sube a git: el ZIP se arma de nuevo cuando haga falta). Sale con el mismo código que
// el validador: 0 sin errores, 1 con errores.
import { spawnSync } from 'node:child_process';
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { crc32, deflateRawSync } from 'node:zlib';
import { leerCSV } from './lib/csv.mjs';

const raiz = new URL('..', import.meta.url).pathname;
const arg = (nombre) => process.argv.find((a) => a.startsWith(`--${nombre}=`))?.slice(nombre.length + 3);
const carpeta = arg('carpeta') ?? join(raiz, 'datos', 'gtfs-sjr');
const fecha = arg('fecha');

const archivos = readdirSync(carpeta).filter((f) => f.endsWith('.txt')).sort();
if (!archivos.length) {
  console.error(`EMPAQUE GTFS: no hay archivos .txt en ${carpeta}`);
  process.exit(1);
}

let version = 'sin-version';
if (archivos.includes('feed_info.txt')) version = leerCSV(join(carpeta, 'feed_info.txt'))[0]?.feed_version || version;
const salida = arg('salida') ?? join(raiz, 'dist', `gtfs-sjr-v${version}.zip`);

// ZIP mínimo (formato PKWARE, compresión «deflate»), sin dependencias. Fecha fija
// (1 ene 2026) para que el mismo feed produzca siempre el mismo ZIP, byte por byte.
function armarZip(entradas) {
  const FECHA_DOS = ((2026 - 1980) << 9) | (1 << 5) | 1;
  const locales = [];
  const centrales = [];
  let desplazamiento = 0;
  for (const { nombre, datos } of entradas) {
    const nombreB = Buffer.from(nombre, 'utf8');
    const comprimido = deflateRawSync(datos, { level: 9 });
    const crc = crc32(datos);
    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(20, 4); // versión necesaria
    local.writeUInt16LE(0x0800, 6); // nombres en UTF-8
    local.writeUInt16LE(8, 8); // deflate
    local.writeUInt16LE(0, 10); // hora
    local.writeUInt16LE(FECHA_DOS, 12);
    local.writeUInt32LE(crc, 14);
    local.writeUInt32LE(comprimido.length, 18);
    local.writeUInt32LE(datos.length, 22);
    local.writeUInt16LE(nombreB.length, 26);
    local.writeUInt16LE(0, 28);
    locales.push(local, nombreB, comprimido);

    const central = Buffer.alloc(46);
    central.writeUInt32LE(0x02014b50, 0);
    central.writeUInt16LE(20, 4);
    central.writeUInt16LE(20, 6);
    central.writeUInt16LE(0x0800, 8);
    central.writeUInt16LE(8, 10);
    central.writeUInt16LE(0, 12);
    central.writeUInt16LE(FECHA_DOS, 14);
    central.writeUInt32LE(crc, 16);
    central.writeUInt32LE(comprimido.length, 20);
    central.writeUInt32LE(datos.length, 24);
    central.writeUInt16LE(nombreB.length, 28);
    central.writeUInt32LE(desplazamiento, 42);
    centrales.push(central, nombreB);
    desplazamiento += local.length + nombreB.length + comprimido.length;
  }
  const directorio = Buffer.concat(centrales);
  const fin = Buffer.alloc(22);
  fin.writeUInt32LE(0x06054b50, 0);
  fin.writeUInt16LE(entradas.length, 8);
  fin.writeUInt16LE(entradas.length, 10);
  fin.writeUInt32LE(directorio.length, 12);
  fin.writeUInt32LE(desplazamiento, 16);
  return Buffer.concat([...locales, directorio, fin]);
}

mkdirSync(dirname(salida), { recursive: true });
writeFileSync(salida, armarZip(archivos.map((nombre) => ({ nombre, datos: readFileSync(join(carpeta, nombre)) }))));
console.log(`EMPAQUE GTFS: ${salida} (${archivos.length} archivos: ${archivos.join(', ')})`);

const validar = [join(raiz, 'scripts', 'validar-gtfs.mjs'), salida];
if (fecha) validar.push(`--fecha=${fecha}`);
const r = spawnSync(process.execPath, validar, { stdio: 'inherit' });
process.exit(r.status ?? 1);
