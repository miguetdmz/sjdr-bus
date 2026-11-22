# D-55 · Inventario de selectores de `web/src/estilos.css` (lección 13)

Comparación de la versión anterior (`HEAD` = 28389d0, 135 selectores) contra la
de D-55 (159). Método: script que quita los comentarios, extrae los selectores
de las dos versiones y lista los que faltan y los nuevos (corrido el 20 nov 2026).
Los estilos se editaron solo por texto exacto, nunca por número de línea.

## Se fueron

Ninguno. D-55 solo agrega reglas y cambia un valor:

- `.rejilla` en computadora (`@media (min-width: 768px)`): de 4 a **3
  columnas** (Miguel, D-55). Para no cambiar lo que no se pidió (lección 14),
  `.rejilla.cerca` (tarjetas de «Rutas que empiezan o terminan cerca») se queda
  en 4 columnas en computadora, como en D-53.

## Nuevos (24)

| Selectores | Para qué |
|---|---|
| `.tarjeta-ruta.partida`, `.tarjeta-ruta.partida .tarjeta-nombre`, `.tarjeta-ruta.partida .tarjeta-nombre > span`, `.tarjeta-ruta.partida .tarjeta-nombre b`, `.lado`, `.lado svg`, `.insignia` | Tarjeta partida (D-55, 2), traducidos de `.tarjeta.partida…` de la maqueta |
| `.bienvenida`, `.bienvenida-cabeza`, `.bienvenida h2`, `.bienvenida .cerrar`, `.bienvenida .recuerda`, `.pasos`, `.pasos li`, `.num`, `.pasos li:nth-child(3) .num`, `.acciones`, `.acciones button`, `.acciones .lleno`, `.acciones .borde` | Bienvenida «Así funciona» (D-55, 1), iguales a la maqueta |
| `.acciones button:focus-visible`, `.bienvenida .cerrar:focus-visible` | Foco visible del teclado, como el resto de la app |
| `.app.menu-abierto .bienvenida` | Con el menú abierto la bienvenida no se ve (no lo tapa; en computadora quedaría encima del menú) |
| `.rejilla.cerca` | Mantiene en 4 columnas las tarjetas de «cerca» en computadora |
