# D-58 · Inventario de cuadros (maqueta)

Pedido de Miguel (21 nov 2026, 12:34 am): zoom «+ / −» en píldora y formato
píldora en «todos los cuadros que apliquen y que quepan». Se revisó cada regla
con `border-radius` de la maqueta de D-57. Ningún selector se borró (lección 13):
solo cambiaron valores y se agregaron reglas marcadas «D-58».

## Cambiaron (caben)

| Cuadro | Dónde se ve | Antes | Ahora |
|---|---|---|---|
| Control de zoom «+ / −» | Mapa, abajo a la derecha (teléfono y computadora) | oculto | píldora vertical blanca, 46 px por botón |
| Chip de la ruta elegida (`.chip-ruta`) | Mapa con ruta y menú cerrado | esquina 18 px | píldora |
| Insignia del camión (`.camion`, `.insignia`) | Tarjetas, chip, detalle, «cerca» | esquina 4–10 px | píldora |
| Encabezado de la ruta (`.enc-ruta`) | Detalle de la ruta | esquina 16 px | píldora |
| Etiqueta «NIVEL C · …» (`.etiqueta`) | Detalle de la ruta | esquina 5 px | píldora |
| Botones «Elegir ruta» / «¿A dónde quieres ir?» (`.acciones button`) | Bienvenida | esquina 12 px | píldora |
| Lugar guardado o resultado (`.resultado`) | Calcula tu ruta | esquina 14 px | píldora |
| Tu parada más cercana (`.ver-parada`) | Calcula tu ruta | esquina 14 px | píldora |
| Botón de volver a buscar (`.otra`) | Calcula tu ruta | cuadro de 52 px | círculo |
| Logo del menú (`.logo`) | Cabeza del menú en teléfono | esquina 10 px | círculo |

## Pregunta para Miguel (no se aplicó, lección 14)

| Cuadro | Medición | Opciones |
|---|---|---|
| Tarjeta de ruta (`.tarjeta.partida`) | Teléfono 100 × 70 px. Píldora completa: 10 nombres no caben. Esquina 22 px: caben los 42, letra promedio 10.1 px (hoy 10.2) | `?tarjeta=suave` (esquina 22 px) · `?tarjeta=pildora` (completa) · sin parámetro = como hoy |

## No cambiaron (no aplican o no caben)

| Cuadro | Razón |
|---|---|
| Menú lateral (`.hoja`) | Es un panel de pantalla completa, no un cuadro |
| Bienvenida «Así funciona» (`.bienvenida`) | Bloque de varios párrafos: en píldora se cortaría el texto |
| Bloque del detalle (`.detalle`) | Bloque de varios renglones |
| Ficha de la parada en el mapa (ventana de Leaflet) | Varios renglones |
| Tarjetas de «cerca» (`.rejilla.cerca .tarjeta`) | La insignia va en la esquina de arriba y en computadora son 4 columnas (~85 px): la curva la cortaría. Además sigue abierta la pregunta de D-55 de si van partidas |
| Ya eran píldora o círculo | Barra de búsqueda, botones redondos, «Borrar», «Cambiar ruta», Ida/Vuelta, campo de destino, botón de ubicación, «Urbana», etiquetas de zona, números 1-2-3 |
