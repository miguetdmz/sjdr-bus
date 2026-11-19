# Cola del turno nocturno

El turno nocturno (D-10, D-12) es una rutina programada que trabaja mientras
Miguel duerme. Funciona como un segundo turno de producción: fabrica piezas,
pero las deja en el **área de inspección** (un PR en borrador). A las 5:15 am
otra rutina, el inspector (D-13), revisa el PR y deja el reporte para Miguel.
Nada se libera a `main` sin la firma de Miguel.

## Reglas del turno (modo por lotes)

1. Miguel aprueba un **bloque completo**. El turno toma las tareas
   **APROBADA** del bloque activo, **en el orden de la tabla**, y avanza por
   ellas una tras otra.
2. Arranca a las **11:30 pm hora de México**, cuando Miguel deja la
   computadora (D-20). No empieza tareas nuevas después de las **4:30 am** y
   deja el PR listo antes de las **5:00 am**. También para al terminar las
   tareas aprobadas, o
   al topar con una tarea que exige una decisión de Miguel (se detiene ahí;
   no se salta a la siguiente).
3. Antes de empezar lee `CLAUDE.md`, `docs/PLAN.md`, `docs/DECISIONES.md`,
   `docs/HANDOFF.md` y esta cola.
4. **Una rama y un PR por noche:** `noche/AAAA-MM-DD`, con la fecha de la
   **mañana en que termina el turno** (el turno que arranca el 17 a las
   11:30 pm usa la fecha del 18), y **un commit por tarea** (el mensaje
   empieza con el número, p. ej. «N-01: …»).
5. **Arranca donde se quedó Miguel (D-20):** si hay PR abiertos de trabajo
   (ramas `cierre/…` de la sesión del día o `noche/…` de una noche
   anterior), la rama nueva sale de la rama del PR abierto **actualizado más
   recientemente** (no de `main`), el PR nuevo apunta a ella y lo dice en su
   primera línea. Después de cambiar a esa rama vuelve a leer `docs/PLAN.md`
   y esta cola: mandan los de esa rama. Si no hay PR abiertos, sale de
   `main`. Si ya hay **3 PR nocturnos abiertos**, no trabaja: lo reporta y
   termina.
6. Cada tarea termina con `npm run verificar` en verde. Si una tarea no pasa,
   se detiene ahí, deja el PR con el título empezando por «[NO PASA]» y la
   salida real del error.
7. El PR lleva, en español y para alguien que no programa: qué tareas hizo,
   qué no hizo, cómo verificarlo y las preguntas para Miguel.
8. Al terminar cada tarea, cambia su estado a **EN REVISIÓN (rama …)**.
9. **Nunca:** hacer merge, push a `main`, desplegar, publicar, crear cuentas,
   gastar dinero, tocar secretos, tomar una decisión PENDIENTE o PROPUESTA,
   inventar datos o hacer algo fuera de las tareas aprobadas.
10. Todo debe ser **open source y gratuito**: si algo pide cuenta, llave,
    suscripción o pago, se detiene y lo pregunta en el PR.
11. Servicios públicos de OSM: solo si la tarea lo autoriza, con las reglas de
    HANDOFF §11.6 y guardando todo en caché.

## Relevo de turno (lo hace la sesión del día antes de las 11:30 pm, D-20)

Como la entrega de turno en planta: lo que no queda escrito en la bitácora,
el turno siguiente no lo sabe.

1. Todo el trabajo del día con commit y **subido a GitHub** en su rama
   `cierre/AAAA-MM-DD`, con PR en borrador abierto.
2. `npm run verificar` en verde en esa rama.
3. Esta cola al día: las tareas que el turno debe tomar dicen **APROBADA**,
   en el orden en que debe hacerlas.
4. «Estado actual» y «Relevo» de `docs/PLAN.md` actualizados.
5. Lo que no esté en GitHub a las 11:30 pm no existe para el turno.

## Estados

PROPUESTA (Claude la sugiere) → APROBADA (Miguel la autoriza) → EN REVISIÓN
(hay PR) → HECHA (Miguel la integró) · BLOQUEADA (espera una decisión).

## Bloque activo: cierre de B1 (datos) y B2a (mockup navegable)

Una sola tabla, en orden: primero lo que falta de B1 (N-03, N-08) y después
el lote B2a (M-01 a M-08). B1 lo aprobó Miguel el 17 nov 2026 (D-12); B2a, el
17 nov 2026 (D-21). Decisiones que aplican: D-04 stack de la app, D-05
licencias, D-07 Moovit, D-08 claves de ruta, D-09 fechas, D-15 «Calcula tu
ruta», D-16 paradas desde OSM, D-18 sentido 0/1.

**Reglas propias del lote B2a (tareas M):**
- La app vive en `web/`. Dependencias solo MIT, BSD, ISC o Apache-2.0,
  anotadas en `docs/LICENCIAS.md`. Fuentes del sistema: no se descarga
  ninguna fuente. Cero Google.
- La app solo lee archivos ya construidos del repositorio. Nunca consulta
  OSRM, Nominatim ni Overpass. Las teselas del mapa son las de OpenStreetMap,
  con atribución visible.
- Ningún tiempo calculado, ninguna frecuencia y ningún trazo continuo: todo
  está en nivel C. Cada cifra muestra su fuente y su fecha.
- Nombre visible: «SJDR Bus» (D-28).
  Leyenda «Iniciativa ciudadana independiente» visible. Sin escudo ni colores
  oficiales.
- No se despliega ni se publica nada.
- Cada tarea M deja `npm run verificar` en verde, con la compilación de la
  app incluida desde M-01.

| # | Tarea | Criterio de aceptación | Estado |
|---|---|---|---|
| N-02 | **Validador oficial de GTFS.** Agregar a la puerta de calidad el validador de MobilityData (Apache-2.0, gratuito; requiere Java, también gratuito) con un script `scripts/validar-gtfs.*`. Incluir dos feeds mínimos de prueba en `scripts/pruebas/`: uno válido y otro con un error a propósito. En GitHub Actions instalar Java y correrlo; en local, si falta Java, el script dice cómo instalarlo gratis (`brew install openjdk`) y falla. Anotar el validador en `docs/LICENCIAS.md`. | `npm run verificar` corre el validador en local y en GitHub Actions; el feed válido pasa y el feed con error falla, comprobado por una prueba | HECHA (PR 1; inspector: LIBERADO, 17 nov 2026) |
| N-04 | **Candado «solo open source».** Script `scripts/licencias.mjs` que lee las **dependencias directas** de `package.json` (las que instalamos a propósito) y falla si alguna licencia no es MIT, BSD (2 o 3 cláusulas), ISC o Apache-2.0, o si no aparece en `docs/LICENCIAS.md`; las dependencias indirectas solo se listan como aviso. Entra a `npm run verificar`. Prueba con un `package.json` de ejemplo con licencia no permitida. | La prueba con licencia no permitida falla; el repositorio pasa | HECHA (PR 1; inspector: LIBERADO, 17 nov 2026) |
| N-01 | **`routes.txt` con las 42 rutas.** En `datos/gtfs-sjr/` crear `routes.txt` desde la tabla de HANDOFF §4, en ese orden: `route_id` según D-08 (`U-001` … `U-23` … `I-062`, `I-023`), `agency_id`, `route_short_name` igual al número del inventario, `route_long_name` «origen – destino» exactamente como en §4, `route_type` 3. Prueba automática que compruebe 42 filas, orden, textos y que no haya `route_id` repetidos. | Prueba en verde; 40 urbanas y 2 intermunicipales | HECHA (PR 1; inspector: LIBERADO, 17 nov 2026) |
| N-05 | **Archivos base del feed y fichas de estado.** `agency.txt` (agency_id `SJR-CONC`, nombre «Concesionarios del transporte público de San Juan del Río (por verificar)», url `https://qrobus.gob.mx/Rutas`, zona `America/Mexico_City`, idioma `es`), `feed_info.txt` (editor «Colaboradores de SJDRbus», url del repositorio, idioma `es`, versión y fechas), `calendar.txt` (servicio diario «por verificar»). Además `datos/fichas/rutas.json`: por cada una de las 42 rutas, su `route_id`, grupo (`verificada` / `solo-inventario` según HANDOFF §5.1 y §5.3), nivel de precisión (`C` para todas por ahora), fuente y fecha. Anotar en `datos/gtfs-sjr/CHANGELOG.md`. | Prueba que compruebe 42 fichas, 10 `verificada` y 32 `solo-inventario` | HECHA (PR 1; inspector: LIBERADO, 17 nov 2026) |
| N-06 | **Fichas de las 10 rutas verificadas, por sentido.** Agregar a `datos/fichas/rutas.json` el conteo de paradas, la duración y el horario **de cada sentido** de las 10 rutas de HANDOFF §5.1, con fuente «referencia Moovit, consulta nov 2026» (D-07). Sin frecuencia (no está verificada). Prueba automática que compare cada cifra contra la tabla de HANDOFF §5.1 y que falle si un sentido copia los datos del otro donde §5.1 dice que son distintos (lección 2 de `CLAUDE.md`). | Prueba en verde; la 001 vuelta = 23 paradas / 16 min | HECHA (PR 1; inspector: LIBERADO, 17 nov 2026) |
| N-07 | **Feed GTFS-SJR v0.1 empaquetado y validado.** Script que arma el ZIP del feed desde `datos/gtfs-sjr/` y lo pasa por el validador. **No inventar paradas ni coordenadas:** solo se pueden usar las coordenadas verificadas de HANDOFF §11.3 y nunca las prohibidas. Si el validador exige datos que no existen todavía (por ejemplo `stops.txt` o viajes), no los inventes: documenta en el PR cada error que queda, por qué y qué dato real lo resolvería, y detente ahí para que Miguel decida. | El validador corre sobre el ZIP; cero errores, o cada error restante explicado en el PR sin datos inventados | HECHA (PR 1; inspector: LIBERADO, 17 nov 2026) |
| N-03 | **Borrador de la solicitud de transparencia a la AMEQ** en `docs/gestiones/solicitud-transparencia-ameq.md`, con base en HANDOFF §9: qué se pide, por qué, a qué vía y en qué plazo. Lenguaje formal y ciudadano; sin datos personales de Miguel (deja espacios para llenar). | Borrador listo para que Miguel lo revise | EN REVISIÓN (rama cierre/2026-11-18; redactada en sesión con Miguel el 17 nov 2026, el turno no la toma) |
| N-08 | **Paradas desde OpenStreetMap.** Con Overpass (gratis, una sola consulta, guardada en caché en el repositorio; HANDOFF §11.5–11.6) traer las paradas de autobús que ya existen en OSM dentro de San Juan del Río y armar `stops.txt`. Cada parada lleva su identificador de OSM, fuente, fecha y la marca **POR VERIFICAR EN CAMPO**. No se asignan paradas a rutas ni se ordenan (eso sale de campo o de la AMEQ). No se inventa ni se mueve ninguna coordenada. | Prueba: cada parada tiene identificador de OSM, fuente y fecha; ninguna usa las coordenadas prohibidas; el validador baja de 3 a 2 errores conocidos (quedan `trips.txt` y `stop_times.txt`) | EN REVISIÓN (rama cierre/2026-11-19): hecha en sesión de día desde la computadora de Miguel el 18 nov 2026, 11:52 pm, con una sola consulta a Overpass guardada en `datos/cache/overpass/`; 49 paradas; el validador bajó de 3 a 2 errores |
| M-01 | **Esqueleto de la app.** En `web/`: Vite + TypeScript + Leaflet (D-04). Una pantalla con el mapa de OpenStreetMap a pantalla completa, centrado en Plaza Independencia (20.38883, -99.99639, coordenada verificada de HANDOFF §11.3), atribución de OpenStreetMap visible, leyenda «Iniciativa ciudadana independiente» y nombre «SJDRbus (nombre provisional)». Fuentes del sistema. Scripts `npm run dev` y `npm run build` en la raíz; la compilación entra a `npm run verificar`. Anotar dependencias en `docs/LICENCIAS.md`. | La app compila; `npm run verificar` en verde (reglas, licencias, pruebas y compilación); ningún dominio prohibido en `web/` | EN REVISIÓN (rama noche/2026-11-19) |
| M-02 | **Datos para la app.** Script en `scripts/` que arma `web/public/datos/rutas.json` desde `datos/gtfs-sjr/routes.txt` y `datos/fichas/rutas.json`: por ruta, `route_id`, número, nombre, tipo (urbana / intermunicipal), grupo, nivel, fuente, fecha y, en las verificadas, los datos de cada sentido. La app no tiene datos escritos a mano. Se corre antes de compilar. | Prueba: 42 rutas en el orden de `routes.txt`; 10 `verificada` y 32 `solo-inventario`; ninguna cifra que no esté en las fichas | EN REVISIÓN (rama noche/2026-11-19) |
| M-03 | **Selector de ruta y control de sentido** (HANDOFF §11.8). `<select>` nativo con `<label>` visible «Ruta», estado inicial «Selecciona tu ruta» sin ruta precargada, `<optgroup>` «Urbanas» (40) e «Intermunicipales» (2), texto de cada opción `número — origen – destino` como en §4, generado desde el archivo de M-02. Control de sentido separado, segmentado: «Ida» (sentido 0) y «Vuelta» (sentido 1), D-18. Áreas táctiles de al menos 44 px. Primera pantalla: mapa + selector + sentido, sin scroll a 390 px de ancho. | Prueba: 42 opciones, en orden, agrupadas 40 + 2; funciona con teclado; sin lista, rejilla ni tarjetas de rutas | EN REVISIÓN (rama noche/2026-11-19) |
| M-04 | **Detalle de la ruta elegida.** Rutas `verificada`: conteo de paradas, duración y horario **del sentido elegido**, cada cifra con «referencia Moovit, consulta nov 2026 · no es fuente oficial», etiqueta visible «Nivel C · recorrido por verificar» y **sin trazo** en el mapa (regla 8). Rutas `solo-inventario`: nombre, tipo y «Datos de paradas y recorrido en verificación». Sin tiempos calculados ni frecuencia. Cambiar de ruta o de sentido reemplaza todo el detalle. | Prueba: la 001 vuelta muestra 23 paradas / 16 min y la ida sus propias cifras; una ruta de solo inventario no muestra ninguna cifra; no quedan restos de la ruta anterior | EN REVISIÓN (rama noche/2026-11-19) |
| M-05 | **Paradas de OpenStreetMap en el mapa.** Requiere N-08 hecha en esta rama o en su base; si `datos/gtfs-sjr/stops.txt` no existe, el turno se detiene aquí. El script de M-02 copia las paradas a la app. Se dibujan como puntos pequeños, no ligados a ninguna ruta; al tocar una: nombre (si OSM lo trae), «Fuente: OpenStreetMap», fecha y **POR VERIFICAR EN CAMPO**. Un control para mostrar u ocultar la capa. | Prueba: el número de puntos es igual al de filas de `stops.txt`; cada punto muestra la marca; ninguna parada se asigna a una ruta | APROBADA (Miguel, 17 nov 2026; D-21). Estuvo BLOQUEADA el 18 nov 2026 por falta de `stops.txt`; vuelve a APROBADA porque N-08 ya está en la rama cierre/2026-11-19 |
| M-06 | **Lugar reservado de «Calcula tu ruta»** (D-15). Navegación de dos modos: «Rutas» (la primera pantalla, sin cambios) y «Calcula tu ruta». El segundo modo muestra solo un aviso: qué hará, que todavía no está disponible y qué dato falta (las paradas de cada ruta en orden y por sentido). Sin campos de origen y destino que parezcan funcionar y sin ningún cálculo. | La primera pantalla sigue siendo mapa + selector + sentido sin scroll a 390 px; el segundo modo no calcula ni simula nada | APROBADA (Miguel, 17 nov 2026; D-21) |
| M-07 | **Instalable (PWA).** `manifest.webmanifest` con nombre «SJDR Bus» (D-28), ícono propio monocromo en SVG y PNG, y un service worker mínimo que guarda la app y sus datos (no las teselas del mapa). Sin dependencias nuevas si se puede; si hace falta una, con licencia permitida y anotada. | La compilación incluye manifiesto, íconos y service worker; sin escudo ni colores oficiales; `npm run verificar` en verde | APROBADA (Miguel, 17 nov 2026; D-21) |
| M-08 | **Pruebas en navegador a 390 px.** Playwright (Apache-2.0, gratuito) con Chromium: comprueba los criterios de HANDOFF §11.8 que aplican a este lote (primera pantalla sin scroll, 42 opciones 40 + 2, detalle por sentido, «en verificación» en las de solo inventario, sin restos al cambiar de ruta) y la atribución de OpenStreetMap visible. Guarda capturas de pantalla a 390 px en `docs/evidencia/b2a/`. Entra a `npm run verificar` y a GitHub Actions. Si el navegador de prueba no se puede instalar gratis en el ambiente, el turno se detiene y lo explica en el PR. | Pruebas en verde en local y en GitHub Actions (lección 5 de `CLAUDE.md`); capturas guardadas | APROBADA (Miguel, 17 nov 2026; D-21) |

### Lote de investigación (D-22) · aprobado por Miguel el 19 nov 2026 (D-23)

Como un estudio de capacidad de proveedores antes de fabricar: primero se
mide qué fuente cubre qué ruta y con qué confianza, y después se decide
dónde invertir. Miguel lo aprobó el 19 nov 2026 (D-23) y se hizo en sesión
de día. La red de la nube del turno bloquea servicios externos (Overpass,
teselas): I-01 e I-04 pueden necesitar sesión de día; se confirma con la
primera corrida.

| # | Tarea | Criterio de aceptación | Estado |
|---|---|---|---|
| I-01 | **Catálogo de fuentes.** `datos/investigacion/fuentes.json`: cada fuente abierta u oficial que describa recorridos de rutas de San Juan del Río, empezando por el estudio técnico de la AMEQ de diciembre de 2022. Búsqueda previa (19 nov 2026, 12 am): se cita como «Estudio Técnico y Estratégicas de Mejora del servicio de transporte público de San Juan del Río, Querétaro» (Dirección Técnica de la AMEQ, dic 2022) en el Proyecto AMEQ 109/2024 de CEMER, hoy con error 404; **no está publicado** [verificación parcial]. Punto de partida: qrobus.gob.mx/Rutas (oficial, 42 entradas, paradas por cruce de calles en el HTML), nota AMEQ del 29 sep 2025 (rutas 48, 17 y 2), La Sombra de Arteaga del 31 mar 2026 (solo conteos: 41 urbanas) y el GTFS oficial de Qrobús v25 (sin revisar si incluye San Juan). Por fuente: URL, fecha de publicación, fecha de consulta, oficial sí/no, tipo de dato (itinerario en texto, mapa, paradas, horario) y rutas que cubre. Moovit se anota aparte, nunca como fuente abierta (D-22). Sin descargar material con derechos: solo referencia y cita breve. | Prueba: cada fuente tiene URL, fechas, tipo y rutas; ninguna dice «oficial» sin serlo; lo no confirmado dice [sin verificar] | EN REVISIÓN (rama cierre/2026-11-19; sesión del 19 nov 2026) |
| I-02 | **Matriz 42 rutas × fuentes.** `datos/investigacion/matriz.csv`: una fila por ruta (orden de `routes.txt`) y una columna por fuente; en cada celda, qué aporta (I = itinerario, P = paradas, M = mapa, H = horario o vacío). Nivel de confianza por ruta y por sentido: **alta** (fuente oficial con itinerario), **media** (fuente abierta no oficial u OSM), **baja** (solo inventario o solo Moovit). | Prueba: 42 filas en orden; cada nivel se puede recalcular desde las celdas; ningún sentido hereda el nivel del otro (regla 10) | EN REVISIÓN (rama cierre/2026-11-19; sesión del 19 nov 2026) |
| I-03 | **Pareto de cobertura.** Reporte `docs/investigacion/pareto-cobertura.md` con la gráfica de cuántas rutas cubre cada fuente (acumulado) y la lista de rutas por confianza. Propone el orden del lote siguiente (recorridos estimados): primero las rutas de confianza alta, empezando por las 5 piloto (D-06). | El reporte cuadra con la matriz (mismos totales); cada cifra con su fuente | EN REVISIÓN (rama cierre/2026-11-19; sesión del 19 nov 2026) |
| I-04 | **Relaciones de ruta en OpenStreetMap.** Una sola consulta a Overpass (sesión de día si la red del turno la bloquea) de las relaciones `route=bus` dentro del municipio, guardada en `datos/cache/overpass/`. Se anotan como fuente en I-01 e I-02; no se convierten en trazos todavía. | Una consulta, guardada con fecha; prueba de que la matriz las incluye | EN REVISIÓN (rama cierre/2026-11-19-dia): el único reintento respondió el 19 nov 2026, 1:44 am. 16 relaciones; 14 con número igual a una ruta del inventario, anotadas en I-01 e I-02 sin subir la confianza (no dicen el sentido); 1 suburbana fuera del inventario |

### Lote R: recorridos estimados de las 42 rutas (D-22) · aprobado por Miguel el 19 nov 2026 (D-24)

Miguel pidió (19 nov 2026) trabajar **todas las rutas de una vez** y
corregirlas conforme llegue información real. Es como liberar la primera
versión de todos los planos con su nivel de revisión a la vista: cada
recorrido sale **ESTIMADO, nivel C**, con sus fuentes por sentido, y cada
fuente nueva (estudio de la AMEQ, reportes de usuarios) genera una versión
nueva en `datos/gtfs-sjr/CHANGELOG.md`.

**Turno del 19 nov 2026 (11:30 pm):** toma solo M-05 a M-08 del bloque activo. Del lote R no toma nada: R-03 está BLOQUEADA y R-05 y R-06 dependen de ella.

**Reglas propias del lote R:**
- Las 42 rutas y los 2 sentidos de cada una, por separado (regla 10). Las 7
  rutas con conflicto (`docs/investigacion/pareto-cobertura.md`) también se
  trabajan, con la marca **CONFLICTO DE FUENTES** visible en su ficha.
- Orden: las 5 piloto (001, 002, 005, 012 y 040, D-06), después las de
  confianza media de más a menos vehículos (PET 2022) y al final las de
  confianza baja.
- Moovit solo para contrastar (D-22): no se copian sus listas de paradas. Los
  tramos ajustados con Moovit llevan «ajustado con referencia Moovit,
  consulta [fecha]». Donde no haya referencia de Moovit en la computadora de
  Miguel, la ficha dice «sin contraste».
- Ningún recorrido se dibuja como línea continua (regla 8): punteado, con
  ESTIMADO y nivel C, hasta que pase la revisión visual de HANDOFF §11.4.
- **Control de calidad por sentido:** el largo del recorrido estimado se
  compara contra los km oficiales del PET 2022 (o de La Sombra 2025 para la
  062 y la 023). Si se aleja más de 20 %, la ruta-sentido queda **FUERA DE
  TOLERANCIA** y no se publica hasta revisarla. La tolerancia de 20 % es
  ESTIMADO y se ajusta con datos.
- **Red:** la nube del turno bloquea los servicios externos. R-01, R-02 y
  R-04 consultan servicios públicos, así que se hacen en **sesión de día**
  desde la computadora de Miguel, una consulta a la vez y con caché (HANDOFF
  §11.6). El turno toma R-03, R-05 y R-06.

| # | Tarea | Criterio de aceptación | Estado |
|---|---|---|---|
| R-01 | **Calles oficiales por ruta (sesión de día).** Una sola descarga de la página pública qrobus.gob.mx/Rutas, guardada en `datos/cache/qrobus/` con fecha. Extraer, por ruta, la lista de calles o cruces que trae la página (`data-buscar`) a `datos/investigacion/calles-oficiales.json`. Marcar las rutas cuya lista trae calles que no son de San Juan del Río (p. ej. Bernardo Quintana). No se llaman las consultas internas del mapa (ver pregunta 1). | Prueba: 42 rutas con su lista o con «sin lista»; cada lista con fuente y fecha; las marcadas no se usan sin revisión | EN REVISIÓN (rama cierre/2026-11-19-dia): hecha en sesión el 19 nov 2026, 1:36 am, con una sola descarga (D-25). 42 de 42 con lista; **21 marcadas REVISAR** (mezclan calles de la ciudad de Querétaro); las listas no separan ida y vuelta ni cada cruce (se separan en R-03) |
| R-02 | **Extremos de cada ruta (sesión de día).** Origen y destino de las 42 rutas con coordenada: primero las verificadas de HANDOFF §11.3, después una parada de OSM (N-08) o una búsqueda en Nominatim (1 por segundo, en caché). Todo lo nuevo entra **POR VERIFICAR**; lo que cae fuera de San Juan o no coincide en nombre se descarta (lección 4). | Prueba: cada extremo con fuente; ninguna coordenada prohibida; ningún extremo «corregido a ojo» | EN REVISIÓN (rama cierre/2026-11-19-dia): hecha en sesión el 19 nov 2026, 1:42 am. 40 lugares: 12 con coordenada (9 de HANDOFF §11.3, 2 de ellos como referencia de zona; 3 de Nominatim, POR VERIFICAR) y **28 SIN COORDENADA** (Nominatim no dio un resultado que pase las reglas; entre ellos la Central de Autobuses, otra vez la de Cadereyta). 29 consultas, una por segundo, en `datos/cache/nominatim/` |
| R-03 | **Secuencia por sentido.** Para cada ruta-sentido, la lista de puntos de paso en orden desde las calles de R-01 y los extremos de R-02. Donde haya referencia de Moovit, se compara y los tramos que se ajusten llevan su etiqueta. | Prueba: 84 secuencias (o «sin datos» explicado); ningún sentido copia al otro; toda etiqueta Moovit va en tramos ajustados | **BLOQUEADA** (19 nov 2026, 1:50 am; espera decisión de Miguel). R-01 mostró que las listas oficiales separan los cruces solo con espacios y no dicen el sentido; 21 mezclan calles de Querétaro, y R-02 dejó 28 de 40 extremos sin coordenada. Hacerla así obligaría a suponer datos. **El turno no la toma** |
| R-04 | **Enrutado por calles (sesión de día).** OSRM público, una ruta-sentido a la vez, con pausa y caché en `datos/cache/osrm/`. | 84 respuestas guardadas con fecha y secuencia usada; ninguna consulta repetida | APROBADA (Miguel, 19 nov 2026; D-24) · sesión de día |
| R-05 | **Fichas y control de tolerancia.** `shapes.txt` y fichas por ruta-sentido con fuentes, nivel C, ESTIMADO y el largo contra los km oficiales. Reporte de las que quedan FUERA DE TOLERANCIA. | Prueba: cada ruta-sentido tiene largo estimado, km oficial (o «sin km oficial») y diferencia en %; las fuera de tolerancia no entran a la app; el validador sigue sin errores nuevos | APROBADA (Miguel, 19 nov 2026; D-24) · el turno se detiene si falta la tarea previa |
| R-06 | **Recorrido en la app.** Al elegir ruta y sentido, el mapa dibuja su recorrido estimado **punteado**, con «ESTIMADO · Nivel C», sus fuentes y, si aplica, CONFLICTO DE FUENTES o «ajustado con referencia Moovit». Las rutas sin recorrido siguen diciendo «en verificación». Requiere M-05 a M-08. | Prueba en navegador a 390 px: ningún trazo continuo; cambiar de sentido cambia el trazo; sin restos de la ruta anterior | APROBADA (Miguel, 19 nov 2026; D-24) · el turno se detiene si falta la tarea previa |

**Preguntas para Miguel antes de aprobar:**
1. ~~**Abierta.**~~ **Respondida (D-25, 19 nov 2026): solo las calles visibles.** La página oficial de rutas dibuja el **trazo oficial por sentido** con una
   consulta interna (`/Rutas/rutaMostrar`). Sería la mejor fuente, pero es
   una consulta que la página hace para sí misma, no un servicio publicado, y
   no declara licencia. ¿La usamos (una vez por ruta-sentido, con caché), o
   nos quedamos con las listas de calles visibles en la página?
2. ~~¿Te parece bien la tolerancia de 20 %?~~ Sí (Miguel, 19 nov 2026, D-24).

Al terminar N-03 y N-08, B1 queda listo para la revisión de Miguel. Al
terminar M-08, B2a queda listo para que Miguel lo vea en su teléfono. El
bloque siguiente (B2) necesita su aprobación.

### Preguntas de B1: respondidas por Miguel el 17 nov 2026

1. **Paradas:** sí, desde OpenStreetMap, marcadas POR VERIFICAR EN CAMPO
   (N-08 aprobada, D-16).
2. **Vigencia del feed:** 6 meses, del 17 nov 2026 al 16 may 2027 (D-17; ya
   aplicado en `feed_info.txt` y `calendar.txt`).
3. **Ida y vuelta:** sentido 0 = ida, sentido 1 = vuelta (D-18).
4. **Agencia de la 062 y la 023:** agencia propia `SJR-INTER`, por verificar
   (D-19; ya aplicado en `agency.txt` y `routes.txt`).
