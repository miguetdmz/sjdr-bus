# D-56 fase 2 · Construcción: diferencias contra la maqueta y contra v0.2 (lecciones 13 y 14)

Criterios: `criterios.md`. Capturas de la app en esta carpeta (390 × 844, 320 × 640 y
1280 × 800) y lado a lado con la maqueta en `comparacion/`.

## Datos
- Descarga única de Overpass (22 nov 2026, 9:57 pm, según `consultado.txt` de la
  descarga): respuesta completa en `referencias/overpass-2026-11-22/` (fuera de git),
  sha256 `aee71d99…dd300f`. Revisada en busca de llaves (lección 8): ninguna; las dos
  coincidencias del filtro eran «Secretaría de Educación Pública» y «Secretaria de
  Salud».
- Al repositorio: `datos/cache/overpass/lugares-amplio.json` (extraído por
  `scripts/lugares-amplio.mjs`) y la consulta `lugares-amplio.overpassql`.
  **295 lugares** (296 elementos; se quitó «Universidad Tecnológica Bridge», lección 4).
  Por tipo: Parque 83 · Escuela 41 · Localidad 31 · Templo 24 · Supermercado 15 ·
  Zona industrial 11 · Banco 10 · Cultura 9 · Colonia 8 · Hotel 8 · Plaza comercial 8 ·
  Hospital 7 · Gobierno 7 · Tienda 6 · Servicio público 6 · Mercado 5 ·
  Fraccionamiento 5 · Clínica 5 · Terminal 2 · Deportivo 1 · Centro penitenciario 1 ·
  Barrio 1 · Ciudad 1.
- **Cinépolis sí está**: «Cinepolis» (así, sin acento, en OSM), `way/550793653`, tipo
  Cultura. También «Cinebox».
- `datos/cache/overpass/lugares.json` (R-03) no se tocó: sigue siendo la fuente de los
  extremos de ruta.

## Igual a la maqueta
Catálogo amplio con tipo y fuente; parada más cercana al destino (línea terracota,
nombre a 14 px); «Salgo de otro lugar» como círculo de 52 px con pin y lápiz en el
renglón; opción C (texto chico debajo, nombre de tu parada a 10.5 px); «¿Desde dónde
sales?» con cancelar y «Buscar mi parada más cercana»; «Sales de …» y el círculo verde
como «usar mi ubicación»; en el mapa, punto con etiqueta debajo y sin línea; leyenda
«Lugares: OpenStreetMap, consulta del 22 nov 2026.».

## Diferencias que se ven (ninguna es un cambio por cuenta propia)
1. **Más resultados** en las listas: es la descarga nueva (la maqueta usaba 79 lugares).
2. **Campo con un nombre largo:** a 390 px la app corta «…de Zona 3» y la maqueta lo
   mostraba completo. Causa medida: el campo de búsqueda del navegador reserva ~14 px
   para su botón de borrar (texto 248 px, campo 249 px). La maqueta ya lo anotaba («en
   la app el campo es un input de una línea; el texto largo se corta igual») y a 320 px
   también cortaba. Se deja así.
3. **Leyenda «estimado · distancia en línea recta…»:** en la app se ve siempre, como en
   v0.2; en la maqueta solo con destino. No es parte del pedido: se dejó como v0.2.
4. **Encuadre del mapa en computadora:** un poco más cerca que la maqueta; es la
   función de encuadre que la app ya usaba (v0.2), sin cambio.
5. **Nombres repetidos en OSM:** como la maqueta, el catálogo no repite nombres
   (primero los de ruta). Con la descarga nueva hay 19 nombres repetidos (p. ej.
   «Bodega Aurrera» ×3, bancos, «Área verde» ×4, «Anónimo» ×4): de cada uno se ve el
   primero. **Pregunta para Miguel** (no se aplicó).

## Lo que no cambia
Pestaña «Rutas», tarjetas, detalle, zoom, círculo «mi ubicación», bienvenida y pie.
Un destino que es inicio o fin de ruta sigue como zona (v0.2).

## Inventario de selectores (lección 13)
`web/src/estilos.css`: 186 antes, 208 después. **Ninguno desapareció.** 22 nuevos, todos
bajo la marca «D-56f2»: `.otra.salida-otra`, `.fila-salida`, `.fila-salida .ubicacion`,
`.fila-salida .parada-hallada`, `.nota-parada`, `.parada-hallada.f2 .ver-parada small`,
`.parada-hallada.f2 .ver-parada b`, `.campo.salida`, `.campo .quitar`,
`.titulo-seccion.f2`, `.elegir-salida`, `.elegir-salida > .ubicacion`, `.resultados-f2`,
`.resultado .tipo`, `.resultado .tipo.extremo`, `.ver-parada.destino`,
`.ver-parada.destino .flecha`, `.ver-parada.destino:focus-visible`, `.pin-lugar`,
`.pin-lugar span`, `.pin-lugar.salida span`, `.pin-lugar.destino span`.
`.resultado .icono` se queda en el CSS aunque las filas ya usan `.tipo`.

## Pruebas
- Nuevas: `scripts/pruebas/lugares.test.mjs` (9) y `pruebas-navegador/d56f2.spec.mjs`
  (11: cinco a 390, cinco a 320 y una a 1280).
- **Antes del cambio (lección 15):** fallaban 11 de 11 en navegador y 5 de 9 de datos
  (las 4 que pasaban revisan la descarga, que ya estaba hecha).
- **Con defectos puestos a propósito, cada uno atrapado:** nombre a 14 px (2 fallas),
  círculo fuera del renglón (7), parada equivocada en el destino (2), línea a pie
  entre el lugar y su parada (2), texto chico dentro de la línea (2), farmacia en los
  datos (3 de datos).
- Pruebas de antes que se ajustaron, solo por lo que agrega el pedido:
  `pruebas-navegador/d57.spec.mjs` usaba `.campo` (ahora hay dos campos: se usa el del
  destino) y «la primera `.parada-toque`» (ahora el destino trae su propia parada, con
  clase `parada-destino`: se mide la tuya). La regla que revisan no cambió.
  `scripts/pruebas/tarjetas.test.mjs` (regla 9) pedía un solo campo de texto: ahora son
  dos, «¿A dónde quieres ir?» y «¿Desde dónde sales?», ambos sobre el catálogo
  guardado (ninguno elige ruta). `scripts/pruebas/detalle.test.mjs` (sin trazo) permitía
  hasta 4 tipos de marcador: ahora 5, con el lugar elegido de OSM (punto y etiqueta en
  un solo marcador). La prohibición de `polyline`, `polygon`, `circleMarker` y
  `geoJSON` sigue igual: por eso el punto del lugar es un ícono redondo y no un
  `circleMarker` como en la maqueta (se ve igual; comparado en `comparacion/`).
