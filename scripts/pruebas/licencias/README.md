# Ejemplos de prueba del candado de licencias

Solo sirven para `scripts/pruebas/licencias.test.mjs`. Los paquetes no existen.
Cada carpeta trae su `package.json`, su `package-lock.json` y su `LICENCIAS.md`.

| Carpeta | Qué tiene | Resultado esperado |
|---|---|---|
| `correcta/` | Una dependencia MIT anotada; una indirecta GPL | Pasa, con aviso por la indirecta |
| `no-permitida/` | Una dependencia directa GPL-3.0 | Falla |
| `sin-anotar/` | Una dependencia «MIT OR Apache-2.0» que no está en su `LICENCIAS.md` | Falla |
