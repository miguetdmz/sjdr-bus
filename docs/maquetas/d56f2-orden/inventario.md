# D-56 fase 2 · Maqueta «Orden de resultados y nombres repetidos» · diferencias (lección 14)

**Pedido (Miguel, 23 nov 2026, 2:59 pm):** «Sí, haz la maqueta» de la fase 1 recomendada.
Base: `../d56f2-resultados/maqueta.html` (aprobada el 22 nov, 10:40 pm), copiada.
Criterios: `criterios.md`. Vistas: `?vista=f2-buscar&q=plaza` (con `&yo=1`, ya ubicado;
con `&orden=hoy`, la lista de antes) y `?vista=f2-salida&q=bana`.

## Lo que cambia (todo sale del pedido)
1. **Orden de la lista** (o1): primero los nombres que empiezan con lo escrito, luego los
   que tienen una palabra que empieza así, al final los que solo lo contienen; dentro de
   cada grupo, los de inicio o fin de ruta y luego por tipo (lista en `criterios.md`,
   **PROPUESTA**); al final, alfabético.
2. **El mismo lugar dibujado dos veces en OSM se ve una vez** (o2): mismo nombre a 100 m o
   menos. Quita 12 dobles, p. ej. «Parque Héroes de Nacozari» (18 m), «Plaza Santa Cruz
   Nieto» (2 m).
3. **Repetidos que son lugares distintos se ven todos con su distancia** (o3): «Bodega
   Aurrera» ×3, «Banamex» ×2, «BBVA» ×2, «Elektra» ×2, «Santo Domingo» ×2, «Parque
   Principal» ×2. Antes se veía solo el primero. La distancia va en el texto chico y
   brinca de renglón completa («· a 1.4 km de ti»), nunca partida.
4. Igual en «¿Desde dónde sales?» (o4).

## Lo que no cambia
5 visibles y «Ver 5 más», filas, íconos, tipos, fuente, colores, la parte de arriba y el
mapa. La leyenda dice lo mismo; solo el pie dice «Orden de resultados» (nombre de la
maqueta).

## Medido con los datos (no es un cambio)
- Lo que se ve primero con «plaza»: hoy «La parroquia Plaza» (parque); con el orden nuevo,
  «Plaza Punta Victoria» y «Plaza Santa Cruz Nieto» (plazas comerciales).
- Con «parque» salen primero los parques industriales (zona industrial va antes que parque
  en la lista de tipos y su nombre empieza con «parque»). Si se quiere al revés, es mover
  «Parque» en la lista de tipos.

## Preguntas para Miguel (no se aplicaron)
1. **La lista de tipos** (orden de importancia): es una propuesta.
2. **Sin tu ubicación**, los repetidos dicen «a 1.4 km del Centro» (el «Centro» de inicio
   o fin de ruta). Alternativa: sin distancia hasta que te ubiques.
3. **«Anónimo» ×4 y «Área verde» ×3 (ya juntados los de ≤ 100 m):** nombres genéricos de OSM (parques sin nombre real).
   Hoy aparecen si alguien escribe «anon» o «area»; se pueden quitar del catálogo.
4. **Tipos mal puestos en OSM** (p. ej. «Mercado Juárez» marcado como supermercado, «Plaza
   Agua Rica» como parque): el orden por tipo los acomoda según lo que dice OSM.

## Medición (`capturar.mjs`)
6 búsquedas × 3 anchos (390 también con el orden de hoy): sin scroll de lado, sin textos
cortados, sin errores y con las reglas o1–o4 revisadas sobre las filas: **fail 0**.
Con defectos puestos a propósito (lección 15): sin juntar el mismo lugar → fail 3; sin
distancia en los repetidos → fail 9; solo alfabético → fail 6.
Capturas en `capturas/`; lado a lado: `comparacion-390.jpg` (hoy | nuevo) y
`nuevo-320.jpg`.
