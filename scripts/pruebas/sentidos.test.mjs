// N-06: cada una de las 10 rutas verificadas lleva las cifras de CADA sentido,
// tal como en HANDOFF §5.1. Evita la falla del mockup de la práctica (lección 2 de
// CLAUDE.md, M-09), que copió la ida en la vuelta en 001, 002, 005 y 012.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fichasPorSentido } from '../lib/handoff.mjs';

const fichas = JSON.parse(readFileSync(new URL('../../datos/fichas/rutas.json', import.meta.url), 'utf8')).rutas;
const fuente = fichasPorSentido();
const verificadas = fichas.filter((f) => f.grupo === 'verificada');

test('sentidos: las 10 verificadas tienen ida y vuelta; las 29 de solo inventario, ninguna cifra', () => {
  assert.equal(verificadas.length, 10);
  assert.deepEqual(verificadas.map((f) => f.numero).sort(), Object.keys(fuente).sort());
  for (const f of verificadas) assert.deepEqual(Object.keys(f.sentidos ?? {}), ['ida', 'vuelta'], f.route_id);
  for (const f of fichas.filter((x) => x.grupo === 'solo-inventario')) {
    assert.equal(f.sentidos, undefined, `${f.route_id} no debe tener cifras inventadas`);
  }
});

test('sentidos: cada cifra coincide con HANDOFF §5.1, sentido por sentido', () => {
  for (const f of verificadas) {
    const esperado = fuente[f.numero];
    for (const s of ['ida', 'vuelta']) {
      const real = f.sentidos[s];
      assert.equal(real.paradas, esperado[s].paradas, `${f.numero} ${s}: paradas`);
      assert.equal(real.duracion_min, esperado[s].duracion_min, `${f.numero} ${s}: duración`);
      const horario = real.horario ? `${real.horario.inicio}–${real.horario.fin}` : real.horario_estado;
      assert.equal(horario.toLowerCase(), esperado.horario.toLowerCase(), `${f.numero} ${s}: horario`);
      assert.match(real.fuente, /^referencia Moovit, consulta nov 2026/, `${f.numero} ${s}: fuente`);
    }
  }
});

test('sentidos: ningún sentido copia al otro donde §5.1 dice que son distintos', () => {
  let distintos = 0;
  for (const f of verificadas) {
    const e = fuente[f.numero];
    for (const campo of ['paradas', 'duracion_min']) {
      if (e.ida[campo] !== e.vuelta[campo]) {
        distintos++;
        assert.notEqual(f.sentidos.ida[campo], f.sentidos.vuelta[campo], `${f.numero}: la vuelta copia ${campo} de la ida`);
      }
    }
  }
  assert.ok(distintos >= 16, 'la tabla de §5.1 debía tener cifras distintas por sentido');
});

test('sentidos: la 001 vuelta = 23 paradas / 16 min (criterio de N-06)', () => {
  const r001 = fichas.find((f) => f.route_id === 'U-001');
  assert.equal(r001.sentidos.vuelta.paradas, 23);
  assert.equal(r001.sentidos.vuelta.duracion_min, 16);
  assert.equal(r001.sentidos.ida.paradas, 29);
  assert.equal(r001.sentidos.ida.duracion_min, 20);
});

test('sentidos: sin frecuencia (no está verificada)', () => {
  for (const f of fichas) {
    assert.ok(f.frecuencia === undefined || f.frecuencia === null, `${f.route_id}: frecuencia sin verificar`);
    for (const s of Object.values(f.sentidos ?? {})) assert.equal(s.frecuencia, undefined, f.route_id);
  }
});
