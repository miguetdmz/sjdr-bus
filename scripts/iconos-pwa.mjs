#!/usr/bin/env node
// M-07: arma los íconos PNG de la app instalable a partir de los SVG propios de
// web/public/iconos/. Como sacar copias de un plano maestro en varios tamaños:
// el SVG es el original y los PNG se vuelven a imprimir desde él.
//
// Usa el Chromium de Playwright (@playwright/test, Apache-2.0, gratuito) solo para convertir el
// dibujo; no descarga nada de internet. Los PNG se guardan en el repositorio, así
// que este script solo se corre cuando cambia el dibujo.
//
// Uso: node scripts/iconos-pwa.mjs
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const raiz = fileURLToPath(new URL('..', import.meta.url));
const dir = join(raiz, 'web/public/iconos');
const { chromium } = createRequire(import.meta.url)('@playwright/test');

const SALIDAS = [
  ['icono.svg', 'icono-192.png', 192],
  ['icono.svg', 'icono-512.png', 512],
  ['icono-maskable.svg', 'icono-maskable-512.png', 512],
  ['icono-maskable.svg', 'apple-touch-icon.png', 180],
];

const navegador = await chromium.launch();
try {
  for (const [origen, destino, lado] of SALIDAS) {
    const svg = readFileSync(join(dir, origen), 'utf8');
    const pagina = await navegador.newPage({ viewport: { width: lado, height: lado }, deviceScaleFactor: 1 });
    await pagina.setContent(
      `<html><body style="margin:0;background:transparent"><img style="display:block;width:${lado}px;height:${lado}px" src="data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}"></body></html>`,
    );
    await pagina.screenshot({ path: join(dir, destino), omitBackground: true });
    await pagina.close();
    console.log(`ÍCONO: ${destino} (${lado} × ${lado})`);
  }
} finally {
  await navegador.close();
}
