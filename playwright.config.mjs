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
    // D-55: las pruebas de antes revisan la pantalla con la bienvenida ya cerrada
    // (como la ve quien ya la leyó). pruebas-navegador/d55.spec.mjs la revisa
    // desde cero, sin nada guardado.
    storageState: {
      cookies: [],
      origins: [{ origin: `http://localhost:${PUERTO}`, localStorage: [{ name: 'sjdrbus.bienvenida', value: '1' }] }],
    },
  },
  webServer: {
    command: `npx vite preview --port ${PUERTO} --strictPort`,
    url: `http://localhost:${PUERTO}/`,
    reuseExistingServer: false,
    timeout: 30_000,
  },
});
