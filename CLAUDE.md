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
   estado y fecha.
2. Todo tiempo calculado dice ESTIMADO (o MEDIDO EN CAMPO con fecha). EN VIVO
   solo con una posición GPS real detrás.
3. Presupuesto $0. Antes de cualquier paso con costo, avisar a Miguel con el
   monto y esperar su sí.
4. Iniciativa independiente: no usar la marca "Qrobús" como nombre de la app
   ni afirmar que la AMEQ/Qrobús opera las unidades de San Juan. Leyenda de
   iniciativa independiente visible. Sin escudo ni colores oficiales.
5. Móvil primero: la primera pantalla es mapa + selector de ruta + sentido,
   sin scroll y sin textos de reporte encima.
6. Mapa real o nada: Leaflet + OpenStreetMap con atribución visible. Cero
   Google (ni mapas, ni fuentes, ni geocodificación).
7. OSRM, Nominatim y Overpass solo al **construir el dato**, con caché en el
   repositorio. La app nunca los consulta en vivo.
8. Niveles de precisión A/B/C por tramo (HANDOFF §11.4). Un tramo C nunca se
   dibuja como línea continua.
9. Las rutas vigentes (39: D-36, D-39 y D-40) solo en un menú desplegable. Ninguna se oculta por falta de
   datos y ninguna se completa con datos supuestos.
10. Nunca usar el dato de un sentido para el otro: cada sentido lleva su
    propio conteo de paradas y su duración.

## Cómo trabajar
- Un bloque de `docs/PLAN.md` a la vez. No iniciar el siguiente sin la
  aprobación de Miguel.
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
   Ocurrencias: 2 · Estado: ACTIVA (a la 3.ª se promueve a control).
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
   Ocurrencias: 3 · Estado: **PROMOVIDA → hook `hora-real`** (20 nov 2026,
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
   Ocurrencias: 3 · Estado: ACTIVA · **PROPUESTA DE CONTROL** (20 nov 2026):
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
   ese número (39 rutas). Detección temprana: al escribir un número en una
   prueba, preguntarse «¿un arreglo bueno lo cambiaría?»; si sí, no va.
   - 2026-11-20 (1.ª vez, ~9:49 am): «exactamente 690» falló con Jurica.
   - 2026-11-20 (2.ª vez, ~11:49 am): «al menos 26» y «México 120 sin punto»
     fallaron con «MÉXICO 120» = Federal 120.
   Ocurrencias: 2 · Estado: ACTIVA (a la 3.ª se promueve a control).

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
