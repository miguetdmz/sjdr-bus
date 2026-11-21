// M-08: criterios de HANDOFF §11.8 que aplican al lote B2a, en un navegador real
// a 390 × 844 (ancho de teléfono). Como la prueba funcional al final de la línea:
// las pruebas de código revisan las piezas; esta revisa el producto armado.
// D-53: sin desplegable; la ruta se elige por tarjeta (pruebas-navegador/ayuda.mjs).
//
// Con CAPTURAS=1 guarda capturas a 390 px en docs/evidencia/b2a/.
import { test, expect } from '@playwright/test';
import { abrirMenu, elegirRuta, insignia, leerDatos, sentido, sinTapar } from './ayuda.mjs';

const CAPTURAS = process.env.CAPTURAS === '1';
const { rutas } = leerDatos('rutas.json');
const { paradas } = leerDatos('paradas.json');
const soloInventario = rutas.find((r) => r.grupo === 'solo-inventario');
const r001 = rutas.find((r) => r.route_id === 'U-001');

async function captura(page, nombre) {
  if (CAPTURAS) await page.screenshot({ path: `docs/evidencia/b2a/${nombre}.jpg`, type: 'jpeg', quality: 80 });
}

test.beforeEach(async ({ page }) => {
  await page.route(/tile\.openstreetmap\.org/, (r) => r.abort());
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('#tarjetas .tarjeta-ruta')).toHaveCount(rutas.length);
});

test('primera pantalla (regla 5, D-53): mapa + ☰ + «¿A dónde quieres ir?» + paradas, sin scroll ni reporte', async ({ page }) => {
  const alto = page.viewportSize().height;
  for (const sel of ['#mapa', '#boton-menu', '#boton-destino', '#boton-paradas']) {
    const caja = await page.locator(sel).boundingBox();
    expect(caja, sel).not.toBeNull();
    expect(caja.y + caja.height, `${sel} dentro de la pantalla`).toBeLessThanOrEqual(alto);
  }
  const scroll = await page.evaluate(() => document.documentElement.scrollHeight > window.innerHeight);
  expect(scroll).toBe(false);
  // El menú empieza cerrado y lo de arriba no pasa de la quinta parte del alto.
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
  // Lección 13: el menú abierto tiene fondo opaco (se perdió una vez al rehacer estilos).
  const fondo = await page.locator('#hoja').evaluate((h) => getComputedStyle(h).backgroundColor);
  expect(fondo, 'fondo del menú').toBe('rgb(255, 255, 255)');
  for (const sel of ['#pestana-rutas', '#pestana-calcula', '#cerrar-menu']) {
    const caja = await page.locator(sel).boundingBox();
    expect(Math.min(caja.width, caja.height), `${sel} mide al menos 44 px`).toBeGreaterThanOrEqual(44);
  }
  await page.keyboard.press('Escape');
  await expect(page.locator('#hoja')).toHaveClass(/cerrada/);
  await expect(page.locator('#boton-menu')).toHaveAttribute('aria-expanded', 'false');
  // D-49: elegir la ruta abre solo el menú en su detalle, con el sentido adentro.
  await elegirRuta(page, 'U-001');
  await expect(page.locator('#hoja')).not.toHaveClass(/cerrada/);
  await expect(page.locator('#detalle')).toBeVisible();
  await expect(page.locator('#sentido')).toBeVisible();
  await expect(page.locator('#velo')).toBeVisible();
  // El menú sale por la izquierda: se toca el mapa velado a la derecha.
  await page.locator('#velo').click({ position: { x: 375, y: 400 } });
  await expect(page.locator('#hoja')).toHaveClass(/cerrada/);
});

test('atribución de OpenStreetMap visible y no tapada (regla 6), en el pie', async ({ page }) => {
  const enlace = page.locator('#pie a[href="https://www.openstreetmap.org/copyright"]');
  await expect(enlace).toBeVisible();
  expect(await sinTapar(page, '#pie a[href="https://www.openstreetmap.org/copyright"]')).toBe(true);
  // Con el menú abierto sigue a la vista.
  await page.locator('#boton-menu').click();
  expect(await sinTapar(page, '#pie a[href="https://www.openstreetmap.org/copyright"]')).toBe(true);
});

test('áreas táctiles de al menos 44 px y tarjetas operables con teclado', async ({ page }) => {
  for (const sel of ['#boton-menu', '#boton-destino', '#boton-paradas']) {
    const caja = await page.locator(sel).boundingBox();
    expect(Math.min(caja.width, caja.height), `${sel} mide al menos 44 px`).toBeGreaterThanOrEqual(44);
  }
  await abrirMenu(page);
  await page.locator('#tarjetas .tarjeta-ruta').first().focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#encabezado-ruta .camion')).toHaveText(insignia(rutas[0]));
  // Los botones de sentido son radios nativos: flechas cambian de Ida a Vuelta.
  await page.locator('input[name="sentido"][value="ida"]').focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('input[name="sentido"][value="vuelta"]')).toBeChecked();
});

test('detalle por sentido: la 001 vuelta 23 paradas / 16 min y la ida sus propias cifras', async ({ page }) => {
  await elegirRuta(page, 'U-001');
  const detalle = page.locator('#detalle');
  await expect(detalle).toContainText(String(r001.sentidos.ida.paradas));
  await expect(detalle).toContainText(`${r001.sentidos.ida.duracion_min} min`);
  await expect(detalle).toContainText('Nivel C');
  // D-52: sin fuentes en pantalla (siguen en los datos); leyenda general abajo.
  await expect(detalle).not.toContainText('Moovit');
  await expect(page.locator('#pie')).toContainText('datos en proceso de validación');
  await sentido(page, 1);
  await expect(detalle).toContainText('23');
  await expect(detalle).toContainText('16 min');
  await expect(detalle).not.toContainText(`${r001.sentidos.ida.duracion_min} min`);
  // Encabezado: insignia R1 y nombre; nunca «Ruta 001» (D-53, 6:23 pm).
  await expect(page.locator('#encabezado-ruta .camion')).toHaveText('R1');
  await expect(page.locator('#encabezado-ruta .enc-nombre')).toHaveText(r001.nombre);
  await expect(page.locator('#hoja')).not.toContainText(/Ruta \d{3}/);
  await captura(page, '2-ruta-001-vuelta-390');
  for (const sel of ['#segmento label:nth-child(1)', '#segmento label:nth-child(2)']) {
    const caja = await page.locator(sel).boundingBox();
    expect(Math.min(caja.width, caja.height), `${sel} mide al menos 44 px`).toBeGreaterThanOrEqual(44);
  }
  await expect(page.locator('#detalle dd').filter({ hasText: '16 min' })).toBeInViewport();
});

test('solo inventario: dice «en verificación» y no muestra ninguna cifra', async ({ page }) => {
  await elegirRuta(page, soloInventario.route_id);
  const datos = page.locator('#detalle-datos');
  await expect(datos).toContainText('en verificación');
  await expect(datos.locator('.fila-paradas, .fila-duracion, .fila-horario')).toHaveCount(0);
  expect(await datos.locator('dl').innerText()).not.toMatch(/\d/);
  await captura(page, '3-solo-inventario-390');
});

test('sin restos al cambiar de ruta, ni trazo en el mapa', async ({ page }) => {
  await elegirRuta(page, 'U-001');
  await sentido(page, 1);
  await expect(page.locator('#detalle')).toContainText('16 min');
  await elegirRuta(page, soloInventario.route_id);
  const datos = page.locator('#detalle-datos');
  await expect(datos.locator('.fila-paradas, .fila-duracion, .fila-horario')).toHaveCount(0);
  await expect(datos).not.toContainText('min');
  await expect(page.locator('#encabezado-ruta .camion')).toHaveText(insignia(soloInventario));
  // Nivel C: ninguna línea dibujada en el mapa (regla 8).
  await expect(page.locator('.leaflet-overlay-pane path')).toHaveCount(0);
  // «Cambiar ruta» vuelve a las tarjetas sin restos.
  await page.locator('#cambiar-ruta').click();
  await expect(page.locator('#ruta-elegida')).toBeHidden();
  await expect(page.locator('#hoja-titulo')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('#chip-ruta')).toBeHidden();
  // Cerrado el menú con ruta, «Ver detalle» lo vuelve a abrir.
  await elegirRuta(page, 'U-001');
  await page.keyboard.press('Escape');
  await expect(page.locator('#ver-detalle')).toHaveText('Ver detalle');
  await page.locator('#ver-detalle').click();
  await expect(page.locator('#hoja')).not.toHaveClass(/cerrada/);
  await expect(page.locator('#detalle')).toBeVisible();
});

test(`paradas de OpenStreetMap: ocultas al cargar; el botón muestra ${paradas.length} con su marca`, async ({ page }) => {
  const puntos = page.locator('.parada-toque');
  await expect(puntos).toHaveCount(0);
  await page.locator('#boton-paradas').click();
  await expect(puntos).toHaveCount(paradas.length);
  await puntos.first().evaluate((e) => e.click());
  const ficha = page.locator('.ficha-parada');
  await expect(ficha).toContainText('POR VERIFICAR EN CAMPO');
  await expect(ficha).toContainText('Fuente: OpenStreetMap');
  await captura(page, '4-parada-390');
  await page.locator('#boton-paradas').click();
  await expect(puntos).toHaveCount(0);
  await expect(page.locator('#boton-paradas')).toHaveAttribute('aria-pressed', 'false');
});

test('sin tiempo calculado ni «en vivo» en ninguna pantalla', async ({ page }) => {
  const textos = [await page.locator('body').innerText()];
  for (const r of rutas) {
    await elegirRuta(page, r.route_id);
    for (const i of [0, 1]) {
      await sentido(page, i);
      textos.push(await page.locator('#hoja').textContent());
    }
  }
  for (const t of textos) {
    expect(t).not.toMatch(/en vivo/i);
    expect(t).not.toMatch(/≈\s*\d+\s*min|llega en/i);
  }
});

// Pedido de Miguel (20 nov 2026): el detalle se alcanza entero aunque la pantalla sea baja.
test.describe('teléfono con pantalla baja', () => {
  test.use({ viewport: { width: 390, height: 520 } });

  test('el detalle se desplaza dentro del menú y se alcanza entero', async ({ page }) => {
    await elegirRuta(page, 'U-002');
    await sentido(page, 1);
    const cuerpo = page.locator('.hoja-cuerpo');
    const hayScroll = await cuerpo.evaluate((c) => c.scrollHeight > c.clientHeight);
    expect(hayScroll, 'la pantalla baja obliga a desplazar el detalle').toBe(true);
    await page.locator('#detalle .detalle-pie').scrollIntoViewIfNeeded();
    await expect(page.locator('#detalle .detalle-pie')).toBeInViewport();
    // Las pestañas siguen arriba, fuera de lo que se desplaza.
    await expect(page.locator('#pestanas')).toBeInViewport();
  });
});

test.describe('computadora 1280 × 800', () => {
  test.use({ viewport: { width: 1280, height: 800 }, isMobile: false, hasTouch: false });

  test('menú integrado: no tapa el mapa; el pie sigue a la vista', async ({ page }) => {
    await expect(page.locator('.marca-barra')).toHaveText('SJDR Bus');
    await expect(page.locator('#hoja')).toHaveClass(/cerrada/);
    await elegirRuta(page, 'U-001');
    await expect(page.locator('#velo')).toBeHidden();
    await expect(async () => {
      const hoja = await page.locator('#hoja').boundingBox();
      const mapa = await page.locator('#mapa').boundingBox();
      expect(mapa.x, 'el mapa empieza donde termina el menú').toBeGreaterThanOrEqual(hoja.x + hoja.width - 1);
      const seg = await page.locator('#segmento').boundingBox();
      expect(seg.x >= hoja.x && seg.x + seg.width <= hoja.x + hoja.width, 'el sentido va dentro del menú').toBe(true);
    }).toPass();
    expect(await sinTapar(page, '#pie a[href="https://www.openstreetmap.org/copyright"]')).toBe(true);
    await page.locator('#boton-menu').click();
    await expect(page.locator('#hoja')).toHaveClass(/cerrada/);
  });
});
