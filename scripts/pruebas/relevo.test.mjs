// D-44: la bandera de relevo (docs/RELEVO.md) tiene un estado válido y bien
// escrito. Si la tarjeta kanban está mal llenada, la estación siguiente no la
// entiende: el turno no arranca o el inspector no revisa.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const texto = readFileSync(new URL('../../docs/RELEVO.md', import.meta.url), 'utf8');

// Fecha de la mañana en que termina el turno: hora de entrega + 6 horas.
export function nocheDe(fecha, hora) {
  const [a, m, d] = fecha.split('-').map(Number);
  const [h, min] = hora.split(':').map(Number);
  const t = new Date(Date.UTC(a, m - 1, d, h + 6, min));
  return t.toISOString().slice(0, 10);
}

export function revisarEstado(linea) {
  if (linea === 'Estado: EN SESIÓN') return { estado: 'EN SESIÓN' };
  let r = linea.match(/^Estado: ENTREGADO · (\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}) · para noche\/(\d{4}-\d{2}-\d{2})$/);
  if (r) {
    const [, fecha, hora, noche] = r;
    assert.equal(noche, nocheDe(fecha, hora), `la rama noche/ debe ser noche/${nocheDe(fecha, hora)}`);
    return { estado: 'ENTREGADO', noche };
  }
  r = linea.match(/^Estado: TURNO TERMINADO · (\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}) · noche\/(\d{4}-\d{2}-\d{2})$/);
  if (r) return { estado: 'TURNO TERMINADO', noche: r[3] };
  throw new Error(`estado de relevo no válido: «${linea}»`);
}

test('relevo: una sola línea «Estado:» con un estado válido', () => {
  const lineas = texto.split('\n').filter((l) => l.startsWith('Estado:'));
  assert.equal(lineas.length, 1, 'debe haber exactamente una línea «Estado:»');
  revisarEstado(lineas[0].trim());
});

test('relevo: los tres formatos se reconocen y los mal escritos se rechazan', () => {
  assert.equal(revisarEstado('Estado: EN SESIÓN').estado, 'EN SESIÓN');
  assert.equal(revisarEstado('Estado: ENTREGADO · 2026-11-20 21:40 · para noche/2026-11-21').noche, '2026-11-21');
  assert.equal(revisarEstado('Estado: ENTREGADO · 2026-11-21 01:10 · para noche/2026-11-21').noche, '2026-11-21');
  assert.equal(revisarEstado('Estado: TURNO TERMINADO · 2026-11-21 00:58 · noche/2026-11-21').estado, 'TURNO TERMINADO');
  // Fecha de noche equivocada (bandera vieja o mal calculada).
  assert.throws(() => revisarEstado('Estado: ENTREGADO · 2026-11-20 21:40 · para noche/2026-11-20'));
  assert.throws(() => revisarEstado('Estado: entregado'));
  assert.throws(() => revisarEstado('Estado: LISTO'));
});
