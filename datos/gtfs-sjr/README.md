# GTFS-SJR

Feed GTFS propio de las rutas de autobús de San Juan del Río, Qro. Es el
activo principal del proyecto: la app solo lee lo que hay aquí.

Reglas (detalle en `docs/HANDOFF.md` §11):
- Cada archivo declara su fuente y su fecha (hora de México, D-09).
- Nivel de precisión A/B/C por tramo; la etiqueta pública es el más bajo.
- Todo lo que venga de un servicio público (OSRM, Nominatim, Overpass) se
  guarda aquí con su fecha y nunca se vuelve a pedir.
- Ninguna versión se publica sin pasar el validador de MobilityData.
- Todo cambio se anota en `CHANGELOG.md`.

Estado: en construcción (bloque B1). Archivos actuales:

| Archivo | Contenido | Fuente |
|---|---|---|
| `agency.txt` | Una agencia genérica: los concesionarios de San Juan (por verificar) | Tarea N-05 |
| `routes.txt` | Las 42 rutas del inventario, en su orden | HANDOFF §4 (listado oficial) |
| `calendar.txt` | Servicio diario, por verificar | Tarea N-05 |
| `feed_info.txt` | Editor, versión y vigencia del feed | Tarea N-05 |
| `stops.txt` | 49 paradas que ya existían en OSM, POR VERIFICAR EN CAMPO, sin ruta asignada | OpenStreetMap (Overpass, 18 nov 2026), tarea N-08; caché en `datos/cache/overpass/`; se arma con `node scripts/paradas-osm.mjs` |

Para armar el ZIP y pasarlo por el validador: `npm run empaquetar` (deja el
ZIP en `dist/`, que no se sube a git). Hoy el validador marca 2 errores
conocidos: faltan `trips.txt` y `stop_times.txt`, que no se inventan (ver
`CHANGELOG.md`).

La ficha de estado de cada ruta (grupo, nivel de precisión, fuente y fecha)
está en `datos/fichas/rutas.json`.
