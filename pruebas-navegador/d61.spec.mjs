// D-61: criterios de aceptación (docs/evidencia/d61/criterios.md), escritos antes
// de construir, contra la maqueta aprobada (docs/maquetas/d61/). Teléfono parado:
// zoom arriba a la derecha y círculo «mi ubicación». Revisa la regla (espacios,
// alineación, que nada se encime), no el pixel del día (lección 11).
//
// Con CAPTURAS=1 deja cargar las teselas y guarda las pantallas en docs/evidencia/d61/.
import { test, expect } from '@playwright/test';
import { leerDatos, elegirRuta, sinTapar } from './ayuda.mjs';

const CAPTURAS = process.env.CAPTURAS === '1';
const { rutas } = leerDatos('rutas.json');
const LARGA = [...rutas].sort((a, b) => b.nombre.length - a.nombre.length)[0].route_id;
// Ubicación de PRUEBA (no es la de nadie): Plaza Independencia, HANDOFF §11.3.
const PLAZA = { latitude: 20.38883, longitude: -99.99639 };
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
  await page.screenshot({ path: `docs/evidencia/d61/${nombre}-${width}x${height}.jpg`, type: 'jpeg', quality: 82 });
}

const choca = (a, b) => a.x < b.x + b.width && b.x < a.x + a.width && a.y < b.y + b.height && b.y < a.y + a.height;
const caja = (page, s) => page.locator(s).boundingBox();
const ZOOM = '.leaflet-control-zoom';
const UBICAME = '#ubicame';

async function revisarColumna(page) {
  const paradas = await caja(page, '#boton-paradas');
  const zoom = await caja(page, ZOOM);
  const circulo = await caja(page, UBICAME);
  expect(zoom, 'el zoom se ve').not.toBeNull();
  expect(circulo, 'el círculo «mi ubicación» se ve').not.toBeNull();
  // p1: zoom abajo del botón de paradas, con espacio, alineado a la derecha.
  const espacio1 = zoom.y - (paradas.y + paradas.height);
  expect(espacio1, 'espacio paradas → zoom').toBeGreaterThanOrEqual(8);
  expect(espacio1, 'espacio paradas → zoom').toBeLessThanOrEqual(16);
  expect(Math.abs(zoom.x + zoom.width - (paradas.x + paradas.width)), 'zoom alineado con paradas').toBeLessThanOrEqual(4);
  // p2: círculo abajo del zoom, con espacio, del tamaño de un dedo, alineado y redondo.
  const espacio2 = circulo.y - (zoom.y + zoom.height);
  expect(espacio2, 'espacio zoom → círculo').toBeGreaterThanOrEqual(6);
  expect(espacio2, 'espacio zoom → círculo').toBeLessThanOrEqual(14);
  expect(circulo.width, 'ancho del círculo').toBeGreaterThanOrEqual(44);
  expect(circulo.width, 'ancho del círculo').toBeLessThanOrEqual(48);
  expect(Math.abs(circulo.width - circulo.height), 'el círculo es cuadrado').toBeLessThanOrEqual(0.5);
  expect(Math.abs(circulo.x + circulo.width - (zoom.x + zoom.width)), 'círculo alineado con el zoom').toBeLessThanOrEqual(4);
  const radio = await page.locator(UBICAME).evaluate((el) => parseFloat(getComputedStyle(el).borderTopLeftRadius));
  expect(radio, 'el círculo es redondo').toBeGreaterThanOrEqual(circulo.width / 2 - 0.5);
  const { width, height } = page.viewportSize();
  expect(circulo.x + circulo.width <= width && circulo.y + circulo.height <= height, 'el círculo cabe en la pantalla').toBe(true);
  expect(await sinTapar(page, UBICAME), 'nada tapa el círculo').toBe(true);
}

for (const [ancho, alto] of [[390, 844], [375, 667], [320, 568]]) {
  test.describe(`teléfono parado ${ancho} × ${alto}`, () => {
    test.use({ viewport: { width: ancho, height: alto } });

    test('p1–p3: zoom arriba bajo paradas, círculo abajo; nada se encima con la ruta más larga', async ({ page }) => {
      await revisarColumna(page);
      await captura(page, '1-inicio');
      await elegirRuta(page, LARGA);
      await page.keyboard.press('Escape');
      await expect(page.locator('#hoja')).toHaveClass(/cerrada/);
      await expect(page.locator('#chip-ruta')).toBeVisible();
      await revisarColumna(page);
      const chip = await caja(page, '#chip-ruta');
      const barra = await caja(page, '#boton-destino');
      for (const [nombre, s] of [['zoom', ZOOM], ['círculo', UBICAME]]) {
        const c = await caja(page, s);
        expect(choca(c, chip), `${nombre} × chip`).toBe(false);
        expect(choca(c, barra), `${nombre} × «¿A dónde quieres ir?»`).toBe(false);
      }
      await captura(page, '2-ruta');
    });
  });
}

test.describe('con permiso de ubicación (390 × 844)', () => {
  test.use({ geolocation: PLAZA, permissions: ['geolocation'] });

  test('p4: el círculo pone «Tú» en el mapa, lo centra y no manda nada a la red', async ({ page }) => {
    const vistas = [];
    page.on('request', (r) => {
      if (!/tile\.openstreetmap\.org/.test(r.url())) vistas.push(r.url());
    });
    await page.locator(UBICAME).click();
    await expect(page.locator('.leaflet-marker-pane .yo')).toBeVisible();
    await page.waitForFunction(() => !document.querySelector('#mapa').classList.contains('leaflet-zoom-anim'));
    // El centro del mapa queda a menos de 30 m de «Tú» (metros por pixel de Web
    // Mercator al zoom vigente, leído de las teselas de la capa de arriba).
    await expect.poll(async () => {
      const r = await page.evaluate(() => {
        const m = document.querySelector('#mapa').getBoundingClientRect();
        const yo = document.querySelector('.leaflet-marker-pane .yo').getBoundingClientRect();
        const capas = [...document.querySelectorAll('.leaflet-tile-container')].sort((a, b) => +b.style.zIndex - +a.style.zIndex);
        const img = capas[0]?.querySelector('img.leaflet-tile');
        const z = img ? +img.src.match(/\/(\d+)\/\d+\/\d+\.png/)[1] : NaN;
        return { px: Math.hypot(yo.x + yo.width / 2 - (m.x + m.width / 2), yo.y + yo.height / 2 - (m.y + m.height / 2)), z };
      });
      return r.px * ((156543.03 * Math.cos((PLAZA.latitude * Math.PI) / 180)) / 2 ** r.z);
    }, { message: 'distancia del centro del mapa a «Tú», en m' }).toBeLessThan(30);
    expect(vistas, 'peticiones de red después del toque (regla 7)').toEqual([]);
    await captura(page, '3-ubicado');
  });
});

test.describe('sin permiso de ubicación (390 × 844)', () => {
  test.use({ geolocation: PLAZA, permissions: [] });

  test('p5: aviso de que no hay permiso y la app sigue', async ({ page }) => {
    await page.locator(UBICAME).click();
    const aviso = page.locator('#aviso-ubicacion');
    await expect(aviso).toBeVisible();
    await expect(aviso).toContainText(/permiso/i);
    await expect(aviso).toContainText(/sigue/i);
    await captura(page, '4-sin-permiso');
    await page.locator('#boton-menu').click();
    await expect(page.locator('#hoja')).not.toHaveClass(/cerrada/);
  });
});

for (const [ancho, alto, extra] of [[844, 280, {}], [1280, 800, { isMobile: false, hasTouch: false }]]) {
  test.describe(`${ancho} × ${alto}`, () => {
    test.use({ viewport: { width: ancho, height: alto }, ...extra });

    test('p6: sin círculo y el zoom abajo a la derecha, como en D-60', async ({ page }) => {
      await expect(page.locator(UBICAME)).toHaveCount(0);
      await expect(page.locator(`.leaflet-bottom.leaflet-right ${ZOOM}`)).toHaveCount(1);
    });
  });
}

test('p7: al girar el teléfono los controles se acomodan solos', async ({ page }) => {
  await expect(page.locator(`.leaflet-top.leaflet-right ${ZOOM}`)).toHaveCount(1);
  await page.setViewportSize({ width: 844, height: 390 });
  await expect(page.locator(UBICAME)).toHaveCount(0);
  await expect(page.locator(`.leaflet-bottom.leaflet-right ${ZOOM}`)).toHaveCount(1);
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator(`.leaflet-top.leaflet-right ${ZOOM}`)).toHaveCount(1);
  await revisarColumna(page);
});
