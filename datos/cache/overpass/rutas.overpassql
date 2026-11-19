/* I-04 (lote de investigación, D-22): relaciones de ruta de autobús que ya
   existen en OpenStreetMap con algún miembro dentro del municipio de San Juan
   del Río, Querétaro. Una sola consulta; la respuesta se guarda en este
   repositorio y no se vuelve a pedir (HANDOFF §11.6). Solo etiquetas y lista
   de miembros (sin geometría). Primer intento el 19 nov 2026, 12:16 am:
   error 502 del servidor con una consulta más pesada; un solo reintento con
   esta versión ligera. */
[out:json][timeout:90];
area["boundary"="administrative"]["admin_level"="4"]["name"="Querétaro"]->.edo;
rel(area.edo)["boundary"="administrative"]["admin_level"="6"]["name"="San Juan del Río"];
map_to_area->.sjr;
rel(area.sjr)["type"="route"]["route"="bus"];
out body;
