// N-05: archivos base del feed y una ficha de estado por cada una de las 42 rutas.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { leerCSV } from '../lib/csv.mjs';
import { numerosSoloInventario, numerosVerificados } from '../lib/handoff.mjs';

const dato = (ruta) => new URL(`../../datos/${ruta}`, import.meta.url).pathname;
const fichas = JSON.parse(readFileSync(dato('fichas/rutas.json'), 'utf8')).rutas;
const rutas = leerCSV(dato('gtfs-sjr/routes.txt'));
const idDe = (numero, intermunicipal) => rutas.find((r) => r.route_short_name === numero && r.route_id.startsWith(intermunicipal ? 'I-' : 'U-'))?.route_id;

test('fichas: 42, en el orden de routes.txt; 10 verificadas y 32 de solo inventario', () => {
  assert.equal(fichas.length, 42);
  assert.deepEqual(fichas.map((f) => f.route_id), rutas.map((r) => r.route_id));
  assert.equal(fichas.filter((f) => f.grupo === 'verificada').length, 10);
  assert.equal(fichas.filter((f) => f.grupo === 'solo-inventario').length, 32);
});

test('fichas: el grupo de cada ruta coincide con HANDOFF §5.1 y §5.3', () => {
  // En §5.1 solo la 062 es intermunicipal.
  const verificadas = numerosVerificados().map((n) => idDe(n, n === '062'));
  const soloInventario = numerosSoloInventario().map(({ numero, intermunicipal }) => idDe(numero, intermunicipal));
  assert.equal(verificadas.length, 10);
  assert.equal(soloInventario.length, 32);
  for (const f of fichas) {
    const esperado = verificadas.includes(f.route_id) ? 'verificada' : soloInventario.includes(f.route_id) ? 'solo-inventario' : null;
    assert.equal(f.grupo, esperado, `${f.route_id}`);
  }
});

test('fichas: cada una con nivel C, fuente y fecha', () => {
  for (const f of fichas) {
    assert.equal(f.nivel_precision, 'C', f.route_id);
    assert.ok(f.fuente?.length > 20, `${f.route_id}: sin fuente`);
    assert.match(f.fecha, /^\d{4}-\d{2}-\d{2}$/, `${f.route_id}: sin fecha AAAA-MM-DD`);
  }
});

test('archivos base: agency.txt, feed_info.txt y calendar.txt', () => {
  const [agencia, intermunicipal, ...sobrantes] = leerCSV(dato('gtfs-sjr/agency.txt'));
  assert.equal(sobrantes.length, 0, 'solo dos agencias (D-19)');
  assert.equal(intermunicipal.agency_id, 'SJR-INTER');
  assert.match(intermunicipal.agency_name, /por verificar/, 'la agencia intermunicipal dice que está por verificar');
  assert.equal(intermunicipal.agency_timezone, 'America/Mexico_City');
  assert.equal(agencia.agency_id, 'SJR-CONC');
  assert.equal(agencia.agency_name, 'Concesionarios del transporte público de San Juan del Río (por verificar)');
  assert.equal(agencia.agency_url, 'https://qrobus.gob.mx/Rutas');
  assert.equal(agencia.agency_timezone, 'America/Mexico_City');
  assert.equal(agencia.agency_lang, 'es');
  for (const r of rutas) {
    const esperada = r.route_id.startsWith('I-') ? intermunicipal.agency_id : agencia.agency_id;
    assert.equal(r.agency_id, esperada, `${r.route_id}: agencia`);
  }

  const [info] = leerCSV(dato('gtfs-sjr/feed_info.txt'));
  assert.equal(info.feed_publisher_name, 'Colaboradores de SJDR Bus');
  assert.equal(info.feed_publisher_url, 'https://github.com/miguetdmz/sjdr-bus');
  assert.equal(info.feed_lang, 'es');
  assert.match(info.feed_version, /^\d+\.\d+\.\d+$/);
  assert.match(info.feed_start_date, /^\d{8}$/);
  assert.match(info.feed_end_date, /^\d{8}$/);
  // D-17: vigencia de 6 meses, igual en feed_info.txt y calendar.txt.
  assert.equal(info.feed_start_date, '20261117');
  assert.equal(info.feed_end_date, '20270516');

  const calendario = leerCSV(dato('gtfs-sjr/calendar.txt'));
  assert.equal(calendario.length, 1);
  assert.equal(calendario[0].start_date, info.feed_start_date, 'calendar.txt: mismo inicio que feed_info.txt');
  assert.equal(calendario[0].end_date, info.feed_end_date, 'calendar.txt: mismo fin que feed_info.txt');
  assert.match(calendario[0].service_id, /POR_VERIFICAR/, 'el servicio diario dice que está por verificar');
  for (const dia of ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']) assert.equal(calendario[0][dia], '1');
});
