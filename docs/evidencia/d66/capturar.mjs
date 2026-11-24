// D-66: capturas de la página de campo compilada (web/dist/campo.html), versión de la maqueta
// v3 (docs/maquetas/d66-gps/). Uso: npm run build && node docs/evidencia/d66/capturar.mjs
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { readFileSync } from 'node:fs';
const PUERTO = 4319, base = `http://localhost:${PUERTO}/`;
const srv = spawn('npx', ['vite', 'preview', '--port', String(PUERTO), '--strictPort'], { stdio: 'ignore' });
await new Promise((r) => setTimeout(r, 2500));
const R = JSON.parse(readFileSync('web/dist/datos/campo.json', 'utf8')).rutas.find((r) => r.numero === '011').paradas;
const P = (o) => R.find((p) => p.orden === o);
const b = await chromium.launch();
try {
  for (const [w, h] of [[390, 844], [1280, 800]]) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 2, permissions: ['geolocation'], geolocation: { latitude: P(22).lat + 0.0002, longitude: P(22).lon } });
    const p = await ctx.newPage();
    const foto = (n) => p.screenshot({ path: `docs/evidencia/d66/${n}-${w}.jpg`, type: 'jpeg', quality: 80, fullPage: true });
    await p.goto(base + 'campo.html'); await p.locator('#gps').getByText(/\d\d:\d\d/).waitFor();
    await p.locator('#ruta').selectOption('U-011'); await p.locator('[data-a="sentido"]').first().click(); await foto('0-inicio');
    await p.locator('[data-a="iniciar"]').click(); await p.locator('.enfrente').waitFor(); await p.waitForTimeout(300); await foto('1-subes');
    await p.locator('[data-a="si"]').click(); await p.locator('[data-a="salto"]').click(); await p.locator('[data-a="nueva"]').click(); await foto('2-en-camino');
    await p.waitForTimeout(2600);
    await ctx.setGeolocation({ latitude: P(25).lat + 0.0012, longitude: P(25).lon }); await p.waitForTimeout(300);
    await p.locator('[data-a="si"]').click(); await p.locator('[data-a="si"]').click();
    await p.locator('[data-a="terminar"]').click(); await foto('3-al-bajar');
    await ctx.close();
  }
} finally { await b.close(); srv.kill(); }
console.log('capturas listas en docs/evidencia/d66/');
