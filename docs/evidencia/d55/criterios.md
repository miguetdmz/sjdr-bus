# D-55 · Criterios de aceptación de la construcción

Escritos el 20 nov 2026 a las 10:35 pm, **antes** de tocar `web/`. Parten de los
criterios de D-55 («Maqueta terminada», `docs/DECISIONES.md`). La referencia
visual es la maqueta terminada (`docs/maquetas/d55/maqueta.html`, vistas
`?vista=bienvenida` y `?vista=menu`; capturas en `docs/maquetas/d55/capturas/`).
Cada criterio se revisa con una prueba que mide la regla, no el dato del día
(lección 11): ningún conteo de rutas, de tamaños de letra ni de tarjetas abajo
de 9 px.

Pruebas: `pruebas-navegador/d55.spec.mjs` (navegador, 390 y 1280 px) y
`scripts/pruebas/d55.test.mjs` (lógica del «–» y de la letra, sin navegador).

## 1. Bienvenida «Así funciona»

- b1. La primera vez que se abre la app (sin nada guardado) sale la tarjeta
  «Así funciona» con los 3 pasos, la X, los botones «Elegir ruta» y «¿A dónde
  quieres ir?» y la nota «Sale solo la primera vez. Se recuerda en este
  dispositivo, sin cookies.», con el mismo texto que la maqueta.
- b2. La X la cierra. «Elegir ruta» la cierra y abre el menú en «Rutas».
  «¿A dónde quieres ir?» la cierra y abre el menú en «Calcula tu ruta» con el
  campo listo para escribir.
- b3. Cerrada de cualquiera de las tres formas, no vuelve a salir al recargar.
  Se recuerda con `localStorage`; la app no crea ninguna cookie.
- b4. No tapa la barra de arriba (☰, «¿A dónde quieres ir?», paradas) ni la
  atribución de OpenStreetMap del pie (regla 6), en 390 y 1280 px.
- b5. Si el navegador no deja guardar (navegación privada), la app sigue
  funcionando y la X la cierra igual.

## 2. Tarjetas partidas (menú «Rutas»: «Elige tu ruta» y «Tus rutas recientes»)

- t1. Cada tarjeta lleva a la izquierda el camión de frente y debajo su
  insignia (R1, T62…), y a la derecha el nombre de inicio – fin completo, sin
  negritas. Las rutas siguen en el orden de `routes.txt`, ninguna oculta
  (regla 9).
- t2. **3 columnas** en teléfono (390 px) y en computadora (1280 px).
- t3. **Todas del mismo alto:** 70 px en teléfono y 60 px en computadora.
- t4. **El nombre cabe completo** en su mitad: nada se corta ni se sale de la
  tarjeta, en los dos anchos.
- t5. **Ninguna palabra partida:** sin guiones de corte (`hyphens` no es
  `auto`) y cada palabra del nombre queda entera en un solo renglón.
- t6. **Ningún «–» solo en un renglón:** va pegado a la palabra vecina más
  corta.
- t7. **Letra que se ajusta a cada nombre:** entre 11 px y 7.5 px (el piso de
  `ajustarLetra()` de la maqueta); debajo de 9 px, letra delgada. Un nombre
  corto lleva la letra más grande (11 px).
- t8. Lo que lee el lector de pantalla no cambia: insignia y nombre, sin
  «Ruta 001» (D-53, c1).

## 3. Lo que no cambia (lección 14)

- Las tarjetas de «Rutas que empiezan o terminan cerca» (pestaña «Calcula tu
  ruta») no estaban en la maqueta de D-55: se quedan como en D-53.
- El resto de la pantalla de D-53 se queda igual: las pruebas de
  `d53.spec.mjs`, `d50.spec.mjs` y `b2a.spec.mjs` siguen en verde (las que
  medían la tarjeta vieja se actualizan solo en lo que D-55 cambió).
