// D-66: prueba de usuario en WebKit (el motor de Safari) con un iPhone simulado y solo con
// toques, como lo haría Miguel la primera vez, sin saber nada de la página.
// Uso: npm run build && node docs/evidencia/d66/probar-iphone.mjs
// Nació del defecto del 24 nov (12:39 am): «Iniciar viaje» no reaccionaba en el iPhone
// porque esperaba un sentido que nadie había marcado.
import { webkit, devices } from 'playwright';
import { spawn } from 'node:child_process';
import { readFileSync } from 'node:fs';
const R = JSON.parse(readFileSync('web/dist/datos/campo.json', 'utf8')).rutas.find((r) => r.numero === '011').paradas;
const P = (o) => R.find((p) => p.orden === o);
const srv = spawn('npx', ['vite', 'preview', '--port', '4321', '--strictPort'], { stdio: 'ignore' });
await new Promise((r) => setTimeout(r, 2500));
const b = await webkit.launch();
let fallas = 0;
const paso = (ok, texto) => { console.log(`${ok ? '✓' : '✗'} ${texto}`); if (!ok) fallas++; };
try {
  const ctx = await b.newContext({ ...devices['iPhone 13'], permissions: ['geolocation'], geolocation: { latitude: P(20).lat, longitude: P(20).lon } });
  const p = await ctx.newPage(); const errores = []; p.on('pageerror', (e) => errores.push(e.message));
  await p.goto('http://localhost:4321/campo.html'); await p.waitForTimeout(1200);
  await p.locator('[data-a="iniciar"]').tap(); await p.waitForTimeout(300);
  paso((await p.locator('#toast').textContent()).includes('Primero elige la ruta'), 'Sin ruta, «Iniciar viaje» dice qué falta');
  await p.locator('#ruta').selectOption('U-011');
  await p.locator('[data-a="iniciar"]').tap(); await p.waitForTimeout(500);
  paso(await p.locator('.parada .no').innerText() === '20', 'Elegir R11 y tocar «Iniciar viaje» basta: pregunta por la 20, donde estoy');
  await p.locator('[data-a="si"]').tap(); await p.waitForTimeout(200);
  paso(await p.locator('.parada .no').innerText() === '21', '«Sí, aquí» pasa a la 21');
  await p.locator('[data-a="nueva"]').tap(); await p.waitForTimeout(200);
  paso((await p.locator('#toast').textContent()).includes('Guardada'), '«Parada aquí» guarda con un toque y lo avisa');
  await p.locator('[data-a="renombrar"]').tap(); await p.locator('#nombre').fill('Office Depot (frente)'); await p.locator('[data-a="guardar-nombre"]').tap(); await p.waitForTimeout(200);
  await p.locator('[data-a="salto"]').tap(); await p.locator('[data-a="deshacer"]').tap(); await p.waitForTimeout(200);
  paso(await p.locator('.parada .no').innerText() === '22', '«Otro nombre», «No la vi» y «Deshacer» funcionan');
  await p.locator('[data-a="terminar"]').tap(); await p.waitForTimeout(300);
  paso(await p.locator('.cuenta').isVisible(), '«Terminar» muestra el resumen');
  await p.locator('.linea li.nueva input').fill('Paseo Central – Soriana'); await p.reload(); await p.waitForTimeout(1200);
  paso(await p.locator('.linea li.nueva input').inputValue() === 'Paseo Central – Soriana', 'El nombre puesto en el resumen se guarda al recargar');
  paso(await p.locator('[data-a="exportar"]').isVisible(), '«Exportar» está a la vista');
  await p.locator('[data-a="volver"]').tap(); await p.locator('.viaje [data-a="borrar"]').tap(); await p.locator('[data-a="borrar-si"]').tap(); await p.waitForTimeout(200);
  paso(await p.locator('.viaje').count() === 0, 'El viaje de prueba se borra');
  paso(await p.evaluate(() => document.documentElement.scrollWidth - innerWidth) === 0, 'Sin scroll de lado');
  paso(errores.length === 0, `Sin errores de la página${errores.length ? ': ' + errores.join(' / ') : ''}`);
} finally { await b.close(); srv.kill(); }
console.log(fallas ? `FALLAN ${fallas}` : 'TODO PASÓ en WebKit con iPhone 13');
process.exit(fallas ? 1 : 0);
