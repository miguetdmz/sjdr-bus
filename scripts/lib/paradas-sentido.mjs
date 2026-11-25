// D-71 · Lectura de una respuesta de «Ver ruta»: SOLO el texto (número P-, nombre y orden).
// Sin efectos: lo usan scripts/paradas-sentido.mjs y sus pruebas.
import { marcasQueretaro } from './queretaro.mjs';

// Texto de una parada: «P-3537: LABRADORITA-GALEANA».
export const partirNombre = (s) => {
  const m = /^\s*(P-\d+)\s*:\s*(.*?)\s*$/.exec(s ?? '');
  return m ? { numero: m[1], nombre: m[2] } : { numero: null, nombre: (s ?? '').trim() };
};

// Un sentido a partir de su respuesta cruda (texto tal cual).
export const leerSentido = (crudo) => {
  let datos;
  try { datos = JSON.parse(crudo); } catch { return { estado: 'sin datos', motivo: 'la consulta no devolvió JSON' }; }
  if (datos?.status !== 'ok' || !Array.isArray(datos.paradas)) {
    return { estado: 'sin datos', motivo: `la consulta respondió status «${datos?.status ?? 'sin status'}»` };
  }
  if (datos.paradas.length === 0) return { estado: 'sin datos', motivo: 'la consulta devolvió 0 paradas' };
  // Solo el texto (D-71): nunca otro campo de la respuesta.
  const paradas = datos.paradas.map((p, i) => ({ orden: i + 1, ...partirNombre(p.sNombre) }));
  const marcas = paradas.flatMap((p) => marcasQueretaro(p.nombre).map((m) => `${p.numero ?? 'sin número'} «${p.nombre}» (${m})`));
  if (marcas.length) {
    return { estado: 'sin datos', motivo: `calles de Querétaro (D-33): ${marcas.join('; ')}`, paradas_descartadas: paradas.length };
  }
  const sinNumero = paradas.filter((p) => !p.numero).length;
  return { estado: 'con datos', total: paradas.length, ...(sinNumero ? { sin_numero_oficial: sinNumero } : {}), paradas };
};
