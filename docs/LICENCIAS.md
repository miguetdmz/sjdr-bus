# Licencias de dependencias

Regla: dependencias directas solo con licencia MIT, BSD, ISC o Apache-2.0. Cada una
se anota aquí con su versión y para qué se usa. `scripts/licencias.mjs` lo
comprueba en cada `npm run verificar`: falla si una dependencia directa de
`package.json` tiene otra licencia o no aparece en esta tabla (primera
columna, con el nombre exacto del paquete).

| Dependencia | Versión | Licencia | Uso |
|---|---|---|---|
| leaflet | 1.9.4 | BSD-2-Clause | Mapa de la app (D-04) |
| vite | 8.3.8 | MIT | Servidor de desarrollo y compilación de la app (solo desarrollo) |
| typescript | 5.9.3 | Apache-2.0 | Revisión de tipos del código de la app (solo desarrollo) |
| @types/leaflet | 1.9.22 | MIT | Tipos de Leaflet para TypeScript (solo desarrollo) |

Herramientas que no son dependencias de `package.json` (se descargan o instalan
aparte; no se suben al repositorio):

| Herramienta | Versión | Licencia | Uso |
|---|---|---|---|
| Validador GTFS de MobilityData (`gtfs-validator-cli.jar`) | 8.0.1 | Apache-2.0 | Revisa el feed GTFS-SJR en la puerta de calidad. Lo descarga `scripts/validar-gtfs.mjs` de la página oficial de versiones de MobilityData en GitHub y comprueba su huella SHA-256 |
| Java (OpenJDK) | 21 en GitHub Actions; 27 en la computadora de Miguel (Homebrew, `brew install openjdk`) | GPL-2.0 con «Classpath Exception» | Solo para correr el validador. No se distribuye con el proyecto |
| gitleaks | 8.x | MIT | Busca secretos en la puerta de calidad |
| Playwright con Chromium | la del ambiente | Apache-2.0 (Chromium: BSD-3-Clause) | Convierte los íconos SVG de la app a PNG (`scripts/iconos-pwa.mjs`, M-07). Solo se corre cuando cambia el dibujo; los PNG se guardan en el repositorio |

Servicios y datos de terceros (no son dependencias de código):

| Servicio | Licencia o política | Uso |
|---|---|---|
| OpenStreetMap (datos y teselas) | ODbL; política de uso de teselas | Mapa de la app; base de los trazos |
| OSRM público | Servicio de cortesía, sin garantía | Solo al construir el dato (HANDOFF §11.6) |
| Nominatim | Política de uso: máximo 1 petición por segundo | Solo al construir el dato |
| Overpass API | Política de uso justa | Solo al construir el dato |
