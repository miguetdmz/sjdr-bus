// D-55: criterios de aceptación de la construcción (docs/evidencia/d55/criterios.md),
// escritos antes de construir, contra la maqueta terminada (docs/maquetas/d55/).
// Cada prueba revisa la regla, no el dato del día (lección 11): ningún conteo de
// tamaños de letra ni de tarjetas chicas.
//
// Con CAPTURAS=1 deja cargar las teselas y guarda las 2 pantallas de la maqueta
// (bienvenida y menú), a 390 y 1280 px y al doble de resolución, en
// docs/evidencia/d55/ con los mismos nombres, para compararlas una a una (lección 3).
import { test, expect } from '@playwright/test';
import { abrirMenu, leerDatos, sinTapar } from './ayuda.mjs';

const CAPTURAS = process.env.CAPTURAS === '1';
const { rutas } = leerDatos('rutas.json');
const OSM_COPYRIGHT = '#pie a[href="https://www.openstreetmap.org/copyright"]';
const RECIENTES = ['U-001', 'U-012', 'I-062']; // las mismas de la maqueta

// Desde cero: nada guardado en el navegador (sin la bienvenida ya vista).
test.use({ storageState: { cookies: [], origins: [] } });
if (CAPTURAS) test.use({ deviceScaleFactor: 2 });

async function captura(page, nombre) {
  if (!CAPTURAS) return;
  await page.waitForTimeout(1500);
  await page.evaluate(() => document.activeElement?.blur());
  const ancho = page.viewportSize().width;
  await page.screenshot({ path: `docs/evidencia/d55/${nombre}-${ancho}.jpg`, type: 'jpeg', quality: 82 });
}

test.beforeEach(async ({ page }) => {
  if (!CAPTURAS) await page.route(/tile\.openstreetmap\.org/, (r) => r.abort());
  await page.emulateMedia({ reducedMotion: 'reduce' });
});

const bienvenida = (page) => page.locator('#bienvenida');

// ── 1. Bienvenida ────────────────────────────────────────────────────────────
async function revisarBienvenida(page) {
  await page.goto('/');
  const b = bienvenida(page);
  await expect(b).toBeVisible();
  await expect(b.locator('h2')).toHaveText('Así funciona');
  await expect(b.locator('.pasos li')).toHaveText([
    /^1\s*Elige tu ruta en el menú ☰ y mira dónde empieza y dónde termina\.$/,
    /^2\s*Escribe a dónde quieres ir y ve qué rutas empiezan o terminan cerca\.$/,
    /^3\s*Toca el camión de arriba para ver las paradas en el mapa\.$/,
  ]);
  await expect(b.locator('#bienvenida-rutas')).toHaveText('Elegir ruta');
  await expect(b.locator('#bienvenida-destino')).toHaveText('¿A dónde quieres ir?');
  await expect(b.locator('.recuerda')).toHaveText('Sale solo la primera vez. Se recuerda en este dispositivo, sin cookies.');
  // b4: no tapa la barra de arriba ni la atribución de OpenStreetMap.
  const caja = await b.boundingBox();
  const barra = await page.locator('#barra').boundingBox();
  expect(caja.y).toBeGreaterThan(barra.y + barra.height);
  for (const sel of ['#boton-menu', '#boton-destino', '#boton-paradas', OSM_COPYRIGHT]) expect(await sinTapar(page, sel), sel).toBe(true);
  // Los botones miden al menos 44 px (se tocan con el dedo).
  for (const sel of ['#bienvenida-cerrar', '#bienvenida-rutas', '#bienvenida-destino']) {
    const c = await page.locator(sel).boundingBox();
    expect(Math.min(c.width, c.height), sel).toBeGreaterThanOrEqual(44);
  }
}

test('b1 y b4 (390 px): sale la primera vez, con los textos de la maqueta, sin tapar la barra ni el pie', async ({ page }) => {
  await revisarBienvenida(page);
  await captura(page, '1-bienvenida');
});

test('b2 y b3: la X la cierra y no vuelve al recargar; solo localStorage, sin cookies', async ({ page, context }) => {
  await page.goto('/');
  await page.locator('#bienvenida-cerrar').click();
  await expect(bienvenida(page)).toBeHidden();
  await page.reload();
  await expect(page.locator('#tarjetas .tarjeta-ruta')).toHaveCount(rutas.length);
  await expect(bienvenida(page)).toBeHidden();
  expect(await page.evaluate(() => localStorage.getItem('sjdrbus.bienvenida'))).toBe('1');
  expect(await context.cookies()).toEqual([]);
});

test('b2 y b3: «Elegir ruta» la cierra y abre el menú en «Rutas»; no vuelve al recargar', async ({ page }) => {
  await page.goto('/');
  await page.locator('#bienvenida-rutas').click();
  await expect(bienvenida(page)).toBeHidden();
  await expect(page.locator('#hoja')).not.toHaveClass(/cerrada/);
  await expect(page.locator('#pestana-rutas')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('#tarjetas')).toBeVisible();
  await page.reload();
  await expect(bienvenida(page)).toBeHidden();
});

test('b2 y b3: «¿A dónde quieres ir?» la cierra y abre «Calcula tu ruta» con el campo listo; no vuelve', async ({ page }) => {
  await page.goto('/');
  await page.locator('#bienvenida-destino').click();
  await expect(bienvenida(page)).toBeHidden();
  await expect(page.locator('#pestana-calcula')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('#destino')).toBeFocused();
  await page.reload();
  await expect(bienvenida(page)).toBeHidden();
});

test('con el menú abierto la bienvenida no se ve; al cerrarlo, sin haberla cerrado, vuelve', async ({ page }) => {
  await page.goto('/');
  await page.locator('#boton-menu').click();
  await expect(bienvenida(page)).toBeHidden();
  await page.keyboard.press('Escape');
  await expect(page.locator('#hoja')).toHaveClass(/cerrada/);
  await expect(bienvenida(page)).toBeVisible();
  // Esc con el menú cerrado la cierra como la X.
  await page.keyboard.press('Escape');
  await expect(bienvenida(page)).toBeHidden();
});

test('b5: si el navegador no deja guardar, la app sigue y la X la cierra igual', async ({ page }) => {
  await page.addInitScript(() => {
    const falla = () => {
      throw new DOMException('sin almacenamiento', 'SecurityError');
    };
    Storage.prototype.getItem = falla;
    Storage.prototype.setItem = falla;
    Storage.prototype.removeItem = falla;
  });
  await page.goto('/');
  await expect(page.locator('#tarjetas .tarjeta-ruta')).toHaveCount(rutas.length);
  await expect(bienvenida(page)).toBeVisible();
  await page.locator('#bienvenida-cerrar').click();
  await expect(bienvenida(page)).toBeHidden();
});

// ── 2. Tarjetas partidas ─────────────────────────────────────────────────────
// Mide cada tarjeta partida en la página: alto, columnas, que el nombre quepa,
// que ninguna palabra ni el «–» se partan, y que la letra sea la más grande que
// cabe (con 0.25 px más ya no cabría).
async function medirTarjetas(page) {
  return page.evaluate(() => {
    const cabe = (n, s) => s.scrollWidth <= n.clientWidth && s.getBoundingClientRect().height <= n.clientHeight - 4;
    const fallas = [];
    const tarjetas = [...document.querySelectorAll('#tarjetas .tarjeta-ruta, #lista-recientes .tarjeta-ruta')];
    const altos = new Set();
    for (const t of tarjetas) {
      const id = t.dataset.ruta;
      altos.add(Math.round(t.getBoundingClientRect().height * 2) / 2);
      if (!t.classList.contains('partida')) fallas.push(`${id}: no es partida`);
      const lado = t.querySelector('.lado');
      if (!lado?.querySelector('svg') || !lado.querySelector('.insignia')) fallas.push(`${id}: falta camión o insignia a la izquierda`);
      const n = t.querySelector('.tarjeta-nombre');
      const s = n.firstElementChild;
      const cs = getComputedStyle(n);
      if (cs.hyphens === 'auto') fallas.push(`${id}: guiones de corte`);
      if (n.getBoundingClientRect().left < lado.getBoundingClientRect().right - 0.5) fallas.push(`${id}: el nombre no está a la derecha`);
      // t4: cabe completo, nada se sale de la tarjeta.
      if (!cabe(n, s)) fallas.push(`${id}: el nombre no cabe`);
      if (t.scrollHeight > t.clientHeight + 0.5 || t.scrollWidth > t.clientWidth + 0.5) fallas.push(`${id}: algo se sale de la tarjeta`);
      // t5: cada palabra en un solo renglón (una palabra partida da 2 cajas).
      for (const nodo of [...s.childNodes]) {
        const texto = nodo.textContent;
        const re = /\S+/g;
        let m;
        while ((m = re.exec(texto))) {
          const r = document.createRange();
          const tn = nodo.nodeType === 3 ? nodo : nodo.firstChild;
          r.setStart(tn, m.index);
          r.setEnd(tn, m.index + m[0].length);
          if (r.getClientRects().length !== 1) fallas.push(`${id}: «${m[0]}» partida`);
        }
      }
      // t6: el «–» va dentro de un grupo pegado, en un solo renglón con su vecina.
      for (const b of s.querySelectorAll('b')) if (b.getClientRects().length !== 1) fallas.push(`${id}: «${b.textContent}» en 2 renglones`);
      if ([...s.childNodes].some((x) => x.nodeType === 3 && /(^|\s)–(\s|$)/.test(x.textContent))) fallas.push(`${id}: «–» suelto`);
      // t7: letra entre 7.5 y 11 px; delgada debajo de 9; la más grande que cabe.
      const f = parseFloat(n.dataset.letra);
      if (!(f >= 7.5 && f <= 11)) fallas.push(`${id}: letra ${f}`);
      if (parseFloat(s.style.fontSize) !== f) fallas.push(`${id}: letra aplicada ${s.style.fontSize} ≠ ${f}`);
      if (Number(getComputedStyle(s).fontWeight) !== (f < 9 ? 300 : 400)) fallas.push(`${id}: grosor`);
      if (f < 11) {
        const [antes, peso] = [s.style.fontSize, s.style.fontWeight];
        s.style.fontSize = `${f + 0.25}px`;
        s.style.fontWeight = f + 0.25 < 9 ? '300' : '400';
        if (cabe(n, s)) fallas.push(`${id}: con ${f + 0.25} px también cabía`);
        s.style.fontSize = antes;
        s.style.fontWeight = peso;
      }
    }
    const xs = new Set([...document.querySelectorAll('#tarjetas .tarjeta-ruta')].map((t) => Math.round(t.getBoundingClientRect().left)));
    return { fallas, altos: [...altos], columnas: xs.size, total: tarjetas.length };
  });
}

async function revisarTarjetas(page, alto) {
  await page.goto('/');
  await page.evaluate((ids) => localStorage.setItem('sjdrbus.recientes', JSON.stringify(ids)), RECIENTES);
  await page.locator('#bienvenida-cerrar').click();
  await page.reload();
  await expect(page.locator('#tarjetas .tarjeta-ruta')).toHaveCount(rutas.length);
  await abrirMenu(page);
  await expect(page.locator('#lista-recientes .tarjeta-ruta')).toHaveCount(RECIENTES.length);
  // Las letras se ajustan al tomar la tarjeta su tamaño (ResizeObserver).
  await expect(page.locator('#tarjetas .tarjeta-nombre:not([data-letra])')).toHaveCount(0);
  const m = await medirTarjetas(page);
  expect(m.fallas).toEqual([]);
  expect(m.altos).toEqual([alto]);
  expect(m.columnas).toBe(3);
  expect(m.total).toBe(rutas.length + RECIENTES.length);
  // t1 y t8: orden de routes.txt, nombre completo, y el lector lee insignia y nombre.
  expect(await page.locator('#tarjetas .tarjeta-ruta').evaluateAll((ts) => ts.map((t) => t.dataset.ruta))).toEqual(rutas.map((r) => r.route_id));
  const nombres = await page.locator('#tarjetas .tarjeta-nombre').evaluateAll((ns) => ns.map((n) => n.textContent));
  expect(nombres).toEqual(rutas.map((r) => r.nombre));
  const etiquetas = await page.locator('#tarjetas .tarjeta-ruta').evaluateAll((ts) => ts.map((t) => t.getAttribute('aria-label')));
  for (const e of etiquetas) expect(e).not.toMatch(/Ruta\s+\d{3}/);
}

test('t1–t8 (390 px): 3 columnas, 70 px parejas, nombre completo con su letra, sin partir', async ({ page }) => {
  await revisarTarjetas(page, 70);
  await captura(page, '2-menu');
});

// ── Computadora ──────────────────────────────────────────────────────────────
test.describe('computadora 1280 × 800', () => {
  test.use({ viewport: { width: 1280, height: 800 }, isMobile: false, hasTouch: false });

  test('b1 y b4 en computadora', async ({ page }) => {
    await revisarBienvenida(page);
    await captura(page, '1-bienvenida');
  });

  test('t1–t8 (1280 px): 3 columnas, 60 px parejas', async ({ page }) => {
    await revisarTarjetas(page, 60);
    await captura(page, '2-menu');
  });

  test('al pasar de computadora a teléfono la letra se vuelve a ajustar', async ({ page }) => {
    await revisarTarjetas(page, 60);
    await page.setViewportSize({ width: 390, height: 844 });
    await expect(async () => {
      const m = await medirTarjetas(page);
      expect(m.fallas).toEqual([]);
      expect(m.altos).toEqual([70]);
    }).toPass();
  });
});
