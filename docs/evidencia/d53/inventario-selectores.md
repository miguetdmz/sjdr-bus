# D-53 · Inventario de selectores de `web/src/estilos.css` (lección 13)

Antes de reescribir los estilos para la maqueta aprobada, se comparó cada selector
de la versión anterior (`HEAD`, 149 selectores) contra la nueva (137). Se
conservan 75 tal cual. Los 74 que ya no están se explican abajo, uno por uno: o se
fue el elemento que estilaban (D-53 lo quitó), o su regla pasó a otro selector.

Método: script que extrae los selectores de las dos versiones, sin comentarios,
y lista los que faltan en la nueva (corrido el 20 nov 2026).

## 1. Se fue el elemento (D-53 lo retiró)

| Selectores | Elemento | Por qué ya no existe |
|---|---|---|
| `.buscador`, `.buscador label`, `.buscador select`, `.buscador select:focus-visible`, `.icono-izq`, `.icono-der`, `.controles`, `.app.menu-abierto .buscador select`, `.app.menu-abierto .controles` | Desplegable «¿A dónde vas? Elige tu ruta» | D-53, 6: sin desplegable; la ruta se elige en las tarjetas |
| `.app.menu-abierto .barra`, `.app.menu-abierto .boton-menu`, `.app.menu-abierto .segmento` | Buscador y sentido que se mudaban al menú al abrirlo | D-53, 2: «aparecen de golpe»; el sentido ya vive dentro del detalle |
| `.segmento.apagado`, `.segmento.apagado input:checked + span`, `.sentido[hidden]` | Sentido apagado / oculto fuera del menú | El sentido solo existe dentro de `#ruta-elegida` (oculto sin ruta) |
| `.control-paradas`, `.control-paradas:focus-visible`, `.control-paradas[aria-pressed="true"]`, `.leaflet-top.leaflet-right` | Botón «Paradas» de Leaflet, arriba a la derecha | D-53, 1: botón redondo en la barra (`.boton-paradas`) |
| `.leaflet-control-attribution`, `.leaflet-bottom.leaflet-right`, `.app.menu-abierto .pie` | Atribución suelta de Leaflet y el pie con fondo blanco | D-53, ajustes 1 y 2: un solo pie legal con la atribución (`.pie`, `.pie a`) |
| `.ver-detalle`, `.ver-detalle:focus-visible`, `.ver-detalle[hidden]` | Botón suelto «Ver detalle» | Ahora va dentro del aviso de la ruta (`.chip-ruta`, `.ver`, `.ver:focus-visible`) |
| `.tarjeta-numero`, `.encabezado-texto .tarjeta-numero`, `.encabezado-tarjeta .tarjeta-numero` | «Ruta 001» en tarjeta y encabezado | D-53, 3 y respuesta de las 6:23 pm: nunca en pantalla |
| `.calcula-estado`, `.calcula-lista`, `.calcula-lista dt`, `.calcula-lista dd`, `.calcula-lista dt:first-child` | Aviso «Calcula tu ruta: todavía no está disponible» | D-53, 7: la pestaña es ahora «¿A dónde quieres ir?» (`.campo`, `.bloque`, `.resultado`, `.ubicacion`, `.leyendas`, `.nota`) |
| `.cerrar.quitar`, `.encabezado-ruta .cerrar.quitar` | Botón «Cambiar ruta» con forma de cerrar | Ahora es `.borrar` junto a «Tu ruta», como en la maqueta |
| `.m-gris` | Punto gris de parada (D-30) | Ya no se usaba desde D-49; la parada es el círculo de D-53 (`.parada-toque`) |
| `.punto-zona i`, `.punto-zona.zona-inicio i`, `.punto-zona.zona-fin i` | Piquito de la etiqueta «Inicio» / «Fin» | La maqueta pone la etiqueta «Inicio: lugar» centrada sobre la zona, sin piquito |
| `.detalle-titulo`, `.detalle-etiquetas`, `.fuente`, `.detalle-filas dt`, `.detalle-filas dd` | Restos del detalle de M-04 | Ya no se generaban (D-52 quitó título, etiquetas y fuentes); los `dt` son `.solo-lector` |
| `.etiqueta-chica`, `.detalle-pie .detalle-aviso` | Variante chica de la etiqueta de nivel | `.etiqueta` ya es la chica (maqueta) y `.detalle-aviso` tiene su propia regla |

## 2. La regla pasó a otro selector

| Selector anterior | Ahora | Dónde se comprueba |
|---|---|---|
| `.hoja-titulo`, `.hoja-titulo[hidden]` | `.titulo-seccion` («Elige tu ruta», «Tu ruta», etc.) | Captura 2-menu |
| `.recientes-cabeza`, `.recientes-cabeza h3` | `.fila-titulo`, `.titulo-seccion` | Captura 2-menu |
| `.borrar-recientes`, `.borrar-recientes:focus-visible` | `.borrar`, `.borrar:focus-visible` (mín. 44 px) | `b2a`: áreas táctiles |
| `.rejilla-tarjetas` | `.rejilla` | `d50` criterios 1 a 3 |
| `.tarjeta-ruta .camion`, `.tarjeta-ruta .camion svg`, `@media (max-width: 767px)` | `.camion`, `.camion svg` (tamaño chico de la maqueta para todos) | `d53` c4 |
| `.encabezado-ruta`, `.encabezado-ruta[hidden]`, `.encabezado-tarjeta`, `.encabezado-tarjeta .camion`, `.encabezado-tarjeta .camion svg`, `.encabezado-tarjeta .encabezado-texto`, `.encabezado-tarjeta .insignia`, `.encabezado-texto`, `.insignia` | `.enc-ruta`, `.enc-ruta .camion`, `.enc-ruta .camion svg`, `.enc-nombre` | `d50` criterio 4 y `d53` c5 (mismo color) |
| `.fila`, `.fila .icono`, `.fila .valor` | `.fila dd`, `.icono`, `.valor` | Captura 3-detalle |
| `.hoja-cabeza .logo` | `.logo` | Captura 2-menu |
| `.detalle[hidden]`, `.modo[hidden]`, `.recientes[hidden]`, `.selector-visual[hidden]`, `.velo[hidden]` | Una sola regla: `[hidden] { display: none !important; }` | Todas las pruebas que revisan `toBeHidden()` |

## 3. Reglas que la lección 13 vigila y siguen puestas

- **Fondo blanco del menú:** `.hoja { background: var(--tarjeta) }`. Prueba:
  `b2a.spec.mjs` («fondo del menú» = `rgb(255, 255, 255)`).
- **Sin velo en computadora:** `@media (min-width: 768px) { .velo { display: none !important } }`.
  Prueba: `b2a.spec.mjs` y `d53.spec.mjs` (el mapa empieza donde termina el menú).
