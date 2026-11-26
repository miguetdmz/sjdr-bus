// D-75 · Maqueta: prueba de usuario en WebKit con iPhone 13 (solo toques, desde cero) con el
// reloj real: la falta de GPS se simula dejando de mandar ubicaciones 65 s. Capturas a 390 y
// 1280 px y medida de la barra a 320 px (recorrido, la barra más llena).
// Uso: node scripts/datos-app.mjs && node docs/maquetas/d75-gps/probar.mjs
import { webkit, devices } from 'playwright';
import { createServer } from 'node:http';
import { readFileSync } from 'node:fs';
const dir = new URL('./', import.meta.url).pathname, raiz = new URL('../../../', import.meta.url).pathname;
const D = JSON.parse(readFileSync(raiz + 'web/public/datos/campo.json', 'utf8'));
const R11 = D.rutas.find((r) => r.numero === '011'), REG = R11.sentidos.REGRESO.paradas, IDA = R11.sentidos.IDA.paradas;
const g = (p) => ({ latitude: p.lat, longitude: p.lon });
const srv = createServer((q, s) => {
  const u = q.url.split('?')[0];
  try {
    const f = u === '/datos/campo.json' ? raiz + 'web/public/datos/campo.json' : dir + 'campo.html';
    s.writeHead(200, { 'content-type': f.endsWith('.json') ? 'application/json' : 'text/html; charset=utf-8' }); s.end(readFileSync(f));
  } catch { s.writeHead(404); s.end(); }
}).listen(4375);
const URL0 = 'http://localhost:4375/campo.html';
let fallas = 0;
const b = await webkit.launch();

async function prueba(ancho) {
  const ctx = await b.newContext(ancho === 390 ? { ...devices['iPhone 13'], permissions: ['geolocation'], geolocation: g(REG.find((p) => p.orden === 5)) }
    : { viewport: { width: 1280, height: 900 }, permissions: ['geolocation'], geolocation: g(REG.find((p) => p.orden === 5)) });
  const p = await ctx.newPage(); const errores = []; p.on('pageerror', (e) => errores.push(e.message));
  const toque = (sel) => (ancho === 390 ? p.locator(sel).first().tap() : p.locator(sel).first().click());
  const foto = (n) => p.screenshot({ path: `${dir}capturas/${n}-${ancho}.png`, fullPage: true });
  const out = [];
  const paso = (ok, t) => { out.push(`${ok ? '✓' : '✗'} [${ancho}] ${t}`); if (!ok) fallas++; };
  const txt = (sel) => p.locator(sel).first().innerText();
  const clase = (sel) => p.locator(sel).first().getAttribute('class');
  await p.goto(URL0); await p.waitForTimeout(1000);
  await p.locator('#ruta').selectOption('U-011');
  await toque('[data-s="REGRESO"]'); await toque('[data-a="modo"][data-m="1"]'); await toque('[data-a="iniciar"]');
  await p.waitForTimeout(500);
  const pasa = REG.filter((x) => x.lat != null && x.orden > 5 && x.orden <= 24);
  const mitad = Math.ceil(pasa.length / 2);
  for (const x of pasa.slice(0, mitad)) { await ctx.setGeolocation(g(x)); await p.waitForTimeout(3100); }
  const n1 = parseInt(await txt('#pulso'));
  paso(n1 >= mitad, `El conteo de puntos sube mientras se maneja: «${await txt('#pulso')}»`);
  paso(!(await clase('#gps')).includes('mal') && /\d\d:\d\d/.test(await txt('#gps')), `Con GPS vivo la barra va en verde con la hora: «${await txt('#gps')}»`);
  await foto('1-prueba-viva');
  await p.waitForTimeout(65_000); // nadie manda ubicación: como un túnel o el teléfono sin señal
  paso((await txt('#gps')).toUpperCase().includes('GPS PERDIDO') && (await clase('#gps')).includes('mal'), `Tras 65 s sin ubicación la barra dice «${await txt('#gps')}» en naranja`);
  paso((await clase('#pulso')).includes('mal') && /hace (6\d|7\d) s/i.test(await txt('#pulso')), `La pantalla de prueba dice «${await txt('#pulso')}» en naranja`);
  await foto('2-gps-perdido');
  for (const x of pasa.slice(mitad)) { await ctx.setGeolocation(g(x)); await p.waitForTimeout(3100); }
  paso(!(await clase('#gps')).includes('mal'), `Al volver la señal, la barra regresa a verde: «${await txt('#gps')}»`);
  await toque('[data-a="terminar"]'); await p.waitForTimeout(500);
  paso((await txt('.veredicto b')) === 'CORRESPONDE', `El veredicto no cambia: ${await txt('.veredicto b')}`);
  paso((await txt('.huecos')).toUpperCase().includes('GPS: 1 HUECO'), `El resumen de la prueba muestra el hueco: «${(await txt('.huecos')).split('\n')[0]}»`);
  const seg = await p.evaluate(() => { const L = [...document.querySelectorAll(".barrag i")], tot = L.reduce((x, i) => x + i.getBoundingClientRect().width, 0); return L.map((i) => [i.className || "ok", Math.round(100 * i.getBoundingClientRect().width / tot)]); });
  paso(seg.length === 3 && seg[1][0] === "h" && seg[0][1] >= 10 && seg[2][1] >= 10 && seg[1][1] >= 35 && seg[1][1] <= 75, `La barra de tiempo marca 1 hueco EN MEDIO, con señal antes y después: ${JSON.stringify(seg)} (%)`);
  paso(await p.evaluate(() => document.documentElement.scrollWidth - innerWidth) <= 0, 'Sin scroll de lado');
  await foto('3-resumen-prueba');
  paso(errores.length === 0, `Sin errores en la página ${errores.join(' | ')}`);
  await ctx.close(); return out;
}

async function recorrido320() {
  const ctx = await b.newContext({ ...devices['iPhone SE'], viewport: { width: 320, height: 640 }, permissions: ['geolocation'], geolocation: g(IDA.find((p) => p.orden === 12)) });
  const p = await ctx.newPage(); const out = [];
  const paso = (ok, t) => { out.push(`${ok ? '✓' : '✗'} [320] ${t}`); if (!ok) fallas++; };
  await p.goto(URL0); await p.waitForTimeout(1000);
  await p.locator('#ruta').selectOption('U-011'); await p.locator('[data-a="iniciar"]').tap();
  await p.waitForTimeout(65_000);
  const t = await p.locator('#gps').innerText();
  paso(t.toUpperCase().includes('GPS PERDIDO'), `Recorrido caminando: la barra también dice «${t}»`);
  const [a, c] = await Promise.all(['#gps', '#cerca'].map((s) => p.locator(s).boundingBox()));
  const enc = Math.max(0, a.x + a.width - c.x);
  paso(enc <= 0 && await p.evaluate(() => [...document.querySelectorAll('#gps')].every((e) => e.scrollWidth <= e.clientWidth + 1)), `A 320 px «GPS perdido» no se encima con «Más cercana» (encimado ${enc} px)`);
  await p.screenshot({ path: `${dir}capturas/extra-320-recorrido.png` });
  await ctx.close(); return out;
}

const res = await Promise.all([prueba(390), prueba(1280), recorrido320()]);
for (const l of res.flat()) console.log(l);
console.log(fallas ? `FALLAS: ${fallas}` : 'Todo bien');
await b.close(); srv.close(); process.exit(fallas ? 1 : 0);
