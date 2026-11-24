# D-56 fase 2 · Diferencias contra la app de hoy (v0.2) · lección 14

Maqueta: `maqueta.html` (parte de `../d62/maqueta.html`). Abrir con `?vista=`:
`f2-inicio`, `f2-buscar`, `f2-destino`, `f2-salida`, `f2-completo`, `f2-mapa`.
Capturas en `capturas/` a 390 × 844, 320 × 640 y 1280 × 800.

## Lo que cambia (todo sale del pedido de D-56 fase 2)
1. **Catálogo amplio** (pedido 1). «¿A dónde quieres ir?» busca en los lugares de
   inicio y fin de ruta (como hoy) **y** en lugares con nombre de OpenStreetMap.
   Cada fila dice su tipo y su fuente: «Hospital · OpenStreetMap»; las de ruta siguen
   con «Inicio o fin de ruta · zona aproximada». Vista `f2-buscar` (con «imss» salen 3).
2. **Parada más cercana al destino** (pedido 2). Al elegir el destino aparece una
   línea nueva, igual al botón de D-57 pero en color de destino (terracota):
   «Parada del Seguro de Kimberly · a 80 m / Parada más cercana a tu destino · en
   línea recta · por verificar». Al tocarla, como en D-57: el mapa va a la parada y
   abre su ficha. Vistas `f2-destino` y `f2-mapa`.
3. **Editar desde dónde sales** (pedido 3, D-57). **Ajuste de Miguel (22 nov 2026,
   9:18 pm):** «Salgo de otro lugar» es **otro círculo de 52 px en el mismo renglón**
   que tu parada y el botón de ubicación, con un ícono (pin con lápiz), sin texto; de
   contorno para no confundirlo con el del GPS. Antes de ubicarte va al lado de «Buscar
   mi parada más cercana». Abre «¿Desde dónde sales?» y se elige de la misma lista
   guardada (sin geocodificar en vivo, regla 7). Ya elegido: arriba dice «Sales de
   Mercado 5 de mayo» y el círculo verde cambia a «usar mi ubicación».
   **Opción C (Miguel, 9:25 pm),** porque con tres en el renglón la línea crecía (medido:
   119 px a 390 y 179 px a 320, contra 59 y 102 de hoy): el texto chico («Tu parada más
   cercana · en línea recta · por verificar» o «Cerca de tu salida · …») pasa debajo
   del renglón, a todo el ancho, y el nombre de la parada baja 25 % (14 → 10.5 px).
   Resultado: 52 px a 390 y 52 a 76 px a 320. Solo en este renglón; la línea de la
   parada del destino no cambia. Vistas `f2-inicio`, `f2-destino`, `f2-salida` y
   `f2-completo`. Opciones descartadas: A (tal cual, 179 px a 320) y B (círculos de
   44 px, casi no ayudaba).
4. **Mapa.** Con salida y destino: un punto con etiqueta para cada lugar (etiqueta
   debajo del punto, para no tapar el ícono de la parada) y sus dos paradas. **Sin
   línea entre ellos** (regla 1: el camino a pie es la fase 3).
5. **Leyenda nueva:** «Lugares: OpenStreetMap, consulta del 19 nov 2026», con la
   aclaración de que la maqueta usa los 79 lugares ya guardados.

## Lo que NO cambia
- Pestaña «Rutas», tarjetas, detalle, mapa, zoom, círculo «mi ubicación», bienvenida
  y pie: idénticos a D-62. Las vistas `destino` y `ubicado` de D-57 siguen iguales.
- Inventario de estilos (lección 13): de 163 selectores de D-62 no desaparece
  ninguno; los nuevos llevan la marca «D-56f2».
- Las vistas `destino` y `ubicado` (D-57, como está publicado) conservan su línea de
  14 px con el texto chico dentro (medido: 59 px a 390).

## Datos de la maqueta (reales, regla 1)
- Lugares: `lugares-maqueta.js`, de `datos/cache/overpass/lugares.json` (OSM, 19 nov
  2026), 79 de 80: se quitó «Universidad Tecnológica Bridge» (lección 4).
- Ubicación de muestra: Centro (como D-57). Salida escrita de muestra: Mercado 5 de
  mayo. Destino de muestra: IMSS Hospital General de Zona 3.
- Distancias: en línea recta (haversine). ESTIMADO, por verificar en campo.

## Al construir (con el sí de Miguel), no antes
- **Descarga nueva de lugares** de OpenStreetMap (Overpass, una vez, con caché en el
  repositorio; regla 7; $0): plazas, tiendas, escuelas, templos, bancos, parques,
  cines… La lista de tipos se le muestra a Miguel antes de descargar.
- El catálogo crece de 80 a [sin verificar: cuántos hay en OSM para San Juan del Río;
  se sabe al descargar].

## Preguntas para Miguel (no se aplicaron)
1. Respondida (9:18 y 9:25 pm): círculo con ícono en el renglón, opción C.
2. ¿La línea de la parada del **destino** también lleva el nombre a 10.5 px? Respuesta
   de Miguel (22 nov 2026, 9:33 pm): «No, déjala así». Se queda a 14 px.
3. Observación, sin cambio: a 320 px el botón de D-57 «Buscar mi parada más cercana»
   ya ocupa dos renglones (así está publicado en v0.2).

## Medición (`capturar.mjs`)
24 vistas (6 nuevas + 2 de D-57, en 3 anchos): sin scroll de lado, sin textos
cortados y sin errores de la página: **fail 0**. Con un defecto puesto a propósito
(en la primera versión: el botón con texto «Salgo de otro lugar» angosto) la medición marcó 13 fallas (lección 15). Tras el ajuste de las 9:25 pm, otra vez fail 0.
