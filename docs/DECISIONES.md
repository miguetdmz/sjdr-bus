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

## D-50 · 20 nov 2026 · Selector visual de rutas: tarjetas con camioncito y número · PROPUESTA
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
- **Ver la ruta aproximada desde ya:** el trazo llega con R-06 (B3). Antes, lo
  honesto es mostrar origen y destino como zona probable (D-46). Se decide con
  este bloque.
- **Decide:** Miguel, en el chat siguiente (contexto de este chat al 31 %).

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
