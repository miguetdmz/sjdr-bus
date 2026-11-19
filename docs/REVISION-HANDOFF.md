# Revisión del trabajo de la práctica (inspección de recibo)

La práctica profesional del proyecto terminó el 16 nov 2026. Entregó dos
piezas, que se guardan solo en la computadora de Miguel (`referencias/practica/`,
fuera de git):

- `handoff-practica-2026-11-16.pdf`: el handoff (pasado a `docs/HANDOFF.md`).
- `mockup-practica-2026-11-16.html`: el mockup publicable. Es **posterior** al
  handoff: agrega listas de paradas de 29 rutas más.

Regla de uso: todo dato que se tome de estas piezas se cruza primero contra
esta lista. Lo que se use se anota en `datos/gtfs-sjr/CHANGELOG.md` con su
fuente.

Revisó: Claude, 16 nov 2026. Método: lectura completa del PDF; mockup
abierto en Chromium a 390 × 844 px y a 1280 × 900 px; datos del mockup
extraídos con un script y comparados contra el handoff.

## Lo que se conserva

| Pieza | Por qué vale |
|---|---|
| Auditoría del GTFS oficial (§3) | Hallazgo central, con cifras verificables |
| Inventario de las 42 rutas (§4) | Base del selector; con la corrección de D-08 |
| Niveles A/B/C, uso responsable de OSM, reglas §14 | Bien planteados; se adoptan |
| Selector del mockup: 42 opciones, 40 + 2, orden del inventario | Comprobado en el navegador |
| Distinción entre la 23 urbana y la 023 intermunicipal | El mockup ya la hace |
| Listas de paradas de Moovit de 39 rutas | Útiles como **guía de campo** (D-07) |
| Estilo visual (paleta verde, etiqueta «ESTIMADO · NO OFICIAL») | Punto de partida para B2 |

## Hallazgos

Severidad: **Crítico** = rompe una regla que no se negocia · **Mayor** = dato
o criterio de aceptación incorrecto · **Menor** = forma.

| # | Pieza | Hallazgo | Severidad | Qué se hace |
|---|---|---|---|---|
| M-01 | Ambas | Usa la marca «Qrobús» como nombre («Qrobús SJR» en la barra del mockup) | Crítico | Nombre neutral (D-02) |
| M-02 | Handoff §4 | Dos rutas con número 23/023 chocarían como `route_id` | Mayor | Claves distintas (D-08) |
| M-03 | Handoff §4 | 001 y 022 tienen el mismo nombre; existe 015B sin 015 | Mayor | Reconciliar en B1, no a ojo |
| M-04 | Handoff §5, §12 | Planea publicar datos de Moovit en un repositorio abierto | Mayor | D-07, pendiente de Miguel |
| M-05 | Handoff §11 | No resuelve la licencia de los datos derivados de OSM | Mayor | ODbL para datos (D-05) |
| M-06 | Mockup | La primera pantalla no tiene mapa: en un teléfono de 844 px el mapa empieza a 956 px, debajo de un párrafo | Crítico | Criterio 1 de §11.8 en B2 |
| M-07 | Mockup | Al cambiar de ruta quedan pines de la anterior (001 → 007 deja el pin de Pedregoso; 014 muestra pines sin tener trazo) | Mayor | Criterio 5 de §11.8 en B2 |
| M-08 | Mockup | Rutas que él mismo marca «NIVEL C» (007, 011B, 022, 025, 039) se dibujan con línea continua por calles y paradas repartidas a distancias iguales | Crítico | Regla §11.4-1: C punteado o sin trazo |
| M-09 | Mockup | En 001, 002, 005 y 012 la vuelta copia paradas y duración de la ida (p. ej. 001: handoff 23 paradas / 16 min, mockup 29 / 20) | Mayor | Regla 10 de CLAUDE.md; prueba en B1 |
| M-10 | Mockup | Coordenadas inventadas usadas para trazar: Central (20.39020, -100.00150), UTSJR (20.37650, -99.93850) y Francisco Villa (20.38300, -100.01000) | Crítico | Prohibidas por §11.3; `scripts/reglas.mjs` las rechaza |
| M-11 | Mockup | «Puntos de paso» (`via`) sin fuente para guiar a OSRM | Mayor | Solo puntos verificados (§11.5) |
| M-12 | Mockup | Etiquetas «ALTA / MEDIA» en lugar de A/B/C; llama «ALTA» a un trazo OSRM entre extremos con puntos de paso inventados | Mayor | Escala A/B/C única |
| M-13 | Mockup | Consulta OSRM en vivo desde el navegador al elegir cada ruta | Crítico | Prohibido por §11.6; `scripts/reglas.mjs` lo rechaza |
| M-14 | Mockup | Si OSRM falla, dibuja rectas entre puntos de paso | Mayor | Sin respaldo de rectas |
| M-15 | Mockup | Carga fuentes de Google (fonts.googleapis.com) | Mayor | Fuentes locales; `scripts/reglas.mjs` lo rechaza |
| M-16 | Mockup | Frecuencias de las 10 piloto (15, 20 y 30 min) sin fuente declarada | Mayor | Sin frecuencia verificada no se calcula espera |
| M-17 | Mockup | Listas de Moovit con 10 paradas marcadas «(dup. en la extracción)» que inflan el conteo | Mayor | Limpiar al importar, con registro |
| M-18 | Mockup | El selector arranca con la 001 preseleccionada; textos «Ruta 001 · Pedregoso → Centro · con mapa y tiempos» en lugar de «001 — Pedregoso – Centro» | Menor | Criterio 2 y estado inicial de §11.8 |
| M-19 | Mockup | La 007 aparece «verificada en Moovit», cuando el handoff del mismo día decía que no se pudo verificar | Mayor | Se trata como no verificada hasta revisarla (regla 8) |
| M-20 | Mockup | Fecha «consulta 17-nov-2026» cuando en México era 16 nov (probablemente hora UTC) | Menor | Fechas en hora de México (D-09) |
| M-21 | Mockup | Sentido como botón «⇄ Sentido», no control segmentado ida / vuelta | Menor | §11.8 en B2 |

## Pendiente de revisar

- Contenido de las 29 listas de paradas de Moovit: nombres, orden y erratas.
  Se hará en B1, ruta por ruta, si D-07 lo permite.
- Comportamiento del mockup en un teléfono real (esta revisión usó un
  navegador automático en ancho de teléfono).
