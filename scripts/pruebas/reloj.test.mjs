// Prevención de la lección 7 (causa raíz, 20 nov 2026): el hook reloj.mjs le da a
// Claude la hora real de México con cada mensaje de Miguel, para que «Miguel
// decidió a las…» nunca se estime. Caso real que debe evitar (5.ª ocurrencia):
// «3:38 pm» escrito cuando el reloj decía 3:52 pm.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { sello } from '../../.claude/hooks/reloj.mjs';

const raiz = new URL('../../', import.meta.url).pathname;
const A_LAS_3_52 = new Date('2026-11-20T21:52:00Z'); // 3:52 pm en la Ciudad de México (UTC-6)

test('reloj: el sello trae la hora real de México del mensaje', () => {
  const t = sello(A_LAS_3_52);
  assert.match(t, /recibido a las 3:52 pm, 20 Nov 2026/);
  assert.doesNotMatch(t, /3:38 pm/);
  assert.match(t, /nunca la escribas de memoria/);
});

test('reloj: el hook responde como UserPromptSubmit con la hora como contexto', () => {
  const salida = JSON.parse(execFileSync('node', ['.claude/hooks/reloj.mjs'], { cwd: raiz, env: { ...process.env, TZ: 'UTC' } }).toString());
  assert.equal(salida.hookSpecificOutput.hookEventName, 'UserPromptSubmit');
  assert.match(salida.hookSpecificOutput.additionalContext, /recibido a las \d{1,2}:\d{2} [ap]m/);
});

test('reloj: está conectado en .claude/settings.json junto al detector hora-real', () => {
  const ajustes = JSON.parse(readFileSync(new URL('../../.claude/settings.json', import.meta.url), 'utf8'));
  const comandos = (ev) => (ajustes.hooks?.[ev] ?? []).flatMap((g) => g.hooks.map((h) => h.command)).join(' ');
  assert.match(comandos('UserPromptSubmit'), /reloj\.mjs/);
  assert.match(comandos('PostToolUse'), /hora-real\.mjs/);
});
