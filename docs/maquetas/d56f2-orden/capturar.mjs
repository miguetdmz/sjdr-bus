// D-56 fase 2 · maqueta «Orden de resultados y nombres repetidos»: capturas y medición,
// sin servidor. Uso: node docs/maquetas/d56f2-orden/capturar.mjs
// Mide o6 (sin scroll de lado ni textos cortados) y revisa o1–o3 sobre la lista.
import { chromium } from 'playwright';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const aqui = dirname(fileURLToPath(import.meta.url));
const url = pathToFileURL(join(aqui, 'maqueta.html')).href;
// [nombre de la captura, parámetros]
const VISTAS = [
  ['plaza', 'vista=f2-buscar&q=plaza'],
  ['parque', 'vista=f2-buscar&q=parque'],
  ['bodega', 'vista=f2-buscar&q=bodega'],
  ['bodega-yo', 'vista=f2-buscar&q=bodega&yo=1'],
  ['salida-banamex', 'vista=f2-salida&q=bana'],
  ['nacozari', 'vista=f2-buscar&q=nacozari'],
];
const TAMANOS = [[390, 844], [320, 640], [1280, 800]];

const navegador = await chromium.launch();
let fallas = 0;
for (const [w, h] of TAMANOS) {
  const pagina = await navegador.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 2 });
  for (const [nombre, q] of VISTAS) {
    for (const orden of w === 390 ? ['hoy', 'nuevo'] : ['nuevo']) {
      const errores = [];
      pagina.removeAllListeners('pageerror');
      pagina.on('pageerror', (e) => errores.push(e.message));
      await pagina.goto(`${url}?${q}${orden === 'hoy' ? '&orden=hoy' : ''}`);
      await pagina.waitForTimeout(1600);
      const m = await pagina.evaluate(() => {
        const dePagina = document.documentElement.scrollWidth - innerWidth;
        const cuerpo = document.getElementById('cuerpo');
        const deCuerpo = cuerpo ? cuerpo.scrollWidth - cuerpo.clientWidth : 0;
        const cortados = [...document.querySelectorAll('#cuerpo .ver-parada, #cuerpo .resultado, #cuerpo .resultado small, #cuerpo .salida-otra, #cuerpo .ver-mas, #cuerpo .ubicacion, #cuerpo .campo')]
          .filter((e) => e.scrollWidth > e.clientWidth + 1).map((e) => e.className || e.tagName);
        const filas = [...document.querySelectorAll('#cuerpo .resultados-f2 .resultado')].map((e) => e.innerText.replace(/\s+/g, ' ').trim());
        return { dePagina, deCuerpo, cortados, filas };
      });
      let ok = m.dePagina <= 0 && m.deCuerpo <= 0 && !m.cortados.length && !errores.length;
      // o1–o3 (solo en el orden nuevo): revisados sobre las filas que se ven.
      const reglas = [];
      if (orden === 'nuevo') {
        if (nombre === 'plaza' && !/^Plaza Punta Victoria/.test(m.filas[0])) reglas.push('o1: con «plaza» la primera no es una plaza comercial');
        if (nombre === 'parque' && !/^Parque Industrial Inicio o fin de ruta/.test(m.filas[0])) reglas.push('o1: con «parque» primero va el de inicio o fin de ruta que empieza con «parque»');
        if (nombre.startsWith('bodega')) {
          const rep = m.filas.filter((f) => /^Bodega Aurrera /.test(f));
          const desde = nombre === 'bodega-yo' ? 'de ti' : 'del Centro';
          if (rep.length !== 3) reglas.push(`o3: «Bodega Aurrera» debía verse 3 veces y se ve ${rep.length}`);
          if (!rep.every((f) => f.includes(desde))) reglas.push(`o3: cada «Bodega Aurrera» dice su distancia «${desde}»`);
          const km = rep.map((f) => { const x = f.match(/a ([\d.]+) (k?m)/); return x ? +x[1] * (x[2] === 'km' ? 1000 : 1) : NaN; });
          if (km.some((v, i) => i && v < km[i - 1])) reglas.push('o3: el más cercano primero');
          if (m.filas.some((f) => /^Bodega Ahurrera/.test(f) && /de ti|del Centro/.test(f))) reglas.push('o3: un nombre único no lleva distancia');
        }
        const nacozari = m.filas.filter((f) => /^Parque Héroes de Nacozari/.test(f)).length;
        if (nombre === 'nacozari' && nacozari !== 1) reglas.push(`o2: el mismo lugar a ≤ 100 m (18 m) debía verse una vez y se ve ${nacozari}`);
        if (nombre === 'salida-banamex' && m.filas.filter((f) => /^Banamex .*del Centro/.test(f)).length !== 2) reglas.push('o4: en «¿Desde dónde sales?» los dos Banamex con su distancia');
      }
      if (reglas.length) ok = false;
      if (!ok) fallas++;
      console.log(`${ok ? 'ok  ' : 'FALLA'} ${nombre} ${orden} ${w}x${h}`, ok ? '' : JSON.stringify({ ...m, errores, reglas }));
      await pagina.screenshot({ path: join(aqui, 'capturas', `${nombre}-${orden}-${w}x${h}.jpg`), type: 'jpeg', quality: 80 });
    }
  }
  await pagina.close();
}
await navegador.close();
console.log(fallas ? `fail ${fallas}` : 'fail 0');
process.exitCode = fallas ? 1 : 0;
