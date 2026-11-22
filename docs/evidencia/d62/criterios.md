# D-62 · Criterios de aceptación de la construcción

Escritos el 22 nov 2026, **antes** de tocar `web/`. Referencia: la maqueta aprobada
por Miguel a las 3:47 pm (`docs/maquetas/d62/maqueta.html`, con su ajuste de las
3:43 pm; capturas en `docs/maquetas/d62/capturas/`). Pruebas:
`pruebas-navegador/d62.spec.mjs`. Teléfono parado: sin cambio (D-61).

**Computadora** (768 px o más de ancho y más de 500 px de alto):
- c1. El zoom «+ / −» va arriba a la derecha, de 8 a 16 px bajo la barra verde
  (maqueta: 12) y de 8 a 16 px de la orilla derecha (maqueta: 12). Medido a
  1280 × 800 y 1024 × 768.
- c2. Abajo del zoom, de 6 a 14 px (maqueta: 10), el círculo «mi ubicación» de 44 a
  48 px, redondo, alineado a la derecha con el zoom (± 4 px) y sin nada encima.
- c3. Con ruta elegida, ni el zoom ni el círculo se enciman con el chip de la ruta, y
  con el menú abierto siguen a la vista y sin nada encima.

**Teléfono acostado** (500 px de alto o menos):
- a1. El zoom se queda donde lo dejó D-60: abajo a la derecha, sin encimarse con el
  botón de paradas (844 × 280 y 844 × 212).
- a2. El círculo va a la izquierda del zoom, de 6 a 14 px de espacio (maqueta: 10),
  con su parte de abajo alineada con la del zoom (± 2 px), de 44 a 48 px y redondo.
- a3. Con ruta elegida, el círculo no se encima con el chip, el botón de paradas, la
  barra ni el pie, y nada lo tapa.

**En los tres:**
- t1. Con permiso, tocar el círculo pone el punto «Tú» en el mapa (acostado y
  computadora; parado ya lo revisa D-61) sin ninguna petición de red fuera de las
  teselas (regla 7).
- t2. Al girar el teléfono (390 × 844 → 844 × 390 → 390 × 844) el círculo está
  siempre; el zoom baja al acostar y sube al parar.

Cambia D-61: la prueba p6 de `d61.spec.mjs` («sin círculo acostado y en computadora»)
y la parte de p7 que pedía que acostado no hubiera círculo se reemplazan por estas.
