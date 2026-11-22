# D-61 · Inventario de selectores (lección 13)

`web/src/estilos.css`: **0 líneas quitadas**, solo reglas nuevas (bloque D-61, justo
después de la regla de la muesca del zoom, D-59, 2). Ningún selector desaparece ni se
mueve.

| Selector nuevo | Para qué |
|---|---|
| `.leaflet-top.leaflet-right` | La esquina de arriba a la derecha empieza abajo de la barra (`--arriba` + 52 px) |
| `.leaflet-top.leaflet-right .leaflet-control-zoom.leaflet-bar` | Zoom arriba: 12 px bajo el botón de paradas, sin el margen de abajo de D-58 |
| `.leaflet-top.leaflet-right .ubicame` | Círculo «mi ubicación» de 46 px, 10 px bajo el zoom |
| `.ubicame:disabled` | Mientras busca la ubicación |
| `.ubicame:focus-visible` | Contorno de teclado, como los demás botones redondos |
| `#aviso-ubicacion:not([hidden]) + #aviso-paradas` | El aviso de paradas espera oculto mientras se ve el de ubicación |

Las reglas de D-58 (zoom abajo, arriba del chip) y D-60 (acostado) quedan intactas:
siguen mandando cuando el zoom está abajo (acostado y computadora).
