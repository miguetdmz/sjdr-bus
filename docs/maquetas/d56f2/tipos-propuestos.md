# D-56 fase 2 · Tipos de lugar a descargar de OpenStreetMap · APROBADA (Miguel, 22 nov 2026, 9:40 pm: «Sí, sin opcionales»)

Una sola consulta a Overpass, al construir el dato (regla 7), con la respuesta completa
en `referencias/` (fuera de git) y al repositorio solo lo extraído con su huella sha256
(lección 8). Solo lugares **con nombre** dentro del municipio de San Juan del Río. $0.
Lo que ya trae `datos/cache/overpass/lugares.json` se conserva (colonias, localidades,
fraccionamientos, zonas industriales, hospitales, clínicas, mercados, escuelas
superiores, central y terminales).

## Se agregan (propuesta)
| Para buscar… | Etiqueta de OSM | Tipo que se ve |
|---|---|---|
| Plazas comerciales | `shop=mall` | Plaza comercial |
| Supermercados y tiendas grandes | `shop=supermarket`, `shop=department_store` | Supermercado / Tienda |
| Escuelas (primaria a prepa) | `amenity=school` | Escuela |
| Templos | `amenity=place_of_worship` | Templo |
| Bancos | `amenity=bank` | Banco |
| Oficinas de gobierno | `amenity=townhall`, `office=government` | Gobierno |
| Policía, bomberos, correos | `amenity=police`, `fire_station`, `post_office` | Servicio público |
| Cines, teatros, bibliotecas, museos | `amenity=cinema`, `theatre`, `library`, `tourism=museum` | Cultura |
| Parques y deportivos | `leisure=park`, `stadium`, `sports_centre` | Parque / Deportivo |
| Hoteles | `tourism=hotel` | Hotel |

## Opcionales: NO se descargan (Miguel, 9:40 pm)
- Farmacias (`amenity=pharmacy`) y gasolineras (`amenity=fuel`): útiles como referencia,
  pero son muchas y con nombres repetidos («Farmacia Guadalajara»).
- Tiendas de conveniencia (`shop=convenience`, p. ej. OXXO): cientos; **no se proponen**.

## Cuántos son
[sin verificar: se sabe al descargar]. Si una búsqueda no encuentra un lugar (p. ej.
«Cinépolis»), es porque no está en OpenStreetMap con nombre; se dice así en pantalla,
sin inventarlo.
