#!/usr/bin/env node
// Lote de investigación (D-22): I-02 matriz 42 rutas × fuentes e I-03 Pareto de
// cobertura. Lee solo archivos del repositorio; no consulta ningún servicio.
// Como un estudio de capacidad de proveedores: qué fuente surte qué ruta y con
// qué confianza, antes de decidir dónde invertir.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { leerCSV } from './lib/csv.mjs';

const raiz = new URL('..', import.meta.url).pathname;
const leer = (r) => readFileSync(`${raiz}${r}`, 'utf8');

const rutas = leerCSV(`${raiz}datos/gtfs-sjr/routes.txt`);
const fichas = new Map(JSON.parse(leer('datos/fichas/rutas.json')).rutas.map((f) => [f.route_id, f]));
const pet = leerCSV(`${raiz}datos/investigacion/pet-2022-sjr-urbano.csv`);

// --- Cómo se cruza el PET 2022 con el inventario ---------------------------
// Mismo número de ruta Y mismo origen – destino una vez normalizado (sin
// acentos, mayúsculas, signos ni lo que va entre paréntesis). Única equivalencia
// aceptada: «Central Camionera» = «Central de Autobuses» (el mismo lugar con
// otro nombre). Si el nombre no coincide, NO se supone que es la misma ruta.
const norm = (s) =>
  s.normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/ª/g, 'a').replace(/\([^)]*\)/g, '')
    .toUpperCase().replace(/\s+/g, ' ').replace(/CENTRAL CAMIONERA/g, 'CENTRAL DE AUTOBUSES').replace(/[^A-Z0-9]/g, '');
const numeroPet = (n) => {
  const m = n.match(/^(\d+)(?:-?([A-Z]))?$/);
  return m[1] === '23' && !m[2] ? '23' : m[1].padStart(3, '0') + (m[2] ?? '');
};

// Señales de error en la fuente: cifras idénticas a las de otra ruta.
const firma = (p) => [p.ida_km, p.regreso_km, p.ida_min, p.regreso_min].join('/');
const repetidas = new Set(pet.map(firma).filter((f, i, a) => a.indexOf(f) !== i));

// Intermunicipales: La Sombra de Arteaga, 24 oct 2025 (solo km por sentido).
const SOMBRA_2025 = { 'I-062': { ida_km: '21.69', vuelta_km: '21.23', pag: '38444' }, 'I-023': { ida_km: '18.62', vuelta_km: '18.55', pag: '38439' } };

// GTFS oficial v25: solo nombres de las 40 urbanas (sin viajes ni paradas).
const EN_GTFS_OFICIAL = (r) => r.route_id.startsWith('U-');

// Nota AMEQ 29 sep 2025: itinerario parcial en texto (sin sentido).
const NOTA_AMEQ = { 'U-017': 'extensión de Barrio de la Cruz a la UT', 'U-002': 'mencionada', 'U-040': 'se fusiona con la 48 nueva' };

// I-04: relaciones route=bus de OpenStreetMap (una consulta a Overpass, en caché).
// Se emparejan solo por número (misma regla que el PET: «23» es la U-23 y el resto
// se rellena a 3 cifras). Ninguna dice a qué sentido corresponde, así que se anotan
// en los dos renglones de la ruta como «M» (mapa) SIN subir la confianza (regla 10).
const osmMeta = JSON.parse(leer('datos/cache/overpass/rutas.meta.json'));
const osm = JSON.parse(leer(osmMeta.respuesta)).elements.filter((e) => e.type === 'relation');
const numeroOsm = (e) => {
  const m = (e.tags?.ref ?? e.tags?.name ?? '').match(/^(?:Ruta\s+)?(\d+)([A-Z]?)$/i);
  return m ? numeroPet(m[1] + m[2].toUpperCase()) : null;
};
const OSM_POR_NUMERO = new Map();
for (const e of osm) {
  const n = numeroOsm(e);
  if (n) OSM_POR_NUMERO.set(n, [...(OSM_POR_NUMERO.get(n) ?? []), `rel/${e.id}`]);
}
export const OSM_SIN_RUTA = osm.filter((e) => !numeroOsm(e) || !rutas.some((r) => r.route_short_name === numeroOsm(e)))
  .map((e) => `rel/${e.id} (${e.tags?.name ?? 'sin etiquetas'})`);

const SENTIDOS = [
  ['0', 'ida', 'ida_km', 'ida_min'],
  ['1', 'vuelta', 'regreso_km', 'regreso_min'],
];

const filas = [];
const conflictos = [];
for (const r of rutas) {
  const numero = r.route_short_name;
  const nombre = `${numero} — ${r.route_long_name}`;
  const candidatos = pet.filter((p) => numeroPet(p.ruta) === (numero === '23' ? '23' : numero));
  const igual = candidatos.find((p) => norm(p.origen_destino) === norm(r.route_long_name.replace(/ – /g, ' ').replace(/ \/ /g, ' ')));
  let petFila = null;
  let motivoPet = '';
  if (r.route_id.startsWith('I-')) motivoPet = 'intermunicipal: no está en la tabla urbana del PET';
  else if (!candidatos.length) motivoPet = 'el PET 2022 no trae este número';
  else if (!igual) motivoPet = `el PET 2022 trae el número con otro nombre: «${candidatos.map((c) => c.origen_destino).join('» / «')}»`;
  else if (repetidas.has(firma(igual))) motivoPet = 'el PET 2022 repite exactamente las cifras de otra ruta (posible error de captura)';
  else petFila = igual;
  if (motivoPet && r.route_id.startsWith('U-')) conflictos.push({ nombre, motivo: motivoPet });

  const ficha = fichas.get(r.route_id);
  for (const [dir, sentido, colKm, colMin] of SENTIDOS) {
    const moovit = ficha?.sentidos?.[sentido];
    const s25 = SOMBRA_2025[r.route_id];
    const celdas = {
      gtfs_oficial_v25: EN_GTFS_OFICIAL(r) ? 'N' : '',
      pet_2022: petFila ? 'K T V' : '',
      sombra_2025: s25 ? 'K' : '',
      nota_ameq_2025: NOTA_AMEQ[r.route_id] ? 'I parcial' : '',
      moovit: moovit ? 'P D H' : '',
      osm_relacion: OSM_POR_NUMERO.has(numero) ? `M ${OSM_POR_NUMERO.get(numero).join(' ')}` : '',
    };
    // Confianza del sentido (definida en docs/investigacion/pareto-cobertura.md):
    // alta = oficial con itinerario por calles de ese sentido (hoy, ninguna);
    // media = oficial con km de ese sentido, sin señal de error;
    // baja = solo nombre, solo Moovit o con conflicto.
    let confianza = 'baja';
    let motivo = motivoPet || 'solo nombre';
    if (petFila) { confianza = 'media'; motivo = `PET 2022 pág. ${petFila.pagina}: km, minutos y vehículos de este sentido`; }
    else if (s25) { confianza = 'media'; motivo = `La Sombra de Arteaga 24 oct 2025 pág. ${s25.pag}: km de este sentido`; }
    else if (moovit) motivo += '; solo Moovit como dato por sentido';
    filas.push({
      route_id: r.route_id, numero, sentido: dir, nombre: r.route_long_name, ...celdas,
      km_oficial: petFila ? petFila[colKm] : s25 ? s25[`${sentido}_km`] : '',
      min_oficial: petFila ? petFila[colMin] : '',
      vehiculos_oficial: petFila ? petFila.vehiculos : '',
      moovit_min: moovit ? String(moovit.duracion_min) : '',
      moovit_paradas: moovit ? String(moovit.paradas) : '',
      confianza, motivo,
    });
  }
}

// --- I-02: matriz ------------------------------------------------------------
const COLS = Object.keys(filas[0]);
const csv = (v) => (/[",\n]/.test(String(v)) ? `"${String(v).replace(/"/g, '""')}"` : String(v));
writeFileSync(`${raiz}datos/investigacion/matriz.csv`, [COLS, ...filas.map((f) => COLS.map((c) => f[c]))].map((f) => f.map(csv).join(',')).join('\n') + '\n');

// --- I-03: Pareto de cobertura ----------------------------------------------
const FUENTES = [
  ['pet_2022', 'Programa Estatal de Transporte 2021-2027 (La Sombra de Arteaga, 5 sep 2022)', 'oficial'],
  ['moovit', 'Moovit, consulta nov 2026 (referencia, no es fuente abierta)', 'referencia'],
  ['sombra_2025', 'La Sombra de Arteaga, 24 oct 2025', 'oficial'],
];
const total = filas.length;
const cubre = (col) => filas.filter((f) => f[col]).length;
const orden = FUENTES.map(([c, n, t]) => ({ c, n, t, k: cubre(c) })).sort((a, b) => b.k - a.k);
let acumulado = new Set();
const barras = orden.map(({ c, n, t, k }) => {
  for (const f of filas) if (f[c]) acumulado.add(`${f.route_id}/${f.sentido}`);
  const pct = Math.round((acumulado.size / total) * 100);
  return `| ${n} | ${t} | ${k} | ${acumulado.size} (${pct} %) | ${'█'.repeat(Math.round(k / 4))} |`;
});
const porConfianza = (c) => filas.filter((f) => f.confianza === c);
const contraste = filas.filter((f) => f.min_oficial && f.moovit_min)
  .map((f) => `| ${f.numero} | ${f.sentido === '0' ? 'ida' : 'vuelta'} | ${f.min_oficial} | ${f.moovit_min} | ${Number(f.moovit_min) - Number(f.min_oficial)} |`);
// Rutas piloto: se leen del título de D-06 en docs/DECISIONES.md (no se escriben a mano).
const d06 = leer('docs/DECISIONES.md').match(/^## D-06 .*Rutas piloto: ([^·]+)·/m)[1];
const piloto = d06.match(/\d{3}/g).map((n) => `U-${n}`);

const reporte = `# Pareto de cobertura de fuentes (I-03, D-22)

Generado por \`node scripts/investigacion.mjs\` desde \`datos/investigacion/\`.
No editar a mano. Fecha de las fuentes: ver \`datos/investigacion/fuentes.json\`.

Unidad de medida: **ruta-sentido** (42 rutas × 2 sentidos = ${total}). Regla 10:
cada sentido se cuenta por separado.

## Cobertura con datos por sentido (km, minutos o paradas)

| Fuente | Tipo | Ruta-sentidos que cubre | Acumulado | Gráfica |
|---|---|---|---|---|
${barras.join('\n')}

Sin dato por sentido (solo nombre o conteo): GTFS oficial de Qrobús v25 (40
urbanas, solo nombres), página «Rutas» de Qrobús, nota de la AMEQ del 29 sep 2025
(itinerario parcial de la 17 y de la ruta 48 nueva), La Sombra del 31 mar 2026
(conteos). **Ninguna fuente abierta trae hoy el itinerario por calles de ninguna
ruta completa.**

Relaciones de ruta de OpenStreetMap (I-04, consulta ${osmMeta.consultado.slice(0, 10)}): ${osm.length}
relaciones; ${OSM_POR_NUMERO.size} rutas del inventario con número igual
(${[...OSM_POR_NUMERO.keys()].join(', ')}). Ninguna dice qué sentido es, así que
**no suben la confianza** de ningún sentido (regla 10); quedan como mapa por
revisar, sin convertirse en trazo. Sin ruta del inventario: ${OSM_SIN_RUTA.join('; ')}.

## Confianza por ruta-sentido

- **Alta** (oficial con itinerario por calles de ese sentido): ${porConfianza('alta').length}.
- **Media** (oficial con km de ese sentido, sin señal de error): ${porConfianza('media').length}.
- **Baja** (solo nombre, solo Moovit o con conflicto): ${porConfianza('baja').length}.

## Conflictos entre el inventario y el PET 2022 (no se suponen iguales)

| Ruta | Motivo |
|---|---|
${conflictos.map((c) => `| ${c.nombre} | ${c.motivo} |`).join('\n')}

## Contraste PET 2022 contra Moovit (minutos por sentido, ESTIMADO)

Paso 2 de D-22. Diferencia = Moovit − PET. El PET es de 2022; Moovit, de nov 2026.

| Ruta | Sentido | PET 2022 (min) | Moovit (min) | Diferencia |
|---|---|---|---|---|
${contraste.join('\n')}

## Orden propuesto para el lote siguiente (recorridos estimados)

1. Las 5 rutas piloto (D-06): ${piloto.map((id) => filas.find((f) => f.route_id === id && f.sentido === '0')).map((f) => `${f.numero} (${f.confianza})`).join(', ')}.
2. El resto de las rutas de confianza media, de más a menos vehículos según el
   PET 2022 (más unidades, más personas usuarias: ESTIMADO).
3. Al final, las de confianza baja, después de aclarar sus conflictos.
`;
mkdirSync(`${raiz}docs/investigacion`, { recursive: true });
writeFileSync(`${raiz}docs/investigacion/pareto-cobertura.md`, reporte);
console.log(`INVESTIGACIÓN: ${filas.length} ruta-sentidos; alta ${porConfianza('alta').length}, media ${porConfianza('media').length}, baja ${porConfianza('baja').length}; ${conflictos.length} conflictos`);
