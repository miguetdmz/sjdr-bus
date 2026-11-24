// D-66: capturas de la página de campo compilada (web/dist/campo.html) para compararla
// con la maqueta. Uso: npm run build && node docs/evidencia/d66/capturar.mjs
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { readFileSync } from 'node:fs';
const PUERTO = 4319, base = `http://localhost:${PUERTO}/`;
const srv = spawn('npx', ['vite', 'preview', '--port', String(PUERTO), '--strictPort'], { stdio: 'ignore' });
await new Promise((r) => setTimeout(r, 2500));
const campo = JSON.parse(readFileSync('web/dist/datos/campo.json', 'utf8'));
const p1 = campo.rutas.find((r) => r.numero === '011').paradas[0];
const b = await chromium.launch();
try {
  for (const [w, h] of [[390, 844], [1280, 800]]) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 2, permissions: ['geolocation'], geolocation: { latitude: p1.lat + 0.0003, longitude: p1.lon } });
    const p = await ctx.newPage();
    const foto = (n) => p.screenshot({ path: `docs/evidencia/d66/${n}-${w}.jpg`, type: 'jpeg', quality: 80 });
    await p.goto(base + 'campo.html'); await p.locator('#gps').getByText('Ubicación lista').waitFor();
    await p.locator('#ruta').selectOption('U-011'); await p.locator('[data-a="sentido"]').first().click(); await foto('1-inicio');
    await p.locator('[data-a="iniciar"]').click(); await p.locator('#dist').getByText('Estás a').waitFor(); await foto('2-pregunta');
    await p.locator('[data-a="si"]').click(); await p.locator('[data-a="renombrar"]').click(); await p.locator('#nombre').fill('Av. Central – Calle 3 Lagunas'); await foto('3-renombrar');
    await p.locator('[data-a="guardar-posible"]').click(); await p.locator('[data-a="si"]').click(); await p.locator('[data-a="otro"]').click();
    await p.locator('[data-a="terminar"]').click(); await foto('4-resumen');
    await ctx.close();
  }
} finally { await b.close(); srv.kill(); }
console.log('capturas listas en docs/evidencia/d66/');
