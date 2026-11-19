# SJDR Bus · ¿Cuándo pasa mi camión en San Juan del Río?

> Nombre provisional. Proyecto en construcción: todavía no hay app publicada.

App ciudadana y de código abierto para estimar cuándo pasa el autobús urbano
en San Juan del Río, Querétaro, sobre el mapa real de la ciudad.

**Iniciativa ciudadana independiente.** No está afiliada a la Agencia de
Movilidad del Estado de Querétaro (AMEQ), a Qrobús ni a ningún concesionario
de transporte. Los tiempos que muestra son **estimados** y así se etiquetan.

## Por qué existe

El feed GTFS oficial de Qrobús lista las 42 rutas de San Juan del Río, pero
sin viajes, sin paradas y sin horarios: para cualquier app que lo consuma,
San Juan es una ciudad sin camiones. Por eso el producto principal de este
proyecto es **el dato**: un GTFS propio de San Juan (GTFS-SJR), abierto,
versionado y validado. La app es la forma de usarlo.

## Principios

- **Honestidad del dato.** Cada cifra lleva su fuente y su estado. Los tiempos
  dicen ESTIMADO hasta que se miden en campo.
- **Mapa real, $0.** Leaflet + OpenStreetMap. Sin Google Maps.
- **Precisión por tramo.** A = medido en campo con GPS · B = enrutado por
  calles, por medir · C = esquemático, por confirmar.
- **Participación ciudadana.** Los recorridos GPS grabados por pasajeros
  voluntarios convierten estimados en tiempos medidos.

## Estructura

| Carpeta | Contenido |
|---|---|
| `docs/` | Plan, decisiones, contrato de origen y revisiones |
| `datos/gtfs-sjr/` | El feed GTFS-SJR y su registro de cambios |
| `scripts/` | Herramientas de construcción y la puerta de calidad |
| `web/` | La app web progresiva (a partir del bloque B2) |

## Estado

Ver [`docs/PLAN.md`](docs/PLAN.md).

## Contribuir

Ver [`CONTRIBUTING.md`](CONTRIBUTING.md). Si viajas en una ruta de San Juan y
quieres grabar su recorrido, abre un issue con la plantilla «Dato de ruta».

## Licencias

- Código: MIT ([`LICENSE`](LICENSE)).
- Datos del GTFS-SJR: Open Database License (ODbL) 1.0
  ([`datos/LICENSE`](datos/LICENSE)), porque se derivan de OpenStreetMap.
- Mapa: © colaboradores de OpenStreetMap.
