// D-56f2, ajuste de las 9:18 pm: mide la línea de tu parada con las opciones a, b y c.
// Uso: node docs/maquetas/d56f2/medir-opciones.mjs
import { chromium } from 'playwright';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
const aqui = dirname(fileURLToPath(import.meta.url));
const url = pathToFileURL(join(aqui, 'maqueta.html')).href;
const nav = await chromium.launch();
for (const [w, h] of [[390, 844], [375, 667], [320, 640]]) {
  const pag = await nav.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 2 });
  for (const op of ['a', 'b', 'c']) {
    for (const v of ['f2-destino', 'f2-completo']) {
      await pag.goto(`${url}?vista=${v}&salida=${op}`);
      await pag.waitForTimeout(700);
      const m = await pag.evaluate(() => {
        const l = document.querySelector('#cuerpo .ver-parada');
        const b = l.querySelector('b');
        const lh = parseFloat(getComputedStyle(b).lineHeight) || 18;
        return { linea_px: Math.round(l.getBoundingClientRect().height), ancho_px: Math.round(l.getBoundingClientRect().width), renglones_titulo: Math.round(b.getBoundingClientRect().height / lh) };
      });
      console.log(`${w}x${h} opción ${op} ${v.slice(3).padEnd(8)} alto ${m.linea_px} px · ancho ${m.ancho_px} px · título en ${m.renglones_titulo} renglón(es)`);
      if (v === 'f2-completo' && w !== 375) await pag.screenshot({ path: join(aqui, 'capturas', `opcion-${op}-completo-${w}x${h}.jpg`), type: 'jpeg', quality: 80, clip: { x: 0, y: 0, width: w, height: 330 } });
    }
  }
  await pag.close();
}
await nav.close();
