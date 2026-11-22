# D-53 · Criterios de aceptación de la construcción

Escritos el 20 nov 2026 a las 8:47 pm, **antes** de tocar `web/`. La referencia
visual es la maqueta aprobada (`docs/maquetas/d53/`, 7:04 pm). Cada criterio se
revisa con una prueba que mide la regla, no el dato del día (lección 11).

Pruebas: `pruebas-navegador/d53.spec.mjs` (navegador, 390 y 1280 px) y
`scripts/pruebas/destino.test.mjs` y `tarjetas.test.mjs` (lógica).

## (a) Sin desplegable; sentido dentro del menú; pestañas arriba; mapa completo

- a1. No hay `<select>` en la app (ni en `index.html` ni creado desde el código).
- a2. Al cargar, el menú está cerrado y sobre el mapa solo están: ☰, «¿A dónde
  quieres ir?», el botón de paradas y el pie legal. La barra de arriba no pasa
  de la quinta parte del alto (390 × 844). Sin scroll de página.
- a3. Ida / Vuelta solo existen dentro del detalle de la ruta, en el menú.
- a4. Las pestañas «Rutas» y «Calcula tu ruta» quedan arriba del cuerpo del
  menú (en 390 y 1280) y miden al menos 44 px.
- a5. Tocar una tarjeta abre el detalle; al cerrar el menú queda abajo el aviso
  de la ruta elegida con su insignia, el nombre y «Ver detalle», que vuelve a
  abrir el detalle. El mapa muestra las zonas de inicio y fin y ninguna línea.
- a6. En 1280 con el menú abierto, el mapa empieza donde termina el menú.

## (b) Botón redondo de paradas; parada como círculo levantado

- b1. Al cargar no hay paradas en el mapa; el botón redondo mide al menos 44 px
  y dice que está apagado (`aria-pressed="false"`).
- b2. Al presionarlo aparecen todas las paradas de `paradas.json`, cada una con
  el círculo levantado, el camión adentro y la guía de puntitos; el botón queda
  encendido y sale el aviso «N paradas de OpenStreetMap · por verificar en
  campo». Al presionarlo otra vez se van.
- b3. Tocar una parada abre su ficha con «POR VERIFICAR EN CAMPO» y «Fuente:
  OpenStreetMap».
- b4. Ninguna línea une paradas (cero trazos en el mapa).

## (c) Tarjetas chicas, sin «Ruta 001», 20 colores AA, insignia grande

- c1. «Ruta 001» (número oficial de 3 dígitos) no aparece en ninguna pantalla
  ni en lo que lee el lector de pantalla, con ninguna ruta ni sentido.
- c2. Rotación de 20 colores; todos con contraste AA (≥ 4.5) del texto sobre
  el fondo y de la insignia sobre el camioncito blanco; dos urbanas seguidas
  nunca del mismo color; las intermunicipales con su color aparte.
- c3. A 390 px caben a la vista más tarjetas que con D-52 (al menos 15).
- c4. La insignia del aviso de ruta elegida es más grande que la de la tarjeta.
- c5. La tarjeta y el encabezado del detalle tienen el mismo color (lección 3).

## (d) Pie legal único, chico, verde y sin fondo; avisos discretos

- d1. Un solo pie con: iniciativa independiente, no oficial, «datos en proceso
  de validación» y la atribución de Leaflet y OpenStreetMap (enlaces). Letra
  en el verde de la app, sin fondo. No queda la atribución suelta de Leaflet.
- d2. El pie se ve y no lo tapa nada: 390 con menú cerrado y abierto, y 1280.
- d3. El aviso de paradas va sin recuadro, en verde y en letra chica (≤ 11 px).
- d4. «estimado» va en minúscula en las leyendas y en el aviso de ruta.

## (e) «¿A dónde quieres ir?»

- e1. El botón de arriba abre el menú en «Calcula tu ruta» con el campo listo
  para escribir.
- e2. Buscar usa solo el catálogo guardado (lugares de inicio y fin de
  `rutas.json`): escribir no hace ninguna petición de red.
- e3. Al elegir un lugar: su zona se marca en el mapa y salen en tarjetas del
  mismo tamaño las rutas que empiezan o terminan a 1 km o menos en línea recta,
  de la más cercana a la más lejana, cada una con su distancia. Tocar una
  tarjeta abre esa ruta.
- e4. (Lógica) Toda ruta listada está a ≤ 1 km y toda ruta a ≤ 1 km está listada.
- e5. «Usar mi ubicación» (con GPS simulado en la prueba) marca tu punto y la
  parada de OpenStreetMap más cercana, con su distancia en línea recta y «por
  verificar en campo». La ubicación no sale del teléfono: cero peticiones de
  red con ella.
- e6. Si el permiso se niega, la app lo dice y sigue funcionando.
- e7. Las leyendas (estimado, próximamente) van juntas al fondo del menú.
- e8. Nunca Nominatim ni OSRM en vivo (ya lo revisa `scripts/reglas.mjs`).

## Fuera de la maqueta (se muestran a Miguel en las capturas antes de subir)

La maqueta no dibujó estos estados; se resuelven con texto mínimo y honesto y
van en las capturas para su visto bueno:
- Búsqueda sin resultados en el catálogo.
- Permiso de ubicación negado o GPS no disponible.
