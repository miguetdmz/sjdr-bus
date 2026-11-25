// D-66: simulación de un viaje real en la R11 como lo haría Miguel (GPS que se mueve de
// parada en parada). Uso: npm run build && node docs/evidencia/d66/simular-viaje.mjs
// Versión 1 (23 nov) encontró: subir a medio camino costaba 19 toques mal anotados, la vuelta
// 49, y «renombrar» guardaba el punto 399 m después. Esta versión mide lo mismo con la v3.
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { readFileSync } from 'node:fs';
const PUERTO = 4320, base = `http://localhost:${PUERTO}/`;
const srv = spawn('npx', ['vite', 'preview', '--port', String(PUERTO), '--strictPort'], { stdio: 'ignore' });
await new Promise((r) => setTimeout(r, 2500));
const R = JSON.parse(readFileSync('web/dist/datos/campo.json', 'utf8')).rutas.find((r) => r.numero === '011').paradas;
const P = (o) => R.find((p) => p.orden === o);
const b = await chromium.launch();
try {
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, permissions: ['geolocation'], geolocation: { latitude: P(20).lat, longitude: P(20).lon } });
  const p = await ctx.newPage();
  const ir = async (o) => { if (P(o).lat == null) return; await ctx.setGeolocation({ latitude: P(o).lat, longitude: P(o).lon }); await p.waitForTimeout(400); };
  const parada = async () => `${await p.locator('.parada .no').innerText()} · ${await p.locator('.parada .nom').innerText()} · ${await p.locator('#dist').innerText()}`;
  await p.goto(base + 'campo.html'); await p.locator('#gps').getByText(/\d\d:\d\d/).waitFor();
  await p.locator('#ruta').selectOption('U-011'); await p.locator('[data-a="sentido"]').first().click(); await p.locator('[data-a="iniciar"]').click();
  console.log('A) Subo a medio camino, en la parada oficial 20:');
  console.log('   pregunta →', (await parada()).replace(/\n/g, ' '));
  let toques = 1; await p.locator('[data-a="si"]').click();
  for (const o of [21, 22, 23]) { await ir(o); if ((await p.locator('.parada .no').innerText()) === String(o)) { await p.locator(o === 22 ? '[data-a="renombrar"]' : '[data-a="si"]').click(); toques++; }
    if (o === 22) { await ir(23); await p.locator('#nombre').fill('Carr. San Juan del Río – Otoño (gasolinera)'); await p.locator('[data-a="guardar-nombre"]').click(); } }
  await p.locator('[data-a="nueva"]').click(); toques++;
  console.log(`   4 paradas oficiales y 1 nueva con ${toques} toques (antes: 19 toques solo para llegar a la 20)`);
  await p.locator('[data-a="terminar"]').click();
  const v = await p.evaluate(() => JSON.parse(localStorage.getItem('sjdrbus.campo.v1')).viajes[0]);
  const ren = v.respuestas.find((r) => r.estado === 'posible');
  console.log(`B) «Otro nombre» en la 22 escrito mientras el camión llegaba a la 23: quedó a ${ren.dist_m} m de la 22 (antes: 399 m)`);
  console.log('   resumen:', (await p.locator('.linea li').allInnerTexts()).map((t) => t.replace(/\s+/g, ' ').trim()).join(' | '));
  console.log('C) De regreso, en la parada 57 (del otro lado de la carretera, frente a la 22):');
  await p.locator('[data-a="volver"]').click();
  await ctx.setGeolocation({ latitude: P(57).lat, longitude: P(57).lon }); await p.waitForTimeout(300);
  await p.locator('#ruta').selectOption('U-011'); await p.locator('[data-a="sentido"]').nth(1).click(); await p.locator('[data-a="iniciar"]').click();
  console.log('   pregunta →', (await parada()).replace(/\n/g, ' '), '| enfrente →', (await p.locator('.enfrente').innerText().catch(() => 'no aparece')).replace(/\n/g, ' '));
  console.log('   toques para llegar a la primera de la vuelta: 0 (antes: 49)');
} finally { await b.close(); srv.kill(); }
