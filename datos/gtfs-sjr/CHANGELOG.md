# Registro de cambios del GTFS-SJR

Formato por versión: fecha (hora de México) · qué cambió · fuente · autor.

## Sin versión publicada

- 16 nov 2026 · Se crea la carpeta. Sin datos todavía · Claude.
- 17 nov 2026 · `routes.txt` con las 42 rutas del inventario, en su orden;
  claves `route_id` con prefijo `U-` / `I-` (D-08); agencia `SJR-CONC` ·
  fuente: listado oficial de rutas (qrobus.gob.mx/Rutas) según HANDOFF §4 ·
  turno nocturno (Claude), tarea N-01.
- 17 nov 2026 · `agency.txt` (agencia `SJR-CONC`, «Concesionarios del
  transporte público de San Juan del Río (por verificar)»), `feed_info.txt`
  (versión 0.1.0, vigencia 17 nov 2026 a 16 nov 2027) y `calendar.txt`
  (servicio diario `DIARIO_POR_VERIFICAR`, el mismo periodo) · fuente: tarea
  N-05 aprobada por Miguel; operador y días de servicio **por verificar** ·
  turno nocturno (Claude).
- 17 nov 2026 · `datos/fichas/rutas.json`: ficha de estado de las 42 rutas
  (10 `verificada` según HANDOFF §5.1, 32 `solo-inventario` según §5.3),
  todas en nivel de precisión C · fuente: HANDOFF §4, §5.1 y §5.3 · turno
  nocturno (Claude), tarea N-05.
- 17 nov 2026 · `datos/fichas/rutas.json`: conteo de paradas, duración y
  horario **por sentido** (ida y vuelta) de las 10 rutas verificadas; sin
  frecuencia (no verificada); la 062 con horario «por verificar en campo» ·
  fuente: referencia Moovit, consulta nov 2026, según HANDOFF §5.1 (D-07);
  no es fuente oficial · turno nocturno (Claude), tarea N-06.
- 17 nov 2026 · Primer empaque del feed v0.1.0 (`npm run empaquetar`, ZIP
  en `dist/`, fuera de git) con 4 archivos: `agency.txt`, `calendar.txt`,
  `feed_info.txt` y `routes.txt`. El validador de MobilityData 8.0.1 marca
  3 errores `missing_required_file`: faltan `stops.txt`, `trips.txt` y
  `stop_times.txt`. **No se inventan:** esperan paradas con coordenada real
  (campo, OSM o AMEQ) y la decisión de Miguel · turno nocturno (Claude),
  tarea N-07.
- 17 nov 2026 · Vigencia del feed acortada a 6 meses: del 17 nov 2026 al 16
  may 2027 en `feed_info.txt` y `calendar.txt` · fuente: decisión de Miguel
  (D-17) · Claude.
- 17 nov 2026 · Segunda agencia `SJR-INTER`, «Operador intermunicipal QroVan
  (por verificar)», para `I-062` e `I-023`; las 40 urbanas siguen en
  `SJR-CONC` · fuente: HANDOFF §7 (AMEQ, mar 2025), **sin confirmar** con la
  AMEQ; decisión de Miguel (D-19) · Claude.
- 18 nov 2026 · `stops.txt` con 49 paradas de autobús que ya existían en
  OpenStreetMap dentro del municipio de San Juan del Río (nodos
  `highway=bus_stop` y `public_transport=platform` + `bus=yes`). Todas
  **POR VERIFICAR EN CAMPO**, sin asignar a rutas ni ordenar, con la
  coordenada tal cual viene de OSM. Una sola consulta a Overpass, guardada en
  `datos/cache/overpass/` (no se vuelve a pedir). El validador baja de 3 a 2
  errores conocidos: faltan `trips.txt` y `stop_times.txt` · fuente: ©
  colaboradores de OpenStreetMap (ODbL 1.0), consulta 18 nov 2026 · Claude,
  tarea N-08 (D-16).
- 19 nov 2026 · Se quitan de `routes.txt` y de `datos/fichas/rutas.json` las
  rutas 031 «Pedregoso – PITSA» (`U-031`) y 044 «Valle Dorado II – Centro»
  (`U-044`): ya no existen. Quedan 40 rutas (38 urbanas y 2 intermunicipales) ·
  fuente: Miguel, conocimiento local, 19 nov 2026 (D-36); la página oficial de
  Qrobús aún las listaba ese día · Claude.
