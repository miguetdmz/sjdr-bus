// N-07: el feed se empaqueta en ZIP y el ZIP pasa por el validador de MobilityData.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const script = new URL('../empaquetar-gtfs.mjs', import.meta.url).pathname;
const empaquetar = (...args) => {
  const carpeta = mkdtempSync(join(tmpdir(), 'empaque-'));
  try {
    return spawnSync(process.execPath, [script, `--salida=${join(carpeta, 'feed.zip')}`, '--fecha=2026-11-17', ...args], { encoding: 'utf8' });
  } finally {
    rmSync(carpeta, { recursive: true, force: true });
  }
};

test('empaque: un feed completo se empaqueta y pasa el validador', () => {
  const r = empaquetar(`--carpeta=${new URL('./gtfs/feed-valido', import.meta.url).pathname}`);
  assert.equal(r.status, 0, r.stderr);
  assert.match(r.stdout, /7 archivos/);
  assert.match(r.stdout, /sin errores/);
});

// Candado de avance («trinquete»): el feed real v0.1 todavía no tiene viajes ni
// horas de paso, porque no hay datos reales para ellos (no se inventan; ver el PR
// de N-07). Las paradas ya existen desde N-08 (OpenStreetMap, por verificar).
// La prueba admite SOLO esos dos errores conocidos. Si aparece cualquier otro error,
// falla. Cuando se agreguen datos reales, esta lista se acorta.
const ERRORES_CONOCIDOS = ['stop_times.txt', 'trips.txt'];

test('empaque: el feed real solo tiene los errores conocidos y explicados', () => {
  const r = empaquetar();
  const errores = [...r.stderr.matchAll(/✗ ERROR (\S+)/g)].map((m) => m[1]);
  const faltantes = [...r.stderr.matchAll(/"filename":"([^"]+)"/g)].map((m) => m[1]).sort();
  if (r.status === 0) return; // sin errores: mejor todavía
  assert.deepEqual(errores, ['missing_required_file'], `errores nuevos en el feed:\n${r.stderr}`);
  assert.deepEqual(faltantes, ERRORES_CONOCIDOS);
});
