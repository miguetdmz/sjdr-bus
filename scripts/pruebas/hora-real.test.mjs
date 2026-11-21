// Control de la lección 7 (CLAUDE.md, 3.ª ocurrencia, 20 nov 2026): el hook
// .claude/hooks/hora-real.mjs avisa cuando se escribe una hora nueva, con la
// hora real de México al lado. Caso real que debe atrapar: «2:13 am» escrito a
// las 2:14 am en un comentario de scripts/cruces.mjs.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { horas, horasNuevas, horaMexico, aviso } from '../../.claude/hooks/hora-real.mjs';

const raiz = new URL('../../', import.meta.url).pathname;
const A_LAS_2_14 = new Date('2026-11-20T08:14:00Z'); // 2:14 am en la Ciudad de México (UTC-6)

test('hora-real: reconoce las horas como se escriben en el proyecto', () => {
  assert.deepEqual(horas('20 nov 2026, 2:03 am; a las 11:39 pm; 12:15 a.m.; 1:28 y 1:43 am'), ['2:03 am', '11:39 pm', '12:15 am', '1:28 am', '1:43 am']);
  assert.deepEqual(horas('coordenadas 20.38442 -99.99048, 1,581 caracteres, D-43, 3:1'), []);
});

test('hora-real: la hora de México sale de la zona America/Mexico_City', () => {
  assert.deepEqual(horaMexico(A_LAS_2_14), { hora: '2:14 am', fecha: '20 Nov 2026' });
});

test('hora-real: atrapa el caso real de la 3.ª ocurrencia («2:13 am» escrito a las 2:14 am)', () => {
  const entrada = {
    tool_name: 'Edit',
    tool_input: { old_string: '// orden. Miguel decidió:', new_string: '// orden. Miguel decidió (D-43, 20 nov 2026, 2:13 am):' },
  };
  const t = aviso(entrada, A_LAS_2_14);
  assert.match(t, /hora real de México: 2:14 am, 20 Nov 2026/);
  assert.match(t, /2:13 am \(1 min antes\)/);
});

test('hora-real: una hora en el futuro se marca fuerte', () => {
  const t = aviso({ tool_name: 'Edit', tool_input: { old_string: 'x', new_string: 'x 2:47 am' } }, A_LAS_2_14);
  assert.match(t, /2:47 am \(¡33 min DESPUÉS de la hora real!\)/);
});

test('hora-real: sin horas nuevas no hay aviso (no estorba)', () => {
  assert.equal(aviso({ tool_name: 'Edit', tool_input: { old_string: 'a las 1:43 am', new_string: 'a las 1:43 am, ya revisado' } }, A_LAS_2_14), null);
  assert.equal(aviso({ tool_name: 'Edit', tool_input: { old_string: 'a', new_string: 'b' } }, A_LAS_2_14), null);
  assert.equal(aviso({ tool_name: 'Read', tool_input: { file_path: 'x' } }, A_LAS_2_14), null);
  assert.deepEqual(horasNuevas('1:43 am', '1:43 am y 1:43 am'), ['1:43 am']);
});

test('hora-real: Write compara contra la versión anterior; MultiEdit y Bash también avisan', () => {
  const w = { tool_name: 'Write', tool_input: { file_path: '/x.md', content: 'nota de las 1:46 am y de las 2:10 am' } };
  assert.match(aviso(w, A_LAS_2_14, () => 'nota de las 1:46 am'), /Write: 2:10 am \(4 min antes\)$|Write: 2:10 am \(4 min antes\)\./);
  const m = { tool_name: 'MultiEdit', tool_input: { edits: [{ old_string: 'a', new_string: 'b 2:00 am' }] } };
  assert.match(aviso(m, A_LAS_2_14), /MultiEdit: 2:00 am/);
  const b = { tool_name: 'Bash', tool_input: { command: 'git commit -m "cierre a las 11:50 pm"' } };
  assert.match(aviso(b, A_LAS_2_14), /Bash: 11:50 pm/);
});

test('hora-real: el hook está conectado en .claude/settings.json y responde como hook de Claude Code', () => {
  const s = JSON.parse(readFileSync(`${raiz}.claude/settings.json`, 'utf8'));
  const h = (s.hooks?.PostToolUse ?? []).find((x) => x.hooks?.some((y) => /hora-real\.mjs/.test(y.command)));
  assert.ok(h, 'falta el hook hora-real en PostToolUse');
  for (const herramienta of ['Edit', 'Write', 'MultiEdit', 'Bash']) assert.ok(new RegExp(`(^|\\|)${herramienta}(\\||$)`).test(h.matcher), herramienta);
  // corrida real del script, como lo llama Claude Code (JSON por la entrada estándar)
  const salida = execFileSync('node', [`${raiz}.claude/hooks/hora-real.mjs`], {
    input: JSON.stringify({ tool_name: 'Edit', tool_input: { old_string: 'a', new_string: 'b 3:33 am' } }), encoding: 'utf8',
  });
  const j = JSON.parse(salida);
  assert.equal(j.hookSpecificOutput.hookEventName, 'PostToolUse');
  assert.match(j.hookSpecificOutput.additionalContext, /Lección 7 .*3:33 am/);
  // entrada rota: no truena ni imprime nada
  assert.equal(execFileSync('node', [`${raiz}.claude/hooks/hora-real.mjs`], { input: 'no es json', encoding: 'utf8' }), '');
});
