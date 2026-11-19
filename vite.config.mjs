// Configuración de Vite (D-04): la app vive en web/ y se compila a web/dist/.
// La app solo lee archivos ya construidos del repositorio (web/public/datos/);
// nunca consulta OSRM, Nominatim ni Overpass.
import { defineConfig } from 'vite';

export default defineConfig({
  root: 'web',
  base: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
