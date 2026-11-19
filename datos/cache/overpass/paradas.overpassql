/* N-08 (D-16): paradas de autobús que ya existen en OpenStreetMap dentro del
   municipio de San Juan del Río, Querétaro. Una sola consulta, acotada al
   municipio; la respuesta se guarda en este repositorio y no se vuelve a pedir
   (HANDOFF §11.6). */
[out:json][timeout:60];
area["boundary"="administrative"]["admin_level"="4"]["name"="Querétaro"]->.edo;
rel(area.edo)["boundary"="administrative"]["admin_level"="6"]["name"="San Juan del Río"];
map_to_area->.sjr;
(
  node(area.sjr)["highway"="bus_stop"];
  node(area.sjr)["public_transport"="platform"]["bus"="yes"];
);
out body;
