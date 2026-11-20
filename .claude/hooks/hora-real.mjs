#!/usr/bin/env node
// Control de la lección 7 (horas escritas sin reloj), promovida a la 3.ª
// ocurrencia (CLAUDE.md, 20 nov 2026). Hook PostToolUse de Claude Code para
// Edit, Write, MultiEdit y Bash: si el texto nuevo trae una hora («2:14 am»)
// que no estaba antes, le devuelve a Claude la hora real de México y la hora
// escrita, para que la diferencia se vea en el momento.
// Es un aviso, no un bloqueo: una hora de un registro (commit, PR, nota vieja)
// es válida aunque no sea la de ahora.
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { relative } from 'node:path';
import { pathToFileURL } from 'node:url';

const HORA = /\b(1[0-2]|0?[1-9]):([0-5]\d)\s?(a\.?\s?m\.?|p\.?\s?m\.?)(?![a-z])/gi;

// «1:28 y 1:43 am», «11:39 a 12:15 am»: la primera hora toma el am/pm de la segunda.
const HORA_LISTA = /\b(1[0-2]|0?[1-9]):([0-5]\d)(?=\s?(?:y|a|–|-)\s?(?:1[0-2]|0?[1-9]):[0-5]\d\s?([ap])\.?\s?m)/gi;

const normal = (h, m, ap) => `${Number(h)}:${m} ${/^a/i.test(ap) ? 'am' : 'pm'}`;
export function horas(texto = '') {
  const t = String(texto);
  return [...t.matchAll(HORA), ...t.matchAll(HORA_LISTA)]
    .sort((a, b) => a.index - b.index)
    .map((x) => normal(x[1], x[2], x[3]));
}

// Horas que aparecen en «nuevo» y no en «antes» (cuenta repeticiones).
export function horasNuevas(antes = '', nuevo = '') {
  const quedan = horas(antes);
  const r = [];
  for (const h of horas(nuevo)) {
    const i = quedan.indexOf(h);
    if (i >= 0) quedan.splice(i, 1);
    else r.push(h);
  }
  return [...new Set(r)];
}

export function horaMexico(ahora = new Date()) {
  const p = Object.fromEntries(new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Mexico_City', hour: 'numeric', minute: '2-digit', hour12: true,
    day: 'numeric', month: 'short', year: 'numeric',
  }).formatToParts(ahora).map((x) => [x.type, x.value]));
  return { hora: `${p.hour}:${p.minute} ${p.dayPeriod.toLowerCase()}`, fecha: `${p.day} ${p.month} ${p.year}` };
}

const minutos = (h) => { const [, hh, mm, ap] = h.match(/(\d+):(\d+) (am|pm)/); return ((Number(hh) % 12) + (ap === 'pm' ? 12 : 0)) * 60 + Number(mm); };

// Texto antes y después según la herramienta.
export function cambio(entrada, leerAnterior = () => '') {
  const t = entrada.tool_input ?? {};
  switch (entrada.tool_name) {
    case 'Edit': return [t.old_string, t.new_string];
    case 'MultiEdit': return [(t.edits ?? []).map((e) => e.old_string).join('\n'), (t.edits ?? []).map((e) => e.new_string).join('\n')];
    case 'Write': return [leerAnterior(t.file_path), t.content];
    case 'Bash': return ['', t.command]; // en un comando no se distingue lo viejo de lo nuevo: se avisa todo
    default: return ['', ''];
  }
}

export function aviso(entrada, ahora = new Date(), leerAnterior) {
  const [antes, nuevo] = cambio(entrada, leerAnterior);
  const nuevas = horasNuevas(antes, nuevo);
  if (!nuevas.length) return null;
  const real = horaMexico(ahora);
  const detalle = nuevas.map((h) => {
    const d = minutos(h) - minutos(real.hora);
    return d > 0 ? `${h} (¡${d} min DESPUÉS de la hora real!)` : `${h} (${-d} min antes)`;
  }).join(', ');
  return `Lección 7 (hora-real): hora real de México: ${real.hora}, ${real.fecha}. Horas escritas en ${entrada.tool_name}: ${detalle}. Si una hora no salió de \`TZ=America/Mexico_City date\` corrido en el momento o de un registro (commit, PR, nota), corrígela antes del commit.`;
}

// Versión de HEAD del archivo (para Write sobre un archivo que ya existía).
function anteriorEnGit(archivo, raiz) {
  try {
    return execFileSync('git', ['-C', raiz, 'show', `HEAD:${relative(raiz, archivo)}`], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
  } catch { return ''; }
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  try {
    const entrada = JSON.parse(readFileSync(0, 'utf8'));
    const raiz = process.env.CLAUDE_PROJECT_DIR ?? entrada.cwd ?? process.cwd();
    const texto = aviso(entrada, new Date(), (f) => (f ? anteriorEnGit(f, raiz) : ''));
    if (texto) process.stdout.write(JSON.stringify({ hookSpecificOutput: { hookEventName: 'PostToolUse', additionalContext: texto } }));
  } catch {
    // un aviso nunca debe romper la edición
  }
}
