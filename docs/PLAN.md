# PLAN · Construcción de SJDR Bus

Estado: v2 · 17 nov 2026
Referencias: `docs/HANDOFF.md` (contrato de origen) y `docs/DECISIONES.md`
(manda sobre el HANDOFF).

## Estado actual (20 nov 2026, 1:44 pm)

**Dónde vamos (D-47: Bloque · Tarea · Versión)**

| Nivel | Hoy |
|---|---|
| Versión publicada (`main`, https://sjdrbus-sjr.vercel.app) | **v0.1**: foto inicial del 19 nov (`06efa8c`) |
| Versión en espera (PR 1, https://github.com/miguetdmz/sjdr-bus/pull/1) | **v0.2**: 39 rutas, mockup navegable, estilo D-30, nombre SJDR Bus. Integra Miguel después de verla en su teléfono |
| Bloque en curso | **B3 · Trazos de las rutas** |
| Tarea en curso | **R-03 · Cruces de calles**: 698 de 936 con punto exacto (75 %); 20 POR VERIFICAR |

| Bloque | Qué es | Estado |
|---|---|---|
| B0 | Estructura, documentos, puerta de calidad y repositorio | Cerrado. Repositorio **público** `miguetdmz/sjdr-bus` (D-29), con candado en `main` |
| B1 | Datos base del GTFS-SJR | **7 de 7.** Desde D-36/D-39/D-40 son **39 rutas** (37 urbanas + 2 intermunicipales): de baja 031, 024C y 018; la 044 volvió |
| B2a | Mockup navegable (PWA, Vite + Leaflet) | **8 de 8.** M-05 a M-08 hechas por el turno (PR 2, inspector: **LIBERADO**, 20 nov 2026, 12:17 am). Falta integrarlo y verlo en el teléfono |
| B2 | Primera pantalla publicable | Estilo D-30 **aplicado** (E-01) y menú lateral en computadora (E-02), EN REVISIÓN en el PR |
| B3 | Trazos de las rutas (lote R, D-24) | R-01 y R-02 hechas. **R-03 a medias:** extremos listos (32 de 35, 3 FALTANTES por D-41). **Hallazgo a resuelto (D-42, D-43):** cruces de 18 listas separados y ubicados (la 023 trae solo un bloque de lugares: la página la mezclaba con la 23): 698 de 936 con punto exacto (75 %), **27 APROXIMADOS (3 %, D-45: ESTIMADO, nivel C)**, 191 referencias (20 %), 20 POR VERIFICAR (2 %) al 20 nov, 1:05 pm. **D-46 PROPUESTA:** extremos como zona probable (mapa de calor). Faltan los hallazgos b y c y la **secuencia por sentido**. R-04 a R-06 esperan R-03 |
| B4 | Estimador por parada y autobús animado | Sin iniciar |
| B5 | Participa: botón de reporte (D-22, sin GPS) | Sin iniciar. **Idea aprobada (D-41):** canal «esto está mal / esto falta» para completar faltantes; diseño a presentar antes de construir |
| B6 | Calcula tu ruta (D-15) | Sin iniciar |

Nombre visible: **SJDR Bus** (D-28). Hosting: Vercel Hobby, $0 (D-26).

### Relevo para la siguiente sesión (20 nov 2026, 1:05 pm)

0. **Lo hecho de las 8:08 am a la 1:05 pm del 20 nov (R-03, D-43, D-45):**
   - Alias de Miguel: Carretera Querétaro 300 = Panamericana; El Cerezo = CERESO
     = Acceso a Visthá; Car. Estatal 122 = Acceso a Visthá. Amealco × Lázaro
     Cárdenas: Miguel no lo sabe (queda POR VERIFICAR).
   - Con evidencia: calle compartida entre dos guiones (022, Jurica × San Juan
     del Río); «MÉXICO 120» = Federal 120, sigue como Av. Central; «CAR.» =
     Carretera; lista-circuito anclada en su origen (032).
   - **Defecto corregido:** 032 #2 y #3 eran UBICADOS falsos a 5 km de Visthá.
   - D-46 PROPUESTA (Miguel): extremos como zona probable; se decide al diseñar
     la pantalla del trazo.
   - POR VERIFICAR: de 27 a 20. Pruebas: 130 de 130.
1. **Siguiente en R-03, los 20 que quedan:** Manantiales (042 #3, 046 #36, #38,
   #54: preguntar qué es «Manantial de Manantiales»); Venustiano Carranza en
   Visthá (032 #2, #53) y San Nicolás × Cerezo (032 #6); La Tota Carbajal –
   Maquío (011B, 015B: ¿unidad deportiva sobre Av. Universidad?); Amealco (002
   #34, #48, #49: Miguel no sabe; campo); sueltos (Paseo del Molino 016/030, San
   Juan del Río × 3 Lagunas 011/011B, La Palma × Chabacano, «49 Norte. 4», «19
   Del Abedul», Plaza Los Olivos). Después: hallazgo b (negocios) y hallazgo c
   (separar ida y vuelta; regla 10), cada uno con criterio medible.
2. **Bandera:** EN SESIÓN. La cola no tiene tareas APROBADA que el turno pueda
   hacer.

### Relevo anterior (20 nov 2026, 8:08 am)

0. **Lo hecho en la sesión de las 7:42 a las 8:08 am del 20 nov (R-03):**
   - Arreglos con evidencia (D-43): salto que crece 300 m por cruce sin ubicar
     en medio (009B: Constituyentes × Santa Fe); primera calle escrita dos
     veces (008, 011, 011B); «3O» = 3º (022); errata dentro de un nombre
     completo de OSM (015B). POR VERIFICAR: de 59 a 53.
   - **D-45 aprobada y aplicada** (Miguel, 8:03 am): estado APROXIMADO,
     ESTIMADO, nivel C, con método (cercanía, numeración, entre vecinos, mismo
     texto). POR VERIFICAR: de 53 a 27, cada uno con su razón. Google Maps no
     se usa como fuente (licencia ODbL).
   - Pruebas: 125 de 125.
1. **Siguiente en R-03:** los 27 POR VERIFICAR que quedan (la nota de cada uno
   dice por qué; candidatos de alias para Miguel: Carretera Querétaro 300,
   «MÉXICO 120 – BENITO JUÁREZ», La Tota Carbajal – Unidad Deportiva Maquío).
   Después: hallazgo b (negocios) y hallazgo c (separar ida y vuelta; regla 10;
   pistas: Paracaima/Tezonco y el salto de 4 km de la 046 #38), cada uno con su
   criterio de aceptación medible antes de construir.
2. **Bandera:** queda en EN SESIÓN. La cola no tiene tareas APROBADA que el
   turno pueda hacer.

### Relevo anterior (20 nov 2026, 2:40 am)

0. **Lo hecho en la sesión de la 1:56 a las 2:40 am del 20 nov (R-03, D-43):**
   - 046 = 008: un pedazo repetido idéntico (la misma parada en ida y vuelta)
     ya no vuelve dudoso el corte (10 cruces nuevos con punto).
   - Lista mezclada 23/023 (decisión de Miguel): la 23 se queda con las calles
     de Lomas del Pedregal; la 023, con el bloque de lugares, sin cruces y POR
     VERIFICAR. Candado: si la página cambia, `npm run cruces` se detiene.
   - Federal 120 = San Juan del Río - Xilitla (4 cruces a REFERENCIA); Walmart
     del km 3.2 = una parada sobre el Paseo Central (tabla `UNIDOS_MIGUEL`);
     Universidad – Cto. Querétaro Norte se tocan (tolerancia por par).
   - Matamoros sigue como Fundadores: la continuación se prueba dentro del
     corredor, y la misma calle de la lista va por la misma calle de OSM.
     «Mismo texto, distinto punto»: de 4 casos a 2.
   - Lección 7: 3.ª ocurrencia → **PROMOVIDA** al hook `hora-real`
     (`.claude/hooks/hora-real.mjs`), verde en la Mac y en GitHub Actions.
   - POR VERIFICAR: de 85 a 59. Pruebas: 122 de 122.
1. **Siguiente en R-03 (Pareto de los 59):** Constituyentes con Calle Norte 5,
   Norte 3 y Calle 9 (12; OSM no las tiene junto a la avenida: no se
   interpolan, D-41); Corregidora × San José (3; la San José de OSM está a 8.5
   km); Manantiales de Agua Azul × Manantiales de Tlacote (3; a 116 m en OSM);
   Paseo Loma Alta (2); Av. Central × Tres Lagunas (2); Universidad × La
   Esmeralda (2; a 234 m); Universidad «La Tota» Carbajal – Unidad Deportiva
   Maquío (2). Quedan 2 casos de «mismo texto, distinto punto»: Romero Soto
   (10 m) y Hacienda Los Arrayanes – Piedras Negras (022 y 039, a 330 m).
   Después: hallazgo b (negocios) y hallazgo c (separar ida y vuelta; regla
   10; pistas: laterales Paracaima/Tezonco), cada uno con criterio medible.
2. **Bandera:** queda en EN SESIÓN. La cola no tiene tareas APROBADA que el
   turno pueda hacer (R-04 es de sesión de día; R-05 y R-06 esperan a R-03).

### Relevo de la madrugada (20 nov 2026, 1:02 am)

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
