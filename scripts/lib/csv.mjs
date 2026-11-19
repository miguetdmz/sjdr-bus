// Lector mínimo de CSV para los archivos .txt del GTFS-SJR (RFC 4180: comillas,
// comas y saltos de línea dentro de comillas). Devuelve una lista de objetos
// {columna: valor}. Sin dependencias.
import { readFileSync } from 'node:fs';

export function leerCSV(ruta) {
  const texto = readFileSync(ruta, 'utf8').replace(/^﻿/, '');
  const filas = [];
  let fila = [];
  let campo = '';
  let comillas = false;
  for (let i = 0; i < texto.length; i++) {
    const c = texto[i];
    if (comillas) {
      if (c === '"' && texto[i + 1] === '"') { campo += '"'; i++; }
      else if (c === '"') comillas = false;
      else campo += c;
    } else if (c === '"') comillas = true;
    else if (c === ',') { fila.push(campo); campo = ''; }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && texto[i + 1] === '\n') i++;
      fila.push(campo); filas.push(fila); fila = []; campo = '';
    } else campo += c;
  }
  if (campo !== '' || fila.length) { fila.push(campo); filas.push(fila); }
  const [encabezado, ...datos] = filas.filter((f) => !(f.length === 1 && f[0] === ''));
  return datos.map((f) => Object.fromEntries(encabezado.map((col, j) => [col, f[j] ?? ''])));
}
