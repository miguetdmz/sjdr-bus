# PLAN · Construcción de SJDR Bus

Estado: v2 · 17 nov 2026
Referencias: `docs/HANDOFF.md` (contrato de origen) y `docs/DECISIONES.md`
(manda sobre el HANDOFF).

## Estado actual (21 nov 2026, 2:01 am)

**Dónde vamos (D-47: Bloque · Tarea · Versión)**

| Nivel | Hoy |
|---|---|
| Versión publicada (`main`, https://sjdrbus-sjr.vercel.app) | **v0.1**: foto inicial del 19 nov (`06efa8c`) |
| Versión en espera (PR 1 «B2 · Primera pantalla publicable → v0.2», https://github.com/miguetdmz/sjdr-bus/pull/1) | **v0.2**: 39 rutas, pantalla nueva con mapa completo (D-48, D-49), pines de parada, selector visual con tarjetas y zonas probables (D-50), nombre SJDR Bus. Integra Miguel cuando cierre B2 |
| Bloque en curso | **B2 · Primera pantalla publicable** (cerrándose); después vuelve **B3 · Trazos** |
| Tarea en curso | **E-03 · D-58, D-59 y D-60: CONSTRUIDAS en `web/`.** D-58 zoom y píldoras; D-59 pellizco solo en el mapa, teléfono acostado como teléfono y letra del pie sin agrandar; D-60 acostado: zoom más abajo, menú más arriba (2 filas de rutas) y chip vertical 30 % más chico. D-53 + D-55 + D-57 aprobadas (12:34 am). **Falta: subir, que Miguel apruebe en su teléfono e integre el PR 1** para cerrar B2 (v0.2) |
| Tarea en pausa | **B3 · R-03 · Cruces de calles**: 698 de 936 con punto exacto (75 %); 20 POR VERIFICAR |

| Bloque | Qué es | Estado |
|---|---|---|
| B0 | Estructura, documentos, puerta de calidad y repositorio | Cerrado. Repositorio **público** `miguetdmz/sjdr-bus` (D-29), con candado en `main` |
| B1 | Datos base del GTFS-SJR | **7 de 7.** Desde D-36/D-39/D-40 son **39 rutas** (37 urbanas + 2 intermunicipales): de baja 031, 024C y 018; la 044 volvió |
| B2a | Mockup navegable (PWA, Vite + Leaflet) | **8 de 8.** M-05 a M-08 hechas por el turno (PR 2, inspector: **LIBERADO**, 20 nov 2026, 12:17 am). Falta integrarlo y verlo en el teléfono |
| B2 | Primera pantalla publicable | **E-03 (D-48, D-49) EN REVISIÓN:** mapa completo, «¿A dónde vas?» arriba, menú lateral izquierdo (integrado en computadora), detalle que se abre solo, sentido solo con ruta, pines de parada. Miguel: «se ve muy bien en computadora». **D-50 construido** (selector visual con camioncitos R1, R2…, zonas probables); **D-52 y D-53 construidos** (D-53: sin desplegable, botón de paradas, 20 colores, pie legal único, «¿A dónde quieres ir?»); falta la aprobación de Miguel en su teléfono para cerrar B2 |
| B3 | Trazos de las rutas (lote R, D-24) | R-01 y R-02 hechas. **R-03 a medias:** extremos listos (32 de 35, 3 FALTANTES por D-41). **Hallazgo a resuelto (D-42, D-43):** cruces de 18 listas separados y ubicados (la 023 trae solo un bloque de lugares: la página la mezclaba con la 23): 698 de 936 con punto exacto (75 %), **27 APROXIMADOS (3 %, D-45: ESTIMADO, nivel C)**, 191 referencias (20 %), 20 POR VERIFICAR (2 %) al 20 nov, 1:05 pm. **D-46 PROPUESTA:** extremos como zona probable (mapa de calor). Faltan los hallazgos b y c y la **secuencia por sentido**. R-04 a R-06 esperan R-03 |
| B4 | Estimador por parada y autobús animado | Sin iniciar |
| B5 | Participa: botón de reporte (D-22, sin GPS) | Sin iniciar. **Idea aprobada (D-41):** canal «esto está mal / esto falta» para completar faltantes; diseño a presentar antes de construir |
| B6 | Calcula tu ruta (D-15) | Sin iniciar |

Nombre visible: **SJDR Bus** (D-28). Hosting: Vercel Hobby, $0 (D-26).

### Relevo para la siguiente sesión (21 nov 2026, 2:01 am)

0. **Lo hecho de la 1:15 am a las 2:01 am:** subidos D-58 y D-59 (`26630de`); GitHub
   Actions falló por 7 px (zoom × chip con otra fuente): arreglado en `33ea5bd`
   (lección 5, 3.ª ocurrencia, propuesta de control). Miguel probó acostado y pidió
   D-60 (maqueta en `docs/maquetas/d60/`, ajustada a la 1:49 am, aprobada a la 1:59 am,
   construida con 4 pruebas validadas con el defecto). Ajuste 3 de D-59: Safari ya no
   agranda la letra del pie.
1. **Siguiente:** subir lo que falte (con permiso) → Actions y Vercel en verde →
   Miguel aprueba D-58 + D-59 + D-60 en su teléfono → integra el PR 1 a `main` (v0.2;
   lo hace Miguel, lección 6) → verificar `main` y https://sjdrbus-sjr.vercel.app →
   «el tema del PDF» (FALTANTE: preguntarle cuál) → D-56 fase 2, maqueta primero.
2. **Preguntas abiertas para Miguel (una a la vez):** D-55: ¿tarjetas de «cerca» partidas?,
   ¿«Borrar» a 36 px?
3. **Pendientes con el sí de Miguel:** control de la lección 5 (3.ª ocurrencia:
   pruebas de posición a 320 px y con fuente más ancha); control de la lección 13;
   lección 14 a `standards.md`; controles de las lecciones 9 y 10; candidata a lección
   «una prueba de un defecto se valida haciéndola fallar con el defecto». Ezequiel
   Montes (023) FALTANTE; página de aviso de privacidad y términos (FALTANTE de D-52).
4. **Turno nocturno:** sin tareas APROBADA. Bandera en EN SESIÓN.

### Relevo anterior (21 nov 2026, 1:15 am)

0. **Lo hecho de las 12:59 am a la 1:15 am:** Miguel probó la vista previa y pidió
   D-59 (pellizco solo en el mapa; teléfono acostado como teléfono). Maqueta en
   `docs/maquetas/d59/`, aprobada a la 1:13 am y construida en `web/` con 3 pruebas
   validadas con el defecto.
1. **Siguiente:** subir la rama (con permiso) → Miguel aprueba D-58 + D-59 en su
   teléfono (el pellizco real queda POR VERIFICAR ahí) → integra el PR 1 a `main`
   (v0.2; lo hace Miguel, lección 6) → verificar `main` y https://sjdrbus-sjr.vercel.app
   → «el tema del PDF» (FALTANTE: preguntarle cuál) → D-56 fase 2, maqueta primero.
2. **Preguntas abiertas de D-55, pendientes con el sí de Miguel y turno:** sin
   cambio (ver el relevo de las 12:50 am).

### Relevo anterior (21 nov 2026, 12:50 am)

0. **Lo hecho de las 12:26 am a las 12:50 am:** Miguel aprobó D-53 + D-55 + D-57
   en su teléfono (12:34 am) y pidió D-58: zoom «+ / −» en píldora y formato
   píldora en los cuadros que quepan. Maqueta en `docs/maquetas/d58/` (la tarjeta
   de ruta en píldora completa no cabe: medido), aprobada con esquina suave
   (12:43 am) y construida en `web/` con 3 pruebas validadas con el defecto.
1. **Siguiente:** subir la rama (con permiso) → Miguel aprueba D-58 en su teléfono
   → integra el PR 1 a `main` (v0.2; lo hace Miguel, lección 6, con los pasos y
   links que le da Claude) → verificar `main` y https://sjdrbus-sjr.vercel.app →
   «el tema del PDF» (FALTANTE: preguntarle cuál) → D-56 fase 2, maqueta primero.
2. **Preguntas abiertas de D-55 (sin aplicar):** ¿tarjetas de «cerca» partidas?;
   ¿botón «Borrar» a 36 px?
3. **Pendientes con el sí de Miguel:** sin cambio.
4. **Turno nocturno:** sin tareas APROBADA. Bandera en EN SESIÓN.

### Relevo anterior (20 nov 2026, 11:28 pm)

0. **Lo hecho de las 10:46 pm a las 11:28 pm:** D-55 subido (`f3b4681`, Actions
   y Vercel en verde). Miguel pidió D-57 (10:55 pm): maqueta en
   `docs/maquetas/d57/`, ajuste con sus respuestas (11:07 pm), aprobada (11:20 pm)
   y construida en `web/` con criterio antes, 5 pruebas nuevas validadas con
   defectos y un defecto visto en las capturas y corregido (ver D-57).
1. **Siguiente:** Miguel aprueba D-53 + D-55 + D-57 en su teléfono → cierra B2
   integrando el PR 1 (v0.2; lo hace Miguel, lección 6) → Miguel dijo que después
   sigue «el tema del PDF» (FALTANTE: no se sabe cuál es; preguntarle) → D-56
   fase 2 (incluye editar la dirección de salida), maqueta primero.
2. **Preguntas abiertas de D-55 (sin aplicar):** ¿tarjetas de «cerca» partidas?;
   ¿botón «Borrar» a 36 px?
3. **Pendientes con el sí de Miguel:** sin cambio. La candidata a lección («una
   prueba de un defecto se valida haciéndola fallar con el defecto») se aplicó en
   D-55 y D-57; en D-57 además la comparación visual atrapó lo que las pruebas no.
4. **Turno nocturno:** sin tareas APROBADA. Bandera en EN SESIÓN.

### Relevo anterior (20 nov 2026, 10:44 pm)

0. **Lo hecho de las 10:34 pm a las 10:44 pm:** D-55 construido en `web/` con
   criterio escrito antes (`docs/evidencia/d55/criterios.md`), 16 pruebas
   nuevas validadas metiendo defectos a propósito, inventario de selectores
   (ninguno se fue) y capturas lado a lado con la maqueta en
   `docs/evidencia/d55/comparacion/`. Detalle en D-55 («Construida en `web/`»).
1. **Siguiente:** Miguel aprueba D-53 + D-55 en su teléfono (vista previa de
   Vercel de la rama) → cierra B2 integrando el PR 1 (v0.2; lo hace Miguel,
   lección 6) → fase 2 = D-56 (parte posible), maqueta primero.
2. **Preguntas abiertas de D-55 (lección 14, sin aplicar):** ¿las tarjetas de
   «cerca» también van partidas?; ¿el botón «Borrar» baja a 36 px como en la
   maqueta (hoy 44 px, mínimo para el dedo)?
3. **Pendientes con el sí de Miguel:** sin cambio (control de la lección 13,
   lección 14 a `standards.md`, controles de las lecciones 9 y 10, candidata a
   lección de abajo). Esta sesión la aplicó: las 4 pruebas de D-55 se validaron
   haciéndolas fallar con el defecto.
4. **Turno nocturno:** sin tareas APROBADA que pueda tomar. Bandera en EN SESIÓN.

### Relevo anterior (20 nov 2026, 10:22 pm)

0. **Lo hecho de las 9:42 pm a las 10:22 pm:** maqueta de D-55 en
   `docs/maquetas/d55/` (parte de la de D-53; vistas `?vista=bienvenida` y
   `?vista=menu`), capturas a 390 y 1280 px y comparación con la app actual en
   `capturas/comparacion/`. Respuestas de Miguel anotadas en D-55: bienvenida
   aprobada tal cual (9:58 pm); tarjeta partida (9:58 pm); 3 columnas en el
   teléfono, más alta lo justo y apretada (10:02 y 10:10 pm); 3 columnas en
   computadora (10:20 pm). Lección 14 nueva (Claude cambió algo no pedido) y
   lección 13 en su 3.ª ocurrencia, con propuesta de control.
1. **Siguiente (chat nuevo): construir D-55 en `web/`** con los criterios
   escritos en D-55 («Maqueta terminada»), la maqueta como referencia y las
   lecciones 3, 5, 10, 11, 13 y 14. Lo nuevo para la app: el ajuste de letra
   por tarjeta (en la maqueta es la función `ajustarLetra()`: de 11 px hacia
   abajo hasta que el nombre quepa, sin partir palabras, «–» pegado a la palabra
   vecina más corta). Capturas finales en `docs/evidencia/d55/` comparadas con
   `docs/maquetas/d55/capturas/`.
2. **Después:** Miguel aprueba D-53 + D-55 en su teléfono → cierra B2 integrando
   el PR 1 (v0.2) → fase 2 = D-56 (parte posible), maqueta primero.
3. **Pendientes con el sí de Miguel:** control de la lección 13
   (`scripts/selectores.mjs`), lección 14 a `standards.md`, controles de las
   lecciones 9 y 10, candidata a lección de abajo (prueba que se valida
   haciéndola fallar).
4. **Turno nocturno:** sin tareas APROBADA que pueda tomar (construir D-55 es de
   día, con Miguel). Bandera en EN SESIÓN.

### Relevo anterior (20 nov 2026, 9:31 pm)

0. **Lo hecho de las 9:08 pm a las 9:31 pm:** D-53 subido (`0ea1cb3`; puerta
   en la Mac, GitHub Actions y Vercel en verde). Miguel lo probó y pidió D-55 y
   D-56; orden aprobado a las 9:31 pm (ver `docs/DECISIONES.md`).
1. **Siguiente (chat nuevo): fase 1 = D-55.** Maqueta en `docs/maquetas/d55/`
   (D-54), con las referencias de `referencias/d55/` (fuera de git):
   bienvenida «Así funciona» con 3 pasos y X, y tarjetas con insignia más
   grande, nombre sin negritas y más chico, todas del mismo tamaño. Con el sí
   de Miguel, construir en `web/` con criterio medible antes y las lecciones 3,
   5, 10, 11 y 13. Luego Miguel aprueba en su teléfono y cierra B2 (v0.2).
2. **Después: fase 2 = D-56, parte posible** (catálogo amplio de lugares de
   OSM con una descarga nueva + parada más cercana a ti y al destino, en línea
   recta, ESTIMADO). Fase 3 espera B3 y R-07.
3. **Candidata a lección (preguntar al cerrar el bloque):** la primera versión
   de la prueba del defecto de encuadre pasaba con el defecto puesto (revisaba
   antes de que el mapa se moviera). Se detectó reintroduciendo el defecto a
   propósito. Regla posible: toda prueba de un defecto se valida haciéndola
   fallar con el defecto.

### Relevo anterior (20 nov 2026, 9:08 pm)

0. **Lo hecho de las 8:31 pm a las 9:08 pm:** D-53 construido en `web/` con la
   maqueta como referencia, en el orden (a) → (e). Criterios escritos antes de
   construir: `docs/evidencia/d53/criterios.md`. Pruebas: `d53.spec.mjs` (nueva,
   13), `b2a` y `d50` reescritas para elegir por tarjeta, `destino.test.mjs`
   (nueva). Inventario de selectores (lección 13):
   `docs/evidencia/d53/inventario-selectores.md`. Reglas 5 y 9 de `CLAUDE.md`
   sin `<select>`. Defecto hallado al comparar capturas y corregido: con la
   ubicación puesta, elegir un destino dejaba el mapa sin el destino (dos
   encuadres seguidos; Leaflet ignoraba el segundo). Prueba que lo atrapa: `d53`
   e5 y computadora (falla con el defecto, pasa con el arreglo).
1. **Siguiente:** Miguel revisa las capturas (`docs/evidencia/d53/comparacion/`)
   y los 5 puntos «decididos al construir» de D-53; con su sí se sube la rama y
   lo prueba en su teléfono con la vista previa de Vercel. Luego cierra B2
   (integra el PR 1 → v0.2).
2. **Hallazgo [sin verificar]:** Francisco Villa y Las Águilas tienen casi la
   misma coordenada en los extremos (~2 m). Se revisa en B3 · R-03.
3. **Turno nocturno:** sin tareas que pueda tomar (R-04 es de día; R-05 y R-06
   esperan R-03). Bandera en EN SESIÓN.

### Relevo anterior (20 nov 2026, 7:05 pm)

0. **Lo hecho de las 6:20 pm a las 7:05 pm:** maqueta de D-53 (D-54) en
   `docs/maquetas/d53/` (`maqueta.html`, `armar-datos.mjs`, `capturas/`).
   Respuestas de Miguel anotadas en D-53: «Ruta 001» solo en los datos, nunca
   en pantalla (6:23 pm); «¿A dónde quieres ir?» con las 3 partes y lo demás en
   fases posteriores (6:29 pm); ajustes 1 a 3 (6:49, 6:57 y 7:03 pm); **maqueta
   aprobada a las 7:04 pm**.
1. **Siguiente: construir D-53 en `web/`**, con la maqueta como referencia y
   criterio medible antes de cada parte, en este orden: (a) sin desplegable;
   sentido dentro del menú; pestañas arriba; mapa completo con el menú
   cerrado; (b) botón redondo de paradas; paradas como círculo levantado con
   el camión y guía de puntitos, ocultas hasta presionarlo; (c) tarjetas y
   recientes más chicas, sin «Ruta 001», 20 colores AA (la paleta y su
   contraste están en la maqueta) e intermunicipales aparte; insignia más
   grande en el aviso de ruta elegida; (d) pie legal único, chico, verde y sin
   fondo (leyenda + atribución Leaflet/OSM), avisos del mapa discretos,
   «estimado» en minúscula; (e) «¿A dónde quieres ir?»: catálogo de los
   lugares de inicio y fin, rutas que empiezan o terminan a ≤ 1 km en tarjetas
   del mismo tamaño, «Usar mi ubicación» (GPS solo en el teléfono) con la
   parada de OSM más cercana marcada en el mapa, y leyendas juntas al fondo.
   Pruebas: reescribir las de `pruebas-navegador/b2a.spec.mjs` y
   `d50.spec.mjs` que usan `#ruta`; inventario de selectores antes de borrar
   estilos (lección 13); pruebas de la regla, no del conteo (lección 11);
   `npm run verificar`, leer el resultado y solo entonces commit (lección 10).
   Cambian la regla 5 y la 9 de `CLAUDE.md` (sin `<select>`).
2. **Hallazgo [sin verificar]:** Francisco Villa y Las Águilas tienen casi la
   misma coordenada en los extremos (~2 m). Se revisa en B3 · R-03.
3. **Turno nocturno:** sin tareas que pueda tomar (R-04 es de día; R-05 y R-06
   esperan R-03). Bandera en EN SESIÓN.

### Relevo anterior (20 nov 2026, 6:12 pm)

0. **Lo hecho de las 5:27 pm a las 6:12 pm:** D-52 construido (detalle más
   visual, sin fuentes en pantalla, tarjetas a la mitad). D-50 y D-52 subidos
   (`68a8373`): puerta, GitHub Actions y Vercel en verde. Miguel lo probó en
   su teléfono a las 6:11 pm y pidió **D-53** (ver `docs/DECISIONES.md`).
1. **Siguiente: D-53, primero su maqueta (D-54):** pantallas de muestra en
   `docs/maquetas/d53/` a 390 y 1280 px para que Miguel las apruebe; con su
   sí, construir en este orden y con criterio medible antes de cada parte: (a) quitar el desplegable y llevar el sentido dentro del
   menú (adiós al «aparece de golpe»); pestañas arriba; mapa completo con el
   menú cerrado; (b) botón redondo de paradas con el pictograma, paradas
   ocultas hasta presionarlo; (c) tarjetas y recientes más chicas, sin «Ruta
   001», 20 colores con contraste AA; (d) «¿A dónde quieres ir?» arriba:
   primero el diseño con Miguel (una pregunta a la vez; límite honesto en
   D-53), después construir. Las pruebas de `pruebas-navegador/b2a.spec.mjs`
   usan `#ruta` (el desplegable): se reescriben para elegir por tarjeta.
2. **Pregunta abierta:** ¿el número oficial («Ruta 001») queda solo en el
   encabezado del detalle?

### Relevo anterior (20 nov 2026, 5:27 pm)

0. **Lo hecho de las 4:27 pm a las 5:27 pm del 20 nov:**
   - Chat y PR 1 renombrados por Bloque · Tarea · Versión (lección 12, 2.ª vez).
   - **D-50** decidida pregunta por pregunta (respuestas en `docs/DECISIONES.md`)
     y construida: 39 tarjetas con camioncito e insignia (R urbanas, T
     intermunicipales), 4 colores que no significan nada (dicho en la app),
     «Tus rutas recientes» solo en el teléfono, inicio y fin como zona
     probable (Manantiales / Nogales y Valle Dorado II «cerca de» su vecino;
     Ezequiel Montes sigue FALTANTE). Regla 9 cambiada. Puerta: 148/148 y
     20/20 en navegador. Capturas en `docs/evidencia/d50/`.
   - Observación para R-03: Francisco Villa (20.37587, -99.94821) y Las Águilas
     (20.37589, -99.94818) tienen casi el mismo punto [sin verificar si es error].
1. **Siguiente:** Miguel aprueba D-48/D-49/D-50 en su teléfono → integra el
   PR 1 (v0.2) → rama `b3/r03-cruces` → B3 · R-03.
2. **Pendiente de Miguel:** dónde va Ezequiel Montes (023); hoy FALTANTE.
3. **D-52 (pedido de Miguel, 5:43 pm):** detalle más visual (tarjeta de la
   ruta, sentido y paradas en un renglón, puntos de duración, reloj), sin
   fuentes en pantalla (cambia la regla 1 en la pantalla), leyenda general
   «datos en proceso de validación» y tarjetas a la mitad en el teléfono.
   FALTANTE: página de aviso de privacidad y términos con las fuentes.

### Relevo anterior (20 nov 2026, 3:52 pm)

0. **Lo hecho de la 1:39 pm a las 3:52 pm del 20 nov:**
   - **D-47 + lección 12:** todo se nombra Bloque · Tarea · Versión; tabla
     «Dónde vamos» arriba. Para todos los proyectos (la cosecha la lleva).
   - **Corrección:** el PR 2 se integró a la rama de cierre, no a `main`;
     `main` sigue en v0.1 (1 commit) y todo espera en el PR 1.
   - **B2 · E-03 (D-48, D-49):** pantalla rehecha con Miguel en 4 vueltas
     (capturas en `docs/evidencia/e03/`). Regla 5 cambiada (D-49): el sentido
     aparece al elegir la ruta. Defecto de scroll (detalle detrás del sentido)
     corregido con prueba. Puerta: 132/132 y 13/13 en navegador; GitHub
     Actions en verde en cada subida.
   - **Propuestas:** D-50 (selector visual de rutas), D-51 (mapa isométrico,
     fase posterior), R-07 (paradas por ruta, después de R-06).
   - Lección 7: 4.ª ocurrencia, atrapada por el hook antes del commit.
1. **Siguiente: D-50**, una pregunta a la vez y con criterio medible antes de
   construir: (1) cambiar la regla 9 y la prueba que prohíbe tarjetas;
   (2) «R1» en vez de «001», y cómo se ven 009B, 011B, I-062 e I-023;
   (3) colores propios alternados, aclarando que no significan nada;
   (4) «Tus rutas recientes» (solo en el teléfono) en vez de «más comunes»,
   que no tiene fuente. Opcional: origen y destino como zona (D-46).
2. **Para cerrar B2:** Miguel aprueba D-48/D-49/D-50 en su teléfono → integra
   el PR 1 (pasa a v0.2) → el trabajo sigue en una rama `b3/r03-cruces` (D-47).
3. **Después, B3 · R-03:** los 20 POR VERIFICAR (lista en el relevo de la
   1:05 pm, abajo) y los hallazgos b y c.
4. **Bandera:** EN SESIÓN. La cola no tiene tareas APROBADA que el turno pueda
   hacer (R-04 a R-06 son de día y esperan R-03).

### Relevo anterior (20 nov 2026, 1:05 pm)

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
