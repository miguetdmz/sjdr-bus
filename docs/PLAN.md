# PLAN · Construcción de SJDR Bus

Estado: v2 · 17 nov 2026
Referencias: `docs/HANDOFF.md` (contrato de origen) y `docs/DECISIONES.md`
(manda sobre el HANDOFF).

## Estado actual (19 nov 2026, 9:05 pm)

| Bloque | Qué es | Estado |
|---|---|---|
| B0 | Estructura, documentos, puerta de calidad y repositorio | Cerrado. Repositorio **público** `miguetdmz/sjdr-bus` (D-29), con candado en `main` |
| B1 | Datos base del GTFS-SJR | **7 de 7.** Desde D-36/D-39/D-40 son **39 rutas** (37 urbanas + 2 intermunicipales): de baja 031, 024C y 018; la 044 volvió |
| B2a | Mockup navegable (PWA, Vite + Leaflet) | **4 de 8** en línea. M-05 a M-08 APROBADA: las toma el turno del 19 nov, 11:30 pm |
| B2 | Primera pantalla publicable | Estilo D-30 **aplicado** (E-01) y menú lateral en computadora (E-02), EN REVISIÓN en el PR |
| B3 | Trazos de las rutas (lote R, D-24) | R-01 y R-02 hechas. **R-03 a medias:** extremos listos (32 de 35 con punto, 21 de Miguel, 3 FALTANTES por D-41); falta la **secuencia de puntos por sentido**. R-04 a R-06 esperan R-03 |
| B4 | Estimador por parada y autobús animado | Sin iniciar |
| B5 | Participa: botón de reporte (D-22, sin GPS) | Sin iniciar. Con D-41 es el canal para completar faltantes |
| B6 | Calcula tu ruta (D-15) | Sin iniciar |

Nombre visible: **SJDR Bus** (D-28). Hosting: Vercel Hobby, $0 (D-26).

### Relevo para la siguiente sesión (19 nov 2026, 9:05 pm)

1. **Lo hecho hoy en R-03 (D-32 a D-41):** consulta de calles de OSM
   (`datos/cache/overpass/calles.json`), lugares de OSM, página de extremos y
   las respuestas de Miguel en `datos/investigacion/extremos-decisiones.json`.
   `scripts/extremos-finales.mjs` arma `extremos-finales.json`: 35 lugares, 32
   con punto, 3 FALTANTES (Manantiales / Nogales, Valle Dorado II, Ezequiel
   Montes).
2. **Siguiente paso de R-03 (sesión de día, chat nuevo):** la secuencia de
   puntos de paso por sentido desde las listas de R-01 y los extremos finales.
   Hallazgos a resolver: la separación automática de cruces es parcial (22 de
   49 en la 001), las listas traen negocios, e ida y vuelta vienen en una sola
   lista. Las 21 listas mezcladas con Querétaro no se usan (D-33).
3. **Herramientas de extremos:** página local con mapa normal
   (`npm run dev` → `/confirmar-extremos.html`, guarda en el archivo, D-38) y
   artifact privado de Miguel (solo calles; su base guarda las mismas
   respuestas). El archivo del repositorio es la fuente.
4. **D-41:** se lanza con faltantes visibles; lo que falte se completa con la
   retroalimentación de la gente. Proponer en su momento el canal de reporte
   (B5); no construirlo sin aprobación.
5. **Turno del 19 nov, 11:30 pm** (`noche/2026-11-20`): sale de
   `cierre/2026-11-19-publico` y toma **solo M-05 a M-08** con el estilo D-30.
   Lo que no esté subido a GitHub antes de las 11:30 pm, el turno no lo ve.
6. **Pendientes de Miguel (sin cambio):** regla 2 de la cola (tarea BLOQUEADA
   con dependientes); `lightningcss` y Node 24 (PR 5); solicitud de
   transparencia (D-23); borrar 2 implementaciones viejas de Vercel con el
   slug del correo después de integrar el PR (con su permiso).
7. Si una corrida falla: RemoteTrigger `list_runs`/`get_run_log` de
   `trig_01TQ5dA2RtFfQaYGVmwgvYJY` (turno) y `trig_01F8RbVpgf3NtuUeMe63nZa7`
   (inspector).

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
