// M-08: pruebas en navegador (Playwright, Apache-2.0) a 390 px de ancho.
// Prueban la app ya compilada (web/dist), servida en local con «vite preview».
// Las teselas del mapa se bloquean en las pruebas: no se descargan teselas de
// OpenStreetMap en cada corrida (HANDOFF §11.6).
import { defineConfig } from '@playwright/test';

const PUERTO = 4317;

export default defineConfig({
  testDir: 'pruebas-navegador',
  timeout: 30_000,
  retries: 0,
  workers: 1,
  reporter: [['list']],
  use: {
    baseURL: `http://localhost:${PUERTO}/`,
    browserName: 'chromium',
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 1,
    hasTouch: true,
    isMobile: true,
    locale: 'es-MX',
    trace: 'off',
    serviceWorkers: 'block',
  },
  webServer: {
    command: `npx vite preview --port ${PUERTO} --strictPort`,
    url: `http://localhost:${PUERTO}/`,
    reuseExistingServer: false,
    timeout: 30_000,
  },
});
