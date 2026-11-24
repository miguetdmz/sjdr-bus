// D-62: criterios de aceptación (docs/evidencia/d62/criterios.md), escritos antes
// de construir, contra la maqueta aprobada (docs/maquetas/d62/). El círculo «mi
// ubicación» también acostado y en computadora. Revisa la regla (espacios,
// alineación, que nada se encime), no el pixel del día (lección 11).
//
// Con CAPTURAS=1 deja cargar las teselas y guarda las pantallas en docs/evidencia/d62/.
import { test, expect } from '@playwright/test';
import { leerDatos, elegirRuta, sinTapar, vigilarRed } from './ayuda.mjs';

const CAPTURAS = process.env.CAPTURAS === '1';
const { rutas } = leerDatos('rutas.json');
const LARGA = [...rutas].sort((a, b) => b.nombre.length - a.nombre.length)[0].route_id;
// Ubicación de PRUEBA (no es la de nadie): Plaza Independencia, HANDOFF §11.3.
const PLAZA = { latitude: 20.38883, longitude: -99.99639 };
if (CAPTURAS) test.use({ deviceScaleFactor: 2 });
test.use({ geolocation: PLAZA, permissions: ['geolocation'] });

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
  await page.screenshot({ path: `docs/evidencia/d62/${nombre}-${width}x${height}.jpg`, type: 'jpeg', quality: 82 });
}

const choca = (a, b) => a.x < b.x + b.width && b.x < a.x + a.width && a.y < b.y + b.height && b.y < a.y + a.height;
const caja = (page, s) => page.locator(s).boundingBox();
const ZOOM = '.leaflet-control-zoom';
const UBICAME = '#ubicame';

async function circuloBien(page) {
  const c = await caja(page, UBICAME);
  expect(c, 'el círculo «mi ubicación» se ve').not.toBeNull();
  expect(c.width, 'ancho del círculo').toBeGreaterThanOrEqual(44);
  expect(c.width, 'ancho del círculo').toBeLessThanOrEqual(48);
  expect(Math.abs(c.width - c.height), 'el círculo es cuadrado').toBeLessThanOrEqual(0.5);
  const radio = await page.locator(UBICAME).evaluate((el) => parseFloat(getComputedStyle(el).borderTopLeftRadius));
  expect(radio, 'el círculo es redondo').toBeGreaterThanOrEqual(c.width / 2 - 0.5);
  expect(await sinTapar(page, UBICAME), 'nada tapa el círculo').toBe(true);
  return c;
}

async function conRuta(page) {
  await elegirRuta(page, LARGA);
  await page.keyboard.press('Escape');
  await expect(page.locator('#chip-ruta')).toBeVisible();
}

async function tocarYVerte(page) {
  const vistas = await vigilarRed(page);
  await page.locator(UBICAME).click();
  await expect(page.locator('.leaflet-marker-pane .yo')).toBeVisible();
  expect(vistas, 'peticiones de red después del toque (regla 7)').toEqual([]);
}

for (const [ancho, alto] of [[1280, 800], [1024, 768]]) {
  test.describe(`computadora ${ancho} × ${alto}`, () => {
    test.use({ viewport: { width: ancho, height: alto }, isMobile: false, hasTouch: false });

    test('c1–c3: zoom arriba a la derecha bajo la barra y el círculo abajo; nada se encima', async ({ page }) => {
      const revisar = async () => {
        const barra = await caja(page, '#barra');
        const zoom = await caja(page, ZOOM);
        expect(zoom, 'el zoom se ve').not.toBeNull();
        const bajoBarra = zoom.y - (barra.y + barra.height);
        expect(bajoBarra, 'espacio barra → zoom').toBeGreaterThanOrEqual(8);
        expect(bajoBarra, 'espacio barra → zoom').toBeLessThanOrEqual(16);
        const orilla = ancho - (zoom.x + zoom.width);
        expect(orilla, 'espacio zoom → orilla derecha').toBeGreaterThanOrEqual(8);
        expect(orilla, 'espacio zoom → orilla derecha').toBeLessThanOrEqual(16);
        const c = await circuloBien(page);
        const espacio = c.y - (zoom.y + zoom.height);
        expect(espacio, 'espacio zoom → círculo').toBeGreaterThanOrEqual(6);
        expect(espacio, 'espacio zoom → círculo').toBeLessThanOrEqual(14);
        expect(Math.abs(c.x + c.width - (zoom.x + zoom.width)), 'círculo alineado con el zoom').toBeLessThanOrEqual(4);
        return { zoom, c };
      };
      await revisar();
      await captura(page, '1-inicio');
      await conRuta(page);
      const { zoom, c } = await revisar();
      const chip = await caja(page, '#chip-ruta');
      expect(choca(zoom, chip), 'zoom × chip').toBe(false);
      expect(choca(c, chip), 'círculo × chip').toBe(false);
      await captura(page, '2-ruta');
      // c3: con el menú abierto (el mapa se recorre), siguen a la vista y sin tapar.
      await page.locator('#boton-menu').click();
      await expect(page.locator('#hoja')).not.toHaveClass(/cerrada/);
      await page.waitForTimeout(400);
      await circuloBien(page);
      expect(await sinTapar(page, '.leaflet-control-zoom-in'), 'nada tapa el «+»').toBe(true);
      await captura(page, '3-menu');
    });

    test('t1: tocar el círculo pone «Tú» sin mandar nada a la red', async ({ page }) => {
      await tocarYVerte(page);
    });
  });
}

for (const alto of [280, 212]) {
  test.describe(`teléfono acostado 844 × ${alto}`, () => {
    test.use({ viewport: { width: 844, height: alto } });

    test('a1–a3: zoom como D-60 y el círculo a su izquierda; nada se encima', async ({ page }) => {
      const revisar = async () => {
        await expect(page.locator(`.leaflet-bottom.leaflet-right ${ZOOM}`)).toHaveCount(1);
        const zoom = await caja(page, ZOOM);
        const paradas = await caja(page, '#boton-paradas');
        expect(choca(zoom, paradas), 'zoom × paradas').toBe(false);
        const c = await circuloBien(page);
        const espacio = zoom.x - (c.x + c.width);
        expect(espacio, 'espacio círculo → zoom').toBeGreaterThanOrEqual(6);
        expect(espacio, 'espacio círculo → zoom').toBeLessThanOrEqual(14);
        expect(Math.abs(c.y + c.height - (zoom.y + zoom.height)), 'círculo alineado abajo con el zoom').toBeLessThanOrEqual(2);
        for (const [nombre, s] of [['paradas', '#boton-paradas'], ['barra', '#boton-destino']]) {
          expect(choca(c, await caja(page, s)), `círculo × ${nombre}`).toBe(false);
        }
        return { zoom, c };
      };
      await revisar();
      await captura(page, '1-inicio');
      await conRuta(page);
      const { zoom, c } = await revisar();
      const chip = await caja(page, '#chip-ruta');
      expect(choca(c, chip), 'círculo × chip').toBe(false);
      expect(choca(zoom, chip), 'zoom × chip').toBe(false);
      // El pie es un renglón a todo lo ancho: se mide su texto, no su caja.
      const pie = await page.locator('#pie').evaluate((el) => {
        const r = document.createRange();
        r.selectNodeContents(el);
        const b = r.getBoundingClientRect();
        return { x: b.x, y: b.y, width: b.width, height: b.height };
      });
      expect(choca(c, pie), 'círculo × pie').toBe(false);
      await captura(page, '2-ruta');
    });

    test('t1: tocar el círculo pone «Tú» sin mandar nada a la red', async ({ page }) => {
      await tocarYVerte(page);
    });
  });
}

test('t2: al girar el teléfono el círculo sigue y el zoom baja y sube', async ({ page }) => {
  await expect(page.locator(`.leaflet-top.leaflet-right ${ZOOM}`)).toHaveCount(1);
  await expect(page.locator(UBICAME)).toHaveCount(1);
  await page.setViewportSize({ width: 844, height: 390 });
  await expect(page.locator(`.leaflet-bottom.leaflet-right ${ZOOM}`)).toHaveCount(1);
  await expect(page.locator(UBICAME)).toHaveCount(1);
  await circuloBien(page);
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator(`.leaflet-top.leaflet-right ${ZOOM}`)).toHaveCount(1);
  await circuloBien(page);
});
