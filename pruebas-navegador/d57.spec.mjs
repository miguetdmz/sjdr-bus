// D-57: criterios de aceptación (docs/evidencia/d57/criterios.md), escritos antes
// de construir, contra la maqueta aprobada (docs/maquetas/d57/). Revisa la regla,
// no el dato del día (lección 11): la parada esperada se calcula de paradas.json.
//
// Con CAPTURAS=1 deja cargar las teselas y guarda las 3 pantallas de la maqueta
// (antes, ubicado y al tocar la parada), a 390 y 1280 px, en docs/evidencia/d57/.
import { test, expect } from '@playwright/test';
import { leerDatos } from './ayuda.mjs';

const CAPTURAS = process.env.CAPTURAS === '1';
const { paradas } = leerDatos('paradas.json');
// Ubicación de PRUEBA (no es la de nadie): Plaza Independencia, HANDOFF §11.3.
const PLAZA = { latitude: 20.38883, longitude: -99.99639 };
if (CAPTURAS) test.use({ deviceScaleFactor: 2 });
test.use({ geolocation: PLAZA, permissions: ['geolocation'] });

const distancia = (a, b) => {
  const R = 6371000;
  const rad = Math.PI / 180;
  const h = Math.sin(((b.lat - a.lat) * rad) / 2) ** 2 + Math.cos(a.lat * rad) * Math.cos(b.lat * rad) * Math.sin(((b.lon - a.lon) * rad) / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
};
const texto = (m) => (m < 50 ? 'ahí' : m < 1000 ? `a ${Math.round(m / 10) * 10} m` : `a ${(m / 1000).toFixed(1)} km`);
function masCercana(yo) {
  const [p] = paradas.map((x) => ({ x, d: distancia(yo, x) })).sort((a, b) => a.d - b.d);
  return { nombre: p.x.nombre ?? 'Parada sin nombre', distancia: texto(p.d) };
}

async function captura(page, nombre) {
  if (!CAPTURAS) return;
  await page.waitForTimeout(1500);
  await page.evaluate(() => document.activeElement?.blur());
  await page.screenshot({ path: `docs/evidencia/d57/${nombre}-${page.viewportSize().width}.jpg`, type: 'jpeg', quality: 82 });
}

function vigilarRed(page) {
  const vistas = [];
  page.on('request', (r) => {
    if (!/tile\.openstreetmap\.org/.test(r.url())) vistas.push(r.url());
  });
  return vistas;
}

test.beforeEach(async ({ page }) => {
  if (!CAPTURAS) await page.route(/tile\.openstreetmap\.org/, (r) => r.abort());
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
});

// Abre «Calcula tu ruta» y elige «Hospital General», como la maqueta.
async function conDestino(page) {
  await page.locator('#boton-destino').click();
  await page.locator('#destino').fill('Hospital General');
  const r = page.locator('#lista-lugares .resultado').first();
  if (await r.count()) await r.click();
}

// ¿El elemento se ve entero dentro del cuerpo del menú, sin hacer scroll?
async function aLaVista(page, sel) {
  return page.evaluate((s) => {
    const c = document.querySelector('#cuerpo');
    const caja = c.getBoundingClientRect();
    const r = document.querySelector(s).getBoundingClientRect();
    return c.scrollTop === 0 && r.top >= caja.top - 1 && r.bottom <= caja.bottom + 1 && r.height > 0;
  }, sel);
}

async function antes(page) {
  await conDestino(page);
  // p1: arriba de «¿A dónde quieres ir?» y a la vista sin scroll, con el lugar elegido.
  const boton = await page.locator('#usar-ubicacion').boundingBox();
  const campo = await page.locator('.campo:has(#destino)').boundingBox();
  expect(boton.y + boton.height).toBeLessThanOrEqual(campo.y);
  expect(await aLaVista(page, '#usar-ubicacion')).toBe(true);
  // p2: un solo botón, ≥ 44 px, sin el título ni el texto de antes.
  await expect(page.locator('#usar-ubicacion')).toHaveText('Buscar mi parada más cercana');
  expect(boton.height).toBeGreaterThanOrEqual(44);
  await expect(page.locator('#modo-calcula')).not.toContainText('Usar mi ubicación');
  await expect(page.locator('#modo-calcula h3', { hasText: 'Tu parada más cercana' })).toHaveCount(0);
  await expect(page.locator('#parada-hallada')).toBeHidden();
  await captura(page, '1-antes');
}

async function ubicado(page) {
  const red = vigilarRed(page);
  await page.locator('#usar-ubicacion').click();
  const linea = page.locator('#ver-parada');
  await expect(linea).toBeVisible();
  // p3: nombre y distancia de la parada más cercana de paradas.json, y la línea corta.
  const esperada = masCercana({ lat: PLAZA.latitude, lon: PLAZA.longitude });
  await expect(linea.locator('b')).toHaveText(`${esperada.nombre} · ${esperada.distancia}`);
  await expect(linea.locator('small')).toHaveText('Tu parada más cercana · en línea recta · por verificar');
  await expect(page.locator('#usar-ubicacion')).toBeHidden();
  const otra = page.locator('#otra-vez');
  await expect(otra).toHaveAttribute('aria-label', /buscar/);
  expect((await otra.innerText()).trim()).toBe('');
  for (const sel of ['#ver-parada', '#otra-vez']) {
    const c = await page.locator(sel).boundingBox();
    expect(Math.min(c.width, c.height), sel).toBeGreaterThanOrEqual(44);
  }
  expect(await aLaVista(page, '#parada-hallada')).toBe(true);
  // p4: sin la nota larga; las leyendas dicen que la ubicación no sale; sin red.
  await expect(page.locator('#modo-calcula')).not.toContainText('se marca en el mapa');
  await expect(page.locator('#leyendas-destino')).toContainText('Tu ubicación no sale del teléfono.');
  await expect(page.locator('#nota-ubicacion')).toBeHidden();
  expect(red).toEqual([]);
  await captura(page, '2-ubicado');
}

// La ficha abierta es la de la parada y su marcador queda dentro del mapa visible.
// D-56 fase 2: el destino trae su propia parada (.parada-destino) y hay un segundo
// campo («¿Desde dónde sales?»); aquí se mide tu parada y el campo del destino.
async function fichaEnMapa(page) {
  const ficha = page.locator('.leaflet-popup .ficha-parada');
  await expect(ficha).toBeVisible();
  await expect(ficha).toContainText('Fuente: OpenStreetMap');
  await expect(ficha).toContainText('POR VERIFICAR EN CAMPO');
  // Defecto visto en las capturas (20 nov 2026): un encuadre pendiente de «ubicarte»
  // llegaba después y alejaba el mapa, con la ficha cortada. Se espera a que pase
  // ese tiempo y la ficha debe seguir entera dentro del mapa visible, de cerca.
  await page.waitForTimeout(900);
  await expect(ficha).toBeVisible();
  const f = await page.locator('.leaflet-popup').boundingBox();
  const mv = await page.locator('#mapa').boundingBox();
  const hv = await page.locator('#hoja').boundingBox();
  const izqV = (await page.locator('#hoja').getAttribute('class')).includes('cerrada') ? mv.x : hv.x + hv.width;
  expect(f.x, 'ficha cortada a la izquierda').toBeGreaterThanOrEqual(izqV);
  expect(f.x + f.width, 'ficha cortada a la derecha').toBeLessThanOrEqual(mv.x + mv.width);
  // De cerca (zoom 17 o más): metros por pixel entre tú y la parada, ≤ 1.2
  // (a zoom 17 y esta latitud son ~1.12; a zoom de ciudad, 9 o más).
  const yo = await page.locator('.yo').boundingBox();
  const pa = await page.locator('.parada-toque:not(.parada-destino)').first().boundingBox();
  const px = Math.hypot(yo.x + yo.width / 2 - (pa.x + pa.width / 2), yo.y + yo.height / 2 - (pa.y + pa.height - 2.5));
  const cerca = paradas.map((x) => distancia({ lat: PLAZA.latitude, lon: PLAZA.longitude }, x)).sort((m, n) => m - n)[0];
  expect(cerca / px, 'metros por pixel').toBeLessThanOrEqual(1.2);
  await expect(async () => {
    const m = await page.locator('.parada-toque:not(.parada-destino)').first().boundingBox();
    const mapa = await page.locator('#mapa').boundingBox();
    const hoja = await page.locator('#hoja').boundingBox();
    const abierta = !(await page.locator('#hoja').getAttribute('class')).includes('cerrada');
    const izq = abierta ? hoja.x + hoja.width : mapa.x;
    expect(m.x).toBeGreaterThanOrEqual(izq);
    expect(m.x + m.width).toBeLessThanOrEqual(mapa.x + mapa.width);
    expect(m.y).toBeGreaterThanOrEqual(mapa.y);
    expect(m.y + m.height).toBeLessThanOrEqual(mapa.y + mapa.height);
  }).toPass();
}

test('p1–p4 (390 px): la parada más cercana arriba, un botón; ubicado, una línea y un botón de ícono', async ({ page }) => {
  await antes(page);
  await ubicado(page);
});

test('p5: el botón de ícono vuelve a leer la ubicación y actualiza la línea', async ({ page, context }) => {
  await conDestino(page);
  await page.locator('#usar-ubicacion').click();
  await expect(page.locator('#ver-parada')).toBeVisible();
  // Otra ubicación de PRUEBA: el punto exacto de la parada más lejana de la plaza.
  const yo = { lat: PLAZA.latitude, lon: PLAZA.longitude };
  const lejos = [...paradas].sort((a, b) => distancia(yo, b) - distancia(yo, a))[0];
  await context.setGeolocation({ latitude: lejos.lat, longitude: lejos.lon });
  await page.locator('#otra-vez').click();
  const esperada = masCercana({ lat: lejos.lat, lon: lejos.lon });
  await expect(page.locator('#ver-parada b')).toHaveText(`${esperada.nombre} · ${esperada.distancia}`);
});

test('p6 (390 px): tocar la parada cierra el menú, centra el mapa en ella y abre su ficha', async ({ page }) => {
  await conDestino(page);
  await page.locator('#usar-ubicacion').click();
  await page.locator('#ver-parada').click();
  await expect(page.locator('#hoja')).toHaveClass(/cerrada/);
  await fichaEnMapa(page);
  await captura(page, '3-parada-mapa');
});

test('p8: sin permiso, el aviso sale junto al botón y la app sigue', async ({ page, context }) => {
  await context.clearPermissions();
  await page.locator('#boton-destino').click();
  await page.locator('#usar-ubicacion').click();
  const nota = page.locator('#mi-parada #nota-ubicacion');
  await expect(nota).toContainText('permiso');
  const n = await nota.boundingBox();
  const campo = await page.locator('.campo:has(#destino)').boundingBox();
  expect(n.y + n.height).toBeLessThanOrEqual(campo.y);
  await expect(page.locator('#usar-ubicacion')).toBeEnabled();
});

test.describe('computadora 1280 × 800', () => {
  test.use({ viewport: { width: 1280, height: 800 }, isMobile: false, hasTouch: false });

  test('p1–p4 y p7: mismas reglas; al tocar la parada el menú se queda y el mapa la muestra con su ficha', async ({ page }) => {
    await antes(page);
    await ubicado(page);
    await page.locator('#ver-parada').click();
    await expect(page.locator('#hoja')).not.toHaveClass(/cerrada/);
    await fichaEnMapa(page);
    await captura(page, '3-parada-mapa');
  });
});
