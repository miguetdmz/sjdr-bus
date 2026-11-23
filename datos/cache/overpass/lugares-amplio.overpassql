/* D-56 fase 2: catálogo amplio de lugares con nombre del municipio de San Juan
   del Río, Querétaro, para «¿A dónde quieres ir?» y «¿Desde dónde sales?».
   Tipos aprobados por Miguel (22 nov 2026, 9:40 pm, «sí, sin opcionales»):
   docs/maquetas/d56f2/tipos-propuestos.md. Conserva los de lugares.overpassql
   (R-03) y agrega los nuevos. Sin farmacias, gasolineras ni tiendas de
   conveniencia. Una sola consulta, al construir el dato (regla 7); la respuesta
   completa queda en referencias/ (fuera de git) y al repositorio entra solo lo
   extraído, con su huella sha256 (lección 8). */
[out:json][timeout:180];
area["boundary"="administrative"]["admin_level"="4"]["name"="Querétaro"]->.edo;
rel(area.edo)["boundary"="administrative"]["admin_level"="6"]["name"="San Juan del Río"];
map_to_area->.sjr;
(
  /* Los de R-03 (lugares.overpassql) */
  nwr(area.sjr)["amenity"~"^(bus_station|university|college|hospital|clinic|prison|marketplace)$"]["name"];
  nwr(area.sjr)["public_transport"="station"]["name"];
  nwr(area.sjr)["place"~"^(suburb|neighbourhood|quarter|village|hamlet|locality|town|city)$"]["name"];
  nwr(area.sjr)["landuse"="residential"]["name"];
  nwr(area.sjr)["landuse"="industrial"]["name"];
  /* Nuevos (D-56 fase 2) */
  nwr(area.sjr)["shop"~"^(mall|supermarket|department_store)$"]["name"];
  nwr(area.sjr)["amenity"~"^(school|place_of_worship|bank|townhall|police|fire_station|post_office|cinema|theatre|library)$"]["name"];
  nwr(area.sjr)["office"="government"]["name"];
  nwr(area.sjr)["tourism"~"^(museum|hotel)$"]["name"];
  nwr(area.sjr)["leisure"~"^(park|stadium|sports_centre)$"]["name"];
);
out tags center;
