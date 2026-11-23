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

## D-20 · 17 nov 2026 · El turno nocturno arranca a las 11:30 pm, donde se quedó Miguel · VIGENTE (horario cambiado por D-44: arranca con la bandera ENTREGADO)
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

## D-36 · 19 nov 2026 · Rutas 031 y 044 dadas de baja: ya no existen · VIGENTE (la 044 se corrigió en D-40)
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

## D-40 · 19 nov 2026 · La 044 sí existe y la 042 también; la 018 ya no · VIGENTE
- **Decisión (Miguel, 19 nov 2026, ~8:35 pm; confirmó con conocimiento
  local):**
  - **044 «Valle Dorado II – Centro» sí existe:** vuelve al GTFS-SJR (corrige
    D-36 en esa ruta; la 031 sigue de baja).
  - **042 «Manantiales / Nogales – Centro» sí existe:** se queda.
  - **018 «Nuevo San Isidro – Centro» ya no existe:** se da de baja como D-36.
- **Efecto:** siguen **39 rutas (37 urbanas + 2 intermunicipales)**. Los
  extremos «Valle Dorado II» y «Manantiales / Nogales» vuelven a pendiente (sus
  rechazos se borraron de `extremos-decisiones.json` porque sus rutas existen y
  necesitan punto); «Nuevo San Isidro» sale de la lista.
- **Fuente:** Miguel (campo); [sin verificar] con fuente oficial.
- **Decidió:** Miguel, 19 nov 2026.

## D-41 · 19 nov 2026 · Lanzar con faltantes visibles; la gente ayuda a completar · VIGENTE
- **Decisión (Miguel, 19 nov 2026, ~8:45 pm):** la información que falta no
  detiene el avance. Hay una versión de lanzamiento y después se mejora: el
  proyecto es abierto y lo que falte se completa con la retroalimentación de
  quien use la app.
- **Cómo se aplica:**
  - Lo que nadie ubicó queda marcado **FALTANTE (D-41)** en los datos y se
    muestra así en la app. Nunca se rellena con un dato supuesto (reglas 1 y 9).
  - Hoy faltan 3 extremos: Manantiales / Nogales (042), Valle Dorado II (044) y
    Ezequiel Montes (023, fuera del municipio).
  - `datos/investigacion/extremos-finales.json` (script
    `scripts/extremos-finales.mjs`) junta lo automático de R-02 con los puntos
    de Miguel: 32 de 35 lugares con punto, 21 de ellos de Miguel, POR VERIFICAR
    EN CAMPO.
  - **Canal de reporte en la app (idea aprobada por Miguel, 19 nov 2026,
    9:10 pm):** que la gente pueda decir «esto está mal» o «esto falta». Va en
    B5 (Participa); su diseño y alcance se presentan a Miguel antes de
    construirlo.
- **Decidió:** Miguel, 19 nov 2026.

## D-42 · 19 nov 2026 · R-03: primero se arregla el dato con evidencia; POR VERIFICAR solo lo que no la tiene · VIGENTE
- **Decisión (Miguel, 19 nov 2026, ~9:40 pm; hallazgo a de R-03):** no quiere
  que la app quede «por verificar» en todo. Antes de marcar un cruce POR
  VERIFICAR se arregla el dato: unir nombres partidos («CARR. SAN JUAN DEL
  RÍO»), corregir abreviaturas y erratas, reconocer negocios. La meta es el
  mejor MVP posible para mostrarlo a posibles dueños de camiones y a la gente.
- **Cómo (`scripts/cruces.mjs` → `datos/investigacion/cruces.json`):**
  - Corte de cada cruce por programación dinámica: gana el corte que mejor
    coincide con calles de OSM y con nombres que la misma lista repite.
  - Toda corrección (abreviatura, errata, nombre de pila de sobra, calle que
    en OSM sigue en línea recta con otro nombre) se acepta **solo si las dos
    calles se tocan en OSM** (≤ 30 m) y dentro del corredor de la ruta (sus
    extremos + 3 km). Cada una queda anotada en «correcciones».
  - Ubicación elegida para toda la ruta a la vez (saltos ≤ 3 km): una calle
    homónima en otro pueblo ya no arrastra a los cruces siguientes.
  - Negocio que OSM no tiene: REFERENCIA (confirma la calle, sin punto propio).
- **Resultado (19 nov 2026, 19 listas usables, 954 cruces):** 600 ubicados
  (63 %), 156 referencias de calle (16 %) y 198 POR VERIFICAR (21 %). En la
  001: 34 de 50 ubicados (antes 22 de 49 con nombre en OSM). El 27 % de lo
  POR VERIFICAR se concentra en 4 nombres (Pareto): Paseo Central, Vicente
  Rivapalacio, Benito Juárez Oriente y Carr. San Juan del Río.
- **No cambia:** nada se rellena con dato supuesto (D-41, lección 4); el
  sentido no se asigna todavía (hallazgo c, regla 10). Todo punto es ESTIMADO
  a partir de OSM.
- **Prueba:** `scripts/pruebas/cruces.test.mjs`.
- **Decidió:** Miguel, 19 nov 2026.
- **Impacta:** R-03, R-04, `datos/investigacion/cruces.json`.

## D-43 · 19 nov 2026 · Alias locales de calles confirmados por Miguel · VIGENTE
- **Qué es:** nombres que la lista oficial usa y que la gente conoce, pero que
  en OpenStreetMap se llaman distinto. Miguel los confirma uno por uno, en orden
  de Pareto (los que más cruces dejan POR VERIFICAR primero).
- **Alias confirmados:**
  | Nombre en la lista oficial | Calle en OSM | Confirmó |
  |---|---|---|
  | Paseo Central | Avenida Central | Miguel, 19 nov 2026, 10:05 pm |
  | Independencia (junto al Jardín Independencia) | Avenida Juárez | Miguel, 19 nov 2026, 10:10 pm |
  | Carr. San Juan del Río (dentro de la ciudad) | Avenida Central | Miguel, 19 nov 2026, 10:12 pm |
  | Jurica | Avenida Belisario Domínguez | Miguel, 20 nov 2026, 12:47 am |
  | Av. Río Moctezuma (al llegar a la Av. Central) | sigue como Calle General Francisco Villa (continuación, no reemplazo) | Miguel, 20 nov 2026, 12:55 am |
  | Sagitario (sobre la Av. Hidalgo, en el centro) | es un **negocio**, no una calle (REFERENCIA, sin punto) | Miguel, 20 nov 2026, 1:00 am |
  | Sierra Paracaima y Sierra Tezonco (con la Av. Lomas de San Juan) | **laterales** de la avenida, no cruces: Paracaima del lado oriente, Tezonco del poniente (REFERENCIA, sin punto) | Miguel, 20 nov 2026, 1:41 am |
  | Uruguay (ruta 015B, entre Veracruz y Av. Francia) | Cerrada de Uruguay (OSM la dibuja corta: queda a 31 m de Veracruz y 44 m de Av. Francia; tolerancia de 50 m solo para ella) | Miguel, 20 nov 2026, 1:39 am |
  | Mexican Federal Hwy 120 (ruta 032) | San Juan del Río - Xilitla (Carretera Federal 120) | Miguel, 20 nov 2026, 2:25 am |
  | Carretera San Juan del Río-Tequisquiapan km 3.2 – Walmart (009B, 016 y 030) | una sola parada: el Walmart (negocio) sobre el Paseo Central = Avenida Central (REFERENCIA, sin punto) | Miguel, 20 nov 2026, 2:34 am |
  | Av. Universidad – Cto. Querétaro Norte (011B y 015B) | sí se tocan: OSM las deja a 32 m; tolerancia de 40 m solo para ese par | Miguel, 20 nov 2026, 2:39 am |
  | Car. Estatal 122 (ruta 032) | el mismo «Acceso a Visthá» (toca la Calle Francisco Villa de Visthá a 0 m) | Miguel, 20 nov 2026, 1:04 pm |
  | El Cerezo / Cerezo (ruta 032) | el CERESO de Visthá (D-37): camino «Acceso a Visthá», que toca Salinas y José Ballesteros López (0 m) y la carretera a Xilitla (8 m) | Miguel, 20 nov 2026, 11:01 am |
  | Carretera Querétaro 300 (ruta 002) | Carretera Panamericana a Querétaro, desde la glorieta donde termina la Av. Benito Juárez Poniente; el «300» es el número de la Secretaría de Finanzas | Miguel, 20 nov 2026, 9:47 am |
- **Cómo:** tabla `ALIAS_MIGUEL` de `scripts/cruces.mjs`. El alias también
  pasa por la prueba del mapa (las dos calles se tocan dentro del corredor de la
  ruta); si no, el cruce sigue POR VERIFICAR.
- **Efecto:** «Paseo Central»: 41 de 44 cruces ya confirman la calle (18 con
  punto). «Independencia – Vicente Rivapalacio»: 13 de 13 ubicados. Total:
  625 de 956 ubicados (65 %), 168 referencias de calle (18 %), 163 POR
  VERIFICAR (17 %).
- **Jurica (20 nov 2026):** la «Privada Jurica» de OSM está a 4–9 km de la
  ruta, así que no servía. La única calle de OSM que toca Av. Benito Juárez
  Oriente, Fernando de Tapia y Av. Central es la Av. Belisario Domínguez (0, 0
  y 8 m); Miguel confirmó que es esa. De paso, dos limpiezas con evidencia
  (D-42): «SIN REFERENCIA» es la casilla vacía de la lista y se quita del
  texto, y «MONUMENTO» cuenta como lugar (confirma la calle, sin punto
  propio). Efecto en Jurica: 27 de 36 ubicados, 7 referencias, 2 POR
  VERIFICAR. Total: 656 de 974 con punto (67 %), 186 referencias de calle
  (19 %), 132 POR VERIFICAR (14 %; antes 166).
- **Números con letra (20 nov 2026):** «AV. 1 PONIENTE» es «Avenida Uno
  Poniente» en OSM (toca la Av. Central a 0 m). El programa ya trata igual un
  número con cifra y con letra (uno a diez, dieciséis y veinte), siempre con
  la prueba del mapa. Efecto: 9 cruces nuevos con punto y 1 que se pierde
  (032 #53, Venustiano Carranza – Miguel Hidalgo: punto suelto a 5.5 km de sus
  vecinos, que ahora sí se ubican; el salto máximo es 3 km). Total: 664 de 974
  con punto (68 %), 183 referencias (19 %), 127 POR VERIFICAR (13 %).
- **Río Moctezuma (20 nov 2026):** en OSM termina 305 m antes de la Av.
  Central y el trazo sigue como Gral. Francisco Villa (la ruta 004 sigue por
  ella). Miguel confirmó la continuación. Tabla `CONTINUACION_MIGUEL`: se
  agrega como opción, no reemplaza el nombre, y pasa la prueba del mapa.
  Efecto: 6 cruces nuevos con punto, ninguno movido ni perdido. Total: 670 de
  974 con punto (69 %), 183 referencias (19 %), 121 POR VERIFICAR (12 %).
- **Sagitario (20 nov 2026):** la «Calle Sagitario» de OSM está a 3 km (colonia
  de los signos). Miguel confirmó que la de la lista es un negocio sobre la Av.
  Hidalgo (tabla `NEGOCIOS_MIGUEL`). Efecto: 5 cruces pasan a REFERENCIA.
  Total: 670 de 974 con punto (69 %), 188 referencias (19 %), 116 POR
  VERIFICAR (12 %).
- **Rumbo suelto (20 nov 2026, 1:28 am; arreglo con evidencia, D-42):** en
  «CALLE 5 PONIENTE C. CONSTITUYENTES» el programa cortaba después del «5» y
  pegaba «PONIENTE» al cruce siguiente, porque «Poniente Constituyentes» sin
  el rumbo parecía la Av. Constituyentes. Ahora un rumbo al principio es la
  cola del nombre anterior, salvo «PONIENTE 2» (Avenida Dos Poniente escrita
  al revés) o una calle de OSM con ese nombre exacto («Calle Norte 5»). Un
  rumbo solo nunca es calle suelta y un nombre no termina en «A»
  («MONUMENTO A | BENITO JUÁREZ»). Efecto: 7 cruces nuevos con punto (032 y
  047 con 4 Poniente, Epigmenio González y Santa Fe; 030 con Calle 4 Poniente,
  Santa Cruz Nieto y Av. 1 Poniente), ninguno movido ni perdido. Total: 677 de
  974 con punto (70 %), 190 referencias (20 %), 107 POR VERIFICAR (11 %).
  **Sigue POR VERIFICAR:** Constituyentes con Calle Tres, Calle 5 y Av. 9
  Poniente (6 cruces): OSM no tiene esas calles con nombre junto a la Av.
  Constituyentes (sí tiene Uno, Dos, 4 Poniente y 8 Oriente). No se
  interpolan (D-41).
- **Uruguay (20 nov 2026, 1:39 am):** la «Calle Uruguay» de OSM está a 10 km,
  en otra localidad. En el circuito de la 015B (Veracruz → Uruguay → Francia →
  Brasil) OSM solo tiene la «Cerrada de Uruguay», de unos 40 m, a 31 m de
  Veracruz y 44 m de Av. Francia. Miguel confirmó que es esa y que sí une las
  dos calles. Tabla `TOLERANCIA_MIGUEL`: para esa calle el umbral sube de 30 a
  50 m y la evidencia de cada cruce dice la distancia real. Efecto: 8 cruces
  nuevos con punto, ninguno movido ni perdido. Total: 685 de 974 con punto
  (70 %), 190 referencias (20 %), 99 POR VERIFICAR (10 %).
- **Laterales de Lomas de San Juan (20 nov 2026, 1:41 am):** en OSM, Sierra
  Paracaima y Sierra Tezonco corren paralelas a la avenida unos 700 m, a ~50 m
  (oriente y poniente); nunca la cruzan. Miguel confirmó que son sus laterales.
  Tabla `LATERALES_MIGUEL`: el cruce queda como REFERENCIA, sin punto. **Pista
  para el hallazgo c (regla 10):** la lista nombra Paracaima en el tramo de ida
  (hacia el norte) y Tezonco en el de vuelta (hacia el sur), cada una a la
  derecha del camión. Efecto: 6 cruces pasan de POR VERIFICAR a REFERENCIA;
  ningún punto nuevo, movido ni perdido. Total: 685 de 974 con punto (70 %),
  196 referencias (20 %), 93 POR VERIFICAR (10 %).
- **Misma calle dos veces seguidas (20 nov 2026, 1:43 am; arreglo con
  evidencia, D-42):** en «…-20 DE NOVIEMBRE 20 DE NOVIEMBRE-…» y «…-LA PALMA LA
  PALMA-…» la misma calle cierra un cruce y abre el siguiente. El programa
  veía ahí un nombre partido falso («20 DE NOVIEMBRE 20», parecido por errata
  a la «Privada 20 De Noviembre 37») y marcaba el corte como dudoso. Ahora ese
  corte a la mitad es seguro. Efecto: 8 cruces nuevos con punto (046: Maurilio
  Morelos y 5 de Mayo con 20 de Noviembre, en el mismo punto que la 008; 002:
  La Palma con Mandarina, Tamarindo e Higuera), ninguno movido ni perdido.
  Total: 693 de 974 con punto (71 %), 196 referencias (20 %), 85 POR
  VERIFICAR (9 %). **Sigue POR VERIFICAR:** en la 046, «C.MIGUEL
  HIDALGO-20 DE NOVIEMBRE PONIENTE 2-ÁLVARO OBREGÓN» (4 cruces): el corte puede
  ir antes o después de «PONIENTE»; la 008, con el mismo texto, sí los ubica.
  La Palma con Chabacano (002 #47): no se tocan en OSM.
- **Pedazo repetido idéntico (20 nov 2026, 2:03 am; arreglo con evidencia,
  D-42):** en la 046 el pedazo «20 DE NOVIEMBRE PONIENTE 2» sale dos veces igual
  (la misma parada en ida y en vuelta). El programa contaba cada vez sus
  principios y finales, así que «20 DE NOVIEMBRE PONIENTE» parecía un nombre
  que la lista repite y los 4 cortes posibles quedaban dudosos; en la 008 sale
  una vez y el corte sí cae («20 DE NOVIEMBRE | PONIENTE 2»). Ahora un pedazo
  idéntico a otro ya visto cuenta una sola vez. Efecto: 10 cruces nuevos con
  punto, ninguno movido ni perdido. En la 046, #34, #35, #52 y #53 quedan en
  los mismos dos puntos que la 008 (Av. Miguel Hidalgo × 20 de Noviembre y Av.
  Dos Poniente × Álvaro Obregón). De paso, en la 23 y en la 023, Sillar ×
  Plaza de la Piedra, Av. de la Cantera × De la Piedra y De la Cantera × Del
  Granito (3 en cada una). Total: 703 de 974 con punto (72 %), 196
  referencias (20 %), 75 POR VERIFICAR (8 %). **Hallazgos que quedan
  abiertos:** (1) Calle del Granito hace un circuito y toca dos veces la Calle
  de la Cantera, a 116 m una de otra; la 23 y la 023 eligen esquinas distintas
  para el mismo texto. Es el cuarto caso de «mismo texto, distinto punto»
  (lección 3); los otros tres ya existían: Hidalgo – C. Miguel Hidalgo en la
  039, Hacienda Los Arrayanes – Hacienda Piedras Negras en la 022 y la 039, y
  C. Miguel Hidalgo – Ing. Luis Romero Soto, que difiere en 10 m. (2) **La 23
  y la 023 traen el mismo texto en la página oficial** (renglones 428 y 441,
  atributo `data-buscar`, consulta del 19 nov 2026): dos bloques, en distinto
  orden, 1,581 caracteres en cada una y las mismas palabras. Un bloque son
  calles de Lomas del Pedregal con guiones (Del Abedul, De la Laja, De la
  Cantera); el otro, 551 caracteres de lugares sin guiones (Las Crucitas,
  Club de Golf, Termas del Rey, La Redonda). A qué ruta va cada bloque es
  decisión de Miguel; mientras, los puntos de Lomas del Pedregal que salen en
  la 023 son POR VERIFICAR.
- **Lista mezclada de la 23 y la 023 (Miguel, 20 nov 2026, 2:14 am: «Sí,
  sepáralas así»):** la 23 se queda con el bloque de calles de Lomas del
  Pedregal y la 023 con el de lugares. El bloque de lugares no trae guiones,
  así que no se parte en cruces: la 023 queda como «lista de lugares sin
  cruces», con el texto completo y POR VERIFICAR. Candado: si la página deja de
  traer los mismos dos bloques, `npm run cruces` se detiene con error. Efecto:
  la 23 conserva sus 22 puntos (su cruce #1 ya no trae pegado el bloque de
  lugares) y la 023 deja 35 cruces que no eran suyos, 21 de ellos con punto en
  Lomas del Pedregal. Ninguna otra ruta cambia. De paso se cierra el caso
  De la Cantera – Del Granito de «mismo texto, distinto punto» (quedan 3), y
  Jurica pasa de 27 a 25 cruces ubicados: los 2 de diferencia eran la copia de
  la 023. Total: 18 listas con cruces más la de lugares de la 023; 682 de 939
  con punto (73 %), 183 referencias (19 %), 74 POR VERIFICAR (8 %).
- **Federal 120 (Miguel, 20 nov 2026, 2:25 am):** la lista de la 032 escribe
  «MEXICAN FEDERAL HWY 120», el nombre en inglés de los mapas. En OSM es «San
  Juan del Río - Xilitla», que arranca en el norte de la ciudad, donde
  termina el Paseo Central. Sus cruces son negocios que OSM no tiene (Camsol,
  Distribuidora Moyel, Sertek, Centro Expositor): 4 cruces pasan de POR
  VERIFICAR a REFERENCIA, sin punto nuevo, movido ni perdido. **Sigue POR
  VERIFICAR:** «MÉXICO 120 – BENITO JUÁREZ» (032 #49): en OSM la carretera no
  toca ninguna Benito Juárez. Total: 682 de 939 con punto (73 %), 187
  referencias (20 %), 70 POR VERIFICAR (7 %).
- **Matamoros sigue como Fundadores (20 nov 2026, 2:31 am; arreglo con
  evidencia, D-42):** «MIGUEL HIDALGO NTE.-MARIANO MATAMOROS» (002, 030 y 047)
  quedaba sin cruce. En OSM la Calle Mariano Matamoros termina a 48 m de la Av.
  Hidalgo y ese último tramo se llama Calle Fundadores, que sí la toca (0 m).
  El programa solo probaba la continuación si no había ningún cruce directo en
  todo el mapa, y había uno en otro pueblo, a 6 km, fuera del corredor. Dos
  cambios: (1) la continuación se prueba cuando no hay cruce directo dentro
  del corredor de la ruta; (2) dos cruces seguidos que nombran la misma calle
  de la lista van por la misma calle de OSM o su continuación (cambiar cuesta
  lo mismo que 1 km de salto). Sin (2), la 047 saltaba a la «General Mariano
  Matamoros», otro tramo de OSM que sigue como 20 de Noviembre, aunque su
  cruce anterior (Matamoros × 15 de Mayo) ya está sobre la Calle Mariano
  Matamoros. El número de casa que OSM pega a un nombre («Calle Águila Blanca
  112») no cuenta como otra calle. Efecto: 3 cruces nuevos con punto, los tres
  en Av. Hidalgo × Fundadores; 3 movidos, revisados uno por uno: 001 #33 (3 m)
  y 032 #3 (8 m) usan el mismo tramo de OSM que su vecino, y 039 #24
  «HIDALGO-C. MIGUEL HIDALGO» pasa al punto que usan las otras 5 rutas con ese
  texto (antes caía en la unión de dos tramos de OSM casi homónimos, no en un
  cruce real). Ninguno perdido. «Mismo texto, distinto punto»: quedan 2
  casos (Romero Soto, que difiere en 10 m, y Hacienda Los Arrayanes –
  Hacienda Piedras Negras en la 022 y la 039, a 330 m). Total: 685 de 939 con
  punto (73 %), 187 referencias (20 %), 67 POR VERIFICAR (7 %).
- **Walmart del km 3.2 (Miguel, 20 nov 2026, 2:34 am):** en «…CARRETERA SAN
  JUAN DEL RÍO-TEQUISQUIAPAN KM 3.2-WALMART…» el primer guion es parte del
  nombre de la carretera, así que el programa partía una sola parada en dos
  cruces POR VERIFICAR. Miguel confirmó que ese Walmart está sobre el Paseo
  Central. Tabla `UNIDOS_MIGUEL`: el guion de ese nombre se cambia por una
  raya (–) antes de separar; la parada queda como REFERENCIA sobre la Avenida
  Central (Walmart no está en OSM, tabla `NEGOCIOS_MIGUEL`). Efecto: en la
  009B, la 016 y la 030, dos POR VERIFICAR se vuelven una REFERENCIA (3 cruces
  menos en total); ningún punto nuevo, movido ni perdido (comparado por texto,
  porque el orden se recorre un lugar). Total: 685 de 936 con punto (73 %),
  190 referencias (20 %), 61 POR VERIFICAR (7 %).
- **Universidad – Circuito Querétaro Norte (Miguel, 20 nov 2026, 2:39 am):**
  en OSM quedan a 32 m, apenas arriba del umbral de 30 m. Miguel confirmó que
  la Av. Universidad sí llega. La tabla `TOLERANCIA_MIGUEL` ahora acepta pares
  («A|B»): la tolerancia de 40 m vale solo para ese par, no para todos los
  cruces del Circuito. Efecto: 2 cruces nuevos con punto (011B #41 y 015B #58,
  en el mismo punto; la evidencia dice 32 m); ninguno movido ni perdido.
  Total: 687 de 936 con punto (73 %), 190 referencias (20 %), 59 POR
  VERIFICAR (6 %).
- **Salto que crece con los huecos (20 nov 2026, 7:47 am; arreglo con
  evidencia, D-42):** «C. CONSTITUYENTES-SANTA FE» salía UBICADO en la 032 y la
  047 y POR VERIFICAR en la 009B, con el mismo texto (lección 3). En la 009B el
  cruce ubicado anterior (Benito Juárez × Av. Central, #9) queda a 3.1 km, con
  5 cruces sin ubicar en medio, y el tope fijo de 3 km lo dejaba fuera. Ahora
  cada cruce sin ubicar en medio suma 300 m al salto permitido (la mediana entre
  cruces seguidos ubicados es 277 m; ESTIMADO). Dos cruces seguidos conservan el
  tope de 3 km, así que un punto suelto lejos de sus vecinos sigue fuera.
  Efecto: 1 cruce nuevo con punto (009B #15, en el mismo punto que la 032 y la
  047); 1 movido, revisado: 009B #36 «PASEO CENTRAL-CAMINO A SANTA CRUZ», 222 m.
  OSM tiene dos ramales de la Carretera a Santa Cruz Nieto que tocan la Av.
  Central (way 288677415 y way 288677416, ambos a 0 m); el punto pasa al que usa
  la 030 para la misma esquina. Cuál de los dos toma el camión no se sabe con el
  mapa: sigue ESTIMADO. Ninguno perdido. Total: 688 de 936 con punto (74 %),
  190 referencias (20 %), 58 POR VERIFICAR (6 %).
- **Tres lecturas de la lista (20 nov 2026, 7:50 am; arreglos con evidencia,
  D-42):** (1) la 008, la 011 y la 011B abren con la primera calle escrita dos
  veces («HIDALGO HIDALGO-…», «PASEO LOMA ALTA PASEO LOMA ALTA-LOMA DEL RIO»):
  ahora es una sola calle. Paseo Loma Alta toca la Calle Loma Del Río a 0 m;
  la 008 #1 cae en el mismo punto que las otras 6 rutas con «HIDALGO-C. MIGUEL
  HIDALGO». (2) «ARTICULO 3O» (022): la «O» pegada al número es el «º» de
  «3º»; OSM tiene la Calle Artículo Tercero, que toca la Prolongación Fernando
  de Tapia a 0 m, entre los cruces #24 y #26 de la misma ruta. «3O» solo sale
  una vez en todas las listas. (3) «PROL. BENITO JUÁRREZ» (015B): OSM trae el
  nombre completo, «Prolongación Benito Juárez García», y la lista tiene una
  errata; ahora se acepta un nombre contenido con una sola errata en una
  palabra de 6 letras o más (puntaje menor, «contenido con errata»). Toca la
  Calle Guadalupe Victoria a 0 m, entre Jalisco (#7) y Veracruz (#9). Efecto:
  5 cruces nuevos con punto; ninguno movido ni perdido (comparado por texto,
  porque 3 textos cambian). Total: 693 de 936 con punto (74 %), 190
  referencias (20 %), 53 POR VERIFICAR (6 %).
- **Decidió:** Miguel, 19 nov 2026.
- **Impacta:** R-03, `datos/investigacion/cruces.json`.

## D-44 · 20 nov 2026 · Relevo por bandera: día → turno → inspector · VIGENTE
- **Problema (20 nov 2026):** el turno arranca a hora fija (11:39 pm) y el
  inspector también (5:15 am). Anoche el turno acabó a las 11:58 pm y el PR
  esperó más de 5 horas sin inspección (muda de espera). Además, Miguel quiere
  trabajar sin hora fija de cierre (PLAN, Relevo, punto 5, 19 nov 2026).
- **Defecto encontrado de paso:** el inspector busca `noche/<fecha de hoy>`.
  Si revisa antes de medianoche, la fecha no coincide con la de la rama (que
  lleva la fecha de la mañana) y no encuentra nada.
- **Propuesta: dos banderas, como tarjetas kanban entre estaciones.**
  1. **Bandera 1 · día → turno.** Archivo `docs/RELEVO.md` en la rama de
     trabajo, con una sola línea de estado:
     - `EN SESIÓN` (Miguel trabaja) o
     - `ENTREGADO · AAAA-MM-DD HH:MM · para noche/AAAA-MM-DD`.
     La sesión del día, al cerrar, sube todo y **en el último commit** marca
     ENTREGADO (la bandera no puede subir sin el trabajo: poka-yoke). Luego
     dispara el turno al momento (RemoteTrigger `run`) si son las 6:00 pm o
     después.
  2. **Turno.** Se asoma cada hora como respaldo: 11:39 pm, 12:39, 1:39, 2:39
     y 3:39 am (cron UTC `39 5-9 * * *`). Arranca **solo** si la rama de
     partida dice ENTREGADO **para la rama de esta noche**. Bandera vieja, EN
     SESIÓN o sin archivo: sale en segundos con «Sin relevo». Si ya existe su
     rama `noche/…`, sale (ya trabajó). Al crear su rama la sube **de
     inmediato**, antes de la primera tarea: así la vuelta de la hora
     siguiente la ve ocupada y no arranca un segundo turno. Sin bandera a las 3:39 am, esa noche
     no hay turno (falla segura). Los límites siguen igual: ninguna tarea
     nueva después de las 4:30 am y PR listo antes de las 5:00 am.
  3. **Bandera 2 · turno → inspector.** Como último paso, con GitHub Actions
     en verde, el turno escribe en `docs/RELEVO.md`
     `TURNO TERMINADO · AAAA-MM-DD HH:MM · noche/AAAA-MM-DD` y lo sube.
  4. **Inspector.** Se asoma cada hora: 12:15, 1:15, 2:15, 3:15, 4:15 y
     5:15 am (cron UTC `15 6-11 * * *`). Busca el PR `noche/…` abierto más
     reciente **por la bandera, no por la fecha**. Inspecciona si dice TURNO
     TERMINADO y si aún no comentó ese commit; su comentario lleva «Commit
     inspeccionado: abc1234» para no repetir. A las 5:15 am inspecciona lo que
     haya aunque falte la bandera y lo reporta como «turno incompleto».
- **Criterio de aceptación (medible, antes de construir):**
  1. Sin bandera o con bandera vieja: el turno sale sin crear rama (se ve en
     su registro).
  2. Con ENTREGADO a las 6:00 pm o después: el turno arranca en menos de 5
     minutos (disparo directo).
  3. Entre TURNO TERMINADO y el comentario del inspector: 75 minutos como
     máximo (60 de la vuelta + 15 de inspección).
  4. Un solo comentario del inspector por commit.
  5. Prueba automática en `npm run verificar`: `docs/RELEVO.md` tiene un
     estado válido y bien escrito.
- **Costo:** $0. Hasta 11 arranques por noche; los vacíos salen en segundos y
  gastan muy poco del límite semanal del plan Pro (ESTIMADO, sin medir). Se
  mide la primera semana.
- **Cambia, si se aprueba:** las dos rutinas (turno e inspector), las reglas 2
  y 5 y el «Relevo de turno» de `docs/COLA-NOCTURNA.md`, la sección «Turno
  nocturno» de `CLAUDE.md` y D-20 (la hora fija pasa a ser respaldo).
- **Decidió:** Miguel, 20 nov 2026, 12:27 am («Sí, apruebo D-44»).
- **Ajuste al aplicarla:** la rama del turno se sube al crearla (ver punto 2).
- **Prueba:** `scripts/pruebas/relevo.test.mjs` (formato de `docs/RELEVO.md`).

## D-45 · 20 nov 2026 · Cruces APROXIMADOS: lo más cercano hoy, verificado con el uso · VIGENTE
- **Problema:** con la regla «no se interpola» (D-41), 53 de 936 cruces
  quedaban POR VERIFICAR, sin punto. Miguel quiere el menor número de POR
  VERIFICAR: hoy, la mejor aproximación; con el uso de la app, la verificación.
- **Decisión (Miguel, 20 nov 2026, 8:03 am: «Sí, apruebo D-45»):** estado
  nuevo **APROXIMADO**. Modifica D-41 solo en esto: un cruce sin evidencia
  exacta sí lleva punto si un método de la lista lo calcula con datos de OSM.
  1. El punto lleva etiqueta **ESTIMADO**, nivel de precisión **C** (HANDOFF
     §11.4: un tramo C nunca se dibuja como línea continua) y el **método** con
     que se calculó. Nunca se presenta como verificado.
  2. Métodos permitidos, en este orden:
     - **cercanía:** las dos calles existen en OSM y no se tocan, pero pasan a
       ≤ 300 m una de otra; el punto es el de la calle por donde va el camión
       más cercano a la otra.
     - **numeración:** la calle de cruce es numerada («Calle 5 Poniente») y la
       avenida ya tiene ubicados cruces con otras numeradas; el punto se
       interpola por número sobre la avenida (o se extiende un solo número más
       allá del último conocido).
     - **entre vecinos:** la calle existe en OSM; el punto es el de esa calle
       más cercano a la mitad entre los cruces ubicados de antes y de después,
       si queda a ≤ 300 m de esa mitad.
     Todo punto aproximado pasa también el salto máximo entre cruces
     ubicados (3 km + 300 m por cruce sin ubicar en medio).
  3. Se verifica con el uso: cuando alguien lo confirme o corrija (canal de
     reporte de D-41 o visita de campo), pasa a VERIFICADO.
  4. POR VERIFICAR queda solo para lo que ningún método alcanza.
  5. **Google Maps no se usa como fuente** ni para «ver y pasar a mano»: los
     datos salen con licencia ODbL y Google no permite copiar sus mapas.
- **Criterio de aceptación (medible):** (a) ningún cruce APROXIMADO sin
  `metodo`, `precision: "C"` y `etiqueta: "ESTIMADO"`; (b) ningún punto
  aproximado a más del salto máximo de sus vecinos ubicados; (c) ningún punto
  UBICADO cambia; (d) POR VERIFICAR baja de 53 y cada uno que quede dice por
  qué no se pudo aproximar.
- **Impacta:** R-03, `scripts/cruces.mjs`, `datos/investigacion/cruces.json`,
  B5 (canal de reporte).
- **Aplicada (20 nov 2026, 8:08 am):** paso `aproximarTodo` de
  `scripts/cruces.mjs`. Además de los tres métodos, dos candados que salieron
  de revisar cada punto: (1) **sin ir y regresar**: con vecinos cercanos en la
  lista (≤ 3 cruces sin ubicar en medio), pasar por el punto no alarga más de
  300 m el camino entre ellos; Corregidora × San José caía 300 m más allá de
  Matamoros y ahora queda entre Zaragoza y Matamoros. (2) **la misma calle que
  el vecino**: «LA PALMA» después de cuatro cruces sobre la Avenida La Palma no
  puede ser la «Avenida de las Palmas» (queda POR VERIFICAR). Y un cuarto
  método, **mismo texto** (lección 3): si otra ruta ya tiene punto para ese
  mismo texto y el salto cuadra, se usa ese punto. «Entre vecinos» solo con ≤ 3
  cruces sin ubicar en medio.
- **Efecto:** 26 cruces APROXIMADOS (12 por numeración: Constituyentes con la
  3, 5 y 9 Poniente; 7 por cercanía; 7 entre vecinos). Ningún UBICADO cambió
  (690). Total: 693 con punto exacto (74 %), 26 aproximados (3 %), 190
  referencias (20 %), **27 POR VERIFICAR (3 %; antes 53)**, cada uno con la
  razón en su nota. Los que quedan: calles que no están en OSM (Carretera
  Querétaro 300, «49 Norte. 4», La Tota Carbajal – Maquío), cortes dudosos
  (022, Jurica – San Juan del Río), vecinos demasiado lejos en la lista (032,
  tramo de la Federal 120) y calles de OSM lejos de sus vecinos (Paseo del
  Molino de la 016 y la 030, en otra colonia; 046 #38, que salta 4 km: pista
  para el hallazgo c).
- **Falta:** la app todavía no lee `cruces.json`; la etiqueta ESTIMADO y el
  trazo de nivel C en pantalla se cumplen al construir R-04/R-05.
- **Prueba:** `scripts/pruebas/cruces.test.mjs`, «APROXIMADO (Miguel, D-45)».
- **Carretera Querétaro 300 (Miguel, 20 nov 2026, 9:47 am; nota de D-43 y
  D-45):** en OSM la Av. Benito Juárez Poniente termina en una glorieta donde
  se juntan la Carretera Panamericana a Querétaro y la salida a Amealco (0 m),
  que sigue hasta la Av. La Palma. Miguel confirmó que la «Carretera Querétaro»
  de la 002 es la Panamericana. Efecto: 002 #33 (Secretaría de Finanzas) pasa
  de POR VERIFICAR a REFERENCIA. 002 #48 sigue POR VERIFICAR: la lista dice
  «…QUERÉTARO 300-ANTIGUO CAMINO A OJO DE AGUA A. AMEALCO-LÁZARO CÁRDENAS…» y
  OSM no tiene ningún camino a Ojo de Agua ni una Lázaro Cárdenas cerca de la
  carretera a Amealco (siguiente pregunta). Total: 26 POR VERIFICAR.
- **Calle compartida entre dos guiones (20 nov 2026, 9:49 am; arreglo con
  evidencia, D-42):** la 022 escribe «JURICA-SAN JUAN DEL RÍO-MERCADO JUÁREZ»,
  con «San Juan del Río» una sola vez para dos cruces; el programa la partía en
  «SAN JUAN | DEL RÍO» y dejaba los dos cruces dudosos. Otras 5 rutas escriben
  el mismo cruce como «CARR. SAN JUAN DEL RÍO-JURICA» (Av. Central × Av.
  Belisario Domínguez). Ahora, si el pedazo de en medio es entero un nombre que
  la lista repite y que OSM tiene tal cual, cierra un cruce y abre el
  siguiente. Efecto: 022 #12 «JURICA-SAN JUAN DEL RÍO» UBICADO (a 4 m del punto
  de las otras 5 rutas: el punto medio depende de qué calle va primero) y 022
  #13 «SAN JUAN DEL RÍO-MERCADO JUÁREZ» REFERENCIA sobre la Av. Central.
  Ninguna otra ruta cambia. Total: 24 POR VERIFICAR.
- **Amealco (Miguel, 20 nov 2026, 11:01 am):** Miguel no sabe dónde cruza la carretera
  a Amealco con Lázaro Cárdenas. 002 #34, #48 y #49 siguen POR VERIFICAR (uso
  de la app o campo).
- **El Cerezo = CERESO de Visthá (Miguel, 20 nov 2026, 11:01 am) y circuito
  anclado en su origen (arreglo con evidencia, D-42):** con el alias se ubican
  032 #5 (Salinas) y #52 (José Ballesteros López) sobre el Acceso a Visthá. Al
  revisar la 032 salió un **defecto en dos puntos UBICADOS**: #2 «MIGUEL
  HIDALGO-VENUSTIANO CARRANZA» y #3 «VENUSTIANO CARRANZA-FRANCISCO VILLA» caían
  a 5 km al poniente, en calles homónimas de otra zona, mientras la ruta sale de
  Visthá. La lista de la 032 empieza y termina con el mismo cruce al revés
  («FRANCISCO VILLA-CAR. ESTATAL 122» … «CAR. ESTATAL 122-FRANCISCO VILLA»): es
  un circuito desde el origen. Ahora una lista así ancla su principio en el
  extremo de origen (vale como un cruce ubicado antes del #1). Efecto: #5 nuevo;
  #2 y #3 pierden su punto equivocado y quedan POR VERIFICAR (la Venustiano
  Carranza de OSM cerca de Visthá no toca Miguel Hidalgo ni Francisco Villa:
  queda a 824 y 337 m). Ninguna otra ruta cambia. Total: 694 con punto exacto,
  26 aproximados, 192 referencias, 24 POR VERIFICAR (dos de ellos ya no son un
  punto falso).
- **«MÉXICO 120» = Federal 120 (20 nov 2026, 11:04 am; extensión con evidencia
  del alias de Miguel de las 2:25 am):** «CARR. MÉXICO 120» y «MÉXICO 120» son
  la misma Carretera Federal 120 (MEX-120) escrita en español. Dentro de la
  ciudad sigue en línea recta como Avenida Central (continuación, ya probada
  por el programa). Efecto: 032 #49 «MÉXICO 120-BENITO JUÁREZ» UBICADO en Av.
  Central × Av. Benito Juárez (el mismo punto que la 009B #9); 009B #38 «CARR.
  MÉXICO 120-AV. 8 ORIENTE» pasa de APROXIMADO a UBICADO (6 m), y la 032 #47 y
  la 047 #51 se mueven 14 m al mismo punto: las tres rutas usan ahora un solo
  punto para Ocho Oriente × Av. Central (lección 3). Total: 696 con punto
  exacto, 25 aproximados, 192 referencias, 23 POR VERIFICAR.
- **Car. Estatal 122 = Acceso a Visthá (Miguel, 20 nov 2026, 1:04 pm):** además,
  «CAR.» se lee como «Carretera» (ya se leían «CARR.» y «CARRET.»; en las listas
  aparece en «CAR. ESTATAL 122», «CAR. QUERÉTARO» y «CAR. A CERRO GORDO»; solo
  cambió la 032). Efecto: 032 #1 y #54, las dos puntas del circuito, UBICADAS en
  el mismo punto (Francisco Villa × Acceso a Visthá); con esa ancla, #3 y #4
  pasan a APROXIMADO entre vecinos, junto a Visthá. Total: 698 con punto exacto,
  27 aproximados, 191 referencias, 20 POR VERIFICAR.

## D-46 · 20 nov 2026 · Extremos como zona probable (mapa de calor), no como punto · PROPUESTA
- **Idea (Miguel, 20 nov 2026, 1:04 pm):** mientras no estén confirmados los
  puntos exactos de origen y fin de cada ruta, la app los muestra como una
  **zona** («la parada está posiblemente por aquí»), estilo mapa de calor, en
  vez de un punto que aparenta exactitud.
- **Por qué encaja:** reglas 1 y 2 (nada estimado se presenta como exacto) y
  D-41 (32 de 35 extremos son puntos de Miguel POR VERIFICAR EN CAMPO; 3
  FALTANTES). Lo mismo puede valer para los cruces APROXIMADOS de D-45.
- **Falta antes de construir (bloque de la app, R-04/B4):** criterio de
  aceptación medible — radio de la zona por nivel de confianza (por ejemplo,
  punto de Miguel sin campo vs. aproximado vs. faltante), cómo se ve en ancho de
  teléfono sin tapar el mapa, y que la zona diga ESTIMADO. Sin librerías de
  pago (Leaflet ya dibuja círculos).
- **Decide:** Miguel, al diseñar la pantalla del trazo.

## D-47 · 20 nov 2026 · Todo se nombra Bloque · Tarea · Versión · VIGENTE
- **Decisión (Miguel, 20 nov 2026, 1:44 pm):** la rama, el PR, el chat y el
  «Estado actual» de `docs/PLAN.md` dicen en qué parte del plan vamos, con tres
  niveles:
  - **Bloque:** la fase del plan (B0 a B6). Ejemplo: B3 Trazos.
  - **Tarea:** el entregable dentro del bloque. Ejemplo: R-03 cruces.
  - **Versión:** lo integrado en `main` y publicado en
    https://sjdrbus-sjr.vercel.app. Sube un número con cada integración a
    `main`: v0.1, v0.2…
- **Versiones al 20 nov 2026:** v0.1 = la foto inicial del 19 nov
  (`06efa8c`, único commit de `main`). v0.2 = lo que trae el PR 1 (39 rutas,
  mockup navegable, estilo D-30, nombre SJDR Bus); se vuelve la versión
  publicada cuando Miguel integre el PR 1.
- **Ramas:** las de día se llaman `bN/tarea-tema` (ejemplo: `b3/r03-cruces`),
  ya no `cierre/fecha`. Las del turno nocturno siguen `noche/AAAA-MM-DD`
  (D-44). La rama abierta `cierre/2026-11-19-publico` no se renombra: el PR 1
  y su vista previa dependen de ella; se cierra al integrar el PR 1 y el
  trabajo sigue en una rama nueva con el nombre de este esquema.
- **Reportes:** todo «integrado» dice a qué rama entró (el PR 2 entró a la
  rama de cierre, no a `main`, y el reporte no lo aclaraba).
- **Por qué:** Miguel no sabía en qué parte del proyecto íbamos; el PR 1 juntó
  70 commits sin integrarse a `main` (lección 12 de `CLAUDE.md`).
- **Para todos los proyectos:** Miguel la quiere como aprendizaje general; la
  cosecha del Second Brain la lleva a la bóveda y propone subirla a
  `standards.md` (no se sube sin el sí de Miguel).
- **Decidió:** Miguel, 20 nov 2026.
- **Impacta:** `CLAUDE.md` (lección 12), `docs/PLAN.md` («Estado actual»),
  `docs/COLA-NOCTURNA.md` (sin cambio: el turno ya usa `noche/AAAA-MM-DD`).

## D-48 · 20 nov 2026 · Pantalla con mapa completo: «¿A dónde vas?» arriba y menú lateral · EN REVISIÓN
- **Pedido (Miguel, 20 nov 2026, 2:09 pm), al ver la pantalla de D-30:** la
  hoja de abajo ocupa casi la mitad de la pantalla del teléfono (captura
  `docs/evidencia/e03/0-antes-390.jpg`) y el título roba espacio. La búsqueda
  va **arriba**, con una invitación del tipo «¿A dónde vas?»; el título sale
  cuando se abre el menú; el menú se esconde y se muestra con animación y el
  mapa siempre ocupa toda la pantalla. Referencia de estilo: capturas de otra
  app de Miguel (no se abrió su código: regla 4 de standards). Que sea
  intuitiva y fácil de volver a usar.
- **Diseño (Claude, con el encargo de Miguel de definirlo):**
  - Arriba, flotando sobre el mapa: el **mismo `<select>` nativo** de las 39
    rutas con aspecto de buscador y la invitación «¿A dónde vas? Elige tu
    ruta» (regla 9: menú desplegable, ninguna ruta oculta), el botón ☰ a su
    izquierda y el control Ida / Vuelta. Así la primera pantalla sigue siendo mapa + selector +
    sentido sin tocar nada (regla 5).
  - **Menú lateral izquierdo** en teléfono y computadora: entra y sale con
    animación; cerrado al cargar. En computadora abre debajo de la barra, para
    que el buscador y el sentido sigan a la mano. Dentro: nombre «SJDR Bus», detalle de la
    ruta, «Calcula tu ruta». Se cierra con su botón, con Esc o tocando el mapa.
  - Con ruta elegida aparece abajo un botón chico «Ver detalle» que abre el
    menú en el detalle.
  - La leyenda de iniciativa independiente y la atribución de OpenStreetMap
    quedan siempre visibles en una línea chica abajo (reglas 4 y 6).
- **Ajuste de Miguel (20 nov 2026, 2:33 pm), al ver las capturas:** «es un
  buen approach»; el menú y el ☰ van del lado **izquierdo** (la primera versión
  los ponía a la derecha). Lo demás se aprobó como estaba.
- **Ajuste 2 de Miguel (20 nov 2026; anotado a las 2:40 pm), con capturas de su referencia
  con el menú abierto:** en computadora el menú debe verse **integrado** y el
  mapa completo. Queda así:
  - Computadora: barra de la app a todo lo ancho con ☰ y «SJDR Bus». Con el
    menú cerrado, el buscador y el sentido flotan sobre el mapa. Al abrir, el
    menú queda pegado a la izquierda debajo de la barra, con sus pestañas
    arriba («Rutas», «Calcula tu ruta», cerrar), y **el mapa se recorre** a la
    derecha y se ve completo, sin velo.
  - En los dos tamaños, con el menú abierto, el buscador y el sentido pasan a
    la cabeza del menú: el menú se vuelve el buscador y planeador (se puede
    cambiar Ida / Vuelta viendo el detalle). En teléfono lo demás no cambió.
  - La tarjeta de ayuda de la referencia («Así funciona») no se agregó: queda
    como pregunta para Miguel.
- **Cambia:** la hoja inferior de D-30 y el panel izquierdo de E-02. La
  paleta, la letra y el resto de D-30 siguen.
- **Criterio de aceptación:** a 390 × 844 y a 1280 × 800, con el menú cerrado,
  ningún panel tapa el mapa (lo de arriba mide menos de la quinta parte del
  alto en teléfono); selector y sentido visibles sin tocar nada y sin scroll;
  el ☰ abre y cierra el menú con animación (respeta «reducir movimiento»); el
  detalle por sentido, «Calcula tu ruta» y las paradas siguen funcionando;
  leyenda y atribución visibles; botones de al menos 44 px; pruebas y
  `npm run verificar` en verde. Capturas en `docs/evidencia/e03/`.
- **Decide:** Miguel, al verla en su teléfono.
- **Impacta:** `web/index.html`, `web/src/main.ts`, `web/src/estilos.css`,
  `pruebas-navegador/b2a.spec.mjs`, `scripts/pruebas/app.test.mjs`,
  `scripts/pruebas/selector.test.mjs`, `docs/COLA-NOCTURNA.md` (E-03).

## D-49 · 20 nov 2026 · El sentido aparece al elegir la ruta; el detalle se abre solo; pin de parada · VIGENTE
- **Decisión (Miguel, 20 nov 2026, anotada a las 3:07 pm), al probar D-48:**
  «actualizar la regla siempre es de sabios»: estos detalles salen conforme se
  desarrolla y se prueba.
- **Cambia la regla 5 (HANDOFF §14 y §11.8):** la primera pantalla es mapa +
  selector de ruta, sin scroll. El control Ida / Vuelta **aparece en cuanto se
  elige la ruta**, ya no se muestra apagado antes, porque sin ruta el sentido
  no significa nada.
- **El detalle se abre solo:** al elegir una ruta, el menú se despliega con su
  detalle, el buscador y el sentido a la mano. El botón de abajo dice solo
  «Ver detalle» y sirve para volver a abrirlo.
- **Pin de parada:** las paradas de OpenStreetMap se dibujan con un pin propio
  con el pictograma del camión de frente (referencia de Miguel: la señal de
  parada de autobús en México). Color de la app (verde azulado de D-30), no el
  azul de la señal, para no parecer señalización oficial (regla 4). Siguen
  diciendo POR VERIFICAR EN CAMPO al tocarlas. Sustituye el punto gris de D-30.
- **Queda FALTANTE:** mostrar la trayectoria al elegir el sentido. Llega con
  B3 (R-03 a R-06); dibujarla antes sería inventarla (reglas 1 y 8).
- **Decidió:** Miguel, 20 nov 2026.
- **Impacta:** `CLAUDE.md` (regla 5), `web/`, `pruebas-navegador/b2a.spec.mjs`,
  `scripts/pruebas/selector.test.mjs`, `scripts/pruebas/app.test.mjs`.

## D-50 · 20 nov 2026 · Selector visual de rutas: tarjetas con camioncito y número · EN REVISIÓN
- **Idea (Miguel, 20 nov 2026, al probar D-49 en su teléfono):** en lugar de la
  lista, al abrir el menú se ven tarjetas chicas (como su referencia de tipos
  de reporte), cada una con un camioncito tipo logo vectorial con el número de
  la ruta («R1», «R2»…), el nombre («Pedregoso – Centro») y colores que se
  van alternando; que quepan en una pantalla y se puedan desplazar. Miguel:
  «vamos a hacerlo de esa manera».
- **Antes de construir, se decide (una pregunta a la vez):**
  1. **Regla 9** («las rutas solo en un menú desplegable») y la prueba que
     prohíbe rejillas y tarjetas: se cambian a «las 39 rutas en un selector
     visual, ninguna oculta, en el orden de routes.txt». El `<select>` nativo
     puede quedar como alternativa accesible.
  2. **Nombre en la insignia:** «R1» en vez de «001». Falta definir cómo se
     ven 009B, 011B y las intermunicipales, y si «R» choca con lo que dicen
     las unidades en la calle [sin verificar].
  3. **Colores:** paleta propia que se repite (regla 4: sin colores oficiales);
     el color no significa nada de la ruta, y se dice.
  4. **«Rutas más comunes»:** no hay fuente de qué rutas se usan más; no se
     inventa. Alternativa honesta: «Tus rutas recientes», guardadas solo en el
     teléfono, sin cookies.
- **Respuestas de Miguel:**
  1. **Regla 9 (Miguel, 20 nov 2026, 4:33 pm): «con respaldo».** Queda: las 39
     rutas en un selector visual de tarjetas, ninguna oculta, en el orden de
     `routes.txt`, **y** el `<select>` nativo se queda como respaldo
     (lectores de pantalla y por si falla una tarjeta). Las dos pruebas que
     prohíben tarjetas (`scripts/pruebas/selector.test.mjs`,
     `pruebas-navegador/b2a.spec.mjs`) se cambian para revisar esa regla.
  2. **Insignia (Miguel, 20 nov 2026, 4:34 pm): «R urbanas, T inter».**
     Urbanas: «R» + número sin ceros a la izquierda, con su letra (001 → R1,
     009B → R9B, 011B → R11B, 015B → R15B, 23 → R23). Intermunicipales: «T»
     (062 → T62, 023 → T23), para que la 023 nunca choque con la urbana 23
     (la misma confusión de D-42). Las intermunicipales llevan además otro
     color de camión. Cada tarjeta muestra chico el número oficial («Ruta
     001»), porque no se sabe qué número traen las unidades en la calle [sin
     verificar]. Prueba: las 39 insignias son distintas entre sí.
  3. **Colores (Miguel, 20 nov 2026, 4:36 pm): «sí, 4 colores».** Rotación
     de 4 colores propios en el orden de las tarjetas: verde azulado
     `#0d7a72`, ámbar `#f0a032`, azul tinta `#12262d` y un terracota por
     definir; las intermunicipales llevan un color aparte, fuera de la
     rotación. Ninguno es oficial (regla 4). Línea visible arriba de las
     tarjetas: «Los colores solo ayudan a distinguir las tarjetas; no indican
     nada de la ruta.» Criterio: contraste AA (≥ 4.5:1) entre el texto y cada
     color; si no lo cumple con blanco, el texto va oscuro.
  4. **Recientes (Miguel, 20 nov 2026, 4:44 pm): «sí, recientes».** No hay
     «rutas más comunes» (sin fuente, regla 1). Arriba de las tarjetas, «Tus
     rutas recientes»: las últimas 3 rutas elegidas, guardadas solo en el
     navegador del teléfono (`localStorage`), sin cookies y sin enviarse a
     ningún servidor. No aparece la primera vez; botón «Borrar». Las 39
     tarjetas siguen completas abajo, en su orden (regla 9).
  5. **Zona probable (Miguel, 20 nov 2026, 5:17 pm): entra en D-50.** «De
     manera muy transparente se puede poner lo más aproximado»: al elegir la
     ruta, el inicio y el fin se ven como **zona** (círculo difuso) con un
     punto en lo más probable, el nombre del lugar y la leyenda «En proceso de
     verificación · ESTIMADO». Inicio y fin según el sentido (D-18: la ida sale
     del primer lugar del nombre). Sigue sin dibujarse la trayectoria (D-49).
     - **Radio por confianza (criterio de trabajo, ESTIMADO):** VERIFICADA
       (HANDOFF §11.3) 150 m · UBICADO POR MIGUEL / POR VERIFICAR 300 m ·
       REFERENCIA DE ZONA (Centro, San Juan del Río) 500 m · zona por
       cercanía 900 m.
     - **Los FALTANTES de D-41, «el nombre de la zona más cercana»:** el punto
       no es al azar (un punto al azar cambia y aparenta exactitud): es el
       centro de la zona conocida más cercana, con su nombre y la palabra
       «cerca de». Manantiales / Nogales (042) → cerca de Manantiales (punto de
       Miguel de la 046; el último cruce UBICADO de la 042, Hidalgo e Ignacio
       Zaragoza, queda a ~0.7 km). Valle Dorado II (044) → cerca de Valle
       Dorado I (punto de Miguel de la 043; solo comparte el nombre [sin
       verificar]). **Ezequiel Montes (023) sigue FALTANTE:** está fuera del
       municipio, el repositorio no tiene ninguna coordenada suya y la única
       propuesta la rechazó Miguel por ambigua; se muestra el nombre con
       «FALTANTE», sin círculo, hasta que Miguel decida.
- **Criterio de aceptación de D-50 (medible):**
  1. Al abrir el menú sin ruta elegida: **39 tarjetas**, en el orden de
     `routes.txt`, ninguna oculta, cada una con camioncito vectorial,
     insignia (R… / T…), nombre y número oficial chico; las 39 insignias
     distintas.
  2. 390 × 844: caben al menos **8 tarjetas** en la primera vista del menú y
     el resto se desplaza dentro del menú; 1280 × 800: al menos 12.
  3. Colores en rotación de 4 (intermunicipales aparte), con la línea «Los
     colores solo ayudan a distinguir…» visible; contraste del texto ≥ 4.5:1.
  4. Tocar una tarjeta = elegir la ruta: el `<select>` de respaldo cambia
     igual, aparece el sentido y se abre el detalle; botón «Cambiar ruta»
     para volver a las tarjetas.
  5. «Tus rutas recientes»: no aparece la primera vez; después muestra hasta
     3; «Borrar» la vacía; solo `localStorage`, sin cookies.
  6. Con ruta elegida: 2 zonas en el mapa (1 si un extremo es FALTANTE), cada
     una con su nombre, «En proceso de verificación · ESTIMADO» y su fuente al
     tocarla; con Vuelta se intercambian Inicio y Fin.
  7. Botones y tarjetas ≥ 44 px; leyenda de iniciativa independiente y
     atribución de OSM visibles; pruebas y `npm run verificar` en verde.
     Capturas en `docs/evidencia/d50/`.
- **Ver la ruta aproximada desde ya:** el trazo llega con R-06 (B3). Antes, lo
  honesto es mostrar origen y destino como zona probable (D-46). Se decide con
  este bloque.
- **Construido (20 nov 2026, 5:27 pm):** tarjetas, insignias, colores,
  recientes y zonas probables, con el criterio de arriba. Pruebas:
  `scripts/pruebas/tarjetas.test.mjs` (regla de insignias, colores con
  contraste, recientes y zonas sin puntos inventados) y
  `pruebas-navegador/d50.spec.mjs` (criterios 1 a 6, a 390 y 1280 px).
  Capturas en `docs/evidencia/d50/`. Cambia la regla 9 de `CLAUDE.md` (y
  HANDOFF §14 en ese punto).
- **Decide:** Miguel, al verla en su teléfono (con eso se cierra B2).

## D-51 · 20 nov 2026 · Mapa isométrico o ilustrado de San Juan del Río · PROPUESTA (fase posterior)
- **Idea (Miguel, 20 nov 2026):** sobre el mapa de OpenStreetMap, una capa
  visual más atractiva: un mapa isométrico de San Juan del Río con las rutas.
- **Postura:** se tiene en cuenta, pero **después del lanzamiento**. El mapa de
  OpenStreetMap sigue siendo la base real (regla 6). Una capa ilustrada se
  etiqueta ESQUEMÁTICO y no sustituye al mapa (regla 1 y lección 1: un mapa
  esquemático ya hizo que los camiones cruzaran manzanas).
- **Falta para decidir:** opciones y costo (teselas vectoriales gratuitas con
  vista inclinada y edificios en 3D, o una ilustración propia) [sin verificar];
  presupuesto $0 (regla 3). Se estudia después de B4.
- **Decide:** Miguel, en una fase posterior.

## D-52 · 20 nov 2026 · Detalle de ruta más visual; fuentes fuera de la pantalla · EN REVISIÓN
- **Pedido (Miguel, 20 nov 2026, 5:43 pm), al ver D-50:**
  1. En el detalle, en vez del cuadro «R1», la **tarjeta de la ruta** (la del
     camioncito), para que sea más visual.
  2. «Tipo: Urbana» se queda.
  3. **Sentido y paradas en un mismo renglón.**
  4. «Duración del recorrido» se cambia por un **camión que inicia, puntos y un
     camión que termina**; más puntos mientras más dura: menos de 20 min, 3
     puntos; de 30 min en adelante, 4; y así cada 10 min. Se conserva el
     número («30 min»).
  5. «Horario» se cambia por un **relojito** con el horario.
  6. La etiqueta «Nivel C» y «el recorrido todavía no se dibuja» van **más
     abajo y en letra chica**.
  7. **Se quita de la pantalla «referencia Moovit…»**: «en una producción real
     nunca ponen eso»; las fuentes se explicarán en el aviso de privacidad y
     los términos y condiciones.
  8. Se quita la nota «En el mapa: Inicio: Pedregoso…» y el detalle de cada
     zona; en su lugar, **una leyenda general**: datos en proceso de validación.
  9. En el teléfono, **tarjetas un 50 % más chicas** para que quepan más rutas;
     se vale un camión más sencillo.
- **Cambia la regla 1 en la pantalla:** cada cifra sigue con su fuente, estado
  y fecha **en los datos** (`web/public/datos/rutas.json`, `datos/fichas/`) y en
  `detalleRuta()`, pero la app ya no la escribe junto a cada cifra; muestra la
  leyenda general «datos en proceso de validación». Lo de rango (Nivel C) y lo
  estimado (zonas) sigue dicho en pantalla, en chico.
- **FALTANTE:** la página de aviso de privacidad y términos donde se nombran
  las fuentes. Mientras no exista, la app no muestra de dónde sale cada cifra.
  Si los términos de uso de Moovit piden atribución visible [sin verificar],
  se revisa antes de publicar v0.2.
- **Puntos de duración:** puntos = el mayor entre 3 y (decenas de minutos + 1):
  16 min → 3, 20 → 3, 29 → 3, 30 → 4, 42 → 5. Es escala visual, no medición.
- **Criterio:** a 390 × 844 se ven al menos 14 tarjetas enteras (antes 8);
  detalle sin «Moovit» ni «Fuente»; leyenda general en el pie; puntos según la
  regla de arriba; pruebas en `scripts/pruebas/detalle.test.mjs` y
  `pruebas-navegador/d50.spec.mjs`. Capturas en `docs/evidencia/d50/`.
- **Decide:** Miguel, al verlo en su teléfono.

## D-53 · 20 nov 2026 · Pantalla limpia: sin menú desplegable, botón de paradas, «¿A dónde quieres ir?» · CONSTRUIDA · APROBADA (Miguel, en su teléfono, 21 nov 2026, 12:34 am)
- **Pedido (Miguel, 20 nov 2026, 6:11 pm), al probar D-50/D-52 en su teléfono:**
  1. **Botón de paradas:** en vez del botón «Paradas», un botón redondo junto
     al buscador de arriba con el pictograma del camión (el del pin de
     parada). Las paradas se quedan como referencia; se ven al presionarlo.
     Será la puerta de «camina a tu parada más cercana».
  2. **El buscador y el sentido «aparecen de golpe»** al abrir el menú, no se
     mueven junto con él.
  3. **Recientes y tarjetas aún más chicas**, letra más chica y **sin «Ruta
     001»** («no ocupa espacio y no lo necesitamos»). Le gusta el tamaño de
     las recientes y el menú.
  4. **Más colores:** al menos 20 variaciones (no todos distintos), para que no
     se sientan repetidos.
  5. **Menú cerrado = mapa a pantalla completa.** Arriba ya no hace falta el
     selector de ruta.
  6. **Se elimina el menú desplegable «¿A dónde vas? Elige tu ruta»:** la ruta
     se elige en las tarjetas del menú.
  7. **Arriba va «¿A dónde quieres ir?»** para escribir el destino (p. ej. «al
     Hospital General 3»): con tu ubicación, la app dice tu parada más cercana,
     cómo llegar caminando y qué ruta tomar. «Es bien importante que sea una
     segunda función de la aplicación.» Dos funciones: **Elige tu ruta** (ver
     su trayectoria) y **¿A dónde quieres ir?**
  8. **Las pestañas «Rutas» y «Calcula tu ruta» arriba del menú** también en
     el teléfono, para dejar más espacio a las rutas.
- **Choques con lo que ya estaba (se anotan, Miguel ya decidió):**
  - El 6 revierte la respuesta 1 de D-50 («con respaldo»): ya no queda el
    `<select>`. Las tarjetas son botones (sirven con teclado y lector de
    pantalla). Cambian la **regla 9** (tarjetas, sin desplegable) y la **regla
    5** (la primera pantalla es mapa + ☰ + «¿A dónde quieres ir?» + paradas;
    la ruta se elige en el menú).
  - El 3 revierte en parte la respuesta 2 de D-50: el número oficial deja de
    verse en las tarjetas; se propone dejarlo solo en el encabezado del
    detalle, en chico [falta el sí de Miguel].
  - **Respuesta (Miguel, 20 nov 2026, 6:23 pm):** «Ruta 001» es el nombre
    oficial y se queda **solo en los datos** (`routes.txt`, `rutas.json`); el
    usuario **no lo ve en ninguna pantalla**, ni en el detalle. El usuario ve
    la insignia (R1, R9B, T62…) y el nombre de la ruta.
- **Límite honesto del 7 (es B6, D-15):** hoy no se sabe **qué rutas paran en
  cada parada** (R-07 PROPUESTA) ni la trayectoria (R-03 a R-06); escribir un
  destino libre pide geocodificar, y la regla 7 no deja consultar Nominatim en
  vivo. Lo que sí se puede sin inventar: (a) buscar el destino en un catálogo
  guardado en el repositorio (los 35 lugares de extremos, colonias y lugares de
  OSM descargados una vez); (b) con el GPS del teléfono (permiso del usuario,
  sin enviarlo a ningún lado) señalar la **parada de OSM más cercana**, como
  referencia y POR VERIFICAR; (c) decir qué rutas **empiezan o terminan** cerca
  del destino (extremos, ESTIMADO). «Qué ruta tomar desde tu parada» llega
  cuando exista R-07. Se diseña con Miguel, una pregunta a la vez, antes de
  construir.
  - **Respuesta (Miguel, 20 nov 2026, 6:29 pm): «sí, las 3»**, con la condición
    de que lo demás llegue en fases posteriores. Primera versión: (a) destino
    del catálogo guardado, (b) parada de OSM más cercana por GPS (referencia,
    POR VERIFICAR) a una distancia **en línea recta** (ESTIMADO, no el camino
    por calles), (c) rutas que empiezan o terminan cerca del destino
    (ESTIMADO). **Fases posteriores, ya en el plan:** trayectoria (B3: R-03 a
    R-06), paradas de cada ruta (R-07, PROPUESTA), «qué ruta tomar» y
    transbordos (B6, D-15; su lugar en el plan es PROPUESTA). **Sin fase
    asignada todavía:** el camino a pie por calles hasta la parada (necesita
    calcular rutas en el teléfono sin servicios en vivo, regla 7); se propone
    dentro de B6.
- **Maqueta (D-54):** `docs/maquetas/d53/maqueta.html`, capturas en
  `docs/maquetas/d53/capturas/` (6 pantallas a 390 y 1280 px). Miguel: «me
  gusta, buen trabajo» (20 nov 2026, 6:49 pm), con estos ajustes, ya aplicados
  en la maqueta:
  1. **Todo lo legal junto, abajo, chico y en verde** (el verde de la barra):
     leyenda de iniciativa independiente, «datos en proceso de validación»,
     sello de maqueta y atribución de Leaflet y OpenStreetMap, en un solo pie.
     «Discreto, pero anunciado; profesional.»
  2. **Avisos del mapa discretos** (p. ej. «49 paradas de OpenStreetMap · por
     verificar en campo»): letra chica, verde, sin recuadro grande.
  3. **«Rutas que empiezan o terminan cerca»:** tarjetas del mismo tamaño
     (rectángulo con esquinas redondeadas, como las del menú), compactas; no
     renglones a lo ancho.
  4. **Se quita el cuadro «Parada de OpenStreetMap»** (no era botón); la
     parada se marca en el mapa y la nota va en verde, chica.
- **Ajustes 2 (Miguel, 20 nov 2026, 6:57 pm), ya en la maqueta:**
  1. En «Calcula tu ruta», las leyendas (estimado, nota de maqueta,
     próximamente) van **juntas, hasta abajo** del menú, en el mismo tamaño.
  2. **Paradas como círculo levantado** (distinto del pin): círculo verde con
     punto blanco, y una **guía de puntitos** que baja al punto exacto de la
     parada. Levantarlas ayuda a leerlas, pero dos paradas a pocos metros se
     siguen encimando a zoom bajo. **No se unen las paradas entre sí:** no se
     sabe su orden ni qué ruta pasa por cada una (R-07); unirlas dibujaría un
     recorrido inventado (regla 1).
  3. **Pie legal y avisos del mapa sin fondo blanco**, pegados abajo y
     transparentes (un halo blanco en la letra los deja leer sobre el mapa).
  4. **«estimado» en minúscula** y letra chica en las leyendas (sigue dicho en
     pantalla, regla 2).
  5. **Insignia R1 más grande** en el aviso de ruta elegida con el menú cerrado.
- **Ajuste 3 (Miguel, 20 nov 2026, 7:03 pm):** el círculo de la parada lleva
  dentro **el camión de frente** (el mismo pictograma del botón). «Se ve
  increíble.» Ya en la maqueta.
- **Maqueta aprobada (Miguel, 20 nov 2026, 7:04 pm): «sí, apruebo».** Se
  construye en `web/` en un chat nuevo, con la maqueta como referencia
  (`docs/maquetas/d53/`), criterio medible antes de cada parte y las reglas de
  las lecciones 10, 11 y 13.
- **Decide:** Miguel. Se construye en el chat siguiente (contexto de este chat
  al 29 %, umbral de aviso 30 %).
- **Construcción (Miguel: «si arranca», 20 nov 2026, 8:45 pm):** hecha en
  `web/` con la maqueta como referencia. Criterios medibles escritos antes de
  construir (8:47 pm): `docs/evidencia/d53/criterios.md`. Pruebas:
  `pruebas-navegador/d53.spec.mjs` (nueva), `b2a` y `d50` reescritas para elegir
  por tarjeta, y `scripts/pruebas/destino.test.mjs` (nueva). Capturas de la app a
  390 y 1280 px junto a las de la maqueta en `docs/evidencia/d53/comparacion/`.
  Inventario de selectores (lección 13): `docs/evidencia/d53/inventario-selectores.md`.
  Reglas 5 y 9 de `CLAUDE.md` actualizadas (sin `<select>`). Lo que se decidió al
  construir, para el visto bueno de Miguel:
  1. **Vista inicial:** la ciudad completa, como la maqueta (antes: zoom en Plaza
     Independencia, que sigue a la vista).
  2. **Botones de 44 px** («Borrar», «Cambiar ruta»): la maqueta los dibujó de 36
     y 40 px; se dejan en 44 por el mínimo táctil que revisan las pruebas.
  3. **Estados que la maqueta no dibujó**, con texto mínimo: búsqueda sin
     resultados («No está entre los lugares guardados…») y permiso de ubicación
     negado («No diste permiso… la app sigue funcionando sin ella»).
  4. **«Usar mi ubicación»** también aparece en computadora (la maqueta lo
     mostraba en las dos); la ubicación nunca sale del dispositivo (sin petición
     de red con ella, lo revisa `d53` e5).
  5. Elegir una ruta quita el destino del mapa, y elegir un destino quita la
     ruta: un solo tema a la vez en el mapa.

## D-54 · 20 nov 2026 · Primero las pantallas de muestra, después la construcción · VIGENTE
- **Decisión (Miguel, 20 nov 2026, 6:13 pm):** «yo propongo los cambios, tú
  genera las nuevas pantallas para yo validar que efectivamente se ven los
  cambios, y luego construimos». Le ha funcionado en otro de sus proyectos
  (dicho por Miguel; no se abrió ese proyecto: regla 4 de standards).
- **Cómo se hace aquí:** para todo cambio de pantalla, primero una **maqueta**
  (archivo HTML estático en `docs/maquetas/<tarea>/`, con el mismo estilo de
  la app y datos reales de `rutas.json`, sin lógica) y sus capturas a 390 px y
  1280 px. Miguel la aprueba o la corrige. Solo con su sí se toca `web/` y se
  escriben las pruebas. La maqueta se marca ESQUEMÁTICO y nunca se publica
  como la app.
- **Por qué:** cada vuelta sobre la app real arrastra pruebas, puerta y
  subida; corregir sobre la maqueta es barato (D-48 a D-53 fueron 5 vueltas
  sobre la app real).
- **Para todos los proyectos:** propuesta para `standards.md` (la cosecha del
  Second Brain la lleva; no se sube sin el sí de Miguel).
- **Impacta:** `CLAUDE.md` («Cómo trabajar»), `docs/PLAN.md` (relevo: D-53
  empieza por su maqueta).

## D-55 · 20 nov 2026 · Bienvenida «Así funciona» y tarjetas parejas · CONSTRUIDA · APROBADA (Miguel, en su teléfono, 21 nov 2026, 12:34 am)
- **Pedido (Miguel, 20 nov 2026, 9:24 pm),** al probar D-53 en el navegador:
  1. **Cuadro de bienvenida** al entrar, como el «Así funciona» de su otro
     proyecto (Avisos SJDR; Miguel mandó la captura, no se abrió ese proyecto:
     regla 4 de standards): título, **3 pasos muy cortos** numerados de lo que
     hace la app, botón **X** para cerrarlo y después seguir. En su referencia:
     tarjeta blanca abajo a la izquierda sobre el mapa, pasos con número en
     círculo y verbo en negritas, dos botones de acción y la nota «Sale solo la
     primera vez. Se recuerda en este dispositivo, sin cookies».
  2. **Tarjetas de ruta:** la insignia (camión + R1, R2…) **más grande**; el
     nombre de inicio y fin («Pedregoso – Centro») **sin negritas y más chico**;
     **todas las tarjetas del mismo tamaño** (hoy cambian de alto según las
     líneas del nombre; captura de Miguel en computadora, 4 columnas).
- **Referencias (fuera de git, lección 8 y regla 7 de standards):**
  `referencias/d55/tarjetas-escritorio-miguel.png` y
  `referencias/d55/asi-funciona-avisos-sjdr.webp`.
- **Orden (Miguel: «sí, va en ese orden», 9:31 pm):** fase 1 de 3. Maqueta en
  `docs/maquetas/d55/` con capturas a 390 y 1280 px (D-54) → sí de Miguel →
  construir en `web/` → cierra B2 (v0.2).
- **Abierto (se pregunta en la maqueta, una a la vez):** los 3 pasos y sus
  textos; si lleva botones de acción (p. ej. «Elegir ruta» / «¿A dónde quieres
  ir?») además de la X; si sale solo la primera vez (localStorage, sin cookies).
- **Maqueta (D-54):** `docs/maquetas/d55/maqueta.html` (parte de la de D-53;
  vistas `?vista=bienvenida` y `?vista=menu`), capturas a 390 y 1280 px en
  `docs/maquetas/d55/capturas/`, junto a la app actual (`0ea1cb3`) en
  `capturas/comparacion/`.
- **Bienvenida aprobada (Miguel, 20 nov 2026, 9:58 pm): «el mapa de inicio está
  perfecto, así funciona».** Queda como en la maqueta: los 3 pasos («Elige tu
  ruta en el menú ☰ y mira dónde empieza y dónde termina» · «Escribe a dónde
  quieres ir y ve qué rutas empiezan o terminan cerca» · «Toca el camión de
  arriba para ver las paradas en el mapa»), la X, los botones «Elegir ruta» y
  «¿A dónde quieres ir?», y la nota «Sale solo la primera vez. Se recuerda en
  este dispositivo, sin cookies» (localStorage). Así se cierran las 3 preguntas
  abiertas.
- **Último cambio a las tarjetas (Miguel, 9:58 pm):** tarjeta **partida a la
  mitad**: a la izquierda, arriba, el camión de frente (casi 3/4 del alto) y
  abajo la insignia (R1, T62…); a la derecha, inicio – fin en letra chica, sin
  negritas. Todas del mismo alto.
  - **Error de Claude (corregido):** la maqueta pasó por su cuenta a 2
    columnas, sin preguntar, porque con 3 no cabían los nombres. Miguel (10:02
    pm): «rompiste una regla»; se vuelve a **3 columnas** en el teléfono,
    «un poquito más larguitos», con el **mismo espacio arriba y abajo** y sin
    sobrar, para que se vean la mayor cantidad de rutas.
  - **Cómo quedó (medido en la maqueta con Playwright):** palabras largas
    cortadas con guion («Tequis-quiapan», `hyphens: auto`, idioma español);
    camión de 32 px, insignia de 12 px, nombre de 9.5 px; 5 px arriba y abajo,
    contenido centrado. Teléfono (3 columnas): **70 px**, el mínimo para que
    quepa el nombre más largo; los 42 nombres caben completos.
  - **Ajuste (Miguel, 10:10 pm): tarjetas «más comprimidas, más apretaditas»**;
    la vista y el alto (70 px) se quedan. Menos espacio alrededor del camión
    (camión de 30 px, columna fija de 36 px = la insignia más ancha, relleno de
    3 a 4 px). **La letra de cada nombre se ajusta a su tarjeta:** el tamaño más
    grande que cabe completo, de 11 px hacia abajo (debajo de 9 px, letra
    delgada); sin guiones que partan palabras; el «–» se pega a la palabra
    vecina más corta, nunca queda solo en un renglón. Medido en la maqueta:
    teléfono, letra de 8 a 11 px (5 de 42 tarjetas abajo de 9 px), los 42
    nombres caben; computadora en 3 columnas, de 9.25 a 11 px, caben todos;
    en 4 columnas no caben 10 nombres ni a 7.5 px.
  - **Computadora (Miguel, 10:20 pm): «3 columnas»** (antes 4). Con 4 columnas
    la tarjeta tenía que ser de 105 px (12 rutas a la vista) y aun así no cabían
    10 nombres; con 3 bastan 60 px (21 rutas a la vista). Rutas a la vista, sin
    las recientes: app actual 21 en teléfono y 24 en computadora; maqueta 18 y 21.
- **Maqueta terminada (Miguel eligió el último detalle a las 10:20 pm).** Final:
  `docs/maquetas/d55/maqueta.html`, capturas en `docs/maquetas/d55/capturas/` y
  comparación con la app actual en `capturas/comparacion/`. Siguiente:
  construir en `web/` (chat nuevo), con criterio medible antes:
  1. Bienvenida: sale la primera vez (localStorage, sin cookies); X y los dos
     botones la cierran; no vuelve a salir al recargar; no tapa la barra de
     arriba; mismo texto que la maqueta.
  2. Tarjetas: todas del mismo alto (70 px en teléfono, 60 px en computadora),
     3 columnas en los dos anchos, el nombre completo sin cortes ni palabras
     partidas, ningún «–» solo en un renglón, letra entre 11 px y un mínimo
     (en la maqueta: 8 px en teléfono, 9.25 px en computadora).
- **Decide:** Miguel.
- **Construida en `web/` (20 nov 2026, de las 10:34 pm a las 10:44 pm),** igual a
  la maqueta, con criterio escrito antes (`docs/evidencia/d55/criterios.md`):
  bienvenida en `web/index.html` y `web/src/main.ts` (clave `sjdrbus.bienvenida`
  en localStorage, sin cookies); tarjeta partida y ajuste de letra
  (`gruposNombre`, `elegirLetra` en `web/src/tarjetas.ts`; `ajustarLetra` en
  `main.ts`, que se vuelve a correr cuando la tarjeta cambia de tamaño).
  Pruebas: `pruebas-navegador/d55.spec.mjs` (10, en 390 y 1280 px) y
  `scripts/pruebas/d55.test.mjs` (6); se validaron metiendo 4 defectos a
  propósito (alto, 4 columnas, «–» suelto o palabra partida, letra fija) y las 4
  los atraparon. Capturas en `docs/evidencia/d55/` y lado a lado con la maqueta
  en `docs/evidencia/d55/comparacion/`. Inventario de selectores: ninguno se
  fue (`docs/evidencia/d55/inventario-selectores.md`).
  - **Sin cambiar (lección 14):** las tarjetas de «Rutas que empiezan o terminan
    cerca» no estaban en la maqueta: siguen como en D-53 (4 columnas en
    computadora). El botón «Borrar» de recientes mide 44 px de alto (D-53, para
    el dedo) contra 36 px en la maqueta; las recientes quedan unos 12 px más
    abajo. Se pregunta a Miguel si alguna de las dos debe cambiar.
  - **Detalle no dibujado en la maqueta, resuelto sin tocar nada aprobado:** con
    el menú abierto la bienvenida no se ve (en computadora quedaría encima del
    menú) y vuelve al cerrarlo si no se ha cerrado con la X o sus botones. Esc
    también la cierra.

## D-56 · 20 nov 2026 · «Calcula tu ruta» de punta a punta: caminar, tomar la ruta, bajar y caminar · APROBADA EN FASES
- **Pedido (Miguel, 20 nov 2026, 9:24 pm):** escribir **cualquier lugar** (p. ej.
  «Cinépolis») y que la app diga: camina a esta parada, toma esta ruta, bájate
  en tal parada y camina otros N minutos al lugar. «Es importante que se incluya.»
- **Ya estaba planeado:** es D-15 (B6 · Calcula tu ruta, 17 nov). Miguel se
  adelanta; se le dijo así (9:24 pm).
- **Qué se puede y qué no, hoy (límite honesto, regla 1):**
  - **Buscar cualquier lugar: sí.** Hoy el catálogo son los lugares de inicio y
    fin de las rutas; `datos/cache/overpass/lugares.json` trae 80 lugares de OSM
    y Cinépolis no está. Hace falta **una descarga nueva** de lugares con nombre
    de OpenStreetMap (Overpass, al construir el dato, con caché; regla 7; $0).
  - **Parada más cercana a ti y al destino, con distancia a pie en línea recta
    (ESTIMADO): sí.** El camino a pie por calles, con minutos, necesita calcular
    rutas a pie en el teléfono sin servicios en vivo: B6.
  - **«Toma esta ruta y bájate en tal parada»: no todavía.** Falta el recorrido
    de cada ruta (B3: R-03 a R-06) y qué rutas paran en cada parada, en orden y
    por sentido (R-07). Sin eso sería un recorrido inventado.
- **Orden aprobado (Miguel, 9:31 pm):**
  - Fase 1: D-55 (bienvenida y tarjetas).
  - Fase 2: D-56 parte posible: catálogo amplio de lugares de OSM + parada más
    cercana a ti y al destino, con distancia en línea recta (ESTIMADO). Maqueta
    primero (D-54).
  - Fase 3: B3 (R-03 a R-06) → R-07 → B6 completo: qué ruta tomar, dónde bajar,
    transbordos y camino a pie por calles.
- **Decide:** Miguel.
- **Fase 2 · maqueta (22 nov 2026):** `docs/maquetas/d56f2/` (criterios, inventario,
  capturas a 390, 320 y 1280 px). Ajustes de Miguel: «Salgo de otro lugar» como círculo
  con ícono en el mismo renglón que tu parada (9:18 pm) y opción C: el texto chico
  debajo del renglón y el nombre de la parada 25 % más chico (9:25 pm); la línea del
  destino se queda a 14 px (9:33 pm). **Maqueta aprobada (Miguel, 9:34 pm): «Sí,
  constrúyela».** Tipos de lugar a descargar aprobados (9:40 pm, «sí, sin opcionales»:
  sin farmacias, gasolineras ni tiendas de conveniencia):
  `docs/maquetas/d56f2/tipos-propuestos.md`.

## D-57 · 20 nov 2026 · «Calcula tu ruta»: la parada más cercana arriba y con poca letra · CONSTRUIDA · APROBADA (Miguel, en su teléfono, 21 nov 2026, 12:34 am)
- **Pedido (Miguel, 20 nov 2026, 10:55 pm),** al probar D-55: al escribir el
  lugar, «Tu parada más cercana» se va hasta el fondo y hay que hacer scroll para
  encontrarla. Que quede **arriba**, y abajo «¿A dónde quieres ir?»; que diga
  algo como «encontrar la parada más cercana desde donde estoy», con **menos
  letra**. «Con ese ajuste finalmente concluiríamos todo» (cierra B2).
- **Maqueta (D-54):** `docs/maquetas/d57/maqueta.html` (parte de la de D-55;
  vistas `?vista=destino` y `?vista=ubicado`), capturas a 390 y 1280 px en
  `docs/maquetas/d57/capturas/` y comparación con la app de hoy
  (`comparacion-390.jpg`, `comparacion-1280.jpg`).
- **Diferencias contra la app de hoy (lección 14):**
  1. Arriba de la pestaña: un solo botón «Buscar mi parada más cercana» (antes:
     título «Tu parada más cercana» + botón «Usar mi ubicación», al fondo).
  2. «¿A dónde quieres ir?», lugares guardados y rutas cerca quedan abajo, sin
     otro cambio (las tarjetas de «cerca» como en D-53).
  3. Al ubicarte, el botón se vuelve una línea: «Parada · a 280 m» y abajo «Tu
     parada más cercana · en línea recta · por verificar», con «Actualizar».
     Sustituye a la nota larga del fondo, que queda solo como «Tu ubicación no
     sale del teléfono.» **Propuesta para cumplir «menos letra»: se pregunta.**
- **Respuestas y ajuste (Miguel, 11:01 y 11:07 pm):**
  - «Actualizar» confundía (Miguel pensó que era editar la dirección): ahora es
    un **botón de ícono** (ubicación con flecha de actualizar), sin texto, que
    vuelve a leer el GPS. «Puros botones.»
  - **Tocar la línea de la parada** (ahora un botón, con «›»): en el teléfono se
    cierra el menú; el mapa se centra en la parada y abre su ficha (nombre,
    fuente OSM, fecha de consulta, POR VERIFICAR EN CAMPO). En computadora el
    menú se queda (el mapa está al lado). Vista `?vista=parada-mapa`; capturas
    `3-parada-mapa-*.jpg` y tiras `ajuste-390.jpg`, `ajuste-1280.jpg`.
  - **Editar la dirección de salida** (escribir desde dónde sales): va con el
    catálogo amplio de OSM, en D-56 fase 2 (regla 7: sin geocodificar en vivo).
  - **Ruta caminando:** D-56 fase 3 (B6). No se dibuja antes en línea recta
    (regla 1).
- **Maqueta aprobada (Miguel, 11:20 pm): «Sí, constrúyela».**
- **Construida en `web/` (de las 11:20 pm a las 11:28 pm),** igual a la maqueta,
  con criterio escrito antes (`docs/evidencia/d57/criterios.md`): bloque
  `#mi-parada` arriba en `web/index.html`; `buscarParada()`, la línea
  `#ver-parada` y el botón de ícono `#otra-vez` (lectura nueva del GPS) en
  `web/src/main.ts`; íconos en `web/src/iconos.ts`. Errores de ubicación junto
  al botón (no estaban dibujados). Pruebas: `pruebas-navegador/d57.spec.mjs` (5);
  las de `d53.spec.mjs` que leían la nota larga se actualizaron solo en eso.
  Validadas con 3 defectos a propósito (parada al fondo, ficha sin abrir,
  «buscar de nuevo» con la ubicación guardada): las 3 los atraparon.
  - **Defecto encontrado en la comparación visual (lección 3) y corregido:** si
    se tocaba la parada antes de 330 ms, el encuadre pendiente de «ubicarte»
    alejaba el mapa y cortaba la ficha. Las pruebas pasaban; las capturas lo
    mostraron. Se agregó a la prueba (ficha entera, zoom de cerca), se vio
    fallar con el defecto y pasar con el arreglo.
  - Capturas en `docs/evidencia/d57/` y lado a lado en
    `docs/evidencia/d57/comparacion/`. Inventario: ningún selector se fue.
- **Decide:** Miguel.

## D-58 · 21 nov 2026 · Zoom «+ / −» en píldora y formato píldora en los cuadros · APROBADA (Miguel, 22 nov 2026, 4:09 pm)
- **Pedido (Miguel, 21 nov 2026, 12:34 am),** al aprobar D-53 + D-55 + D-57 en su
  teléfono: falta el control «más / menos» para acercar el mapa, en teléfono y en
  computadora, como botón en forma de píldora. Y «todos los cuadros que apliquen y
  que quepan» en formato píldora, como casi todo lo demás; nombró las tarjetas de
  ruta. Primero se actualiza la pantalla y después se integra v0.2.
- **Maqueta (D-54):** `docs/maquetas/d58/maqueta.html` (parte de la de D-57),
  capturas a 390 y 1280 px en `docs/maquetas/d58/capturas/`. Inventario de lo que
  cambió y de lo que no, con su razón: `docs/maquetas/d58/inventario.md`.
- **Medición (lección 14: el pedido choca con lo aprobado en D-55):** la tarjeta
  de ruta mide 100 × 70 px en teléfono; en píldora completa las puntas redondas se
  comen 70 de los 100 px y **10 nombres no caben** (letra a 7.5–8 px). Con esquina
  de 22 px («suave») caben los 42 y la letra queda casi igual (promedio 10.1 px
  contra 10.2 hoy; mínimo 7.75 contra 8). En computadora (119 × 60 px) caben las
  dos, pero la completa baja la letra (27 tarjetas debajo de 9 px).
  Por eso la tarjeta de ruta **no se cambió por omisión** en la maqueta: las
  opciones se ven con `?tarjeta=suave` y `?tarjeta=pildora`. Decide Miguel.
- **Aprobada (Miguel, 21 nov 2026, 12:43 am):** la maqueta, con la tarjeta de ruta
  en **esquina suave** (22 px).
- **Construida en `web/`** (21 nov 2026, 12:50 am): criterios escritos antes
  (`docs/evidencia/d58/criterios.md`), 3 pruebas nuevas en
  `pruebas-navegador/d58.spec.mjs` (390 y 1280 px). Se validaron con el defecto:
  con `web/` como estaba antes fallan las 3; con la píldora completa en las
  tarjetas, la prueba nombra los 8 nombres que se salen. Ningún selector se fue
  (`docs/evidencia/d58/inventario-selectores.md`). Capturas en
  `docs/evidencia/d58/` y lado a lado con la maqueta en
  `docs/evidencia/d58/comparacion/`. Las pruebas de zoom esperan a que termine la
  animación: Leaflet ignora un toque a media animación (una persona no toca tan rápido).
- **Decide:** Miguel (en su teléfono, con D-53 + D-55 + D-57 ya aprobadas).


## D-59 · 21 nov 2026 · Pellizco solo en el mapa y teléfono acostado como teléfono · APROBADA (Miguel, 22 nov 2026, 4:09 pm)
- **Pedido (Miguel, 21 nov 2026, 12:59 am),** al probar la vista previa (`5253b01`,
  todavía sin D-58) en su teléfono, con capturas: (1) al pellizcar para acercar,
  se agranda toda la página (barra, botones) y ya no se puede regresar; el
  acercamiento debe ser solo del mapa, los controles fijos. (2) Al acostar el
  teléfono, la app toma la vista de computadora; debe verse igual que parado
  (buscador, botón de paradas y menú). Antes de seguir con v0.2.
- **Causa (1):** la página permitía el zoom del navegador (`viewport` sin
  `user-scalable=no`, sin `touch-action`); un pellizco que empieza sobre la barra
  o un botón lo toma el navegador, no el mapa. Safari de iPhone además ignora
  `user-scalable=no`, por eso también se frenan sus eventos `gesturestart`.
- **Causa (2):** la vista de computadora se elegía solo por el ancho (768 px o más);
  un teléfono acostado mide unos 844 × 390 px.
- **Maqueta (D-54):** `docs/maquetas/d59/maqueta.html` (parte de la de D-58 con la
  tarjeta en esquina suave), capturas en `docs/maquetas/d59/capturas/`: teléfono
  parado (390 × 844), acostado (844 × 390) y computadora (1280 × 800), más
  `hoy-acostado.jpg` (cómo se ve hoy). Cambios: `touch-action: pan-x pan-y` en la
  página, `maximum-scale=1, user-scalable=no` y freno de `gesturestart`; la vista de
  computadora pide ancho ≥ 768 px **y** alto > 500 px; la barra y el zoom respetan
  la muesca del teléfono acostado.
- **Medido:** teléfono parado y computadora quedan idénticos a D-58 (comparación
  pixel a pixel: solo cambia el texto «Maqueta D-58/D-59» del pie).
- **A considerar:** sin el zoom de la página, quien ve poco ya no puede agrandar
  la letra con el pellizco (el mapa sí se acerca). Es lo que hacen las apps de mapas.
- **Aprobada (Miguel, 21 nov 2026, 1:13 am)** y **construida en `web/`** (1:15 am):
  criterios escritos antes (`docs/evidencia/d59/criterios.md`), 3 pruebas en
  `pruebas-navegador/d59.spec.mjs` (390 px, 844 × 390 y 1280 × 800). Validadas con
  el defecto: con `web/` como en D-58 fallan las dos de D-59 (la tercera es la
  guardia de computadora sin cambio, pasa en ambos); sin el freno de Safari, la
  prueba lo nombra. Ningún selector se fue (`docs/evidencia/d59/inventario-selectores.md`).
  Capturas en `docs/evidencia/d59/` y lado a lado en `docs/evidencia/d59/comparacion/`.
  POR VERIFICAR en el iPhone de Miguel: el pellizco real (Playwright no lo imita).
- **Ajuste 3 (Miguel, 21 nov 2026, 1:23 am),** al probar en su iPhone la vista previa
  (todavía `5253b01`: los commits de D-58 y D-59 no estaban subidos, por eso el giro
  seguía en modo computadora): «la letra de Iniciativa ciudadana independiente se ve
  muy grande», parado y acostado. Causa: Safari del iPhone agranda solo la letra chica
  (el pie está escrito en 9 px). Arreglo: `text-size-adjust: 100%` en la página; es
  el tamaño de la maqueta aprobada, no un cambio de diseño. Prueba a4 en
  `d59.spec.mjs`, validada con el defecto (sin la regla: «auto», falla).
- **Falla en GitHub Actions al subir (21 nov 2026, `26630de`):** «el zoom se encima
  con el chip» por 7 px (pasaba en la Mac). Con otra fuente el chip creció un renglón.
  Arreglo: el zoom se coloca con el alto real del chip (`--chip-alto`, mínimo 60 px:
  igual que la maqueta). Prueba nueva a 320 px con la ruta de nombre más largo: fallaba
  por 71 px antes del arreglo, pasa después. Lección 5, 3.ª ocurrencia.
- **Decide:** Miguel (en su teléfono, junto con D-58).

## D-60 · 21 nov 2026 · Teléfono acostado: zoom más abajo y menú más arriba · APROBADA (Miguel, 22 nov 2026, 4:09 pm)
- **Pedido (Miguel, 21 nov 2026, 1:42 am),** al probar acostado en su iPhone (vista
  previa `26630de`): (1) el «+ / −» se encima con el botón de paradas: bajarlo;
  (2) en el menú, subir «Rutas / Calcula tu ruta» y quitar espacio abajo (donde
  termina el pie) para ver al menos una fila completa de rutas, mejor dos. La isla
  del iPhone tapa un poco la marca del menú: Miguel dijo que está bien.
- **Maqueta (D-54):** `docs/maquetas/d60/maqueta.html` (parte de la de D-59). Solo en
  pantallas de 500 px de alto o menos: el zoom baja hasta arriba del pie; con ruta
  elegida va al lado del chip (el chip deja libre la orilla derecha: cambio que no se
  pidió, necesario para que no se encimen; pregunta para Miguel); el menú quita aire
  arriba, bajo la cabeza, bajo las pestañas y abajo (36 → 18 px).
- **Medido** (Safari acostado con pestañas ≈ 844 × 280, según las capturas de Miguel):
  zoom × paradas se enciman a 844 × 212 en D-59, ya no en D-60; filas completas de
  rutas a la vista al desplazar: 1 → 2 (alto útil 117 → 159 px). Teléfono parado y
  computadora sin cambio (mismas filas y posiciones). Capturas en
  `docs/maquetas/d60/capturas/` (`menu-antes-despues-844x280.jpg`).
- **Ajuste (Miguel, 21 nov 2026, 1:49 am),** en vez del chip más corto: con ruta
  elegida y el teléfono acostado, el chip va **a la izquierda y en vertical**: tres
  píldoras apiladas (insignia R1, nombre con su sentido, «Ver detalle»), **30 % más
  chico** en letra, íconos y márgenes, para que no tape el mapa. Es el único cambio de
  la orientación horizontal. «Ver detalle» se ve de 31 px pero se toca en 44 px (área
  táctil mínima, con un margen invisible). Medido: el chip tapa 7 % de la pantalla a
  844 × 280 (antes 21 %) y 9 % a 844 × 212 (antes 27 %); no se encima con el zoom ni con
  la barra; parado y computadora sin cambio. Captura: `ruta-844x280.jpg`.
- **Aprobada (Miguel, 21 nov 2026, 1:59 am)** y **construida en `web/`** (2:01 am):
  criterios antes (`docs/evidencia/d60/criterios.md`), 4 pruebas en
  `pruebas-navegador/d60.spec.mjs` (844 × 280, 844 × 212 y 390 × 844). Validadas con el
  defecto: sin el bloque de D-60 fallan las 3 de acostado (la 4.ª es la guardia de
  «parado sin cambio»). La prueba b3 de D-59 pasa de «zoom arriba del chip» a «no se
  enciman» (acostado el chip va a la izquierda). Ningún selector se fue. Capturas en
  `docs/evidencia/d60/`. Tropiezo corregido antes del commit: el bloque quedó antes de
  la regla base del menú y no se aplicaba (lo atrapó la prueba e2); se movió al final.
  Segundo tropiezo: la prueba unitaria «áreas táctiles de al menos 44 px» falló con
  «Ver detalle» de 31 px (el toque de 44 px era un margen invisible). Arreglo correcto:
  el botón mide 44 px y la píldora verde de 31 px se dibuja dentro; se ve igual.
- **Ajuste 2 (Miguel, 21 nov 2026, 2:05 am):** acostado, al elegir ruta el mapa se
  alejaba hasta la región (zoom 10 contra 13 parado) y no se veía el trayecto. Causa:
  el encuadre reservaba ~118 px arriba (barra) y ~166 px abajo (chip a lo ancho) en
  280 px de alto. Arreglo en `encuadrar` (main.ts): acostado reserva solo la barra
  arriba, el pie abajo, el ancho del chip vertical a la izquierda y el zoom a la
  derecha. Prueba e5 (`d60.spec.mjs`): acostado, a lo más un nivel más lejos que
  parado, con inicio y fin enteros y sin tapar; falló con el defecto (10 contra 13) y
  pasa con el arreglo (captura `docs/evidencia/d60/4-encuadre-844x280.jpg`).
- **Decide:** Miguel (en su teléfono, con D-58 y D-59).

## D-61 · 21 nov 2026 · Teléfono parado: zoom arriba y círculo «mi ubicación» · APROBADA (Miguel, 22 nov 2026, 4:09 pm)
- **Pedido (Miguel, 21 nov 2026, 2:29 am):** con el teléfono parado, el «+ / −» está
  muy abajo; va abajo del botón de paradas (arriba a la derecha) con un espacio, y
  debajo, otro espacio y un botón en círculo de ubicación, para que quien entra al mapa
  sepa dónde está. Pidió dejarlo guardado y documentado en git antes del chat nuevo.
- **Maqueta (D-54):** `docs/maquetas/d61/maqueta.html` (parte de la de D-60). Solo
  teléfono parado: el zoom pasa arriba a la derecha (12 px bajo el botón de paradas) y
  debajo, a 10 px, un círculo de 46 px «Mostrar mi ubicación en el mapa». En la maqueta
  el círculo lleva a una ubicación de MUESTRA (Plaza Independencia, HANDOFF §11.3).
  Acostado y computadora quedan como D-60 (zoom abajo a la derecha, sin el círculo).
- **Medido** (`docs/maquetas/d61/capturas/`): a 390 × 844 el zoom empieza en 74 px (el
  botón de paradas termina en 62), el círculo queda a 10 px del zoom y nada se encima
  con el chip de la ruta. A 844 × 280 y 1280 × 800, igual que D-60.
- **Al construir (con el sí de Miguel):** el círculo usa la ubicación del teléfono
  (como «Buscar mi parada más cercana», D-57): no sale del teléfono, sin red (regla 7);
  si no hay permiso, el aviso sale y la app sigue.
- **Pregunta para Miguel (lección 14, no se aplicó):** ¿el círculo de ubicación también
  acostado y en computadora?
- **Aprobación (Miguel, 21 nov 2026, 2:51 am):** dijo «sí» a construir D-61 después de
  las 10:00 am; se toma como aprobación de la maqueta. Se pospone porque el límite
  semanal de Claude iba en 94 % (tope de Miguel: 95 %) y se reinicia el 21 nov a las
  10:00 am. Consumo de la construcción: ESTIMADO 1 a 3 puntos del semanal, sin medir.
- **Decide:** Miguel.
- **Construida (22 nov 2026, 3:13 pm):** `web/` como la maqueta. Con el teléfono parado
  el zoom sube arriba a la derecha (12 px bajo el botón de paradas) y debajo, a 10 px,
  el círculo «mi ubicación» de 46 px. Tocarlo pone el punto «Tú» y centra el mapa ahí
  (zoom 16 o más); la ubicación no sale del teléfono (regla 7). Sin permiso, un aviso
  «Sin permiso de ubicación; la app sigue igual» (6 s, mismo estilo y lugar que el
  aviso de paradas, que espera oculto). Acostado y computadora quedan como D-60; al
  girar el teléfono los controles se acomodan solos. El punto «Tú» es uno solo,
  compartido con «Buscar mi parada más cercana».
- **Evidencia:** criterios escritos antes (`docs/evidencia/d61/criterios.md`), prueba
  `pruebas-navegador/d61.spec.mjs` (8 casos, a 390, 375 y 320 px parado, 844 × 280 y
  1280 × 800); antes del cambio fallaban 6 de 8 (los 2 que pasaban revisan que
  acostado y computadora no cambien). Capturas en `docs/evidencia/d61/`. Inventario de
  selectores: 0 quitados (`inventario-selectores.md`).
- **Hallazgo (lección 14):** a 320 × 568, con la R40, la etiqueta «Inicio: Las Águilas»
  queda en parte debajo del círculo (detalle y opciones en
  `docs/evidencia/d61/criterios.md`). **Miguel decidió (22 nov 2026, 4:06 pm): dejarlo
  así (opción A)**; se ve completa moviendo el mapa. No se cambia el encuadre.

## D-62 · 22 nov 2026 · Círculo «mi ubicación» también acostado y en computadora · APROBADA (Miguel, 22 nov 2026, 4:09 pm)
- **Pedido (Miguel, 22 nov 2026, 3:39 pm):** a la pregunta de D-61 (lección 14) «¿el
  círculo de ubicación también acostado y en computadora?», respondió «en los tres».
- **Maqueta (D-54):** `docs/maquetas/d62/maqueta.html` (parte de la de D-61). El zoom no
  se mueve de donde lo dejaron D-58 y D-60 (lo aprobado no se toca). Computadora: el
  círculo va arriba del zoom, 10 px de espacio (columna, como en parado). Acostado: va
  a la izquierda del zoom, alineado con su parte de abajo, 10 px de espacio. Parado:
  como D-61.
- **Por qué acostado va al lado y no arriba (medido):** a 844 × 212 el zoom empieza en
  y = 90 y el botón de paradas termina en y = 62; el círculo arriba del zoom empezaría
  en y = 34 y se encimaría con el botón de paradas.
- **Medido** (`docs/maquetas/d62/capturas/`, con y sin ruta, a 390 × 844, 844 × 280,
  844 × 212 y 1280 × 800): el círculo no se encima con el zoom, el botón de paradas, el
  chip de la ruta ni el pie, y el zoom queda donde estaba.
- **Ajuste (Miguel, 22 nov 2026, 3:43 pm):** acostado, aprobado como se propuso. En
  computadora el zoom y el círculo van **arriba** a la derecha, primero «+ / −» y abajo
  el círculo (como en parado). Medido a 1280 × 800: el zoom empieza 12 px bajo la barra
  verde y el círculo 10 px bajo el zoom; no se enciman con el chip de la ruta. Esto
  cambia el lugar del zoom en computadora que había dejado D-58 (abajo), por pedido de
  Miguel. Maqueta y capturas actualizadas en `docs/maquetas/d62/`.
- **Decide:** Miguel.
- **Aprobada y construida (Miguel aprobó la maqueta ajustada a las 3:47 pm; construida
  a las 3:51 pm):** computadora, zoom y círculo arriba a la derecha (12 px bajo la barra
  verde, círculo 10 px bajo el zoom); acostado, el zoom donde lo dejó D-60 y el círculo
  a su izquierda, alineado abajo; parado, como D-61. Criterios escritos antes
  (`docs/evidencia/d62/criterios.md`); prueba `pruebas-navegador/d62.spec.mjs` (9 casos
  a 1280 × 800, 1024 × 768, 844 × 280, 844 × 212 y al girar); antes del cambio fallaban
  los 9. Las pruebas p6 y p7 de D-61 (acostado y computadora sin círculo) se
  reemplazan por estas. Inventario de selectores en
  `docs/evidencia/d62/inventario-selectores.md` (ningún selector desaparece).

## D-63 · 22 nov 2026 · Cierre de B2: D-58 a D-62 aprobados, PR 1 listo para integrarse a `main` (v0.2)
- **Aprobación (Miguel, 22 nov 2026, 4:09 pm):** «todo bien» al probar en su iPhone y
  en la computadora la vista previa del commit `262195f` (D-58 a D-62). Con eso se da
  por verificado en el iPhone el pellizco solo en el mapa (D-59), que estaba POR
  VERIFICAR.
- **Estado del PR 1** («B2 · Primera pantalla publicable → v0.2»,
  https://github.com/miguetdmz/sjdr-bus/pull/1), revisado a las 4:09 pm: en borrador,
  se puede integrar sin conflictos (CLEAN), `main` (`06efa8c`, v0.1) es ancestro de la
  rama y la única revisión obligatoria de `main` es «verificar».
- **Quién integra:** Miguel. Claude tiene negados `gh pr ready`, `gh pr merge`,
  `git merge` y el push a `main` (`.claude/settings.json`, lección 6).
- **Forma de integrar:** «Create a merge commit» (conserva cada commit con su Bloque ·
  Tarea, como el historial archivado de `main`).
- **Después:** Claude verifica `main` y https://sjdrbus-sjr.vercel.app con evidencia y
  marca v0.2 en PLAN. Siguiente: «el tema del PDF» (FALTANTE: Miguel dice cuál es).
- **Resultado (verificado a las 4:18 pm):** Miguel integró el PR 1 a `main` el 22 nov
  2026 a las 4:15 pm (commit de integración `9b8fca8`; `41af79c` está en `main`).
  GitHub Actions «verificar» y Vercel en verde con `9b8fca8`.
  https://sjdrbus-sjr.vercel.app sirve 39 rutas, el zoom arriba a la derecha y el
  círculo «mi ubicación» a 390 y 1280 px (`docs/evidencia/v0.2/`). **B2 cerrado:
  v0.2 publicada.** El título del commit de integración quedó como el de GitHub
  («Merge pull request #1…») y «B2 · Primera pantalla publicable → v0.2» en su cuerpo.

## D-64 · 22 nov 2026 · «El tema del PDF» era la propuesta de Flotilla SJR: proyecto aparte, en pausa
- **Qué era:** Miguel no recordaba a qué se refería (8:39 pm). Pista en los chats del
  20 nov: a las 11:07 pm, en el chat de D-55, dijo «si te apruebo, pues entonces
  pasamos al tema del PDF»; a esas horas otro chat armaba el PDF de venta de
  **Flotilla SJR** (bitácora de camiones para dueños) para una reunión con un dueño de
  dos camiones. Miguel lo confirmó (9:02 pm): «Sí, es ese PDF».
- **Estado del PDF:** terminado (11 páginas, horizontal, del 21 nov). Vive solo en la
  computadora de Miguel, fuera del repositorio: trae sus datos de contacto
  (`standards.md` regla 7) y es otro producto (regla 4).
- **Decisión (Miguel, 9:03 pm):** el PDF está listo; lo presenta la semana próxima. Si
  hay retroalimentación, avisa para decidir si se construye (en un proyecto aparte,
  nunca en este repositorio). Mientras, se sigue con SJDR Bus: D-56 fase 2.
- **Cierra:** el FALTANTE «el tema del PDF» de D-63 y de `docs/PLAN.md`.
