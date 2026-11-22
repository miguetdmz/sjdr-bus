# D-62 · Inventario de selectores (lección 13)

`web/src/estilos.css`: 2 líneas quitadas, ningún selector desaparece.

| Selector | Qué pasó | Dónde queda cada propiedad |
|---|---|---|
| `.leaflet-top.leaflet-right .ubicame` | **Se queda**; solo conserva el margen (10 px bajo el zoom) | La forma del círculo (46 px, redondo, fondo, sombra, color) pasa a `.ubicame`, porque ahora también se usa abajo (acostado) |
| `.ubicame` | **Nuevo**: forma del círculo en los tres | — |
| `.leaflet-top.leaflet-right` (dentro de computadora) | **Nuevo**: sin margen arriba; el mapa ya empieza bajo la barra verde | La regla de teléfono parado (`--arriba` + 52 px) se queda igual |
| `.leaflet-bottom.leaflet-right .ubicame` (dentro de acostado) | **Nuevo**: círculo a la izquierda del zoom, alineado abajo | — |

Reglas de D-58 y D-60 del zoom: intactas. La de D-58 (zoom abajo, arriba del chip)
ya solo manda acostado, donde D-60 la ajusta.
