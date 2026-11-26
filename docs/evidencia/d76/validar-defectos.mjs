// D-76, lecciones 15 y 17: cada prueba nueva se corre con el defecto puesto y debe fallar.
// En cada corrida, primero la generación (scripts/cruces.mjs) sale con código 0; si no, la
// corrida no cuenta. Al final todo se restaura, se regenera limpio y se revisa que
// datos/cache/ no cambió. Uso: node docs/evidencia/d76/validar-defectos.mjs
import { execFileSync, spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
const raiz = fileURLToPath(new URL('../../../', import.meta.url));
const f = (r) => `${raiz}${r}`;
const sha = (r) => createHash('sha256').update(readFileSync(f(r))).digest('hex');
const CACHE = ['datos/cache/overpass/lugares-amplio.json', 'datos/cache/overpass/calles.json', 'datos/cache/overpass/lugares.json'];
const VIGILADOS = [...CACHE, 'scripts/cruces.mjs', 'scripts/datos-app.mjs'];
const huellas = Object.fromEntries(VIGILADOS.map((r) => [r, sha(r)]));
const generar = () => spawnSync('node', ['scripts/cruces.mjs'], { cwd: raiz, encoding: 'utf8' }).status;
const pruebas = () => {
  const r = spawnSync('node', ['--test', 'scripts/pruebas/d76.test.mjs'], { cwd: raiz, encoding: 'utf8' });
  const n = (k) => Number(r.stdout.match(new RegExp(`^ℹ ${k} (\\d+)`, 'm'))?.[1] ?? NaN);
  const caidas = [...new Set([...r.stdout.matchAll(/^✖ (D-76[^\n(]*)/gm)].map((m) => m[1].trim().slice(0, 60)))];
  return { pass: n('pass'), fail: n('fail'), caidas };
};
function cambiar(r, de, a) {
  const t = readFileSync(f(r), 'utf8');
  if (!t.includes(de)) throw new Error(`defecto no aplicado en ${r}: no encontré «${de.slice(0, 60)}»`);
  writeFileSync(f(r), t.replace(de, a));
  return t;
}
const DEFECTOS = [
  ['a', 'un lugar a 400 m se acepta (tope de 150 a 450 m)', [['scripts/cruces.mjs', 'const D76_TOPE_M = 150;', 'const D76_TOPE_M = 450;']], true],
  ['b', 'un UBICADO se mueve (después de generar)', [], true, () => {
    const j = JSON.parse(readFileSync(f('datos/investigacion/cruces.json'), 'utf8'));
    const c = j.rutas.find((r) => r.cruces).cruces.find((x) => x.estado === 'UBICADO');
    c.lat = Number((c.lat + 0.001).toFixed(5));
    writeFileSync(f('datos/investigacion/cruces.json'), JSON.stringify(j, null, 1) + '\n');
  }],
  // Con los datos de hoy, cruces.mjs toma «JALPAN DE SERRA» como el negocio y el falso del visual
  // (que tomó el otro lado) no sale; el ajuste A queda de resguardo. El defecto reproduce el caso:
  // sin ajuste A y tomando la calle como negocio, «SAN JUAN DEL RÍO» → Unidad Deportiva.
  ['c', 'sin ajuste A y con el lado equivocado: «SAN JUAN DEL RÍO» → Unidad Deportiva se acepta', [
    ['scripts/cruces.mjs', "const D76_CIUDAD = new Set(['SAN', 'JUAN', 'RIO', 'SJR', 'QUERETARO']);", 'const D76_CIUDAD = new Set([]);'],
    ['scripts/cruces.mjs', "const ref = esLugar(c.calle) && !esLugar(c.cruce_con ?? '') ? c.calle : c.cruce_con ?? c.texto;", "const ref = /JALPAN/.test(c.texto) ? c.calle : esLugar(c.calle) && !esLugar(c.cruce_con ?? '') ? c.calle : c.cruce_con ?? c.texto;"],
  ], true],
  ['c2', 'control: el mismo lado equivocado CON ajuste A (no debe aceptar la Unidad Deportiva)', [
    ['scripts/cruces.mjs', "const ref = esLugar(c.calle) && !esLugar(c.cruce_con ?? '') ? c.calle : c.cruce_con ?? c.texto;", "const ref = /JALPAN/.test(c.texto) ? c.calle : esLugar(c.calle) && !esLugar(c.cruce_con ?? '') ? c.calle : c.cruce_con ?? c.texto;"],
  ], true],
  ['d', 'una REFERENCIA de negocio se queda sin estado', [['scripts/cruces.mjs', '    clasificacion: lista,', '    clasificacion: lista.slice(0, -1),']], true],
  ['e', 'con dos lugares que cumplen se toma uno (lugar gemelo de Office Depot a 20 m)', [
    ['scripts/cruces.mjs', "if (buenos.length === 1) return sale('UBICADO POR LUGAR'", "if (buenos.length >= 1) return sale('UBICADO POR LUGAR'"],
    ['datos/cache/overpass/lugares-amplio.json', '"lugares":[', '"lugares":[{"osm":"node/1","nombre":"Office Depot Express","tipo":"Tienda","etiqueta":"shop=stationery","centro":[20.39,-99.98]},'],
  ], true, null, () => {
    // el gemelo va junto al Office Depot real
    const j = JSON.parse(readFileSync(f('datos/cache/overpass/lugares-amplio.json'), 'utf8'));
    const od = j.lugares.find((l) => l.nombre === 'Office Depot');
    j.lugares[0].centro = [Number((od.centro[0] + 0.0002).toFixed(5)), od.centro[1]];
    writeFileSync(f('datos/cache/overpass/lugares-amplio.json'), JSON.stringify(j));
  }],
  ['f', 'los puntos nuevos entran a la página de campo (sin el filtro)', [['scripts/datos-app.mjs', "x.metodo !== 'D-76' && ", '']], false],
];
const salida = [];
try {
  for (const [letra, que, cambios, regenera, despues, antes] of DEFECTOS) {
    const copias = cambios.map(([r, de, a]) => [r, cambiar(r, de, a)]);
    try {
      if (antes) antes();
      const st = regenera || despues ? generar() : 0;
      if (st !== 0) { salida.push(`(${letra}) ${que}: la generación salió con código ${st}: NO CUENTA`); continue; }
      if (despues) despues();
      const p = pruebas();
      const control = letra === 'c2'; // control: aquí se espera que todo pase
      const fin = control ? (p.fail ? ` ← CONTROL MAL: ${p.caidas.join(' | ')}` : ' ← control OK: el ajuste A lo detiene') : p.fail ? ` → ${p.caidas.join(' | ')}` : ' ← EL DEFECTO PASA';
      salida.push(`(${letra}) ${que}: generación OK · pruebas: ${p.pass} pasan, ${p.fail} fallan${fin}`);
    } finally {
      // en orden inverso: si un defecto cambia dos veces el mismo archivo, queda el original
      for (const [r, t] of copias.reverse()) writeFileSync(f(r), t);
    }
  }
} finally {
  const st = generar();
  const p = pruebas();
  const cache = VIGILADOS.every((r) => sha(r) === huellas[r]);
  salida.push(`Restaurado: generación ${st === 0 ? 'OK' : `código ${st}`} · pruebas ${p.pass} pasan, ${p.fail} fallan · datos/cache/, cruces.mjs y datos-app.mjs ${cache ? 'iguales que antes (sha256)' : 'CAMBIARON: RESTAURACIÓN MAL'}`);
  salida.push(`git status: ${execFileSync('git', ['status', '--short', 'datos/cache'], { cwd: raiz, encoding: 'utf8' }).trim() || 'datos/cache limpio'}`);
}
console.log(salida.join('\n'));
