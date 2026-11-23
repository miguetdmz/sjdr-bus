// Ayudas comunes de las pruebas en navegador. Desde D-53 no hay desplegable: la
// ruta se elige tocando su tarjeta en el menú, como lo hace la persona.
import { readFileSync } from 'node:fs';

export const leerDatos = (archivo) => JSON.parse(readFileSync(new URL(`../web/dist/datos/${archivo}`, import.meta.url), 'utf8'));
export const insignia = (r) => `${r.tipo === 'intermunicipal' ? 'T' : 'R'}${r.numero.replace(/^0+(?=\d)/, '')}`;

export async function abrirMenu(page) {
  if ((await page.locator('#hoja').getAttribute('class')).includes('cerrada')) await page.locator('#boton-menu').click();
}

// Abre el menú en «Rutas», vuelve a las tarjetas si ya había ruta y toca la tarjeta.
export async function elegirRuta(page, id) {
  await abrirMenu(page);
  await page.locator('#pestana-rutas').click();
  if (await page.locator('#ruta-elegida').isVisible()) await page.locator('#cambiar-ruta').click();
  await page.locator(`#tarjetas .tarjeta-ruta[data-ruta="${id}"]`).click();
}

export const sentido = (page, i) => page.locator('#segmento label').nth(i).click();

// ¿El centro de la caja de `selector` lo ocupa el propio elemento (nada lo tapa)?
export async function sinTapar(page, selector) {
  const caja = await page.locator(selector).boundingBox();
  return page.evaluate(
    ({ x, y, selector: s }) => document.elementFromPoint(x, y)?.closest(s) !== null,
    { x: caja.x + caja.width / 2, y: caja.y + caja.height / 2, selector },
  );
}

// Peticiones de red que no son teselas del mapa, contadas desde que la app terminó
// de arrancar. La app pide sus propios archivos al abrir (rutas, paradas y, desde
// D-56 fase 2, lugares.json después de rutas); si la prueba empieza a contar antes,
// uno de esos archivos puede caer durante el toque y parecer causado por él (falló
// así al subir, 23 nov 2026). Se espera a que la red quede quieta y luego se cuenta.
export async function vigilarRed(page) {
  await page.waitForLoadState('networkidle');
  const vistas = [];
  page.on('request', (r) => {
    if (!/tile\.openstreetmap\.org/.test(r.url())) vistas.push(r.url());
  });
  return vistas;
}
