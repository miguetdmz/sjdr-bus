// R-03 (D-34): prepara los archivos de la página de extremos que se publica
// como artifact privado de Miguel en Claude (19 nov 2026). En un artifact no
// cargan las teselas de OpenStreetMap (solo imágenes data:/blob:), así que el
// fondo se dibuja con las calles de datos/cache/overpass/calles.json (D-32).
// Uso: node scripts/artifact-extremos.mjs  → herramientas/extremos-artifact/datos/
import { mkdirSync, readFileSync, writeFileSync, copyFileSync } from 'node:fs';

const destino = 'herramientas/extremos-artifact/datos';
mkdirSync(destino, { recursive: true });

const calles = JSON.parse(readFileSync('datos/cache/overpass/calles.json', 'utf8'));
// [nombre, tipo, [[lat, lon], ...]] con 5 decimales, tal como vienen.
writeFileSync(`${destino}/calles.json`, JSON.stringify(calles.tramos.map((t) => [t.nombre, t.tipo, t.trazo])));

const lugares = JSON.parse(readFileSync('datos/cache/overpass/lugares.json', 'utf8'));
writeFileSync(`${destino}/lugares.json`, JSON.stringify(lugares.lugares.map((l) => [l.nombre, l.centro])));

const propuestas = JSON.parse(readFileSync('datos/investigacion/extremos-propuestas.json', 'utf8'));
writeFileSync(`${destino}/propuestas.json`, JSON.stringify(propuestas.lugares));

copyFileSync('node_modules/leaflet/dist/leaflet.css', `${destino}/leaflet.css`);
console.log(`artifact-extremos: ${calles.tramos.length} tramos, ${lugares.lugares.length} lugares, ${propuestas.lugares.length} extremos.`);
