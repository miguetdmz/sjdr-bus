# SJDR Bus · Reglas de trabajo

Nombre visible: **SJDR Bus** (D-28). Repositorio público: `miguetdmz/sjdr-bus` (D-29).
App ciudadana de tiempos **estimados** de autobús para San Juan del Río, Qro.,
construida sobre un GTFS propio (GTFS-SJR). Proyecto de código abierto.

Miguel no programa: Claude construye, Miguel aprueba y verifica.

## Antes de proponer o construir
- Leer `docs/PLAN.md`: empezar por "Estado actual" y "Relevo para la
  siguiente sesión".
- Leer las últimas entradas de `docs/DECISIONES.md`. **DECISIONES manda
  sobre HANDOFF.** Si algo del HANDOFF se corrige, se registra ahí con su
  número D-xx.
- `docs/HANDOFF.md` es el contrato de origen (se escribió durante una
  práctica profesional). `docs/REVISION-HANDOFF.md` lista lo que se encontró mal en
  ese trabajo: todo dato que venga de la práctica se cruza contra esa lista antes de
  usarse.
- Las reglas que no se negocian están en `docs/HANDOFF.md` §14. Las más
  importantes, abajo.

## Reglas que no se negocian (resumen de HANDOFF §14)
1. Nada esquemático, de referencia o simulado se presenta como real u
   oficial. Cada cifra lleva fuente (GTFS oficial / Moovit / campo / AMEQ),
   estado y fecha en los datos; en la pantalla basta la leyenda general «datos
   en proceso de validación» y las fuentes van en los términos (D-52).
2. Todo tiempo calculado dice ESTIMADO (o MEDIDO EN CAMPO con fecha). EN VIVO
   solo con una posición GPS real detrás.
3. Presupuesto $0. Antes de cualquier paso con costo, avisar a Miguel con el
   monto y esperar su sí.
4. Iniciativa independiente: no usar la marca "Qrobús" como nombre de la app
   ni afirmar que la AMEQ/Qrobús opera las unidades de San Juan. Leyenda de
   iniciativa independiente visible. Sin escudo ni colores oficiales.
5. Móvil primero: la primera pantalla es el mapa completo con ☰, «¿A dónde
   quieres ir?» y el botón de paradas, sin scroll y sin textos de reporte encima.
   La ruta se elige en las tarjetas del menú y su sentido va dentro del detalle
   (D-53, cambia D-49 y HANDOFF §14).
6. Mapa real o nada: Leaflet + OpenStreetMap con atribución visible. Cero
   Google (ni mapas, ni fuentes, ni geocodificación).
7. OSRM, Nominatim y Overpass solo al **construir el dato**, con caché en el
   repositorio. La app nunca los consulta en vivo.
8. Niveles de precisión A/B/C por tramo (HANDOFF §11.4). Un tramo C nunca se
   dibuja como línea continua.
9. Las rutas vigentes (42: las de San Juan que lista qrobus.gob.mx/Rutas, D-70) en un selector visual de tarjetas,
   en el orden de `routes.txt`, sin menú desplegable (D-53, cambia D-50). Las
   tarjetas muestran insignia (R1, T62) y nombre, nunca «Ruta 001».
   Ninguna se oculta por falta de datos y ninguna se completa con datos supuestos.
10. Nunca usar el dato de un sentido para el otro: cada sentido lleva su
    propio conteo de paradas y su duración.

## Cómo trabajar
- Un bloque de `docs/PLAN.md` a la vez. No iniciar el siguiente sin la
  aprobación de Miguel.
- **Primero la maqueta, después la construcción (D-54):** todo cambio de
  pantalla empieza con una maqueta en `docs/maquetas/<tarea>/` y sus capturas
  a 390 y 1280 px; con el sí de Miguel se construye en `web/`.
- Responder en español. Explicar cada concepto nuevo con una analogía breve
  de manufactura o calidad.
- Decir cómo verificar cada entrega (en el navegador y en ancho de teléfono).
- Reportar el resultado real de los comandos, también cuando fallan.
- Un chat nuevo por bloque. Al cerrar cada sesión, actualizar "Estado actual"
  y "Relevo para la siguiente sesión" en `docs/PLAN.md`.
- Pedir permiso antes de hacer push, crear repositorios, desplegar o
  publicar algo.

## Turno nocturno (trabajo autónomo, D-10, D-12, D-13, D-20, D-44)
- **Relevo por bandera (D-44).** Miguel trabaja sin hora fija de cierre. Al
  cerrar, la sesión del día hace el **relevo de turno**: commit, rama subida a
  GitHub con su PR en borrador, `docs/PLAN.md` y `docs/COLA-NOCTURNA.md` al día
  con las tareas APROBADA y, en el último commit, `docs/RELEVO.md` en
  **ENTREGADO**. Si son las 6:00 pm o después, dispara el turno al momento
  (RemoteTrigger `run` de `trig_01TQ5dA2RtFfQaYGVmwgvYJY`). Lo que no está
  subido a GitHub, el turno no lo ve.
- El turno sale de la rama abierta más reciente (la del día o la de la noche
  anterior; si no hay, de `main`), solo si su bandera dice ENTREGADO para esa
  noche, y toma en orden las tareas **APROBADA** del bloque activo de
  `docs/COLA-NOCTURNA.md`, un commit por tarea. Respaldo: se asoma cada hora de
  11:39 pm a 3:39 am. No empieza tareas después de las 4:30 am y cierra antes
  de las 5:00 am.
- Una rama y un PR en **borrador** por noche (`noche/AAAA-MM-DD`, con la
  fecha de la mañana en que termina), nunca en `main`. Al terminar marca
  **TURNO TERMINADO** en `docs/RELEVO.md`. Las reglas completas están en la
  cola.
- El inspector se asoma cada hora de 12:15 a 5:15 am: revisa el PR en cuanto
  ve TURNO TERMINADO (un comentario por commit) y deja LIBERADO o RETENIDO con
  el reporte para Miguel. A las 5:15 am revisa lo que haya.
- Nunca integra, publica, despliega ni gasta. Si una tarea exige una
  decisión de Miguel, se detiene y la deja anotada en el PR.

## Seguridad
- Secretos solo en `.env.local` (ignorado por git). Nunca en commits, en el
  chat ni en código del navegador.
- Nunca pedirle a Miguel capturas de archivos o pantallas con llaves.
- `referencias/` no se sube a GitHub (ver `.gitignore` y D-07).

## Licencias
- Código: MIT. Datos GTFS-SJR: ODbL 1.0, porque los trazos se derivan de
  OpenStreetMap (D-05).
- Dependencias directas solo MIT, BSD, ISC o Apache-2.0; anotarlas en
  `docs/LICENCIAS.md`.

## Comandos
- `npm run verificar`: puerta de calidad completa (reglas del proyecto y
  gitleaks). También corre sola antes de cada push (`.githooks/pre-push`).
- `npm run reglas`: solo la revisión automática de reglas
  (`scripts/reglas.mjs`).
- Después de clonar: `git config core.hooksPath .githooks`.

## Lecciones aprendidas
Cada lección: fecha, qué pasó, causa y la regla que la evita. Al cerrar cada
bloque, preguntar: "¿Hubo alguna falla que deba volverse lección?". Si se
puede, convertir la regla en una prueba automática.

1. **El mockup de la práctica se reconstruyó dos veces (antes del 16 nov 2026).** El
   primero enterraba el teléfono bajo un reporte; el segundo usaba un mapa
   esquemático por el que los camiones cruzaban manzanas. Causa: construir
   sin criterio de aceptación medible. Regla: cada bloque define su criterio
   antes de empezar y se verifica en ancho de teléfono.
2. **El mockup copió el dato de un sentido al otro (16 nov 2026).** En las
   rutas 001, 002, 005 y 012 la vuelta repite paradas y duración de la ida,
   contra lo que decía el propio handoff. Regla 10 de arriba. Prueba que lo
   evitará (B1): comparar cada ficha contra su fuente por sentido.
3. **El mockup consultaba OSRM en vivo y cargaba fuentes de Google (16 nov
   2026).** Regla 6 y 7. Prueba que lo evita: `scripts/reglas.mjs` rechaza
   esos dominios en el código de la app.
4. **Nominatim devolvió lugares equivocados (Central de Cadereyta,
   "Universidad Tecnológica Bridge").** Toda coordenada de geocodificación
   entra como POR VERIFICAR; nunca se "corrige a ojo" con una aproximada.
   Prueba que lo evita: `scripts/reglas.mjs` rechaza esas dos coordenadas.
5. **Una herramienta nueva de la puerta falló fuera de donde se probó (17 nov
   2026).** El validador de GTFS y gitleaks pasaban en un ambiente y fallaban
   en el otro: en GitHub Actions gitleaks daba error 403 por falta de un
   permiso de lectura, y en la Mac de Miguel el validador no encontraba el
   Java de Homebrew. Causa: se dio por buena la herramienta con una sola
   corrida. Regla: toda herramienta nueva de `npm run verificar` se comprueba
   en los dos ambientes (GitHub Actions y la Mac de Miguel) antes de dar la
   tarea por hecha.
   - 2026-11-19 (2.ª vez): la prueba nueva `scripts/pruebas/bajas.test.mjs`
     pasó en la Mac y falló en GitHub Actions: leía `web/public/datos/rutas.json`,
     que se genera al compilar y no está en git (ENOENT). Detección temprana:
     antes de subir una prueba nueva, correrla sin los archivos ignorados por
     git (como los ve GitHub).
   - 2026-11-21 (3.ª vez): la prueba de D-58 «el zoom no se encima con el chip»
     pasó en la Mac y falló en GitHub Actions por 7 px: con la fuente de Linux el
     nombre de la ruta ocupó un renglón más, el chip creció y el zoom (a altura fija)
     quedó encima. Era un defecto real (en un teléfono de 320 px se enciman 71 px).
     Arreglo: el zoom mide el alto real del chip; prueba nueva a 320 px con la ruta de
     nombre más largo, validada con el defecto.
   - 2026-11-23 (4.ª vez, ~11:18 pm): la bitácora de campo (artefacto de claude.ai) se
     entregó probada solo como archivo en el navegador de Claude; en el iPhone de Miguel no
     se pudieron borrar los viajes de prueba (el botón estaba al fondo, tras 7 secciones) y
     las instrucciones del GPX no servían. Arreglo: borrar desde la lista y arriba; después,
     página de campo con su simulación de viaje y prueba de Miguel en su iPhone antes de
     usarla. Detección temprana: lo que Miguel usará en su teléfono se prueba ahí (vista
     previa) antes de darlo por bueno.
   - 2026-11-24 (5.ª vez, 12:39 am): la página de campo pasó 101 de 101 pruebas en Chromium
     y la simulación de viaje, pero en el iPhone de Miguel «Iniciar viaje» no reaccionaba:
     esperaba un sentido que nadie había marcado. Las pruebas y la simulación tocaban el
     sentido porque Claude sabía que hacía falta; un usuario nuevo no. Arreglo: sentido
     marcado solo; prueba de usuario en WebKit con iPhone 13
     (`docs/evidencia/d66/probar-iphone.mjs`), solo con toques y sin pasos que el usuario no
     sabría dar. **Corrección de Miguel:** antes de entregarle algo, Claude lo usa como si
     fuera él, desde cero.
   Ocurrencias: 5 · Estado: ACTIVA · **PROPUESTA DE CONTROL** (con el sí de Miguel): sumar
   a `npm run verificar` la prueba de usuario en WebKit con iPhone de cada página que Miguel
   use en su teléfono; además, toda prueba de posición o tamaño corre también a 320 px y con una fuente más ancha
   que la de la Mac (proyecto extra de Playwright), para ver en la Mac lo que verá
   GitHub. Prueba: la falla de D-58 (antes del arreglo) aparece en la Mac.
   **ALERTA DE CALIDAD (19 nov 2026, Miguel):** se repitió; compartirla con
   todos los proyectos. La cosecha del Second Brain la lleva a la bóveda y
   propone subirla a `standards.md` (no se sube sin el sí de Miguel).
6. **Claude le ofreció a Miguel una acción que los candados no permiten (17
   nov 2026).** Ofreció integrar el PR, pero `.claude/settings.json` le niega
   `gh pr merge`, `gh pr ready` y el push a `main`. Regla: antes de ofrecer
   una acción, revisar la lista `deny` de `.claude/settings.json`; si está
   negada, decir desde el principio que la hace Miguel y darle los pasos.
7. **El chat confundió el día y entregó el relevo tarde (18 nov 2026).** El
   prompt de arranque lo escribió el chat anterior con la fecha equivocada
   («revisa el turno de anoche» cuando el turno aún no corría), y la decisión
   D-22 se subió a las 11:45 pm, después de que el turno arrancó (11:39 pm):
   el turno trabajó sin ella. Causa: hablar de «hoy», «esta noche» o
   «mañana» sin mirar el reloj. Regla: antes de decir «hoy», «anoche», «esta
   noche» o «mañana», y antes de escribir un prompt de arranque, correr
   `TZ=America/Mexico_City date`; el prompt lleva la fecha y la hora
   absolutas. Si ya pasaron las 11:30 pm, el relevo de esa noche se perdió y
   se dice así.
   - 2026-11-18 (1.ª vez): este caso.
   - 2026-11-20 (2.ª vez, 1:28 y 1:43 am): Claude escribió en notas de D-43 y
     en un comentario de `scripts/cruces.mjs` horas de memoria («1:45 am»,
     «1:47 am») en vez de sacarlas de `date`; se corrigió antes de subir.
     Regla añadida: toda hora que se escribe en una nota, un commit o el código
     sale de `TZ=America/Mexico_City date` corrido en ese momento.
   - 2026-11-20 (3.ª vez, ~2:14 am): Claude escribió «2:13 am» de memoria en
     un comentario de `scripts/cruces.mjs` (decisión de Miguel sobre la
     23/023); el `date` corrido al recibir el mensaje decía 2:14 am. Se
     corrigió antes del commit 9cf286d.
   - 2026-11-20 (4.ª vez, ya con el control): Claude escribió de memoria la hora
     del ajuste 2 de D-48; el hook avisó «18 min DESPUÉS de la hora real» y se
     corrigió antes del commit. El control funcionó.
   - 2026-11-20 (5.ª vez, ya con el control): en el relevo de `docs/PLAN.md` Claude
     escribió la hora antes de correr `date` en el mismo comando; el hook avisó
     14 min de diferencia y se corrigió antes del commit. Detección temprana: correr
     `date` en un paso aparte, antes de escribir.
   **Causa raíz (análisis pedido por Miguel, 20 nov 2026, anotado a las 4:13 pm):**
   «si el hook siempre tiene la razón, el error es recurrente y hay que
   resolverlo de raíz». Las 5 ocurrencias tienen la misma causa: Claude no
   tiene reloj en su contexto, y casi todas las horas que escribe son «a qué
   hora decidió Miguel», un momento que nunca midió; la estimaba, y mientras
   más larga la tarea, más se desviaba. El hook hora-real solo detecta después.
   **Acción de raíz (prevención):** hook `.claude/hooks/reloj.mjs`
   (UserPromptSubmit): con cada mensaje de Miguel entrega la hora real de
   México de ese instante; esa es la fuente de «Miguel decidió a las…».
   Cualquier otra hora sale de `date` en un paso aparte. Prueba:
   `scripts/pruebas/reloj.test.mjs` (el caso «3:38 pm» contra 3:52 pm).
   Si vuelve a ocurrir con el reloj puesto, se cambia el aviso por bloqueo.
   Ocurrencias: 5 · Estado: **PROMOVIDA → hook `reloj` (prevención, 20 nov 2026) + hook `hora-real` (detección)** (hora-real: 20 nov 2026,
   con el sí de Miguel): `.claude/hooks/hora-real.mjs`, conectado en
   `.claude/settings.json` (PostToolUse de Edit, Write, MultiEdit y Bash). Si
   el texto nuevo trae una hora («2:13 am», «1:28 y 1:43 am») que no estaba
   antes, le devuelve a Claude la hora real de México y cuántos minutos
   difiere; una hora posterior a la real se marca fuerte. Es aviso, no bloqueo.
   Prueba: `scripts/pruebas/hora-real.test.mjs` (atrapa el caso real de la 3.ª
   ocurrencia). Verde en la Mac, en UTC y sin archivos ignorados; en GitHub
   Actions se confirma al subir (lección 5).
8. **Una página descargada traía una llave de sesión (19 nov 2026).** En R-01
   la página pública de rutas se guardó primero en `datos/cache/qrobus/`, dentro
   del repositorio, y traía una llave de sesión (`csrf-token`). Se detectó a
   mano antes del commit. Causa: se trató la descarga como dato limpio sin
   revisarla. Regla: toda página descargada se revisa en busca de llaves antes
   de guardarla en el repositorio; la copia completa va a `referencias/` (fuera
   de git) y al repositorio entra solo lo extraído, con su huella sha256. Prueba
   que lo evita: `scripts/reglas.mjs` rechaza cualquier archivo de `datos/` o de
   la app que traiga una llave de sesión.
9. **El prompt de arranque no servía en el momento en que Miguel lo pega
   (19 nov 2026).** Al cerrar, Claude entregó un arranque «para pegar mañana» y
   luego gastó tres mensajes explicando cuándo abrir el chat; Miguel quería
   dejar el chat siguiente abierto y con el prompt pegado desde ya, para que
   mañana, con un solo mensaje suyo, le reporte el turno con links directos y
   pasos exactos para aprobar en GitHub. Causa: el arranque se escribe para el
   momento que Claude imagina, no para el momento en que Miguel lo pega (al
   cerrar). Regla: todo prompt de arranque se puede pegar en cuanto se entrega;
   si el trabajo debe esperar (turno nocturno corriendo), el prompt mismo le
   dice al chat nuevo que no haga nada hasta el primer mensaje de Miguel y que
   entonces reporte con links directos y pasos exactos. Detección temprana:
   antes de entregar un arranque, preguntarse «¿qué pasa si lo pega ahora
   mismo?».
   - 2026-11-17 (1.ª vez, en la memoria de Claude): una tarjeta de sesión nueva
     no aclaraba si se podía abrir mientras el turno nocturno trabajaba.
   - 2026-11-19 (2.ª vez): este caso.
   - 2026-11-20 (3.ª vez, 1:18 am): Claude entregó el arranque y, cuando el
     estado cambió (PR 2 integrado, commits subidos, M-08 verificada en la
     Mac), mandó «una corrección a ese arranque» y pendientes sueltos en vez
     de reemitir uno solo. Miguel: «tú eres el responsable de que la hoja
     viajera pase correcta». Regla añadida: si algo cambia después de
     entregar el arranque, se reemite completo y verificado contra el estado
     real (git, GitHub, bandera, datos); nunca un parche aparte.
   - 2026-11-22 (4.ª vez, corrección de Miguel escrita en el arranque de las 9:52 pm):
     los arranques decían «no hagas nada hasta mi primer mensaje» aunque no hubiera
     motivo para esperar. Regla corregida: **el prompt de arranque empieza a trabajar
     en cuanto se pega.** Solo espera un mensaje de Miguel si hay una razón real
     (el turno nocturno está corriendo o falta un sí de Miguel) y dice cuál.
   Ocurrencias: 4 · Estado: ACTIVA · **PROPUESTA DE CONTROL** (20 nov 2026):
   `scripts/arranque.mjs` que arme el bloque de estado del arranque desde la
   realidad (hora de México, rama, commits sin subir, PR abiertos con link,
   bandera de `docs/RELEVO.md`, resumen de `cruces.json`, pendientes de la
   cola). Prueba: con un commit sin subir, el bloque lo muestra. Se construye
   con el sí de Miguel.

10. **Claude hizo un commit con una prueba en rojo (20 nov 2026).** En R-03
   corrió las pruebas, la salida decía «fail 1» y aun así hizo el commit
   3daac3a; se corrigió en el siguiente (d09d9d5) y no llegó a GitHub porque el
   candado de `.githooks/pre-push` lo habría frenado. Causa: no tratar «fail > 0»
   como paro de línea; las pruebas se corrían en el mismo comando que el commit.
   Regla: nunca commit si la última corrida de pruebas dice fail > 0; correr las
   pruebas, leer el resultado y solo entonces hacer el commit, en pasos aparte.
   Detección temprana: el commit va en un comando distinto al de las pruebas.
   - 2026-11-20 (1.ª vez): este caso.
   Ocurrencias: 1 · Estado: ACTIVA · **PROPUESTA DE CONTROL** (con el sí de
   Miguel): `.githooks/pre-commit` que corra `node --test scripts/pruebas/` y
   detenga el commit con fail > 0. Prueba: con una prueba que falla a propósito,
   `git commit` se niega.
11. **Pruebas que fijaban el número del día se rompieron con arreglos buenos (20
   nov 2026).** En R-03, tres pruebas exigían valores del momento: «exactamente
   690 UBICADOS», «al menos 26 APROXIMADOS» y «México 120 × Benito Juárez nunca
   tiene punto». Arreglos legítimos con evidencia (Jurica, «MÉXICO 120» = Federal
   120) las pusieron en rojo y hubo que reescribirlas. Causa: la prueba revisaba
   la medición del lote, no la especificación (la regla de fondo). Regla: una
   prueba revisa la regla («D-45 no toca los UBICADOS»: ninguno trae método ni
   estado anterior), no el conteo del día; un número fijo solo si la regla es
   ese número (las rutas de la referencia de qrobus, D-70). Detección temprana: al escribir un número en una
   prueba, preguntarse «¿un arreglo bueno lo cambiaría?»; si sí, no va.
   - 2026-11-20 (1.ª vez, ~9:49 am): «exactamente 690» falló con Jurica.
   - 2026-11-20 (2.ª vez, ~11:49 am): «al menos 26» y «México 120 sin punto»
     fallaron con «MÉXICO 120» = Federal 120.
   Ocurrencias: 2 · Estado: ACTIVA (a la 3.ª se promueve a control).
12. **Miguel no sabía en qué parte del proyecto íbamos (20 nov 2026).** La
   rama, el PR y el chat se llamaban por fecha («cierre/2026-11-19-publico»,
   «Cierre 19 nov»). El PR 1 juntó 70 commits sin integrarse a `main` (abierto
   desde el 19 nov, 9:18 am, según GitHub; `main` con 1 commit). El PR 2 entró
   a esa rama y no a `main`, y el reporte decía «integrado» sin decir a dónde.
   Causa: el trabajo se nombraba por fecha y no por la estructura del plan, así
   que nada mostraba la estación, la operación ni lo que ya estaba liberado.
   Regla (D-47): todo se nombra **Bloque · Tarea · Versión**. Bloque = fase del
   plan (B3 Trazos); tarea = entregable dentro del bloque (R-03 cruces);
   versión = lo integrado en `main` y publicado (v0.1, v0.2…), que sube un
   número con cada integración. Ramas de día: `bN/tarea-tema` (p. ej.
   `b3/r03-cruces`); las del turno siguen `noche/AAAA-MM-DD` (D-44). Todo
   reporte de «integrado» dice a qué rama. «Estado actual» de `docs/PLAN.md`
   abre con esa línea. Detección temprana: si el nombre de una rama, un PR o
   un chat no dice su bloque y su tarea, se renombra antes de seguir.
   **Para todos los proyectos (Miguel, 20 nov 2026):** la cosecha del Second
   Brain la lleva a la bóveda y propone subirla a `standards.md` (no se sube
   sin el sí de Miguel).
   - 2026-11-20 (1.ª vez): este caso.
   - 2026-11-20 (2.ª vez, Miguel lo señaló a las 4:27 pm): este chat se llamaba
     «Cierre 19 nov: nombre «SJDR Bus»…» y el reporte de estado abrió con la rama
     por fecha. Causa: la app titula el chat con el título del PR vinculado (el
     PR 1 se sigue llamando «Cierre 19 nov…») y la detección temprana no se
     aplicó al arrancar. Arreglo: chat renombrado a «B2 · E-03/D-50 Selector
     visual de rutas · hacia v0.2». Detección temprana añadida: al arrancar un
     chat, revisar su título y el del PR vinculado; todo reporte abre con Bloque ·
     Tarea · Versión, y la rama por fecha solo se menciona como dato técnico.
   Ocurrencias: 2 · Estado: ACTIVA (a la 3.ª se promueve a control).
13. **Al rehacer los estilos se borraron reglas que seguían en uso (20 nov
   2026).** En E-03 (D-48), al quitar bloques completos del CSS por posición,
   se fueron el fondo blanco del menú (salió transparente) y la regla que
   quitaba el velo en computadora (el mapa salió gris). Las dos se vieron en la
   revisión visual antes del commit. Causa: se borró un bloque entero sin hacer
   inventario de los selectores que contenía. Regla: antes de borrar o mover un
   bloque de estilos, listar sus selectores y confirmar dónde queda cada uno;
   revisar en 390 px y 1280 px antes del commit. Prueba que lo evita
   (`pruebas-navegador/b2a.spec.mjs`): el menú abierto tiene fondo opaco y en
   computadora no hay velo. Detección temprana: si un cambio de estilos borra
   más líneas de las que agrega, revisar qué selectores desaparecieron.
   - 2026-11-20 (1.ª y 2.ª vez, misma sesión): fondo del menú y velo.
   - 2026-11-20 (3.ª vez, ~10:20 pm): en la maqueta de D-55 (`docs/maquetas/d55/`),
     un reemplazo por número de línea (`sed '153s/.*/…/'`) pisó la regla
     `.tarjeta.partida .tarjeta-nombre b` (la que mantiene el «–» pegado a su
     palabra). Se vio en la salida del mismo comando y se restauró antes de las
     capturas. Misma causa: tocar estilos por posición sin ver qué había ahí.
   Ocurrencias: 3 · Estado: ACTIVA · **PROPUESTA DE CONTROL** (con el sí de
   Miguel): `scripts/selectores.mjs`, llamado desde `npm run reglas`, que compara
   los selectores de `web/src/estilos.css` y de los `<style>` de
   `docs/maquetas/*/maqueta.html` contra la última versión en git y falla si
   desaparece un selector que no esté anotado en el inventario de la tarea
   (`docs/evidencia/<tarea>/inventario-selectores.md`). Prueba: borrar a
   propósito `.tarjeta.partida .tarjeta-nombre b` y ver que `npm run reglas`
   falla y nombra el selector. Detección temprana añadida: nunca editar estilos
   por número de línea; reemplazar por texto exacto.
   Registrada con el sí de Miguel.

14. **Claude cambió en la maqueta algo que Miguel no pidió (20 nov 2026).** En
   D-55 Miguel pidió partir la tarjeta (camión y R1 a la izquierda, nombre a la
   derecha). Como con 3 columnas no cabían los nombres (medido), Claude pasó por
   su cuenta a 2 columnas y lo mandó ya aplicado, anotado como «decidido al hacer
   la maqueta». Miguel (10:02 pm): «rompiste una regla… si es que no modificas
   otra cosa». Causa: un choque entre el pedido y algo ya aprobado se resolvió
   cambiando lo aprobado, en vez de mostrar el choque con la medición y
   preguntar. Regla: en una maqueta o construcción se cambia solo lo pedido; si
   el pedido choca con algo aprobado, se busca primero cómo cumplir el pedido sin
   tocar lo aprobado (aquí: letra que se ajusta y tarjeta más alta), y si no se
   puede, se muestran las opciones como alternativas, sin aplicarlas, y se
   pregunta. Detección temprana: antes de mandar capturas, listar cada diferencia
   contra la versión anterior; toda diferencia que no salga del pedido es una
   pregunta, no un cambio.
   - 2026-11-20 (1.ª vez): este caso.
   Ocurrencias: 1 · Estado: ACTIVA. Aplica a todos los proyectos: propuesta para
   `standards.md` (no se sube sin el sí de Miguel).

15. **Una prueba nueva pasaba con el defecto puesto (22 nov 2026).** En D-61, la
   prueba p3b del encuadre (`pruebas-navegador/d61.spec.mjs`) revisaba que el
   punto de inicio de la ruta no quedara bajo el círculo «mi ubicación»; pasaba
   aun con el defecto, porque lo tapado era la etiqueta de ~163 px, no el punto.
   Se detectó al regresar a propósito el código al estado con el defecto antes de
   dar la prueba por buena; se quitó el ajuste (tampoco lo arreglaba) y el hallazgo
   fue a Miguel, que decidió dejarlo así. Causa raíz: la prueba se escribió desde la
   hipótesis del arreglo (mover el punto), no desde lo que se vio en la captura (la
   etiqueta tapada), y no se había corrido contra el defecto. Regla: toda prueba
   nueva de un defecto se corre una vez con el defecto puesto y debe fallar antes de
   darla por buena; si pasa, mide otra cosa. Detección temprana: escribir la prueba
   con el elemento que se ve mal en la captura (aquí, la etiqueta) y anotar en el
   reporte «antes del cambio fallaban N de M».
   - 2026-11-22 (1.ª vez, registrada a pedido de Miguel a las 4:26 pm): este caso.
   Ocurrencias: 1 · Estado: ACTIVA. Aplica a todos los proyectos: propuesta para
   `standards.md` (no se sube sin el sí de Miguel).

16. **Una prueba dependía de cuándo terminaba de cargar la app (23 nov 2026).** En
   D-56 fase 2, la subida se frenó en el candado de `.githooks/pre-push`: la prueba
   t1 de `pruebas-navegador/d62.spec.mjs` (844 × 280) cuenta las peticiones de red
   al tocar el círculo «mi ubicación» y vio `lugares.json`. No lo pedía el toque: es
   un archivo nuevo del arranque (se pide después de `rutas.json`) que en una corrida
   lenta cayó durante el toque. Minutos antes, la misma revisión había pasado 87 de
   87. Al arreglarla salió un defecto real que la prueba de D-57 a 1280 px no veía:
   si tocabas tu parada durante un acercamiento animado, la ficha quedaba fuera de la
   vista (10 de 10 fallas; arreglado en `irAParada()`, 25 de 25). Causa raíz: las
   pruebas empezaban a contar mientras la app seguía arrancando, así que el
   resultado dependía de qué llegaba primero (una carrera), y al agregar un archivo
   al arranque no se revisaron las pruebas que vigilan la red. Regla: una prueba
   que vigila la red o mide la pantalla después de una acción empieza cuando la app
   terminó de arrancar (`vigilarRed()` de `pruebas-navegador/ayuda.mjs` espera la
   red quieta); al agregar algo al arranque, se corren con `--repeat-each` las
   pruebas que vigilan la red. Detección temprana: si una prueba pasa en una corrida
   y falla en la siguiente sin cambios, es una carrera; se reproduce retrasando a
   propósito el arranque (`page.route` con espera) antes de arreglarla. Validación
   del arreglo (commit 0836589): con la carrera forzada, la prueba vieja fallaba 5
   de 5 y la nueva pasaba 5 de 5; con una petición puesta a propósito en el toque,
   la nueva falla 5 de 5.
   - 2026-11-23 (1.ª vez, registrada a pedido de Miguel a las 12:27 pm): este caso.
   Ocurrencias: 1 · Estado: ACTIVA. Aplica a todos los proyectos: propuesta para
   `standards.md` (no se sube sin el sí de Miguel).

17. **Una validación con el defecto puesto corrió contra la compilación anterior (23
   nov 2026).** En el ajuste «Orden» de D-56 fase 2 (commit e7c6b3d), al hacer la
   prueba de la lección 15 se pusieron uno por uno cinco defectos a propósito. El
   defecto B («sin distancia») no compilaba (error de tipos), la compilación falló y
   Playwright sirvió la carpeta `web/dist` del defecto anterior (A): el número que
   salió no medía el defecto B. Se vio en la salida, se repitió con un defecto que sí
   compila (`void lejos;`) revisando la salida de la compilación en cada corrida, y
   quedó anotado en `docs/evidencia/d56f2/inventario.md`. Causa raíz: el guion de
   validación no se detenía si la compilación fallaba, y `vite preview` sirve lo que
   haya en `web/dist` aunque sea viejo; nada confirmaba que el defecto estuviera
   dentro de lo que se probó. Regla: en cada corrida con un defecto puesto, la
   compilación debe salir con código 0 antes de correr las pruebas; si falla, la
   corrida no cuenta y el defecto se reescribe para que compile. Detección temprana:
   el guion corta con `set -e` (o revisa `$?`) después de `npm run build`, y el
   reporte dice «compilación OK» junto a cada número de fallas.
   - 2026-11-23 (1.ª vez, registrada a pedido de Miguel a las 7:41 pm): este caso.
   Ocurrencias: 1 · Estado: ACTIVA. Va de la mano con la lección 15 (es la forma
   correcta de hacer su prueba). **PROPUESTA DE CONTROL** (con el sí de Miguel):
   `scripts/validar-defecto.mjs`, que compila, se detiene si la compilación falla y
   solo entonces corre las pruebas indicadas. Prueba: con un defecto que no compila,
   el guion se niega a dar un número. Aplica a todos los proyectos: propuesta para
   `standards.md` (no se sube sin el sí de Miguel).

18. **Un chat de consulta terminó construyendo fuera del plan (23 y 24 nov 2026).**
   El chat «Análisis de minuta con profesor» se abrió para analizar la minuta de una
   plática con un operador. Terminó proponiendo y construyendo D-66 (maquetas, página
   de campo y 12 commits) en la misma carpeta donde otro chat cerraba v0.3 y preparaba
   R-03. Consecuencias: un commit de cierre cayó en la rama del otro chat (7:42 pm y
   se movió a mano), quedaron 3 commits de D-66 duplicados en `b3/r03-cruces` local, y
   el plan de R-03 esperó con el trabajo de los dos chats cruzado. Miguel (23 nov,
   11:57 pm): «era una consulta externa… me hubiera gustado que esa ejecución hubiera
   sido como parte de alguna de nuestras fases». Causa raíz: la consulta se volvió
   construcción sin pasar por el plan (bloque, fase y su sí en el chat del bloque) y
   sin revisar si otro chat escribía en la carpeta. Regla: un chat de consulta no
   construye. La idea que salga se registra como IDEA o PROPUESTA en DECISIONES y el
   chat del bloque la vuelve fase del plan con el sí de Miguel. Antes de cambiar de
   rama, hacer commit o escribir en PLAN o DECISIONES, revisar con `list_sessions` y
   `git status` que ningún otro chat trabaje en la carpeta (estándar 13: «VOY» y
   «LIBRE»). Detección temprana: si un chat cuyo título no dice Bloque · Tarea (lección
   12) va a escribir en git, se detiene y pregunta.
   - 2026-11-23 (1.ª vez, registrada a las 1:21 am del 24 nov): este caso.
   Ocurrencias: 1 · Estado: ACTIVA. Aplica a todos los proyectos: propuesta para
   `standards.md` (complementa la regla 13; no se sube sin el sí de Miguel).

19. **Las ramas vivían días y se multiplicaban (25 nov 2026).** Al integrar el PR 7, la
   rama de campo `b3/d66-campo` llevaba 2 días con 15 commits fuera de `main` y chocó en
   `docs/DECISIONES.md` y `docs/PLAN.md`. Había 19 ramas locales (6 ya integradas) y el
   plan era abrir una rama más para resolver el choque. Miguel (4:53 pm): «cada vez vamos
   creando más derivaciones, más ramas». Causa raíz: no había tope de ramas vivas (como
   una línea sin límite de trabajo en proceso), y los dos documentos que todos editan al
   final chocan entre más tiempo vive una rama. Regla (**D-73, carril único**, Miguel
   aprobó a las 5:14 pm): una sola rama de trabajo viva a la vez, de un día como máximo,
   integrada a `main` en cuanto pasa la puerta de calidad; lo que estaba en otra rama se
   trae a la del día con `git cherry-pick`, no a una rama nueva; el turno nocturno sigue
   con su rama por noche (D-44) y se integra a la mañana siguiente. Detección temprana:
   antes de crear una rama, `git branch --no-merged origin/main` debe salir vacío (salvo la
   del turno); si no, se termina o se integra la que está abierta.
   - 2026-11-25 (1.ª vez): este caso. Arreglo: los 13 commits con contenido de
     `b3/d66-campo` entraron al PR 8 (2 de relevo quedaron vacíos y se saltaron);
     D-66 a D-69 quedaron idénticas, entre D-65 y D-70.
   Ocurrencias: 1 · Estado: ACTIVA. Relacionada con la 12 (PR 1 juntó 70 commits) y la 18
   (dos chats en la misma carpeta). **Aplica a todos los proyectos (Miguel, 5:14 pm):** se
   avisa a Second Brain para su cosecha y su propuesta a `standards.md` (no se sube sin el
   sí de Miguel). **PROPUESTA DE CONTROL** (con el sí de Miguel): en `npm run verificar`,
   un aviso si hay más de una rama de trabajo sin integrar o una con más de 24 h. Prueba:
   con dos ramas sin integrar, el aviso aparece.

## Disparador de chat nuevo (acordado con Miguel, 17 nov 2026)
Lo que ocurra primero:
1. Se cierra un bloque o se integra un entregable a `main`.
2. Cambio de tema o de proyecto.
3. **Aviso al 30 % de contexto:** terminar el paso en curso, no empezar otro
   grande y avisarle a Miguel.
4. **Paro al 40 % de contexto:** no empezar nada; actualizar «Estado actual»
   y «Relevo» en `docs/PLAN.md` y entregar el arranque del chat siguiente
   (carpeta, modelo, esfuerzo y prompt listo para pegar).

El porcentaje se mide con la herramienta de uso de la sesión al cerrar cada
paso, no a ojo, y se le reporta a Miguel. Los umbrales 30/40 son criterio de
trabajo (ESTIMADO); se revisan con datos a las dos semanas.
