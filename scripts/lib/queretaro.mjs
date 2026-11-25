// Marcas de la ciudad de Querétaro (D-33). Viven aquí para que R-01 (calles-oficiales)
// y D-71 (paradas por sentido) usen exactamente la misma regla.
// Calles y lugares de la zona metropolitana de la ciudad de Querétaro, no de San
// Juan del Río. Criterio de Claude con contexto visto en la página (p. ej.
// «5 DE FEBRERO Y CARRETERA A TLACOTE»), [sin verificar con mapa]. Se eligieron
// solo nombres que no aparecen en las listas que no los mezclan; «Constituyentes»,
// «Zaragoza» y «Ezequiel Montes» quedan fuera porque también existen en San Juan
// o en la región. «A TLACOTE» (carretera) y no «TLACOTE» solo: en San Juan existe
// la calle «Manantiales de Tlacote» (rutas 042 y 046).
export const MARCAS_QUERETARO = [
  'BERNARDO QUINTANA', 'HERCULES', 'EL CERRITO', 'CANDILES', 'PENUELAS', 'TLALOC',
  '5 DE FEBRERO', 'QUERETARO 2000', 'UAQ', 'ITQ', 'TAQ', 'CIMATARIO', 'PUEBLITO',
  'BALVANERA', 'PIE DE LA CUESTA', 'A TLACOTE',
];

const sinAcentos = (s) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();

// Marcas presentes en un texto, con la misma forma de búsqueda de R-01.
export const marcasQueretaro = (texto) => {
  const plano = sinAcentos(texto);
  return MARCAS_QUERETARO.filter((m) => new RegExp(`(^|[^A-Z])${m}([^A-Z]|$)`).test(plano));
};
