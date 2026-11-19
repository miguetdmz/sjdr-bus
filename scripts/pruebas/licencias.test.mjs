// Prueba de la prueba (N-04): el candado de licencias debe rechazar una dependencia
// con licencia no permitida o sin anotar, y dejar pasar el repositorio.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';

const script = new URL('../licencias.mjs', import.meta.url).pathname;
const ejemplo = (nombre) => new URL(`./licencias/${nombre}`, import.meta.url).pathname;
const revisar = (...args) => spawnSync(process.execPath, [script, ...args], { encoding: 'utf8' });

test('licencias: una dependencia directa GPL hace fallar', () => {
  const r = revisar(`--carpeta=${ejemplo('no-permitida')}`);
  assert.equal(r.status, 1, 'debía fallar');
  assert.match(r.stderr, /paquete-de-prueba-gpl: licencia «GPL-3\.0-only» no permitida/);
});

test('licencias: una dependencia directa sin anotar en LICENCIAS.md hace fallar', () => {
  const r = revisar(`--carpeta=${ejemplo('sin-anotar')}`);
  assert.equal(r.status, 1, 'debía fallar');
  assert.match(r.stderr, /paquete-de-prueba-sin-anotar: no está anotada/);
});

test('licencias: una indirecta no permitida solo da aviso', () => {
  const r = revisar(`--carpeta=${ejemplo('correcta')}`);
  assert.equal(r.status, 0, r.stderr);
  assert.match(r.stdout, /aviso.*\n.*indirecta-de-prueba/);
});

test('licencias: el repositorio pasa', () => {
  const r = revisar();
  assert.equal(r.status, 0, r.stderr);
});
