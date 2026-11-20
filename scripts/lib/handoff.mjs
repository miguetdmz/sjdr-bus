// Lee tablas de docs/HANDOFF.md para que las pruebas comparen los datos del feed
// contra su fuente escrita (como comparar una pieza contra su plano).
import { readFileSync } from 'node:fs';

// D-36 (Miguel, conocimiento local, 19 nov 2026): rutas que YA NO EXISTEN aunque
// HANDOFF §4 y la página oficial de Qrobús (19 nov 2026) aún las listan. HANDOFF
// no se edita (contrato de origen): la baja se aplica aquí, en su único punto de lectura.
export const RUTAS_DADAS_DE_BAJA = {
  '031': 'D-36: «Pedregoso – PITSA» ya no existe (Miguel, conocimiento local, 19 nov 2026)',
  '044': 'D-36: «Valle Dorado II – Centro» ya no existe (Miguel, conocimiento local, 19 nov 2026)',
  '024C': 'D-39: «Las Torres – Central de Autobuses» ya no existe (Miguel, conocimiento local, 19 nov 2026)',
};
const vigente = ({ numero }) => !(numero in RUTAS_DADAS_DE_BAJA);

// D-37 (Miguel, 19 nov 2026): nombres corregidos sobre el de HANDOFF §4 y la
// página oficial. El lugar se llama «Visthá», no «Visthá (CERESO)».
export const NOMBRES_CORREGIDOS = {
  '036': { nombre: 'Visthá – 5 de Mayo', antes: 'Visthá (CERESO) – 5 de Mayo', decision: 'D-37' },
};
const corregirNombre = (r) => (NOMBRES_CORREGIDOS[r.numero] ? { ...r, nombre: NOMBRES_CORREGIDOS[r.numero].nombre } : r);

const handoff = () => readFileSync(new URL('../../docs/HANDOFF.md', import.meta.url), 'utf8');

// Filas de la primera tabla de la sección que empieza con «titulo» (p. ej. '## 4.'),
// como listas de celdas sin espacios sobrantes. Omite encabezado y separador.
export function tablaDeSeccion(titulo) {
  const texto = handoff();
  const inicio = texto.indexOf(`\n${titulo}`);
  if (inicio < 0) throw new Error(`no existe la sección «${titulo}» en HANDOFF.md`);
  const resto = texto.slice(inicio + 1);
  const lineas = resto.split('\n');
  const filas = [];
  let enTabla = false;
  for (const linea of lineas.slice(1)) {
    if (/^#{2,3} /.test(linea)) break;
    if (linea.startsWith('|')) {
      enTabla = true;
      filas.push(linea.split('|').slice(1, -1).map((c) => c.trim()));
    } else if (enTabla) break;
  }
  return filas.slice(2);
}

// Las 39 rutas vigentes de HANDOFF §4 (42 menos las bajas de D-36 y D-39), en orden: {numero, nombre, tipo}.
// Quita la marca «`[CORREGIDO → D-xx]`», que no es parte del nombre ni del tipo.
export function inventario() {
  return tablaDeSeccion('## 4.').map(([numero, nombre, tipo]) => ({
    numero,
    nombre,
    tipo: tipo.replace(/`\[CORREGIDO[^\]]*\]`/, '').trim(),
  })).filter(vigente).map(corregirNombre);
}

// Números de las 10 rutas con ficha verificada (primera columna de HANDOFF §5.1).
export function numerosVerificados() {
  return tablaDeSeccion('### 5.1').map(([ruta]) => ruta.split(' ')[0]);
}

// Números de las 29 rutas vigentes de solo inventario (párrafo de HANDOFF §5.3), con la
// marca «(intermunicipal)» donde la lleva: [{numero, intermunicipal}].
export function numerosSoloInventario() {
  const texto = handoff();
  const parrafo = texto.split('\n### 5.3')[1].split('\n\n')[1];
  return [...parrafo.matchAll(/\b(\d{2,3}[A-Z]?)\b( \(intermunicipal\))?/g)].map((m) => ({
    numero: m[1],
    intermunicipal: Boolean(m[2]),
  })).filter(vigente);
}

// Cifras por sentido de HANDOFF §5.1: {numero: {ida: {paradas, duracion_min}, vuelta: {…}, horario}}.
export function fichasPorSentido() {
  const resultado = {};
  for (const [ruta, paradas, duracion, horario] of tablaDeSeccion('### 5.1')) {
    const [pi, pv] = paradas.split('/').map((x) => Number(x.trim()));
    const [, di, dv] = duracion.match(/^(\d+) \/ (\d+) min$/).map(Number);
    resultado[ruta.split(' ')[0]] = {
      ida: { paradas: pi, duracion_min: di },
      vuelta: { paradas: pv, duracion_min: dv },
      horario,
    };
  }
  return resultado;
}
