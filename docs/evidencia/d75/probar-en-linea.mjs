// D-75 · Prueba de la v0.7 EN LÍNEA (sjdrbus-sjr.vercel.app/campo.html) en WebKit con iPhone 13, solo con toques.
// Prueba en carro: la barra marca la hora con GPS vivo, «GPS perdido» tras 65 s sin ubicación (reloj simulado)
// y se recupera al volver la señal. Uso: node docs/evidencia/d75/probar-en-linea.mjs <carpeta-capturas>
import { webkit, devices } from 'playwright';
const dir = process.argv[2] ?? '.';
const b = await webkit.launch();
const ctx = await b.newContext({ ...devices['iPhone 13'], permissions: ['geolocation'], geolocation: { latitude: 20.38338, longitude: -99.96062 } });
const p = await ctx.newPage(); const err = []; p.on('pageerror', (e) => err.push(e.message));
await p.clock.install();
const r = await p.goto('https://sjdrbus-sjr.vercel.app/campo.html'); await p.waitForTimeout(2500);
console.log('estado', r.status(), '| opciones de ruta', await p.locator('#ruta option').count());
await p.locator('#ruta').selectOption('U-011');
await p.locator('[data-a="modo"][data-m="1"]').tap();
await p.locator('[data-a="iniciar"]').tap(); await p.waitForTimeout(1500);
const gps = p.locator('#gps'), pulso = p.locator('#pulso');
const ver = async (et) => console.log(et, '| barra:', (await gps.innerText()).trim(), '| mal:', /mal/.test(await gps.getAttribute('class')), '| pulso:', (await pulso.innerText()).trim());
await ver('1 vivo   '); await p.screenshot({ path: `${dir}/en-linea-1-vivo.png` });
await p.clock.fastForward(65_000); await p.waitForTimeout(500);
await ver('2 sin GPS'); await p.screenshot({ path: `${dir}/en-linea-2-gps-perdido.png` });
await ctx.setGeolocation({ latitude: 20.38400, longitude: -99.96000 }); await p.waitForTimeout(1500);
await ver('3 vuelve '); 
console.log('scroll de lado (px)', await p.evaluate(() => document.documentElement.scrollWidth - innerWidth));
console.log('errores', err.length ? err : 'ninguno');
await b.close();
