// Prueba de la prueba (N-02): el validador de MobilityData debe aceptar el feed válido
// y rechazar el feed con un error puesto a propósito.
// Los dos feeds de scripts/pruebas/gtfs/ son de PRUEBA: ni la agencia, ni la ruta, ni
// las paradas son reales.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';

const script = new URL('../validar-gtfs.mjs', import.meta.url).pathname;
const feed = (nombre) => new URL(`./gtfs/${nombre}`, import.meta.url).pathname;
// Fecha fija: el resultado no cambia con el día en que se corra la prueba.
const validar = (nombre) =>
  spawnSync(process.execPath, [script, feed(nombre), '--fecha=2026-11-17'], { encoding: 'utf8' });

// Las dos validaciones van en orden dentro de una sola prueba, para descargar el
// validador una sola vez.
test('validador GTFS: el feed válido pasa y el feed con error falla', () => {
  const valido = validar('feed-valido');
  assert.equal(valido.status, 0, `el feed válido debía pasar:\n${valido.stderr}`);
  assert.match(valido.stdout, /sin errores/);

  const conError = validar('feed-con-error');
  assert.equal(conError.status, 1, 'el feed con error debía fallar');
  assert.match(conError.stderr, /foreign_key_violation/, 'debía detectar la parada inexistente');
});
