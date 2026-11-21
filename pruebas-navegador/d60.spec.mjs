// D-60: criterios de aceptación (docs/evidencia/d60/criterios.md), escritos antes
// de construir, contra la maqueta aprobada (docs/maquetas/d60/). Teléfono acostado.
// Revisa la regla, no el dato del día (lección 11).
//
// Con CAPTURAS=1 deja cargar las teselas y guarda las pantallas en docs/evidencia/d60/.
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
  await page.screenshot({ path: `docs/evidencia/d60/${nombre}-${width}x${height}.jpg`, type: 'jpeg', quality: 82 });
}

const choca = (a, b) => a.x < b.x + b.width && b.x < a.x + a.width && a.y < b.y + b.height && b.y < a.y + a.height;

async function conRuta(page) {
  await elegirRuta(page, PRIMERA);
  await page.keyboard.press('Escape');
  await expect(page.locator('#hoja')).toHaveClass(/cerrada/);
  await expect(page.locator('#chip-ruta')).toBeVisible();
}

for (const alto of [280, 212]) {
  test.describe(`teléfono acostado 844 × ${alto}`, () => {
    test.use({ viewport: { width: 844, height: alto } });

    test('e1 y e3: el zoom libre del botón de paradas; el chip en columna, a la izquierda y chico', async ({ page }) => {
      const zoom = () => page.locator('.leaflet-control-zoom').boundingBox();
      expect(choca(await zoom(), await page.locator('#boton-paradas').boundingBox()), 'zoom × paradas').toBe(false);
      await captura(page, '1-inicio');
      await conRuta(page);
      const chip = await page.locator('#chip-ruta').boundingBox();
      expect(await page.locator('#chip-ruta').evaluate((el) => getComputedStyle(el).flexDirection)).toBe('column');
      expect(chip.x + chip.width, 'el chip va en la mitad izquierda').toBeLessThanOrEqual(844 / 2);
      expect((chip.width * chip.height) / (844 * alto), 'parte de la pantalla que tapa el chip').toBeLessThanOrEqual(0.10);
      expect(choca(await zoom(), chip), 'zoom × chip').toBe(false);
      expect(choca(await page.locator('#barra').boundingBox(), chip), 'barra × chip').toBe(false);
      expect(choca(await zoom(), await page.locator('#boton-paradas').boundingBox()), 'zoom × paradas con ruta').toBe(false);
      // «Ver detalle»: se ve chico, pero su área de toque mide al menos 44 px de alto.
      const ver = await page.locator('#ver-detalle').boundingBox();
      const toque = await page.evaluate(({ x, y1, y2 }) => {
        const b = document.querySelector('#ver-detalle');
        return document.elementFromPoint(x, y1) === b && document.elementFromPoint(x, y2) === b;
      }, { x: ver.x + ver.width / 2, y1: ver.y + ver.height / 2 - 22 + 0.5, y2: ver.y + ver.height / 2 + 22 - 0.5 });
      expect(toque, '«Ver detalle» se toca en 44 px de alto').toBe(true);
      await captura(page, '2-ruta');
    });
  });
}

test.describe('teléfono acostado 844 × 280 · menú', () => {
  test.use({ viewport: { width: 844, height: 280 } });

  test('e2: caben al menos 2 filas completas de tarjetas de ruta', async ({ page }) => {
    await page.locator('#boton-menu').click();
    const util = await page.evaluate(() => {
      const c = document.querySelector('.hoja-cuerpo').getBoundingClientRect();
      const pie = document.querySelector('#pie').getBoundingClientRect();
      return Math.min(c.bottom, pie.top) - c.top;
    });
    const fila = (await page.locator('#tarjetas .tarjeta-ruta.partida').first().boundingBox()).height;
    expect(util, `alto útil del menú (${util} px)`).toBeGreaterThanOrEqual(2 * fila + 5);
    await captura(page, '3-menu');
  });
});

test('e4 (390 × 844): parado, el chip sigue en renglón', async ({ page }) => {
  await conRuta(page);
  expect(await page.locator('#chip-ruta').evaluate((el) => getComputedStyle(el).flexDirection)).toBe('row');
});
