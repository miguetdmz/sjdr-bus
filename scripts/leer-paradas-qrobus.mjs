// D-71 · Lectura ÚNICA de las paradas oficiales por sentido (qrobus.gob.mx).
// Se corrió una vez el 25 nov 2026. No se vuelve a correr sin el sí de Miguel:
// si la carpeta de salida ya existe, se niega.
//
// Qué hace: 1 descarga de la página /Rutas (abre la sesión y trae la llave csrf
// que la página exige) y 84 consultas a /Rutas/paradasTimeline (42 rutas × 2
// sentidos: direccion 0 = IDA, 1 = REGRESO), con pausa entre consultas. Guarda
// todo tal cual en referencias/ (fuera de git). La cookie y la llave viven solo
// en memoria: nunca se escriben a disco. No toca /Rutas/rutaMostrar (trazo).
import { mkdirSync, existsSync, writeFileSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join } from 'node:path';

const BASE = 'https://qrobus.gob.mx';
const SALIDA = process.argv[2] ?? 'referencias/fuentes-2026-11-25/qrobus-paradas';
const PAUSA_MS = 2500;
const UA = 'Mozilla/5.0 (compatible; lectura-unica-paradas)';

if (existsSync(SALIDA)) {
  console.error(`La carpeta ${SALIDA} ya existe: la lectura es única (D-71). No se repite.`);
  process.exit(1);
}
mkdirSync(join(SALIDA, 'respuestas'), { recursive: true });

const rutas = JSON.parse(readFileSync('datos/cache/qrobus/rutas-sjr.json', 'utf8'));
if (rutas.length !== 42) throw new Error(`se esperaban las 42 de la referencia, hay ${rutas.length}`);

const sha = (b) => createHash('sha256').update(b).digest('hex');
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
const ahora = () => new Date().toISOString();

// 1) Página: sesión y llave csrf (solo en memoria).
const pag = await fetch(`${BASE}/Rutas`, { headers: { 'User-Agent': UA } });
const html = await pag.text();
writeFileSync(join(SALIDA, 'pagina-rutas.html'), html);
const cookies = (pag.headers.getSetCookie?.() ?? []).map((c) => c.split(';')[0]).join('; ');
const token = html.match(/name="csrf-token" content="([^"]+)"/)?.[1];
if (!token || !cookies) throw new Error('la página no trajo sesión o llave csrf');

const bitacora = {
  pagina: { url: `${BASE}/Rutas`, consultado: ahora(), status: pag.status, bytes: Buffer.byteLength(html), sha256: sha(html) },
  consultas: [],
};

// 2) 84 consultas, una por ruta y sentido.
for (const r of rutas) {
  for (const direccion of [0, 1]) {
    const archivo = `${r.data_ruta}-${direccion === 0 ? 'ida' : 'regreso'}.json`;
    let intento = 0, res, cuerpo, error = null;
    while (intento < 2) {
      intento += 1;
      try {
        res = await fetch(`${BASE}/Rutas/paradasTimeline`, {
          method: 'POST',
          headers: {
            'User-Agent': UA,
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'X-Requested-With': 'XMLHttpRequest',
            Accept: 'application/json, text/javascript, */*; q=0.01',
            Referer: `${BASE}/Rutas`,
            Cookie: cookies,
          },
          body: new URLSearchParams({ ruta: r.data_ruta, direccion: String(direccion), _token: token }),
        });
        cuerpo = await res.text();
        error = null;
        break;
      } catch (e) {
        error = String(e); // falla de red: se repite una sola vez (D-71, criterio 1)
        await espera(PAUSA_MS);
      }
    }
    if (cuerpo !== undefined) writeFileSync(join(SALIDA, 'respuestas', archivo), cuerpo);
    bitacora.consultas.push({
      route_id: r.route_id, ruta: r.data_ruta, direccion, archivo,
      consultado: ahora(), intentos: intento, status: res?.status ?? null,
      bytes: cuerpo === undefined ? 0 : Buffer.byteLength(cuerpo),
      sha256: cuerpo === undefined ? null : sha(cuerpo), error,
    });
    console.log(`${r.data_ruta} ${direccion === 0 ? 'IDA' : 'REGRESO'}: ${res?.status ?? 'ERROR'} ${cuerpo?.length ?? 0} car.`);
    await espera(PAUSA_MS);
  }
}

writeFileSync(join(SALIDA, 'bitacora.json'), JSON.stringify(bitacora, null, 2));
console.log(`LISTO: ${bitacora.consultas.length} consultas → ${SALIDA}`);
