// D-50: selector visual de rutas y zonas probables. Cada prueba revisa la regla,
// no el conteo del día (lección 11): si un arreglo bueno cambia un dato, la
// prueba sigue verde mientras la regla se cumpla.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { armarDatosApp } from '../datos-app.mjs';
import {
  AVISO_COLORES,
  COLOR_INTERMUNICIPAL,
  MAX_RECIENTES,
  ROTACION,
  agregarReciente,
  colorTarjeta,
  contraste,
  insignia,
  leerRecientes,
} from '../../web/src/tarjetas.ts';
import { LEYENDA_ZONA, zonasRuta } from '../../web/src/zonas.ts';

const rutas = armarDatosApp().rutas;
const lugares = JSON.parse(readFileSync(new URL('../../datos/investigacion/extremos-finales.json', import.meta.url), 'utf8')).lugares;
const zonasArchivo = JSON.parse(readFileSync(new URL('../../datos/investigacion/zonas-probables.json', import.meta.url), 'utf8'));
const html = readFileSync(new URL('../../web/index.html', import.meta.url), 'utf8');
const main = readFileSync(new URL('../../web/src/main.ts', import.meta.url), 'utf8');

test('insignia (D-50, resp. 2): R para urbanas y T para intermunicipales, sin ceros a la izquierda', () => {
  for (const r of rutas) {
    const i = insignia(r);
    assert.match(i, r.tipo === 'urbana' ? /^R[1-9]\d*[A-Z]?$/ : /^T[1-9]\d*[A-Z]?$/, `${r.numero} → ${i}`);
    // La insignia conserva el número oficial (solo quita ceros).
    assert.equal(i.slice(1), r.numero.replace(/^0+/, ''), r.numero);
  }
  assert.equal(insignia({ numero: '009B', tipo: 'urbana' }), 'R9B');
  assert.equal(insignia({ numero: '23', tipo: 'urbana' }), 'R23');
  assert.equal(insignia({ numero: '023', tipo: 'intermunicipal' }), 'T23');
});

test('insignia: ninguna se repite entre todas las rutas vigentes (23 ≠ 023)', () => {
  const todas = rutas.map(insignia);
  assert.equal(new Set(todas).size, todas.length, 'dos rutas comparten insignia');
});

test('colores (D-53, 4): rotación de 20 colores distintos entre urbanas; intermunicipales aparte', () => {
  // La regla es el número: Miguel pidió al menos 20 variaciones (D-53, 4).
  assert.ok(ROTACION.length >= 20);
  assert.equal(new Set(ROTACION.map((c) => c.fondo)).size, ROTACION.length, 'colores repetidos en la rotación');
  const urbanas = rutas.map((r, i) => [r, colorTarjeta(rutas, i)]).filter(([r]) => r.tipo === 'urbana');
  urbanas.forEach(([, c], k) => assert.deepEqual(c, ROTACION[k % ROTACION.length], `urbana ${k + 1}`));
  // Dos tarjetas urbanas seguidas nunca tienen el mismo color.
  for (let k = 1; k < urbanas.length; k++) assert.notEqual(urbanas[k][1].fondo, urbanas[k - 1][1].fondo);
  rutas.forEach((r, i) => {
    if (r.tipo === 'intermunicipal') assert.deepEqual(colorTarjeta(rutas, i), COLOR_INTERMUNICIPAL);
  });
  assert.ok(!ROTACION.some((c) => c.fondo === COLOR_INTERMUNICIPAL.fondo), 'el color intermunicipal no entra en la rotación');
});

test('colores: contraste AA (≥ 4.5) del texto y de la insignia sobre el camioncito blanco', () => {
  for (const c of [...ROTACION, COLOR_INTERMUNICIPAL]) {
    assert.ok(contraste(c.fondo, c.texto) >= 4.5, `texto ${c.texto} sobre ${c.fondo}: ${contraste(c.fondo, c.texto).toFixed(2)}`);
    assert.ok(contraste('#ffffff', c.insignia) >= 4.5, `insignia ${c.insignia} sobre blanco: ${contraste('#ffffff', c.insignia).toFixed(2)}`);
  }
  // La fórmula misma: blanco contra negro da 21.
  assert.equal(Math.round(contraste('#ffffff', '#000000')), 21);
});

test('colores: el aviso de que no significan nada está en la app', () => {
  assert.match(AVISO_COLORES, /no indican nada de la ruta/);
  assert.match(html, /id="aviso-colores"/);
  assert.match(main, /AVISO_COLORES/);
});

test('regla 9 (D-53, 6): la ruta se elige solo en tarjetas; sin desplegable', () => {
  assert.doesNotMatch(html + main, /<select|createElement\('select'\)/);
  assert.match(html, /id="tarjetas"/);
  // Los únicos campos de texto son «¿A dónde quieres ir?» (D-53, 7) y «¿Desde dónde
  // sales?» (D-56 fase 2, maqueta aprobada el 22 nov 2026); los dos buscan en el
  // catálogo guardado de lugares. Ninguno elige ruta; no hay otro texto libre.
  assert.equal((html.match(/<input[^>]+type="(text|search)"/g) ?? []).length, 2);
  assert.match(html, /<input type="search" id="destino"/);
  assert.match(html, /<input type="search" id="salida"/);
  assert.doesNotMatch(html, /<datalist/);
});

test('«Ruta 001» nunca en pantalla (D-53, 6:23 pm): ni tarjeta, ni encabezado, ni lector de pantalla', () => {
  assert.doesNotMatch(main, /tarjeta-numero|`Ruta \$\{/);
  assert.doesNotMatch(html, /Ruta \d{3}/);
});

test('recientes (D-50, resp. 4): hasta 3, la más nueva primero, sin repetir', () => {
  let l = [];
  for (const id of ['U-001', 'U-002', 'U-001', 'U-004', 'U-005']) l = agregarReciente(l, id);
  assert.deepEqual(l, ['U-005', 'U-004', 'U-001']);
  assert.equal(MAX_RECIENTES, 3);
});

test('recientes: lo guardado se limpia (rutas que no existen, basura, repetidas)', () => {
  const validos = new Set(rutas.map((r) => r.route_id));
  assert.deepEqual(leerRecientes(null, validos), []);
  assert.deepEqual(leerRecientes('no es json', validos), []);
  assert.deepEqual(leerRecientes('{"a":1}', validos), []);
  assert.deepEqual(leerRecientes('["U-999","U-001","U-001",7,"U-002","U-004","U-005"]', validos), ['U-001', 'U-002', 'U-004']);
});

test('recientes: solo localStorage, sin cookies', () => {
  assert.match(main, /localStorage/);
  assert.doesNotMatch(main, /document\.cookie/);
});

// --- Zonas probables (D-50, resp. 5; D-46) ---------------------------------------

const mismoPunto = (z, l) => l.lat === z.lat && l.lon === z.lon;

test('zonas: cada ruta trae inicio y fin; ningún punto es inventado', () => {
  for (const r of rutas) {
    for (const z of [r.extremos.origen, r.extremos.destino]) {
      if (z.faltante) {
        assert.equal(z.lat, undefined, `${r.numero} ${z.lugar}: un FALTANTE no lleva punto`);
        assert.match(z.estado, /^FALTANTE/);
        continue;
      }
      // Todo punto es el de un lugar de extremos-finales.json, sin mover.
      const fuente = z.cerca_de ? lugares.find((l) => l.lugar === z.cerca_de) : lugares.find((l) => l.lugar === z.lugar);
      assert.ok(fuente && mismoPunto(z, fuente), `${r.numero} ${z.lugar}: punto distinto al de extremos-finales.json`);
      assert.ok(z.radio_m > 0 && z.fuente, `${r.numero} ${z.lugar}: sin radio o sin fuente`);
    }
  }
});

test('zonas: un lugar con punto propio usa el suyo; «cerca de» solo para los FALTANTES de la lista', () => {
  for (const r of rutas) {
    for (const z of [r.extremos.origen, r.extremos.destino]) {
      const propio = lugares.find((l) => l.lugar === z.lugar);
      if (propio.lat != null) assert.equal(z.cerca_de, undefined, `${z.lugar} tiene punto propio`);
      if (z.cerca_de) {
        assert.ok(zonasArchivo.cercania.some((c) => c.lugar === z.lugar && c.cerca_de === z.cerca_de), z.lugar);
        assert.equal(z.radio_m, zonasArchivo.radios_m.CERCANIA);
      }
    }
  }
});

test('zonas: la leyenda dice en verificación y estimado (minúscula, D-53); la vuelta intercambia inicio y fin', () => {
  assert.match(LEYENDA_ZONA, /validación/);
  assert.match(LEYENDA_ZONA, /\(estimado\)/);
  for (const r of rutas) {
    const ida = zonasRuta(r, 'ida');
    const vuelta = zonasRuta(r, 'vuelta');
    for (const z of [...ida.zonas, ...vuelta.zonas]) assert.equal(z.lineas[0], LEYENDA_ZONA);
    const nombres = (x) => [...x.zonas.map((z) => z.titulo), ...x.faltantes];
    const lugarDe = (t) => t.replace(/^(Inicio|Fin): /, '').replace(/ · FALTANTE$/, '');
    const inicioIda = nombres(ida).find((t) => t.startsWith('Inicio'));
    const finVuelta = nombres(vuelta).find((t) => t.startsWith('Fin'));
    assert.equal(lugarDe(inicioIda), lugarDe(finVuelta), r.numero);
  }
});

test('zonas: un FALTANTE sin zona por cercanía no se dibuja y se nombra como FALTANTE', () => {
  for (const r of rutas) {
    const { zonas, faltantes } = zonasRuta(r, 'ida');
    const faltan = [r.extremos.origen, r.extremos.destino].filter((z) => z.faltante).length;
    assert.equal(zonas.length + faltantes.length, 2, r.numero);
    assert.equal(faltantes.length, faltan, r.numero);
    for (const f of faltantes) assert.match(f, /FALTANTE$/);
  }
});
