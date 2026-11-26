# Fallas pendientes de revisión (se revisan con Miguel el domingo 29 nov 2026)

Esta lista junta las fallas que costaron retrabajo o que Miguel corrigió. No se convierten en lección al momento: se acumulan aquí y el domingo 29 nov 2026 Miguel decide, una por una, si se vuelve lección nueva, si suma una ocurrencia a una lección existente de `CLAUDE.md`, o si se descarta. Pedido por Miguel el 26 nov 2026, 1:57 pm (hora de México).

Cómo se agrega una: la registra un subagente, con fecha y hora sacadas de `TZ=America/Mexico_City date` o de un registro, nunca de memoria. Ninguna se sube a `CLAUDE.md` ni a `standards.md` sin el sí de Miguel.

## F-01 · El visual de aprobación se ató al tipo de cambio, no a lo que se aprueba

- **Fecha:** 25 nov 2026, 11:54 pm (hora del mensaje de Miguel, según el hook `reloj`).
- **Bloque · Tarea:** B3 · R-03 fase 1 (D-76).
- **Qué pasó:** Claude escribió el criterio medible de D-76 y pidió el sí de Miguel solo con texto. Miguel preguntó: «¿Esperando antes de construir siempre generas el visual para mí? ¿Eso no es una lección aprendida?». La regla escrita (D-54, maqueta primero) solo cubre cambios de pantalla; D-76 cambia un dato (puntos en un mapa), así que Claude la aplicó al pie de la letra. Al hacer el visual pedido (mapa en `docs/evidencia/d76/`, 26 nov, 1:21 a 1:26 pm) salió un hallazgo que el texto no mostraba (un punto falso, «SAN JUAN DEL RÍO» → «Unidad Deportiva San Juan del Río»), y Miguel aprobó con dos ajustes.
- **Causa raíz:** la regla de visual se ató al tipo de cambio (pantalla) y no a lo que se aprueba (algo que se ve en un mapa o en pantalla).
- **Lección relacionada en CLAUDE.md:** ninguna numerada (D-54 y la memoria «maqueta primero»).
- **Regla propuesta:** toda aprobación de algo que se ve en un mapa o en pantalla lleva su visual (capturas a 390 y 1280 px), aunque no cambie la app.
- **Control posible:** en el prompt de aprobación, revisar que el mensaje que pide el sí traiga capturas cuando la decisión mueve puntos o pantallas.
- **Estado:** PENDIENTE (domingo 29 nov).

## F-02 · El guion de validación restauró en orden equivocado y dejó un defecto puesto

- **Fecha:** 26 nov 2026, entre la 1:34 pm (primera generación con D-76, según el hook `hora-real`) y la 1:45 pm (`date`, al anotar el resultado en D-76).
- **Bloque · Tarea:** B3 · R-03 fase 1 (D-76).
- **Qué pasó:** el guion `docs/evidencia/d76/validar-defectos.mjs` pone defectos a propósito y luego restaura los archivos. Cuando un defecto cambiaba dos veces el mismo archivo (`scripts/cruces.mjs`), restauraba en el orden equivocado y dejó puesto el primer cambio: el ajuste A quedó desactivado. Lo delató la corrida de control (c2), que falló cuando debía pasar, y los conteos que cambiaron (dudosos de 8 a 4). Se arregló restaurando en orden inverso y comparando al final la huella sha256 de `scripts/cruces.mjs` y `scripts/datos-app.mjs` contra la de antes; se repitió todo desde cero. No llegó a ningún commit.
- **Causa raíz:** el guion de validación no comprobaba que el código quedara igual que antes; la restauración se dio por buena sin medirla.
- **Lección relacionada en CLAUDE.md:** 17 (validación con el defecto puesto que corrió contra otro estado) y 15.
- **Regla propuesta:** todo guion que pone defectos a propósito restaura en orden inverso y termina comparando la huella sha256 de cada archivo tocado contra la de antes; si no coincide, lo dice fuerte.
- **Control posible:** `scripts/validar-defecto.mjs` (ya propuesto en la lección 17) con esa comparación incluida.
- **Estado:** PENDIENTE (domingo 29 nov).
