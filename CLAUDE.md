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

## Turno nocturno (trabajo autónomo, D-10, D-12, D-13, D-20)
- **El turno arranca donde se quedó Miguel (D-20).** Miguel trabaja hasta las
  11:30 pm. Antes de esa hora la sesión del día hace el **relevo de turno**:
  commit, rama subida a GitHub con su PR en borrador, y `docs/PLAN.md` y
  `docs/COLA-NOCTURNA.md` al día con las tareas APROBADA. Lo que no está
  subido a GitHub, el turno no lo ve.
- 11:30 pm: el turno sale de la rama abierta más reciente (la del día o la
  de la noche anterior; si no hay, de `main`) y toma en orden las tareas
  **APROBADA** del bloque activo de `docs/COLA-NOCTURNA.md`, un commit por
  tarea; no empieza tareas después de las 4:30 am y cierra antes de las
  5:00 am.
- Una rama y un PR en **borrador** por noche (`noche/AAAA-MM-DD`, con la
  fecha de la mañana en que termina), nunca en `main`. Las reglas completas
  están en la cola.
- 5:15 am: el inspector revisa el PR y deja LIBERADO o RETENIDO con el
  reporte para Miguel.
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
8. **Una página descargada traía una llave de sesión (19 nov 2026).** En R-01
   la página pública de rutas se guardó primero en `datos/cache/qrobus/`, dentro
   del repositorio, y traía una llave de sesión (`csrf-token`). Se detectó a
   mano antes del commit. Causa: se trató la descarga como dato limpio sin
   revisarla. Regla: toda página descargada se revisa en busca de llaves antes
   de guardarla en el repositorio; la copia completa va a `referencias/` (fuera
   de git) y al repositorio entra solo lo extraído, con su huella sha256. Prueba
   que lo evita: `scripts/reglas.mjs` rechaza cualquier archivo de `datos/` o de
   la app que traiga una llave de sesión.

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
