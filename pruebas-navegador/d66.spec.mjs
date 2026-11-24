// D-66: página de campo (web/public/campo.html → campo.html en la compilación).
// Revisa el flujo de la maqueta aprobada (docs/maquetas/d66-campo/): confirmar las
// paradas de la lista oficial una por una, renombrar, otro sentido, parada nueva,
// deshacer, terminar y resumen; borrar viajes; ruta sin lista; sin scroll de lado.
// El GPS se simula exactamente en la parada 1 oficial de la R11 (distancia 0 m).
import { test, expect } from '@playwright/test';
import { leerDatos } from './ayuda.mjs';

const campo = leerDatos('campo.json');
const r11 = campo.rutas.find((r) => r.numero === '011');
const p1 = r11.paradas[0];

test.use({ permissions: ['geolocation'], geolocation: { latitude: p1.lat, longitude: p1.lon }, storageState: { cookies: [], origins: [] } });

async function abrir(page) {
  await page.goto('campo.html');
  await expect(page.locator('#ruta')).toBeVisible();
  await expect(page.locator('#gps')).toContainText('Ubicación lista');
}
async function iniciar(page, routeId, sentido = 0) {
  await page.locator('#ruta').selectOption(routeId);
  await page.locator('[data-a="sentido"]').nth(sentido).click();
  await page.locator('[data-a="iniciar"]').click();
}
const sinScrollDeLado = (page) => page.evaluate(() => document.documentElement.scrollWidth - innerWidth);

test('c1: R11 tiene lista oficial y el flujo de la maqueta guarda cada respuesta', async ({ page }) => {
  await abrir(page);
  await iniciar(page, 'U-011');
  await expect(page.locator('.preg .nom')).toHaveText(`¿Es «${p1.nombre}» la parada 1?`);
  await expect(page.locator('.preg small')).toHaveText(`Parada 1 de ${r11.paradas.length} · lista oficial`);
  await expect(page.locator('#dist')).toHaveText('Estás a 0 m del punto oficial');
  await expect(page.locator('.sig')).toContainText(`2 · ${r11.paradas[1].nombre}`);
  await page.locator('[data-a="si"]').click();
  // Parada 2: renombrar a una parada posible.
  await page.locator('[data-a="renombrar"]').click();
  await expect(page.locator('.nom.tachado')).toHaveText(r11.paradas[1].nombre);
  await page.locator('#nombre').fill('Av. Central – Calle 3 Lagunas');
  await page.locator('[data-a="guardar-posible"]').click();
  // Parada 3: otro sentido. Luego una nueva y se deshace.
  await expect(page.locator('.preg small')).toHaveText(`Parada 3 de ${r11.paradas.length} · lista oficial`);
  await page.locator('[data-a="otro"]').click();
  await page.locator('[data-a="nueva"]').click();
  await page.locator('#nombre').fill('Parada de prueba');
  await page.locator('[data-a="guardar-nueva"]').click();
  await page.locator('[data-a="deshacer"]').click();
  await expect(page.locator('.preg small')).toHaveText(`Parada 4 de ${r11.paradas.length} · lista oficial`);
  expect(await sinScrollDeLado(page)).toBe(0);
  await page.locator('[data-a="terminar"]').click();
  const cont = page.locator('.cont b');
  await expect(cont).toHaveText(['1', '1', '1', '0']);
  await expect(page.locator('.hecho li').nth(0)).toContainText('a 0 m del punto oficial');
  await expect(page.locator('.hecho li').nth(1)).toContainText('Av. Central – Calle 3 Lagunas');
  await expect(page.locator('.hecho li')).toHaveCount(3);
  // Lo guardado sobrevive a recargar la página.
  await page.reload();
  await expect(page.locator('.cont b')).toHaveText(['1', '1', '1', '0']);
  expect(await sinScrollDeLado(page)).toBe(0);
});

test('c2: una ruta sin lista oficial no inventa paradas y deja marcar nuevas', async ({ page }) => {
  const sin = campo.rutas.find((r) => !r.paradas.length);
  await abrir(page);
  await page.locator('#ruta').selectOption(sin.route_id);
  await expect(page.locator('.nota').first()).toContainText('no tiene lista oficial');
  await iniciar(page, sin.route_id);
  await expect(page.locator('[data-a="si"]')).toHaveCount(0);
  await page.locator('[data-a="nueva"]').click();
  await page.locator('#nombre').fill('Esquina vista en campo');
  await page.locator('[data-a="guardar-nueva"]').click();
  await page.locator('[data-a="terminar"]').click();
  await expect(page.locator('.cont b')).toHaveText(['0', '0', '0', '1']);
});

test('c3: un viaje se borra desde la lista, con confirmación, y no vuelve al recargar', async ({ page }) => {
  await abrir(page);
  await iniciar(page, 'U-011');
  await page.locator('[data-a="terminar"]').click();
  await page.locator('[data-a="volver"]').click();
  await expect(page.locator('.viajes li')).toHaveCount(1);
  await page.locator('.viajes [data-a="borrar"]').click();
  await page.locator('[data-a="borrar-si"]').click();
  await expect(page.locator('.viajes li')).toHaveCount(0);
  await page.reload();
  await expect(page.locator('#ruta')).toBeVisible();
  await expect(page.locator('.viajes li')).toHaveCount(0);
});

for (const [w, h] of [[320, 640], [1280, 800]]) {
  test(`c4: sin scroll de lado a ${w} px, en el inicio y con la pregunta`, async ({ page }) => {
    await page.setViewportSize({ width: w, height: h });
    await abrir(page);
    await page.locator('#ruta').selectOption('U-011');
    expect(await sinScrollDeLado(page)).toBe(0);
    await iniciar(page, 'U-011');
    await expect(page.locator('.preg .nom')).toBeVisible();
    expect(await sinScrollDeLado(page)).toBe(0);
  });
}
