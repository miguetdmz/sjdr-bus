/* R-03 (D-32): calles con nombre del municipio de San Juan del Río,
   Querétaro, con su trazo. Sirven para separar los cruces de las listas
   oficiales (R-01) y ubicar cada cruce (R-04). Una sola consulta, en sesión
   de día; la respuesta completa queda en referencias/ (fuera de git) y al
   repositorio entra solo lo extraído, con su huella sha256 (lección 8). */
[out:json][timeout:120];
area["boundary"="administrative"]["admin_level"="4"]["name"="Querétaro"]->.edo;
rel(area.edo)["boundary"="administrative"]["admin_level"="6"]["name"="San Juan del Río"];
map_to_area->.sjr;
way(area.sjr)["highway"~"^(motorway|trunk|primary|secondary|tertiary|unclassified|residential|living_street|road|motorway_link|trunk_link|primary_link|secondary_link|tertiary_link)$"]["name"];
out tags geom;
