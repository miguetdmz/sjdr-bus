// D-50: criterio de aceptación del selector visual de rutas y de las zonas
// probables, en un navegador real (docs/DECISIONES.md, D-50), con los cambios de
// D-53: sin desplegable y sin «Ruta 001». Revisa la regla, no el dato del día
// (lección 11).
//
// Con CAPTURAS=1 guarda capturas en docs/evidencia/d50/ y deja cargar las
// teselas del mapa (solo en esa corrida manual).
import { test, expect } from '@playwright/test';
import { abrirMenu, elegirRuta, insignia, leerDatos, sentido } from './ayuda.mjs';

const CAPTURAS = process.env.CAPTURAS === '1';
const { rutas } = leerDatos('rutas.json');

async function captura(page, nombre) {
  if (!CAPTURAS) return;
  await page.waitForTimeout(900);
  await page.screenshot({ path: `docs/evidencia/d50/${nombre}.jpg`, type: 'jpeg', quality: 80 });
}

test.beforeEach(async ({ page }) => {
  if (!CAPTURAS) await page.route(/tile\.openstreetmap\.org/, (r) => r.abort());
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('#tarjetas .tarjeta-ruta')).toHaveCount(rutas.length);
});

// Cuántas tarjetas se ven enteras dentro de la caja que se desplaza.
async function tarjetasVisibles(page) {
  return page.evaluate(() => {
    const caja = document.querySelector('.hoja-cuerpo').getBoundingClientRect();
    const alto = Math.min(caja.bottom, window.innerHeight);
    return [...document.querySelectorAll('#tarjetas .tarjeta-ruta')].filter((t) => {
      const r = t.getBoundingClientRect();
      return r.top >= caja.top - 1 && r.bottom <= alto + 1 && r.width > 0;
    }).length;
  });
}

test('criterio 1 (regla 9): las rutas en tarjetas, en el orden de routes.txt, ninguna oculta y sin desplegable', async ({ page }) => {
  await abrirMenu(page);
  const tarjetas = page.locator('#tarjetas .tarjeta-ruta');
  expect(await tarjetas.evaluateAll((ts) => ts.map((t) => t.dataset.ruta))).toEqual(rutas.map((r) => r.route_id));
  for (const [i, r] of rutas.entries()) {
    const t = tarjetas.nth(i);
    await expect(t.locator('.camion strong')).toHaveText(insignia(r));
    await expect(t.locator('.tarjeta-nombre')).toHaveText(r.nombre);
  }
  await tarjetas.last().scrollIntoViewIfNeeded();
  await expect(tarjetas.last()).toBeInViewport();
  // D-53, 6: ya no hay <select>.
  await expect(page.locator('select')).toHaveCount(0);
});

test('criterio 2 y 3 (390 px, D-53): más tarjetas a la vista que con D-52, aviso de colores, 44 px', async ({ page }) => {
  await abrirMenu(page);
  await expect(page.locator('#aviso-colores')).toContainText('no indican nada de la ruta');
  await expect(page.locator('#aviso-colores')).toBeVisible();
  // D-52 dejaba ver 14; D-53 las hace más chicas.
  expect(await tarjetasVisibles(page)).toBeGreaterThanOrEqual(15);
  const caja = await page.locator('#tarjetas .tarjeta-ruta').first().boundingBox();
  expect(Math.min(caja.width, caja.height)).toBeGreaterThanOrEqual(44);
  // Colores alternados: dos urbanas seguidas nunca del mismo color; las
  // intermunicipales llevan su color aparte.
  const fondos = await page.locator('#tarjetas .tarjeta-ruta').evaluateAll((ts) => ts.map((t) => getComputedStyle(t).backgroundColor));
  const urb = fondos.filter((_, i) => rutas[i].tipo === 'urbana');
  const inter = fondos.filter((_, i) => rutas[i].tipo === 'intermunicipal');
  for (let i = 1; i < urb.length; i++) expect(urb[i], `urbanas ${i} y ${i + 1}`).not.toBe(urb[i - 1]);
  for (const c of inter) expect(urb, 'el color intermunicipal no se usa en urbanas').not.toContain(c);
  await captura(page, '1-tarjetas-390');
});

test('criterio 4: tocar una tarjeta elige la ruta; mismo color en el detalle; «Cambiar ruta» vuelve', async ({ page }) => {
  const r = rutas[1];
  await elegirRuta(page, r.route_id);
  await expect(page.locator('#sentido')).toBeVisible();
  await expect(page.locator('#detalle')).toBeVisible();
  await expect(page.locator('#selector-visual')).toBeHidden();
  await expect(page.locator('#encabezado-ruta .camion')).toHaveText(insignia(r));
  // El encabezado tiene el mismo color que su tarjeta (lección 3).
  const colorTarjeta = await page.locator(`#tarjetas .tarjeta-ruta[data-ruta="${r.route_id}"]`).evaluate((t) => getComputedStyle(t).backgroundColor);
  const colorPlaca = await page.locator('#encabezado-ruta').evaluate((t) => getComputedStyle(t).backgroundColor);
  expect(colorPlaca).toBe(colorTarjeta);
  await captura(page, '2-detalle-390');
  await page.getByRole('button', { name: 'Cambiar de ruta: volver a las tarjetas' }).click();
  await expect(page.locator('#selector-visual')).toBeVisible();
  await expect(page.locator('#ruta-elegida')).toBeHidden();
});

test('criterio 5: «Tus rutas recientes» no sale la primera vez, guarda hasta 3 y «Borrar» la vacía', async ({ page, context }) => {
  await abrirMenu(page);
  await expect(page.locator('#recientes')).toBeHidden();
  for (const r of rutas.slice(0, 4)) await elegirRuta(page, r.route_id);
  await page.locator('#cambiar-ruta').click();
  await expect(page.locator('#recientes')).toBeVisible();
  const ids = await page.locator('#lista-recientes .tarjeta-ruta').evaluateAll((ts) => ts.map((t) => t.dataset.ruta));
  expect(ids).toEqual([rutas[3], rutas[2], rutas[1]].map((r) => r.route_id));
  // Sin cookies: solo localStorage.
  expect(await context.cookies()).toEqual([]);
  // Sobrevive a recargar la página.
  await page.reload();
  await abrirMenu(page);
  await expect(page.locator('#lista-recientes .tarjeta-ruta')).toHaveCount(3);
  await captura(page, '3-recientes-390');
  await page.locator('#borrar-recientes').click();
  await expect(page.locator('#recientes')).toBeHidden();
  expect(await page.evaluate(() => localStorage.getItem('sjdrbus.recientes'))).toBeNull();
});

test('criterio 6: inicio y fin como zona, con leyenda estimado; sin línea de trayectoria', async ({ page }) => {
  const r = rutas.find((x) => !x.extremos.origen.faltante && !x.extremos.destino.faltante);
  await elegirRuta(page, r.route_id);
  await expect(page.locator('.leaflet-zonas-pane path.zona')).toHaveCount(2);
  // D-53 (maqueta): la etiqueta dice el papel y el lugar.
  await expect(page.locator('.punto-zona')).toHaveText([`Inicio: ${r.extremos.origen.lugar}`, `Fin: ${r.extremos.destino.lugar}`]);
  // Ninguna línea: el panel normal de líneas sigue vacío (regla 8, D-49).
  await expect(page.locator('.leaflet-overlay-pane path')).toHaveCount(0);
  await page.keyboard.press('Escape');
  await expect(page.locator('#hoja')).toHaveClass(/cerrada/);
  // El mapa se acomoda a las dos zonas (~330 ms); se espera a que quede quieto.
  await page.waitForTimeout(600);
  await page.locator('.punto-zona.zona-inicio').click();
  const ficha = page.locator('.leaflet-popup-content');
  await expect(ficha).toContainText(`Inicio: ${r.extremos.origen.lugar}`);
  await expect(ficha).toContainText('Zona aproximada (estimado) · en proceso de validación');
  await expect(ficha).not.toContainText('Fuente');
  await captura(page, '4-zonas-390');
  // Vuelta: el inicio pasa a ser el destino.
  await page.locator('#ver-detalle').click();
  await sentido(page, 1);
  await page.keyboard.press('Escape');
  await page.waitForTimeout(600);
  await page.locator('.punto-zona.zona-inicio').click();
  await expect(page.locator('.leaflet-popup-content')).toContainText(`Inicio: ${r.extremos.destino.lugar}`);
});

test('criterio 6: un extremo FALTANTE no se dibuja y se dice', async ({ page }) => {
  const r = rutas.find((x) => x.extremos.origen.faltante || x.extremos.destino.faltante);
  test.skip(!r, 'hoy ningún extremo es FALTANTE');
  await elegirRuta(page, r.route_id);
  await expect(page.locator('.leaflet-zonas-pane path.zona')).toHaveCount(1);
  await expect(page.locator('#detalle .detalle-pie')).toContainText('FALTANTE');
});

test.describe('computadora 1280 × 800', () => {
  test.use({ viewport: { width: 1280, height: 800 }, isMobile: false, hasTouch: false });

  test('criterio 2: al menos 12 tarjetas a la vista; el mapa sigue completo junto al menú', async ({ page }) => {
    await abrirMenu(page);
    await expect(page.locator('#hoja')).not.toHaveClass(/cerrada/);
    expect(await tarjetasVisibles(page)).toBeGreaterThanOrEqual(12);
    await expect(async () => {
      const hoja = await page.locator('#hoja').boundingBox();
      const mapa = await page.locator('#mapa').boundingBox();
      expect(mapa.x).toBeGreaterThanOrEqual(hoja.x + hoja.width - 1);
    }).toPass();
    await captura(page, '5-tarjetas-1280');
    await page.locator(`#tarjetas .tarjeta-ruta[data-ruta="${rutas[0].route_id}"]`).click();
    await expect(page.locator('.leaflet-zonas-pane path.zona')).toHaveCount(2);
    await captura(page, '6-zonas-1280');
  });
});
