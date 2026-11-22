// R-03 (D-34, D-41): los extremos finales respetan la fuente de cada punto y
// dejan como FALTANTE lo que nadie ubicó (nunca un dato supuesto).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const leer = (r) => JSON.parse(readFileSync(new URL(`../../${r}`, import.meta.url), 'utf8'));
const fin = leer('datos/investigacion/extremos-finales.json');
const ext = leer('datos/investigacion/extremos.json');
const { decisiones } = leer('datos/investigacion/extremos-decisiones.json');

test('extremos finales: un renglón por cada lugar de R-02, en el mismo orden', () => {
  assert.deepEqual(fin.lugares.map((l) => l.lugar), ext.lugares.map((l) => l.lugar));
  assert.equal(fin.resumen.lugares, fin.lugares.length);
  assert.equal(fin.resumen.con_coordenada + fin.resumen.faltantes, fin.lugares.length);
});

test('extremos finales: cada punto trae fuente y estado; los de Miguel, POR VERIFICAR EN CAMPO', () => {
  for (const l of fin.lugares) {
    assert.ok(l.rutas.length > 0, `${l.lugar}: sin rutas`);
    if (l.lat === null) {
      assert.equal(l.lon, null);
      assert.match(l.estado, /^FALTANTE \(D-41\)/, l.lugar);
      continue;
    }
    assert.ok(l.fuente, `${l.lugar}: sin fuente`);
    if (l.estado.startsWith('UBICADO POR MIGUEL')) assert.match(l.estado, /POR VERIFICAR EN CAMPO/);
  }
});

test('extremos finales: el punto de Miguel es exactamente el que guardó (sin redondeos ni ajustes)', () => {
  const alias = { 'Visthá (CERESO)': 'Visthá' };
  for (const [nombre, d] of Object.entries(decisiones)) {
    const l = fin.lugares.find((x) => x.lugar === (alias[nombre] ?? nombre));
    if (!l || !d.coordenada) continue;
    assert.deepEqual([l.lat, l.lon], d.coordenada, nombre);
  }
});
