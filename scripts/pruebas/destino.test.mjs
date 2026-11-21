// D-53, 7: «¿A dónde quieres ir?», primera versión. Revisa la regla, no el
// conteo del día (lección 11): catálogo guardado sin FALTANTES ni repetidos,
// distancia en línea recta y rutas a ≤ 1 km, todas y solo esas.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { armarDatosApp, armarParadasApp } from '../datos-app.mjs';
import {
  LEYENDA_CERCA,
  PROXIMAMENTE,
  RADIO_CERCA_M,
  buscar,
  catalogo,
  distancia,
  masCercana,
  normalizar,
  rutasCerca,
  textoDistancia,
} from '../../web/src/destino.ts';

const rutas = armarDatosApp().rutas;
const { paradas } = armarParadasApp();
const lugares = catalogo(rutas);
const main = readFileSync(new URL('../../web/src/main.ts', import.meta.url), 'utf8');
const destino = readFileSync(new URL('../../web/src/destino.ts', import.meta.url), 'utf8');

test('catálogo: solo lugares de inicio y fin con punto, sin repetir y sin FALTANTES', () => {
  const extremos = rutas.flatMap((r) => [r.extremos.origen, r.extremos.destino]);
  assert.equal(new Set(lugares.map((l) => l.lugar)).size, lugares.length, 'lugares repetidos');
  for (const l of lugares) {
    const z = extremos.find((x) => x.lugar === l.lugar);
    assert.ok(z && !z.faltante, `${l.lugar}: no es un extremo con punto`);
    assert.deepEqual([l.lat, l.lon, l.radio_m], [z.lat, z.lon, z.radio_m], `${l.lugar}: punto movido`);
  }
  for (const z of extremos) if (!z.faltante && z.lat != null) assert.ok(lugares.some((l) => l.lugar === z.lugar), `${z.lugar} falta en el catálogo`);
});

test('buscar: sin acentos ni mayúsculas; vacío no devuelve nada', () => {
  assert.equal(normalizar('  Águilas '), 'aguilas');
  assert.deepEqual(buscar(lugares, ''), []);
  for (const l of lugares) assert.ok(buscar(lugares, normalizar(l.lugar).toUpperCase()).includes(l), l.lugar);
  assert.deepEqual(buscar(lugares, 'zzzz-no-existe'), []);
});

test('distancia: en línea recta (haversine), simétrica y cero en el mismo punto', () => {
  const a = { lat: 20.38883, lon: -99.99639 };
  const b = { lat: 20.39883, lon: -99.99639 };
  assert.equal(distancia(a, a), 0);
  assert.equal(Math.round(distancia(a, b)), Math.round(distancia(b, a)));
  // 0.01° de latitud ≈ 1.11 km.
  assert.ok(Math.abs(distancia(a, b) - 1112) < 5);
  assert.equal(textoDistancia(10), 'ahí');
  assert.equal(textoDistancia(604), 'a 600 m');
  assert.equal(textoDistancia(1240), 'a 1.2 km');
});

test('rutas cerca (D-53, c): todas las que empiezan o terminan a ≤ 1 km, y solo esas, de la más cercana a la más lejana', () => {
  assert.equal(RADIO_CERCA_M, 1000);
  for (const l of lugares) {
    const lista = rutasCerca(rutas, l);
    const ids = new Set(lista.map((x) => x.ruta.route_id));
    for (const r of rutas) {
      const ds = [r.extremos.origen, r.extremos.destino].filter((z) => !z.faltante && z.lat != null).map((z) => distancia(l, z));
      const cerca = ds.length > 0 && Math.min(...ds) <= 1000;
      assert.equal(ids.has(r.route_id), cerca, `${l.lugar} · ${r.numero}`);
    }
    for (let i = 1; i < lista.length; i++) assert.ok(lista[i].metros >= lista[i - 1].metros, `${l.lugar}: orden`);
    // Toda ruta que empieza o termina en el lugar sale «ahí».
    assert.ok(lista.length > 0 && lista[0].metros < 50, `${l.lugar}: su propia ruta no sale primero`);
  }
});

test('parada más cercana: la de menor distancia en línea recta de paradas.json', () => {
  const yo = { lat: 20.38883, lon: -99.99639 };
  const m = masCercana(paradas, yo);
  for (const p of paradas) assert.ok(distancia(yo, p) >= m.metros);
  assert.equal(masCercana([], yo), null);
});

test('leyendas: «estimado» en minúscula, línea recta, y lo que llega en fases posteriores', () => {
  assert.match(LEYENDA_CERCA, /^estimado · distancia en línea recta/);
  assert.match(PROXIMAMENTE, /fases posteriores/);
});

test('regla 7: ni Nominatim ni OSRM, y la ubicación no sale del teléfono', () => {
  const sinComentarios = (t) => t.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
  for (const t of [main, destino].map(sinComentarios)) assert.doesNotMatch(t, /nominatim|osrm|fetch\([^)]*(lat|lon|coords)/i);
  // El GPS solo se usa en el navegador: getCurrentPosition y nada se envía.
  assert.match(main, /navigator\.geolocation\.getCurrentPosition/);
  const bloque = main.slice(main.indexOf('getCurrentPosition'), main.indexOf('// --- Arranque'));
  assert.doesNotMatch(bloque, /fetch\(|XMLHttpRequest|sendBeacon|localStorage/);
});
