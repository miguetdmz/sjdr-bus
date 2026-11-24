// D-66: página de campo (web/public/campo.html → campo.html en la compilación), versión de
// la maqueta v3 (docs/maquetas/d66-gps/): la pregunta sigue al GPS, «enfrente», «No la vi»,
// «Parada aquí» al instante con nombre después, huecos del GPS, borrar, sin scroll de lado.
// El GPS se simula en puntos oficiales de la R11 (datos/campo.json).
import { test, expect } from '@playwright/test';
import { leerDatos } from './ayuda.mjs';

const campo = leerDatos('campo.json');
const r11 = campo.rutas.find((r) => r.numero === '011');
const P = (o) => r11.paradas.find((p) => p.orden === o);
const p1 = P(1);

test.use({ permissions: ['geolocation'], geolocation: { latitude: p1.lat, longitude: p1.lon }, storageState: { cookies: [], origins: [] } });

async function abrir(page) {
  await page.goto('campo.html');
  await expect(page.locator('#ruta')).toBeVisible();
  await expect(page.locator('#gps')).not.toContainText('Buscando');
}
async function iniciar(page, routeId, sentido = 0) {
  await page.locator('#ruta').selectOption(routeId);
  await page.locator('[data-a="sentido"]').nth(sentido).click();
  await page.locator('[data-a="iniciar"]').click();
}
const guardado = (page) => page.evaluate(() => JSON.parse(localStorage.getItem('sjdrbus.campo.v1')).viajes[0]);
const sinScrollDeLado = (page) => page.evaluate(() => document.documentElement.scrollWidth - innerWidth);

test('c1: subir a medio camino pregunta por la parada oficial más cercana, no por la 1', async ({ page, context }) => {
  await context.setGeolocation({ latitude: P(20).lat, longitude: P(20).lon });
  await abrir(page);
  await iniciar(page, 'U-011');
  await expect(page.locator('.parada .no')).toHaveText('20');
  await expect(page.locator('.parada .nom')).toHaveText(P(20).nombre);
  await expect(page.locator('#dist')).toHaveText('0 m');
  await page.locator('[data-a="si"]').click();
  await expect(page.locator('.parada .no')).toHaveText('21'); // luego sigue el orden de la lista
  await expect(page.locator('.metro .si')).toHaveText('20');
});

test('c2: «enfrente» ofrece la parada del otro lado de la calle (22 y 57, a 19 m) y cambia a ella', async ({ page, context }) => {
  await context.setGeolocation({ latitude: P(22).lat, longitude: P(22).lon });
  await abrir(page);
  await iniciar(page, 'U-011');
  await expect(page.locator('.parada .no')).toHaveText('22');
  await expect(page.locator('.enfrente')).toContainText('57 ·');
  await page.locator('.enfrente').click();
  await expect(page.locator('.parada .no')).toHaveText('57');
  await expect(page.locator('.metro span').nth(1)).toHaveText('58');
});

test('c3: cada botón guarda su respuesta; deshacer, terminar y el resumen sobreviven a recargar', async ({ page }) => {
  await abrir(page);
  await iniciar(page, 'U-011');
  await expect(page.locator('.parada .no')).toHaveText('1');
  await page.locator('[data-a="si"]').click();
  await page.locator('[data-a="renombrar"]').click();
  await page.locator('#nombre').fill('Av. Central – Calle 3 Lagunas');
  await page.locator('[data-a="guardar-nombre"]').click();
  await page.locator('[data-a="otro"]').click();
  await page.locator('[data-a="salto"]').click();
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
  expect(await sinScrollDeLado(page)).toBe(0);
});

test('c4: «Parada aquí» guarda al instante y el nombre se pone en el resumen', async ({ page }) => {
  await abrir(page);
  await iniciar(page, 'U-011');
  await page.locator('[data-a="nueva"]').click();
  await expect(page.locator('#toast')).toContainText('Guardada');
  await expect(page.locator('.parada .no')).toHaveText('1'); // no cambia la pregunta
  let v = await guardado(page);
  expect(v.respuestas[0]).toMatchObject({ estado: 'nueva', nombre: '' });
  expect(v.respuestas[0].lat).toBeCloseTo(p1.lat, 6);
  await page.locator('[data-a="terminar"]').click();
  await page.locator('.linea li.nueva input').fill('Benito Juárez – Soriana');
  await page.reload();
  await expect(page.locator('.linea li.nueva input')).toHaveValue('Benito Juárez – Soriana');
});

test('c5: «Otro nombre» guarda la hora y el punto del toque, no del guardado', async ({ page, context }) => {
  await abrir(page);
  await iniciar(page, 'U-011');
  await page.locator('[data-a="renombrar"]').click();
  await context.setGeolocation({ latitude: P(23).lat, longitude: P(23).lon }); // el camión avanza mientras escribes
  await page.waitForTimeout(500);
  await page.locator('#nombre').fill('Nombre escrito con calma');
  await page.locator('[data-a="guardar-nombre"]').click();
  const r = (await guardado(page)).respuestas[0];
  expect(r.dist_m).toBe(0);
  expect(r.lat).toBeCloseTo(p1.lat, 6);
});

test('c6: el resumen avisa los huecos del GPS (más de 60 s sin punto)', async ({ page }) => {
  await abrir(page);
  const t = (min) => new Date(Date.UTC(2026, 10, 30, 18, min)).toISOString();
  const viaje = { id: 'cprueba', route_id: 'U-011', desde: 'Loma Alta', hacia: 'Central de Autobuses', inicio: t(0), fin: t(30), actual: 2,
    respuestas: [{ estado: 'si', orden: 1, oficial: p1.nombre, nombre: p1.nombre, t: t(1), lat: p1.lat, lon: p1.lon, dist_m: 0 }],
    trazo: [0, 1, 2, 10, 11, 29].map((m) => ({ lat: p1.lat, lon: p1.lon, prec: 5, t: t(m) })) };
  await page.evaluate((v) => localStorage.setItem('sjdrbus.campo.v1', JSON.stringify({ viajes: [v], abierto: v.id })), viaje);
  await page.reload();
  await expect(page.locator('.huecos')).toContainText('GPS: 2 huecos');
  await expect(page.locator('.barrag .h')).toHaveCount(2);
});

test('c7: una ruta sin lista oficial no inventa paradas y deja marcar nuevas', async ({ page }) => {
  const sin = campo.rutas.find((r) => !r.paradas.length);
  await abrir(page);
  await page.locator('#ruta').selectOption(sin.route_id);
  await expect(page.locator('.dato')).toContainText('sin lista oficial');
  await iniciar(page, sin.route_id);
  await expect(page.locator('[data-a="si"]')).toHaveCount(0);
  await page.locator('[data-a="nueva"]').click();
  await page.locator('[data-a="terminar"]').click();
  await expect(page.locator('.cuenta b')).toHaveText(['0', '0', '0', '1']);
});

test('c8: un viaje se borra desde la lista, con confirmación, y no vuelve al recargar', async ({ page }) => {
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
  test(`c9: sin scroll de lado a ${w} px, en el inicio, la pregunta y el resumen`, async ({ page, context }) => {
    await context.setGeolocation({ latitude: P(22).lat, longitude: P(22).lon });
    await page.setViewportSize({ width: w, height: h });
    await abrir(page);
    await page.locator('#ruta').selectOption('U-011');
    expect(await sinScrollDeLado(page)).toBe(0);
    await iniciar(page, 'U-011');
    await expect(page.locator('.enfrente')).toBeVisible();
    expect(await sinScrollDeLado(page)).toBe(0);
    await page.locator('[data-a="nueva"]').click();
    await page.locator('[data-a="terminar"]').click();
    expect(await sinScrollDeLado(page)).toBe(0);
  });
}
