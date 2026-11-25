// D-74 · Maqueta: a 320 px la barra (ruta, hora, «Más cercana», franjas) cabe sin taparse.
// Uso: node docs/maquetas/d66-pendientes/medir-320.mjs "$PWD/docs/maquetas/d66-pendientes/"
import { webkit } from 'playwright';
import { createServer } from 'node:http';
import { readFileSync } from 'node:fs';
const dir = process.argv[2];
const srv = createServer((q, s) => { try { s.writeHead(200, { 'content-type': q.url.endsWith('.json') ? 'application/json' : 'text/html; charset=utf-8' }); s.end(readFileSync(dir + (q.url.slice(1) || 'maqueta.html'))); } catch { s.writeHead(404); s.end(); } }).listen(4375);
const b = await webkit.launch(); const ctx = await b.newContext({ viewport: { width: 320, height: 640 }, hasTouch: true, isMobile: true, permissions: ['geolocation'], geolocation: { latitude: 20.38338, longitude: -99.96062 } });
const p = await ctx.newPage(); await p.goto('http://localhost:4375/maqueta.html'); await p.waitForTimeout(600);
await p.locator('#ruta').selectOption('U-011'); await p.locator('[data-a="iniciar"]').tap(); await p.waitForTimeout(400);
const r = await p.evaluate(() => { const bar = document.querySelector('.barra').getBoundingClientRect(), c = document.querySelector('#cerca').getBoundingClientRect(), g = document.querySelector('#gps'); return { scroll: document.documentElement.scrollWidth - innerWidth, barH: Math.round(bar.height), cercaDentro: c.right <= bar.right + 0.5, gpsTexto: g.innerText, gpsCorta: g.scrollWidth > g.clientWidth }; });
console.log(JSON.stringify(r)); await p.screenshot({ path: dir + 'capturas/extra-320.png' });
await b.close(); srv.close();
const bien = r.scroll === 0 && r.cercaDentro && !r.gpsCorta;
console.log(bien ? '✓ A 320 px la barra cabe: la hora del GPS se ve completa' : '✗ A 320 px la barra se encima');
process.exit(bien ? 0 : 1);
