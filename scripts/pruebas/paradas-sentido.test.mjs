// D-71 (Miguel, 25 nov 2026, 3:51 pm: «Sí, solo el texto»): paradas oficiales por sentido,
// de una sola lectura de «Ver ruta» en qrobus.gob.mx. Estas pruebas revisan las reglas, no los
// conteos del día (lección 11): solo texto, 42 × 2 ruta-sentidos de la referencia, cada sentido
// con su propia respuesta (regla 10) y las listas de Querétaro fuera (D-33).
// Como un control de recibo: la pieza entra solo si trae su etiqueta y nada que no se pidió.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { leerCSV } from '../lib/csv.mjs';
import { REFERENCIA } from '../lib/referencia.mjs';
import { marcasQueretaro } from '../lib/queretaro.mjs';
import { leerSentido, partirNombre } from '../lib/paradas-sentido.mjs';

const raiz = new URL('../../', import.meta.url).pathname;
const leer = (r) => readFileSync(`${raiz}${r}`, 'utf8');
const ARCHIVO = 'datos/cache/qrobus/paradas-sentido.json';
const datos = JSON.parse(leer(ARCHIVO));
const meta = JSON.parse(leer('datos/cache/qrobus/paradas-sentido.meta.json'));
const SENTIDOS = ['IDA', 'REGRESO'];
const LECTURA = `${raiz}referencias/fuentes-2026-11-25/qrobus-paradas`;

test('D-71: 42 × 2 ruta-sentidos, exactamente las de la referencia y en el orden de routes.txt', () => {
  const routes = leerCSV(`${raiz}datos/gtfs-sjr/routes.txt`).map((r) => r.route_short_name);
  assert.deepEqual(datos.rutas.map((r) => r.numero), routes, 'orden de routes.txt');
  assert.deepEqual([...routes].sort(), [...REFERENCIA].sort(), 'mismas rutas que la referencia (D-70)');
  for (const r of datos.rutas) {
    assert.deepEqual(Object.keys(r.sentidos), SENTIDOS, `${r.numero}: IDA y REGRESO`);
    for (const s of SENTIDOS) {
      const x = r.sentidos[s];
      assert.ok(['con datos', 'sin datos'].includes(x.estado), `${r.numero} ${s}: estado`);
      if (x.estado === 'sin datos') assert.ok(x.motivo?.length > 10, `${r.numero} ${s}: «sin datos» sin motivo`);
    }
  }
  const total = datos.rutas.length * SENTIDOS.length;
  assert.equal(total, REFERENCIA.length * 2);
  assert.equal(datos.resumen.ruta_sentidos, total);
  assert.equal(datos.resumen.con_datos + datos.resumen.sin_datos, total);
});

test('D-71: solo texto: ni coordenadas ni trazo en lo extraído', () => {
  const texto = leer(ARCHIVO);
  assert.doesNotMatch(texto, /"(lat|lon|lng|latitud|longitud|poly[a-z_]*|coordenadas?)"\s*:/i, 'campo de coordenadas o trazo');
  // Números con forma de coordenada de la zona (lat 19–21, lon -99 a -101, con decimales).
  assert.doesNotMatch(texto, /(?<![\d.])(19|20|21)\.\d{3,}|-(99|100|101)\.\d{3,}/, 'número con forma de coordenada');
  for (const r of datos.rutas) for (const s of SENTIDOS) {
    for (const p of r.sentidos[s].paradas ?? []) {
      assert.deepEqual(Object.keys(p), ['orden', 'numero', 'nombre'], `${r.numero} ${s}: campos de más en la parada ${p.orden}`);
    }
  }
});

test('D-71: cada sentido con datos trae orden 1..n, número P- y nombre', () => {
  for (const r of datos.rutas) for (const s of SENTIDOS) {
    const x = r.sentidos[s];
    if (x.estado !== 'con datos') continue;
    assert.equal(x.total, x.paradas.length, `${r.numero} ${s}: total`);
    x.paradas.forEach((p, i) => {
      assert.equal(p.orden, i + 1, `${r.numero} ${s}: orden`);
      assert.ok(p.nombre.length > 0, `${r.numero} ${s} #${p.orden}: nombre vacío`);
      if (p.numero !== null) assert.match(p.numero, /^P-\d+$/, `${r.numero} ${s} #${p.orden}`);
    });
    const sinNumero = x.paradas.filter((p) => p.numero === null).length;
    assert.equal(x.sin_numero_oficial ?? 0, sinNumero, `${r.numero} ${s}: paradas sin número no anotadas`);
  }
});

test('D-33 en D-71: ninguna lista con datos trae calles de Querétaro; las descartadas nombran parada y marca', () => {
  for (const r of datos.rutas) for (const s of SENTIDOS) {
    const x = r.sentidos[s];
    if (x.estado === 'con datos') {
      const malas = x.paradas.filter((p) => marcasQueretaro(p.nombre).length);
      assert.deepEqual(malas, [], `${r.numero} ${s}: parada con marca de Querétaro`);
    } else if (/Querétaro/.test(x.motivo)) {
      assert.match(x.motivo, /«[^»]+» \([A-Z0-9 ]+\)/, `${r.numero} ${s}: el motivo no nombra parada y marca`);
    }
  }
});

test('Regla 10: la vuelta nunca es copia de la ida, salvo que sus dos respuestas sean idénticas', () => {
  for (const r of datos.rutas) {
    const { IDA, REGRESO } = r.sentidos;
    if (!IDA.paradas || !REGRESO.paradas) continue;
    if (JSON.stringify(IDA.paradas) === JSON.stringify(REGRESO.paradas)) {
      assert.equal(IDA.sha256_respuesta, REGRESO.sha256_respuesta, `${r.numero}: vuelta igual a la ida con respuestas distintas`);
      assert.ok(IDA.igual_al_otro_sentido && REGRESO.igual_al_otro_sentido, `${r.numero}: igualdad no anotada`);
    }
  }
});

test('D-71: cada sentido leído tiene su huella en la meta, y la meta firma lo extraído', () => {
  for (const r of datos.rutas) for (const s of SENTIDOS) {
    const x = r.sentidos[s];
    if (!x.sha256_respuesta) continue;
    const h = meta.respuestas.find((m) => m.ruta === r.numero && m.sentido === s);
    assert.equal(h?.sha256, x.sha256_respuesta, `${r.numero} ${s}: huella`);
  }
  assert.equal(meta.respuestas.length, REFERENCIA.length * 2, 'una huella por consulta');
  const huella = createHash('sha256').update(readFileSync(`${raiz}${ARCHIVO}`)).digest('hex');
  assert.equal(meta.sha256_extraido, huella, 'lo extraído cambió después de la lectura');
});

test('Lector: toma solo el texto, parte el número P- y descarta Querétaro', () => {
  assert.deepEqual(partirNombre('P-3537: LABRADORITA-GALEANA'), { numero: 'P-3537', nombre: 'LABRADORITA-GALEANA' });
  assert.deepEqual(partirNombre('SIN NUMERO'), { numero: null, nombre: 'SIN NUMERO' });
  const r = leerSentido(JSON.stringify({ status: 'ok', paradas: [{ sNombre: 'P-1: A-B', rutasParada: '001|#fff', latitud: '20.39' }] }));
  assert.deepEqual(r.paradas, [{ orden: 1, numero: 'P-1', nombre: 'A-B' }]);
  assert.equal(leerSentido(JSON.stringify({ status: 'ok', paradas: [{ sNombre: 'P-2: BERNARDO QUINTANA-X' }] })).estado, 'sin datos');
  assert.equal(leerSentido(JSON.stringify({ status: 'ok', paradas: [] })).estado, 'sin datos');
  assert.equal(leerSentido('<html>').estado, 'sin datos');
});

// Solo en la Mac de Miguel: la copia completa vive fuera de git (lección 5: en GitHub no existe).
test('D-71 (local): lo extraído sale de su propia respuesta, sentido por sentido', { skip: !existsSync(LECTURA) && 'sin la copia completa (fuera de git)' }, () => {
  for (const r of datos.rutas) for (const [s, suf] of [['IDA', 'ida'], ['REGRESO', 'regreso']]) {
    const crudo = readFileSync(`${LECTURA}/respuestas/${r.numero}-${suf}.json`);
    assert.equal(createHash('sha256').update(crudo).digest('hex'), r.sentidos[s].sha256_respuesta, `${r.numero} ${s}: huella`);
    const { sha256_respuesta, igual_al_otro_sentido, ...x } = r.sentidos[s];
    assert.deepEqual(x, leerSentido(crudo.toString('utf8')), `${r.numero} ${s}: no corresponde a su respuesta`);
  }
});

test('D-71: el cruce con cruces.json cuadra con las paradas y no toca la lista general', () => {
  const cruce = JSON.parse(leer('datos/investigacion/paradas-cruce.json'));
  const cruces = JSON.parse(leer('datos/investigacion/cruces.json'));
  assert.deepEqual(cruce.rutas.map((r) => r.numero), datos.rutas.map((r) => r.numero));
  for (const r of cruce.rutas) {
    const general = cruces.rutas.find((c) => c.route_id === r.route_id);
    assert.equal(Boolean(r.sentidos), Boolean(general?.cruces), `${r.numero}: lista usable`);
    for (const s of SENTIDOS) {
      const c = r.sentidos?.[s];
      if (!c?.paradas) continue;
      assert.equal(c.coinciden_con_lista_general + c.sin_pareja.length, c.paradas, `${r.numero} ${s}: conteo`);
      assert.equal(c.paradas, datos.rutas.find((d) => d.numero === r.numero).sentidos[s].total, `${r.numero} ${s}: total`);
    }
  }
});
