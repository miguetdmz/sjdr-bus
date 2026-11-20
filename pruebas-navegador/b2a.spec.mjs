// M-08: criterios de HANDOFF §11.8 que aplican al lote B2a, en un navegador real
// a 390 × 844 (ancho de teléfono). Como la prueba funcional al final de la línea:
// las pruebas de código revisan las piezas; esta revisa el producto armado.
//
// Con CAPTURAS=1 guarda capturas a 390 px en docs/evidencia/b2a/.
import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';

const CAPTURAS = process.env.CAPTURAS === '1';
const rutas = JSON.parse(readFileSync(new URL('../web/dist/datos/rutas.json', import.meta.url), 'utf8')).rutas;
const paradas = JSON.parse(readFileSync(new URL('../web/dist/datos/paradas.json', import.meta.url), 'utf8')).paradas;
const urbanas = rutas.filter((r) => r.tipo === 'urbana');
const intermunicipales = rutas.filter((r) => r.tipo === 'intermunicipal');
const soloInventario = rutas.find((r) => r.grupo === 'solo-inventario');

async function captura(page, nombre) {
  if (CAPTURAS) await page.screenshot({ path: `docs/evidencia/b2a/${nombre}.jpg`, type: 'jpeg', quality: 80 });
}

test.beforeEach(async ({ page }) => {
  await page.route(/tile\.openstreetmap\.org/, (r) => r.abort());
  await page.goto('/');
  await expect(page.locator('#ruta optgroup')).toHaveCount(2);
});

test('primera pantalla: mapa + selector + sentido, sin scroll y sin texto de reporte', async ({ page }) => {
  const alto = page.viewportSize().height;
  // D-49: la primera pantalla es mapa + selector; el sentido aparece con la ruta.
  await expect(page.locator('#sentido')).toBeHidden();
  for (const sel of ['#mapa', '#ruta', '#boton-menu']) {
    const caja = await page.locator(sel).boundingBox();
    expect(caja, sel).not.toBeNull();
    expect(caja.y + caja.height, `${sel} dentro de la pantalla`).toBeLessThanOrEqual(alto);
  }
  const scroll = await page.evaluate(() => document.documentElement.scrollHeight > window.innerHeight);
  expect(scroll).toBe(false);
  await expect(page.locator('#ruta')).toHaveValue('');
  await expect(page.locator('#ruta option:checked')).toHaveText('¿A dónde vas? Elige tu ruta');
  await expect(page.locator('#detalle')).toBeHidden();
  // D-48: el menú empieza cerrado y lo de arriba no pasa de la quinta parte del alto.
  await expect(page.locator('#hoja')).toHaveClass(/cerrada/);
  const barra = await page.locator('#barra').boundingBox();
  expect(barra.y + barra.height, 'la barra de arriba deja libre el mapa').toBeLessThan(alto / 5);
  // Nombre (D-28) dentro del menú y leyenda de iniciativa independiente siempre visible.
  await expect(page.locator('h1.nombre')).toHaveText('SJDR Bus');
  await expect(page.locator('#pie')).toBeVisible();
  await expect(page.locator('#pie')).toContainText('Iniciativa ciudadana independiente');
  await captura(page, '1-inicio-390');
});

test('menú lateral (D-48): ☰ lo abre con el nombre; Esc y el velo lo cierran', async ({ page }) => {
  await page.locator('#boton-menu').click();
  await expect(page.locator('#hoja')).not.toHaveClass(/cerrada/);
  await expect(page.locator('#boton-menu')).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('h1.nombre')).toBeVisible();
  for (const sel of ['#pestana-rutas', '#pestana-calcula', '#cerrar-menu']) {
    const caja = await page.locator(sel).boundingBox();
    expect(Math.min(caja.width, caja.height), `${sel} mide al menos 44 px`).toBeGreaterThanOrEqual(44);
  }
  // Ajuste 2 de D-48: con el menú abierto, el buscador y el sentido están dentro del menú.
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(async () => {
    const hoja = await page.locator('#hoja').boundingBox();
    const caja = await page.locator('#ruta').boundingBox();
    expect(caja.x >= hoja.x && caja.x + caja.width <= hoja.x + hoja.width, '#ruta dentro del menú').toBe(true);
  }).toPass();
  await page.keyboard.press('Escape');
  await expect(page.locator('#hoja')).toHaveClass(/cerrada/);
  await expect(page.locator('#boton-menu')).toHaveAttribute('aria-expanded', 'false');
  // D-49: elegir la ruta abre solo el menú en su detalle, con el sentido a la mano.
  await page.locator('#ruta').selectOption('U-001');
  await expect(page.locator('#hoja')).not.toHaveClass(/cerrada/);
  await expect(page.locator('#detalle')).toBeVisible();
  await expect(page.locator('#sentido')).toBeVisible();
  await expect(async () => {
    const hoja = await page.locator('#hoja').boundingBox();
    const caja = await page.locator('#segmento').boundingBox();
    expect(caja.x >= hoja.x && caja.x + caja.width <= hoja.x + hoja.width, '#segmento dentro del menú').toBe(true);
  }).toPass();
  await expect(page.locator('#velo')).toBeVisible();
  // El menú sale por la izquierda: se toca el mapa velado a la derecha.
  await page.locator('#velo').click({ position: { x: 375, y: 400 } });
  await expect(page.locator('#hoja')).toHaveClass(/cerrada/);
});

test('atribución de OpenStreetMap visible y no tapada', async ({ page }) => {
  const enlace = page.locator('.leaflet-control-attribution a[href="https://www.openstreetmap.org/copyright"]');
  await expect(enlace).toBeVisible();
  const caja = await enlace.boundingBox();
  const encima = await page.evaluate(({ x, y }) => document.elementFromPoint(x, y)?.closest('.leaflet-control-attribution') !== null, {
    x: caja.x + caja.width / 2,
    y: caja.y + caja.height / 2,
  });
  expect(encima).toBe(true);
});

test(`selector: ${rutas.length} opciones en orden, agrupadas ${urbanas.length} + ${intermunicipales.length}`, async ({ page }) => {
  const grupos = page.locator('#ruta optgroup');
  await expect(grupos.nth(0)).toHaveAttribute('label', 'Urbanas');
  await expect(grupos.nth(1)).toHaveAttribute('label', 'Intermunicipales');
  await expect(grupos.nth(0).locator('option')).toHaveText(urbanas.map((r) => `${r.numero} — ${r.nombre}`));
  await expect(grupos.nth(1).locator('option')).toHaveText(intermunicipales.map((r) => `${r.numero} — ${r.nombre}`));
  // Sin lista, rejilla ni tarjetas de rutas fuera del selector.
  await expect(page.locator('ul li, .tarjeta-ruta, [role="grid"]')).toHaveCount(0);
  // Áreas táctiles de al menos 44 px.
  for (const sel of ['#ruta', '#boton-menu', '#control-paradas']) {
    const caja = await page.locator(sel).boundingBox();
    expect(Math.min(caja.width, caja.height), `${sel} mide al menos 44 px`).toBeGreaterThanOrEqual(44);
  }
});

test('selector: funciona solo con teclado', async ({ page }) => {
  await page.locator('#ruta').focus();
  await page.keyboard.press('ArrowDown');
  await expect(page.locator('#ruta')).toHaveValue(rutas[0].route_id);
  await expect(page.locator('#encabezado-ruta .insignia')).toHaveText(rutas[0].numero);
  await page.keyboard.press('Tab');
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('input[name="sentido"][value="vuelta"]')).toBeChecked();
});

test('detalle por sentido: la 001 vuelta 23 paradas / 16 min y la ida sus propias cifras', async ({ page }) => {
  const r001 = rutas.find((r) => r.route_id === 'U-001');
  await page.locator('#ruta').selectOption('U-001');
  const detalle = page.locator('#detalle');
  await expect(detalle).toContainText(String(r001.sentidos.ida.paradas));
  await expect(detalle).toContainText(`${r001.sentidos.ida.duracion_min} min`);
  await expect(detalle).toContainText('Nivel C');
  await expect(detalle).toContainText('referencia Moovit');
  await page.locator('#segmento label').nth(1).click();
  await expect(detalle).toContainText('23');
  await expect(detalle).toContainText('16 min');
  await expect(detalle).not.toContainText(`${r001.sentidos.ida.duracion_min} min`);
  // Mismo número y nombre en selector y encabezado.
  await expect(page.locator('#encabezado-ruta .insignia')).toHaveText(r001.numero);
  await expect(page.locator('#encabezado-ruta b')).toHaveText(r001.nombre);
  await captura(page, '2-ruta-001-vuelta-390');
  // D-49: el menú ya se abrió solo en el detalle, que se alcanza entero; los
  // botones del sentido miden al menos 44 px.
  await expect(page.locator('#hoja')).not.toHaveClass(/cerrada/);
  for (const sel of ['#segmento label:nth-child(1)', '#segmento label:nth-child(2)']) {
    const caja = await page.locator(sel).boundingBox();
    expect(Math.min(caja.width, caja.height), `${sel} mide al menos 44 px`).toBeGreaterThanOrEqual(44);
  }
  await page.locator('#detalle').scrollIntoViewIfNeeded();
  await expect(page.locator('#detalle')).toBeInViewport();
  await expect(page.locator('#detalle dd').filter({ hasText: '16 min' })).toBeInViewport();
  await captura(page, '2b-ruta-001-vuelta-ampliada-390');
});

test('solo inventario: dice «en verificación» y no muestra ninguna cifra', async ({ page }) => {
  await page.locator('#ruta').selectOption(soloInventario.route_id);
  const detalle = page.locator('#detalle');
  await expect(detalle).toContainText('en verificación');
  await expect(detalle.locator('dd')).toHaveCount(1);
  expect(await detalle.locator('dl').innerText()).not.toMatch(/\d/);
  await captura(page, '3-solo-inventario-390');
});

test('sin restos al cambiar de ruta, ni trazo en el mapa', async ({ page }) => {
  await page.locator('#ruta').selectOption('U-001');
  await page.locator('#segmento label').nth(1).click();
  await expect(page.locator('#detalle')).toContainText('16 min');
  await page.locator('#ruta').selectOption(soloInventario.route_id);
  const detalle = page.locator('#detalle');
  await expect(detalle).not.toContainText('Paradas');
  await expect(detalle).not.toContainText('min');
  await expect(detalle).not.toContainText('Moovit');
  await expect(page.locator('#encabezado-ruta .insignia')).toHaveText(soloInventario.numero);
  // Nivel C: ninguna línea dibujada en el mapa (regla 8).
  await expect(page.locator('.leaflet-overlay-pane path')).toHaveCount(0);
  // Quitar la ruta (dentro del menú, ya abierto) vuelve al inicio sin restos.
  await page.locator('#encabezado-ruta .cerrar').click();
  await expect(page.locator('#ver-detalle')).toBeHidden();
  await expect(page.locator('#sentido')).toBeHidden();
  await expect(page.locator('#hoja-titulo')).toBeVisible();
  // Cerrado el menú, «Ver detalle» lo vuelve a abrir.
  await page.locator('#ruta').selectOption('U-001');
  await page.keyboard.press('Escape');
  await expect(page.locator('#ver-detalle')).toHaveText('Ver detalle');
  await page.locator('#ver-detalle').click();
  await expect(page.locator('#hoja')).not.toHaveClass(/cerrada/);
  await page.locator('#encabezado-ruta .cerrar').click();
  await expect(page.locator('#detalle')).toBeHidden();
  await expect(page.locator('#hoja-titulo')).toBeVisible();
});

test(`paradas de OpenStreetMap: ${paradas.length} puntos con su marca, y se ocultan`, async ({ page }) => {
  const puntos = page.locator('.parada-toque');
  await expect(puntos).toHaveCount(paradas.length);
  // D-49: cada parada es un pin propio con el camión, no un punto gris.
  await expect(page.locator('.parada-toque svg')).toHaveCount(paradas.length);
  await puntos.first().evaluate((e) => e.click());
  const ficha = page.locator('.ficha-parada');
  await expect(ficha).toContainText('POR VERIFICAR EN CAMPO');
  await expect(ficha).toContainText('Fuente: OpenStreetMap');
  await captura(page, '4-parada-390');
  await page.locator('#control-paradas').click();
  await expect(puntos).toHaveCount(0);
  await expect(page.locator('#control-paradas')).toHaveAttribute('aria-pressed', 'false');
  await page.locator('#control-paradas').click();
  await expect(puntos).toHaveCount(paradas.length);
});

test('«Calcula tu ruta»: solo un aviso, sin campos ni cálculo; «Rutas» vuelve igual', async ({ page }) => {
  await page.locator('#boton-menu').click();
  await page.locator('#pestana-calcula').click();
  const modo = page.locator('#modo-calcula');
  await expect(modo).toBeVisible();
  await expect(modo).toContainText('Todavía no está disponible');
  await expect(modo).toContainText('Qué dato falta');
  await expect(modo.locator('input, select, textarea, form')).toHaveCount(0);
  await captura(page, '5-calcula-tu-ruta-390');
  await page.locator('#pestana-rutas').click();
  await expect(page.locator('#modo-rutas')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('#ruta')).toBeVisible();
  // D-49: sin ruta elegida, el sentido no se muestra.
  await expect(page.locator('#sentido')).toBeHidden();
});

test('sin tiempo calculado ni «en vivo» en ninguna pantalla', async ({ page }) => {
  const textos = [await page.locator('body').innerText()];
  for (const r of rutas) {
    await page.locator('#ruta').selectOption(r.route_id);
    for (const i of [0, 1]) {
      await page.locator('#segmento label').nth(i).click();
      textos.push(await page.locator('#hoja').textContent());
    }
  }
  for (const t of textos) {
    expect(t).not.toMatch(/en vivo/i);
    expect(t).not.toMatch(/≈\s*\d+\s*min|llega en/i);
  }
});

// D-48, ajuste 2 (Miguel, 20 nov 2026): en computadora el menú queda integrado,
// como su referencia: barra con ☰ y nombre; al abrir, el mapa se recorre y se
// ve completo, y el buscador con el sentido pasan al menú.
test.describe('computadora 1280 × 800', () => {
  test.use({ viewport: { width: 1280, height: 800 }, isMobile: false, hasTouch: false });

  test('menú integrado: no tapa el mapa y se vuelve el buscador', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await expect(page.locator('.marca-barra')).toHaveText('SJDR Bus');
    await expect(page.locator('#hoja')).toHaveClass(/cerrada/);
    await page.locator('#boton-menu').click();
    await expect(page.locator('#hoja')).not.toHaveClass(/cerrada/);
    await expect(page.locator('#velo')).toBeHidden();
    await page.locator('#ruta').selectOption('U-001');
    await expect(async () => {
      const hoja = await page.locator('#hoja').boundingBox();
      const mapa = await page.locator('#mapa').boundingBox();
      expect(mapa.x, 'el mapa empieza donde termina el menú').toBeGreaterThanOrEqual(hoja.x + hoja.width - 1);
      for (const sel of ['#ruta', '#segmento']) {
        const caja = await page.locator(sel).boundingBox();
        expect(caja.x >= hoja.x && caja.x + caja.width <= hoja.x + hoja.width, `${sel} dentro del menú`).toBe(true);
      }
    }).toPass();
    // La leyenda sigue a la vista, sin quedar debajo del menú (regla 4).
    const pie = await page.locator('#pie').boundingBox();
    const tapada = await page.evaluate(({ x, y }) => document.elementFromPoint(x, y)?.closest('#pie') === null, {
      x: pie.x + pie.width / 2,
      y: pie.y + pie.height / 2,
    });
    expect(tapada).toBe(false);
    await page.locator('#boton-menu').click();
    await expect(page.locator('#hoja')).toHaveClass(/cerrada/);
  });
});
