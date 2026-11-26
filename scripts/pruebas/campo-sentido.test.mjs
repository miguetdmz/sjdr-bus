// D-74: la página de campo usa la lista oficial POR SENTIDO (paradas-sentido.json, D-71) tal
// cual, y el punto de una parada solo sale de la lista general de la misma ruta con texto
// idéntico. Regla 10: un sentido nunca trae una parada que su fuente no trae.
// No lee archivos generados (lección 5): arma el dato en memoria con armarCampoApp().
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { armarCampoApp, normaTexto } from '../datos-app.mjs';
import { leerCSV } from '../lib/csv.mjs';

const raiz = new URL('../../', import.meta.url).pathname;
const leer = (p) => JSON.parse(readFileSync(raiz + p, 'utf8'));
const campo = armarCampoApp();
const fuente = new Map(leer('datos/cache/qrobus/paradas-sentido.json').rutas.map((r) => [r.route_id, r]));
const cruces = new Map(leer('datos/investigacion/cruces.json').rutas.map((r) => [r.route_id, r]));
const rutasTxt = leerCSV(raiz + 'datos/gtfs-sjr/routes.txt').map((r) => r.route_id);

test('las rutas de campo son las de routes.txt, en su orden, cada una con IDA y REGRESO', () => {
  assert.deepEqual(campo.rutas.map((r) => r.route_id), rutasTxt);
  for (const r of campo.rutas) assert.deepEqual(Object.keys(r.sentidos), ['IDA', 'REGRESO'], r.numero);
  for (const r of campo.rutas) assert.deepEqual([r.sentidos.IDA.letra, r.sentidos.REGRESO.letra], ['I', 'V'], r.numero);
});

test('cada sentido es su lista oficial: mismo número de paradas, orden, número P- y texto (regla 10)', () => {
  for (const r of campo.rutas) {
    for (const s of ['IDA', 'REGRESO']) {
      const of = fuente.get(r.route_id).sentidos[s].paradas ?? [], mia = r.sentidos[s].paradas;
      assert.equal(mia.length, of.length, `${r.numero} ${s}: número de paradas`);
      mia.forEach((p, k) => {
        assert.equal(p.orden, of[k].orden, `${r.numero} ${s} ${k}: orden`);
        assert.equal(p.numero, of[k].numero ?? null, `${r.numero} ${s} ${p.orden}: número P-`);
        assert.equal(p.texto, of[k].nombre, `${r.numero} ${s} ${p.orden}: texto oficial`);
        assert.equal(normaTexto(p.nombre), normaTexto(of[k].nombre), `${r.numero} ${s} ${p.orden}: nombre`);
      });
      assert.equal(new Set(mia.map((p) => p.orden)).size, mia.length, `${r.numero} ${s}: orden repetido (el identificador no sería único)`);
    }
  }
});

test('todo punto sale de la lista general de la misma ruta, con texto idéntico y sin moverse', () => {
  let con = 0;
  for (const r of campo.rutas) {
    const lista = cruces.get(r.route_id)?.cruces ?? [];
    for (const s of ['IDA', 'REGRESO']) for (const p of r.sentidos[s].paradas) {
      if (p.lat == null) { assert.equal(p.lon, undefined, `${r.numero} ${s} ${p.orden}: lon sin lat`); continue; }
      con++;
      const x = lista.find((c) => c.lat === p.lat && c.lon === p.lon && normaTexto(c.texto) === normaTexto(p.texto));
      assert.ok(x, `${r.numero} ${s} ${p.orden}: punto sin pareja de texto idéntico en su ruta`);
    }
  }
  assert.ok(con > 0, 'ninguna parada con punto');
});
