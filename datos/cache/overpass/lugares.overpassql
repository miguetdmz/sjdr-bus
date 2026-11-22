/* R-03 (D-34): lugares con nombre del municipio de San Juan del Río,
   Querétaro, para proponer la coordenada de los extremos de ruta que no la
   tienen. Una sola consulta, en sesión de día; la respuesta completa queda en
   referencias/ (fuera de git) y al repositorio entra solo lo extraído, con su
   huella sha256 (lección 8). Toda propuesta la confirma Miguel. */
[out:json][timeout:120];
area["boundary"="administrative"]["admin_level"="4"]["name"="Querétaro"]->.edo;
rel(area.edo)["boundary"="administrative"]["admin_level"="6"]["name"="San Juan del Río"];
map_to_area->.sjr;
(
  nwr(area.sjr)["amenity"~"^(bus_station|university|college|hospital|clinic|prison|marketplace)$"]["name"];
  nwr(area.sjr)["public_transport"="station"]["name"];
  nwr(area.sjr)["place"~"^(suburb|neighbourhood|quarter|village|hamlet|locality|town|city)$"]["name"];
  nwr(area.sjr)["landuse"="residential"]["name"];
  nwr(area.sjr)["landuse"="industrial"]["name"];
);
out tags center;
