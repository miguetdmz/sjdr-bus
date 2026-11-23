# D-56 fase 2 · Criterios de construcción (escritos antes de construir)

Construir en `web/` **igual a la maqueta aprobada** (`docs/maquetas/d56f2/`, Miguel,
22 nov 2026, 9:34 pm) con los tipos de lugar aprobados (9:40 pm, sin opcionales).
Solo cambia la pestaña «Calcula tu ruta» (lección 14). Cada criterio tiene su prueba.

## Datos
- **c1. Catálogo de OSM con fuente y huella.** `datos/cache/overpass/lugares-amplio.json`
  sale de una sola consulta (`lugares-amplio.overpassql`) con su sha256; la respuesta
  completa vive en `referencias/` (fuera de git). Cada lugar trae id de OSM, nombre,
  tipo en español, etiqueta original y centro. Ninguno sin tipo; sin «Universidad
  Tecnológica Bridge» ni coordenadas prohibidas (lección 4); sin farmacias,
  gasolineras ni tiendas de conveniencia (fuera de lo aprobado). Prueba:
  `scripts/pruebas/lugares.test.mjs` (lee el archivo del repositorio, no el generado,
  lección 5).
- **c2. La app recibe los lugares tal cual.** `scripts/datos-app.mjs` escribe
  `web/public/datos/lugares.json` copiando nombre, tipo, id y coordenada; el service
  worker lo guarda. Prueba: `lugares.test.mjs` y `scripts/revisar-compilacion.mjs`.

## Pantalla (pestaña «Calcula tu ruta»)
- **c3. Catálogo amplio.** «¿A dónde quieres ir?» encuentra lugares de OSM (p. ej.
  «Cinepolis», «imss»). Cada fila dice su tipo y su fuente: «Hospital · OpenStreetMap»;
  las de ruta siguen «Inicio o fin de ruta · zona aproximada». Sin repetir nombres
  (como la maqueta: primero los de ruta). Sin resultados: lo dice, sin inventar.
- **c4. Parada más cercana al destino.** Al elegir el destino, debajo de la fila
  elegida: línea terracota (`.ver-parada.destino`), nombre a **14 px**, con
  «Parada más cercana a tu destino · en línea recta · por verificar». Nombre y
  distancia = la parada de `paradas.json` más cercana en línea recta. Al tocarla: en
  el teléfono se cierra el menú, el mapa va a la parada y abre su ficha (como D-57).
- **c5. «Salgo de otro lugar».** Círculo de **52 px** con ícono (pin con lápiz), sin
  texto, de contorno, **en el mismo renglón** que «Buscar mi parada más cercana»
  (antes de ubicarte) o que tu parada y el botón de ícono (después). Abre «¿Desde dónde
  sales?» con su campo, la misma lista guardada, un botón para cancelar y «Buscar mi
  parada más cercana»; mientras, «¿A dónde quieres ir?» no se ve. Elegido: arriba
  «Sales de …», la línea es la parada más cercana a ese lugar y el círculo verde pasa a
  «usar mi ubicación». Nada se consulta en vivo (regla 7).
- **c6. Opción C.** En el renglón de tu parada el texto chico va **debajo** del
  renglón, a todo el ancho («Tu parada más cercana · …» o «Cerca de tu salida · …»), y
  el nombre de la parada va a **10.5 px**. Alto del renglón: 52 px a 390 px; ≤ 80 px a
  320 px. La línea del destino no cambia (14 px, texto chico dentro).
- **c7. Mapa.** Lugar de OSM elegido: un punto con etiqueta debajo («Destino: …» en
  terracota, «Sales de: …» en verde) y su parada. **Sin línea** entre ellos (regla 1).
  Un destino que es inicio o fin de ruta sigue como zona (como v0.2).
- **c8. Leyenda.** «Lugares: OpenStreetMap, consulta del 22 nov 2026.» Siguen «Tu
  ubicación no sale del teléfono.» y «Próximamente…».
- **c9. Cabe y no se encima** a 390 × 844, 320 × 640 y 1280 × 800: sin scroll de lado,
  los tres círculos dentro del menú y sin textos cortados. Prueba también a 320 px
  (lección 5).
- **c10. Nada más cambia.** Las pruebas de antes (D-53 a D-62) siguen en verde, salvo
  lo que el pedido cambia (se anota cuál y por qué). Inventario de selectores: ninguno
  desaparece de `web/src/estilos.css` (lección 13).
- **c11. Sin red con datos del usuario.** Ninguna petición nueva fuera de la app al
  buscar, elegir salida o destino (regla 7).

## Validación de las pruebas (lección 15)
Las pruebas nuevas se corren primero contra la app de hoy (sin el cambio): deben
fallar. Después, con defectos puestos a propósito (sin 10.5 px, círculo fuera del
renglón, línea del destino sin la parada correcta), cada uno debe atraparse.
