// D-74 · Lecciones 15 y 17: cada prueba nueva se corre con su defecto puesto y debe fallar.
// Por cada defecto: lo pone (reemplazo de texto exacto), compila (debe salir con código 0; si no,
// la corrida no cuenta), corre las pruebas que lo vigilan, anota cuántas fallan y restaura.
// Uso: node docs/evidencia/d74/validar-defectos.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
const H = 'web/public/campo.html', G = 'scripts/datos-app.mjs';
const DEFECTOS = [
  { nombre: 'vuelta copiada de la ida (generador)', archivo: G, de: "const v = fuente?.sentidos?.[s];", a: "const v = fuente?.sentidos?.IDA;",
    correr: ['node', ['--test', 'scripts/pruebas/campo-sentido.test.mjs']], compilar: false },
  { nombre: 'primera pregunta por GPS (como la v3)', archivo: H, de: "  if (v.actual != null && !hechas.has(v.actual)) return;\n", a: "  if (v.actual != null && !hechas.has(v.actual)) return;\n  if (v.actual == null && pos) { const m = masCercana(L, hechas, pos); if (m) { v.actual = m.p.orden; return; } }\n",
    correr: ['npx', ['playwright', 'test', 'pruebas-navegador/d66.spec.mjs', '-g', 'c1 ', '--reporter=line']] },
  { nombre: '«Más cercana» hacia una parada sin punto', archivo: H, de: "if (!hechas.has(p.orden) && p.lat != null) { const d = metros(punto, p);", a: "if (!hechas.has(p.orden)) { const d = p.lat != null ? metros(punto, p) : 0;",
    correr: ['npx', ['playwright', 'test', 'pruebas-navegador/d66.spec.mjs', '-g', 'c3 |c4 ', '--reporter=line']] },
  { nombre: 'veredicto sin tramo mínimo', archivo: H, de: "UMBRAL = 0.8, MINIMO = 5;", a: "UMBRAL = 0.8, MINIMO = 0;",
    correr: ['npx', ['playwright', 'test', 'pruebas-navegador/d66.spec.mjs', '-g', 'c12 ', '--reporter=line']] },
  { nombre: 'a 320 px «Más cercana» tapa la hora (sin el ajuste)', archivo: H, de: "@media(max-width:380px){.cerca{", a: "@media(max-width:1px){.cerca{",
    correr: ['npx', ['playwright', 'test', 'pruebas-navegador/d66.spec.mjs', '-g', 'c14: a 320', '--reporter=line']] },
];
let malas = 0;
for (const d of DEFECTOS) {
  const original = readFileSync(d.archivo, 'utf8');
  if (original.split(d.de).length !== 2) { console.log(`✗ ${d.nombre}: el texto a cambiar no aparece una sola vez`); malas++; continue; }
  writeFileSync(d.archivo, original.replace(d.de, d.a));
  try {
    let comp = 'sin compilar (prueba de datos)';
    if (d.compilar !== false) {
      const b = spawnSync('npm', ['run', 'build'], { encoding: 'utf8' });
      if (b.status !== 0) { console.log(`✗ ${d.nombre}: la compilación falló (código ${b.status}); la corrida no cuenta`); malas++; continue; }
      comp = 'compilación OK';
    }
    const r = spawnSync(d.correr[0], d.correr[1], { encoding: 'utf8' });
    const salida = r.stdout + r.stderr;
    const fallan = (salida.match(/(\d+) failed/) ?? salida.match(/ℹ fail (\d+)/) ?? [0, 0])[1];
    const ok = r.status !== 0 && +fallan > 0;
    console.log(`${ok ? '✓' : '✗'} ${d.nombre}: ${comp}; fallan ${fallan} (debe ser > 0)`);
    if (!ok) malas++;
  } finally { writeFileSync(d.archivo, original); }
}
const b = spawnSync('npm', ['run', 'build'], { encoding: 'utf8' });
console.log(`Restaurado y recompilado: código ${b.status}`);
console.log(malas ? `FALLAN ${malas}: hay pruebas que no ven su defecto` : 'TODO PASÓ: cada prueba nueva falla con su defecto puesto');
process.exit(malas || b.status ? 1 : 0);
