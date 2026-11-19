# HANDOFF · Contrato de origen

> **Origen.** Este documento pasa a Markdown el handoff que se escribió en la práctica
> (practicante del proyecto) el 16 nov 2026, con título original «Handoff
> Qrobús San Juan del Río para Claude Code». El PDF original se guarda solo en
> la computadora de Miguel (`referencias/practica/`, fuera de git).
>
> **Cómo leerlo.** Las secciones normativas (4, 5, 11, 13, 14, 15) se
> conservan completas. Las de investigación (7 a 10) se condensan sin cambiar
> cifras ni fuentes. Donde una decisión posterior corrige algo, la línea lleva
> la marca `[CORREGIDO → D-xx]` y manda `docs/DECISIONES.md`. Los problemas
> encontrados en el trabajo de la práctica están en `docs/REVISION-HANDOFF.md`.

Proyecto: app ciudadana de tiempos estimados de autobús para San Juan del Río,
Querétaro, construida sobre un GTFS propio (GTFS-SJR). Origen: Midot Labs / San
Juan del Futuro (laboratorio ciudadano, proyecto personal de Miguel, sin
asociación civil constituida). Estado al 16 nov 2026: investigación cerrada,
dos mockups construidos y corregidos, cero código de producción.

## 1. Resumen ejecutivo

- Sí se puede construir la app, pero **no consumiendo el GTFS oficial de
  Qrobús tal cual**: ese feed cubre la zona metropolitana de Querétaro y deja a
  San Juan del Río fuera en la práctica (§3).
- Camino recomendado, híbrido: pedir a la AMEQ el feed de San Juan y, en
  paralelo, construir un GTFS-SJR propio, empezando con un piloto y creciendo
  a las 42 rutas.
- La versión a publicar incluye **las 42 rutas** del inventario (§4), todas
  en un **menú desplegable** (§11.8). Las 10 con ficha Moovit verificada
  muestran su detalle; las 32 restantes entran con su nombre de inventario y
  su estado honesto, sin conteos, duraciones ni trazos inventados.
- Los tiempos se lanzan como **estimados** (interpolación sobre duración
  total + espera por frecuencia), siempre etiquetados. El tiempo real solo
  llega por convenio con la AMEQ o por GPS ciudadano (GPX).
- No hay que invertir en hardware GPS para empezar: la prueba de $0 es con
  teléfonos de voluntarios viajando como pasajeros (§8).
- Mapa real de San Juan con OpenStreetMap; recorrido completo por calles. Sin
  API de Google Maps: Leaflet, teselas OSM, OSRM, Nominatim y Overpass, con
  niveles de precisión A/B/C por tramo (§11).
- En San Juan del Río el servicio lo operan **concesionarios privados**
  regulados por la AMEQ; no es el modelo metropolitano (§7).

## 2. Qué es GTFS, en breve

GTFS (General Transit Feed Specification) es el estándar abierto con el que
las agencias publican sus datos para Google Maps, Apple Maps, Moovit y apps de
terceros. Son archivos CSV con extensión `.txt` dentro de un ZIP:

| Archivo | Contenido |
|---|---|
| `agency.txt` | La agencia operadora |
| `routes.txt` | Las rutas: número, nombre origen–destino, tipo |
| `stops.txt` | Las paradas con latitud y longitud reales |
| `trips.txt` | Los viajes de cada ruta, por sentido |
| `stop_times.txt` | La hora de paso de cada viaje por cada parada |
| `calendar.txt` / `frequencies.txt` | Días de operación, o intervalo entre corridas |
| `shapes.txt` | El trazo de la ruta por las calles (polilínea) |
| `feed_info.txt` | Versión, vigencia y contacto del feed |

GTFS-Realtime es la extensión en vivo (VehiclePositions, TripUpdates,
ServiceAlerts). Sin GTFS-Realtime público no hay "tiempo real" de terceros:
solo estimaciones.

## 3. Auditoría del GTFS oficial de Qrobús (hallazgo central)

Feed descargado de qrobus.gob.mx/gtfs, versión v24.0.0, 26 ene 2026:

- 218 rutas en `routes.txt`, pero solo 117 tienen viajes y horarios.
- Las 42 rutas de San Juan del Río aparecen listadas con **cero viajes, cero
  paradas y cero horarios**.
- Las 2,591 paradas están todas en la zona metropolitana de Querétaro
  (longitud −100.50 a −100.14). San Juan está en ≈ −99.99: ninguna parada cae
  ahí.
- `shapes.txt` está vacío.
- La vigencia declarada terminó el 24 de marzo de 2026.
- No existe GTFS-Realtime público de Qrobús. El GPS existe dentro de la AMEQ
  (centro de monitoreo), sin feed abierto.

Consecuencia: el producto real de este proyecto es primero el dato (GTFS-SJR)
y después la app.

## 4. Inventario de rutas de San Juan del Río: las 42

Fuente: listado oficial en qrobus.gob.mx/Rutas, cruzado con el índice de
Moovit (40 urbanas bajo la agencia "TaxiVan San Juan del Río"; 2
intermunicipales bajo "Qrobús Tequisquiapan", operadas con QroVan). La
numeración tiene huecos (faltan 003, 006, 021, entre otros) y variantes con
letra. Reconciliar esta lista con la operación real es tarea de la Fase 1.

Esta tabla es la fuente del menú desplegable (§11.8): cada fila es una opción,
en este orden. No se agregan rutas fuera de ella ni se quita ninguna por no
tener datos.

| Ruta | Nombre (origen – destino) | Tipo |
|---|---|---|
| 001 | Pedregoso – Centro | Urbana |
| 002 | Pedregoso – Universidad Tecnológica (UTSJR) | Urbana |
| 004 | Col. Industrial Nuevo San Juan – Centro | Urbana |
| 005 | Pedregoso 2ª Sección – Central de Autobuses | Urbana |
| 007 | Central de Autobuses – Parque Industrial | Urbana |
| 008 | Central de Autobuses – San Isidro | Urbana |
| 009 | San Pedro Ahuacatlán – Central de Autobuses | Urbana |
| 009B | Fracc. La Rueda – Centro | Urbana |
| 010 | Cerro Gordo – 5 de Mayo | Urbana |
| 011 | Loma Alta – Central de Autobuses | Urbana |
| 011B | Loma Alta – Centro | Urbana |
| 012 | Hospital General – Centro | Urbana |
| 013 | Carrizo – 5 de Mayo | Urbana |
| 014 | Granjas Banthí – Centro | Urbana |
| 015B | Solares Banthí – 5 de Mayo | Urbana |
| 016 | Infonavit La Paz – Centro | Urbana |
| 017 | Barrio de la Cruz – Centro | Urbana |
| 018 | Nuevo San Isidro – Centro | Urbana |
| 019 | Pedregoso – Valle Real | Urbana |
| 020 | Valle Real – Central de Autobuses | Urbana |
| 022 | Pedregoso – Centro | Urbana |
| 23 | Lomas del Pedregal – Centro | Urbana `[CORREGIDO → D-08]` |
| 024 | Praderas del Sol – Centro | Urbana |
| 024C | Las Torres – Central de Autobuses | Urbana |
| 025 | Las Águilas – Centro | Urbana |
| 028 | Rancho de Enmedio – Central de Autobuses | Urbana |
| 030 | Infonavit La Paz – Central de Autobuses | Urbana |
| 031 | Pedregoso – PITSA | Urbana |
| 032 | Visthá – Central de Autobuses | Urbana |
| 036 | Visthá (CERESO) – 5 de Mayo | Urbana |
| 037 | La Peña – Centro | Urbana |
| 038 | La Peña – Central de Autobuses | Urbana |
| 039 | Francisco Villa – Central de Autobuses | Urbana |
| 040 | Las Águilas – Universidad Tecnológica (UTSJR) | Urbana |
| 041 | Francisco Villa – Centro | Urbana |
| 042 | Manantiales / Nogales – Centro | Urbana |
| 043 | Valle Dorado I – Central de Autobuses | Urbana |
| 044 | Valle Dorado II – Centro | Urbana |
| 046 | Manantiales – Nogales – IMSS | Urbana |
| 047 | La Rueda – Central de Autobuses | Urbana |
| 062 | San Juan del Río – Tequisquiapan | Intermunicipal |
| 023 | Tequisquiapan – Ezequiel Montes | Intermunicipal `[CORREGIDO → D-08]` |

Contexto (anuncio AMEQ, 3 mar 2025): Tarifa UniDos de $2 MXN, 42 rutas
urbanas, ~400 unidades y más de 25,000 usuarios. Es integración tarifaria y de
tarjeta; **no** significa que la AMEQ opere las unidades.

## 5. Datos de Moovit y las rutas con detalle verificado

Moovit lista las 42 rutas. Por ruta publica: nombre, los dos sentidos, la
lista de paradas en orden con su conteo, la duración total y el horario. No
publica hora exacta por parada ni, en todos los casos, la frecuencia. Moovit
es **referencia, no fuente oficial**: cada cifra que venga de ahí lleva esa
etiqueta hasta verificarse en campo o con la AMEQ. `[Uso de Moovit en el
repositorio público → D-07]`

### 5.1 Las 10 rutas del mockup (fichas Moovit verificadas)

| Ruta | Paradas ida / vuelta | Duración ida / vuelta | Horario |
|---|---|---|---|
| 001 Pedregoso – Centro | 29 / 23 | 20 / 16 min | 06:00–22:00 |
| 002 Pedregoso – UTSJR | 42 / 39 | 30 / 33 min | 06:00–22:00 |
| 004 Col. Industrial – Centro | 34 / 31 | 30 / 22 min | 06:00–22:00 |
| 005 Pedregoso 2ª – Central | 42 / 34 | 29 / 22 min | 06:00–22:00 |
| 009 San Pedro Ahuacatlán – Central | 25 / 25 | 28 / 28 min | 06:00–22:00 |
| 011 Loma Alta – Central | 48 / 35 | 41 / 33 min | 06:00–22:00 |
| 012 Hospital General – Centro | 25 / 32 | 19 / 23 min | 06:00–22:00 |
| 040 Las Águilas – UTSJR | 36 / 34 | 24 / 29 min | 06:00–22:00 |
| 041 Francisco Villa – Centro | 28 / 25 | 23 / 16 min | 06:00–22:00 |
| 062 SJR – Tequisquiapan | 17 / 17 | 29 / 29 min | Por verificar en campo |

Notas:
- En 004, 011, 040 y 041 el conteo y la duración cambian por sentido.
  **Cualquier cálculo usa siempre los datos del sentido elegido, nunca un
  promedio** ni los del otro sentido. (El mockup de la práctica rompió esta regla en
  001, 002, 005 y 012: ver `docs/REVISION-HANDOFF.md`.)
- La 007 existe en Moovit, pero su conteo y duración no se pudieron verificar
  al escribir este handoff. No se agrega con datos supuestos.
- La 062 es intermunicipal (QroVan): horario y frecuencia por verificar.

### 5.2 La rutina de estimación

```
tiempo_por_tramo           = duración_total_del_sentido / (número_de_paradas − 1)
tiempo_en_ruta_a_mi_parada = tiempo_por_tramo × tramos_que_faltan
espera_estimada            = frecuencia / 2        (si solo se conoce el intervalo)
tiempo_total_mostrado      = espera_estimada + tiempo_en_ruta_a_mi_parada
```

Ejemplo con la 001 a Centro: 20 min ÷ 28 tramos ≈ 43 s por tramo.

- Todo resultado se etiqueta **ESTIMADO**, con la fórmula visible o a un
  toque.
- La espera por frecuencia se muestra como rango o con su margen (el mockup
  usaba ±8 min), nunca como minuto exacto.
- Si no se conoce la frecuencia, no se calcula espera.
- Cuando exista un GPX de esa ruta, los tiempos medidos por tramo reemplazan
  la interpolación y la etiqueta cambia a «Medido en campo» con la fecha.

### 5.3 Las 32 rutas restantes: entran al selector, sin datos inventados

007, 008, 009B, 010, 011B, 013, 014, 015B, 016, 017, 018, 019, 020, 022, 23,
024, 024C, 025, 028, 030, 031, 032, 036, 037, 038, 039, 042, 043, 044, 046,
047 y 023 (intermunicipal).

| Dato | ¿Se muestra? |
|---|---|
| Número y nombre del inventario (§4) | Sí, como opción del desplegable |
| Tipo (Urbana / Intermunicipal) | Sí, como grupo del selector |
| Conteo, duración, horario, frecuencia | No, hasta tener ficha verificada o dato de campo/AMEQ |
| Trazo sobre el mapa | No como línea real: nivel C, punteado o solo lista, con etiqueta |
| Tiempos estimados por parada | No: sin duración verificada no hay estimación |

Al elegir una de estas rutas se ve: nombre, tipo, la etiqueta «Datos de
paradas y recorrido en verificación» y la invitación a grabar su recorrido
GPX. Cada ruta sale de este grupo solo cuando su ficha se verifica con el
procedimiento de §5.1, y el cambio se anota en el changelog del GTFS-SJR con
fecha y fuente.

## 6. Estado del mockup y correcciones ya aplicadas por Miguel

- **Teléfono primero, a pantalla completa (100dvh).** La primera versión
  enterraba el simulador debajo de un reporte: motivo de rechazo.
- **Autobuses en línea monocromo.** Iconos SVG de trazo fino, un solo color;
  cada autobús se distingue por su número de ruta.
- **Animación sobre calles, no a través de manzanas.** Superado por §11: mapa
  real, OSRM (nivel B) y GPX (nivel A).
- **Datos con procedencia visible.** El primer mockup mostró conteos de Moovit
  y coordenadas inventadas como si fueran oficiales.
- **Participación ciudadana integrada** (grabar recorridos con GPS).
- **Selector desplegable, no lista** (16 nov 2026): la primera pantalla es mapa
  + selector + sentido.

## 7. Estructura institucional (condensada)

- **AMEQ** (Agencia de Movilidad del Estado de Querétaro): organismo público
  descentralizado creado por la ley del 21 dic 2022 que transformó al IQT.
  Otorga concesiones, autoriza rutas, fija tarifas y vigila a los operadores
  en todo el estado, incluido San Juan.
- **Zona metropolitana ≠ San Juan del Río.** En la metropolitana la AMEQ es
  autoridad y operadora parcial (Fideicomiso de Movilidad, unidades propias).
  En San Juan el servicio lo prestan concesionarios privados agrupados en
  líneas (las fuentes nombran CTM, FTQ/FTEQ, Taxi Bus, Taxi Van, Diligencias y
  Alucsa, además de transporte ejidal y suburbano), sin subsidio estatal.
- El alcalde declaró el 9 abr 2026 que no existe proyecto tipo Qrobús para San
  Juan del Río.
- "TaxiVan" es la agrupación con la que Moovit lista las rutas urbanas, no una
  empresa única. El mapa ruta → concesionario no está publicado.
- Las intermunicipales 023 y 062 operan con 47 unidades de QroVan (AMEQ, mar
  2025).

## 8. GPS y tiempos reales (condensada)

**Cadena de autorización:** (1) AMEQ, autoridad; (2) el concesionario, dueño
de la unidad, es quien autoriza tocar el vehículo; (3) el conductor: su
permiso solo **no** basta. Excepción que habilita el piloto: un voluntario que
viaja como pasajero con su propio teléfono no instala nada y no necesita
permiso del sistema; basta su consentimiento y no publicar datos personales
del conductor.

| Opción | Qué es | Costo | Cuándo |
|---|---|---|---|
| A · GPS de la AMEQ | Convenio para su localización, ideal como GTFS-RT | $0 en hardware; costo institucional | Mejor a largo plazo; no debe bloquear el lanzamiento |
| B · Teléfono | Traccar Client o GPS Logger, GPX subido por Wi-Fi | $0/mes en modo pasajero; SIM $50–$150/mes si va fijo | Piloto de 1–5 rutas y programa ciudadano |
| C · Rastreador fijo | Teltonika FMB920 / Sinotrack ST-901 | $350–$2,500 hardware; kit ~$2,950–$3,175 primer año | Solo con permiso escrito del concesionario |

Secuencia: (1) prueba de $0 con voluntarios-pasajero; (2) en paralelo, las
gestiones ante la AMEQ; (3) solo si el piloto funciona, un kit en una unidad
con permiso escrito; (4) nunca instalar nada con solo el permiso del
conductor.

## 9. Qué pedir a la AMEQ y por qué vía (condensada)

La AMEQ es sujeto obligado de transparencia (Plataforma Nacional de
Transparencia; hasta 20 días hábiles). Por transparencia se pide lo que ya
exista; un feed nuevo se negocia por convenio.

| Dato | Vía |
|---|---|
| GTFS-SJR completo (rutas, paradas, viajes, horarios, shapes) | Transparencia + convenio |
| Frecuencias, primera y última salida por ruta | Transparencia |
| Shapes / trazos por calle | Transparencia + convenio |
| Unidades asignadas por ruta | Transparencia |
| Padrón ruta → concesionario en SJR | Transparencia |
| GTFS-Realtime o API de localización | Solo convenio |
| Si las unidades de SJR ya traen GPS | Pregunta directa en reunión |

Si algún día entregan tiempo real, pedirlo con: URL estable, llave que no
caduque, frecuencia de actualización declarada y licencia de reutilización.

## 10. Benchmark (condensado)

Iniciativas revisadas: Regio Ruta (Monterrey), Metrobús (CDMX), SIT
Aguascalientes, TransMilenio (Bogotá), EMT Madrid, TfL (Londres), LTA DataMall
(Singapur), TOPIS (Seúl), RTA (Dubái), darb (Riad); software OneBusAway,
Transit App y RTPonky.

Las 5 lecciones para San Juan:
1. Empezar con GTFS estático de pocas rutas, validado, y crecer.
2. Etiquetar siempre ESTIMADO vs. EN VIVO. Si el dato promete exactitud y el
   camión no pasa, la gente deja de creer en la app.
3. El crowdsourcing es puente, no sustituto del feed oficial.
4. Una sola llave estable, pública y documentada.
5. Reutilizar código abierto y publicar donde está la gente: (a) GTFS-SJR
   válido, (b) que Google Maps lo muestre, (c) la PWA propia encima.

## 11. Mapa real con OpenStreetMap

Corrección de Miguel, 16 nov 2026: el mapa genérico o esquemático queda
descartado. La app usa el mapa real de San Juan del Río con el recorrido
completo de la ruta sobre calles reales. Se acepta que al inicio un tramo no
sea exacto; **no se acepta que se presente como exacto si no lo es**.

Restricción de presupuesto: no se usa la API de Google Maps ni su mapa, su
enrutado o su geocodificación, ni como respaldo. Si un servicio público deja
de bastar, se autoaloja la misma pieza abierta, avisando antes a Miguel.

### 11.1 Stack cartográfico obligatorio

| Pieza | Elección | Uso |
|---|---|---|
| Datos | OpenStreetMap (ODbL) | Calles y red vial real |
| Mapa en la PWA | Leaflet + teselas OSM | Mapa real, trazo completo, autobús animado |
| Enrutado | OSRM, perfil `driving` | Polilínea por calles = `shapes.txt` nivel B |
| Geocodificación | Nominatim | Solo punto de partida por verificar |
| Extracción | Overpass API | Vías, paradas y relaciones ya mapeadas |
| Validación | Validador GTFS de MobilityData | Ninguna versión se publica con errores |
| Verdad final | GPX de campo | Trazo y paradas reales: nivel A |

- Atribución a OpenStreetMap visible en el mapa en todo momento.
- Centro inicial: San Juan del Río (Plaza Independencia).
- OSRM público (`router.project-osrm.org`): cada ruta se enruta **una vez** al
  construir el dato y la polilínea se guarda en el repositorio. Nunca en vivo
  desde la app.
- Toda coordenada de Nominatim entra como **por verificar**.
- Overpass: consultas acotadas a San Juan, guardadas localmente con fecha.

### 11.2 Qué ve el usuario: el recorrido completo

- La ruta se elige desde el desplegable (§11.8).
- Al elegir ruta y sentido se ve **todo** el recorrido, primera a última
  parada, con un trazo continuo que sigue las calles (si el nivel lo permite,
  §11.4), ajustado a la vista (`fitBounds`).
- Todas las paradas del sentido marcadas en orden. Tocar una parada abre sus
  tiempos estimados sin perder el trazo.
- El autobús SVG monocromo se anima sobre la polilínea a velocidad
  proporcional a la duración del sentido. Si sale de una calle, el dato está
  mal y se corrige el dato.
- Cada vista declara su nivel de precisión con una etiqueta visible junto al
  nombre de la ruta.

### 11.3 Coordenadas verificadas y dos errores que no se deben repetir

| Lugar | Latitud | Longitud |
|---|---|---|
| Plaza Independencia | 20.38883 | -99.99639 |
| Pedregoso | 20.37609 | -99.96421 |
| Hospital General | 20.37662 | -99.95389 |
| Las Águilas | 20.37589 | -99.94818 |
| Loma Alta | 20.37759 | -99.92699 |
| San Pedro Ahuacatlán | 20.43435 | -99.98480 |
| Tequisquiapan | 20.54222 | -99.94790 |
| Parque Industrial | 20.36730 | -99.96332 |

Verificadas con Nominatim en la práctica: son referencias para extremos, no paradas.
Ejemplo de enrutado: Plaza Independencia → Pedregoso con OSRM = 5.14 km,
polilínea de 100 puntos.

> **Dos resultados de Nominatim incorrectos que no se usan nunca:**
> - «Central de Autobuses» en 20.70044, -99.81309: es la de **Cadereyta**. La
>   Central de San Juan está en Blvd. Hidalgo #4, Col. Centro; su coordenada
>   se obtiene en campo.
> - «Universidad Tecnológica Bridge»: no es la UTSJR. Su coordenada se obtiene
>   en campo.
>
> Regla: un resultado que cae fuera del área urbana de San Juan, o cuyo
> nombre no coincide exactamente, se descarta y se marca por verificar. **No
> se corrige a ojo inventando otra coordenada cercana.**

### 11.4 Niveles de precisión por tramo: A, B y C

La precisión se declara por tramo (entre dos paradas consecutivas), con nivel,
fuente y fecha. La etiqueta que ve el usuario es **el nivel más bajo** del
recorrido.

| Nivel | Qué es | Fuente | Cómo se muestra |
|---|---|---|---|
| A · Medido | Trazo y paradas grabados recorriendo la ruta | GPX de campo | «Medido en campo» + fecha |
| B · Enrutado | Polilínea por calles entre paradas o extremos verificados | OSRM sobre OSM | «Enrutado por calles — por medir en campo» |
| C · Estimado | Orden de paradas conocido, sin geometría confiable | Lista sin enrutar | «Esquemático — recorrido por confirmar», punteado o sin trazo |

1. Ningún tramo C se muestra como real: punteado con etiqueta, o solo la lista
   de paradas. Nunca una línea continua sobre calles.
2. C → B solo cuando sus dos extremos tienen coordenada verificada y OSRM
   devolvió una polilínea que pasa revisión visual (sin saltos, sin atravesar
   manzanas, sin vueltas imposibles).
3. B → A solo con un GPX de esa ruta y sentido; desde ahí el shape oficial es
   el del GPX y los tiempos pasan a medidos.
4. Si un GPX contradice a OSRM, gana el GPX y se anota en el changelog.
   «OSRM propone; el campo dispone.»
5. Bajar de nivel también es posible. No se defiende un trazo por ya estar
   publicado.

### 11.5 Cómo se construye un shape nivel B

1. Partir de la lista de paradas en orden del sentido y de los extremos
   verificados de §11.3.
2. Ubicar cada parada intermedia con el mejor dato disponible (OSM/Overpass
   primero, revisión manual después). Cada una queda **por verificar en
   campo**.
3. Pedir a OSRM la ruta por la secuencia en orden, con geometría completa;
   guardar la respuesta cruda con fecha y secuencia usada. Nunca en vivo.
4. Revisar la polilínea tramo por tramo sobre el mapa real; corregir con
   puntos de paso verificados y re-enrutar solo ese tramo.
5. Escribir `shapes.txt`, registrar nivel B por tramo y validar con
   MobilityData.
6. Publicar con su etiqueta. Toda mejora genera una versión nueva del feed.

### 11.6 Uso responsable de los servicios públicos de OSM

- **Nominatim:** máximo 1 petición por segundo; sin geocodificación masiva ni
  autocompletado en vivo. Cada resultado aceptado se guarda en el repositorio.
- **OSRM público:** solo para construir el dato, una ruta a la vez, con pausa;
  la polilínea se cachea como archivo del feed.
- **Teselas OSM:** solo las del área visible, caché normal del navegador,
  atribución visible. Prohibida la descarga masiva o el raspado.
- **Overpass:** consultas acotadas a San Juan, guardadas con fecha. Nunca
  desde la app ni en ciclos automáticos frecuentes.
- **Caché como política:** si un dato ya está en el repositorio, ninguna pieza
  vuelve a pedirlo a un servicio público.
- Si un servicio bloquea o limita, se detiene su uso y se reporta a Miguel con
  la alternativa abierta. No se evade un límite cambiando de dirección, de
  agente de usuario o de servidor espejo.

### 11.7 Plan para llegar de B a A, ruta por ruta

1. Primero, las 5 rutas piloto en B completo (sugeridas: 001, 002, 005, 012 y
   040 `[→ D-06]`). La 001 va primero.
2. Después, A en la 001 de punta a punta (GPX de ida y de vuelta). Queda como
   ruta de referencia de «terminada».
3. Luego, A ruta por ruta en el orden del piloto, sin abrir una ruta nueva en
   B mientras una del piloto siga sin GPX, salvo decisión de Miguel.
4. Las otras 5 del mockup (004, 009, 011, 041, 062) entran en B con el mismo
   procedimiento; la 062 es la última en subir a A.
5. El resto de las 42 está en el desplegable desde el inicio, en nivel C /
   solo inventario, y entra en B cuando su lista de paradas se reconcilie.

Criterio de «ruta terminada»: shape A en ambos sentidos, paradas con
coordenada de campo, tiempos por tramo medidos y feed validado. Hoy ninguna
ruta lo cumple.

### 11.8 Versión a publicar: las 42 rutas en un menú desplegable

**Qué se muestra.** Sin ruta elegida: mapa real a pantalla completa, un solo
desplegable de ruta, un control de sentido y nada más de rutas. Sin lista,
rejilla, tarjetas ni chips. Al elegir: el desplegable se cierra, queda visible
solo la ruta elegida, el mapa encuadra su recorrido y debajo aparece solo su
detalle. Cambiar de ruta es volver a abrir el desplegable.

**El control.**
- `<select>` nativo estilizado o combobox accesible equivalente, con
  `<label>` visible «Ruta», manejo por teclado y foco visible. Área táctil de
  al menos 44 px por opción.
- Texto de cada opción: número + origen – destino, exactamente como en §4.
  Ejemplo: `001 — Pedregoso – Centro`.
- Orden de §4: numérico ascendente, variantes con letra justo después de su
  ruta base.
- `<optgroup>` «Urbanas» (40) e «Intermunicipales» (2).
- Estado inicial: «Selecciona tu ruta», sin ruta precargada. Si la app
  recuerda la última ruta usada, lo dice en el control; en la primera visita,
  no.
- Nunca texto libre: siempre una de las 42 opciones.
- El sentido (ida / vuelta) es un control separado, segmentado de dos
  opciones.

**Qué muestra cada grupo.**

| Grupo | Rutas | Vista |
|---|---|---|
| Con ficha verificada | 001, 002, 004, 005, 009, 011, 012, 040, 041, 062 | Recorrido según su nivel, paradas por sentido, duración y conteo de ese sentido, tiempos ESTIMADO |
| Solo inventario | Las 32 de §5.3 | Nombre y tipo, «Datos de paradas y recorrido en verificación», mapa de fondo sin trazo real, módulo «Participa» |

**Datos que alimentan el selector.** Se genera desde `routes.txt` del GTFS-SJR
más el estado de cada ruta en su ficha. Agregar o verificar una ruta no exige
tocar el componente. Cada opción lleva en el dato su `route_id`, grupo y
estado (`verificada` / `solo-inventario`).

**Criterios de aceptación del selector.**
1. En un teléfono real, la primera pantalla muestra mapa + desplegable +
   sentido, sin lista de rutas y sin scroll para llegar al mapa.
2. Exactamente 42 opciones en el orden y con los textos de §4, agrupadas 40 +
   2.
3. Cualquiera de las 10 verificadas muestra su recorrido completo y su detalle
   por sentido; cualquiera de las 32 restantes muestra «en verificación» sin
   datos inventados.
4. Funciona solo con teclado y un lector de pantalla anuncia ruta, grupo y
   opción elegida.
5. Cambiar de ruta reemplaza trazo, paradas y tiempos; no quedan restos de la
   ruta anterior.

## 12. Arquitectura propuesta

```
Fuentes de datos
  ├─ GTFS oficial AMEQ (metropolitano; SJR vacío) ── referencia, no insumo
  ├─ Moovit (referencia: paradas en orden, duraciones, horarios)   [→ D-07]
  ├─ Campo: recorridos GPX de voluntarios
  └─ Futuro: GTFS-Realtime / API AMEQ por convenio
        ▼
GTFS-SJR propio (ZIP versionado, validado con MobilityData)
        ├─► Google Maps (Transit partner) cuando el feed sea estable
        ▼
Backend mínimo (cuando haga falta)
  ├─ Estimaciones: interpolación (§5.2) + tiempos medidos por tramo
  ├─ Ingesta GPX ciudadana
  └─ (Futuro) Proxy GTFS-RT
        ▼
PWA móvil primero
  ├─ Selector: un desplegable con las 42 rutas, generado desde routes.txt
  ├─ Control de sentido separado
  ├─ Mapa real con recorrido completo, nivel visible y autobús animado
  ├─ Parada → tiempos con etiqueta ESTIMADO / MEDIDO / EN VIVO
  └─ Módulo «Participa»
```

Decisiones sugeridas en la práctica (se confirman en `docs/DECISIONES.md`): PWA en
vez de app nativa; hosting gratuito; selector como componente único
alimentado por datos; el GTFS-SJR versionado con changelog es el activo
principal `[→ D-03]`; Traccar autoalojado solo si el piloto lo justifica.

## 13. Plan de trabajo por fases (de la práctica)

> El orden de construcción vigente está en `docs/PLAN.md`, que reorganiza
> estas fases en bloques. Los criterios de aceptación de abajo se conservan.

- **Fase 0 · Decisiones y gestiones.** Nombre de la app, alcance del piloto,
  quién firma ante la AMEQ; presentar solicitud de transparencia y carta de
  convenio; decidir Traccar o GPX por archivo. *Aceptación:* gestiones con
  folio y fecha; decisiones escritas en el repositorio.
- **Fase 1 · GTFS-SJR del piloto.** `routes.txt` con las 42 rutas desde esta
  fase; `stops.txt` con coordenadas provisionales marcadas, nunca publicadas
  como reales; trips, frequencies y calendar; reconciliar el inventario.
  *Aceptación:* el ZIP pasa el validador de MobilityData sin errores, cada
  archivo declara fuente y fecha, y `routes.txt` contiene exactamente las 42.
- **Fase 1B · Shapes nivel B.** Procedimiento §11.5 por ruta piloto; nivel por
  tramo registrado. *Aceptación:* cada ruta piloto muestra su recorrido
  completo con etiqueta de nivel y ningún tramo C aparece como línea continua.
- **Fase 2 · Campo (subida a A).** Protocolo GPX; ~10 recorridos de 20–40 min;
  procesar y fijar paradas reales. *Aceptación:* cada ruta piloto tiene trazo
  y paradas desde GPX propio, con fecha y autor.
- **Fase 3 · PWA v1 con estimador.** Mapa real, recorrido ajustado, autobús
  monocromo animado, consulta por parada con etiqueta. *Aceptación:* en un
  teléfono real se ve la app completa sin scroll inicial y ningún tiempo
  aparece sin etiqueta de tipo y fuente.
- **Fase 3B · Desplegable con las 42.** *Aceptación:* los 5 criterios de
  §11.8 en un teléfono real.
- **Fase 4 · Participación ciudadana.** «Graba tu recorrido» y «este tiempo no
  fue preciso». *Aceptación:* un recorrido de un tercero actualiza los tiempos
  sin intervención manual en el código.
- **Fase 5 · Tiempo real (condicionada).** Convenio AMEQ o kit con permiso
  escrito. *Aceptación:* posición en vivo estable de al menos una unidad
  durante dos semanas, con permiso archivado.

## 14. Reglas que no se negocian

1. Nunca presentar datos esquemáticos, de referencia o simulados como reales
   u oficiales. Cada cifra lleva fuente (GTFS oficial / Moovit / campo / AMEQ)
   y estado.
2. Todo tiempo calculado se etiqueta ESTIMADO (o MEDIDO EN CAMPO, con fecha).
   EN VIVO solo con una posición GPS real detrás.
3. Presupuesto cero al inicio. Antes de cualquier paso con costo (VPS, SIM,
   hardware, dominio), avisar a Miguel con el monto y esperar su sí.
4. Nada se instala en un camión con solo el permiso del conductor.
5. La AMEQ es la autoridad y San Juan lo operan concesionarios privados. No
   afirmar que Qrobús/AMEQ opera las unidades de San Juan ni que existe un
   "sistema Qrobús SJR". `[El nombre de la app tampoco usa la marca → D-02]`
6. Móvil primero, app primero. Autobuses SVG en línea monocromo,
   identificados por número de ruta.
7. El trazo sigue las calles. Si una animación cruza una manzana, se corrige
   el dato.
8. No inventar la ruta 007 ni ninguna otra sin ficha verificada.
9. Mapa real o nada: Leaflet + OpenStreetMap, recorrido completo y niveles
   A/B/C en pantalla. Ningún tramo C se dibuja como real.
10. Cero Google Maps y uso responsable de OSM (§11.6). Nunca usar las dos
    coordenadas erróneas de §11.3.
11. Las 42 rutas, solo en el menú desplegable. No quitar una ruta por no tener
    ficha ni inventarle la ficha.

## 15. Lo que no está verificado (no presentarlo como hecho)

- Mapa ruta → concesionario en San Juan en 2026.
- Número de unidades activas por ruta.
- Si existe un archivo GTFS-SJR interno en la AMEQ.
- Si las unidades de San Juan ya traen GPS de la AMEQ.
- Si existe procedimiento o costo de convenio de datos con la AMEQ.
- Horario y frecuencia reales de la 062.
- Conteo y duración de la 007 en Moovit (el mockup posterior dice tenerlos:
  ver `docs/REVISION-HANDOFF.md`).
- Conteo, duración, horario y lista de paradas de las 32 rutas de solo
  inventario.
- Coordenada exacta de la Central de Autobuses de San Juan (Blvd. Hidalgo #4).
- Coordenada exacta de la UTSJR.
- Coordenadas de las paradas intermedias de cada ruta.
- Costo de un VPS para Traccar y de un teléfono básico dedicado.
- Un ranking independiente de apps de autobús; la exactitud de ETA de casi
  todas las iniciativas del benchmark; la URL pública del GTFS-RT de Dubái; si
  Riad publica GTFS abierto; la continuidad del feed de Regio Ruta.

## 16. Preguntas abiertas para Miguel

1. Nombre de la app `[→ D-02]`.
2. Rutas piloto `[→ D-06]`.
3. Quién presenta y firma las solicitudes ante la AMEQ.
4. Voluntarios para los GPX, o Miguel graba las primeras rutas.
5. Dominio propio o subdominio del proyecto paraguas.

## 17. Fuentes (selección)

- Feed GTFS oficial Qrobús v24.0.0: https://qrobus.gob.mx/gtfs
- Listado oficial de rutas: https://qrobus.gob.mx/Rutas
- Tarifa UniDos en San Juan del Río (AMEQ, 3 mar 2025):
  https://qrobus.gob.mx/Nota/amplian-el-servicio-de-tarifa-unidos-al-municipio-de-san-juan-del-rio-y-tequisquiapan
- Sin proyecto Qrobús en SJR (Rotativo, 9 abr 2026):
  https://rotativo.com.mx/cabrera-descarta-qrobus-san-juan-del-rio
- Concesionarios de SJR ante la AMEQ (Plaza de Armas, abr 2025):
  https://plazadearmas.com.mx/se-manifiestan-concesionarios-en-la-ameq/
- Retiro de 761 concesiones (Quadratín, 19 jul 2023):
  https://queretaro.quadratin.com.mx/retira-ameq-761-concesiones-del-transporte-publico/
- Centro de Monitoreo AMEQ (La Lupa, 14 dic 2025):
  http://lalupa.mx/2025/12/14/un-vistazo-al-detras-de-camaras-del-transporte-publico-queretano/
- Transparencia en Querétaro (INFOQRO): https://www.infoqro.mx/index.php/preguntas-frecuentes/
- ITDP México, nota técnica GTFS (jun 2026):
  https://mexico.itdp.org/wp-content/uploads/2026/06/GTFS-Nota-tecnica-eventos-masivos-Jun-2026-.pdf
- Caducidad de credenciales GTFS-RT de Metrobús (Codeando México, 14 abr 2026):
  https://hdtp.codeandomexico.org/posts/2026/cdmx-gtfs-rt-caduca
- OneBusAway: https://opentransitsoftwarefoundation.org/onebusaway/software
- Traccar Client: https://play.google.com/store/apps/details?id=org.traccar.client

La lista completa de fuentes (benchmark y precios de GPS) está en el PDF
original.
