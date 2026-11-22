# D-57 · Criterios de aceptación de la construcción

Escritos el 20 nov 2026 a las 11:21 pm, **antes** de tocar `web/`. La referencia
es la maqueta aprobada por Miguel a las 11:20 pm (`docs/maquetas/d57/maqueta.html`,
vistas `?vista=destino`, `?vista=ubicado` y `?vista=parada-mapa`; capturas en
`docs/maquetas/d57/capturas/`). Cada prueba revisa la regla, no el dato del día
(lección 11).

Pruebas: `pruebas-navegador/d57.spec.mjs` (390 y 1280 px).

## Orden de la pestaña «Calcula tu ruta»

- p1. Lo primero del cuerpo, arriba de «¿A dónde quieres ir?», es el bloque de la
  parada más cercana. Con un lugar escrito y sus rutas cerca, el bloque sigue a la
  vista sin hacer scroll (en 390 y 1280 px).
- p2. Antes de ubicarte: un solo botón «Buscar mi parada más cercana», de al
  menos 44 px. Ya no está el título «Tu parada más cercana» ni «Usar mi ubicación».

## Ubicado

- p3. Al ubicarte, el botón se vuelve una línea tocable con el nombre de la
  parada (o «Parada sin nombre») y la distancia en línea recta, y abajo «Tu
  parada más cercana · en línea recta · por verificar», más un botón de ícono
  sin texto (con nombre para el lector de pantalla) que vuelve a buscar. Los dos
  miden al menos 44 px. La distancia es la de la parada de `paradas.json` más
  cercana, redondeada como en el resto de la app.
- p4. La nota larga del fondo ya no sale; las leyendas dicen «Tu ubicación no
  sale del teléfono.». Ninguna petición de red al ubicarte (regla 7).
- p5. El botón de ícono vuelve a leer la ubicación y actualiza la línea (con otra
  ubicación de prueba, cambia la parada o la distancia).

## Tocar la parada

- p6. En teléfono: se cierra el menú, el mapa queda centrado en la parada y se
  abre su ficha con «Fuente: OpenStreetMap» y «POR VERIFICAR EN CAMPO».
- p7. En computadora: el menú se queda abierto; el mapa se centra en la parada y
  abre su ficha.

## Errores (no dibujados en la maqueta)

- p8. Sin permiso de ubicación, el aviso sale junto al botón (no hasta el fondo)
  y la app sigue funcionando; el botón vuelve a estar disponible.

## Lo que no cambia (lección 14)

- «¿A dónde quieres ir?», los lugares guardados, las tarjetas de «cerca» y las
  demás leyendas se quedan como en D-53. Las pruebas de `d53.spec.mjs` que leían
  la nota larga se actualizan solo en eso.
