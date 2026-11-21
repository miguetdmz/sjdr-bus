// D-59: criterios de aceptación (docs/evidencia/d59/criterios.md), escritos antes
// de construir, contra la maqueta aprobada (docs/maquetas/d59/). Revisa la regla,
// no el dato del día (lección 11).
//
// Con CAPTURAS=1 deja cargar las teselas y guarda las pantallas en docs/evidencia/d59/.
import { test, expect } from '@playwright/test';
import { leerDatos, elegirRuta } from './ayuda.mjs';

const CAPTURAS = process.env.CAPTURAS === '1';
const { rutas } = leerDatos('rutas.json');
const PRIMERA = rutas[0].route_id;
if (CAPTURAS) test.use({ deviceScaleFactor: 2 });

test.beforeEach(async ({ page }) => {
  if (!CAPTURAS) await page.route(/tile\.openstreetmap\.org/, (r) => r.abort());
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
});

async function captura(page, nombre) {
  if (!CAPTURAS) return;
  await page.waitForTimeout(1500);
  await page.evaluate(() => document.activeElement?.blur());
  const { width, height } = page.viewportSize();
  await page.screenshot({ path: `docs/evidencia/d59/${nombre}-${width}x${height}.jpg`, type: 'jpeg', quality: 82 });
}

const estilo = (page, sel, prop) => page.locator(sel).first().evaluate((el, p) => getComputedStyle(el)[p], prop);

test('a1–a3 (390 px): la página no se amplía; el mapa y el menú conservan sus gestos', async ({ page }) => {
  const meta = await page.locator('meta[name="viewport"]').getAttribute('content');
  expect(meta).toContain('maximum-scale=1');
  expect(meta).toContain('user-scalable=no');
  for (const sel of ['html', 'body']) expect(await estilo(page, sel, 'touchAction'), sel).toBe('pan-x pan-y');
  // a2: el gesto de Safari se frena (el evento queda cancelado).
  for (const tipo of ['gesturestart', 'gesturechange']) {
    const cancelado = await page.evaluate((t) => {
      const e = new Event(t, { bubbles: true, cancelable: true });
      document.body.dispatchEvent(e);
      return e.defaultPrevented;
    }, tipo);
    expect(cancelado, `${tipo} frenado`).toBe(true);
  }
  // a3: el mapa maneja su pellizco y el cuerpo del menú se desplaza.
  expect(await estilo(page, '#mapa', 'touchAction')).toBe('none');
  await page.locator('#boton-menu').click();
  expect(await estilo(page, '.hoja-cuerpo', 'overflowY')).toBe('auto');
});

test.describe('teléfono acostado 844 × 390', () => {
  test.use({ viewport: { width: 844, height: 390 } });

  test('b1–b3: se ve como teléfono (barra flotante, menú encima, tarjetas de 70 px, zoom libre del chip)', async ({ page }) => {
    // b1: barra sin fondo, ☰ redondo, sin la marca de computadora.
    expect(await estilo(page, '#barra', 'backgroundColor')).toBe('rgba(0, 0, 0, 0)');
    const menu = await page.locator('#boton-menu').boundingBox();
    expect(Math.abs(menu.width - menu.height)).toBeLessThanOrEqual(1);
    expect(parseFloat(await estilo(page, '#boton-menu', 'borderTopLeftRadius'))).toBeGreaterThanOrEqual(menu.height / 2 - 0.5);
    await expect(page.locator('.marca-barra')).toBeHidden();
    await captura(page, '1-inicio');
    // b2: menú encima del mapa con velo; tarjetas de teléfono (70 px).
    await page.locator('#boton-menu').click();
    await expect(page.locator('#velo')).toBeVisible();
    const t = await page.locator('#tarjetas .tarjeta-ruta.partida').first().boundingBox();
    expect(Math.round(t.height)).toBe(70);
    await captura(page, '2-menu');
    // b3: con ruta y menú cerrado, el zoom queda arriba del chip.
    await elegirRuta(page, PRIMERA);
    await page.keyboard.press('Escape');
    await expect(page.locator('#hoja')).toHaveClass(/cerrada/);
    const chip = await page.locator('#chip-ruta').boundingBox();
    const zoom = await page.locator('.leaflet-control-zoom').boundingBox();
    expect(zoom.y + zoom.height, 'el zoom se encima con el chip').toBeLessThanOrEqual(chip.y);
    await captura(page, '3-ruta');
  });
});

test.describe('computadora 1280 × 800', () => {
  test.use({ viewport: { width: 1280, height: 800 }, isMobile: false, hasTouch: false });

  test('c1: la barra de computadora sigue igual (fondo verde y marca)', async ({ page }) => {
    expect(await estilo(page, '#barra', 'backgroundColor')).toBe('rgb(13, 122, 114)');
    await expect(page.locator('.marca-barra')).toBeVisible();
  });
});
