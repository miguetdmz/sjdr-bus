# Pareto de cobertura de fuentes (I-03, D-22)

Generado por `node scripts/investigacion.mjs` desde `datos/investigacion/`.
No editar a mano. Fecha de las fuentes: ver `datos/investigacion/fuentes.json`.

Unidad de medida: **ruta-sentido** (42 rutas × 2 sentidos = 78). Regla 10:
cada sentido se cuenta por separado.

## Cobertura con datos por sentido (km, minutos o paradas)

| Fuente | Tipo | Ruta-sentidos que cubre | Acumulado | Gráfica |
|---|---|---|---|---|
| Programa Estatal de Transporte 2021-2027 (La Sombra de Arteaga, 5 sep 2022) | oficial | 60 | 60 (77 %) | ███████████████ |
| Moovit, consulta nov 2026 (referencia, no es fuente abierta) | referencia | 20 | 66 (85 %) | █████ |
| La Sombra de Arteaga, 24 oct 2025 | oficial | 4 | 68 (87 %) | █ |

Sin dato por sentido (solo nombre o conteo): GTFS oficial de Qrobús v25 (40
urbanas, solo nombres), página «Rutas» de Qrobús, nota de la AMEQ del 29 sep 2025
(itinerario parcial de la 17 y de la ruta 48 nueva), La Sombra del 31 mar 2026
(conteos). **Ninguna fuente abierta trae hoy el itinerario por calles de ninguna
ruta completa.**

Relaciones de ruta de OpenStreetMap (I-04, consulta 2026-11-19): 16
relaciones; 14 rutas del inventario con número igual
(008, 009, 001, 005, 007, 025, 041, 039, 004, 014, 002, 23, 028, 011). Ninguna dice qué sentido es, así que
**no suben la confianza** de ningún sentido (regla 10); quedan como mapa por
revisar, sin convertirse en trazo. Sin ruta del inventario: rel/2788750 (sin etiquetas); rel/16646072 (Ruta Suburbana 6).

## Confianza por ruta-sentido

- **Alta** (oficial con itinerario por calles de ese sentido): 0.
- **Media** (oficial con km de ese sentido, sin señal de error): 64.
- **Baja** (solo nombre, solo Moovit o con conflicto): 14.

## Conflictos entre el inventario y el PET 2022 (no se suponen iguales)

| Ruta | Motivo |
|---|---|
| 011 — Loma Alta – Central de Autobuses | el PET 2022 repite exactamente las cifras de otra ruta (posible error de captura) |
| 011B — Loma Alta – Centro | el PET 2022 no trae este número |
| 025 — Las Águilas – Centro | el PET 2022 repite exactamente las cifras de otra ruta (posible error de captura) |
| 037 — La Peña – Centro | el PET 2022 trae el número con otro nombre: «VILLAS DEL PUENTE CENTRO» |
| 038 — La Peña – Central de Autobuses | el PET 2022 trae el número con otro nombre: «VILLAS DEL PUENTE CENTRAL DE AUTOBUSES» |
| 040 — Las Águilas – Universidad Tecnológica (UTSJR) | el PET 2022 trae el número con otro nombre: «FRANCISCO VILLA UNIVERSIDAD TECNOLÓGICA» |
| 046 — Manantiales – Nogales – IMSS | el PET 2022 trae el número con otro nombre: «MANANTIALES IMSS» |

## Contraste PET 2022 contra Moovit (minutos por sentido, ESTIMADO)

Paso 2 de D-22. Diferencia = Moovit − PET. El PET es de 2022; Moovit, de nov 2026.

| Ruta | Sentido | PET 2022 (min) | Moovit (min) | Diferencia |
|---|---|---|---|---|
| 001 | ida | 25 | 20 | -5 |
| 001 | vuelta | 18 | 16 | -2 |
| 002 | ida | 45 | 30 | -15 |
| 002 | vuelta | 45 | 33 | -12 |
| 004 | ida | 25 | 30 | 5 |
| 004 | vuelta | 35 | 22 | -13 |
| 005 | ida | 26 | 29 | 3 |
| 005 | vuelta | 32 | 22 | -10 |
| 009 | ida | 40 | 28 | -12 |
| 009 | vuelta | 35 | 28 | -7 |
| 012 | ida | 25 | 19 | -6 |
| 012 | vuelta | 35 | 23 | -12 |
| 041 | ida | 27 | 23 | -4 |
| 041 | vuelta | 23 | 16 | -7 |

## Orden propuesto para el lote siguiente (recorridos estimados)

1. Las 5 rutas piloto (D-06): 001 (media), 002 (media), 005 (media), 012 (media), 040 (baja).
2. El resto de las rutas de confianza media, de más a menos vehículos según el
   PET 2022 (más unidades, más personas usuarias: ESTIMADO).
3. Al final, las de confianza baja, después de aclarar sus conflictos.
