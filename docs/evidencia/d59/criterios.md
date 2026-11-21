# D-59 · Criterios de aceptación de la construcción

Escritos el 21 nov 2026 a las 1:13 am, **antes** de tocar `web/`. La referencia es
la maqueta aprobada por Miguel a la 1:13 am (`docs/maquetas/d59/maqueta.html`;
capturas en `docs/maquetas/d59/capturas/`). Cada prueba revisa la regla, no el
dato del día (lección 11).

Pruebas: `pruebas-navegador/d59.spec.mjs`.

## Pellizco solo en el mapa

- a1. La página no se deja ampliar: el `viewport` dice `maximum-scale=1` y
  `user-scalable=no`, y la página tiene `touch-action: pan-x pan-y` (sin pellizco
  ni doble toque de página).
- a2. El gesto propio de Safari (`gesturestart`, `gesturechange`) se frena en la
  página.
- a3. El mapa sigue recibiendo sus gestos (su `touch-action` es `none`, Leaflet
  maneja el pellizco) y el cuerpo del menú sigue con scroll.

## Teléfono acostado (844 × 390)

- b1. Se ve como teléfono: la barra flota sin fondo, el botón ☰ es redondo y no
  sale la marca «SJDR Bus» de la barra de computadora.
- b2. El menú se abre encima del mapa con el velo, y las tarjetas de ruta miden
  70 px (las de teléfono).
- b3. Con una ruta elegida y el menú cerrado, el zoom no se encima con el chip.

## Sin cambio

- c1. En computadora (1280 × 800) la barra sigue con su fondo verde y la marca.
- c2. Teléfono parado: lo cubren las pruebas de antes (D-53 a D-58), que deben
  seguir en verde.
