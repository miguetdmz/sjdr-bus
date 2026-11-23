# D-56 fase 2 · Ajuste «Resultados» · diferencias contra la maqueta aprobada (lección 14)

**Pedido (Miguel, 22 nov 2026, 10:23 pm):** que la lista no se llene de relleno.
**Hallazgo:** los destinos buscados no se guardan en el teléfono (solo «Tus rutas
recientes», hasta 3, y la bienvenida). El riesgo real es doble: el título «Lugares
guardados» se lee como historial del usuario, y algunas búsquedas traen listas
largas («parque»: 33 resultados en el catálogo de la app).

Maqueta: `maqueta.html` (copia de `../d56f2/`, aprobada). Vistas `?vista=f2-buscar`,
`f2-vermas`, `f2-salida`, `f2-destino`, `f2-completo`. Capturas a 390 × 844,
320 × 640 y 1280 × 800 en `capturas/`; tira `capturas/resumen-390.jpg`.

## Lo que cambia (todo sale del pedido)
1. El título «Lugares guardados» pasa a **«Resultados»** (también con el destino ya
   elegido).
2. La lista enseña **los primeros 5**. Si hay más, abajo un botón **«Ver 5 más · quedan
   N»** (contorno suave, sin fondo); cada toque agrega 5. Aplica igual a «¿Desde dónde
   sales?».

## Lo que no cambia
Todo lo demás de la maqueta aprobada: filas, tipos, fuente, parada del destino,
«Salgo de otro lugar», opción C, mapa. El orden de la lista es el de hoy: primero los
de inicio o fin de ruta y luego los de OSM en orden alfabético.

## Alineado con lo construido (no es un cambio de pantalla)
- Lugares: los 295 de la descarga del 22 nov (la maqueta aprobada usaba 79).
- La leyenda ya no dice «Maqueta: 79 lugares…», igual que la app construida.

## Observación (pregunta para después, no se aplicó)
Con el límite de 5, el orden decide qué se ve primero. Con «parque» salen primero
«Nuevo Parque Industrial» y «Parque Industrial» (de ruta) y luego alfabético, no los
parques más conocidos ni los más cercanos.

## Medición (`capturar.mjs`)
15 vistas (5 en 3 anchos): sin scroll de lado, sin textos cortados y sin errores:
**fail 0**. Con un defecto puesto a propósito (botón «Ver más» de 120 px) marcó
**fail 6** (lección 15).
