# PLAN · Construcción de SJDR Bus

Estado: v2 · 17 nov 2026
Referencias: `docs/HANDOFF.md` (contrato de origen) y `docs/DECISIONES.md`
(manda sobre el HANDOFF).

## Estado actual (25 nov 2026, 11:40 pm)

**Dónde vamos (D-47: Bloque · Tarea · Versión)**

| Nivel | Hoy |
|---|---|
| Versión publicada (`main`, https://sjdrbus-sjr.vercel.app) | **v0.7** (`826f933`, 25 nov 2026, 11:34 pm según GitHub): Miguel integró el PR 10 «B3 · D-75 · Aviso de GPS vivo en la página de campo». Verificado a las 11:37 pm: Actions en verde sobre `main` y `/campo.html` probada en línea en WebKit con iPhone 13 (`docs/evidencia/d75/probar-en-linea.mjs`): «GPS PERDIDO» tras 69 s sin ubicación, vuelve a verde con la señal, 42 rutas, sin errores. Miguel (8:23 pm): **es el último cambio a la página de campo**. Antes: v0.6 (`5067371`, 25 nov), v0.5 (`6a7a6ca`, 25 nov), v0.4 (`972e832`, 25 nov), v0.3 (`7b20c7e`, 23 nov), v0.2 (`9b8fca8`, 22 nov), v0.1 (`06efa8c`, 19 nov) |
| Versión en espera | Ninguna. Rama del día **`b3/r03-fase1`** (desde `main`, 25 nov, 11:40 pm) solo con este relevo y la evidencia en línea de v0.7 |
| Bloque en curso | **B3 · Trazos**: un solo plan (D-68, ajustado por D-69 y D-71) con R-03 y los pendientes de D-66 |
| Tarea en curso | **B3 · R-03 fases 1, 3 y 4** (paso 3 del orden del 25 nov, 12:57 am): hallazgo b, secuencias por sentido (hasta 84) y revisión de Miguel. **D-74 en v0.6 y D-75 en v0.7**; falta la prueba de Miguel en su iPhone (en carro el 26 nov, caminando antes del lunes 30) |
| Hecho antes | **B3 · R-03 paso 1 · Paradas oficiales por sentido** (D-71, 25 nov): 84 de 84 ruta-sentidos con datos, publicado en v0.5. **D-66 · Página de campo** publicada en v0.5 sin enlace; falta la prueba de Miguel en su iPhone |
| Tarea en pausa | Ninguna |
| Pendiente registrado | **D-72 PROPUESTA** (Miguel, 3:46 a 3:55 pm): «Calcula tu ruta» confusa (A: una sola parada recomendada; B: indicaciones; C: siguiente camión ESTIMADO) y teclado con el teléfono acostado (D). A y D con maqueta primero después del paso 1, probando antes la app como usuario |

| Bloque | Qué es | Estado |
|---|---|---|
| B0 | Estructura, documentos, puerta de calidad y repositorio | Cerrado. Repositorio **público** `miguetdmz/sjdr-bus` (D-29), con candado en `main` |
| B1 | Datos base del GTFS-SJR | **7 de 7.** **D-70 (Miguel, 25 nov, 1:01 am): la referencia son las rutas de San Juan de qrobus.gob.mx: 42 rutas** (40 urbanas + 2 intermunicipales); vuelven 018, 024C y 031. **Publicado en v0.4** (PR 7, 25 nov) |
| B2a | Mockup navegable (PWA, Vite + Leaflet) | **8 de 8.** M-05 a M-08 hechas por el turno (PR 2, inspector: **LIBERADO**, 20 nov 2026, 12:17 am). Falta integrarlo y verlo en el teléfono |
| B2 | Primera pantalla publicable | **CERRADO: v0.2 publicada** (22 nov 2026, 4:15 pm, `9b8fca8`). D-48 a D-62 aprobados por Miguel en su teléfono y computadora (D-63) |
| B3 | Trazos de las rutas (lote R, D-24) | R-01 y R-02 hechas. **R-03 a medias:** extremos listos (32 de 35, 3 FALTANTES por D-41). **Hallazgo a resuelto (D-42, D-43):** cruces de 18 listas separados y ubicados (la 023 trae solo un bloque de lugares: la página la mezclaba con la 23): 698 de 936 con punto exacto (75 %), **27 APROXIMADOS (3 %, D-45: ESTIMADO, nivel C)**, 191 referencias (20 %), 20 POR VERIFICAR (2 %) al 20 nov, 1:05 pm. **D-46 PROPUESTA:** extremos como zona probable (mapa de calor). Faltan los hallazgos b y c y la **secuencia por sentido**. R-04 a R-06 esperan R-03. **R-03 paso 1 hecho (D-71, 25 nov):** paradas oficiales por sentido de las 42 rutas, 84 de 84 con datos (`datos/cache/qrobus/paradas-sentido.json`) |
| B4 | Estimador por parada y autobús animado | Sin iniciar |
| B5 | Participa: botón de reporte (D-22, sin GPS) | Sin iniciar. **Idea aprobada (D-41):** canal «esto está mal / esto falta» para completar faltantes; diseño a presentar antes de construir |
| B6 | Calcula tu ruta (D-15) | **D-56 fase 2 cerrada y publicada en v0.3** (D-65): lugares de OSM y paradas cercanas. Falta: qué ruta tomar, recorrido y camino a pie (necesitan B3). **D-72 PROPUESTA:** resultado con una sola parada (A), indicaciones (B, fase 3) y teclado en horizontal (D) |

Nombre visible: **SJDR Bus** (D-28). Hosting: Vercel Hobby, $0 (D-26).

### Relevo para la siguiente sesión (25 nov 2026, 11:40 pm)

0. **25 nov, noche:** D-75 (aviso de GPS vivo) aprobada en maqueta (8:23 pm), construida y
   publicada en **v0.7** (PR 10, 11:34 pm; verificada en línea a las 11:37 pm). Miguel: último
   cambio a la página de campo. Rama del día **`b3/r03-fase1`** creada desde `main` con este
   relevo y la evidencia en línea (`docs/evidencia/d75/`).
1. **Miguel:** «Prueba en carro» de https://sjdrbus-sjr.vercel.app/campo.html el 26 nov (página
   al frente, pantalla encendida, cargador; vigilar «GPS PERDIDO») y una ruta caminando antes del
   lunes 30. Al volver: veredicto y huecos del GPS.
2. **Siguiente (chat nuevo):** R-03 fase 1 (hallazgo b) con criterio medible antes de construir,
   en `b3/r03-fase1`; después fases 3 y 4. D-72 A y D después, con el sí de Miguel.
3. **Limpieza pendiente (con el sí de Miguel):** las mismas ramas del relevo de las 6:36 pm, más
   `b3/r03-secuencias` (ya integrada en v0.7). Mientras no se borren, `git branch --no-merged
   origin/main` las lista: no son trabajo vivo.
4. **Turno nocturno:** sin tareas APROBADA; bandera EN SESIÓN.

### Relevo anterior (25 nov 2026, 6:36 pm)

0. **25 nov, tarde:** D-74 (pendientes de campo a–d) aprobada en maqueta (5:51 pm), construida
   y publicada en **v0.6** (PR 9, 6:33 pm; verificada a las 6:36 pm). Rama `b3/r03-secuencias`
   creada desde `main` solo con este relevo (sin subir).
1. **Miguel, antes del lunes 30:** probar `sjdrbus-sjr.vercel.app/campo.html` en su iPhone: una
   ruta caminando y una «Prueba en carro» casa → trabajo (teléfono fijo, sin tocarlo).
2. **Siguiente (chat nuevo):** R-03 fase 1 (hallazgo b) con criterio medible antes de construir,
   en `b3/r03-secuencias`. D-72 A y D después, en su propia rama, con el sí de Miguel.
3. **Limpieza pendiente (con el sí de Miguel):** ramas locales viejas (`b3/d66-campo`,
   `b3/r03-cruces`, 7 `cierre/*`, `noche/2026-11-19`, `archivo-main`, `b3/r03-paradas-oficiales`,
   `b3/d66-pendientes-campo`) y 7 en GitHub (más `b3/d66-pendientes-campo`). Borrar ramas está
   negado a Claude sin ese sí (el candado lo frenó al cerrar D-74).
4. **Turno nocturno:** sin tareas APROBADA; bandera EN SESIÓN.

### Relevo anterior (25 nov 2026, 6:02 pm)

0. **D-74 construida** en `b3/d66-pendientes-campo` (sin subir): `campo.html` por sentido y
   `campo.json` nuevo. Pruebas nuevas validadas con 5 defectos puestos; prueba de usuario en
   WebKit con iPhone 17 de 17; puerta de calidad TODO PASÓ.
1. **Miguel:** dar el sí para subir la rama y abrir su PR; integrarlo (D-73); después probar
   `/campo.html` en su iPhone (una ruta caminando y una «Prueba en carro»), antes del lunes 30.
2. Lo demás como en el relevo de las 5:31 pm (limpieza de ramas con su sí; R-03 fases 1, 3 y 4;
   D-72 A y D en su propia rama).

### Relevo anterior (25 nov 2026, 5:31 pm)

0. **25 nov, 5:27 pm:** Miguel integró el PR 8 → **v0.5 publicada** (Actions y Vercel en verde,
   42 rutas, `/campo.html` abre). Rama del día `b3/d66-pendientes-campo` desde `main`, con
   `621adeb` y `6d96553` traídos por cherry-pick (D-73).
1. **En curso:** pendientes de campo de D-66 (a–d), maqueta primero en `docs/maquetas/`.
2. **Limpieza pendiente (con el sí de Miguel):** 11 ramas locales viejas, más
   `b3/r03-paradas-oficiales` (sus 2 commits ya están en la rama del día), y 7 en GitHub.
3. **Después:** R-03 fases 1, 3 y 4; D-72 A y D en su propia rama del día, con el sí de Miguel.
4. **Turno nocturno:** sin tareas APROBADA; bandera EN SESIÓN.

### Relevo anterior (25 nov 2026, 5:25 pm)

0. **25 nov, tarde:** v0.4 publicada (PR 7, 42 rutas). **R-03 paso 1 hecho** (D-71: 84 de 84
   ruta-sentidos con paradas oficiales, solo texto). **D-72** registrada (PROPUESTA: «Calcula
   tu ruta» y teclado en horizontal, con el detalle de las 4:10 pm). **D-73 carril único**
   (Miguel, 5:14 pm): los 13 commits con contenido de `b3/d66-campo` entraron al PR 8 por
   cherry-pick (D-66 a D-69 idénticas, entre D-65 y D-70); `campo.html` se publica sin enlace
   al integrar. Lección 19. Se borraron 6 ramas locales ya integradas. Puerta de calidad al
   subir: TODO PASÓ.
1. **Miguel:** integrar el PR 8 (Ready for review → Merge pull request → Confirm merge).
2. **Second Brain** (respondió a las 5:23 pm): propone el n.º 14 «Carril único de ramas» y un
   ajuste al n.º 13 de `standards.md`; cosecha mejor después de integrar el PR 8. Espera el sí
   de Miguel en el chat de Second Brain. La limpieza la hace el chat de cada proyecto.
3. **Limpieza pendiente (con el sí de Miguel):** quedan 11 ramas locales (`b3/d66-campo`,
   `b3/r03-cruces`, 7 `cierre/*`, `noche/2026-11-19`, `archivo-main`) y 7 en GitHub (6 ya
   integradas y `b3/d66-campo`).
4. **Siguiente (orden aprobado el 25 nov, 12:57 am):** (2) pendientes de campo de D-66 (a–d)
   con maqueta primero, por el recorrido del lunes 30 nov; (3) R-03 fases 1, 3 y 4 (hasta 84
   secuencias) → R-04 → R-06. D-72 A y D: maqueta, con el sí de Miguel, usando antes «Calcula
   tu ruta» como usuario en WebKit con iPhone. Cada uno en una rama de un día, integrada al
   pasar la puerta (D-73).
5. **Turno nocturno:** sin tareas APROBADA; bandera EN SESIÓN.

### Relevo anterior (25 nov 2026, 3:13 pm)

0. **25 nov:** Miguel aprobó el orden (12:57 am): (1) lectura oficial de paradas por
   sentido, (2) pendientes de campo, (3) R-03 → R-04 → R-06. Antes, a su pedido, se revisó
   qrobus.gob.mx contra nuestras rutas: **D-70** (1:01 am), las 42 rutas de San Juan son la
   referencia; vuelven 018, 024C y 031 (sus extremos quedan FALTANTE, D-41). Colores de las
   tarjetas: se recorren por D-53 (Miguel, 2:24 pm). Construido en `b1/rutas-qrobus` y
   subido (2:32 pm): **PR 7** en borrador, Actions y Vercel en verde. D-70 vive en PR 7, no
   en esta rama. R-03 sube a **84 ruta-sentidos** (42 × 2): la 018 y la 024C traen lista
   usable; la 031 queda «sin datos» (D-33).
1. **Miguel:** integrar el PR 7 (Ready for review → Merge pull request → Confirm merge).
2. **Siguiente chat (paso 1 del orden):** con el PR 7 en `main`, crear la rama nueva
   `b3/r03-paradas-oficiales` desde `main` (nombre nuevo para no reusar `b3/r03-cruces`,
   que solo trae 3 commits de D-66 repetidos y queda sin usar). Escribir el criterio medible
   y leer una vez las paradas por sentido de las **42** rutas (D-69).
3. **Pendiente técnico:** `b3/d66-campo` (D-66 a D-69, `campo.html`) chocará con `main` en
   `docs/DECISIONES.md` cuando entre el PR 7 (las dos agregan al final: D-66 a D-69 y D-70).
   `git merge` está negado a Claude (candado); se resuelve con una rama nueva desde `main` y
   `git cherry-pick` de sus commits, con el sí de Miguel, antes del lunes 30 nov.
4. **Turno nocturno:** sin tareas APROBADA; bandera EN SESIÓN.

### Relevo anterior (25 nov 2026, 12:20 am)

0. **24 y 25 nov:** el arranque de la 1:30 am no se usó. Miguel abrió en el navegador la
   página oficial de la 011: con «Ver ruta» trae las paradas **por sentido** con número
   oficial (001: 29 + 21 = 50, igual a nuestra lista; 005, de las 21 sin usar, sale limpia).
   **D-69** (Miguel, 12:19 am): cambia D-25 (una lectura de las listas visibles por
   sentido, sin trazo ni coordenadas; Google no es referencia ni para comparar), ajusta
   D-68 (hasta 78 secuencias), prioridad **trazos visibles en la app**, pendientes de campo
   (d) identificador simple y (e) foto como IDEA, aclara el modo prueba (diseñado para
   `campo.html`, **no construido**) y fija la **prueba como usuario** (WebKit con iPhone;
   el Simulador de iOS con Xcode falta: 13 GB libres, se instala solo con el sí de Miguel).
   `main` avanzó a `4486c20` (PR 6, OR-03). El proceso «presentar» que corre es de
   Kaseta-KZ. Corrige el punto 3 del relevo de la 1:22 am (presentar ya no es de aquí).
1. **Siguiente (chat nuevo), orden a proponer a Miguel:** (1) lectura única de las listas
   oficiales por sentido de las 39 rutas (`datos/cache/qrobus/`, huella, fecha) y cruce con
   `cruces.json`; (2) pendientes de D-66 (a–d) con maqueta primero, por el recorrido del
   lunes 30 nov; (3) R-03 fases 1, 3 y 4 → R-04 (OSRM) → R-06 trazo punteado en la app.
2. **Miguel:** prueba caminando de `campo.html` en su iPhone (punto 1 del relevo de las
   12:28 am del 24 nov); la prueba en carro espera el modo prueba (c).
3. **Turno nocturno:** sin tareas APROBADA; bandera EN SESIÓN.

### Relevo anterior (24 nov 2026, 1:22 am)

0. **Cierre del 23 y 24 nov:** v0.3 verificada y su cierre integrado a `main` (PR 5,
   `8c860b9`, en verde). Plan de R-03 aprobado (D-68) con los pendientes de D-66 dentro.
   El chat de D-66 («Análisis de minuta con profesor») terminó y se archivó: rama
   `b3/d66-campo` en GitHub hasta `2fe5dd2` (Vercel en verde); su relevo (`d6102e9`) y este
   cierre van en el commit siguiente, que se sube con el sí de Miguel. Lección 18 (un chat
   de consulta no construye; un solo chat por carpeta). Queda un solo chat de SJDR Bus.
1. **Siguiente (chat nuevo, sesión de día):** proponer a Miguel el orden de D-68 (sugerido:
   primero los pendientes de D-66, que tienen fecha). Pendientes de D-66, con maqueta
   primero (D-54): (a) empezar en el inicio del sentido elegido; (b) botón discreto «Más
   cercana»; (c) modo prueba con veredicto CORRESPONDE / NO CORRESPONDE para la prueba de
   Miguel en carro de su casa al trabajo. Después, R-03 fase 1 en `b3/r03-cruces` recreada
   desde `main`.
2. **Miguel, antes del lunes 30:** su prueba de la página de campo (punto 1 del relevo de
   las 12:28 am) y su prueba en carro con el modo prueba.
3. **Procesos:** `npm run presentar --sin-abrir` (servidor local, abierto desde el 23 nov
   en la tarde) sigue corriendo: Claude no pudo detenerlo (permiso denegado); lo detiene
   Miguel con Ctrl+C en su terminal o se pide al arrancar.
4. **Turno nocturno:** sin tareas APROBADA; bandera EN SESIÓN.

### Relevo anterior (24 nov 2026, 12:28 am)

0. **Lo hecho del 23 nov, 10:00 pm, al 24 nov, 12:28 am (B3 · D-66):** minuta de la plática
   con un operador (fuera de git, `referencias/minuta-profe-2026-11-23.md`); D-66
   PROPUESTA (recorridos de campo, cambia D-22 en parte; costo $0; lunes 30 nov) y D-67
   IDEA (tarifas como referencia). Bitácora en un artefacto de claude.ai (respaldo, sin
   GPS). Página de campo construida en tres vueltas con maqueta aprobada
   (`docs/maquetas/d66-campo/`, `docs/maquetas/d66-gps/` v3 aprobada a las 12:16 am): la
   pregunta sigue al GPS, «Enfrente», «No la vi», «Parada aquí» al instante, huecos del
   GPS, estilo de una imagen de Miguel en colores de noche. Simulación R11
   (`docs/evidencia/d66/simular-viaje.mjs`): 0 toques para empezar a medio camino o de
   regreso (antes 19 y 49). Puerta de calidad: TODO PASÓ (175 de 175, 101 de 101, sin
   secretos). Rama `b3/d66-campo` puesta encima de `main` (`8c860b9`) y subida con el sí de
   Miguel (12:27 am).
0b. **Arreglo subido (12:44 am):** «Iniciar viaje» no reaccionaba en el iPhone de Miguel
   (esperaba un sentido sin marcar); ahora el sentido viene marcado. Último commit
   `2fe5dd2`, Vercel en verde. Prueba de usuario en WebKit con iPhone 13:
   `docs/evidencia/d66/probar-iphone.mjs` (11 de 11). Lección 5, 5.ª ocurrencia.
0c. **PEDIDO NUEVO DE MIGUEL (12:57 am), por construir con maqueta primero (D-54):** al iniciar,
   la primera pregunta es **el inicio del sentido elegido**, no la parada más cercana; y un
   **botón discreto «Más cercana»** en la misma línea de la barra de arriba (la de «R11 ·
   hora · franjas»), acomodado simétrico, para saltar a la parada más cercana cuando él
   quiera. Revisado contra los datos: «inicio del sentido» = parada oficial más cercana al
   extremo de origen de ese sentido (`datos/rutas.json` → `extremos`); las 18 rutas con lista
   tienen sus dos extremos con punto. R11: Loma Alta → Central empieza en la 1 (281 m del
   extremo); Central → Loma Alta en la 35 (335 m; la lista repite esa esquina en 35 y 36:
   parece el punto de vuelta). Mostrar a Miguel esas dos paradas en la maqueta. Después:
   pruebas, prueba de usuario en WebKit con iPhone (como si fuera Miguel, desde cero) y
   subir con su sí, antes de su prueba caminando.
1. **Siguiente (Miguel, antes del lunes 30):** abrir en su iPhone el link de vista previa de
   Vercel de `b3/d66-campo` + `/campo.html`, con la pantalla encendida, y caminar 5
   minutos con una ruta cualquiera: ¿la pantalla no se apaga?, ¿el GPS graba (resumen
   «GPS: sin huecos»)?, ¿exportar abre «Compartir»? Después borrar el viaje de prueba.
   **Siguiente (Claude):** con el resultado, corregir lo que salga; pedir a Miguel la
   aprobación de D-66; decidir con él si `campo.html` se integra a `main` (quedaría
   publicada en `/campo.html`) o se usa solo desde la vista previa.
2. **Ojo con las ramas:** `b3/r03-cruces` local trae 3 commits de D-66 sin subir (`1e32feb`,
   `3c69aaf`, `b8b954a`) que ya viven, reescritos, en `b3/d66-campo`. Antes de seguir R-03,
   decidir con Miguel quitarlos de `b3/r03-cruces` (no subirla así: duplicaría D-66).
3. **Pendientes de antes:** plan de B3 · R-03 PROPUESTO (7:43 pm), sin el sí de Miguel; la
   rama `b6/cierre-v03` ya está integrada (PR 5); el resto como en el relevo de las 6:26 pm.

### Relevo anterior (23 nov 2026, 7:43 pm)

0. **v0.3 publicada y verificada** (D-65): integración `7b20c7e` (Miguel, 7:40 pm),
   GitHub Actions y Vercel en verde, 39 rutas y 294 lugares en línea, capturas a 390 y
   1280 px en `docs/evidencia/v0.3/`. Marcada aquí y en D-65, en la rama `b6/cierre-v03`
   (junto con la lección 17). El commit de la lección 17 cayó primero en
   `b3/r03-cruces` porque dos chats trabajaban en la misma carpeta; se movió a
   `b6/cierre-v03` sin perder nada.
1. **Siguiente (Miguel):** dar el sí para subir `b6/cierre-v03` y abrir su PR; luego
   integrarlo. **Siguiente (Claude):** plan de B3 · R-03 (secuencia por sentido,
   hallazgos b y c) propuesto en fases con criterio medible; se construye en
   `b3/r03-cruces` solo con el sí de Miguel.
2. Pendientes y preguntas abiertas: los del relevo de las 6:26 pm (punto 2), sin
   cambios.

### Relevo anterior (23 nov 2026, 6:26 pm)

0. **Lo hecho el 23 nov:** D-56 fase 2 construida igual a la maqueta, con dos ajustes
   aprobados por Miguel («Resultados», 22 nov, 10:40 pm; «Orden de resultados y nombres
   repetidos», 3:13 pm). Arreglo de pruebas de red con carrera y de la ficha que se
   perdía tras un acercamiento (lección 16). Miguel probó la vista previa (4:15 pm):
   todo OK salvo «Bodega Ahurrera», que salió (`159deba`, 294 lugares). Rama subida
   (6:11 pm) con Actions y Vercel en verde. **Fase cerrada (6:25 pm, D-65).**
   **Miguel integró el PR 4 a `main` a las 7:40 pm** (`7b20c7e`, según GitHub); falta
   verificar v0.3. Lección 17 registrada (7:41 pm) en la rama `b6/cierre-v03` (desde
   `main`), con su PR en borrador.
1. **Siguiente (chat nuevo, en la rama `b6/cierre-v03`):** verificar `main` y
   https://sjdrbus-sjr.vercel.app con evidencia (Actions y Vercel en verde, 294
   lugares en `datos/lugares.json`, capturas a 390 y 1280 px en `docs/evidencia/v0.3/`)
   → marcar **v0.3** aquí y en D-65 → subir y que Miguel integre `b6/cierre-v03` → rama
   `b3/r03-cruces` desde `main` → volver a
   B3 · R-03 (secuencia por sentido, hallazgos b y c).
2. **Preguntas abiertas y pendientes:** «rutas cerca» solo mide los extremos de ruta
   (Galerías y Walmart dan 0 rutas; se arregla con los recorridos de B3); D-55
   (¿tarjetas de «cerca» partidas?, ¿«Borrar» a 36 px?); controles pendientes con el sí
   de Miguel (lecciones 5, 9, 10, 13 y 14); lecciones 14, 15 y 16 propuestas para
   `standards.md`; Ezequiel Montes (023) FALTANTE; página de aviso de privacidad y
   términos con las fuentes (FALTANTE de D-52). Flotilla SJR en pausa (D-64).
3. **Turno nocturno:** sin tareas APROBADA que pueda hacer (R-04 a R-06 esperan R-03,
   que es de sesión de día). Bandera: EN SESIÓN.

### Relevo anterior (22 nov 2026, 9:44 pm)

0. **Lo hecho de las 9:14 pm a las 9:44 pm:** ajustes de Miguel a la maqueta («Salgo de
   otro lugar» como círculo con ícono en el renglón, 9:18 pm; opción C, 9:25 pm; destino
   a 14 px, 9:33 pm). **Maqueta aprobada (9:34 pm)** y tipos de lugar aprobados sin
   opcionales (9:40 pm). Rama subida (con el permiso de Miguel, 9:41 pm) y PR 4 en
   borrador: Actions «verificar» y Vercel en verde.
1. **Siguiente (chat nuevo, sesión de día o de noche con Miguel presente):** descarga
   única de lugares de OSM con los tipos de `docs/maquetas/d56f2/tipos-propuestos.md`
   (Overpass, respuesta completa a `referencias/`, al repositorio solo lo extraído con
   sha256; revisar que no traiga llaves, lección 8) → criterios de construcción por
   escrito → pruebas nuevas en rojo con el defecto (lección 15), también a 320 px
   (lección 5) → construir en `web/` igual a la maqueta → `npm run verificar` → commit
   aparte (lección 10) → permiso para subir → Miguel prueba la vista previa en su
   teléfono.
2. **Preguntas abiertas y pendientes:** sin cambio (relevo de las 4:18 pm, abajo).
3. **Turno nocturno:** sin tareas APROBADA que pueda hacer (la descarga es de sesión
   de día). Bandera: EN SESIÓN.

### Relevo anterior (22 nov 2026, 9:14 pm)

0. **Lo hecho de las 8:29 pm a las 9:14 pm:** Miguel integró el PR 3 a `main` (8:33 pm,
   `3dc2065`; Actions y Vercel en verde; el sitio sirve 39 rutas). «El tema del PDF»
   era la propuesta de Flotilla SJR: lista, Miguel la presenta la semana próxima; en
   pausa hasta su retroalimentación (D-64). Rama nueva `b6/d56f2-lugares` desde `main`
   con la **maqueta de D-56 fase 2** (`docs/maquetas/d56f2/`: criterios, inventario,
   capturas a 390, 320 y 1280 px; medición fail 0, y 13 fallas con un defecto puesto).
1. **Siguiente:** Miguel revisa la maqueta y responde la pregunta 1 de
   `docs/maquetas/d56f2/inventario.md` → con su sí: descarga nueva de lugares de OSM
   (le muestro antes la lista de tipos) y construcción en `web/` con criterios y
   pruebas (lecciones 5, 13 y 15) → B3.
2. **Preguntas abiertas y pendientes:** sin cambio (abajo, relevo de las 4:18 pm).

### Relevo anterior (22 nov 2026, 4:18 pm)

0. **Lo hecho de las 4:09 pm a las 4:18 pm:** commits subidos (`41af79c`, verde). Miguel
   integró el PR 1 a `main` (4:15 pm, `9b8fca8`): **v0.2 publicada**. Verificado:
   Actions y Vercel en verde con `9b8fca8`; https://sjdrbus-sjr.vercel.app sirve 39
   rutas, el zoom arriba y el círculo «mi ubicación» a 390 y 1280 px (capturas en
   `docs/evidencia/v0.2/`). Rama nueva `b2/cierre-v02` (desde `main`) con este registro.
1. **Siguiente:** subir `b2/cierre-v02` con su PR en borrador (con permiso) → «el tema
   del PDF» (FALTANTE: preguntar a Miguel cuál es antes de proponer) → D-56 fase 2
   (maqueta primero) → B3.
2. **Preguntas abiertas y pendientes:** D-55 (¿tarjetas de «cerca» partidas?, ¿«Borrar»
   a 36 px?); candidatas a lección (vista previa probada antes de subir; commit de
   maqueta antes de `npm run verificar`); controles pendientes con el sí de Miguel
   (lecciones 5, 9, 10, 13 y 14); lecciones 14 y 15 propuestas para `standards.md`
   (lección 15 registrada a las 4:26 pm: toda prueba nueva se corre con el defecto puesto); Ezequiel Montes (023) FALTANTE; página de aviso de
   privacidad y términos con las fuentes (FALTANTE de D-52).

### Relevo anterior (22 nov 2026, 4:09 pm)

0. **Lo hecho de las 3:51 pm a las 4:09 pm:** D-62 subida (`262195f`, Actions y Vercel
   en verde). Hallazgo de 320 px: Miguel decidió dejarlo así (4:06 pm). Miguel aprobó
   D-58 a D-62 en su iPhone y computadora (4:09 pm, D-63).
1. **Siguiente:** Miguel integra el PR 1 a `main` («Create a merge commit»; pasos en
   el chat y en D-63) → Claude verifica `main` y https://sjdrbus-sjr.vercel.app con
   evidencia y marca **v0.2** → «el tema del PDF» (FALTANTE) → D-56 fase 2.
2. **Preguntas abiertas y pendientes:** como en el relevo de las 2:31 am del 21 nov.

### Relevo anterior (22 nov 2026, 3:51 pm)

0. **Lo hecho de las 3:13 pm a las 3:51 pm:** D-61 subida (`0a18310`, Actions y Vercel
   en verde). Miguel pidió el círculo en los tres (3:39 pm) y en computadora el zoom
   arriba (3:43 pm); maqueta D-62 aprobada (3:47 pm) y construida, con criterios,
   prueba de 9 casos validada (fallaban los 9 antes del cambio) e inventario.
1. **Siguiente:** D-62 subida (`262195f`, Actions y Vercel en verde); hallazgo de 320 px:
   Miguel decidió dejarlo así (4:06 pm) → Miguel aprueba D-58 a D-62 en su teléfono y computadora → integra el PR 1 (v0.2)
   → «el tema del PDF» (FALTANTE) → D-56 fase 2.
2. **Preguntas abiertas y pendientes:** como en el relevo de las 2:31 am del 21 nov.

### Relevo anterior (22 nov 2026, 3:13 pm)

0. **Lo hecho:** D-61 construida en `web/` con criterios, prueba de 8 casos (validada:
   antes del cambio fallaban 6), capturas e inventario de selectores en
   `docs/evidencia/d61/`. Hallazgo sin aplicar: a 320 px, con la R40, la etiqueta de
   inicio queda en parte bajo el círculo (pregunta para Miguel).
1. **Siguiente:** subir (con permiso) → pregunta de lección 14 (¿círculo también
   acostado y en computadora?) y la del hallazgo de 320 px → Miguel aprueba D-58 a D-61
   en su teléfono → integra el PR 1 (v0.2) → «el tema del PDF» (FALTANTE) → D-56 fase 2.
2. **Preguntas abiertas y pendientes:** como en el relevo de las 2:31 am del 21 nov.

### Relevo anterior (21 nov 2026, 2:51 am)

0. **Lo hecho de las 2:31 am a las 2:51 am:** estado comprobado (rama y GitHub en
   `f78cb9a`, Actions y Vercel en verde, PR 1 en borrador, `main` en v0.1, bandera EN
   SESIÓN). Miguel aprobó la maqueta D-61 (2:51 am) y pidió construirla **después de las
   10:00 am**, cuando se reinicia el límite semanal de Claude (iba en 94 %).
1. **Siguiente (desde las 10:00 am, en el mismo chat «B2 · D-61 y cierre: integrar PR 1
   → v0.2»):** construir D-61 en `web/` (criterios antes, pruebas validadas con el
   defecto, inventario de selectores, posición también a 320 px) → `npm run verificar`
   → commit → subir (con permiso) → pregunta de lección 14 (¿círculo también acostado y
   en computadora?) → Miguel aprueba D-58 a D-61 en su teléfono → integra el PR 1
   (v0.2) → «el tema del PDF» (FALTANTE) → D-56 fase 2.
2. **Preguntas abiertas y pendientes:** como en el relevo de las 2:31 am.

### Relevo anterior (21 nov 2026, 2:31 am)

0. **Lo hecho de las 2:01 am a las 2:31 am:** D-60 ajuste 2 (acostado, encuadre de
   ciudad al elegir ruta) construido y subido: rama en `b48173a`, Actions y Vercel en
   verde. Miguel pidió D-61 (2:29 am): con el teléfono parado, zoom arriba abajo del
   botón de paradas y un círculo «mi ubicación». Maqueta en `docs/maquetas/d61/`, en
   revisión; no se construyó (paro de contexto, 40 %).
1. **Siguiente:** Miguel aprueba la maqueta D-61 → construir en `web/` con pruebas →
   subir (con permiso) → Miguel aprueba D-58 a D-61 en su teléfono → integra el PR 1 a
   `main` (v0.2; lo hace Miguel, lección 6) → verificar `main` y la versión publicada →
   «el tema del PDF» (FALTANTE) → D-56 fase 2, maqueta primero.
2. **Preguntas abiertas y pendientes:** como en el relevo de las 2:01 am, más la de
   D-61 (¿el círculo de ubicación también acostado y en computadora?).

### Relevo anterior (21 nov 2026, 2:01 am)

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
