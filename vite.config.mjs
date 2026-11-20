// Configuración de Vite (D-04): la app vive en web/ y se compila a web/dist/.
// La app solo lee archivos ya construidos del repositorio (web/public/datos/);
// nunca consulta OSRM, Nominatim ni Overpass.
import { defineConfig } from 'vite';
import { readFileSync, writeFileSync } from 'node:fs';

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

export default defineConfig({
  root: 'web',
  base: './',
  plugins: [guardadoExtremos],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
