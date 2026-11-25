// D-70: capturas del menú con las 42 rutas, a 390 px (teléfono) y 1280 px (computadora),
// con la tarjeta de cada ruta que volvió a la vista. Uso: npm run build && node docs/evidencia/d70/capturas.mjs
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
const srv = spawn('npx', ['vite', 'preview', '--port', '4324', '--strictPort'], { stdio: 'ignore' });
await new Promise((r) => setTimeout(r, 2500));
const b = await chromium.launch();
try {
  for (const [ancho, alto] of [[390, 844], [1280, 800]]) {
    const ctx = await b.newContext({ viewport: { width: ancho, height: alto }, locale: 'es-MX', serviceWorkers: 'block' });
    await ctx.addInitScript(() => localStorage.setItem('sjdrbus.bienvenida', '1'));
    await ctx.route(/tile\.openstreetmap\.org/, (r) => r.abort());
    const p = await ctx.newPage();
    await p.goto('http://localhost:4324/');
    await p.waitForTimeout(1200);
    await p.locator('#boton-menu').click();
    await p.waitForTimeout(400);
    for (const [n, id] of [['018', 'U-018'], ['024C', 'U-024C'], ['031', 'U-031']]) {
      await p.locator(`#tarjetas .tarjeta-ruta[data-ruta="${id}"]`).scrollIntoViewIfNeeded();
      await p.waitForTimeout(200);
      await p.screenshot({ path: `docs/evidencia/d70/menu-${ancho}-${n}.png` });
    }
    await ctx.close();
  }
} finally { await b.close(); srv.kill(); }
console.log('capturas listas');
