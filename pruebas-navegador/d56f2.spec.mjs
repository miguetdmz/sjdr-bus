// D-56 fase 2: criterios c3 a c11 de docs/evidencia/d56f2/criterios.md, escritos
// antes de construir, contra la maqueta aprobada (docs/maquetas/d56f2/). Revisa la
// regla, no el dato del día (lección 11): la parada esperada se calcula de
// paradas.json y los lugares salen de datos/cache/overpass/lugares-amplio.json.
// Las medidas se revisan a 390 y también a 320 px (lección 5).
//
// Con CAPTURAS=1 deja cargar las teselas y guarda las pantallas de la maqueta a 390,
// 320 y 1280 px en docs/evidencia/d56f2/.
import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { leerDatos } from './ayuda.mjs';

const CAPTURAS = process.env.CAPTURAS === '1';
const { paradas } = leerDatos('paradas.json');
const osm = JSON.parse(readFileSync(new URL('../datos/cache/overpass/lugares-amplio.json', import.meta.url), 'utf8'));
const lugar = (nombre) => {
  const l = osm.lugares.find((x) => x.nombre === nombre);
  if (!l) throw new Error(`${nombre} no está en lugares-amplio.json`);
  return { ...l, lat: l.centro[0], lon: l.centro[1] };
};
// Lugares de muestra de la maqueta (reales, de OSM). Ubicación de PRUEBA (no es la de
// nadie): Plaza Independencia, HANDOFF §11.3.
const DESTINO = lugar('IMSS Hospital General de Zona 3');
const SALIDA = lugar('Mercado 5 de mayo');
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
function masCercana(p) {
  const [c] = paradas.map((x) => ({ x, d: distancia(p, x) })).sort((a, b) => a.d - b.d);
  return `${c.x.nombre ?? 'Parada sin nombre'} · ${texto(c.d)}`;
}

const ANCHOS = [
  { width: 390, height: 844 },
  { width: 320, height: 640 },
];

async function captura(page, nombre) {
  if (!CAPTURAS) return;
  await page.waitForTimeout(1500);
  await page.evaluate(() => document.activeElement?.blur());
  await page.screenshot({ path: `docs/evidencia/d56f2/${nombre}-${page.viewportSize().width}x${page.viewportSize().height}.jpg`, type: 'jpeg', quality: 82 });
}

test.beforeEach(async ({ page }) => {
  if (!CAPTURAS) await page.route(/tile\.openstreetmap\.org/, (r) => r.abort());
  await page.emulateMedia({ reducedMotion: 'reduce' });
});

async function abrirCalcula(page) {
  await page.goto('/');
  await page.locator('#boton-destino').click();
  await expect(page.locator('#modo-calcula')).toBeVisible();
}

async function elegirDestino(page, nombre) {
  await page.locator('#destino').fill(nombre);
  await page.locator('#lista-lugares .resultado').filter({ hasText: nombre }).first().click();
}

// Centro vertical de cada elemento; todos en el mismo renglón (± 2 px).
async function mismoRenglon(page, selectores) {
  const cajas = await Promise.all(selectores.map((s) => page.locator(s).boundingBox()));
  const centros = cajas.map((c) => c.y + c.height / 2);
  for (const c of centros) expect(Math.abs(c - centros[0])).toBeLessThanOrEqual(2);
  return cajas;
}

// Nada se sale del menú ni hay scroll de lado.
async function cabe(page) {
  const r = await page.evaluate(() => {
    const cuerpo = document.querySelector('#cuerpo');
    const caja = cuerpo.getBoundingClientRect();
    const fuera = [...document.querySelectorAll('#modo-calcula button, #modo-calcula .campo')]
      .filter((e) => e.offsetParent && (e.getBoundingClientRect().right > caja.right + 1 || e.getBoundingClientRect().left < caja.left - 1))
      .map((e) => e.id || e.className);
    return { lado: document.documentElement.scrollWidth > window.innerWidth || cuerpo.scrollWidth > cuerpo.clientWidth, fuera };
  });
  expect(r.lado).toBe(false);
  expect(r.fuera).toEqual([]);
}

for (const tam of ANCHOS) {
  test.describe(`${tam.width} px`, () => {
    test.use({ viewport: tam });

    test('c5: antes de ubicarte, «Salgo de otro lugar» es un círculo de 52 px en el renglón de «Buscar mi parada»', async ({ page }) => {
      await abrirCalcula(page);
      const salgo = page.locator('#salgo-otro');
      await expect(salgo).toBeVisible();
      await expect(salgo).toHaveAttribute('aria-label', 'Salgo de otro lugar');
      await expect(salgo).toHaveText('');
      expect(await salgo.locator('svg').count()).toBe(1);
      const [, c] = await mismoRenglon(page, ['#usar-ubicacion', '#salgo-otro']);
      expect(Math.round(c.width)).toBe(52);
      expect(Math.round(c.height)).toBe(52);
      // De contorno (no relleno como el del GPS).
      const fondo = await salgo.evaluate((e) => getComputedStyle(e).backgroundColor);
      expect(fondo).not.toBe(await page.locator('#usar-ubicacion').evaluate((e) => getComputedStyle(e).backgroundColor));
      await cabe(page);
      await captura(page, 'inicio');
    });

    test('c5 y c6: ubicado, tu parada, el botón de ícono y el círculo en un renglón; texto chico debajo; nombre a 10.5 px', async ({ page }) => {
      await abrirCalcula(page);
      await page.locator('#usar-ubicacion').click();
      await expect(page.locator('#ver-parada')).toBeVisible();
      const cajas = await mismoRenglon(page, ['#ver-parada', '#otra-vez', '#salgo-otro']);
      expect(Math.round(cajas[1].width)).toBe(52);
      expect(Math.round(cajas[2].width)).toBe(52);
      const b = page.locator('#ver-parada b');
      await expect(b).toHaveText(masCercana({ lat: PLAZA.latitude, lon: PLAZA.longitude }));
      expect(await b.evaluate((e) => getComputedStyle(e).fontSize)).toBe('10.5px');
      await expect(page.locator('#ver-parada small')).toBeHidden();
      const nota = page.locator('#nota-parada');
      await expect(nota).toBeVisible();
      await expect(nota).toHaveText('Tu parada más cercana · en línea recta · por verificar');
      const n = await nota.boundingBox();
      expect(n.y).toBeGreaterThanOrEqual(cajas[0].y + cajas[0].height - 1);
      // Alto del renglón: 52 px a 390; hasta 80 px a 320 (medido en la maqueta: 52 a 76).
      const alto = Math.max(...cajas.map((c) => c.height));
      expect(alto).toBeLessThanOrEqual(tam.width >= 390 ? 53 : 80);
      await cabe(page);
      await captura(page, 'ubicado');
    });

    test('c5: «¿Desde dónde sales?» elige de la lista guardada; arriba dice «Sales de…» y su parada', async ({ page }) => {
      await abrirCalcula(page);
      await page.locator('#salgo-otro').click();
      await expect(page.locator('#elegir-salida')).toBeVisible();
      await expect(page.locator('#elegir-salida')).toContainText('¿Desde dónde sales?');
      // Mientras se elige la salida, «¿A dónde quieres ir?» no se ve.
      await expect(page.locator('#destino')).toBeHidden();
      await expect(page.locator('#salida-ubicacion')).toHaveText('Buscar mi parada más cercana');
      await page.locator('#salida').fill('merca');
      const filas = page.locator('#lista-salida .resultado');
      await expect(filas.filter({ hasText: SALIDA.nombre })).toHaveCount(1);
      await expect(filas.filter({ hasText: SALIDA.nombre })).toContainText(`${SALIDA.tipo} · OpenStreetMap`);
      await cabe(page);
      await captura(page, 'salida');
      // Cancelar vuelve como estaba.
      await page.locator('#cancelar-salida').click();
      await expect(page.locator('#elegir-salida')).toBeHidden();
      await expect(page.locator('#destino')).toBeVisible();
      await page.locator('#salgo-otro').click();
      await page.locator('#salida').fill('merca');
      await filas.filter({ hasText: SALIDA.nombre }).click();
      await expect(page.locator('#elegir-salida')).toBeHidden();
      await expect(page.locator('#sales-de')).toHaveText(`Sales de ${SALIDA.nombre}`);
      await expect(page.locator('#ver-parada b')).toHaveText(masCercana(SALIDA));
      await expect(page.locator('#nota-parada')).toHaveText('Cerca de tu salida · en línea recta · por verificar');
      await expect(page.locator('#otra-vez')).toHaveAttribute('aria-label', 'Usar mi ubicación');
      await mismoRenglon(page, ['#ver-parada', '#otra-vez', '#salgo-otro']);
      // En el mapa: «Sales de: …» y su parada; sin punto «Tú».
      await expect(page.locator('.pin-lugar', { hasText: `Sales de: ${SALIDA.nombre}` })).toHaveCount(1);
      await expect(page.locator('.punto-yo')).toHaveCount(0);
      await cabe(page);
    });

    test('c3 y c4: destino de OSM con tipo y fuente; parada más cercana al destino en terracota a 14 px', async ({ page }) => {
      await abrirCalcula(page);
      await page.locator('#destino').fill('imss');
      const filas = page.locator('#lista-lugares .resultado');
      await expect(filas.filter({ hasText: DESTINO.nombre })).toContainText('Hospital · OpenStreetMap');
      await expect(filas.filter({ hasText: 'Inicio o fin de ruta' })).not.toHaveCount(0);
      await captura(page, 'buscar');
      await filas.filter({ hasText: DESTINO.nombre }).click();
      // La fila elegida, y nada más, en «Lugares guardados» (como la maqueta).
      await expect(filas).toHaveCount(1);
      await expect(filas.first()).toHaveAttribute('aria-pressed', 'true');
      const linea = page.locator('#ver-parada-destino');
      await expect(linea).toBeVisible();
      await expect(linea).toHaveClass(/destino/);
      await expect(linea.locator('b')).toHaveText(masCercana(DESTINO));
      expect(await linea.locator('b').evaluate((e) => getComputedStyle(e).fontSize)).toBe('14px');
      await expect(linea.locator('small')).toHaveText('Parada más cercana a tu destino · en línea recta · por verificar');
      expect(await linea.evaluate((e) => getComputedStyle(e).boxShadow)).toContain('rgb(168, 67, 42)');
      // Va entre la fila elegida y las rutas cerca.
      const f = await filas.first().boundingBox();
      const l = await linea.boundingBox();
      const cerca = await page.locator('#bloque-cerca').boundingBox();
      expect(l.y).toBeGreaterThan(f.y);
      expect(cerca.y).toBeGreaterThan(l.y);
      // Mapa: punto con etiqueta «Destino: …» y sin ninguna línea (solo círculos).
      await expect(page.locator('.pin-lugar', { hasText: `Destino: ${DESTINO.nombre}` })).toHaveCount(1);
      const sinArco = await page.locator('.leaflet-overlay-pane path').evaluateAll((ps) => ps.filter((p) => !/a/i.test(p.getAttribute('d') ?? '')).length);
      expect(sinArco).toBe(0);
      await cabe(page);
      await captura(page, 'destino');
      // Tocarla: se cierra el menú, el mapa va a la parada y abre su ficha.
      await linea.click();
      await expect(page.locator('.leaflet-popup')).toBeVisible();
      await expect(page.locator('.leaflet-popup')).toContainText(masCercana(DESTINO).split(' · ')[0]);
      await expect(page.locator('#hoja')).toHaveClass(/cerrada/);
      await captura(page, 'mapa');
    });

    test('c7 y c8: salida y destino juntos; leyenda de lugares; búsqueda sin resultados', async ({ page }) => {
      const fuera = [];
      page.on('request', (r) => {
        const u = new URL(r.url());
        if (u.hostname !== 'localhost' && !/tile\.openstreetmap\.org/.test(u.hostname)) fuera.push(r.url());
      });
      await abrirCalcula(page);
      await expect(page.locator('#leyendas-destino')).toContainText('Lugares: OpenStreetMap, consulta del 22 nov 2026.');
      await expect(page.locator('#leyendas-destino')).toContainText('Tu ubicación no sale del teléfono.');
      await expect(page.locator('#leyendas-destino')).toContainText('Próximamente');
      await page.locator('#destino').fill('zzqqxx');
      await expect(page.locator('#lista-lugares')).toContainText('OpenStreetMap');
      await page.locator('#salgo-otro').click();
      await page.locator('#salida').fill(SALIDA.nombre);
      await page.locator('#lista-salida .resultado').filter({ hasText: SALIDA.nombre }).click();
      await elegirDestino(page, DESTINO.nombre);
      await expect(page.locator('.pin-lugar')).toHaveCount(2);
      await cabe(page);
      await captura(page, 'completo');
      expect(fuera).toEqual([]);
    });
  });
}

test.describe('1280 px', () => {
  test.use({ viewport: { width: 1280, height: 800 }, isMobile: false, hasTouch: false });

  test('c9: en computadora cabe todo y el menú se queda al tocar la parada del destino', async ({ page }) => {
    await abrirCalcula(page);
    await mismoRenglon(page, ['#usar-ubicacion', '#salgo-otro']);
    await cabe(page);
    await captura(page, 'inicio');
    await page.locator('#usar-ubicacion').click();
    await expect(page.locator('#ver-parada')).toBeVisible();
    await mismoRenglon(page, ['#ver-parada', '#otra-vez', '#salgo-otro']);
    await page.locator('#salgo-otro').click();
    await page.locator('#salida').fill('merca');
    await cabe(page);
    await captura(page, 'salida');
    await page.locator('#lista-salida .resultado').filter({ hasText: SALIDA.nombre }).click();
    await elegirDestino(page, DESTINO.nombre);
    await cabe(page);
    await captura(page, 'completo');
    await page.locator('#ver-parada-destino').click();
    await expect(page.locator('.leaflet-popup')).toBeVisible();
    await expect(page.locator('#hoja')).not.toHaveClass(/cerrada/);
    await captura(page, 'mapa');
  });
});
