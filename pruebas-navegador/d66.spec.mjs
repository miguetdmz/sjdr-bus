// D-66 y D-74: página de campo (web/public/campo.html → campo.html en la compilación).
// D-74 (maqueta docs/maquetas/d66-pendientes/, aprobada el 25 nov 2026): lista oficial POR
// SENTIDO con número P- e identificador (R11-I-07), la primera pregunta es la parada 1 del
// sentido (a), «Más cercana» (b), modo prueba con veredicto (c). Sigue de la v3: «enfrente»,
// «No la vi», «Parada aquí» al instante, huecos del GPS, borrar, sin scroll de lado.
// El GPS se simula en puntos de la R11 (datos/campo.json).
import { test, expect } from '@playwright/test';
import { leerDatos } from './ayuda.mjs';

const campo = leerDatos('campo.json');
const r11 = campo.rutas.find((r) => r.numero === '011');
const IDA = r11.sentidos.IDA.paradas, REG = r11.sentidos.REGRESO.paradas;
const P = (L, o) => L.find((p) => p.orden === o);
const g = (p) => ({ latitude: p.lat, longitude: p.lon });
const r5 = campo.rutas.find((r) => r.numero === '005'); // ruta sin puntos en sus dos sentidos (D-74)

test.use({ permissions: ['geolocation'], geolocation: g(P(IDA, 12)), storageState: { cookies: [], origins: [] } });

async function abrir(page) {
  await page.goto('campo.html');
  await expect(page.locator('#ruta')).toBeVisible();
  await expect(page.locator('#gps')).not.toContainText('Buscando');
}
async function iniciar(page, routeId, sentido = 'IDA', prueba = false) {
  await page.locator('#ruta').selectOption(routeId);
  await page.locator(`[data-s="${sentido}"]`).click();
  if (prueba) await page.locator('[data-a="modo"][data-m="1"]').click();
  await page.locator('[data-a="iniciar"]').click();
}
const guardado = (page) => page.evaluate(() => JSON.parse(localStorage.getItem('sjdrbus.campo.v1')).viajes[0]);
const sinScrollDeLado = (page) => page.evaluate(() => document.documentElement.scrollWidth - innerWidth);

test('c0: elegir la ruta y tocar «Iniciar viaje» basta (la IDA viene marcada); sin ruta, avisa', async ({ page }) => {
  await abrir(page);
  await page.locator('[data-a="iniciar"]').click();
  await expect(page.locator('#toast')).toContainText('Primero elige la ruta');
  await page.locator('#ruta').selectOption('U-011');
  await expect(page.locator('[data-s="IDA"]')).toHaveAttribute('aria-pressed', 'true');
  await page.locator('[data-a="iniciar"]').click();
  await expect(page.locator('.parada .no')).toBeVisible();
});

test('c1 (a): los sentidos se nombran con su primera y última parada oficial y cada uno empieza en su parada 1, aunque el GPS esté lejos', async ({ page }) => {
  await abrir(page);
  await page.locator('#ruta').selectOption('U-011');
  await expect(page.locator('[data-s="IDA"]')).toContainText(`${IDA[0].nombre} → ${IDA.at(-1).nombre}`);
  await expect(page.locator('[data-s="REGRESO"]')).toContainText(`${REG[0].nombre} → ${REG.at(-1).nombre}`);
  await page.locator('[data-a="iniciar"]').click();
  await expect(page.locator('.parada .no')).toHaveText('1'); // el GPS está en la 12
  await expect(page.locator('.parada .nom')).toHaveText(IDA[0].nombre);
  await page.waitForTimeout(800); // el GPS sigue llegando: la pregunta no cambia
  await expect(page.locator('.parada .no')).toHaveText('1');
  await page.locator('[data-a="si"]').click();
  await expect(page.locator('.parada .no')).toHaveText('2');
  await page.locator('[data-a="terminar"]').click();
  await page.locator('[data-a="volver"]').click();
  await iniciar(page, 'U-011', 'REGRESO');
  await expect(page.locator('.parada .nom')).toHaveText(REG[0].nombre);
  expect((await guardado(page)).sentido).toBe('IDA');
});

test('c2 (d): cada parada muestra su número P- y su identificador; el resumen lo usa', async ({ page }) => {
  await abrir(page);
  await iniciar(page, 'U-011');
  await expect(page.locator('.parada .ids')).toHaveText(`${IDA[0].numero} · R11-I-01`);
  await page.locator('[data-a="si"]').click();
  await expect(page.locator('.parada .ids')).toHaveText(`${IDA[1].numero} · R11-I-02`);
  await page.locator('[data-a="terminar"]').click();
  await expect(page.locator('.linea li.si .n')).toContainText('R11-I-01');
  const r = (await guardado(page)).respuestas[0];
  expect(r).toMatchObject({ orden: 1, numero: IDA[0].numero, id: 'R11-I-01' });
});

test('c3 (b): «Más cercana» salta a la parada con punto más cercana al GPS y luego sigue el orden', async ({ page }) => {
  await abrir(page);
  await iniciar(page, 'U-011');
  await expect(page.locator('#cerca')).not.toHaveClass(/off/);
  await page.locator('[data-a="cercana"]').click();
  await expect(page.locator('.parada .no')).toHaveText('12');
  await expect(page.locator('#dist')).toHaveText('0 m');
  await page.locator('[data-a="si"]').click();
  await expect(page.locator('.parada .no')).toHaveText('13');
});

test('c4 (b): sin puntos en el sentido, «Más cercana» se ve apagado, dice por qué y no salta', async ({ page }) => {
  await abrir(page);
  await iniciar(page, r5.route_id);
  await expect(page.locator('#cerca')).toHaveClass(/off/);
  await page.locator('[data-a="cercana"]').click();
  await expect(page.locator('#toast')).toContainText('no tiene paradas con punto');
  await expect(page.locator('.parada .no')).toHaveText('1');
  await expect(page.locator('#dist')).toContainText('sin punto oficial');
});

test('c5: «enfrente» ofrece la parada a 60 m o menos del mismo sentido (REGRESO 11 y 12) y cambia a ella', async ({ page, context }) => {
  await context.setGeolocation(g(P(REG, 11)));
  await abrir(page);
  await iniciar(page, 'U-011', 'REGRESO');
  await page.locator('[data-a="cercana"]').click();
  await expect(page.locator('.parada .no')).toHaveText('11');
  await expect(page.locator('.enfrente')).toContainText('12 ·');
  await page.locator('.enfrente').click();
  await expect(page.locator('.parada .no')).toHaveText('12');
});

test('c6: cada botón guarda su respuesta; deshacer, terminar y el resumen sobreviven a recargar', async ({ page, context }) => {
  await context.setGeolocation(g(P(IDA, 2)));
  await abrir(page);
  await iniciar(page, 'U-011');
  await page.locator('[data-a="salto"]').click(); // la 1 no tiene punto
  await expect(page.locator('.parada .no')).toHaveText('2');
  await page.locator('[data-a="si"]').click();
  await page.locator('[data-a="renombrar"]').click();
  await page.locator('#nombre').fill('Av. Central – Calle 3 Lagunas');
  await page.locator('[data-a="guardar-nombre"]').click();
  await page.locator('[data-a="otro"]').click();
  await expect(page.locator('.parada .no')).toHaveText('5');
  await page.locator('[data-a="nueva"]').click();
  await page.locator('[data-a="nueva"]').click();
  await page.locator('[data-a="deshacer"]').click();
  await expect(page.locator('.metro .nueva')).toHaveCount(1);
  expect(await sinScrollDeLado(page)).toBe(0);
  await page.locator('[data-a="terminar"]').click();
  await expect(page.locator('.cuenta b')).toHaveText(['1', '1', '1', '1']);
  await expect(page.locator('.linea li')).toHaveCount(5);
  await expect(page.locator('.linea li.si .m')).toHaveText('0 m');
  await expect(page.locator('.linea li.posible input')).toHaveValue('Av. Central – Calle 3 Lagunas');
  await page.reload();
  await expect(page.locator('.cuenta b')).toHaveText(['1', '1', '1', '1']);
});

test('c7: «Otro nombre» guarda la hora y el punto del toque, no del guardado', async ({ page, context }) => {
  await abrir(page);
  await iniciar(page, 'U-011');
  await page.locator('[data-a="cercana"]').click();
  await page.locator('[data-a="renombrar"]').click();
  await context.setGeolocation(g(P(IDA, 23))); // el camión avanza mientras escribes
  await page.waitForTimeout(500);
  await page.locator('#nombre').fill('Nombre escrito con calma');
  await page.locator('[data-a="guardar-nombre"]').click();
  const r = (await guardado(page)).respuestas[0];
  expect(r.dist_m).toBe(0);
  expect(r.lat).toBeCloseTo(P(IDA, 12).lat, 6);
});

test('c8: el resumen avisa los huecos del GPS (más de 60 s sin punto)', async ({ page }) => {
  await abrir(page);
  const t = (min) => new Date(Date.UTC(2026, 10, 30, 18, min)).toISOString();
  const p = P(IDA, 12);
  const viaje = { id: 'cprueba', route_id: 'U-011', sentido: 'IDA', prueba: false, desde: IDA[0].nombre, hacia: IDA.at(-1).nombre, inicio: t(0), fin: t(30), actual: 13,
    respuestas: [{ estado: 'si', orden: 12, numero: p.numero, id: 'R11-I-12', oficial: p.nombre, nombre: p.nombre, t: t(1), lat: p.lat, lon: p.lon, dist_m: 0 }],
    trazo: [0, 1, 2, 10, 11, 29].map((m) => ({ lat: p.lat, lon: p.lon, prec: 5, t: t(m) })) };
  await page.evaluate((v) => localStorage.setItem('sjdrbus.campo.v1', JSON.stringify({ viajes: [v], abierto: v.id })), viaje);
  await page.reload();
  await expect(page.locator('.huecos')).toContainText('GPS: 2 huecos');
  await expect(page.locator('.barrag .h')).toHaveCount(2);
});

test('c9 (criterio 7): un viaje guardado antes de D-74 (sin sentido) se sigue abriendo y exportando', async ({ page }) => {
  await abrir(page);
  const t = (min) => new Date(Date.UTC(2026, 10, 24, 6, min)).toISOString();
  const viejo = { id: 'cviejo', route_id: 'U-011', desde: 'Loma Alta', hacia: 'Central de Autobuses', inicio: t(0), fin: null, actual: 21,
    respuestas: [{ estado: 'si', orden: 20, oficial: 'Av. Central – Calle X', nombre: 'Av. Central – Calle X', t: t(1), dist_m: 0 }], trazo: [] };
  await page.evaluate((v) => localStorage.setItem('sjdrbus.campo.v1', JSON.stringify({ viajes: [v], abierto: null })), viejo);
  await page.reload();
  await expect(page.locator('.viaje')).toHaveCount(1);
  await page.locator('[data-a="abrir"]').click();
  await expect(page.locator('.linea li.si')).toContainText('20 · Calle X');
  await expect(page.locator('[data-a="exportar"]')).toBeVisible();
  await expect(page.locator('[data-a="reabrir"]')).toHaveCount(0);
  await page.locator('[data-a="volver"]').click();
  await expect(page.locator('#ruta')).toBeVisible();
});

test('c10 (c): el modo prueba no pide toques y da CORRESPONDE con su cuenta y su tramo; nunca dice MEDIDO EN CAMPO', async ({ page, context }) => {
  test.setTimeout(120_000); // el GPS guarda un punto cada 3 s: el recorrido simulado tarda ~50 s
  await context.setGeolocation(g(P(REG, 5)));
  await abrir(page);
  await iniciar(page, 'U-011', 'REGRESO', true);
  await expect(page.locator('[data-a="si"]')).toHaveCount(0);
  await expect(page.locator('.prueba')).toContainText('No toques el teléfono');
  const pasa = REG.filter((p) => p.lat != null && p.orden > 5 && p.orden <= 24);
  for (const p of pasa) { await context.setGeolocation(g(p)); await page.waitForTimeout(3100); }
  await page.locator('[data-a="terminar"]').click();
  await expect(page.locator('.veredicto b')).toHaveText('CORRESPONDE');
  await expect(page.locator('.veredicto span')).toContainText('tramo 5 a 24');
  expect((await page.locator('#vista').innerText()).toUpperCase()).not.toContain('MEDIDO EN CAMPO');
  const v = await guardado(page);
  expect(v.prueba).toBe(true);
  expect(v.respuestas).toHaveLength(0);
});

test('c11 (c): NO CORRESPONDE cuando menos del 80 % del tramo queda cerca del camino', async ({ page, context }) => {
  await abrir(page);
  const con = REG.filter((p) => p.lat != null && p.orden >= 5 && p.orden <= 24), lejos = { lat: 20.40, lon: -99.90 };
  const t = (s) => new Date(Date.UTC(2026, 10, 30, 18, 0, s)).toISOString();
  // el camino pasa por la primera, la última y solo 2 de en medio
  const trazo = [con[0], con[3], con[6], con.at(-1)].map((p, k) => ({ lat: p.lat, lon: p.lon, prec: 5, t: t(k * 30) })).concat([{ ...lejos, prec: 5, t: t(150) }]);
  const viaje = { id: 'cno', route_id: 'U-011', sentido: 'REGRESO', prueba: true, desde: REG[0].nombre, hacia: REG.at(-1).nombre, inicio: t(0), fin: t(160), actual: 1, respuestas: [], trazo };
  await page.evaluate((v) => localStorage.setItem('sjdrbus.campo.v1', JSON.stringify({ viajes: [v], abierto: v.id })), viaje);
  await page.reload();
  await expect(page.locator('.veredicto b')).toHaveText('NO CORRESPONDE');
  await context.setGeolocation(g(P(IDA, 12)));
});

test('c12 (c): SIN CALIFICACIÓN si el sentido no tiene puntos o el tramo tiene menos de 5 paradas', async ({ page }) => {
  await abrir(page);
  await iniciar(page, r5.route_id, 'IDA', true);
  await page.locator('[data-a="terminar"]').click();
  await expect(page.locator('.veredicto b')).toHaveText('SIN CALIFICACIÓN');
  await expect(page.locator('.veredicto span')).toContainText('no tiene paradas con punto');
  const con = REG.filter((p) => p.lat != null && p.orden >= 5), t = (s) => new Date(Date.UTC(2026, 10, 30, 18, 0, s)).toISOString();
  const corto = { id: 'ccorto', route_id: 'U-011', sentido: 'REGRESO', prueba: true, desde: REG[0].nombre, hacia: REG.at(-1).nombre, inicio: t(0), fin: t(60), actual: 1, respuestas: [],
    trazo: con.slice(0, 3).map((p, k) => ({ lat: p.lat, lon: p.lon, prec: 5, t: t(k * 20) })) };
  await page.evaluate((v) => localStorage.setItem('sjdrbus.campo.v1', JSON.stringify({ viajes: [v], abierto: v.id })), corto);
  await page.reload();
  await expect(page.locator('.veredicto b')).toHaveText('SIN CALIFICACIÓN');
  await expect(page.locator('.veredicto span')).toContainText('mínimo 5');
});

test('c13: un viaje se borra desde la lista, con confirmación, y no vuelve al recargar', async ({ page }) => {
  await abrir(page);
  await iniciar(page, 'U-011');
  await page.locator('[data-a="terminar"]').click();
  await page.locator('[data-a="volver"]').click();
  await expect(page.locator('.viaje')).toHaveCount(1);
  await page.locator('.viaje [data-a="borrar"]').click();
  await page.locator('[data-a="borrar-si"]').click();
  await expect(page.locator('.viaje')).toHaveCount(0);
  await page.reload();
  await expect(page.locator('#ruta')).toBeVisible();
  await expect(page.locator('.viaje')).toHaveCount(0);
});

for (const [w, h] of [[320, 640], [1280, 800]]) {
  test(`c14: a ${w} px sin scroll de lado y la barra no tapa la hora del GPS`, async ({ page, context }) => {
    await context.setGeolocation(g(P(REG, 11)));
    await page.setViewportSize({ width: w, height: h });
    await abrir(page);
    await page.locator('#ruta').selectOption('U-011');
    expect(await sinScrollDeLado(page)).toBe(0);
    await iniciar(page, 'U-011', 'REGRESO');
    await page.locator('[data-a="cercana"]').click();
    await expect(page.locator('.enfrente')).toBeVisible();
    expect(await sinScrollDeLado(page)).toBe(0);
    const barra = await page.evaluate(() => { const gps = document.querySelector('#gps'), c = document.querySelector('#cerca').getBoundingClientRect(), b = document.querySelector('.barra').getBoundingClientRect();
      return { horaCortada: gps.scrollWidth > gps.clientWidth, dentro: c.right <= b.right + 0.5 }; });
    expect(barra).toEqual({ horaCortada: false, dentro: true });
    await page.locator('[data-a="nueva"]').click();
    await page.locator('[data-a="terminar"]').click();
    expect(await sinScrollDeLado(page)).toBe(0);
  });
}
