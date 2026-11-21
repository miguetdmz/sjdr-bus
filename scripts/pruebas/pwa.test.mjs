// M-07: app instalable. Manifiesto con nombre «SJDR Bus» (D-28), íconos propios con
// la paleta de D-30 y service worker que guarda la app y sus datos, no las teselas.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const leer = (r) => readFileSync(new URL(`../../web/${r}`, import.meta.url));
const manifiesto = JSON.parse(leer('public/manifest.webmanifest'));
const html = leer('index.html').toString();
const sw = leer('sw-plantilla.js').toString();
const main = leer('src/main.ts').toString();

// Lado de un PNG: ancho y alto vienen en la cabecera IHDR.
function ladoPNG(buf) {
  assert.equal(buf.subarray(1, 4).toString(), 'PNG');
  return [buf.readUInt32BE(16), buf.readUInt32BE(20)];
}

test('pwa: manifiesto con nombre «SJDR Bus» y color verde azulado de D-30', () => {
  assert.equal(manifiesto.name, 'SJDR Bus');
  assert.equal(manifiesto.short_name, 'SJDR Bus');
  assert.equal(manifiesto.theme_color, '#0d7a72');
  assert.equal(manifiesto.display, 'standalone');
  assert.doesNotMatch(JSON.stringify(manifiesto), /qrob[uú]s|ameq|nombre provisional/i);
  assert.match(html, /<link rel="manifest" href="\.\/manifest\.webmanifest"/);
  assert.match(html, /<meta name="theme-color" content="#0d7a72"/);
});

test('pwa: íconos propios en SVG y PNG, con su tamaño real', () => {
  const tipos = new Set(manifiesto.icons.map((i) => i.type));
  assert.ok(tipos.has('image/svg+xml') && tipos.has('image/png'));
  assert.ok(manifiesto.icons.some((i) => i.purpose === 'maskable'));
  for (const i of manifiesto.icons) {
    const archivo = leer(`public/${i.src}`);
    if (i.type === 'image/png') {
      const [ancho, alto] = ladoPNG(archivo);
      assert.equal(`${ancho}x${alto}`, i.sizes, i.src);
    }
  }
  assert.deepEqual(ladoPNG(leer('public/iconos/apple-touch-icon.png')), [180, 180]);
});

test('pwa: el dibujo usa solo la paleta propia (camión blanco sobre #0d7a72), sin escudo', () => {
  for (const svg of ['public/iconos/icono.svg', 'public/iconos/icono-maskable.svg']) {
    const texto = leer(svg).toString().replace(/<!--[\s\S]*?-->/g, '');
    const colores = new Set((texto.match(/#[0-9a-f]{3,6}\b/gi) ?? []).map((c) => c.toLowerCase()));
    assert.deepEqual([...colores].sort(), ['#0d7a72', '#fff'], svg);
    assert.doesNotMatch(texto, /<image|href=|escudo/i, svg);
  }
});

test('pwa: el service worker guarda solo la app y sus datos, nunca las teselas', () => {
  assert.match(sw, /url\.origin !== self\.location\.origin\) return;/);
  const codigo = sw.replace(/^\s*\/\/.*$/gm, '');
  assert.doesNotMatch(codigo, /openstreetmap|tile/i);
  assert.match(sw, /__ARCHIVOS__/);
  assert.match(main, /serviceWorker\.register\('\.\/sw\.js'\)/);
  assert.match(main, /import\.meta\.env\.PROD/);
});
