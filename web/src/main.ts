// SJDR Bus (D-28).
// M-01: mapa real de OpenStreetMap con Leaflet (HANDOFF §11.1). La atribución de
//       OpenStreetMap queda visible en todo momento (en el pie, D-53).
// M-04: detalle de la ruta elegida, del sentido elegido. Sin trazo en el mapa.
// M-05: paradas de OpenStreetMap, no ligadas a ninguna ruta.
// M-07: instalable (manifiesto e íconos en web/public) y service worker que
//       guarda la app y sus datos, no las teselas del mapa.
// D-48 a D-52: mapa completo, menú lateral izquierdo, tarjetas de rutas (D-50),
//       zonas probables de inicio y fin (ESTIMADO), detalle visual sin fuentes.
// D-53 (maqueta aprobada por Miguel, 20 nov 2026, docs/maquetas/d53/):
//   (a) sin desplegable: la ruta se elige en las tarjetas; el sentido vive en el
//       detalle, dentro del menú; pestañas arriba; menú cerrado = mapa completo;
//   (b) botón redondo de paradas; cada parada es un círculo levantado con el
//       camión y una guía de puntitos; ocultas hasta presionarlo;
//   (c) tarjetas más chicas, sin «Ruta 001», 20 colores;
//   (d) un solo pie legal, chico, verde y sin fondo; avisos discretos;
//   (e) «¿A dónde quieres ir?»: catálogo guardado, rutas que empiezan o terminan
//       a ≤ 1 km y parada de OSM más cercana con el GPS del teléfono. Nunca se
//       consulta Nominatim ni OSRM (regla 7) y la ubicación no sale del teléfono.
import 'leaflet/dist/leaflet.css';
import './estilos.css';
import L from 'leaflet';
import { cargarDatos, type Ruta } from './datos';
import { vistaDetalle, type NombreSentido } from './detalle';
import {
  ICONO_ACTUALIZAR,
  ICONO_BUS_CHICO,
  ICONO_CALCULA,
  ICONO_CERRAR,
  ICONO_FLECHA,
  ICONO_LUPA,
  ICONO_MENU,
  ICONO_PARADAS_DETALLE,
  ICONO_RELOJ,
  ICONO_RUTAS,
  ICONO_UBICAR,
  PARADA_CIRCULO,
  camioncito,
  iconoBus,
} from './iconos';
import {
  AVISO_COLORES,
  CLAVE_BIENVENIDA,
  CLAVE_RECIENTES,
  agregarReciente,
  colorTarjeta,
  elegirLetra,
  gruposNombre,
  insignia,
  leerRecientes,
  pesoLetra,
  type ColorTarjeta,
} from './tarjetas';
import { zonasRuta } from './zonas';
import { cargarParadas, fichaParada, type Parada } from './paradas';
import {
  LEYENDA_CERCA,
  PROXIMAMENTE,
  SIN_RESULTADOS,
  buscar,
  catalogo,
  masCercana,
  rutasCerca,
  textoDistancia,
  type LugarCatalogo,
  type Punto,
} from './destino';

// D-53: la vista inicial es la de la maqueta aprobada (la ciudad completa). Plaza
// Independencia (HANDOFF §11.3, coordenada verificada: 20.38883, -99.99639)
// queda a la vista, al oeste del centro de la pantalla.
const VISTA_CIUDAD: L.LatLngTuple = [20.389, -99.975];
// D-59, 2: computadora = ancho de 768 px o más Y alto de más de 500 px (igual que
// estilos.css): el teléfono acostado se queda con la vista de teléfono.
const escritorio = () => window.matchMedia('(min-width: 768px) and (min-height: 501px)').matches;

// D-59, 1: Safari de iPhone ignora user-scalable=no; se frena el pellizco de la
// página. El mapa no lo pierde: Leaflet usa eventos de toque, no estos.
for (const ev of ['gesturestart', 'gesturechange']) document.addEventListener(ev, (e) => e.preventDefault(), { passive: false });

const mapa = L.map('mapa', { zoomControl: false, attributionControl: false }).setView(VISTA_CIUDAD, escritorio() ? 14 : 13);
// D-58, 1: zoom «+ / −» en píldora, abajo a la derecha (teléfono y computadora).
L.control.zoom({ position: 'bottomright', zoomInTitle: 'Acercar', zoomOutTitle: 'Alejar' }).addTo(mapa);

// Teselas estándar de OpenStreetMap: solo las del área visible, con la caché
// normal del navegador (HANDOFF §11.6). La atribución va en el pie (#pie),
// siempre visible: «© colaboradores de OpenStreetMap» con su enlace
// https://www.openstreetmap.org/copyright (regla 6).
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(mapa);

const app = document.querySelector<HTMLElement>('.app')!;
const barra = document.querySelector<HTMLElement>('#barra')!;
const hoja = document.querySelector<HTMLElement>('#hoja')!;
const chip = document.querySelector<HTMLElement>('#chip-ruta')!;

// La ficha de una parada o zona nunca queda debajo de la barra, del menú abierto
// o del aviso de la ruta: el mapa se mueve lo necesario. Se mide contra la caja
// del mapa (en computadora empieza debajo de la barra y se recorre con el menú).
function margenesFicha(): { arriba: L.Point; abajo: L.Point } {
  const m = document.querySelector<HTMLElement>('#mapa')!.getBoundingClientRect();
  const b = barra.getBoundingClientRect();
  const arriba = b.bottom > m.top ? b.bottom - m.top : 0;
  const izquierda = panelAbierto() ? Math.max(0, hoja.getBoundingClientRect().right - m.left) : 0;
  const abajo = chip.hidden ? 40 : m.bottom - chip.getBoundingClientRect().top;
  return { arriba: L.point(izquierda + 16, arriba + 16), abajo: L.point(16, abajo + 16) };
}

function fichaConMargenes(ancho: number): L.Popup {
  const ficha = L.popup({ maxWidth: ancho });
  Object.defineProperty(ficha.options, 'autoPanPaddingTopLeft', { get: () => margenesFicha().arriba });
  Object.defineProperty(ficha.options, 'autoPanPaddingBottomRight', { get: () => margenesFicha().abajo });
  return ficha;
}

function cajaFicha(titulo: string, lineas: string[], marcada: (i: number, linea: string) => boolean, clase = ''): HTMLElement {
  const caja = document.createElement('div');
  caja.className = `ficha-parada ${clase}`.trim();
  const b = document.createElement('b');
  b.textContent = titulo;
  caja.append(b);
  lineas.forEach((linea, i) => {
    const renglon = document.createElement('span');
    renglon.textContent = linea;
    if (marcada(i, linea)) renglon.className = 'marca-verificar';
    caja.append(renglon);
  });
  return caja;
}

// --- (b) Paradas de OpenStreetMap: ocultas hasta presionar el botón ----------

const capaParadas = L.layerGroup();
// Círculo levantado con el camión; la punta de la guía marca el lugar exacto.
const iconoParada = L.divIcon({ className: 'parada-toque', html: PARADA_CIRCULO, iconSize: [26, 44], iconAnchor: [13, 41.5], popupAnchor: [0, -32] });
let paradas: Parada[] = [];
const paradasListas = cargarParadas().then((d) => {
  paradas = d.paradas;
  dibujarParadas(paradas);
  return paradas;
});
paradasListas.catch((error: unknown) => console.error(error));

// La capa de paradas no depende de la ruta elegida: no se sabe qué ruta pasa por
// cada parada (R-07) y nunca se unen entre sí.
function dibujarParadas(lista: Parada[]): void {
  for (const p of lista) {
    const nombre = p.nombre ?? 'Parada sin nombre';
    const f = fichaParada(p);
    const ficha = fichaConMargenes(260);
    ficha.setContent(() => cajaFicha(f.nombre, f.lineas, (_, l) => l === f.lineas[2]));
    L.marker([p.lat, p.lon], { icon: iconoParada, title: nombre, alt: `Parada: ${nombre}`, keyboard: true })
      .bindPopup(ficha)
      .addTo(capaParadas);
  }
}

// Botón redondo de paradas (D-53, 1), con estado (aria-pressed).
const botonParadas = document.querySelector<HTMLButtonElement>('#boton-paradas')!;
const avisoParadas = document.querySelector<HTMLElement>('#aviso-paradas')!;
function pintarBotonParadas(): void {
  const activo = mapa.hasLayer(capaParadas);
  botonParadas.setAttribute('aria-pressed', String(activo));
  // La ventana del camión toma el color del fondo del botón.
  botonParadas.innerHTML = iconoBus(activo ? (escritorio() ? '#f0a032' : '#0d7a72') : '#fff');
  avisoParadas.hidden = !activo;
  avisoParadas.textContent = activo ? `${paradas.length} paradas de OpenStreetMap · por verificar en campo` : '';
}
botonParadas.addEventListener('click', () => {
  if (mapa.hasLayer(capaParadas)) capaParadas.remove();
  else capaParadas.addTo(mapa);
  pintarBotonParadas();
});
pintarBotonParadas();
paradasListas.then(pintarBotonParadas, () => undefined);

// --- Zonas probables de inicio, fin y destino (D-50, D-46) -------------------
// Su propio panel: el panel normal de líneas sigue vacío (regla 8: sin trazo).
mapa.createPane('zonas');
mapa.getPane('zonas')!.style.zIndex = '390';
// Las etiquetas van encima de las paradas (600).
mapa.createPane('etiquetas-zona');
mapa.getPane('etiquetas-zona')!.style.zIndex = '650';
const capaZonas = L.layerGroup().addTo(mapa);
const capaDestino = L.layerGroup().addTo(mapa);
const capaUbicacion = L.layerGroup().addTo(mapa);

function dibujarZona(capa: L.LayerGroup, clase: string, etiqueta: string, centro: Punto, radio: number, ficha: L.Popup): L.LatLngBounds {
  const circulo = L.circle([centro.lat, centro.lon], { pane: 'zonas', radius: radio, className: `zona ${clase}`, weight: 2, dashArray: '6 6', fillOpacity: 0.14 });
  circulo.bindPopup(ficha).addTo(capa);
  const ancho = Math.round(etiqueta.length * 7.2 + 26);
  L.marker([centro.lat, centro.lon], {
    pane: 'etiquetas-zona',
    icon: L.divIcon({ className: `punto-zona ${clase}`, html: `<span></span>`, iconSize: [ancho, 26], iconAnchor: [ancho / 2, 13] }),
    title: etiqueta,
    alt: etiqueta,
    keyboard: true,
  })
    .bindPopup(ficha)
    .on('add', (e) => {
      const span = (e.target as L.Marker).getElement()?.querySelector('span');
      if (span) span.textContent = etiqueta;
    })
    .addTo(capa);
  return circulo.getBounds();
}

// Un solo encuadre pendiente a la vez: si llegan dos seguidos (tu ubicación y
// luego el destino), gana el último. Leaflet ignora un acercamiento nuevo
// mientras anima el anterior, así que se espera a que termine (zoomend).
let encuadrePendiente: number | undefined;
function encuadrar(limites: L.LatLngBounds[]): void {
  if (!limites.length) return;
  const todo = limites.reduce((a, b) => a.extend(b), L.latLngBounds(limites[0].getSouthWest(), limites[0].getNorthEast()));
  const aplicar = () => {
    if ((mapa as unknown as { _animatingZoom?: boolean })._animatingZoom) {
      mapa.once('zoomend', aplicar);
      return;
    }
    mapa.invalidateSize();
    const m = margenesFicha();
    mapa.fitBounds(todo, { paddingTopLeft: L.point(44, m.arriba.y + 30), paddingBottomRight: L.point(44, Math.max(m.abajo.y, 100) + 20), maxZoom: 16 });
  };
  // Después de que el mapa se recorre (menú en computadora), con margen para la
  // barra de arriba y el aviso de abajo.
  window.clearTimeout(encuadrePendiente);
  encuadrePendiente = window.setTimeout(aplicar, 330);
}

function dibujarZonas(): void {
  capaZonas.clearLayers();
  if (!estado.ruta) return;
  const limites: L.LatLngBounds[] = [];
  for (const z of zonasRuta(estado.ruta, estado.sentido).zonas) {
    const clase = z.papel === 'Inicio' ? 'zona-inicio' : 'zona-fin';
    const ficha = fichaConMargenes(280);
    ficha.setContent(() => cajaFicha(z.titulo, z.lineas, (i) => i === 0, 'ficha-zona'));
    limites.push(dibujarZona(capaZonas, clase, `${z.papel}: ${z.lugar}`, z, z.radio_m, ficha));
  }
  encuadrar(limites);
}

// --- Estado de la app ---------------------------------------------------------

interface Estado {
  ruta: Ruta | null;
  sentido: NombreSentido;
  destino: LugarCatalogo | null;
  yo: Punto | null;
}

const estado: Estado = { ruta: null, sentido: 'ida', destino: null, yo: null };
let rutas: Ruta[] = [];
let rutasPorId = new Map<string, Ruta>();
let lugares: LugarCatalogo[] = [];
const colores = new Map<string, ColorTarjeta>();

// --- (c) Tarjetas de rutas (D-50, D-53) ---------------------------------------
const selectorVisual = document.querySelector<HTMLElement>('#selector-visual')!;
const contTarjetas = document.querySelector<HTMLElement>('#tarjetas')!;
const seccionRecientes = document.querySelector<HTMLElement>('#recientes')!;
const listaRecientes = document.querySelector<HTMLElement>('#lista-recientes')!;
document.querySelector<HTMLElement>('#aviso-colores')!.textContent = AVISO_COLORES;

function ponerColor(el: HTMLElement, c: ColorTarjeta): void {
  el.style.setProperty('--c', c.fondo);
  el.style.setProperty('--ct', c.texto);
  el.style.setProperty('--ci', c.insignia);
}

// «Ruta 001» es el nombre oficial y se queda solo en los datos (Miguel, 20 nov
// 2026, D-53): ni en pantalla ni en lo que lee el lector de pantalla.
function nombreAccesible(ruta: Ruta): string {
  return `${insignia(ruta)}: ${ruta.nombre}${ruta.tipo === 'intermunicipal' ? ' · Intermunicipal' : ''}`;
}

// D-55: el nombre de la tarjeta partida toma la letra más grande que cabe completa
// en su mitad, sin partir palabras (2 px libres arriba y abajo, como la maqueta).
function ajustarLetra(n: HTMLElement): void {
  const s = n.firstElementChild as HTMLElement | null;
  if (!s || n.clientWidth === 0) return;
  const f = elegirLetra((px) => {
    s.style.fontSize = `${px}px`;
    s.style.fontWeight = String(pesoLetra(px));
    return s.scrollWidth <= n.clientWidth && s.getBoundingClientRect().height <= n.clientHeight - 4;
  });
  s.style.fontSize = `${f}px`;
  s.style.fontWeight = String(pesoLetra(f));
  n.dataset.letra = String(f);
}

// Se ajusta cuando la tarjeta toma su tamaño: al dibujarse, al mostrarse (el menú
// «Rutas» o las recientes estaban ocultos) y al cambiar de teléfono a computadora.
const vigiaLetra = new ResizeObserver((cambios) => {
  for (const c of cambios) if (c.contentRect.width > 0) ajustarLetra(c.target as HTMLElement);
});

function tarjeta(ruta: Ruta, distancia?: string): HTMLButtonElement {
  const b = document.createElement('button');
  b.type = 'button';
  b.className = 'tarjeta-ruta';
  b.dataset.ruta = ruta.route_id;
  const color = colores.get(ruta.route_id)!;
  ponerColor(b, color);
  b.setAttribute('aria-label', distancia ? `${nombreAccesible(ruta)} · ${distancia}` : nombreAccesible(ruta));
  const nombre = document.createElement('span');
  nombre.className = 'tarjeta-nombre';
  if (distancia) {
    // «Rutas que empiezan o terminan cerca»: no estaba en la maqueta de D-55, se
    // queda como en D-53 (lección 14).
    b.innerHTML = camioncito(insignia(ruta));
    nombre.textContent = ruta.nombre;
  } else {
    // D-55: tarjeta partida. Izquierda: el camión de frente (el del botón de
    // paradas, con las ventanas del color de la tarjeta) y la insignia abajo.
    // Derecha: inicio – fin, sin negritas, con el «–» pegado a su vecina.
    b.classList.add('partida');
    const lado = document.createElement('span');
    lado.className = 'lado';
    lado.innerHTML = iconoBus(color.fondo);
    const ins = document.createElement('span');
    ins.className = 'insignia';
    ins.textContent = insignia(ruta);
    lado.append(ins);
    b.append(lado);
    const linea = document.createElement('span');
    gruposNombre(ruta.nombre).forEach((g, k) => {
      if (k > 0) linea.append(' ');
      if (g.pegado) {
        const p = document.createElement('b');
        p.textContent = g.texto;
        linea.append(p);
      } else linea.append(g.texto);
    });
    nombre.append(linea);
    vigiaLetra.observe(nombre);
  }
  b.append(nombre);
  if (distancia) {
    const d = document.createElement('span');
    d.className = 'dist';
    d.textContent = distancia;
    b.append(d);
  }
  b.addEventListener('click', () => elegirRuta(ruta.route_id));
  return b;
}

// «Tus rutas recientes»: solo en este navegador (localStorage), sin cookies.
function recientesGuardadas(): string[] {
  try {
    return leerRecientes(localStorage.getItem(CLAVE_RECIENTES), new Set(rutasPorId.keys()));
  } catch {
    return [];
  }
}

function guardarRecientes(lista: string[]): void {
  try {
    if (lista.length) localStorage.setItem(CLAVE_RECIENTES, JSON.stringify(lista));
    else localStorage.removeItem(CLAVE_RECIENTES);
  } catch {
    // Navegación privada sin almacenamiento: la app sigue igual, sin recientes.
  }
}

function pintarRecientes(): void {
  const lista = recientesGuardadas();
  seccionRecientes.hidden = lista.length === 0;
  listaRecientes.querySelectorAll('.tarjeta-nombre').forEach((n) => vigiaLetra.unobserve(n));
  listaRecientes.replaceChildren(...lista.map((id) => tarjeta(rutasPorId.get(id)!)));
}

document.querySelector<HTMLButtonElement>('#borrar-recientes')!.addEventListener('click', () => {
  guardarRecientes([]);
  pintarRecientes();
});

// --- (a) Ruta elegida y su detalle, con el sentido dentro del menú -----------
const rutaElegida = document.querySelector<HTMLElement>('#ruta-elegida')!;
const encabezado = document.querySelector<HTMLElement>('#encabezado-ruta')!;
const datosDetalle = document.querySelector<HTMLElement>('#detalle-datos')!;
const segmento = document.querySelector<HTMLElement>('#segmento')!;
const subIda = document.querySelector<HTMLElement>('#sub-ida')!;
const subVuelta = document.querySelector<HTMLElement>('#sub-vuelta')!;

function elegirRuta(id: string | null): void {
  const anterior = estado.ruta;
  estado.ruta = id ? rutasPorId.get(id) ?? null : null;
  if (estado.ruta && estado.ruta !== anterior) {
    // Una ruta nueva empieza en su ida (D-18).
    estado.sentido = 'ida';
    segmento.querySelector<HTMLInputElement>('input[value="ida"]')!.checked = true;
    guardarRecientes(agregarReciente(recientesGuardadas(), estado.ruta.route_id));
    // Elegir una ruta quita el destino del mapa: un solo tema a la vez.
    quitarDestino();
  }
  mostrarRuta();
  // D-49: al elegir una ruta nueva, el menú se abre solo en su detalle.
  if (estado.ruta && estado.ruta !== anterior) {
    ponerModo('rutas');
    ponerPanel(true, false);
    hoja.querySelector<HTMLElement>('.hoja-cuerpo')!.scrollTop = 0;
  }
}

segmento.addEventListener('change', () => {
  const marcado = segmento.querySelector<HTMLInputElement>('input[name="sentido"]:checked');
  estado.sentido = marcado?.value === 'vuelta' ? 'vuelta' : 'ida';
  mostrarRuta();
});

document.querySelector<HTMLButtonElement>('#cambiar-ruta')!.addEventListener('click', () => elegirRuta(null));

function filaDetalle(clase: string, dato: string, contenido: (Node | string)[]): HTMLElement {
  const grupo = document.createElement('div');
  grupo.className = `fila ${clase}`;
  const dt = document.createElement('dt');
  dt.className = 'solo-lector';
  dt.textContent = dato;
  const dd = document.createElement('dd');
  dd.append(...contenido);
  grupo.append(dt, dd);
  return grupo;
}

function icono(svg: string, clase = 'icono'): HTMLElement {
  const i = document.createElement('span');
  i.className = clase;
  i.innerHTML = svg;
  return i;
}

function texto(t: string, clase: string): HTMLElement {
  const e = document.createElement('span');
  e.className = clase;
  e.textContent = t;
  return e;
}

function ponerEncabezado(ruta: Ruta): void {
  // D-52: la tarjeta de la ruta, con el mismo camioncito y color que en la lista (lección 3).
  const color = colores.get(ruta.route_id);
  if (color) ponerColor(encabezado, color);
  const nombre = texto(ruta.nombre, 'enc-nombre');
  encabezado.innerHTML = camioncito(insignia(ruta));
  encabezado.append(nombre);
  encabezado.setAttribute('aria-label', nombreAccesible(ruta));
}

function ponerChip(ruta: Ruta | null): void {
  chip.replaceChildren();
  if (!ruta) return;
  const placa = document.createElement('span');
  placa.className = 'placa';
  const color = colores.get(ruta.route_id);
  if (color) ponerColor(placa, color);
  placa.innerHTML = camioncito(insignia(ruta));
  const nombre = document.createElement('span');
  nombre.className = 'nombre-chip';
  nombre.textContent = ruta.nombre;
  const sub = document.createElement('small');
  sub.textContent = `${estado.sentido === 'ida' ? 'Ida' : 'Vuelta'} · zonas aproximadas (estimado)`;
  nombre.append(sub);
  const ver = document.createElement('button');
  ver.type = 'button';
  ver.className = 'ver';
  ver.id = 'ver-detalle';
  ver.textContent = 'Ver detalle';
  ver.setAttribute('aria-controls', 'hoja');
  ver.addEventListener('click', () => {
    ponerModo('rutas');
    ponerPanel(true);
  });
  chip.append(placa, nombre, ver);
}

// Cambiar de ruta o de sentido reemplaza TODO el detalle: no quedan restos.
function mostrarRuta(): void {
  const ruta = estado.ruta;
  ponerChip(ruta);
  chip.hidden = !ruta || panelAbierto();
  dibujarZonas();
  selectorVisual.hidden = !!ruta;
  rutaElegida.hidden = !ruta;
  if (!ruta) {
    encabezado.replaceChildren();
    datosDetalle.replaceChildren();
    pintarRecientes();
    return;
  }
  ponerEncabezado(ruta);
  // D-18: la ida sale del origen y la vuelta del destino; mismos dos lugares.
  const { origen, destino } = ruta.extremos;
  subIda.textContent = `${origen.lugar} → ${destino.lugar}`;
  subVuelta.textContent = `${destino.lugar} → ${origen.lugar}`;

  const v = vistaDetalle(ruta, estado.sentido);
  const lista = document.createElement('dl');
  lista.className = 'detalle-filas';
  // D-52: tipo y paradas en un mismo renglón.
  const renglon = document.createElement('div');
  renglon.className = 'fila-doble';
  renglon.append(filaDetalle('fila-tipo', 'Tipo', [texto(v.tipo, 'chip-tipo')]));
  if (v.paradas != null) {
    renglon.append(filaDetalle('fila-paradas', 'Paradas', [icono(ICONO_PARADAS_DETALLE), texto(String(v.paradas), 'valor'), ' paradas']));
  }
  lista.append(renglon);
  if (v.duracion) {
    // Camión que inicia · puntos · camión que termina, y el número al lado.
    const linea = document.createElement('span');
    linea.className = 'linea-duracion';
    linea.append(icono(ICONO_BUS_CHICO));
    for (let i = 0; i < v.duracion.puntos; i++) linea.append(texto('', 'punto'));
    linea.append(icono(ICONO_BUS_CHICO));
    lista.append(filaDetalle('fila-duracion', 'Duración del recorrido', [linea, texto(`${v.duracion.minutos} min`, 'valor')]));
  }
  if (v.horario) {
    lista.append(filaDetalle('fila-horario', 'Horario', [icono(ICONO_RELOJ), texto(v.horario, 'valor')]));
  }
  // Abajo y en chico: el nivel del recorrido y lo que falta (D-52).
  const pie = document.createElement('div');
  pie.className = 'detalle-pie';
  pie.append(texto(v.nivel, 'etiqueta'));
  const faltan = zonasRuta(ruta, estado.sentido).faltantes;
  for (const nota of [...v.notas, ...faltan.map((f) => f.replace(' · FALTANTE', ': sin punto todavía (FALTANTE).'))]) {
    const p = document.createElement('p');
    p.className = 'detalle-aviso';
    p.textContent = nota;
    pie.append(p);
  }
  datosDetalle.replaceChildren(lista, pie);
}

// --- Menú lateral izquierdo (D-48): el mismo en teléfono y en computadora ----
// Cerrado al cargar: el mapa ocupa toda la pantalla (D-53, 5). Lo abren ☰,
// «¿A dónde quieres ir?» y «Ver detalle»; lo cierran su botón, Esc o el velo.
const botonMenu = document.querySelector<HTMLButtonElement>('#boton-menu')!;
const cerrarMenu = document.querySelector<HTMLButtonElement>('#cerrar-menu')!;
const velo = document.querySelector<HTMLElement>('#velo')!;
botonMenu.innerHTML = ICONO_MENU;
cerrarMenu.innerHTML = ICONO_CERRAR;

function panelAbierto(): boolean {
  return !hoja.classList.contains('cerrada');
}

function ponerPanel(abierto: boolean, enfocar = true): void {
  hoja.classList.toggle('cerrada', !abierto);
  app.classList.toggle('menu-abierto', abierto);
  // En computadora el mapa se recorre para quedar completo junto al menú.
  window.setTimeout(() => mapa.invalidateSize(), 320);
  hoja.toggleAttribute('inert', !abierto);
  velo.hidden = !abierto;
  chip.hidden = abierto || !estado.ruta;
  botonMenu.setAttribute('aria-expanded', String(abierto));
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
  } else if (e.key === 'Escape' && !bienvenida.hidden) {
    cerrarBienvenida(); // D-55: Esc también cierra la bienvenida
  }
});

// --- Pestañas «Rutas» / «Calcula tu ruta», arriba del menú (D-53, 8) ---------
const modoRutas = document.querySelector<HTMLElement>('#modo-rutas')!;
const modoCalcula = document.querySelector<HTMLElement>('#modo-calcula')!;
const pestanaRutas = document.querySelector<HTMLButtonElement>('#pestana-rutas')!;
const pestanaCalcula = document.querySelector<HTMLButtonElement>('#pestana-calcula')!;
pestanaRutas.insertAdjacentHTML('afterbegin', ICONO_RUTAS);
pestanaCalcula.insertAdjacentHTML('afterbegin', ICONO_CALCULA);

function ponerModo(modo: 'rutas' | 'calcula'): void {
  const calcula = modo === 'calcula';
  modoRutas.hidden = calcula;
  modoCalcula.hidden = !calcula;
  pestanaRutas.classList.toggle('activo', !calcula);
  pestanaCalcula.classList.toggle('activo', calcula);
  pestanaRutas.setAttribute('aria-pressed', String(!calcula));
  pestanaCalcula.setAttribute('aria-pressed', String(calcula));
}

pestanaRutas.addEventListener('click', () => ponerModo('rutas'));
pestanaCalcula.addEventListener('click', () => ponerModo('calcula'));

// --- D-55, 1: bienvenida «Así funciona» ---------------------------------------
// Como la hoja de instrucciones pegada en una estación nueva: se lee una vez y se
// quita. Sale solo si este navegador no la ha cerrado antes (localStorage, sin
// cookies). Mientras el menú está abierto no se ve (CSS), para no taparlo.
const bienvenida = document.querySelector<HTMLElement>('#bienvenida')!;

function bienvenidaVista(): boolean {
  try {
    return localStorage.getItem(CLAVE_BIENVENIDA) === '1';
  } catch {
    return false;
  }
}

function cerrarBienvenida(): void {
  bienvenida.hidden = true;
  try {
    localStorage.setItem(CLAVE_BIENVENIDA, '1');
  } catch {
    // Navegación privada sin almacenamiento: se cierra igual, solo no se recuerda.
  }
}

bienvenida.hidden = bienvenidaVista();
document.querySelector<HTMLButtonElement>('#bienvenida-cerrar')!.addEventListener('click', () => {
  cerrarBienvenida();
  botonMenu.focus({ preventScroll: true });
});
document.querySelector<HTMLButtonElement>('#bienvenida-rutas')!.addEventListener('click', () => {
  cerrarBienvenida();
  ponerModo('rutas');
  ponerPanel(true);
});
document.querySelector<HTMLButtonElement>('#bienvenida-destino')!.addEventListener('click', () => {
  cerrarBienvenida();
  botonDestino.click();
});
// --- (e) «¿A dónde quieres ir?» (D-53, 7) ------------------------------------
const botonDestino = document.querySelector<HTMLButtonElement>('#boton-destino')!;
const campoDestino = document.querySelector<HTMLInputElement>('#destino')!;
const bloqueLugares = document.querySelector<HTMLElement>('#bloque-lugares')!;
const listaLugares = document.querySelector<HTMLElement>('#lista-lugares')!;
const bloqueCerca = document.querySelector<HTMLElement>('#bloque-cerca')!;
const listaCerca = document.querySelector<HTMLElement>('#lista-cerca')!;
const botonUbicacion = document.querySelector<HTMLButtonElement>('#usar-ubicacion')!;
const paradaHallada = document.querySelector<HTMLElement>('#parada-hallada')!;
const verParada = document.querySelector<HTMLButtonElement>('#ver-parada')!;
const otraVez = document.querySelector<HTMLButtonElement>('#otra-vez')!;
const notaUbicacion = document.querySelector<HTMLElement>('#nota-ubicacion')!;
const leyendasDestino = document.querySelector<HTMLElement>('#leyendas-destino')!;

botonDestino.innerHTML = `${ICONO_LUPA}<span>¿A dónde quieres ir?</span>`;
botonDestino.addEventListener('click', () => {
  ponerModo('calcula');
  ponerPanel(true, false);
  window.requestAnimationFrame(() => campoDestino.focus({ preventScroll: true }));
});

{
  const cerca = document.createElement('p');
  cerca.textContent = LEYENDA_CERCA;
  const prox = document.createElement('p');
  prox.textContent = PROXIMAMENTE;
  leyendasDestino.prepend(cerca);
  leyendasDestino.append(prox);
}

// D-57: arriba y con poca letra; el botón de ícono no lleva texto (su nombre va
// en aria-label, para el lector de pantalla).
const TEXTO_UBICACION = `${ICONO_UBICAR}<span>Buscar mi parada más cercana</span>`;
botonUbicacion.innerHTML = TEXTO_UBICACION;
otraVez.innerHTML = ICONO_ACTUALIZAR;
// La parada hallada: tocar su línea la muestra en el mapa con su ficha.
let marcadorCercana: L.Marker | null = null;

function pintarLugares(): void {
  const encontrados = buscar(lugares, campoDestino.value);
  bloqueLugares.hidden = !campoDestino.value.trim();
  if (!encontrados.length) {
    const p = document.createElement('p');
    p.className = 'nota';
    p.textContent = SIN_RESULTADOS;
    listaLugares.replaceChildren(p);
    return;
  }
  listaLugares.replaceChildren(
    ...encontrados.map((l) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'resultado';
      b.setAttribute('aria-pressed', String(estado.destino?.lugar === l.lugar));
      const t = document.createElement('span');
      t.textContent = l.lugar;
      const s = document.createElement('small');
      s.textContent = l.cerca_de ? `Inicio o fin de ruta · zona aproximada, cerca de ${l.cerca_de}` : 'Inicio o fin de ruta · zona aproximada';
      t.append(s);
      b.append(icono(ICONO_BUS_CHICO), t);
      b.addEventListener('click', () => elegirDestino(l));
      return b;
    }),
  );
}

campoDestino.addEventListener('input', pintarLugares);
campoDestino.addEventListener('keydown', (e) => {
  if (e.key !== 'Enter') return;
  e.preventDefault();
  const primero = buscar(lugares, campoDestino.value)[0];
  if (primero) elegirDestino(primero);
});

function limitesUbicacion(): L.LatLngBounds[] {
  return capaUbicacion.getLayers().map((m) => L.latLngBounds([(m as L.Marker).getLatLng()]));
}

function elegirDestino(l: LugarCatalogo): void {
  if (estado.ruta) elegirRuta(null);
  estado.destino = l;
  pintarLugares();
  capaDestino.clearLayers();
  const ficha = fichaConMargenes(280);
  ficha.setContent(() => cajaFicha(`Destino: ${l.lugar}`, ['Zona aproximada (estimado) · en proceso de validación'], (i) => i === 0, 'ficha-zona'));
  const limites = [dibujarZona(capaDestino, 'zona-destino', `Destino: ${l.lugar}`, l, l.radio_m, ficha), ...limitesUbicacion()];
  encuadrar(limites);
  // (c) Rutas que empiezan o terminan a 1 km o menos, de la más cercana a la más lejana.
  listaCerca.replaceChildren(...rutasCerca(rutas, l).map(({ ruta, metros }) => tarjeta(ruta, textoDistancia(metros))));
  bloqueCerca.hidden = false;
}

function quitarDestino(): void {
  if (!estado.destino) return;
  estado.destino = null;
  capaDestino.clearLayers();
  bloqueCerca.hidden = true;
  listaCerca.replaceChildren();
  pintarLugares();
}

// (b) Parada de OSM más cercana con el GPS del teléfono. La ubicación se usa
// aquí y no se envía a ningún lado: no hay ninguna petición de red con ella.
function avisar(textoNota: string): void {
  notaUbicacion.textContent = textoNota;
  notaUbicacion.hidden = false;
}

function buscarParada(fresca: boolean): void {
  if (!('geolocation' in navigator)) {
    avisar('Este navegador no puede dar tu ubicación.');
    return;
  }
  botonUbicacion.disabled = true;
  otraVez.disabled = true;
  botonUbicacion.innerHTML = `${ICONO_UBICAR}<span>Buscando tu ubicación…</span>`;
  const terminar = () => {
    botonUbicacion.disabled = false;
    otraVez.disabled = false;
    botonUbicacion.innerHTML = TEXTO_UBICACION;
  };
  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      const yo = { lat: pos.coords.latitude, lon: pos.coords.longitude };
      estado.yo = yo;
      const lista = await paradasListas.catch(() => [] as Parada[]);
      const cercana = masCercana(lista, yo);
      capaUbicacion.clearLayers();
      marcadorCercana = null;
      L.marker([yo.lat, yo.lon], { icon: L.divIcon({ className: 'punto-yo', html: '<div class="yo"></div>', iconSize: [16, 16], iconAnchor: [8, 8] }), title: 'Tú', alt: 'Tu ubicación', keyboard: false }).addTo(capaUbicacion);
      if (cercana) {
        const p = cercana.punto;
        const nombre = p.nombre ?? 'Parada sin nombre';
        const f = fichaParada(p);
        const ficha = fichaConMargenes(260);
        ficha.setContent(() => cajaFicha(f.nombre, f.lineas, (_, linea) => linea === f.lineas[2]));
        marcadorCercana = L.marker([p.lat, p.lon], { icon: iconoParada, title: nombre, alt: `Tu parada más cercana: ${nombre}`, keyboard: true }).bindPopup(ficha).addTo(capaUbicacion);
        // D-57: una línea corta en lugar de la nota larga del fondo.
        const distancia = textoDistancia(cercana.metros);
        verParada.innerHTML = `${iconoBus('#e3f2ef')}<span><b></b><small>Tu parada más cercana · en línea recta · por verificar</small></span>${ICONO_FLECHA}`;
        verParada.querySelector('b')!.textContent = `${nombre} · ${distancia}`;
        verParada.setAttribute('aria-label', `Ver en el mapa tu parada más cercana: ${nombre}, ${distancia} en línea recta, por verificar`);
        botonUbicacion.hidden = true;
        paradaHallada.hidden = false;
        notaUbicacion.hidden = true;
      } else {
        avisar('Todavía no se cargan las paradas; intenta de nuevo en un momento.');
      }
      const destino = estado.destino ? [L.latLngBounds([[estado.destino.lat, estado.destino.lon]])] : [];
      encuadrar([...limitesUbicacion(), ...destino]);
      terminar();
    },
    (error) => {
      avisar(
        error.code === error.PERMISSION_DENIED
          ? 'No diste permiso para usar tu ubicación. Puedes darlo en los ajustes del navegador; la app sigue funcionando sin ella.'
          : 'No se pudo obtener tu ubicación. Intenta de nuevo.',
      );
      terminar();
    },
    // «Buscar de nuevo» pide una lectura nueva del GPS (sin la guardada de antes).
    { enableHighAccuracy: true, timeout: 15000, maximumAge: fresca ? 0 : 60000 },
  );
}

botonUbicacion.addEventListener('click', () => buscarParada(false));
// El botón de ícono vuelve a leer el GPS.
otraVez.addEventListener('click', () => buscarParada(true));

// D-57: tocar la línea de la parada. En el teléfono se cierra el menú (si no, tapa
// el mapa); en computadora se queda, porque el mapa está al lado. El mapa se
// centra en la parada y abre su ficha.
verParada.addEventListener('click', () => {
  if (!marcadorCercana) return;
  const m = marcadorCercana;
  // El encuadre de «ubicarte» llega 330 ms después: si quedó pendiente, alejaría
  // el mapa y cortaría la ficha (defecto visto en las capturas de D-57).
  window.clearTimeout(encuadrePendiente);
  if (!escritorio()) ponerPanel(false, false);
  mapa.setView(m.getLatLng(), Math.max(mapa.getZoom(), 17), { animate: false });
  m.openPopup();
});

// --- Arranque ------------------------------------------------------------------
cargarDatos()
  .then((datos) => {
    rutas = datos.rutas;
    rutasPorId = new Map(rutas.map((r) => [r.route_id, r]));
    lugares = catalogo(rutas);
    rutas.forEach((r, i) => colores.set(r.route_id, colorTarjeta(rutas, i)));
    contTarjetas.replaceChildren(...rutas.map((r) => tarjeta(r)));
    pintarRecientes();
  })
  .catch((error: unknown) => {
    console.error(error);
    document.querySelector<HTMLElement>('#hoja-titulo')!.textContent = 'No se pudieron cargar las rutas';
  });

// M-07: el service worker solo se registra en la app compilada (en desarrollo
// estorbaría al recargar).
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch((error: unknown) => console.error(error));
  });
}
