// D-74 · Maqueta: prueba de usuario en WebKit con iPhone 13 (solo toques, desde cero) y
// capturas a 390 px (la misma corrida) y a 1280 px.
// Uso: node docs/maquetas/d66-pendientes/datos.mjs && node docs/maquetas/d66-pendientes/probar.mjs
import { webkit, devices } from 'playwright';
import { createServer } from 'node:http';
import { readFileSync } from 'node:fs';
import { extname } from 'node:path';
const dir = new URL('./', import.meta.url).pathname;
const D = JSON.parse(readFileSync(dir + 'campo-sentido.json', 'utf8'));
const R11 = D.rutas.find((r) => r.numero === '011'), IDA = R11.sentidos.IDA.paradas, REG = R11.sentidos.REGRESO.paradas;
const P = (L, o) => L.find((p) => p.orden === o);
const tipos = { '.html': 'text/html; charset=utf-8', '.json': 'application/json' };
const srv = createServer((q, s) => { try { const f = dir + (q.url.split('?')[0].slice(1) || 'maqueta.html'); s.writeHead(200, { 'content-type': tipos[extname(f)] ?? 'text/plain' }); s.end(readFileSync(f)); } catch { s.writeHead(404); s.end(); } }).listen(4374);
const URL0 = 'http://localhost:4374/maqueta.html';
let fallas = 0;
const paso = (ok, t) => { console.log(`${ok ? '✓' : '✗'} ${t}`); if (!ok) fallas++; };
const b = await webkit.launch();

async function recorrido(ctx, ancho, revisar) {
  const p = await ctx.newPage(); const errores = []; p.on('pageerror', (e) => errores.push(e.message));
  const toque = (sel) => (revisar ? p.locator(sel).first().tap() : p.locator(sel).first().click());
  const foto = (n) => p.screenshot({ path: `${dir}capturas/${n}-${ancho}.png`, fullPage: true });
  const ok = revisar ? paso : () => {};
  const txt = (sel) => p.locator(sel).first().innerText();
  // GPS en la parada 12 de la IDA (lejos del inicio): no debe cambiar la primera pregunta.
  await ctx.setGeolocation({ latitude: P(IDA, 12).lat, longitude: P(IDA, 12).lon });
  await p.goto(URL0); await p.waitForTimeout(800);
  await p.locator('#ruta').selectOption('U-011'); await p.waitForTimeout(200);
  ok((await txt('[data-s="IDA"]')).includes('Paseo Loma Alta'), 'Los sentidos se nombran con su primera y última parada oficial');
  ok((await p.locator('[data-s="IDA"]').getAttribute('aria-pressed')) === 'true', 'La IDA viene marcada: no hay que adivinar un paso');
  await foto('1-inicio');
  await toque('[data-a="iniciar"]'); await p.waitForTimeout(500);
  ok(await txt('.parada .no') === '1', '(a) La primera pregunta es la parada 1 del sentido, aunque el GPS esté en la 12');
  ok((await txt('.parada .ids')).includes('P-3418') && (await txt('.parada .ids')).includes('R11-I-01'), '(d) La parada muestra su número P- y su identificador R11-I-01');
  await p.waitForTimeout(2600); // deja que se vaya el aviso «No bloquees la pantalla»
  await foto('2-primera');
  await toque('[data-a="cercana"]'); await p.waitForTimeout(400);
  ok(await txt('.parada .no') === '12', '(b) «Más cercana» salta a la 12, donde está el GPS');
  ok((await txt('.parada .ids')).includes('R11-I-12'), '(d) Identificador de la 12: R11-I-12');
  await foto('3-mas-cercana');
  await toque('[data-a="si"]'); await p.waitForTimeout(200);
  ok(await txt('.parada .no') === '13', '«Sí, aquí» sigue el orden del sentido: 13');
  await toque('[data-a="terminar"]'); await p.waitForTimeout(300);
  ok((await txt('.linea')).includes('R11-I-12'), 'El resumen nombra la parada con su identificador');
  await toque('[data-a="volver"]'); await p.waitForTimeout(200);

  // Ruta sin puntos (R5): «Más cercana» apagado y dice por qué.
  await p.locator('#ruta').selectOption('U-005'); await p.waitForTimeout(200);
  await toque('[data-a="iniciar"]'); await p.waitForTimeout(400);
  ok(await p.locator('#cerca.off').count() === 1, '(b) En la R5 (sin puntos) «Más cercana» se ve apagado');
  await toque('[data-a="cercana"]'); await p.waitForTimeout(300);
  ok((await p.locator('#toast').textContent()).includes('no tiene paradas con punto') && await txt('.parada .no') === '1', '(b) Al tocarlo dice por qué y no salta');
  await foto('4-sin-puntos');
  await toque('[data-a="terminar"]'); await toque('[data-a="volver"]'); await p.waitForTimeout(200);

  // Modo prueba en la REGRESO de la R11: el carro pasa por las paradas 5 a 24.
  await p.locator('#ruta').selectOption('U-011'); await p.waitForTimeout(150);
  await toque('[data-s="REGRESO"]'); await toque('[data-a="modo"][data-m="1"]'); await p.waitForTimeout(150);
  ok(await txt('[data-a="iniciar"]') === 'INICIAR PRUEBA' || (await txt('[data-a="iniciar"]')).toLowerCase().includes('prueba'), '(c) Al elegir «Prueba en carro» el botón dice «Iniciar prueba»');
  await ctx.setGeolocation({ latitude: P(REG, 5).lat, longitude: P(REG, 5).lon });
  await toque('[data-a="iniciar"]'); await p.waitForTimeout(400);
  for (const p2 of REG.filter((x) => x.lat != null && x.orden > 5 && x.orden <= 24)) { await ctx.setGeolocation({ latitude: p2.lat, longitude: p2.lon }); await p.waitForTimeout(3100); }
  ok(await p.locator('[data-a="si"]').count() === 0, '(c) En prueba no hay botones que pedir manejando');
  await foto('5-prueba');
  await toque('[data-a="terminar"]'); await p.waitForTimeout(300);
  const v = await txt('.veredicto');
  ok(v.includes('CORRESPONDE') && !v.includes('NO CORRESPONDE') && v.includes('tramo 5 a 24'), `(c) Veredicto CORRESPONDE con su cuenta (${v.split('\n')[1] ?? ''})`);
  ok(v.toUpperCase().includes('NO ES MEDICIÓN DE CAMPO') && !(await p.locator('#vista').innerText()).toUpperCase().includes('MEDIDO EN CAMPO'), '(c) La prueba no dice MEDIDO EN CAMPO');
  await foto('6-veredicto');
  await toque('[data-a="volver"]'); await p.waitForTimeout(150);

  // Prueba en la R5 (sin puntos): SIN CALIFICACIÓN, sin forzar veredicto.
  await p.locator('#ruta').selectOption('U-005'); await toque('[data-a="modo"][data-m="1"]'); await toque('[data-a="iniciar"]'); await p.waitForTimeout(300);
  await toque('[data-a="terminar"]'); await p.waitForTimeout(300);
  ok((await txt('.veredicto')).includes('SIN CALIFICACIÓN'), '(c) Sentido sin puntos: SIN CALIFICACIÓN y por qué');
  await foto('7-sin-calificacion');
  ok(await p.evaluate(() => document.documentElement.scrollWidth - innerWidth) === 0, 'Sin scroll de lado');
  ok(errores.length === 0, `Sin errores de la página${errores.length ? ': ' + errores.join(' / ') : ''}`);
  await p.close();
}

try {
  const tel = await b.newContext({ ...devices['iPhone 13'], permissions: ['geolocation'] });
  await recorrido(tel, 390, true);
  const pc = await b.newContext({ viewport: { width: 1280, height: 800 }, permissions: ['geolocation'] });
  await recorrido(pc, 1280, false);
} finally { await b.close(); srv.close(); }
console.log(fallas ? `FALLAN ${fallas}` : 'TODO PASÓ en WebKit con iPhone 13');
process.exit(fallas ? 1 : 0);
