# D-58 · Criterios de aceptación de la construcción

Escritos el 21 nov 2026 a las 12:43 am, **antes** de tocar `web/`. La referencia
es la maqueta aprobada por Miguel a las 12:43 am con la tarjeta de ruta en
**esquina suave** (`docs/maquetas/d58/maqueta.html?tarjeta=suave`; capturas en
`docs/maquetas/d58/capturas/`; inventario en `docs/maquetas/d58/inventario.md`).
Cada prueba revisa la regla, no el dato del día (lección 11).

Pruebas: `pruebas-navegador/d58.spec.mjs` (390 y 1280 px).

## Zoom

- z1. El mapa trae el control «+ / −» (acercar y alejar), visible al cargar,
  en teléfono y computadora. Cada botón mide al menos 44 px y tiene nombre para
  el lector de pantalla («Acercar», «Alejar»).
- z2. El control es una píldora: su esquina es al menos la mitad de su ancho.
- z3. Tocar «+» sube un nivel el zoom del mapa; «−» lo baja.
- z4. En teléfono, con una ruta elegida y el menú cerrado, el control no se
  encima con el chip de la ruta.

## Píldoras

- k1. En píldora (esquina ≥ la mitad del alto): chip de la ruta, su placa, la
  insignia de las tarjetas, el encabezado del detalle, la etiqueta de nivel, los
  botones de la bienvenida, los lugares guardados y la línea de la parada más
  cercana. En círculo: el botón de volver a buscar y el logo del menú.
- k2. La tarjeta de ruta lleva esquina de 22 px, conserva su alto (70 px en
  teléfono, 60 px en computadora) y sus 3 columnas, y ningún nombre se sale de
  su tarjeta (D-55).
- k3. Lo que no aplica no cambia: la bienvenida, el bloque del detalle y las
  tarjetas de «cerca» siguen con su esquina de antes.
