// Íconos SVG propios (sin fuentes ni imágenes externas). Tomados de la muestra patrón (D-30).
export const ICONO_CERRAR =
  '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#12262d" stroke-width="2.6" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>';

// Botón de menú (E-02): tres líneas.
export const ICONO_MENU =
  '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>';

// Pestañas «Rutas» y «Calcula tu ruta» (M-06).
export const ICONO_RUTAS =
  '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="6" cy="18" r="2.5"/><circle cx="18" cy="6" r="2.5"/><path d="M8.5 18H15a3 3 0 0 0 0-6H9a3 3 0 0 1 0-6h6.5" stroke-dasharray="3 3"/></svg>';
export const ICONO_CALCULA =
  '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>';


// D-50 / D-52: camioncito de la tarjeta, más sencillo (pedido de Miguel, 20 nov
// 2026): una placa blanca con el camión de frente y la insignia (R1, R9B, T62…).
// La insignia toma el color --ci (contraste AA sobre blanco). Solo texto de la
// app: la insignia se limpia a letras y números.
export function camioncito(texto: string): string {
  const seguro = texto.replace(/[^A-Z0-9]/g, '');
  return (
    '<span class="camion">' +
    '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><rect x="5" y="3" width="14" height="14" rx="3"/><path d="M5 10h14M8 20v-3M16 20v-3"/></svg>' +
    `<strong>${seguro}</strong></span>`
  );
}

// D-52: íconos del detalle. Camión de frente chico (inicio y fin del recorrido)
// y reloj (horario). Toman el color del texto (currentColor).
export const ICONO_BUS_CHICO =
  '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><rect x="5" y="3" width="14" height="14" rx="3"/><path d="M5 10h14"/><circle cx="9" cy="13.5" r=".7" fill="currentColor"/><circle cx="15" cy="13.5" r=".7" fill="currentColor"/><path d="M8 20v-3M16 20v-3"/></svg>';
export const ICONO_RELOJ =
  '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/></svg>';

// D-53, 1: botón redondo de paradas con el camión de frente (el del pin, D-49).
// Toma el color del botón (currentColor) y la ventana en el color de fondo.
export function iconoBus(ventana = '#fff'): string {
  return (
    '<svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true"><rect x="4.5" y="2.5" width="15" height="15" rx="3" fill="currentColor"/>' +
    `<rect x="6.5" y="4.6" width="11" height="5.6" rx="1" fill="${ventana}"/><circle cx="8.3" cy="13.8" r="1.2" fill="${ventana}"/><circle cx="15.7" cy="13.8" r="1.2" fill="${ventana}"/>` +
    '<rect x="6" y="17.5" width="3" height="3" rx=".7" fill="currentColor"/><rect x="15" y="17.5" width="3" height="3" rx=".7" fill="currentColor"/></svg>'
  );
}

// D-53, ajustes 2 y 3 (Miguel, 20 nov 2026): parada como círculo levantado con el
// camión de frente adentro, y una guía de puntitos que baja al punto exacto de la
// parada. Distinto del pin. Nunca se unen las paradas entre sí (sin R-07 sería un
// recorrido inventado, regla 1). Punto exacto: (13, 41.5).
export const PARADA_CIRCULO =
  '<svg width="26" height="44" viewBox="0 0 26 44" aria-hidden="true"><line x1="13" y1="25" x2="13" y2="40" stroke="#0d7a72" stroke-width="2" stroke-dasharray="0.1 3.4" stroke-linecap="round"/><circle cx="13" cy="41.5" r="2.2" fill="#0d7a72" stroke="#fff" stroke-width="1"/><circle cx="13" cy="13" r="11" fill="#0d7a72" stroke="#fff" stroke-width="2.5"/><rect x="8" y="6.5" width="10" height="10" rx="2" fill="#fff"/><rect x="9.3" y="7.9" width="7.4" height="3.6" rx=".6" fill="#0d7a72"/><circle cx="10.3" cy="14.2" r=".9" fill="#0d7a72"/><circle cx="15.7" cy="14.2" r=".9" fill="#0d7a72"/><rect x="8.9" y="16.5" width="2" height="2" rx=".5" fill="#fff"/><rect x="15.1" y="16.5" width="2" height="2" rx=".5" fill="#fff"/></svg>';

// «¿A dónde quieres ir?» (D-53, 7): lupa del botón de arriba.
export const ICONO_LUPA =
  '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0d7a72" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>';

// Ícono de paradas del detalle (D-52 en la maqueta): dos puntos unidos.
export const ICONO_PARADAS_DETALLE =
  '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="6" cy="6" r="2"/><circle cx="6" cy="18" r="2"/><path d="M6 8v8"/></svg>';

// D-57 (maqueta aprobada, 20 nov 2026): «Buscar mi parada más cercana» con una mira
// de ubicación; el botón de ícono que vuelve a buscar (ubicación con flecha de
// actualizar), y la flechita «›» que dice que la línea de la parada se toca.
export const ICONO_UBICAR =
  '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="3.5"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/><circle cx="12" cy="12" r="8"/></svg>';
export const ICONO_ACTUALIZAR =
  '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 12a8 8 0 1 1-2.34-5.66"/><path d="M20 4v4h-4"/><circle cx="12" cy="12" r="2.6" fill="currentColor" stroke="none"/></svg>';
export const ICONO_FLECHA =
  '<svg class="flecha" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 6 6 6-6 6"/></svg>';
