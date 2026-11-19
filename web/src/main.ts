// SJDR Bus (D-28).
// M-01: mapa real de OpenStreetMap con Leaflet (HANDOFF §11.1). La atribución de
//       OpenStreetMap queda visible en todo momento.
// M-03: selector de ruta y control de sentido (HANDOFF §11.8, D-18).
// M-04: detalle de la ruta elegida, del sentido elegido. Sin trazo en el mapa.
import 'leaflet/dist/leaflet.css';
import './estilos.css';
import L from 'leaflet';
import { cargarDatos, type Ruta } from './datos';
import { detalleRuta, type NombreSentido } from './detalle';
import { gruposSelector } from './selector';
import { ICONO_CERRAR } from './iconos';

// Plaza Independencia: coordenada verificada de HANDOFF §11.3.
const PLAZA_INDEPENDENCIA: L.LatLngTuple = [20.38883, -99.99639];

const mapa = L.map('mapa', { zoomControl: false, attributionControl: false }).setView(PLAZA_INDEPENDENCIA, 15);

// Teselas estándar de OpenStreetMap: solo las del área visible, con la caché
// normal del navegador (HANDOFF §11.6).
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">Colaboradores de OpenStreetMap</a>',
}).addTo(mapa);

// La hoja inferior taparía la atribución abajo: va arriba a la derecha, siempre visible.
L.control
  .attribution({ position: 'topright', prefix: '<a href="https://leafletjs.com">Leaflet</a>' })
  .addTo(mapa);

// --- Selector de ruta y sentido ---------------------------------------------

const selector = document.querySelector<HTMLSelectElement>('#ruta')!;
const controles = document.querySelector<HTMLFormElement>('#controles')!;
const panel = document.querySelector<HTMLElement>('#detalle')!;
const hoja = document.querySelector<HTMLElement>('#hoja')!;
const asa = document.querySelector<HTMLButtonElement>('#asa')!;
const tituloHoja = document.querySelector<HTMLElement>('#hoja-titulo')!;
const encabezado = document.querySelector<HTMLElement>('#encabezado-ruta')!;
const segmento = document.querySelector<HTMLElement>('#segmento')!;
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
  estado.ruta = rutasPorId.get(selector.value) ?? null;
  estado.sentido = sentidoElegido();
  mostrarDetalle();
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
  cerrar.className = 'cerrar';
  cerrar.setAttribute('aria-label', 'Cerrar la ruta y volver al inicio');
  cerrar.innerHTML = ICONO_CERRAR;
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
  hoja.classList.toggle('con-ruta', !!estado.ruta);
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

// El asa alterna hoja compacta / expandida (el scroll es interno de la hoja).
asa.addEventListener('click', () => {
  const abierta = hoja.classList.toggle('expandida');
  asa.setAttribute('aria-expanded', String(abierta));
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
