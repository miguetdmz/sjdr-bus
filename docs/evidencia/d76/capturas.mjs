// D-76: capturas del mapa para decidir, a 390 px (teléfono) y 1280 px (computadora).
// Uso: node docs/evidencia/d76/candidatos.mjs && node docs/evidencia/d76/capturas.mjs
// Carga mapa.html como archivo; los mosaicos vienen de tile.openstreetmap.org (solo para esta evidencia).
import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url';
const url = new URL('./mapa.html', import.meta.url).href;
const dir = fileURLToPath(new URL('./', import.meta.url));
const esperar = async (p) => { await p.waitForLoadState('networkidle'); await p.waitForTimeout(800); };
const b = await chromium.launch();
const errores = [];
try {
  for (const [ancho, alto] of [[390, 844], [1280, 800]]) {
    const ctx = await b.newContext({ viewport: { width: ancho, height: alto }, locale: 'es-MX', deviceScaleFactor: 1 });
    const p = await ctx.newPage();
    p.on('pageerror', (e) => errores.push(`${ancho}: ${e.message}`));
    await p.goto(url); await esperar(p);
    await p.screenshot({ path: `${dir}1-panorama-${ancho}.jpg`, quality: 75 });
    const casos = [['2-punto-nuevo', 'RÍO MOCTEZUMA-PARQUE LAS GARZAS'], ['3-punto-nuevo', 'PASEO CENTRAL-OFFICE DEPOT'],
      ['4-falso-aceptado', 'CARR. SAN JUAN DEL RÍO-JALPAN DE SERRA'], ['5-dudoso', 'CARRETERA SAN JUAN DEL RÍO–TEQUISQUIAPAN KM 3.2-WALMART']];
    for (const [nombre, texto] of casos) {
      await p.evaluate((t) => window.verCaso(t), texto); await esperar(p);
      await p.screenshot({ path: `${dir}${nombre}-${ancho}.jpg`, quality: 75 });
    }
    if (ancho === 390) await p.screenshot({ path: `${dir}6-lista-390.jpg`, fullPage: true, quality: 75 });
    await ctx.close();
  }
} finally { await b.close(); }
console.log(errores.length ? `ERRORES: ${errores.join(' | ')}` : 'capturas listas, sin errores de página');
