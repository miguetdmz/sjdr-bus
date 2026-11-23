# D-56 fase 2 · Maqueta «Orden de resultados y nombres repetidos» · criterios (escritos antes)

**Pedido (Miguel, 23 nov 2026, 2:59 pm):** «Sí, haz la maqueta» de la fase 1 recomendada:
orden nuevo de la lista y nombres repetidos con su distancia. Base: la maqueta aprobada
`../d56f2-resultados/` (copia). Solo cambia el orden de la lista y cómo se ven los
repetidos (lección 14).

## Criterios
- **o1. Orden.** La lista se ordena por:
  1. cómo coincide el nombre: primero los que **empiezan** con lo escrito, luego los que
     tienen una **palabra** que empieza así, al final los que solo lo **contienen**;
  2. dentro de cada grupo, primero los de **inicio o fin de ruta**; luego por tipo, en
     este orden (PROPUESTA, para el sí de Miguel): Terminal, Hospital, Clínica, Plaza
     comercial, Mercado, Gobierno, Supermercado, Tienda, Servicio público, Banco,
     Cultura, Hotel, Deportivo, Zona industrial, Ciudad, Localidad, Colonia,
     Fraccionamiento, Barrio, Escuela, Templo, Centro penitenciario, Parque;
  3. al final, alfabético.
  Nunca por cercanía a ti, salvo entre lugares con el mismo nombre.
- **o2. Mismo lugar dos veces.** Si OSM trae el mismo nombre a **100 m o menos**, es el
  mismo lugar (dibujado como punto y como área): se ve una sola vez. Medido en la
  descarga del 22 nov: los pares del mismo nombre están a 2–94 m (mismo lugar) o a
  524 m o más (lugares distintos), salvo «Área verde» y «Anónimo», que son nombres
  genéricos.
- **o3. Repetidos que sí son lugares distintos** (p. ej. «Bodega Aurrera» ×3, a 0.9–2.2 km
  entre sí) se ven todos, cada uno con su distancia en el texto chico: «a 1.2 km de ti»
  con tu ubicación; sin ella, «a 1.2 km del Centro» (el «Centro» de inicio o fin de
  ruta). Entre ellos, el más cercano primero. Los lugares con nombre único no cambian.
- **o4.** Igual en «¿Desde dónde sales?».
- **o5.** Nada más cambia: 5 visibles y «Ver 5 más», filas, tipos, fuente, colores.
- **o6.** Cabe a 390, 320 y 1280 px: sin scroll de lado ni textos cortados (medido con
  `capturar.mjs`; con un defecto puesto debe fallar, lección 15).
