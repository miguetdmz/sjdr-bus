// Configuración de Vite (D-04): la app vive en web/ y se compila a web/dist/.
// La app solo lee archivos ya construidos del repositorio (web/public/datos/);
// nunca consulta OSRM, Nominatim ni Overpass.
import { defineConfig } from 'vite';
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join, relative } from 'node:path';

// Solo en desarrollo (R-03, D-34): la página de trabajo confirmar-extremos.html
// guarda las respuestas de Miguel en un archivo del repositorio, no en el
// navegador, para que no se pierdan ni dependan de qué navegador se use.
// No forma parte de la compilación de la app.
const ARCHIVO_DECISIONES = 'datos/investigacion/extremos-decisiones.json';
const guardadoExtremos = {
  name: 'guardado-extremos',
  apply: 'serve',
  configureServer(server) {
    server.middlewares.use('/__extremos-decisiones', (req, res) => {
      const leer = () => {
        try { return JSON.parse(readFileSync(ARCHIVO_DECISIONES, 'utf8')); } catch { return { decisiones: {} }; }
      };
      if (req.method === 'GET') {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(leer().decisiones ?? {}));
        return;
      }
      if (req.method === 'POST') {
        let cuerpo = '';
        req.on('data', (c) => { cuerpo += c; if (cuerpo.length > 1e6) req.destroy(); });
        req.on('end', () => {
          try {
            const decisiones = JSON.parse(cuerpo);
            if (typeof decisiones !== 'object' || decisiones === null || Array.isArray(decisiones)) throw new Error('forma');
            const o = leer();
            o.decisiones = decisiones;
            o.respondidos = Object.keys(decisiones).length;
            o.respaldado = new Date().toISOString();
            o.fuente = 'Página de trabajo web/confirmar-extremos.html (guardado automático en este archivo)';
            writeFileSync(ARCHIVO_DECISIONES, JSON.stringify(o, null, 2) + '\n');
            res.end('{"ok":true}');
          } catch {
            res.statusCode = 400;
            res.end('{"ok":false}');
          }
        });
        return;
      }
      res.statusCode = 405;
      res.end();
    });
  },
};

// M-07: arma el service worker (web/sw.js en la compilación) desde
// web/sw-plantilla.js con la lista de archivos de la app: lo que sale de la
// compilación y lo de web/public (datos, manifiesto e íconos). La versión es una
// huella de todo eso: si cambia un dato o el código, la copia guardada se renueva.
// No se guardan teselas del mapa ni nada de otro dominio.
function archivosDe(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? archivosDe(join(dir, e.name)) : [join(dir, e.name)],
  );
}

const serviceWorker = {
  name: 'service-worker',
  apply: 'build',
  generateBundle(_opciones, paquete) {
    const publicos = archivosDe('web/public')
      .map((a) => relative('web/public', a).split('\\').join('/'))
      .filter((a) => !a.startsWith('.') && !a.endsWith('.DS_Store'));
    const compilados = Object.keys(paquete).filter((a) => !a.endsWith('.map'));
    const archivos = ['./', ...[...compilados, ...publicos].sort().map((a) => `./${a}`)];
    const huella = createHash('sha256');
    for (const a of publicos) huella.update(a).update(readFileSync(join('web/public', a)));
    for (const a of compilados.sort()) huella.update(a);
    const version = huella.digest('hex').slice(0, 12);
    const fuente = readFileSync('web/sw-plantilla.js', 'utf8')
      .replace("'__VERSION__'", JSON.stringify(version))
      .replace('__ARCHIVOS__', JSON.stringify(archivos, null, 2));
    this.emitFile({ type: 'asset', fileName: 'sw.js', source: fuente });
  },
};

export default defineConfig({
  root: 'web',
  base: './',
  plugins: [guardadoExtremos, serviceWorker],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
