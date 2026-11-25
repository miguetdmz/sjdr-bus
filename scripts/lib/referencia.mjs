// D-70 (Miguel, 25 nov 2026): la referencia del inventario son las rutas de San Juan que
// lista qrobus.gob.mx/Rutas (copia extraída del 19 nov 2026, con su huella en
// datos/cache/qrobus/rutas.meta.json; revisada contra la página el 25 nov 2026: mismas 42).
// Las pruebas cuentan contra esta lista, no contra un número fijo (lección 11): como medir
// contra la pieza patrón y no contra la medida que salió ayer.
import { readFileSync } from 'node:fs';

const cache = JSON.parse(readFileSync(new URL('../../datos/cache/qrobus/rutas-sjr.json', import.meta.url), 'utf8'));

// Números de ruta tal cual los escribe la página («001», «024C», «23»).
export const REFERENCIA = cache.map((r) => r.data_ruta);

// Reglas de HANDOFF que no son conteos del día: 2 intermunicipales (062 y 023, D-19) y
// 10 rutas con ficha verificada (§5.1). Lo demás se deduce de la referencia.
export const INTERMUNICIPALES = 2;
export const VERIFICADAS = 10;
export const URBANAS = REFERENCIA.length - INTERMUNICIPALES;
export const SOLO_INVENTARIO = REFERENCIA.length - VERIFICADAS;
