// SJDR Bus (D-28).
// M-01: mapa real de OpenStreetMap con Leaflet (HANDOFF §11.1). La atribución de
//       OpenStreetMap queda visible en todo momento.
// M-03: selector de ruta y control de sentido (HANDOFF §11.8, D-18).
// M-04: detalle de la ruta elegida, del sentido elegido. Sin trazo en el mapa.
// M-05: paradas de OpenStreetMap como puntos grises, no ligadas a ninguna ruta,
//       con un control para mostrar u ocultar la capa.
// M-06: pestañas «Rutas» y «Calcula tu ruta». La segunda solo muestra un aviso
//       (D-15): no tiene campos de origen y destino ni calcula nada.
// D-48: mapa completo; arriba «¿A dónde vas?» (selector) y sentido; menú lateral
//       izquierdo con el nombre, el detalle y «Calcula tu ruta».
// M-07: instalable (manifiesto e íconos en web/public) y service worker que
//       guarda la app y sus datos, no las teselas del mapa.
import 'leaflet/dist/leaflet.css';
import './estilos.css';
import L from 'leaflet';
import { cargarDatos, type Ruta } from './datos';
import { detalleRuta, type NombreSentido } from './detalle';
import { gruposSelector } from './selector';
import { ICONO_CALCULA, ICONO_CERRAR, ICONO_MENU, ICONO_PARADAS, ICONO_RUTAS, PIN_PARADA } from './iconos';
import { avisoCalcula } from './calcula';
import { cargarParadas, fichaParada, type Parada } from './paradas';

// Plaza Independencia: coordenada verificada de HANDOFF §11.3.
const PLAZA_INDEPENDENCIA: L.LatLngTuple = [20.38883, -99.99639];

const mapa = L.map('mapa', { zoomControl: false, attributionControl: false }).setView(PLAZA_INDEPENDENCIA, 15);

// Teselas estándar de OpenStreetMap: solo las del área visible, con la caché
// normal del navegador (HANDOFF §11.6).
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">Colaboradores de OpenStreetMap</a>',
}).addTo(mapa);

// D-48: sin hoja abajo, la atribución vuelve a la esquina de abajo, siempre visible.
L.control
  .attribution({ position: 'bottomright', prefix: '<a href="https://leafletjs.com">Leaflet</a>' })
  .addTo(mapa);

// --- Paradas de OpenStreetMap (M-05) -----------------------------------------

const capaParadas = L.layerGroup();
// D-49: pin de parada con el camión de frente; la punta marca el lugar.
const iconoParada = L.divIcon({
  className: 'parada-toque',
  html: PIN_PARADA,
  iconSize: [30, 38],
  iconAnchor: [15, 37],
  popupAnchor: [0, -34],
});

function contenidoParada(p: Parada): HTMLElement {
  const f = fichaParada(p);
  const caja = document.createElement('div');
  caja.className = 'ficha-parada';
  const nombre = document.createElement('b');
  nombre.textContent = f.nombre;
  caja.append(nombre);
  for (const linea of f.lineas) {
    const renglon = document.createElement('span');
    renglon.textContent = linea;
    if (linea === f.lineas[2]) renglon.className = 'marca-verificar';
    caja.append(renglon);
  }
  return caja;
}

// La ficha de la parada nunca queda debajo de la barra de arriba, del menú
// lateral abierto o del botón «Ver detalle»: el mapa se mueve lo necesario.
// Se mide contra la caja del mapa: en computadora el mapa empieza debajo de la
// barra y se recorre a la derecha cuando el menú está abierto.
function margenesFicha(): { arriba: L.Point; abajo: L.Point } {
  const m = document.querySelector<HTMLElement>('#mapa')!.getBoundingClientRect();
  const c = document.querySelector<HTMLElement>('#controles')!.getBoundingClientRect();
  const h = document.querySelector<HTMLElement>('#hoja');
  const sobreMapa = c.right > m.left && c.bottom > m.top;
  const arriba = sobreMapa ? c.bottom - m.top : 0;
  const izquierda = h && !h.classList.contains('cerrada') ? Math.max(0, h.getBoundingClientRect().right - m.left) : 0;
  return { arriba: L.point(izquierda + 16, arriba + 16), abajo: L.point(16, 80) };
}

function dibujarParadas(paradas: Parada[]): void {
  for (const p of paradas) {
    const nombre = p.nombre ?? 'Parada sin nombre';
    const ficha = L.popup({ maxWidth: 260 });
    Object.defineProperty(ficha.options, 'autoPanPaddingTopLeft', { get: () => margenesFicha().arriba });
    Object.defineProperty(ficha.options, 'autoPanPaddingBottomRight', { get: () => margenesFicha().abajo });
    ficha.setContent(() => contenidoParada(p));
    L.marker([p.lat, p.lon], { icon: iconoParada, title: nombre, alt: `Parada: ${nombre}`, keyboard: true })
      .bindPopup(ficha)
      .addTo(capaParadas);
  }
}

// Control para mostrar u ocultar la capa: un botón con estado (aria-pressed).
const ControlParadas = L.Control.extend({
  onAdd() {
    const boton = L.DomUtil.create('button', 'control-paradas');
    boton.type = 'button';
    boton.id = 'control-paradas';
    boton.setAttribute('aria-pressed', 'true');
    boton.title = 'Mostrar u ocultar las paradas de OpenStreetMap';
    boton.innerHTML = `${ICONO_PARADAS}<span>Paradas</span>`;
    L.DomEvent.disableClickPropagation(boton);
    boton.addEventListener('click', () => {
      const visible = mapa.hasLayer(capaParadas);
      if (visible) capaParadas.remove();
      else capaParadas.addTo(mapa);
      boton.setAttribute('aria-pressed', String(!visible));
    });
    return boton;
  },
});

capaParadas.addTo(mapa);
new ControlParadas({ position: 'topright' }).addTo(mapa);

cargarParadas()
  .then((datos) => dibujarParadas(datos.paradas))
  .catch((error: unknown) => console.error(error));

// --- Selector de ruta y sentido ---------------------------------------------

const selector = document.querySelector<HTMLSelectElement>('#ruta')!;
const controles = document.querySelector<HTMLFormElement>('#controles')!;
const panel = document.querySelector<HTMLElement>('#detalle')!;
const hoja = document.querySelector<HTMLElement>('#hoja')!;
const verDetalle = document.querySelector<HTMLButtonElement>('#ver-detalle')!;
const tituloHoja = document.querySelector<HTMLElement>('#hoja-titulo')!;
const encabezado = document.querySelector<HTMLElement>('#encabezado-ruta')!;
const segmento = document.querySelector<HTMLElement>('#segmento')!;
const campoSentido = document.querySelector<HTMLFieldSetElement>('#sentido')!;
const subIda = document.querySelector<HTMLElement>('#sub-ida')!;
const subVuelta = document.querySelector<HTMLElement>('#sub-vuelta')!;

interface Estado {
  ruta: Ruta | null;
  sentido: NombreSentido;
}

const estado: Estado = { ruta: null, sentido: 'ida' };
let rutasPorId = new Map<string, Ruta>();

function llenarSelector(rutas: Ruta[]): void {
  for (const grupo of gruposSelector(rutas)) {
    const optgroup = document.createElement('optgroup');
    optgroup.label = grupo.etiqueta;
    for (const opcion of grupo.opciones) {
      optgroup.append(new Option(opcion.texto, opcion.valor));
    }
    selector.append(optgroup);
  }
}

function sentidoElegido(): NombreSentido {
  const marcado = controles.querySelector<HTMLInputElement>('input[name="sentido"]:checked');
  return marcado?.value === 'vuelta' ? 'vuelta' : 'ida';
}

function alCambiar(): void {
  const anterior = estado.ruta;
  estado.ruta = rutasPorId.get(selector.value) ?? null;
  estado.sentido = sentidoElegido();
  mostrarDetalle();
  // D-49: al elegir una ruta nueva, el menú se abre solo en su detalle (sin
  // mover el foco: el buscador y el sentido siguen a la mano dentro del menú).
  if (estado.ruta && estado.ruta !== anterior) {
    ponerModo('rutas');
    ponerPanel(true, false);
  }
}

// D-18: la ida sale del origen. «Origen – Destino» → Ida va hacia el destino y
// Vuelta hacia el origen. Si el nombre no trae « – », sin subtítulo.
function extremos(nombre: string): { origen: string; destino: string } | null {
  const partes = nombre.split(' – ');
  if (partes.length !== 2 || !partes[0].trim() || !partes[1].trim()) return null;
  return { origen: partes[0].trim(), destino: partes[1].trim() };
}

function ponerSubtitulos(ruta: Ruta | null): void {
  const e = ruta ? extremos(ruta.nombre) : null;
  subIda.textContent = e ? `hacia ${e.destino}` : '';
  subVuelta.textContent = e ? `hacia ${e.origen}` : '';
}

function ponerEncabezado(ruta: Ruta): void {
  const insignia = document.createElement('div');
  insignia.className = 'insignia';
  insignia.textContent = ruta.numero;
  const texto = document.createElement('div');
  texto.className = 'encabezado-texto';
  const nombre = document.createElement('b');
  nombre.textContent = ruta.nombre;
  texto.append(nombre);
  const cerrar = document.createElement('button');
  cerrar.type = 'button';
  cerrar.className = 'cerrar quitar';
  cerrar.setAttribute('aria-label', 'Quitar la ruta y volver al inicio');
  cerrar.textContent = 'Quitar';
  cerrar.addEventListener('click', () => {
    selector.selectedIndex = 0;
    alCambiar();
  });
  encabezado.replaceChildren(insignia, texto, cerrar);
}

// Cambiar de ruta o de sentido reemplaza TODO el detalle: no quedan restos.
function mostrarDetalle(): void {
  ponerSubtitulos(estado.ruta);
  segmento.classList.toggle('apagado', !estado.ruta);
  // D-49: el sentido aparece en cuanto hay ruta.
  campoSentido.hidden = !estado.ruta;
  hoja.classList.toggle('con-ruta', !!estado.ruta);
  verDetalle.hidden = !estado.ruta || panelAbierto();
  verDetalle.textContent = estado.ruta ? 'Ver detalle' : '';
  if (!estado.ruta) {
    panel.replaceChildren();
    panel.hidden = true;
    encabezado.replaceChildren();
    encabezado.hidden = true;
    tituloHoja.hidden = false;
    return;
  }
  ponerEncabezado(estado.ruta);
  encabezado.hidden = false;
  tituloHoja.hidden = true;
  const d = detalleRuta(estado.ruta, estado.sentido);
  const titulo = document.createElement('h2');
  titulo.className = 'detalle-titulo';
  titulo.textContent = d.titulo;

  const etiquetas = document.createElement('p');
  etiquetas.className = 'detalle-etiquetas';
  for (const texto of d.etiquetas) {
    const e = document.createElement('span');
    e.className = 'etiqueta';
    e.textContent = texto;
    etiquetas.append(e);
  }

  const lista = document.createElement('dl');
  lista.className = 'detalle-filas';
  for (const fila of d.filas) {
    const dt = document.createElement('dt');
    dt.textContent = fila.dato;
    const dd = document.createElement('dd');
    dd.textContent = fila.valor;
    if (fila.fuente) {
      const fuente = document.createElement('small');
      fuente.className = 'fuente';
      fuente.textContent = fila.fuente;
      dd.append(fuente);
    }
    lista.append(dt, dd);
  }

  const nodos: HTMLElement[] = [titulo, etiquetas, lista];
  if (d.aviso) {
    const aviso = document.createElement('p');
    aviso.className = 'detalle-aviso';
    aviso.textContent = d.aviso;
    nodos.push(aviso);
  }
  panel.replaceChildren(...nodos);
  panel.hidden = false;
}

// --- Menú lateral izquierdo (D-48): el mismo en teléfono y en computadora ---------------
// Cerrado al cargar: el mapa ocupa toda la pantalla. Lo abren el botón ☰ y
// «Ver detalle»; lo cierran su botón, Esc o tocar el mapa (el velo).
const botonMenu = document.querySelector<HTMLButtonElement>('#boton-menu')!;
const cerrarMenu = document.querySelector<HTMLButtonElement>('#cerrar-menu')!;
const velo = document.querySelector<HTMLElement>('#velo')!;
botonMenu.innerHTML = ICONO_MENU;
cerrarMenu.innerHTML = ICONO_CERRAR;

function panelAbierto(): boolean {
  return !hoja.classList.contains('cerrada');
}

const app = document.querySelector<HTMLElement>('.app')!;

function ponerPanel(abierto: boolean, enfocar = true): void {
  hoja.classList.toggle('cerrada', !abierto);
  app.classList.toggle('menu-abierto', abierto);
  // En computadora el mapa se recorre para quedar completo junto al menú.
  window.setTimeout(() => mapa.invalidateSize(), 320);
  hoja.toggleAttribute('inert', !abierto);
  velo.hidden = !abierto;
  verDetalle.hidden = abierto || !estado.ruta;
  botonMenu.setAttribute('aria-expanded', String(abierto));
  verDetalle.setAttribute('aria-expanded', String(abierto));
  if (abierto && enfocar) cerrarMenu.focus({ preventScroll: true });
}

hoja.toggleAttribute('inert', true);
botonMenu.addEventListener('click', () => ponerPanel(!panelAbierto()));
cerrarMenu.addEventListener('click', () => {
  ponerPanel(false);
  botonMenu.focus();
});
velo.addEventListener('click', () => ponerPanel(false));
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && panelAbierto()) {
    ponerPanel(false);
    botonMenu.focus();
  }
});

// --- Pestañas «Rutas» / «Calcula tu ruta» (M-06) ------------------------------
// Viven dentro del menú lateral. «Calcula tu ruta» solo avisa (D-15).
const modoRutas = document.querySelector<HTMLElement>('#modo-rutas')!;
const modoCalcula = document.querySelector<HTMLElement>('#modo-calcula')!;
const pestanaRutas = document.querySelector<HTMLButtonElement>('#pestana-rutas')!;
const pestanaCalcula = document.querySelector<HTMLButtonElement>('#pestana-calcula')!;
pestanaRutas.insertAdjacentHTML('afterbegin', ICONO_RUTAS);
pestanaCalcula.insertAdjacentHTML('afterbegin', ICONO_CALCULA);

function llenarCalcula(): void {
  const a = avisoCalcula();
  const titulo = document.createElement('h2');
  titulo.className = 'hoja-titulo';
  titulo.id = 'calcula-titulo';
  titulo.textContent = a.titulo;
  const estadoAviso = document.createElement('p');
  estadoAviso.className = 'calcula-estado';
  const sello = document.createElement('span');
  sello.className = 'etiqueta';
  sello.textContent = a.estado;
  estadoAviso.append(sello);
  const lista = document.createElement('dl');
  lista.className = 'calcula-lista';
  for (const p of a.parrafos) {
    const dt = document.createElement('dt');
    dt.textContent = p.dato;
    const dd = document.createElement('dd');
    dd.textContent = p.texto;
    lista.append(dt, dd);
  }
  modoCalcula.replaceChildren(titulo, estadoAviso, lista);
}

function ponerModo(modo: 'rutas' | 'calcula'): void {
  const calcula = modo === 'calcula';
  modoRutas.hidden = calcula;
  modoCalcula.hidden = !calcula;
  pestanaRutas.classList.toggle('activo', !calcula);
  pestanaCalcula.classList.toggle('activo', calcula);
  pestanaRutas.setAttribute('aria-pressed', String(!calcula));
  pestanaCalcula.setAttribute('aria-pressed', String(calcula));
}

llenarCalcula();
pestanaRutas.addEventListener('click', () => ponerModo('rutas'));
pestanaCalcula.addEventListener('click', () => ponerModo('calcula'));
verDetalle.addEventListener('click', () => {
  ponerModo('rutas');
  ponerPanel(true);
});

controles.addEventListener('change', alCambiar);
controles.addEventListener('submit', (e) => e.preventDefault());

cargarDatos()
  .then((datos) => {
    rutasPorId = new Map(datos.rutas.map((r) => [r.route_id, r]));
    llenarSelector(datos.rutas);
  })
  .catch((error: unknown) => {
    console.error(error);
    selector.options[0].text = 'No se pudieron cargar las rutas';
  });

// M-07: el service worker solo se registra en la app compilada (en desarrollo
// estorbaría al recargar).
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch((error: unknown) => console.error(error));
  });
}
