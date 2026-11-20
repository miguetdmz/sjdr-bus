# Bitácora de decisiones

Registro de cada decisión que completa o se aparta de `docs/HANDOFF.md`. Una
decisión registrada aquí **manda sobre el HANDOFF**. Cada línea del HANDOFF
que se corrigió lleva la marca `[CORREGIDO → D-xx]`.

Formato: número · fecha · qué se decidió · por qué · quién lo decidió · dónde
impacta. Estado: **VIGENTE**, **PROPUESTA** (Claude la propone; rige
provisionalmente solo donde se indica) o **PENDIENTE** (falta la decisión de
Miguel).

---

## D-01 · 16 nov 2026 · El trabajo de la práctica es referencia, no base · VIGENTE
- **Decisión:** el handoff de la práctica es el contrato de origen (`docs/HANDOFF.md`)
  y su mockup es referencia visual y de datos. No se reutiliza su código como
  base. Todo dato que venga de la práctica se cruza contra `docs/REVISION-HANDOFF.md`.
- **Por qué:** la inspección encontró 21 hallazgos, 6 críticos.
- **Decidió:** Miguel (tomar el trabajo de la práctica "como si fuera un intern"), al aprobar el
  plan de B0.
- **Impacta:** todo el proyecto.

## D-02 · 16 nov 2026 · Nombre de trabajo «SJDRbus»; sin la marca Qrobús · CERRADA por D-28 (nombre visible «SJDR Bus»)
- **Decisión:** el proyecto se llama provisionalmente SJDRbus (repositorio
  `sjdrbus-sjr`). La app no usa «Qrobús» en su nombre ni en su interfaz.
- **Por qué:** Qrobús es marca del Gobierno del Estado; la regla 5 del HANDOFF
  prohíbe dar a entender que existe un "Qrobús SJR".
- **Decidió:** Claude propone; Miguel elige el nombre visible.
- **Impacta:** README, interfaz (B2), repositorio de GitHub.

## D-03 · 16 nov 2026 · Un solo repositorio con datos y app · VIGENTE
- **Decisión:** un repositorio con `datos/gtfs-sjr/` (el feed) y `web/` (la
  app). El feed se separa a su propio repositorio cuando se publique para
  terceros (Google Maps).
- **Por qué:** con un solo responsable, dos repositorios duplican la
  administración sin beneficio todavía. Las licencias se separan por carpeta.
- **Decidió:** Miguel, al aprobar el plan de B0.
- **Impacta:** estructura del repositorio.

## D-04 · 16 nov 2026 · App web estática: Vite + TypeScript + Leaflet · VIGENTE (stack, D-21; hosting Vercel, D-26)
- **Decisión:** PWA estática, sin framework pesado ni backend hasta la Fase 4.
  Hosting gratuito (Vercel, como Avisos SJDR, o Cloudflare Pages); se decide en
  B2.
- **Por qué:** la app solo lee archivos del feed ya construidos; no necesita
  servidor. Leaflet directo, sin envoltorios.
- **Decidió:** Claude propone; Miguel confirmó el stack el 17 nov 2026
  (D-21). El hosting sigue sin decidir: nada se despliega todavía.
- **Impacta:** `web/`.

## D-05 · 16 nov 2026 · Licencias: MIT para código, ODbL para datos · VIGENTE
- **Decisión propuesta:** código bajo MIT (`LICENSE`); datos del GTFS-SJR
  bajo ODbL 1.0 (`datos/LICENSE`).
- **Por qué:** los trazos se calculan sobre OpenStreetMap, y la ODbL obliga a
  compartir con la misma licencia lo que se derive de ella.
- **Decidió:** Miguel, 17 nov 2026 (aprobó el paquete recomendado de
  decisiones para destrabar B1).
- **Impacta:** `LICENSE`, `datos/LICENSE`, README.

## D-06 · 16 nov 2026 · Rutas piloto: 001, 002, 005, 012 y 040 · VIGENTE
- **Decisión:** las que se propusieron en la práctica: 001, 002, 005, 012 y 040.
- **Decidió:** Miguel, 17 nov 2026 (paquete recomendado).
- **Impacta:** B3 (trazos nivel B).

## D-07 · 16 nov 2026 · Moovit solo como guía de campo · VIGENTE · AJUSTADA por D-22
- **Decisión:** las listas de paradas de Moovit **no** se copian al
  repositorio. Sirven para planear el trabajo de campo y para revisar. Al
  repositorio solo entran las cifras resumen por sentido de HANDOFF §5.1
  (conteo de paradas, duración y horario), con la etiqueta «referencia
  Moovit» y su fecha. El inventario de 42 rutas sale del listado oficial
  (qrobus.gob.mx/Rutas). Paradas y trazos salen de OSM, de recorridos de
  campo o de la AMEQ.
- **Medida provisional (vigente):** `referencias/` está en `.gitignore`.
- **Por qué:** los términos de uso de Moovit restringen extraer sus datos; el
  mockup trae listas completas de 39 rutas. No es opinión legal: se puede
  sumar a la revisión del abogado de Avisos SJDR.
- **Decidió:** Miguel, 17 nov 2026 (paquete recomendado).
- **Impacta:** B1 (qué entra a `stops.txt`), README.

## D-08 · 16 nov 2026 · Claves distintas para la 23 urbana y la 023 intermunicipal · VIGENTE
- **Decisión:** el número visible (`route_short_name`) se conserva tal como
  en el inventario; el identificador interno (`route_id`) lleva prefijo de tipo
  para que nunca choquen: `U-` para urbanas e `I-` para intermunicipales,
  seguido del número tal como aparece en el inventario (`U-001`, `U-009B`,
  `U-23`, `I-062`, `I-023`).
- **Por qué:** «23» y «023» son el mismo número; además JavaScript ordena las
  claves numéricas antes que las de texto, lo que desordenaría el selector.
- **Decidió:** Miguel, 17 nov 2026 (paquete recomendado).
- **Impacta:** `routes.txt`, selector.

## D-09 · 16 nov 2026 · Fechas en hora de México · VIGENTE
- **Decisión:** toda fecha del proyecto (fichas, changelog, reportes) se
  anota en hora de la Ciudad de México.
- **Por qué:** el mockup de la práctica anotó «17 nov» un 16 nov por usar hora UTC.
- **Decidió:** Claude, como regla de forma.

## D-10 · 16 nov 2026 · Turno nocturno con PR en borrador · VIGENTE
- **Decisión:** el trabajo autónomo corre como rutina programada en la nube.
  Toma una tarea **APROBADA** de `docs/COLA-NOCTURNA.md`, trabaja en una rama
  y deja un PR en borrador. Nunca integra, publica, despliega ni gasta.
- **Por qué:** Miguel quiere que el proyecto avance de noche sin perder el
  control de calidad: nada llega a `main` sin su revisión.
- **Decidió:** Miguel, al aprobar el plan de B0.
- **Configuración (16 nov 2026):** rutina en la nube «Turno nocturno SJDRbus»,
  todos los días a las 12:00 am hora de México (cron `0 6 * * *` en UTC; antes 1:00 am, adelantado por Miguel el 17 nov 2026),
  modelo Opus 5.5, sin conectores. Se administra en
  https://claude.ai/code/routines/trig_01TQ5dA2RtFfQaYGVmwgvYJY (pausar,
  editar o borrar). La Claude GitHub App está instalada solo en este
  repositorio (GitHub → Settings → Applications → Claude → Configure).

## D-11 · 16 nov 2026 · Puerta de calidad desde el primer día · VIGENTE
- **Decisión:** `npm run verificar` corre las reglas automáticas del proyecto
  (`scripts/reglas.mjs`) y gitleaks. Corre antes de cada push y en GitHub
  Actions. Crece con cada bloque (pruebas, validador GTFS).
- **Por qué:** convertir las lecciones de la práctica en pruebas (a prueba de
  errores).
- **Decidió:** Miguel, al aprobar el plan de B0.

## D-12 · 17 nov 2026 · Turno nocturno por lotes · VIGENTE
- **Decisión:** Miguel aprueba un bloque completo de tareas de una vez. Cada
  noche el turno avanza en orden por las tareas APROBADAS, con un commit por
  tarea; no empieza tareas después de las 3:30 am, cierra antes de las 4:00 am
  (o al terminar el bloque) y deja **un PR por
  noche**. Si el PR de la noche anterior sigue abierto, trabaja encima de él
  (máximo 3 noches encadenadas sin revisión; luego se pausa). Al terminar el
  bloque se detiene hasta que Miguel apruebe el siguiente.
- **Por qué:** que el proyecto avance sin consultar a Miguel por cada tarea,
  sin perder su aprobación por bloque.
- **Decidió:** Miguel, 17 nov 2026.
- **Impacta:** `docs/COLA-NOCTURNA.md`, rutina de las 12:00 am.

## D-13 · 17 nov 2026 · Inspección de salida a las 4:15 am · VIGENTE
- **Decisión:** una segunda rutina, independiente de la que construye, revisa
  cada mañana el PR de la noche: corre la puerta de calidad, compara el
  trabajo contra las reglas y deja un comentario LIBERADO o RETENIDO que
  empieza con el reporte de 5 líneas para Miguel. No cambia código ni
  integra nada.
- **Por qué:** el operador no se inspecciona a sí mismo; Miguel encuentra el
  reporte listo temprano (horario ajustado por Miguel el 17 nov 2026: el turno
  cierra a las 4:00 am y el inspector entra a las 4:15 am).
- **Decidió:** Miguel, 17 nov 2026.
- **Configuración (17 nov 2026):** rutina «Inspector matutino SJDRbus», todos
  los días a las 4:15 am hora de México (cron `15 10 * * *` en UTC), Opus 5.5,
  sin conectores y sin herramientas para editar archivos:
  https://claude.ai/code/routines/trig_01F8RbVpgf3NtuUeMe63nZa7

## D-14 · 17 nov 2026 · Orden: B1 por lotes, después el mockup navegable · VIGENTE
- **Decisión:** primero se terminan los datos de B1; después se construye el
  mockup navegable (B2a) ya con esos datos. La app será primero web
  instalable (PWA) y después se empaquetará para iOS y Android con
  Capacitor (MIT). Publicar en tiendas tiene costo y queda fuera del
  presupuesto $0 hasta que Miguel lo decida.
- **Por qué:** un mockup con datos de demostración no sería completo ni
  cercano a lo real (Miguel).
- **Decidió:** Miguel, 17 nov 2026.

## D-15 · 17 nov 2026 · «Calcula tu ruta» es parte integral de la app · VIGENTE (alcance) · PROPUESTA (lugar en el plan)
- **Decisión (Miguel):** la app debe incluir un calculador de viajes: la
  persona dice dónde está y a dónde va (p. ej. Loma Alta → Central de
  Autobuses) y la app le dice qué ruta o qué combinación de rutas tomar y
  dónde transbordar, también cuando no hay camión directo. No es un extra:
  es parte integral de la app. El HANDOFF no lo contemplaba.
- **Por qué:** es lo que hoy no existe para San Juan del Río (Miguel).
- **Propuesta de Claude (falta el sí de Miguel):**
  - Bloque propio **B6 · Calcula tu ruta** en `docs/PLAN.md`, después de B4.
  - Se calcula en el teléfono, sobre el GTFS-SJR ya guardado: sin servidor,
    sin servicios en vivo y sin costo (reglas 3 y 7).
  - Insumo que hoy falta: las paradas de cada ruta **en orden y por
    sentido**. Sin ese dato no se puede saber dónde se cruzan dos rutas. Por
    eso las paradas (pregunta 1 de la cola) pasan a ser el dato crítico.
  - Primera versión honesta: «qué rutas tomar y dónde transbordar», con
    tiempos en ruta **ESTIMADO**. Sin frecuencia verificada no se calcula la
    espera en el transbordo (HANDOFF §5.2).
  - El mockup navegable (B2a) reserva su lugar como segundo modo, sin quitar
    la primera pantalla de mapa + selector + sentido (regla 5).
- **Decidió:** Miguel, 17 nov 2026 (alcance). Lugar en el plan: pendiente.
- **Impacta:** `docs/PLAN.md` (B6), B2a (navegación), prioridad de las
  paradas en B1.

## D-16 · 17 nov 2026 · Paradas desde OpenStreetMap, en cuarentena · VIGENTE
- **Decisión:** se aprueba la tarea N-08: traer de OpenStreetMap (Overpass,
  una sola consulta acotada a San Juan del Río, guardada en caché en el
  repositorio) las paradas de autobús que ya existen y armar `stops.txt`.
  Cada parada lleva su identificador de OSM, fuente, fecha y la marca **POR
  VERIFICAR EN CAMPO**. No se asignan a rutas, no se ordenan y no se mueve
  ninguna coordenada.
- **Por qué:** las paradas son el dato crítico (D-15) y esperar al campo o a
  la AMEQ puede tardar semanas. Entran como materia prima en cuarentena: en
  el almacén, pero sin liberar.
- **Decidió:** Miguel, 17 nov 2026 (pregunta 1 de B1).
- **Impacta:** `docs/COLA-NOCTURNA.md` (N-08 pasa a APROBADA),
  `datos/gtfs-sjr/stops.txt`, B2a.

## D-17 · 17 nov 2026 · Vigencia del feed: 6 meses · VIGENTE
- **Decisión:** el feed v0.1 vale del 17 nov 2026 al 16 may 2027, igual en
  `feed_info.txt` y `calendar.txt`. Corrige el año completo que había puesto
  el turno nocturno (al 16 nov 2027). Cada versión nueva del feed renueva la
  vigencia.
- **Por qué:** Miguel prefiere una caducidad corta que obligue a revisar el
  dato antes.
- **Riesgo anotado:** si el feed no se renueva antes del 16 may 2027, las
  aplicaciones que lo lean lo tratarán como caducado.
- **Decidió:** Miguel, 17 nov 2026 (pregunta 2 de B1).
- **Impacta:** `datos/gtfs-sjr/feed_info.txt`, `datos/gtfs-sjr/calendar.txt`,
  `scripts/pruebas/fichas.test.mjs`.

## D-18 · 17 nov 2026 · Sentido 0 = ida, sentido 1 = vuelta · VIGENTE
- **Decisión:** en GTFS (`direction_id`), el sentido 0 es la **ida**: sale
  del origen escrito en el inventario (HANDOFF §4, «origen – destino»). El
  sentido 1 es la **vuelta**. Vale para las 42 rutas.
- **Por qué:** fijar el punto cero antes de medir, para que las fichas, el
  mockup y «Calcula tu ruta» usen la misma referencia.
- **Decidió:** Miguel, 17 nov 2026 (pregunta 3 de B1).
- **Impacta:** `trips.txt` cuando exista, B2a (control de sentido), B6.

## D-19 · 17 nov 2026 · Agencia propia, por verificar, para la 062 y la 023 · VIGENTE
- **Decisión:** las intermunicipales `I-062` e `I-023` salen de la agencia
  `SJR-CONC` y pasan a una segunda agencia, `SJR-INTER`, «Operador
  intermunicipal QroVan (por verificar)». Las 40 urbanas siguen en
  `SJR-CONC`.
- **Fuente:** HANDOFF §7: «Las intermunicipales 023 y 062 operan con 47
  unidades de QroVan (AMEQ, mar 2025)». No se ha confirmado con la AMEQ: por
  eso el nombre dice «por verificar» y se pregunta en la solicitud de
  transparencia (N-03).
- **Por qué:** el feed contradecía al propio HANDOFF (observación del
  inspector, 17 nov 2026). No toca la regla 4: no se afirma que la AMEQ opere
  las unidades de San Juan.
- **Decidió:** Miguel, 17 nov 2026 (pregunta 4 de B1).
- **Impacta:** `datos/gtfs-sjr/agency.txt`, `datos/gtfs-sjr/routes.txt`,
  `scripts/pruebas/routes.test.mjs`, `scripts/pruebas/fichas.test.mjs`.

## D-20 · 17 nov 2026 · El turno nocturno arranca a las 11:30 pm, donde se quedó Miguel · VIGENTE
- **Decisión (Miguel):** Miguel trabaja hasta las 11:30 pm. A esa hora deja
  la computadora y arranca el turno nocturno, que termina a las 5:00 am.
  Miguel revisa los resultados después de las 5:00 am. Las actividades del
  turno dependen de **dónde se quedó el trabajo del día**: el turno continúa
  desde ahí, no desde un estado viejo de `main`.
- **Cómo se cumple (Claude):**
  - Horario: arranque 11:30 pm; no empieza tareas después de las 4:30 am;
    PR listo antes de las 5:00 am; inspector a las 5:15 am (antes 12:00 am,
    3:30, 4:00 y 4:15). El corte de las 4:30 y el inspector a las 5:15 los
    propuso Claude para conservar los márgenes anteriores.
  - **Relevo de turno:** antes de las 11:30 pm la sesión del día sube su
    rama a GitHub con PR en borrador y deja la cola y el plan al día
    (`docs/COLA-NOCTURNA.md`, «Relevo de turno»).
  - El turno sale de la rama del PR abierto más reciente (`cierre/…` del día
    o `noche/…` anterior); si no hay, de `main`.
  - La rama nocturna lleva la fecha de la mañana en que termina, para que el
    inspector la encuentre con la fecha del día.
- **Por qué:** que no se pierda una noche por trabajo del día sin integrar
  (Miguel: «eso es súper importante»).
- **Límite que no cambia:** el turno solo toma tareas APROBADA; nunca
  integra, publica ni decide por Miguel (D-10, D-12).
- **Corrige:** los horarios de D-12 y D-13.
- **Impacta:** `CLAUDE.md`, `docs/COLA-NOCTURNA.md`, rutinas
  `trig_01TQ5dA2RtFfQaYGVmwgvYJY` (cron `30 5 * * *` en UTC) y
  `trig_01F8RbVpgf3NtuUeMe63nZa7` (cron `15 11 * * *` en UTC).

## D-21 · 17 nov 2026 · Lote B2a aprobado; empieza encadenado sobre B1 · VIGENTE
- **Decisión (Miguel):** se aprueba completo el lote B2a, mockup navegable
  con los datos de B1: tareas M-01 a M-08 de `docs/COLA-NOCTURNA.md`. El
  turno las toma después de N-03 y N-08, en la misma tabla y en orden.
- **Incluye:**
  - D-04 pasa a VIGENTE en el stack: Vite + TypeScript + Leaflet.
  - Ajuste a D-14: B2a ya no espera a que B1 esté **integrado** a `main`;
    puede empezar sobre la rama que ya trae los datos de B1 (D-20). El orden
    no cambia: primero los datos, después el mockup.
- **Criterio del lote:** a 390 px la primera pantalla muestra mapa real +
  selector + sentido, sin scroll; 42 rutas en el desplegable; ningún dato
  inventado, ningún tiempo calculado y ningún trazo continuo (nivel C).
- **Fuera del lote:** trazos por calles (B3), estimador y autobús animado
  (B4), desplegar o publicar. Costo: $0.
- **Por qué:** al turno le sobraba tiempo con solo N-03 y N-08; el cuello de
  botella era la aprobación (Miguel quiere seguir avanzando).
- **Riesgo anotado:** si N-03 o N-08 salen mal, el mockup queda construido
  encima; lo cubren el inspector y la firma de Miguel antes de integrar.
- **Decidió:** Miguel, 17 nov 2026.
- **Impacta:** `docs/COLA-NOCTURNA.md`, `web/`, `docs/PLAN.md`.

## D-22 · 18 nov 2026 · Sin recorridos de campo: datos por investigación de escritorio, contrastados con Moovit · VIGENTE
- **Decisión (Miguel):** no habrá recorridos de campo con GPS de teléfono ni
  voluntarios que compartan su ubicación: Miguel no tiene tiempo ni manera de
  organizarlos. Los recorridos, paradas y tiempos de las 42 rutas salen de
  investigación de escritorio y son **ESTIMADO**.
- **Proceso por ruta (Miguel, 18 nov 2026):**
  1. Reconstruir el recorrido con **fuentes abiertas u oficiales**
     (documentos de la AMEQ, el estudio técnico de diciembre de 2022 que
     citan, el periódico oficial del estado, noticias, el listado oficial de
     rutas, OpenStreetMap).
  2. Compararlo contra Moovit.
  3. Si no coincide, **ajustar** el tramo.
  4. La ficha lista las fuentes abiertas usadas y, **solo en los tramos
     ajustados**, la etiqueta «ajustado con referencia Moovit, consulta
     [fecha]». Nunca se atribuye a una fuente abierta lo que salió de Moovit
     (regla 1).
- **Lo que no se hace:** copiar las listas de paradas de Moovit tal cual, ni
  mover sus coordenadas para disimular el origen (propuesta descartada el 18
  nov 2026: el dato seguiría siendo de Moovit y quedaría mal a propósito).
  Las paradas se ubican en la esquina real de OpenStreetMap.
- **Riesgo aceptado por Miguel:** los tramos ajustados son dato derivado de
  Moovit y quedan a la vista en el repositorio público (D-07). Se reemplazan
  cuando aparezca una fuente abierta. No es opinión legal.
- **Sustituye al campo:** la corrección ciudadana (B5) pasa a ser un botón
  de reporte («esta ruta no pasa por aquí»), sin compartir GPS.
- **Plataformas:** primero app web instalable; después Play Store y, en el
  futuro, App Store, empaquetando la misma app con Capacitor (D-14). Las dos
  tiendas cobran (Play Store pago único; App Store cuota anual; montos
  [sin verificar]): se avisa con monto antes de esa fase.
- **Decidió:** Miguel, 18 nov 2026.
- **Impacta:** D-07, D-16 (las paradas de OSM siguen «por verificar»; ya no
  se verifican en campo, sino contra fuentes y reportes), HANDOFF §8 y
  §11.7 (el nivel A por GPX de campo queda fuera de alcance por ahora),
  `docs/PLAN.md` (B3, B5 y fase de investigación).

## D-23 · 19 nov 2026 · Lote de investigación aprobado; la solicitud de transparencia espera · VIGENTE
- **Decisión (Miguel):** se aprueba el lote de investigación I-01 a I-04 y la
  revisión de tres fuentes oficiales: el GTFS de Qrobús v25 y dos números de
  «La Sombra de Arteaga» (5 sep 2022 y 24 oct 2025). La solicitud de
  transparencia a la AMEQ (estudio técnico de dic 2022) **sí se hará, pero
  todavía no**: queda como tarea abierta de Miguel.
- **Cómo se cumple (Claude):** los archivos descargados se guardan solo en la
  computadora de Miguel (`referencias/fuentes-2026-11-19/`, fuera de git) con
  su huella sha256 en `datos/investigacion/fuentes.json`. Al repositorio solo
  entran las cifras transcritas con fuente y página. El GTFS de Qrobús no
  declara licencia: no se copia, solo se comparan nombres.
- **Hallazgos:** el Programa Estatal de Transporte 2021-2027 trae km, minutos
  y vehículos por sentido de 41 rutas urbanas (ESTIMADO de 2022, oficial); el
  GTFS de Qrobús trae las 40 urbanas solo con nombre; ninguna fuente abierta
  trae el itinerario por calles. 7 rutas tienen conflicto con el inventario y
  no se suponen iguales.
- **Decidió:** Miguel, 19 nov 2026.
- **Impacta:** `docs/COLA-NOCTURNA.md` (I-01 a I-04), `datos/investigacion/`,
  `docs/investigacion/pareto-cobertura.md`, B3.

## D-24 · 19 nov 2026 · Lote R aprobado: recorridos estimados de las 42 rutas a la vez · VIGENTE
- **Decisión (Miguel):** se aprueba completo el lote R (R-01 a R-06): las 42
  rutas y sus dos sentidos se trabajan de una vez, como ESTIMADO nivel C, y
  se corrigen conforme llegue información real. Tolerancia de 20 % entre el
  largo estimado y los km oficiales (PET 2022 o La Sombra 2025).
- **Abierta:** si se usa el trazo oficial interno de qrobus.gob.mx/Rutas
  (`/Rutas/rutaMostrar`). Mientras no se decida, R-01 usa solo las listas de
  calles visibles en la página.
- **Decidió:** Miguel, 19 nov 2026.
- **Impacta:** `docs/COLA-NOCTURNA.md` (lote R), `datos/`, `web/`, B3.
- **Cerrada por D-25** (19 nov 2026): solo las calles visibles.

## D-25 · 19 nov 2026 · Lote R: solo las calles visibles de la página oficial de rutas · VIGENTE
- **Decisión (Miguel, 19 nov 2026, ~1:30 am):** no se usa el trazo oficial
  interno de qrobus.gob.mx/Rutas (`/Rutas/rutaMostrar`, `/Rutas/paradasTimeline`).
  El lote R parte solo de las listas de calles que la página muestra.
- **Por qué:** esa consulta es para uso de la propia página, no un servicio
  publicado, y no declara licencia; si se reclama o cambia, habría que retirar
  los trazos del repositorio público. La lista visible es texto público con
  fuente y fecha; el recorrido sale menos exacto y lo completa OSRM (R-04).
- **Cómo se cumple (Claude, R-01):** una sola descarga de la página (19 nov
  2026, 1:36 am). La página trae una llave de sesión (`csrf-token`), así que la
  copia completa se queda en `referencias/` (fuera de git, como en D-23) y al
  repositorio entran solo los 42 renglones de San Juan copiados tal cual, con
  su huella sha256 (`datos/cache/qrobus/`).
- **Decidió:** Miguel, 19 nov 2026.
- **Impacta:** `docs/COLA-NOCTURNA.md` (R-01, R-03, pregunta 1),
  `datos/investigacion/calles-oficiales.json`, `datos/investigacion/fuentes.json`.

## D-26 · 19 nov 2026 · Hosting: Vercel, con una vista previa ya · VIGENTE
- **Decisión (Miguel, 19 nov 2026, ~2:30 am):** el hosting es Vercel (cierra
  la parte PROPUESTA de D-04) y la vista previa va **antes** de R-03, para
  que Miguel use la app en su teléfono desde ahora. Cada sesión de día deja
  algo visible en el teléfono, no solo datos.
- **Por qué:** en 3 días había 1,429 líneas de documentos y 418 de app, y
  nada que Miguel pudiera tocar. La dirección (web → Play Store → App Store
  con Capacitor, D-14 y D-22) no cambia.
- **Cómo:** el despliegue lo hace Claude desde la Mac de Miguel con la
  línea de comandos de Vercel: `vercel build` compila aquí y
  `vercel deploy --prebuilt` sube **solo** la compilación (`web/dist`: página,
  estilos, código y `rutas.json`). `.vercelignore` es la segunda barrera para
  que `referencias/` y los secretos nunca salgan.
- **Lo que pasó al desplegar (19 nov 2026, 6:45 am, Vercel CLI 66.2.0):**
  - Proyecto `sjdrbus-sjr` creado en la cuenta Hobby de Miguel. Primer
    despliegue en **https://sjdrbus-sjr.vercel.app**, que responde **público**
    (HTTP 200, sin inicio de sesión). Solo está la compilación: `/docs/` y
    `/referencias/` dan 404.
  - Al vincular, la línea de comandos **conectó sola el repositorio de
    GitHub** (no estaba en el plan). Con eso, cada push a una rama crea una
    vista previa en Vercel y cada integración a `main` publica en producción.
    Queda para que Miguel decida si se mantiene.
  - Vercel creó en la raíz una llave temporal de su plataforma (archivo de
    entorno local, ya ignorado por git) y agregó dos líneas a `.gitignore`.
- **Costo:** $0. Plan Hobby de Vercel: «Hobby is free»; al llegar a un límite
  se pausa la función, no se cobra, porque Hobby no puede comprar uso extra
  (vercel.com/pricing y vercel.com/docs/plans/hobby, consultadas el 19 nov
  2026). Si Hobby se limita a uso no comercial: [sin verificar]; la app es
  gratuita y ciudadana.
- **Decidió:** Miguel, 19 nov 2026.
- **Impacta:** D-04, `vercel.json`, `.vercelignore`, `.gitignore`, `docs/PLAN.md`.

## D-27 · 19 nov 2026 · La app en Vercel se queda pública · VIGENTE
- **Decisión (Miguel, 19 nov 2026, ~6:50 am):** https://sjdrbus-sjr.vercel.app
  se queda abierta, sin inicio de sesión, aunque el nombre visible (D-02)
  siga pendiente y el repositorio siga privado.
- **Por qué:** así Miguel la prueba en su teléfono sin pasos extra. La app ya
  dice «nombre provisional» e «Iniciativa ciudadana independiente», y cada
  cifra lleva su fuente y la aclaración «no es fuente oficial».
- **Riesgo aceptado:** quien tenga el link ve el avance tal como está; las
  cifras de referencia de Moovit quedan a la vista, como ya se aceptó en D-22.
  Se puede cerrar en cualquier momento desde Vercel (Settings → Deployment
  Protection).
- **Decidió:** Miguel, 19 nov 2026.
- **Impacta:** D-26, D-07.

## D-28 · 19 nov 2026 · Nombre visible: «SJDR Bus» · VIGENTE
- **Decisión (Miguel, 19 nov 2026, ~7:10 am):** el nombre visible de la app
  es **SJDR Bus** (San Juan del Río Bus). Cierra la parte pendiente de D-02.
  Sigue sin usar la marca Qrobús.
- **Pendiente:** cambiar «SJDRbus (nombre provisional)» en la app, el
  manifiesto de M-07 y el README; nombre del repositorio público según la
  decisión sobre el correo en los commits (D-29).
- **Decidió:** Miguel, 19 nov 2026.
- **Impacta:** D-02, `web/`, M-07, README.

## D-29 · 19 nov 2026 · Repositorio público nuevo y limpio: `miguetdmz/sjdr-bus` · VIGENTE
- **Decisión (Miguel, 19 nov 2026, ~7:20 am):** el proyecto pasa a un
  repositorio **público nuevo**, `miguetdmz/sjdr-bus`, que arranca con una
  foto limpia del trabajo al 19 nov 2026. El repositorio actual
  (`miguetdmz/sjdrbus-sjr`) se queda **privado** como archivo, con todo su
  historial y los PR #1 a #9.
- **Por qué:** los 60 commits del repositorio actual llevan el correo personal
  de Miguel, y las copias de los PR en GitHub no se pueden reescribir. Abrirlo
  rompería la regla 7 de los estándares. Ninguno de los repositorios de Miguel
  es público (revisado el 19 nov 2026), así que no hay precedente.
- **Cómo:**
  - Los commits nuevos usan el correo anónimo de GitHub
    (`<id>+miguetdmz@users.noreply.github.com`), configurado solo en este
    repositorio.
  - Con el repositorio público, GitHub permite el candado de `main` (sin
    costo): no se integra un PR si la puerta de calidad no pasa (opción b del
    diseño de estaciones, 19 nov 2026).
  - Vercel y los dos turnos automáticos se mueven al repositorio nuevo.
  - `feed_info.txt` apunta al repositorio nuevo.
- **Riesgo aceptado:** el historial anterior no es público; quien quiera la
  trazabilidad completa la pide. `referencias/` nunca entró a git (revisado en
  todo el historial).
- **Decidió:** Miguel, 19 nov 2026.
- **Impacta:** D-02, D-26, D-28, `datos/gtfs-sjr/feed_info.txt`, rutinas del
  turno y del inspector, `docs/PLAN.md`.


## D-30 · 19 nov 2026 · Estilo visual aprobado: la muestra patrón · VIGENTE
- **Decisión (Miguel, 19 nov 2026, ~1:15 pm):** la app se construye con el
  estilo de la **muestra patrón** (`web/muestra-patron.html`, capturas en
  ancho de teléfono). Miguel: «Me encanta… se ve espectacular».
- **Qué fija:**
  - Mapa a pantalla completa con teselas de OpenStreetMap en tonos suaves
    (filtro gris en el navegador; mismas teselas, sin proveedor nuevo).
  - Barra superior flotante con «SJDR Bus» y la leyenda de iniciativa
    independiente.
  - Hoja inferior que se desliza: en el inicio, buscador de ruta y
    control de sentido (regla 5: sin scroll); con ruta elegida, tiempo
    estimado grande con sello ESTIMADO y línea de tiempo de paradas;
    deslizada hacia arriba, lista de paradas con su tiempo.
  - Recorrido punteado (regla 8) y camión ámbar que avanza sobre la línea,
    siempre ESTIMADO, nunca «en vivo» (regla 2).
  - Paleta propia, sin colores oficiales (regla 4): tinta `#12262d`,
    verde azulado `#0d7a72`, ámbar `#f0a032`, fondo `#f4f2ec`. Letra del
    sistema (regla 6: sin fuentes de Google).
  - Dos pestañas abajo: «Rutas» y «Calcula tu ruta» (D-15, M-06).
- **Lo que NO es dato:** la muestra es ESQUEMÁTICA. Ruta «00X», paradas con
  letra y tiempos son de ejemplo. La línea es un tramo de una relación de
  OpenStreetMap (consulta única del 19 nov 2026, guardada fuera del
  repositorio) usado solo para que el dibujo siga calles reales; no se usa
  como trazo de ninguna ruta.
- **Pendiente:** una tarea nueva para aplicar el estilo a la app (Miguel
  decide cuándo y si va al turno nocturno). El tiempo estimado y el camión
  necesitan B3 (trazos) y B4 (estimador): mientras falten, la app no muestra
  tiempos.
- **Decidió:** Miguel, 19 nov 2026.
- **Impacta:** `web/`, M-05 a M-08, R-06, B2, B4.

## D-31 · 19 nov 2026 · De día se avanza en sesión; el turno toma lo que quede · VIGENTE
- **Decisión (Miguel, 19 nov 2026, 1:36 pm):** mientras Miguel esté
  trabajando, las tareas aprobadas se hacen **en la sesión de día**, sin
  esperar al turno nocturno. A partir de las **10:30 pm** Claude le avisa que
  puede dejar de trabajar y hace el relevo antes de las 11:30 pm (D-20); el
  turno toma lo APROBADA que quede.
- **Primera aplicación:** E-01 (estilo de D-30) se hace en la sesión del
  19 nov 2026 por la tarde.
- **Decidió:** Miguel, 19 nov 2026.
- **Impacta:** D-20, `docs/COLA-NOCTURNA.md`, `docs/PLAN.md`.

## D-32 · 19 nov 2026 · R-03: una consulta a Overpass con nombres y trazos de calles · VIGENTE
- **Decisión (Miguel, 19 nov 2026, ~2:37 pm; pregunta a de R-03):** se
  aprueba **una sola consulta** a Overpass con los nombres y los trazos de las
  calles del municipio de San Juan del Río, para (1) separar los cruces de
  las listas oficiales de R-01, que vienen pegados solo con espacios, y (2)
  ubicar cada cruce en el mapa como punto de paso para R-04.
- **Cómo:** sesión de día, desde la computadora de Miguel, $0. La respuesta
  completa va a `referencias/` (fuera de git, lección 8); al repositorio entra
  solo lo extraído (nombre y trazo de cada calle) con la huella sha256 de la
  respuesta. La app nunca consulta Overpass (regla 7).
- **Regla de calidad:** un cruce que no coincida con un nombre de calle queda
  «sin separar» o POR VERIFICAR; nunca se adivina (lección 4). Las calles que
  falten en OpenStreetMap dejan la ruta incompleta, a la vista.
- **Decidió:** Miguel, 19 nov 2026.
- **Impacta:** R-03, R-04, `datos/cache/overpass/`.

## D-33 · 19 nov 2026 · R-03: las 21 listas mezcladas con Querétaro no se usan · VIGENTE
- **Decisión (Miguel, 19 nov 2026, ~2:48 pm; pregunta b de R-03):** las 21
  listas oficiales marcadas REVISAR en `datos/investigacion/calles-oficiales.json`
  (empiezan con calles de la ciudad de Querétaro, p. ej. Hércules, Blvd. de las
  Américas, TAQ) **no se usan** para la secuencia de R-03.
- **Por qué:** lo más probable es que la página oficial mezcle rutas de
  Querétaro con el mismo número. Muchas calles se llaman igual en las dos
  ciudades (Hidalgo, Benito Juárez, Manzano, Fresno): usar «los trozos que
  parezcan de San Juan» pondría puntos falsos que parecen verdaderos.
- **Cómo:** esas 21 rutas se trabajan con las otras fuentes (relaciones de
  OpenStreetMap, extremos de R-02; Moovit solo para contrastar, D-22) y su
  ficha dice «lista oficial descartada: mezcla calles de Querétaro». Ninguna
  se oculta del menú (regla 9); sin dato suficiente siguen «en verificación».
- **Decidió:** Miguel, 19 nov 2026.
- **Impacta:** R-03, R-05, R-06, fichas de las 21 rutas.

## D-34 · 19 nov 2026 · R-03: extremos sin coordenada, OSM propone y Miguel confirma · VIGENTE
- **Decisión (Miguel, 19 nov 2026, ~3:14 pm; pregunta c de R-03):** los 28
  extremos sin coordenada de `datos/investigacion/extremos.json` se ubican
  así: **una consulta más a Overpass** ($0, sesión de día, guardada igual que
  D-32) trae los lugares que OpenStreetMap ya tiene en el municipio (central
  de autobuses, escuelas, hospitales, penal, colonias y localidades); un
  programa propone el candidato de cada extremo, y **Miguel lo aprueba, lo
  mueve o lo rechaza** en una página con mapa. Se empieza por la Central de
  Autobuses (Blvd. Hidalgo #4, HANDOFF §11.3).
- **Regla de calidad (poka-yoke):** ninguna propuesta entra sin la
  confirmación de Miguel. Lo aprobado queda «ubicado por Miguel, POR
  VERIFICAR EN CAMPO» con su fuente; lo rechazado queda sin coordenada. El
  punto de una colonia es su centro en OSM, no el lugar donde da vuelta el
  camión: se dice así en la ficha.
- **Decidió:** Miguel, 19 nov 2026.
- **Impacta:** R-02, R-03, R-04, `datos/investigacion/extremos.json`.

## D-35 · 19 nov 2026 · Extremos: «Nuevo Parque Industrial» y La Rueda sin duplicado · VIGENTE
- **Decisión (Miguel, 19 nov 2026, ~5:25 pm; conocimiento local):**
  - El extremo de la ruta 004 no es «Col. Industrial Nuevo San Juan»: es
    **Nuevo Parque Industrial**.
  - «La Rueda» y «Fracc. La Rueda» son el mismo lugar: queda uno solo,
    **Fracc. La Rueda** (rutas 009B y 047).
- **Cómo:** `scripts/extremos.mjs` aplica las dos correcciones (tabla
  `CORRECCIONES`) y deja la marca D-35 en cada ruta corregida. El nombre de la
  ruta en `routes.txt` no cambia: es el del inventario y de la página oficial.
  Quedan 39 lugares, 27 sin coordenada.
- **Decidió:** Miguel, 19 nov 2026.
- **Impacta:** `datos/investigacion/extremos.json`, `extremos-propuestas.json`,
  página de confirmación, R-03.

## D-36 · 19 nov 2026 · Rutas 031 y 044 dadas de baja: ya no existen · VIGENTE
- **Decisión (Miguel, 19 nov 2026, ~7:30 pm; conocimiento local):** las rutas
  **031 «Pedregoso – PITSA»** y **044 «Valle Dorado II – Centro»** ya no
  operan. Se quitan del GTFS-SJR y de todo lo que se deriva de él: quedan
  **40 rutas (38 urbanas + 2 intermunicipales)**.
- **Fuente:** Miguel (campo). La página oficial qrobus.gob.mx todavía las
  listaba el 19 nov 2026 (R-01): la baja queda [sin verificar] con fuente
  oficial.
- **No contradice la regla 9:** la regla prohíbe ocultar una ruta por falta de
  datos; aquí se quita porque no existe.
- **Cómo:** lista de bajas en `scripts/lib/handoff.mjs`; una prueba falla si
  031 o 044 reaparecen. Con ellas salen PITSA y Valle Dorado II de los extremos.
- **Decidió:** Miguel, 19 nov 2026.
- **Impacta:** `routes.txt`, fichas, datos de la app, matriz I-02, extremos,
  regla 9 de CLAUDE.md (ahora dice 40).

## D-37 · 19 nov 2026 · «Visthá (CERESO)» es «Visthá» · VIGENTE
- **Decisión (Miguel, 19 nov 2026, ~7:30 pm):** el nombre correcto es
  **Visthá**; «Visthá (CERESO)» no es un lugar aparte. La ruta 036 queda con
  origen «Visthá», el mismo lugar que la 032.
- **Punto:** Miguel había movido el punto de «Visthá (CERESO)» a
  [20.44656, -99.97522] (página de extremos, 19 nov 2026). Se conserva en
  `extremos-decisiones.json` como su confirmación de Visthá, POR VERIFICAR EN
  CAMPO; queda a ~80 m del punto de Nominatim que ya tenía Visthá.
- **Nombre de la ruta (Miguel, 19 nov 2026, 7:40 pm):** la 036 también cambia
  de nombre: **«Visthá – 5 de Mayo»** (antes «Visthá (CERESO) – 5 de Mayo», el
  nombre del inventario y de la página oficial).
- **Cómo:** `NOMBRES_CORREGIDOS` en `scripts/lib/handoff.mjs` (único punto de
  lectura del inventario) y `routes.txt`; la tabla `CORRECCIONES` de
  `scripts/extremos.mjs` se queda como resguardo. Una prueba falla si vuelve
  «CERESO» a `routes.txt`.
- **Decidió:** Miguel, 19 nov 2026.

## D-38 · 19 nov 2026 · La página de extremos guarda en un archivo, con el mapa de siempre · VIGENTE
- **Problema:** las respuestas se guardaban en el navegador (localStorage):
  abiertas en otro navegador «faltaban todas». Se probó un artifact privado
  con guardado en Claude, pero ahí no cargan las teselas de OpenStreetMap y a
  Miguel el mapa de solo calles le dificultaba encontrar los lugares.
- **Decisión:** la página `web/confirmar-extremos.html` (mapa normal de
  OpenStreetMap) guarda cada respuesta en
  `datos/investigacion/extremos-decisiones.json` a través del servidor de
  desarrollo (`vite.config.mjs`, solo en desarrollo). Da igual el navegador; el
  archivo es la única fuente. El artifact queda retirado.
- **Decidió:** Miguel (pidió el mapa de antes), 19 nov 2026.
- **Ajuste (Miguel, 19 nov 2026, 8:05 pm):** Miguel prefiere seguir en el
  artifact dentro del chat, aunque su mapa sea solo de calles. Se reactiva con
  los 23 lugares vigentes (D-36 a D-39) y colonias visibles desde zoom 14. Sus
  respuestas viven en la base del artifact; Claude las copia a
  `extremos-decisiones.json` al cerrar. La página local queda de respaldo.

## D-39 · 19 nov 2026 · Ruta 024C dada de baja: ya no existe · VIGENTE
- **Decisión (Miguel, 19 nov 2026, ~7:41 pm; conocimiento local):** la ruta
  **024C «Las Torres – Central de Autobuses»** ya no opera. Se quita igual que
  D-36: quedan **39 rutas (37 urbanas + 2 intermunicipales)** y el extremo
  «Las Torres» sale de la lista por confirmar (23 lugares).
- **Fuente:** Miguel (campo); la página oficial la listaba el 19 nov 2026, así
  que la baja queda [sin verificar] con fuente oficial.
- **Cómo:** `RUTAS_DADAS_DE_BAJA` de `scripts/lib/handoff.mjs`; la prueba de
  bajas cubre 024C, 031 y 044.
- **Decidió:** Miguel, 19 nov 2026.
