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

// D-49: pin de parada propio con el camión de frente (referencia: la señal de
// parada de autobús en México), en el color de la app, no en el de la señal.
export const PIN_PARADA =
  '<svg width="30" height="38" viewBox="0 0 30 38" aria-hidden="true"><path d="M15 37s12-12.2 12-22A12 12 0 0 0 3 15c0 9.8 12 22 12 22z" fill="#0d7a72" stroke="#fff" stroke-width="2"/><rect x="8" y="6" width="14" height="13" rx="2.6" fill="#fff"/><rect x="9.8" y="8" width="10.4" height="5" rx="1" fill="#0d7a72"/><path d="M15 8v5" stroke="#fff" stroke-width="1.2"/><circle cx="11.2" cy="16.2" r="1.1" fill="#0d7a72"/><circle cx="18.8" cy="16.2" r="1.1" fill="#0d7a72"/><rect x="9.4" y="18.4" width="2.8" height="2.4" rx=".6" fill="#fff"/><rect x="17.8" y="18.4" width="2.8" height="2.4" rx=".6" fill="#fff"/></svg>';

// Control de la capa de paradas (M-05): punto con anillo.
export const ICONO_PARADAS =
  '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="2.5" fill="currentColor"/></svg>';

// D-50: camioncito de la tarjeta, de lado, tipo logo vectorial, con la insignia
// (R1, R9B, T62…) en el costado. Carrocería blanca sobre el color de la tarjeta;
// la insignia toma el color --ci (contraste AA sobre blanco). Solo texto de la app: sin datos
// del usuario dentro del SVG.
export function camioncito(texto: string): string {
  const seguro = texto.replace(/[^A-Z0-9]/g, '');
  return (
    '<svg class="camion" width="76" height="40" viewBox="0 0 76 40" aria-hidden="true">' +
    '<rect x="2" y="3" width="70" height="28" rx="7" fill="#fff"/>' +
    '<path d="M62 6h5a3 3 0 0 1 3 3v9h-8z" style="fill:var(--c)" opacity=".35"/>' +
    '<rect x="2" y="25" width="70" height="3" style="fill:var(--c)" opacity=".25"/>' +
    `<text x="32" y="22.5" text-anchor="middle" font-size="16" font-weight="800" font-family="system-ui,-apple-system,sans-serif" style="fill:var(--ci)">${seguro}</text>` +
    '<circle cx="17" cy="32" r="5" fill="#12262d" stroke="#fff" stroke-width="2"/>' +
    '<circle cx="57" cy="32" r="5" fill="#12262d" stroke="#fff" stroke-width="2"/>' +
    '</svg>'
  );
}
