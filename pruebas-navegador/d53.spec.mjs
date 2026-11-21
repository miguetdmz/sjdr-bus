// D-53: criterios de aceptación de la construcción (docs/evidencia/d53/criterios.md),
// escritos antes de construir, contra la maqueta aprobada (docs/maquetas/d53/).
// Cada prueba revisa la regla, no el dato del día (lección 11).
//
// Con CAPTURAS=1 deja cargar las teselas y guarda las 6 pantallas de la maqueta,
// a 390 y 1280 px, en docs/evidencia/d53/ con los mismos nombres, para
// compararlas una a una (lección 3).
import { test, expect } from '@playwright/test';
import { abrirMenu, elegirRuta, leerDatos, sentido, sinTapar } from './ayuda.mjs';

const CAPTURAS = process.env.CAPTURAS === '1';
const { rutas } = leerDatos('rutas.json');
const { paradas } = leerDatos('paradas.json');
const PRIMARIO = 'rgb(13, 122, 114)';
// Ubicación de PRUEBA (no es la de nadie): Plaza Independencia, HANDOFF §11.3.
const PLAZA = { latitude: 20.38883, longitude: -99.99639 };
const OSM_COPYRIGHT = '#pie a[href="https://www.openstreetmap.org/copyright"]';

const distancia = (a, b) => {
  const R = 6371000;
  const rad = Math.PI / 180;
  const h = Math.sin(((b.lat - a.lat) * rad) / 2) ** 2 + Math.cos(a.lat * rad) * Math.cos(b.lat * rad) * Math.sin(((b.lon - a.lon) * rad) / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
};
// Las capturas van al doble de resolución, como las de la maqueta.
if (CAPTURAS) test.use({ deviceScaleFactor: 2 });

const metros = (t) => (t === 'ahí' ? 0 : t.endsWith(' km') ? parseFloat(t.slice(2)) * 1000 : parseFloat(t.slice(2)));

async function captura(page, nombre) {
  if (!CAPTURAS) return;
  await page.waitForTimeout(1500);
  // Sin el anillo de foco del teclado, para compararla con la maqueta.
  await page.evaluate(() => document.activeElement?.blur());
  const ancho = page.viewportSize().width;
  await page.screenshot({ path: `docs/evidencia/d53/${nombre}-${ancho}.jpg`, type: 'jpeg', quality: 82 });
}

// Peticiones de red que no son teselas del mapa.
function vigilarRed(page) {
  const vistas = [];
  page.on('request', (r) => {
    if (!/tile\.openstreetmap\.org/.test(r.url())) vistas.push(r.url());
  });
  return vistas;
}

// Defecto encontrado en la revisión (20 nov 2026): con la ubicación puesta, elegir
// un destino dejaba el mapa en tu ubicación y la zona del destino fuera de la vista.
async function destinoEnVista(page) {
  // Se espera a que el mapa quede quieto (encuadre a los 330 ms + animación):
  // el defecto aparecía después, cuando un encuadre viejo movía el mapa.
  await page.waitForTimeout(1500);
  await expect(async () => {
    const e = await page.locator('.punto-zona.zona-destino').boundingBox();
    const m = await page.locator('#mapa').boundingBox();
    expect(e, 'etiqueta del destino').not.toBeNull();
    // El centro de la etiqueta es el punto del destino (la etiqueta puede
    // sobresalir del borde, como en la maqueta del teléfono).
    const cx = e.x + e.width / 2;
    const cy = e.y + e.height / 2;
    expect(cx >= m.x && cx <= m.x + m.width && cy >= m.y && cy <= m.y + m.height, 'el destino queda dentro del mapa').toBe(true);
    const yo = await page.locator('.yo').boundingBox();
    expect(yo.x >= m.x && yo.x <= m.x + m.width && yo.y >= m.y && yo.y <= m.y + m.height, 'tu punto queda dentro del mapa').toBe(true);
  }).toPass({ timeout: 1000 });
}

test.beforeEach(async ({ page }) => {
  if (!CAPTURAS) await page.route(/tile\.openstreetmap\.org/, (r) => r.abort());
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('#tarjetas .tarjeta-ruta')).toHaveCount(rutas.length);
});

// ── (a) ──────────────────────────────────────────────────────────────────────
test('a1: no hay desplegable en la app', async ({ page }) => {
  await expect(page.locator('select')).toHaveCount(0);
  await elegirRuta(page, 'U-001');
  await expect(page.locator('select')).toHaveCount(0);
});

test('a2: menú cerrado = mapa completo; arriba solo ☰, «¿A dónde quieres ir?» y paradas', async ({ page }) => {
  const alto = page.viewportSize().height;
  await expect(page.locator('#hoja')).toHaveClass(/cerrada/);
  await expect(page.locator('#hoja')).toBeHidden();
  for (const sel of ['#velo', '#chip-ruta', '#aviso-paradas']) await expect(page.locator(sel), sel).toBeHidden();
  const botones = await page.locator('#barra button').evaluateAll((bs) => bs.filter((b) => b.offsetParent).map((b) => b.id));
  expect(botones).toEqual(['boton-menu', 'boton-destino', 'boton-paradas']);
  await expect(page.locator('#boton-destino')).toHaveText('¿A dónde quieres ir?');
  const barra = await page.locator('#barra').boundingBox();
  expect(barra.y + barra.height).toBeLessThan(alto / 5);
  expect(await page.evaluate(() => document.documentElement.scrollHeight > window.innerHeight)).toBe(false);
  await captura(page, '1-inicio');
});

test('a3: Ida / Vuelta solo dentro del detalle, en el menú', async ({ page }) => {
  expect(await page.locator('input[name="sentido"]').evaluateAll((is) => is.every((i) => i.closest('#hoja #detalle')))).toBe(true);
  await elegirRuta(page, 'U-001');
  await expect(page.locator('#detalle #sentido')).toBeVisible();
});

test('a4: pestañas arriba del cuerpo del menú, de al menos 44 px', async ({ page }) => {
  await abrirMenu(page);
  const pest = await page.locator('#pestanas').boundingBox();
  const cuerpo = await page.locator('#cuerpo').boundingBox();
  expect(pest.y + pest.height).toBeLessThanOrEqual(cuerpo.y + 1);
  for (const sel of ['#pestana-rutas', '#pestana-calcula']) {
    const c = await page.locator(sel).boundingBox();
    expect(Math.min(c.width, c.height), sel).toBeGreaterThanOrEqual(44);
  }
});

test('a5: tarjeta → detalle; al cerrar, aviso de la ruta con insignia y «Ver detalle»; zonas sin línea', async ({ page }) => {
  const r = rutas.find((x) => x.route_id === 'U-001');
  // Para la captura, las 3 recientes de la maqueta.
  await page.evaluate(() => localStorage.setItem('sjdrbus.recientes', JSON.stringify(['U-001', 'U-012', 'I-062'])));
  await page.reload();
  await abrirMenu(page);
  await captura(page, '2-menu');
  await elegirRuta(page, r.route_id);
  await expect(page.locator('#detalle')).toBeVisible();
  await captura(page, '3-detalle');
  await page.keyboard.press('Escape');
  const chip = page.locator('#chip-ruta');
  await expect(chip).toBeVisible();
  await expect(chip.locator('.camion')).toHaveText('R1');
  await expect(chip).toContainText(r.nombre);
  await expect(page.locator('.leaflet-zonas-pane path.zona')).toHaveCount(2);
  await expect(page.locator('.leaflet-overlay-pane path')).toHaveCount(0);
  await captura(page, '4-ruta');
  await page.locator('#ver-detalle').click();
  await expect(page.locator('#detalle')).toBeVisible();
});

// ── (b) ──────────────────────────────────────────────────────────────────────
test('b1–b4: paradas ocultas; el botón muestra círculos con camión y guía, con aviso; ninguna línea', async ({ page }) => {
  const boton = page.locator('#boton-paradas');
  const caja = await boton.boundingBox();
  expect(Math.min(caja.width, caja.height)).toBeGreaterThanOrEqual(44);
  await expect(boton).toHaveAttribute('aria-pressed', 'false');
  await expect(page.locator('.parada-toque')).toHaveCount(0);
  await boton.click();
  await expect(boton).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('.parada-toque')).toHaveCount(paradas.length);
  // Círculo levantado con camión (rect) y guía de puntitos (line con guiones).
  const forma = await page.locator('.parada-toque svg').first().evaluate((s) => ({
    circulos: s.querySelectorAll('circle').length,
    guia: s.querySelector('line')?.getAttribute('stroke-dasharray'),
    camion: s.querySelectorAll('rect').length,
  }));
  expect(forma.circulos).toBeGreaterThanOrEqual(2);
  expect(forma.guia).toBeTruthy();
  expect(forma.camion).toBeGreaterThanOrEqual(2);
  await expect(page.locator('#aviso-paradas')).toHaveText(`${paradas.length} paradas de OpenStreetMap · por verificar en campo`);
  await expect(page.locator('.leaflet-overlay-pane path')).toHaveCount(0);
  await captura(page, '5-paradas');
  await page.locator('.parada-toque').first().evaluate((e) => e.click());
  await expect(page.locator('.ficha-parada')).toContainText('POR VERIFICAR EN CAMPO');
  await expect(page.locator('.ficha-parada')).toContainText('Fuente: OpenStreetMap');
  await boton.click();
  await expect(page.locator('.parada-toque')).toHaveCount(0);
  await expect(page.locator('#aviso-paradas')).toBeHidden();
});

// ── (c) ──────────────────────────────────────────────────────────────────────
test('c1: «Ruta 001» nunca en pantalla ni en lo que lee el lector, con ninguna ruta ni sentido', async ({ page }) => {
  const revisar = async () => {
    const t = await page.evaluate(() => [document.body.innerText, ...[...document.querySelectorAll('[aria-label]')].map((e) => e.getAttribute('aria-label'))].join('\n'));
    expect(t).not.toMatch(/Ruta\s+\d{3}/);
  };
  await abrirMenu(page);
  await revisar();
  for (const r of rutas) {
    await elegirRuta(page, r.route_id);
    for (const i of [0, 1]) {
      await sentido(page, i);
      await revisar();
    }
  }
});

test('c4 y c5: insignia del aviso más grande que la de la tarjeta; mismo color tarjeta y detalle', async ({ page }) => {
  await elegirRuta(page, 'U-001');
  const tam = (sel) => page.locator(sel).first().evaluate((e) => parseFloat(getComputedStyle(e).fontSize));
  const colorTarjeta = await page.locator('#tarjetas .tarjeta-ruta[data-ruta="U-001"]').evaluate((t) => getComputedStyle(t).backgroundColor);
  expect(await page.locator('#encabezado-ruta').evaluate((t) => getComputedStyle(t).backgroundColor)).toBe(colorTarjeta);
  await page.keyboard.press('Escape');
  expect(await page.locator('#chip-ruta .placa').evaluate((t) => getComputedStyle(t).backgroundColor)).toBe(colorTarjeta);
  expect(await tam('#chip-ruta .camion')).toBeGreaterThan(await tam('#tarjetas .tarjeta-ruta .camion'));
});

// ── (d) ──────────────────────────────────────────────────────────────────────
test('d1–d4: un solo pie legal, verde, chico y sin fondo; avisos discretos; «estimado» en minúscula', async ({ page }) => {
  const pie = page.locator('#pie');
  for (const t of ['Iniciativa ciudadana independiente', 'no oficial', 'datos en proceso de validación', 'Leaflet', 'colaboradores de OpenStreetMap']) {
    await expect(pie).toContainText(t);
  }
  await expect(pie.locator('a[href="https://leafletjs.com"]')).toHaveCount(1);
  await expect(page.locator(OSM_COPYRIGHT)).toHaveCount(1);
  await expect(page.locator('.leaflet-control-attribution')).toHaveCount(0);
  const estilo = await pie.evaluate((p) => ({ c: getComputedStyle(p).color, f: getComputedStyle(p).backgroundColor, t: parseFloat(getComputedStyle(p).fontSize) }));
  expect(estilo.c).toBe(PRIMARIO);
  expect(estilo.f).toBe('rgba(0, 0, 0, 0)');
  expect(estilo.t).toBeLessThanOrEqual(10);
  // d2: el pie no lo tapa nada, con el menú cerrado y abierto.
  expect(await sinTapar(page, OSM_COPYRIGHT)).toBe(true);
  await abrirMenu(page);
  expect(await sinTapar(page, OSM_COPYRIGHT)).toBe(true);
  await page.keyboard.press('Escape');
  // d3: aviso de paradas sin recuadro, verde y chico.
  await page.locator('#boton-paradas').click();
  const aviso = await page.locator('#aviso-paradas').evaluate((p) => ({ c: getComputedStyle(p).color, f: getComputedStyle(p).backgroundColor, t: parseFloat(getComputedStyle(p).fontSize) }));
  expect(aviso).toEqual({ c: PRIMARIO, f: 'rgba(0, 0, 0, 0)', t: aviso.t });
  expect(aviso.t).toBeLessThanOrEqual(11);
  // d4: «estimado» en minúscula en el aviso de ruta y en las leyendas.
  await elegirRuta(page, 'U-001');
  await page.keyboard.press('Escape');
  await expect(page.locator('#chip-ruta small')).toContainText('(estimado)');
  await expect(page.locator('#leyendas-destino')).toContainText(/^estimado ·/);
  expect(await page.locator('body').innerText()).not.toContain('ESTIMADO');
});

// ── (e) ──────────────────────────────────────────────────────────────────────
test('e1–e4: «¿A dónde quieres ir?» busca en el catálogo guardado, sin red, y lista rutas a ≤ 1 km', async ({ page }) => {
  const red = vigilarRed(page);
  await page.locator('#boton-destino').click();
  await expect(page.locator('#hoja')).not.toHaveClass(/cerrada/);
  await expect(page.locator('#modo-calcula')).toBeVisible();
  await expect(page.locator('#destino')).toBeFocused();
  const lugar = rutas.find((r) => !r.extremos.destino.faltante).extremos.destino;
  await page.locator('#destino').pressSequentially(lugar.lugar.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''));
  const resultado = page.locator('#lista-lugares .resultado').filter({ hasText: lugar.lugar }).first();
  await expect(resultado).toBeVisible();
  await resultado.click();
  await expect(resultado).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('.leaflet-zonas-pane path.zona-destino')).toHaveCount(1);
  // e3: tarjetas del mismo alto, de la más cercana a la más lejana, ≤ 1 km cada una.
  const cerca = page.locator('#lista-cerca .tarjeta-ruta');
  expect(await cerca.count()).toBeGreaterThan(0);
  const altos = await cerca.evaluateAll((ts) => ts.map((t) => Math.round(t.getBoundingClientRect().height)));
  expect(new Set(altos).size).toBe(1);
  const dist = (await cerca.locator('.dist').allTextContents()).map(metros);
  expect([...dist].sort((a, b) => a - b)).toEqual(dist);
  for (const d of dist) expect(d).toBeLessThanOrEqual(1000);
  // e4: toda ruta a ≤ 1 km del lugar está en la lista (regla, no conteo).
  const esperadas = rutas.filter((r) => [r.extremos.origen, r.extremos.destino].some((z) => z.lat != null && distancia(lugar, z) <= 1000)).map((r) => r.route_id);
  expect((await cerca.evaluateAll((ts) => ts.map((t) => t.dataset.ruta))).sort()).toEqual(esperadas.sort());
  // e2: ninguna petición de red al buscar ni al elegir (solo teselas del mapa).
  expect(red).toEqual([]);
  // Sin resultados: lo dice, sin inventar.
  await page.locator('#destino').fill('zzzz');
  await expect(page.locator('#lista-lugares')).toContainText('No está entre los lugares guardados');
  // Tocar una ruta cercana la abre.
  await page.locator('#destino').fill(lugar.lugar);
  await page.locator('#lista-lugares .resultado').first().click();
  const primera = await cerca.first().getAttribute('data-ruta');
  await cerca.first().click();
  await expect(page.locator('#modo-rutas')).toBeVisible();
  await expect(page.locator('#encabezado-ruta')).toContainText(rutas.find((r) => r.route_id === primera).nombre);
  await expect(page.locator('.leaflet-zonas-pane path.zona-destino')).toHaveCount(0);
});

test.describe('con ubicación de PRUEBA (Plaza Independencia)', () => {
  test.use({ geolocation: PLAZA, permissions: ['geolocation'] });

  test('e5 y e7: parada de OSM más cercana en línea recta, sin red; leyendas juntas al fondo', async ({ page }) => {
    const red = vigilarRed(page);
    await page.locator('#boton-destino').click();
    // e7: con poco contenido, las leyendas quedan al fondo del menú.
    const ley = await page.locator('#leyendas-destino').boundingBox();
    const cuerpo = await page.locator('#cuerpo').boundingBox();
    expect(ley.y + ley.height).toBeGreaterThanOrEqual(cuerpo.y + cuerpo.height - 2);
    await page.locator('#usar-ubicacion').click();
    const nota = page.locator('#nota-ubicacion');
    await expect(nota).toContainText('en línea recta');
    const yo = { lat: PLAZA.latitude, lon: PLAZA.longitude };
    const m = Math.min(...paradas.map((p) => distancia(yo, p)));
    await expect(nota).toContainText(m < 50 ? 'queda ahí' : m < 1000 ? `a ${Math.round(m / 10) * 10} m` : `a ${(m / 1000).toFixed(1)} km`);
    await expect(nota).toContainText('por verificar en campo');
    await expect(nota).toContainText('Tu ubicación no sale del teléfono');
    await expect(page.locator('.yo')).toHaveCount(1);
    await expect(page.locator('.parada-toque')).toHaveCount(1);
    expect(red).toEqual([]);
    // Captura como la maqueta: «Hospital General» elegido, con la ubicación de prueba.
    await page.locator('#destino').fill('Hospital General');
    const hg = page.locator('#lista-lugares .resultado').first();
    if (await hg.count()) {
      await hg.click();
      await destinoEnVista(page);
    }
    await captura(page, '6-destino');
  });
});

test('e6: sin permiso de ubicación, la app lo dice y sigue funcionando', async ({ page, context }) => {
  await context.clearPermissions();
  await page.locator('#boton-destino').click();
  await page.locator('#usar-ubicacion').click();
  await expect(page.locator('#nota-ubicacion')).toContainText(/permiso|ubicación/);
  await expect(page.locator('#usar-ubicacion')).toBeEnabled();
  await page.locator('#pestana-rutas').click();
  await page.locator('#tarjetas .tarjeta-ruta').first().click();
  await expect(page.locator('#detalle')).toBeVisible();
});

// ── Computadora: mismas reglas a 1280 y capturas de la maqueta ───────────────
test.describe('computadora 1280 × 800', () => {
  test.use({ viewport: { width: 1280, height: 800 }, isMobile: false, hasTouch: false, geolocation: PLAZA, permissions: ['geolocation'] });

  test('a4, a6 y d2 en computadora; capturas de las 6 pantallas', async ({ page }) => {
    await captura(page, '1-inicio');
    await page.evaluate(() => localStorage.setItem('sjdrbus.recientes', JSON.stringify(['U-001', 'U-012', 'I-062'])));
    await page.reload();
    await abrirMenu(page);
    const pest = await page.locator('#pestanas').boundingBox();
    const cuerpo = await page.locator('#cuerpo').boundingBox();
    expect(pest.y + pest.height).toBeLessThanOrEqual(cuerpo.y + 1);
    await expect(async () => {
      const hoja = await page.locator('#hoja').boundingBox();
      const mapa = await page.locator('#mapa').boundingBox();
      expect(mapa.x).toBeGreaterThanOrEqual(hoja.x + hoja.width - 1);
    }).toPass();
    expect(await sinTapar(page, OSM_COPYRIGHT)).toBe(true);
    await captura(page, '2-menu');
    await elegirRuta(page, 'U-001');
    await captura(page, '3-detalle');
    await page.locator('#boton-menu').click();
    await expect(page.locator('#chip-ruta')).toBeVisible();
    await captura(page, '4-ruta');
    await page.locator('#cambiar-ruta').evaluate((b) => b.click());
    await page.locator('#boton-paradas').click();
    await expect(page.locator('#aviso-paradas')).toBeVisible();
    await captura(page, '5-paradas');
    await page.locator('#boton-paradas').click();
    await page.locator('#boton-destino').click();
    await page.locator('#usar-ubicacion').click();
    await expect(page.locator('#nota-ubicacion')).toContainText('en línea recta');
    await page.locator('#destino').fill('Hospital General');
    const hg = page.locator('#lista-lugares .resultado').first();
    if (await hg.count()) {
      await hg.click();
      await destinoEnVista(page);
    }
    await captura(page, '6-destino');
  });
});
