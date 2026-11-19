# Cómo contribuir

Gracias por querer ayudar. Este proyecto vive de dos cosas: **datos honestos**
y **trabajo de campo**.

## Formas de ayudar

1. **Grabar un recorrido.** Si viajas en una ruta de San Juan del Río como
   pasajero, puedes grabar el recorrido con una app de GPS (por ejemplo, GPS
   Logger o Traccar Client) y marcar cada parada al pasar. Abre un issue con la
   plantilla «Dato de ruta». No grabes ni publiques datos del conductor
   (nombre, foto o placa).
2. **Reportar un dato incorrecto.** Una parada que no existe, un nombre mal
   escrito o un trazo que no sigue la calle real: plantilla «Dato de ruta».
3. **Reportar un error de la app:** plantilla «Error en la app».
4. **Código.** Lee `CLAUDE.md` y `docs/PLAN.md` antes de proponer cambios.

## Reglas para cualquier cambio

- Cada cifra lleva su fuente (campo, OSM, AMEQ) y su fecha. Nada simulado se
  presenta como real.
- Sin Google Maps ni servicios de Google. Mapa: Leaflet + OpenStreetMap.
- La app nunca consulta OSRM, Nominatim ni Overpass en vivo.
- No copies datos de apps comerciales (Moovit, Google, etc.) al repositorio.
  Única excepción: las cifras resumen por sentido descritas en
  `docs/DECISIONES.md` D-07, siempre con su etiqueta de fuente.
- Dependencias solo con licencia MIT, BSD, ISC o Apache-2.0.
- Antes de abrir un PR, corre `npm run verificar` y confirma que pasa.

## Licencias de lo que aportas

Al contribuir aceptas que tu código se publique bajo MIT y tus datos bajo
ODbL 1.0 (ver `README.md`).

## Convivencia

Trato respetuoso, críticas al dato y no a las personas. Este proyecto es una
iniciativa ciudadana independiente: no representa a la AMEQ, a Qrobús ni a
ningún concesionario.
