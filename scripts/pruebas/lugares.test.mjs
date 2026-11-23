// D-56 fase 2: catálogo amplio de lugares de OpenStreetMap (criterios c1 a c3 de
// docs/evidencia/d56f2/criterios.md). Revisa la regla, no el conteo del día
// (lección 11). Lee el archivo del repositorio y arma los datos de la app en
// memoria: no depende de web/public/datos, que git no guarda (lección 5).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import * as datosApp from '../datos-app.mjs';
import * as destino from '../../web/src/destino.ts';

const raiz = new URL('../../', import.meta.url);
const cache = JSON.parse(readFileSync(new URL('datos/cache/overpass/lugares-amplio.json', raiz), 'utf8'));
const consulta = readFileSync(new URL('datos/cache/overpass/lugares-amplio.overpassql', raiz), 'utf8');

// Tipos aprobados por Miguel (docs/maquetas/d56f2/tipos-propuestos.md) + los de R-03.
const TIPOS = new Set([
  'Hospital', 'Clínica', 'Escuela', 'Central de autobuses', 'Mercado', 'Centro penitenciario', 'Terminal',
  'Colonia', 'Barrio', 'Localidad', 'Ciudad', 'Fraccionamiento', 'Zona industrial',
  'Plaza comercial', 'Supermercado', 'Tienda', 'Templo', 'Banco', 'Gobierno', 'Servicio público',
  'Cultura', 'Parque', 'Deportivo', 'Hotel',
]);

test('c1: la consulta trae su huella y la respuesta completa queda fuera de git', () => {
  assert.match(cache.fuente.sha256_respuesta, /^[0-9a-f]{64}$/);
  assert.equal(cache.fuente.peticiones, 1);
  assert.match(cache.fuente.respuesta_completa, /^referencias\//);
  assert.match(cache.fuente.licencia, /ODbL/);
  assert.equal(cache.fuente.consulta, 'datos/cache/overpass/lugares-amplio.overpassql');
  assert.equal(cache.resumen.lugares, cache.lugares.length);
});

test('c1: cada lugar tiene id de OSM, nombre, tipo aprobado y centro en San Juan del Río', () => {
  assert.ok(cache.lugares.length > 0);
  for (const l of cache.lugares) {
    assert.match(l.osm, /^(node|way|relation)\/\d+$/, l.nombre);
    assert.ok(l.nombre.trim(), l.osm);
    assert.ok(TIPOS.has(l.tipo), `${l.nombre}: tipo «${l.tipo}» no aprobado`);
    const [k, v] = l.etiqueta.split('=');
    assert.ok(consulta.includes(k) && consulta.includes(v), `${l.nombre}: ${l.etiqueta} no está en la consulta`);
    // Caja amplia del municipio (no es el límite oficial; solo atrapa coordenadas absurdas).
    assert.ok(l.centro[0] > 20.2 && l.centro[0] < 20.6 && l.centro[1] > -100.3 && l.centro[1] < -99.8, `${l.nombre}: fuera del municipio`);
  }
});

test('c1: sin opcionales rechazados ni errores conocidos de geocodificación (lección 4)', () => {
  assert.doesNotMatch(consulta.replace(/\/\*[\s\S]*?\*\//g, ''), /pharmacy|fuel|convenience/);
  for (const l of cache.lugares) {
    assert.notEqual(l.nombre, 'Universidad Tecnológica Bridge');
    assert.doesNotMatch(l.etiqueta, /pharmacy|fuel|convenience/);
  }
});

test('c2: la app recibe los lugares tal cual (nombre, tipo, id y coordenada)', () => {
  assert.equal(typeof datosApp.armarLugaresApp, 'function', 'falta armarLugaresApp en datos-app.mjs');
  const app = datosApp.armarLugaresApp();
  assert.equal(app.consultado, cache.fuente.consultado);
  assert.equal(app.lugares.length, cache.lugares.length);
  app.lugares.forEach((l, i) => {
    const c = cache.lugares[i];
    assert.deepEqual([l.nombre, l.tipo, l.osm, l.lat, l.lon], [c.nombre, c.tipo, c.osm, c.centro[0], c.centro[1]]);
  });
});

test('c2: el service worker guarda lugares.json', () => {
  const revisar = readFileSync(new URL('scripts/revisar-compilacion.mjs', raiz), 'utf8');
  assert.match(revisar, /\.\/datos\/lugares\.json/);
});

test('c3: catálogo amplio: primero los de ruta, después OSM, sin repetir nombres', () => {
  assert.equal(typeof destino.catalogoAmplio, 'function', 'falta catalogoAmplio en destino.ts');
  const rutas = datosApp.armarDatosApp().rutas;
  const osm = datosApp.armarLugaresApp().lugares;
  const todo = destino.catalogoAmplio(rutas, osm);
  const extremos = destino.catalogo(rutas);
  assert.deepEqual(todo.slice(0, extremos.length).map((l) => l.lugar), extremos.map((l) => l.lugar));
  const nombres = todo.map((l) => destino.normalizar(l.lugar));
  assert.equal(new Set(nombres).size, nombres.length, 'nombres repetidos');
  // Todo nombre de OSM está en el catálogo (el primero de cada nombre).
  for (const l of osm) assert.ok(nombres.includes(destino.normalizar(l.nombre)), `${l.nombre} falta`);
  for (const l of todo.slice(extremos.length)) {
    const o = osm.find((x) => x.osm === l.osm);
    assert.ok(o, `${l.lugar}: no viene de OSM`);
    assert.deepEqual([l.lat, l.lon, l.tipo], [o.lat, o.lon, o.tipo], `${l.lugar}: dato movido`);
  }
});

test('c3: cada fila dice su tipo y su fuente; sin resultados lo dice sin inventar', () => {
  assert.equal(destino.textoFila({ lugar: 'X', lat: 0, lon: 0, tipo: 'Hospital', osm: 'node/1' }), 'Hospital · OpenStreetMap');
  assert.equal(destino.textoFila({ lugar: 'X', lat: 0, lon: 0, radio_m: 300 }), 'Inicio o fin de ruta · zona aproximada');
  assert.equal(destino.textoFila({ lugar: 'X', lat: 0, lon: 0, radio_m: 300, cerca_de: 'Y' }), 'Inicio o fin de ruta · zona aproximada, cerca de Y');
  assert.match(destino.SIN_RESULTADOS, /OpenStreetMap/);
  assert.doesNotMatch(destino.SIN_RESULTADOS, /solo se buscan los lugares donde empiezan/);
});

test('c8: leyenda con la fuente y la fecha de la consulta', () => {
  assert.equal(destino.leyendaLugares('2026-11-22T21:57:15-06:00'), 'Lugares: OpenStreetMap, consulta del 22 nov 2026.');
});

test('el archivo de la consulta y el script de extracción existen', () => {
  assert.ok(existsSync(new URL('scripts/lugares-amplio.mjs', raiz)));
});
