// D-58: criterios de aceptación (docs/evidencia/d58/criterios.md), escritos antes
// de construir, contra la maqueta aprobada (docs/maquetas/d58/, tarjeta en esquina
// suave). Revisa la regla (forma y tamaño), no el dato del día (lección 11).
//
// Con CAPTURAS=1 deja cargar las teselas y guarda las pantallas en docs/evidencia/d58/.
import { test, expect } from '@playwright/test';
import { leerDatos, elegirRuta } from './ayuda.mjs';

const CAPTURAS = process.env.CAPTURAS === '1';
const { rutas } = leerDatos('rutas.json');
const PRIMERA = rutas[0].route_id;
// Ubicación de PRUEBA (no es la de nadie): Plaza Independencia, HANDOFF §11.3.
test.use({ geolocation: { latitude: 20.38883, longitude: -99.99639 }, permissions: ['geolocation'] });
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
  await page.screenshot({ path: `docs/evidencia/d58/${nombre}-${page.viewportSize().width}.jpg`, type: 'jpeg', quality: 82 });
}

// Radio real de la esquina en pixeles (999px o 50 % se traducen a lo que se ve).
async function forma(page, selector) {
  return page.locator(selector).first().evaluate((el) => {
    const r = getComputedStyle(el).borderTopLeftRadius;
    const b = el.getBoundingClientRect();
    const radio = r.endsWith('%') ? (parseFloat(r) / 100) * Math.min(b.width, b.height) : parseFloat(r);
    return { radio: Math.min(radio, b.height / 2, b.width / 2), crudo: parseFloat(r), alto: b.height, ancho: b.width };
  });
}
async function esPildora(page, selector) {
  const f = await forma(page, selector);
  expect(f.radio, `${selector}: esquina ${f.radio}px con alto ${f.alto}px (debe ser píldora)`).toBeGreaterThanOrEqual(f.alto / 2 - 0.5);
}
async function esCirculo(page, selector) {
  const f = await forma(page, selector);
  expect(Math.abs(f.ancho - f.alto), `${selector}: no es cuadrado (${f.ancho}×${f.alto})`).toBeLessThanOrEqual(1);
  await esPildora(page, selector);
}

// Nivel de zoom del mapa: el de las teselas de la capa de arriba (la vigente).
const zoomActual = (page) => page.evaluate(() => {
  const capas = [...document.querySelectorAll('.leaflet-tile-container')].sort((a, b) => +b.style.zIndex - +a.style.zIndex);
  const img = capas[0]?.querySelector('img.leaflet-tile');
  return img ? +img.src.match(/\/(\d+)\/\d+\/\d+\.png/)[1] : NaN;
});

async function cerrarBienvenida(page) {
  if (await page.locator('#bienvenida').isVisible()) await page.locator('#bienvenida-cerrar').click();
}

async function zoom(page) {
  // z1: visible, con nombre y de al menos 44 px por botón.
  const mas = page.locator('.leaflet-control-zoom-in');
  const menos = page.locator('.leaflet-control-zoom-out');
  await expect(mas).toBeVisible();
  await expect(menos).toBeVisible();
  await expect(mas).toHaveAttribute('aria-label', 'Acercar');
  await expect(menos).toHaveAttribute('aria-label', 'Alejar');
  for (const b of [mas, menos]) {
    const c = await b.boundingBox();
    expect(Math.min(c.width, c.height), 'botón de zoom de al menos 44 px').toBeGreaterThanOrEqual(44);
  }
  // z2: una píldora (esquina de al menos la mitad del ancho).
  const f = await forma(page, '.leaflet-control-zoom');
  expect(f.crudo, 'control de zoom en píldora').toBeGreaterThanOrEqual(f.ancho / 2 - 0.5);
  // z3: «+» sube un nivel y «−» lo baja.
  const z0 = await zoomActual(page);
  expect(Number.isFinite(z0)).toBe(true);
  await mas.click();
  await expect.poll(() => zoomActual(page)).toBe(z0 + 1);
  // Leaflet ignora un toque a media animación; una persona espera a que termine.
  await page.waitForFunction(() => !document.querySelector('#mapa').classList.contains('leaflet-zoom-anim'));
  await page.waitForTimeout(300);
  await menos.click();
  await expect.poll(() => zoomActual(page)).toBe(z0);
}

// k2: esquina suave de 22 px, alto fijo, 3 columnas y ningún nombre se sale.
async function tarjetasSuaves(page, alto) {
  const f = await forma(page, '#tarjetas .tarjeta-ruta.partida');
  expect(f.crudo, 'esquina de la tarjeta de ruta').toBe(22);
  expect(Math.round(f.alto), 'alto de la tarjeta de ruta').toBe(alto);
  const columnas = await page.locator('#tarjetas .tarjeta-ruta.partida').first().evaluate(
    (el) => getComputedStyle(el.parentElement).gridTemplateColumns.split(' ').length,
  );
  expect(columnas, 'columnas de tarjetas').toBe(3);
  const salen = await page.evaluate(() => [...document.querySelectorAll('.tarjeta-ruta.partida .tarjeta-nombre')]
    .filter((n) => n.offsetParent && n.firstElementChild
      && (n.firstElementChild.scrollWidth > n.clientWidth + 0.5 || n.firstElementChild.getBoundingClientRect().height > n.clientHeight + 0.5))
    .map((n) => n.textContent));
  expect(salen, 'nombres que se salen de su tarjeta').toEqual([]);
}

test('z1–z4 (390 px): zoom en píldora, funciona y no se encima con el chip de la ruta', async ({ page }) => {
  // Desde cero (sin la bienvenida ya vista), como la ve alguien la primera vez.
  await page.evaluate(() => localStorage.removeItem('sjdrbus.bienvenida'));
  await page.reload();
  // k1 en la bienvenida: sus dos botones en píldora; k3: ella sigue con su esquina.
  await expect(page.locator('#bienvenida')).toBeVisible();
  await esPildora(page, '#bienvenida-rutas');
  await esPildora(page, '#bienvenida-destino');
  expect((await forma(page, '#bienvenida')).crudo, 'la bienvenida no cambia').toBe(18);
  await captura(page, '1-bienvenida');
  await cerrarBienvenida(page);
  await zoom(page);
  await captura(page, '2-inicio');
  // z4: con ruta elegida y menú cerrado, el zoom queda arriba del chip.
  await elegirRuta(page, PRIMERA);
  await page.keyboard.press('Escape');
  await expect(page.locator('#hoja')).toHaveClass(/cerrada/);
  const chip = await page.locator('#chip-ruta').boundingBox();
  const control = await page.locator('.leaflet-control-zoom').boundingBox();
  expect(control.y + control.height, 'el zoom se encima con el chip').toBeLessThanOrEqual(chip.y);
  await esPildora(page, '#chip-ruta');
  await esPildora(page, '#chip-ruta .placa');
  await captura(page, '3-ruta');
});

test('k1–k3 (390 px): píldoras en el detalle, las tarjetas y «Calcula tu ruta»', async ({ page }) => {
  await cerrarBienvenida(page);
  await page.locator('#boton-menu').click();
  await esCirculo(page, '.hoja-cabeza .logo');
  await esPildora(page, '#tarjetas .tarjeta-ruta.partida .insignia');
  await tarjetasSuaves(page, 70);
  await captura(page, '4-tarjetas');
  await elegirRuta(page, PRIMERA);
  await esPildora(page, '#encabezado-ruta');
  await esPildora(page, '#encabezado-ruta .camion');
  await esPildora(page, '.detalle .etiqueta');
  expect((await forma(page, '.detalle')).crudo, 'el bloque del detalle no cambia').toBe(16);
  await captura(page, '5-detalle');
  // «Calcula tu ruta»: lugar guardado, parada más cercana y botón de volver a buscar.
  await page.keyboard.press('Escape'); // en teléfono el menú abierto tapa la barra
  await page.locator('#boton-destino').click();
  await page.locator('#destino').fill('Hospital General');
  await esPildora(page, '#lista-lugares .resultado');
  await page.locator('#lista-lugares .resultado').first().click();
  expect((await forma(page, '.rejilla.cerca .tarjeta-ruta')).crudo, 'las tarjetas de «cerca» no cambian').toBe(10);
  await page.locator('#usar-ubicacion').click();
  await expect(page.locator('#ver-parada')).toBeVisible();
  await esPildora(page, '#ver-parada');
  await esCirculo(page, '#otra-vez');
  const otra = await page.locator('#otra-vez').boundingBox();
  expect(otra.width, 'botón de volver a buscar de al menos 44 px').toBeGreaterThanOrEqual(44);
  await captura(page, '6-ubicado');
});

// z4 en el peor caso (falla vista en GitHub Actions, 21 nov 2026: con otra fuente el
// chip crece un renglón y el zoom se le enciman 7 px). Teléfono angosto (320 px) y la
// ruta de nombre más largo: el chip crece y el zoom debe subir con él.
test.describe('teléfono angosto 320 × 568', () => {
  test.use({ viewport: { width: 320, height: 568 } });

  test('z4: con la ruta de nombre más largo, el zoom no se encima con el chip', async ({ page }) => {
    const larga = [...rutas].sort((a, b) => b.nombre.length - a.nombre.length)[0];
    await cerrarBienvenida(page);
    await elegirRuta(page, larga.route_id);
    await page.keyboard.press('Escape');
    await expect(page.locator('#hoja')).toHaveClass(/cerrada/);
    const chip = await page.locator('#chip-ruta').boundingBox();
    const control = await page.locator('.leaflet-control-zoom').boundingBox();
    expect(control.y + control.height, 'el zoom se encima con el chip').toBeLessThanOrEqual(chip.y);
  });
});

test.describe('computadora 1280 × 800', () => {
  test.use({ viewport: { width: 1280, height: 800 }, isMobile: false, hasTouch: false });

  test('z1–z3 y k2: zoom en píldora y tarjetas en esquina suave de 60 px de alto', async ({ page }) => {
    await cerrarBienvenida(page);
    await zoom(page);
    await captura(page, '2-inicio');
    await page.locator('#boton-menu').click();
    await tarjetasSuaves(page, 60);
    await captura(page, '4-tarjetas');
    await elegirRuta(page, PRIMERA);
    await esPildora(page, '#encabezado-ruta');
    await captura(page, '5-detalle');
  });
});
