# PLAN · Construcción de SJDRbus

Estado: v2 · 17 nov 2026
Referencias: `docs/HANDOFF.md` (contrato de origen) y `docs/DECISIONES.md`
(manda sobre el HANDOFF).

## Estado actual (19 nov 2026, 2:00 am)

| Bloque | Qué es | Estado |
|---|---|---|
| B0 | Estructura, documentos, puerta de calidad y repositorio | Cerrado el 16 nov 2026. Repositorio **privado** en GitHub (`miguetdmz/sjdrbus-sjr`); público cuando se decida D-02 |
| B1 | Datos base del GTFS-SJR | **7 de 7 tareas hechas.** N-08 integrada con el #7 (49 paradas de OSM, POR VERIFICAR). El validador quedó en 2 errores conocidos (faltan viajes y horas de paso; no se inventan), así que «pasa el validador sin errores» **todavía no** se cumple |
| B2a | Mockup navegable (PWA, Vite + Leaflet) | **4 de 8 integradas** (M-01 a M-04). M-05 a M-08 APROBADA: las toma el turno del 19 nov, 11:30 pm |
| B2 | Primera pantalla publicable | Sin iniciar |
| B3 | Trazos de las rutas (lote R, D-24) | **R-01 y R-02 integradas** (#8). R-03 BLOQUEADA (espera decisión de Miguel); R-04 en otro chat de día; R-05 y R-06 dependen de R-03 |
| B4 | Estimador por parada y autobús animado | Sin iniciar |
| B5 | Participa: botón de reporte (D-22, sin GPS) | Sin iniciar |
| B6 | Calcula tu ruta (D-15) | Sin iniciar. Depende de las paradas de cada ruta en orden |

PR: #3, #4, #5, #7 y #8 integrados a `main` por Miguel el 19 nov 2026 (el #8
a la 1:54 am, con R-01, R-02, I-04 y D-25); el #6 quedó cerrado. Abierto:
**#9** (`cierre/2026-11-19-b`, borrador) con la lección 8 y su prueba.

### Relevo para la siguiente sesión (19 nov 2026, 2:00 am)

1. **Turno del 19 nov, 11:30 pm** (`noche/2026-11-20`): sale de la rama del
   PR abierto más reciente (hoy `cierre/2026-11-19-b`; si se integra, de
   `main`) y toma **solo M-05 a M-08**. R-03 está BLOQUEADA y el turno no la
   toma. La sesión del día rehace el relevo antes de las 11:30 pm si cambia algo.
2. **Integrar (Miguel, en GitHub):** el #9 cuando lo revise. Pasos: «Ready
   for review» → «Merge pull request» con **Create a merge commit** →
   «Delete branch». Claude no puede integrar (lección 6).
   **Lección 8 (19 nov 2026):** una página descargada traía una llave de
   sesión; ahora `scripts/reglas.mjs` lo rechaza.
3. **Lote R, lo hecho el 19 nov (sesión de 1:15 a 1:50 am):**
   - D-25: Miguel decidió usar **solo las calles visibles** de la página
     oficial, no su trazo interno.
   - R-01: 42 de 42 rutas con lista; **21 marcadas REVISAR** porque mezclan
     calles de la ciudad de Querétaro (son justo los 21 renglones viejos de la
     página, identificador interno 1 a 36). La página trae una llave de sesión:
     la copia completa se quedó en `referencias/`, fuera de git.
   - R-02: 40 lugares; 12 con coordenada (9 de HANDOFF §11.3 y 3 de
     Nominatim, POR VERIFICAR) y **28 sin coordenada**. Nominatim volvió a
     dar la Central de Cadereyta y la «Universidad Tecnológica Bridge»; el
     filtro las rechazó (lección 4).
   - I-04: Overpass respondió al único reintento; 16 relaciones, 14 con
     número del inventario. No suben la confianza porque no dicen el sentido.
4. **Preguntas abiertas para destrabar R-03 (Miguel, una a la vez):**
   a) ¿Se aprueba una consulta a Overpass con los **nombres de calles** de San
      Juan para separar cada cruce de las listas? Es una consulta de sesión de
      día, gratis y en caché.
   b) ¿Qué hacer con las 21 listas mezcladas? Por ejemplo, usar solo sus
      cruces escritos al estilo de San Juan («CALLE-CRUCE»), o tomarlas de las
      relaciones de OSM.
   c) ¿Cómo se ubican los 28 extremos sin coordenada? Empezando por la Central
      de Autobuses: Blvd. Hidalgo #4, según HANDOFF §11.3. Nada se corrige a ojo.
5. **R-04 (OSRM)** va en otro chat de día y necesita R-03.
6. **Desvío del turno del 18 nov (para que Miguel decida):** con N-08
   BLOQUEADA, el turno saltó a M-01 a M-04. Propuesta: aclarar la regla 2 de
   la cola así: «una tarea BLOQUEADA se salta solo si las siguientes no
   dependen de ella; si una depende, el turno se detiene ahí».
7. **Preguntas que venían del PR 5** (sin confirmar): aceptar `lightningcss`
   (MPL-2.0, pieza indirecta de Vite) como aviso; `package.json` pide Node 24
   y la nube del turno trae Node 22 (pasa igual).
8. **Tarea abierta de Miguel:** la solicitud de transparencia del estudio
   técnico de dic 2022 (D-23: se hará, todavía no).
9. **Consumo del plan:** medido al hacer este relevo (19 nov 2026, 1:50 am):
   semanal 42 % (se renueva el 21 nov, 10:00 am), ventana de 5 horas 72 %.
   Medir otra vez en la mañana; la diferencia es lo que gastó el turno + el
   inspector.
10. **Idea para la versión de producción (Miguel, 19 nov 2026; sin decidir):**
    ver los recorridos en 3D sobre el mapa que se desarrolla en otro proyecto
    («Taín y San Juan del Río», nombre [sin verificar]). Esta versión se queda
    plana: Leaflet + OpenStreetMap (D-04, regla 6). Los trazos del GTFS-SJR no
    dependen del mapa de fondo, así que después se pueden dibujar sobre otro
    sin rehacerlos. Antes de producción se evalúa con su propia decisión:
    licencia y origen de ese mapa, costo de servirlo ($0 o aviso), peso en el
    teléfono y que los proyectos sigan separados.
11. Pendiente de Miguel: D-02 (nombre visible); hacer público el repositorio
    cuando lo decida.
12. Si una corrida falla, revisar su registro con RemoteTrigger (`list_runs`
    y `get_run_log`) de `trig_01TQ5dA2RtFfQaYGVmwgvYJY` (turno) y
    `trig_01F8RbVpgf3NtuUeMe63nZa7` (inspector).

## Bloques

Cada bloque: un chat nuevo, criterio de aceptación escrito antes de empezar,
verificación en ancho de teléfono y aprobación de Miguel antes del siguiente.

### B0 · Estructura y repositorio
- `CLAUDE.md`, `README.md`, `CONTRIBUTING.md`, licencias, plantillas de
  GitHub.
- `docs/`: HANDOFF, DECISIONES, PLAN, REVISION-HANDOFF, COLA-NOCTURNA,
  LICENCIAS.
- Puerta de calidad: `scripts/reglas.mjs`, `scripts/verificar.sh`,
  `.githooks/pre-push`, GitHub Actions.
- Permisos de Claude para trabajo autónomo (`.claude/settings.json`).
- **Aceptación:** `npm run verificar` en verde; `referencias/` fuera de git;
  ningún archivo del repositorio usa la marca Qrobús como nombre.

### B1 · Datos base del GTFS-SJR
- `routes.txt` con las 42 rutas del inventario (D-08 para las claves).
- Ficha de estado por ruta: grupo, nivel por tramo, fuente y fecha.
- Las 10 fichas verificadas, por sentido, con la fuente de cada cifra.
- Prueba automática: cada sentido usa sus propios datos (lección 2).
- Validador de MobilityData en la puerta de calidad.
- **Aceptación:** el feed pasa el validador sin errores; `routes.txt` tiene
  exactamente 42 rutas; cada archivo declara fuente y fecha.

### B2 · Primera pantalla publicable
- Vite + TypeScript + Leaflet (D-04), fuentes locales, sin Google.
- Mapa real a pantalla completa + desplegable de 42 rutas generado desde los
  datos + control de sentido segmentado.
- Vista «en verificación» para las rutas sin ficha.
- **Aceptación:** los 5 criterios de HANDOFF §11.8, comprobados con pruebas en
  navegador a 390 px y en el teléfono de Miguel.

### B3 · Trazos nivel B de las rutas piloto
- Procedimiento HANDOFF §11.5 con OSRM, una ruta a la vez, con caché.
- Revisión visual tramo por tramo; nivel registrado por tramo.
- **Aceptación:** cada ruta piloto muestra su recorrido completo con etiqueta
  de nivel; ningún tramo C como línea continua.

### B4 · Estimador y autobús animado
- Rutina HANDOFF §5.2 con etiqueta ESTIMADO y fórmula a un toque.
- Autobús SVG monocromo sobre el trazo guardado.
- **Aceptación:** ningún tiempo sin etiqueta de tipo y fuente; sin espera
  calculada donde no hay frecuencia verificada.

### B5 · Participa
- Protocolo y subida de recorridos GPX; reporte «este tiempo no fue preciso».

### B6 · Calcula tu ruta (D-15; lugar en el plan: PROPUESTA)
- La persona elige origen y destino; la app propone la ruta directa o la
  combinación de rutas con su transbordo, calculada en el teléfono sobre el
  GTFS-SJR (sin servidor ni servicios en vivo).
- Necesita las paradas de cada ruta en orden y por sentido.
- **Aceptación (borrador):** cada resultado dice ESTIMADO, muestra el nivel
  de precisión más bajo de las rutas que usa y no calcula espera donde no
  hay frecuencia verificada; si no hay datos para un trayecto, lo dice en
  lugar de suponerlo.

## Carril de Miguel (sin código)
- Elegir nombre visible, licencias, rutas piloto y uso de Moovit.
- Solicitud de transparencia a la AMEQ (Claude la redacta; Miguel firma).
- Reclutar voluntarios o grabar las primeras rutas con GPS (Fase 2 del
  HANDOFF).
