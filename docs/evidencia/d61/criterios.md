# D-61 · Criterios de aceptación de la construcción

Escritos el 22 nov 2026, **antes** de tocar `web/`. Referencia: la maqueta aprobada
por Miguel el 21 nov 2026 a las 2:51 am (`docs/maquetas/d61/maqueta.html`; capturas
en `docs/maquetas/d61/capturas/`). Pruebas: `pruebas-navegador/d61.spec.mjs`.

Teléfono parado = menos de 768 px de ancho y más de 500 px de alto (los mismos
cortes que D-59 y D-60).

- p1. Teléfono parado (390 × 844, 375 × 667 y 320 × 568): el zoom «+ / −» va arriba a
  la derecha, abajo del botón de paradas, con un espacio de 8 a 16 px (maqueta: 12),
  y alineado a la derecha con ese botón (± 4 px).
- p2. Debajo del zoom, con un espacio de 6 a 14 px (maqueta: 10), un círculo «mi
  ubicación» de 44 a 48 px (maqueta: 46), alineado a la derecha con el zoom (± 4 px),
  redondo, dentro de la pantalla y sin nada encima.
- p3. Con la ruta de nombre más largo elegida y el menú cerrado, ni el zoom ni el
  círculo se enciman con el chip de la ruta ni con la barra (320 × 568 y 390 × 844).
- p4. Con permiso de ubicación: tocar el círculo pone el punto «Tú» en el mapa y lo
  centra ahí (a menos de 30 m). La ubicación no sale del teléfono: después del toque
  no hay ninguna petición de red fuera de las teselas (regla 7).
- p5. Sin permiso: sale un aviso que dice que no hay permiso y que la app sigue; el
  menú se sigue abriendo.
- p6. Teléfono acostado (844 × 280) y computadora (1280 × 800): sin círculo; el zoom
  queda abajo a la derecha, como en D-60.
- p7. Al girar el teléfono (390 × 844 → 844 × 390 → 390 × 844) los controles se
  acomodan solos: acostado sin círculo y zoom abajo; parado, otra vez arriba.

Lección 5 (3.ª ocurrencia): las pruebas de posición corren también a 320 px.
Lección 11: se revisan reglas (espacios, alineación, que no se enciman), no el pixel
del día.

**Decidido al construir, sin cambiar nada aprobado (para la revisión de Miguel):** la
maqueta no dibujó el aviso de «sin permiso». Usa el mismo estilo que ya tiene el aviso
de paradas (D-53, ajuste 1.2: texto chico en verde, abajo, sin fondo), en el mismo
lugar, y se va solo a los 6 s. Mientras se ve, el aviso de paradas espera oculto.

**Hallazgo al construir (22 nov 2026), sin aplicar (lección 14):** a 320 × 568, con la
R40 (Las Águilas – UTSJR), la etiqueta «Inicio: Las Águilas» queda en parte debajo del
círculo. Medido: el punto de inicio cae en x = 251 y la columna de controles empieza
en x = 262 (de y = 74 a y = 222); la etiqueta mide ~163 px y llega a x ≈ 332. A 390 y
375 px no pasa. Reservar a la derecha el ancho de la columna (72 px en vez de 44) no
lo arregla, porque la etiqueta es más ancha que esa reserva. Opciones para Miguel,
sin aplicar: (A) dejarlo así (se ve moviendo el mapa); (B) en parado, encuadrar la
ruta debajo del círculo (la ruta se ve más chica); (C) otra que él diga.
**Decisión de Miguel (22 nov 2026, 4:06 pm): opción A, dejarlo así.**
