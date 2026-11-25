// D-70: prueba de usuario en WebKit (el motor de Safari) con un iPhone 13 simulado, desde cero
// (nada guardado) y solo con toques, como un sanjuanense que busca su ruta (D-69). Revisa que
// las 3 rutas que volvieron (018, 024C y 031) se encuentran en el menú y abren su detalle.
// Uso: npm run build && node docs/evidencia/d70/probar-iphone.mjs
import { webkit, devices } from 'playwright';
import { spawn } from 'node:child_process';
import { readFileSync } from 'node:fs';

const rutas = JSON.parse(readFileSync('web/dist/datos/rutas.json', 'utf8')).rutas;
const VUELVEN = ['Nuevo San Isidro – Centro', 'Las Torres – Central de Autobuses', 'Pedregoso – PITSA'];
const srv = spawn('npx', ['vite', 'preview', '--port', '4322', '--strictPort'], { stdio: 'ignore' });
await new Promise((r) => setTimeout(r, 2500));
const b = await webkit.launch();
let fallas = 0;
const paso = (ok, texto) => { console.log(`${ok ? '✓' : '✗'} ${texto}`); if (!ok) fallas++; };
try {
  const ctx = await b.newContext({ ...devices['iPhone 13'], locale: 'es-MX', serviceWorkers: 'block' });
  // Sin teselas de OSM en la prueba (HANDOFF §11.6).
  await ctx.route(/tile\.openstreetmap\.org/, (r) => r.abort());
  const p = await ctx.newPage();
  const errores = [];
  p.on('pageerror', (e) => errores.push(e.message));
  await p.goto('http://localhost:4322/');
  await p.waitForTimeout(1500);
  paso(await p.locator('#bienvenida').isVisible(), 'Primera vez: sale la bienvenida');
  await p.getByText('Elegir ruta', { exact: true }).tap();
  await p.waitForTimeout(400);
  const tarjetas = p.locator('#tarjetas .tarjeta-ruta');
  paso(await tarjetas.count() === rutas.length && rutas.length === 42, `El menú muestra ${await tarjetas.count()} tarjetas (42 de qrobus)`);
  for (const [i, nombre] of VUELVEN.entries()) {
    const t = tarjetas.filter({ hasText: nombre.split(' – ')[0] }).filter({ hasText: nombre.split(' – ')[1] });
    paso(await t.count() === 1, `«${nombre}» tiene su tarjeta`);
    await t.tap();
    await p.waitForTimeout(500);
    const detalle = p.locator('#detalle');
    paso(await detalle.isVisible() && (await detalle.innerText()).includes(nombre.split(' – ')[0]), `Tocarla abre su detalle (${await p.locator('#encabezado-ruta .camion').innerText()})`);
    paso((await p.locator('#detalle .detalle-pie').innerText()).includes('FALTANTE'), 'El detalle dice que su extremo es FALTANTE (no inventa un punto)');
    await p.locator('#sentido label').filter({ hasText: /^Vuelta/ }).tap();
    await p.waitForTimeout(300);
    paso(await p.locator('#sentido input[value="vuelta"]').isChecked(), `Un toque cambia a «Vuelta» (${(await p.locator('#sentido label').filter({ hasText: /^Vuelta/ }).innerText()).replace(/\s+/g, ' ')})`);
    await p.screenshot({ path: `docs/evidencia/d70/iphone-${i + 1}-detalle.png` });
    await p.getByRole('button', { name: 'Cambiar de ruta: volver a las tarjetas' }).tap();
    await p.waitForTimeout(400);
    paso(await p.locator('#selector-visual').isVisible(), '«Cambiar ruta» regresa a las tarjetas');
  }
  paso(await p.evaluate(() => document.documentElement.scrollWidth - innerWidth) === 0, 'Sin scroll de lado');
  paso(errores.length === 0, `Sin errores de la página${errores.length ? ': ' + errores.join(' / ') : ''}`);
} finally { await b.close(); srv.kill(); }
console.log(fallas ? `FALLAN ${fallas}` : 'TODO PASÓ en WebKit con iPhone 13');
process.exit(fallas ? 1 : 0);
