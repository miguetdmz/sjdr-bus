// D-56 fase 2 · capturas y medición de la maqueta (criterio 6), sin servidor.
// Uso: node docs/maquetas/d56f2/capturar.mjs
import { chromium } from 'playwright';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const aqui = dirname(fileURLToPath(import.meta.url));
const url = pathToFileURL(join(aqui, 'maqueta.html')).href;
const VISTAS = ['f2-inicio', 'f2-buscar', 'f2-destino', 'f2-salida', 'f2-completo', 'f2-mapa', 'destino', 'ubicado'];
const TAMANOS = [[390, 844], [320, 640], [1280, 800]];

const navegador = await chromium.launch();
let fallas = 0;
for (const [w, h] of TAMANOS) {
  const pagina = await navegador.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 2 });
  for (const v of VISTAS) {
    const errores = [];
    pagina.removeAllListeners('pageerror');
    pagina.on('pageerror', (e) => errores.push(e.message));
    await pagina.goto(`${url}?vista=${v}`);
    await pagina.waitForTimeout(1600);
    const m = await pagina.evaluate(() => {
      const dePagina = document.documentElement.scrollWidth - innerWidth;
      const cuerpo = document.getElementById('cuerpo');
      const deCuerpo = cuerpo ? cuerpo.scrollWidth - cuerpo.clientWidth : 0;
      // Textos cortados: un elemento de la pestaña más ancho que su caja.
      const cortados = [...document.querySelectorAll('#cuerpo .ver-parada, #cuerpo .resultado, #cuerpo .salida-otra, #cuerpo .ubicacion, #cuerpo .campo')]
        .filter((e) => e.scrollWidth > e.clientWidth + 1).map((e) => e.className);
      return { dePagina, deCuerpo, cortados };
    });
    const ok = m.dePagina <= 0 && m.deCuerpo <= 0 && !m.cortados.length && !errores.length;
    if (!ok) fallas++;
    console.log(`${ok ? 'ok  ' : 'FALLA'} ${v} ${w}x${h}`, ok ? '' : JSON.stringify({ ...m, errores }));
    if (v.startsWith('f2-')) await pagina.screenshot({ path: join(aqui, 'capturas', `${v.slice(3)}-${w}x${h}.jpg`), type: 'jpeg', quality: 80 });
  }
  await pagina.close();
}
await navegador.close();
console.log(fallas ? `fail ${fallas}` : 'fail 0');
process.exitCode = fallas ? 1 : 0;
