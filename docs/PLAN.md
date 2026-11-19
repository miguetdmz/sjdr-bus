# PLAN · Construcción de SJDR Bus

Estado: v2 · 17 nov 2026
Referencias: `docs/HANDOFF.md` (contrato de origen) y `docs/DECISIONES.md`
(manda sobre el HANDOFF).

## Estado actual (19 nov 2026, 1:20 pm)

| Bloque | Qué es | Estado |
|---|---|---|
| B0 | Estructura, documentos, puerta de calidad y repositorio | Cerrado. Desde el 19 nov 2026 el repositorio es **público**: `miguetdmz/sjdr-bus` (D-29), con candado en `main` (solo entra un PR con la puerta en verde). El anterior, `miguetdmz/sjdrbus-sjr`, queda **privado** como archivo con su historial y los PR #1 a #9 |
| B1 | Datos base del GTFS-SJR | **7 de 7 tareas hechas.** 49 paradas de OSM, POR VERIFICAR. El validador quedó en 2 errores conocidos (faltan viajes y horas de paso; no se inventan) |
| B2a | Mockup navegable (PWA, Vite + Leaflet) | **4 de 8.** M-01 a M-04 hechas y **en línea** en https://sjdrbus-sjr.vercel.app (D-26, D-27). M-05 a M-08 APROBADA: las toma el turno del 19 nov, 11:30 pm |
| B2 | Primera pantalla publicable | **Estilo aprobado** (D-30): la muestra patrón `web/muestra-patron.html`. Falta la tarea que lo aplica a la app |
| B3 | Trazos de las rutas (lote R, D-24) | R-01 y R-02 hechas. R-03 BLOQUEADA (3 preguntas para Miguel); R-04 en otro chat de día; R-05 y R-06 dependen de R-03 |
| B4 | Estimador por parada y autobús animado | Sin iniciar |
| B5 | Participa: botón de reporte (D-22, sin GPS) | Sin iniciar |
| B6 | Calcula tu ruta (D-15) | Sin iniciar |

Nombre visible: **SJDR Bus** (D-28). Hosting: Vercel Hobby, $0 (D-26).

### Relevo para la siguiente sesión (19 nov 2026, 1:20 pm)

**Nuevo · estilo visual aprobado (D-30, 19 nov 2026, 1:15 pm).** Miguel
aprobó la muestra patrón (`web/muestra-patron.html`; se ve con `npm run dev` en
`/muestra-patron.html`). Siguiente paso: escribir la tarea que aplica el
estilo a la app y que Miguel decida si va al turno nocturno. El turno del
19 nov no rediseña nada; solo M-07 usa la paleta en el ícono.

1. **Turno del 19 nov, 11:30 pm** (`noche/2026-11-20`): ya apunta al
   repositorio nuevo `miguetdmz/sjdr-bus`. Sale del PR abierto más reciente
   (`cierre/2026-11-19-publico`) y toma **solo M-05 a M-08**. M-07 usa el
   nombre «SJDR Bus». R-03 sigue BLOQUEADA.
2. **Cómo se publica desde ahora (D-26, D-29):** cada PR crea una vista
   previa en Vercel; al integrarlo a `main`, la app pública se actualiza sola.
   `main` tiene candado: si la puerta de calidad no pasa, GitHub no deja
   integrar (también a Miguel). Integrar sigue siendo solo de Miguel
   (lección 6).
3. **Sin comprobar:** que la nube de los turnos tenga acceso al repositorio
   nuevo (la corrida de prueba del inspector la negó el modo automático). Se
   sabrá a las 11:39 pm; si el turno falla al clonar, Miguel da acceso a la
   app de Claude en GitHub (Settings → Applications → Claude → sjdr-bus).
4. **Preguntas abiertas para destrabar R-03 (Miguel, una a la vez):**
   a) ¿Se aprueba una consulta a Overpass con los **nombres de calles** de San
      Juan para separar cada cruce de las listas? Gratis y en caché.
   b) ¿Qué hacer con las 21 listas que mezclan calles de Querétaro?
   c) ¿Cómo se ubican los 28 extremos sin coordenada, empezando por la
      Central de Autobuses (Blvd. Hidalgo #4, HANDOFF §11.3)?
5. **R-04 (OSRM)** va en otro chat de día y necesita R-03.
6. **Desvío del turno del 18 nov (para que Miguel decida):** aclarar la regla
   2 de la cola: «una tarea BLOQUEADA se salta solo si las siguientes no
   dependen de ella; si una depende, el turno se detiene ahí».
7. **Preguntas que venían del PR 5** (sin confirmar): aceptar `lightningcss`
   (MPL-2.0, pieza indirecta de Vite) como aviso; Node 24 en `package.json`.
8. **Tarea abierta de Miguel:** la solicitud de transparencia del estudio
   técnico de dic 2022 (D-23).
9. **Idea para la versión de producción (sin decidir):** recorridos en 3D
   sobre el mapa de otro proyecto. Esta versión se queda plana (Leaflet +
   OpenStreetMap, D-04, regla 6).
10. Si una corrida falla, revisar su registro con RemoteTrigger (`list_runs`
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
