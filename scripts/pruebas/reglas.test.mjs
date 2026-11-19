// Prueba de la prueba: las reglas deben detectar las violaciones del mockup de la práctica.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';

const script = new URL('../reglas.mjs', import.meta.url).pathname;
const muestra = new URL('./muestra-prohibida', import.meta.url).pathname;

test('reglas.mjs rechaza OSRM en vivo, fuentes de Google, la marca, coordenadas inventadas y llaves de sesión', () => {
  const r = spawnSync(process.execPath, [script, `--app=${muestra}`], { encoding: 'utf8' });
  assert.equal(r.status, 1, 'debía fallar');
  for (const esperado of ['router.project-osrm.org', 'fonts.googleapis.com', 'marca Qrobús', '20.39020', 'llave de sesión']) {
    assert.match(r.stderr, new RegExp(esperado.replace(/\./g, '\\.')), `no detectó: ${esperado}`);
  }
});

test('el repositorio cumple las reglas', () => {
  const r = spawnSync(process.execPath, [script], { encoding: 'utf8' });
  assert.equal(r.status, 0, r.stderr);
});
