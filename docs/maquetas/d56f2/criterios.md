# D-56 fase 2 · Criterios de la maqueta (escritos antes de hacerla)

Pedido (D-56, orden aprobado por Miguel el 20 nov 2026): catálogo amplio de lugares
de OpenStreetMap, la parada más cercana a ti y al destino (distancia en línea recta,
ESTIMADO) y editar la dirección de salida (D-57). Maqueta primero (D-54).

La maqueta parte de `docs/maquetas/d62/maqueta.html` (lo aprobado y publicado en v0.2)
y cambia **solo la pestaña «Calcula tu ruta»** (lección 14).

## Criterios
1. **Solo lo pedido.** Fuera de la pestaña «Calcula tu ruta», ninguna vista cambia.
   No desaparece ningún selector de estilos de la maqueta de D-62 (lección 13); las
   reglas nuevas llevan la marca «D-56f2».
2. **Datos reales, nada inventado.** Los lugares salen de
   `datos/cache/overpass/lugares.json` (OSM, consulta del 19 nov 2026) con su huella
   sha256; ninguna coordenada prohibida de `scripts/reglas.mjs`. Cada lugar muestra su
   tipo en español y «OpenStreetMap». La maqueta dice que la versión construida trae
   una descarga nueva y más amplia (regla 7: al construir el dato, con caché).
3. **Editar la salida sin geocodificar en vivo.** Se escribe desde dónde sales y se
   elige de la misma lista guardada; ningún servicio en vivo (regla 7).
4. **Parada más cercana a la salida y al destino**, cada una con su distancia «en
   línea recta» y «por verificar»; tocarla lleva al mapa y abre su ficha (como D-57).
5. **Límite honesto (regla 1).** Sin línea de camino a pie, sin «toma esta ruta» ni
   «bájate en…»; sigue la leyenda «Próximamente…».
6. **Cabe y no se encima** a 390 × 844, 320 × 640 y 1280 × 800: sin scroll de lado
   y sin textos cortados (medido con script, no a ojo; lección 5).
7. **Lista de diferencias** contra la app de hoy, una por una, en `inventario.md`;
   toda diferencia que no salga del pedido va como pregunta, no como cambio.
