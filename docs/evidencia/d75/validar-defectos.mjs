// D-75 · Lecciones 15 y 17: cada prueba nueva se corre con su defecto puesto y debe fallar.
// Por cada defecto: lo pone (texto exacto), compila (código 0 o la corrida no cuenta), corre las
// pruebas que lo vigilan, anota cuántas fallan y restaura.
// Uso: node docs/evidencia/d75/validar-defectos.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
const H = 'web/public/campo.html';
const pw = (g) => ['npx', ['playwright', 'test', 'pruebas-navegador/d66.spec.mjs', '-g', g, '--reporter=line']];
const DEFECTOS = [
  { nombre: 'barra que no mira la edad de la última ubicación (como v0.6)', de: "const vivo = gpsEstado === 'ok' && pos && Date.now() - ultimo <= HUECO_S * 1000;", a: "const vivo = gpsEstado === 'ok' && pos;", correr: pw('c15|c18') },
  { nombre: 'resumen de prueba sin huecos (como v0.6)', de: "ESTIMADO</small></div>\n    ${huecosHTML(v)}\n", a: "ESTIMADO</small></div>\n", correr: pw('c16') },
  { nombre: 'hora del punto sin revisar (como v0.6)', de: "const t = Math.abs(p.timestamp - Date.now()) < 864e5 ? p.timestamp : Date.now();", a: "const t = p.timestamp;", correr: pw('c17') },
  { nombre: 'reglas de 320 px antes de la regla general (como v0.6)', de: "@media(max-width:380px){.barra .gps{", a: "@media(max-width:1px){.barra .gps{", correr: pw('c18') },
];
let malas = 0;
for (const d of DEFECTOS) {
  const original = readFileSync(H, 'utf8');
  if (original.split(d.de).length !== 2) { console.log(`✗ ${d.nombre}: el texto a cambiar no aparece una sola vez`); malas++; continue; }
  writeFileSync(H, original.replace(d.de, d.a));
  try {
    const b = spawnSync('npm', ['run', 'build'], { encoding: 'utf8' });
    if (b.status !== 0) { console.log(`✗ ${d.nombre}: la compilación falló (código ${b.status}); la corrida no cuenta`); malas++; continue; }
    const r = spawnSync(d.correr[0], d.correr[1], { encoding: 'utf8' });
    const salida = r.stdout + r.stderr, fallan = (salida.match(/(\d+) failed/) ?? [0, 0])[1];
    const ok = r.status !== 0 && +fallan > 0;
    console.log(`${ok ? '✓' : '✗'} ${d.nombre}: compilación OK; fallan ${fallan} (debe ser > 0)`);
    if (!ok) malas++;
  } finally { writeFileSync(H, original); }
}
const b = spawnSync('npm', ['run', 'build'], { encoding: 'utf8' });
console.log(`Restaurado y recompilado: código ${b.status}`);
console.log(malas ? `FALLAN ${malas}: hay pruebas que no ven su defecto` : 'TODO PASÓ: cada prueba nueva falla con su defecto puesto');
process.exit(malas || b.status ? 1 : 0);
