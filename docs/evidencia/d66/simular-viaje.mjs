// Simulación de un viaje real en la R11 como lo haría Miguel (GPS que se mueve).
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { readFileSync } from 'node:fs';
const PUERTO = 4320, base = `http://localhost:${PUERTO}/`;
const srv = spawn('npx', ['vite', 'preview', '--port', String(PUERTO), '--strictPort'], { stdio: 'ignore', cwd: '/Users/miguetdmz/Proyectos/SJDRbus-sjr' });
await new Promise((r) => setTimeout(r, 2500));
const R = JSON.parse(readFileSync('/Users/miguetdmz/Proyectos/SJDRbus-sjr/web/dist/datos/campo.json', 'utf8')).rutas.find((r) => r.numero === '011').paradas;
const P = (o) => R.find((p) => p.orden === o);
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, permissions: ['geolocation'], geolocation: { latitude: P(20).lat, longitude: P(20).lon } });
const p = await ctx.newPage();
const ir = async (lat, lon) => { await ctx.setGeolocation({ latitude: lat, longitude: lon }); await p.waitForTimeout(400); };
const preg = async () => `${await p.locator('.preg small').innerText()} | ${await p.locator('.preg .nom').innerText()} | ${await p.locator('#dist').innerText().catch(() => '')}`;
await p.goto(base + 'campo.html'); await p.locator('#gps').getByText('Ubicación lista').waitFor();
await p.locator('#ruta').selectOption('U-011'); await p.locator('[data-a="sentido"]').first().click();
await p.locator('[data-a="iniciar"]').click(); await p.waitForTimeout(400);
console.log('A) Subo a medio camino (parada oficial 20, como «espérelo en Soriana»):');
console.log('   la página pregunta →', await preg());
let toques = 0;
while (!(await p.locator('.preg small').innerText()).startsWith('Parada 20 ')) { await p.locator('[data-a="otro"]').click(); toques++; }
console.log(`   para llegar a la 20 tuve que tocar «No pasa por aquí» ${toques} veces (y quedan mal anotadas como OTRO SENTIDO)`);
await p.locator('[data-a="si"]').click();
console.log('B) Renombrar mientras el camión avanza:');
await ir(P(22).lat, P(22).lon);
await p.locator('[data-a="si"]').click(); // 21 no tiene punto: la confirmo igual
await p.locator('[data-a="renombrar"]').click();
const t0 = Date.now();
await ir(P(23).lat, P(23).lon); // mientras escribo, el camión llega a la 23
await p.locator('#nombre').fill('Carr. San Juan del Río – Otoño (frente a la gasolinera)');
await p.locator('[data-a="guardar-posible"]').click();
console.log('C) Parada nueva entre la 23 y la 25:');
await ir((P(23).lat + P(25).lat) / 2, (P(23).lon + P(25).lon) / 2);
await p.locator('[data-a="nueva"]').click();
await p.locator('#nombre').fill('Benito Juárez – Soriana');
await p.locator('[data-a="guardar-nueva"]').click();
await p.locator('[data-a="terminar"]').click();
const filas = await p.locator('.hecho li').allInnerTexts();
console.log('   resumen, últimas 4 filas:'); filas.slice(-4).forEach((f) => console.log('   ·', f.replace(/\s+/g, ' ')));
const v = await p.evaluate(() => JSON.parse(localStorage.getItem('sjdrbus.campo.v1')).viajes[0]);
const pos = v.respuestas.find((r) => r.estado === 'posible');
const d = (a, b) => Math.round(6371000 * 2 * Math.asin(Math.sqrt(Math.sin((b.lat - a.lat) * Math.PI / 360) ** 2 + Math.cos(a.lat * Math.PI / 180) * Math.cos(b.lat * Math.PI / 180) * Math.sin((b.lon - a.lon) * Math.PI / 360) ** 2)));
console.log(`   la POSIBLE (Otoño, parada 22) quedó guardada a ${d(pos, P(22))} m de donde tocaste «renombrar»: tomó el punto al guardar, no al tocar`);
console.log('D) Vuelta (Central → Loma Alta): la primera pregunta sería otra vez la parada 1;');
const primeraVuelta = R.findIndex((x) => x.orden === 50);
console.log(`   para llegar a la primera de la vuelta (~50) habría que tocar «No pasa por aquí» ${primeraVuelta} veces`);
console.log('E) Exportar:', await p.locator('[data-a="exportar"]').isVisible() ? 'botón visible' : 'NO');
console.log('F) Trazo guardado:', v.trazo.length, 'puntos (en la simulación el GPS solo cambió 4 veces)');
await b.close(); srv.kill();
