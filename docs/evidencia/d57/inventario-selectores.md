# D-57 · Inventario de selectores de `web/src/estilos.css` (lección 13)

Comparación de la versión anterior (`HEAD` = f3b4681) contra la de D-57, con el
mismo método que D-55 (script que quita comentarios y compara los selectores;
corrido el 20 nov 2026). Estilos editados solo por texto exacto.

## Se fueron

Ninguno. D-57 solo agrega reglas.

## Nuevos (14)

| Selectores | Para qué |
|---|---|
| `.mi-parada`, `.mi-parada .nota` | Bloque de la parada más cercana, arriba de «¿A dónde quieres ir?»; el aviso de error queda junto al botón |
| `.parada-hallada`, `.ver-parada`, `.ver-parada svg`, `.ver-parada b`, `.ver-parada small`, `.ver-parada .flecha` | Línea tocable de la parada hallada, igual a la maqueta |
| `.otra`, `.otra:disabled` | Botón de ícono que vuelve a buscar |
| `.ver-parada:focus-visible`, `.otra:focus-visible` | Foco visible del teclado, como el resto de la app |

`.ubicacion` (el botón grande) se reusa tal cual; solo cambia su texto e ícono.
