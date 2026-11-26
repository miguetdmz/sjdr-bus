// D-74 · Prueba de la página de campo EN LÍNEA (sjdrbus-sjr.vercel.app) en WebKit con iPhone 13, solo con toques.
// Uso: node docs/evidencia/d74/probar-en-linea.mjs <captura.png>
import { webkit, devices } from 'playwright';
const b = await webkit.launch();
const ctx = await b.newContext({ ...devices['iPhone 13'], permissions: ['geolocation'], geolocation: { latitude: 20.38338, longitude: -99.96062 } });
const p = await ctx.newPage(); const err = []; p.on('pageerror', (e) => err.push(e.message));
const r = await p.goto('https://sjdrbus-sjr.vercel.app/campo.html'); await p.waitForTimeout(2500);
console.log('estado', r.status(), '| título', await p.title());
console.log('opciones de ruta', await p.locator('#ruta option').count());
await p.locator('#ruta').selectOption('U-011'); await p.waitForTimeout(300);
await p.locator('[data-a="iniciar"]').tap(); await p.waitForTimeout(800);
console.log('parada', await p.locator('.parada .no').innerText(), '|', await p.locator('.parada .ids').innerText());
await p.locator('[data-a="cercana"]').tap(); await p.waitForTimeout(400);
console.log('tras Más cercana', await p.locator('.parada .no').innerText());
await p.screenshot({ path: process.argv[2] });
console.log('errores', err.length ? err : 'ninguno');
await b.close();
