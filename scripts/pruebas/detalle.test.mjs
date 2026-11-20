// M-04: detalle de la ruta elegida, por sentido (HANDOFF §5.1, §5.3, §11.8).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { armarDatosApp } from '../datos-app.mjs';
import { detalleRuta, FUENTE_MOOVIT, ETIQUETA_NIVEL_C, EN_VERIFICACION } from '../../web/src/detalle.ts';

const rutas = armarDatosApp().rutas;
const ruta = (id) => rutas.find((r) => r.route_id === id);
const fila = (d, dato) => d.filas.find((f) => f.dato === dato);
const cifras = (d) => JSON.stringify(d).match(/\d+/g) ?? [];

test('detalle: la 001 vuelta muestra 23 paradas / 16 min y la ida sus propias cifras', () => {
  const vuelta = detalleRuta(ruta('U-001'), 'vuelta');
  assert.equal(fila(vuelta, 'Paradas').valor, '23');
  assert.equal(fila(vuelta, 'Duración del recorrido').valor, '16 min');
  const ida = detalleRuta(ruta('U-001'), 'ida');
  assert.equal(fila(ida, 'Paradas').valor, '29');
  assert.equal(fila(ida, 'Duración del recorrido').valor, '20 min');
});

test('detalle: cada cifra de las 10 verificadas sale del sentido elegido y lleva la fuente Moovit', () => {
  for (const r of rutas.filter((x) => x.grupo === 'verificada')) {
    for (const sentido of ['ida', 'vuelta']) {
      const d = detalleRuta(r, sentido);
      const s = r.sentidos[sentido];
      assert.equal(fila(d, 'Paradas').valor, String(s.paradas), `${r.route_id} ${sentido}`);
      assert.equal(fila(d, 'Duración del recorrido').valor, `${s.duracion_min} min`, `${r.route_id} ${sentido}`);
      assert.equal(fila(d, 'Paradas').fuente, FUENTE_MOOVIT);
      assert.equal(fila(d, 'Duración del recorrido').fuente, FUENTE_MOOVIT);
      const h = fila(d, 'Horario');
      if (s.horario) assert.equal(h.fuente, FUENTE_MOOVIT);
      else assert.equal(h.valor, 'Por verificar en campo', r.route_id);
      assert.ok(d.etiquetas.includes(ETIQUETA_NIVEL_C));
      assert.doesNotMatch(JSON.stringify(d), /frecuencia|estimado|cada \d+/i);
    }
  }
  assert.equal(FUENTE_MOOVIT, 'referencia Moovit, consulta nov 2026 · no es fuente oficial');
});

test('detalle: una ruta de solo inventario no muestra ninguna cifra', () => {
  for (const r of rutas.filter((x) => x.grupo === 'solo-inventario')) {
    for (const sentido of ['ida', 'vuelta']) {
      const d = detalleRuta(r, sentido);
      assert.equal(d.aviso, EN_VERIFICACION);
      assert.deepEqual(d.filas.map((f) => f.dato), ['Tipo']);
      // Las únicas cifras permitidas son las del número y nombre de la ruta.
      const permitidas = new Set((r.numero + ' ' + r.nombre).match(/\d+/g) ?? []);
      for (const c of cifras(d)) assert.ok(permitidas.has(c), `${r.route_id}: cifra ${c}`);
    }
  }
});

test('detalle: cambiar de ruta o de sentido reemplaza todo (sin restos) y no se dibuja trazo', () => {
  const main = readFileSync(new URL('../../web/src/main.ts', import.meta.url), 'utf8');
  assert.match(main, /panel\.replaceChildren\(\.\.\.nodos\)/);
  assert.match(main, /panel\.replaceChildren\(\);/);
  // Nivel C: ninguna línea de recorrido (regla 8).
  assert.doesNotMatch(main, /L\.(polyline|polygon|circleMarker|geoJSON)\(/);
  // Los únicos marcadores son las paradas de OSM de M-05 (de ninguna ruta) y,
  // desde D-50 (respuesta 5), la etiqueta «Inicio» / «Fin» de cada zona probable,
  // que sale de zonasRuta(). Nada más se dibuja con marcador.
  const marcadores = main.match(/L\.marker\(/g) ?? [];
  assert.ok(marcadores.length <= 2);
  const paradas = main.slice(main.indexOf('function dibujarParadas'), main.indexOf('// Control para mostrar'));
  assert.match(paradas, /L\.marker\(\[p\.lat, p\.lon\]/);
  assert.match(paradas, /\.addTo\(capaParadas\)/);
  const zonas = main.slice(main.indexOf('function dibujarZonas'), main.indexOf('// --- Selector de ruta y sentido'));
  assert.match(zonas, /zonasRuta\(estado\.ruta, estado\.sentido\)/);
  assert.match(zonas, /L\.marker\(\[z\.lat, z\.lon\]/);
  // Las zonas van en su propio panel: el de líneas sigue vacío.
  assert.match(zonas, /pane: 'zonas'/);
  // El detalle de la 001 ida no comparte cifras con el de una ruta sin datos.
  const a = detalleRuta(ruta('U-001'), 'ida');
  const b = detalleRuta(ruta('U-007'), 'ida');
  assert.notDeepEqual(a.filas, b.filas);
  assert.equal(b.filas.length, 1);
});
