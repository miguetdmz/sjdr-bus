# PLAN · Construcción de SJDR Bus

Estado: v2 · 17 nov 2026
Referencias: `docs/HANDOFF.md` (contrato de origen) y `docs/DECISIONES.md`
(manda sobre el HANDOFF).

## Estado actual (20 nov 2026, 1:02 am)

| Bloque | Qué es | Estado |
|---|---|---|
| B0 | Estructura, documentos, puerta de calidad y repositorio | Cerrado. Repositorio **público** `miguetdmz/sjdr-bus` (D-29), con candado en `main` |
| B1 | Datos base del GTFS-SJR | **7 de 7.** Desde D-36/D-39/D-40 son **39 rutas** (37 urbanas + 2 intermunicipales): de baja 031, 024C y 018; la 044 volvió |
| B2a | Mockup navegable (PWA, Vite + Leaflet) | **8 de 8.** M-05 a M-08 hechas por el turno (PR 2, inspector: **LIBERADO**, 20 nov 2026, 12:17 am). Falta integrarlo y verlo en el teléfono |
| B2 | Primera pantalla publicable | Estilo D-30 **aplicado** (E-01) y menú lateral en computadora (E-02), EN REVISIÓN en el PR |
| B3 | Trazos de las rutas (lote R, D-24) | R-01 y R-02 hechas. **R-03 a medias:** extremos listos (32 de 35, 3 FALTANTES por D-41). **Hallazgo a resuelto (D-42, D-43):** cruces de las 19 listas usables separados y ubicados: 670 de 974 con punto (69 %), 116 POR VERIFICAR (12 %) al 20 nov, 1:00 am. Faltan los hallazgos b y c y la **secuencia por sentido**. R-04 a R-06 esperan R-03 |
| B4 | Estimador por parada y autobús animado | Sin iniciar |
| B5 | Participa: botón de reporte (D-22, sin GPS) | Sin iniciar. **Idea aprobada (D-41):** canal «esto está mal / esto falta» para completar faltantes; diseño a presentar antes de construir |
| B6 | Calcula tu ruta (D-15) | Sin iniciar |

Nombre visible: **SJDR Bus** (D-28). Hosting: Vercel Hobby, $0 (D-26).

### Relevo para la siguiente sesión (20 nov 2026, 1:02 am)

0. **Lo hecho en la sesión de la madrugada del 20 nov:** turno M-05 a M-08
   LIBERADO (PR 2); D-44 aprobada y aplicada (relevo por bandera,
   `docs/RELEVO.md` en EN SESIÓN; rutinas cambiadas); R-03: alias Jurica =
   Belisario Domínguez, continuación Río Moctezuma → Gral. Francisco Villa,
   Sagitario = negocio, «1» = «Uno», «SIN REFERENCIA» y «MONUMENTO»
   limpiados. POR VERIFICAR: de 166 a 116. **Siguiente Pareto:** Calle
   Constituyentes (8, con «Av. 9 Poniente» y «Calle 5 Poniente»), Uruguay (8,
   todas en la 015B con Veracruz y Francia), Av. Lomas de San Juan (6), 20 de
   Noviembre (6), La Palma (5).

### Relevo anterior (19 nov 2026, 10:55 pm)

1. **Lo hecho hoy en R-03, hallazgo a (D-42, D-43):** `scripts/cruces.mjs`
   (`npm run cruces`) separa y ubica los cruces de las 19 listas usables con
   las calles de OSM → `datos/investigacion/cruces.json`. Toda corrección
   (abreviatura, errata, continuación con otro nombre, alias) se acepta solo si
   las dos calles se tocan en OSM dentro del corredor de la ruta. Resultado:
   629 de 974 cruces con punto (65 %), 179 referencias de calle (18 %), 166 POR
   VERIFICAR (17 %). Prueba: `scripts/pruebas/cruces.test.mjs`.
2. **Regla de Miguel (D-42):** arreglar el dato con evidencia antes de marcar
   POR VERIFICAR; meta, el mejor MVP para mostrar a dueños de camiones.
3. **Alias de Miguel (D-43, tabla `ALIAS_MIGUEL`):** Paseo Central = Avenida
   Central; Independencia = Avenida Juárez (Jardín Independencia); Carr. San
   Juan del Río (en la ciudad) = Avenida Central.
4. **Siguiente paso de R-03 (sesión de día, chat nuevo):** seguir el Pareto de
   lo POR VERIFICAR con Miguel, una pregunta a la vez. Los que siguen: «Jurica»
   (≈36 cruces: con Benito Juárez Oriente, Carr. San Juan del Río y Monumento a
   Benito Juárez), «Av. 1 Poniente», «Sagitario» (con C. Miguel Hidalgo). Luego
   hallazgo b (negocios) y hallazgo c (separar ida y vuelta; regla 10).
5. **Pendiente de decidir: relevo por bandera** (propuesto el 19 nov 2026,
   10:45 pm, sin aprobar): Miguel quiere trabajar sin hora fija de cierre y que
   el turno arranque cuando él termine. Propuesta: `docs/RELEVO.md` con «EN
   SESIÓN» / «ENTREGADO»; la rutina revisa cada hora de 11:30 pm a 3:30 am y
   solo arranca con «ENTREGADO»; al cerrar, la sesión del día sube todo, marca
   ENTREGADO y dispara el turno. No cambia nada hasta que Miguel lo apruebe.
   **20 nov 2026, 12:27 am: APROBADO (D-44, VIGENTE).** Bandera en
   `docs/RELEVO.md`; rutinas cambiadas a las 12:30 am: turno cada hora de
   11:39 pm a 3:39 am (solo con ENTREGADO) e inspector cada hora de 12:15 a
   5:15 am (solo con TURNO TERMINADO). **Al cerrar cada sesión de día:** marcar
   ENTREGADO en el último commit, subir y disparar el turno.
6. **Turno del 19 nov, 11:30 pm** (`noche/2026-11-20`): sale de
   `cierre/2026-11-19-publico` y toma **solo M-05 a M-08** con el estilo D-30.
   R-03 no está en la cola. El inspector revisa a las 5:15 am.
7. **Pendientes de Miguel (sin cambio):** regla 2 de la cola (tarea BLOQUEADA
   con dependientes); `lightningcss` y Node 24 (PR 5); solicitud de
   transparencia (D-23); borrar 2 implementaciones viejas de Vercel con el
   slug del correo después de integrar el PR (con su permiso).
8. Si una corrida falla: RemoteTrigger `list_runs`/`get_run_log` de
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
