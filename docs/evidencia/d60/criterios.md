# D-60 · Criterios de aceptación de la construcción

Escritos el 21 nov 2026, **antes** de tocar `web/`. Referencia: la maqueta aprobada
por Miguel a la 1:59 am (`docs/maquetas/d60/maqueta.html`, con el ajuste del chip
de la 1:49 am; capturas en `docs/maquetas/d60/capturas/`). Solo pantallas de 500 px
de alto o menos (teléfono acostado). Pruebas: `pruebas-navegador/d60.spec.mjs`.

- e1. El zoom no se encima con el botón de paradas (844 × 280 y 844 × 212).
- e2. En el menú, el alto útil del cuerpo (hasta donde empieza el pie) deja ver al
  menos 2 filas completas de tarjetas de ruta (2 × 70 px + 5 px) a 844 × 280.
- e3. Con ruta elegida y menú cerrado: el chip va en columna (insignia, nombre,
  «Ver detalle»), en la mitad izquierda, tapa como máximo 10 % de la pantalla y no se
  encima con el zoom ni con la barra. «Ver detalle» se toca en al menos 44 px de alto.
- e4. Teléfono parado (390 × 844): el chip sigue en renglón, como antes.

La prueba b3 de D-59 («el zoom queda arriba del chip» a 844 × 390) cambia por D-60:
acostado, el chip va a la izquierda y el zoom a la derecha; la regla pasa a ser «no
se enciman».
