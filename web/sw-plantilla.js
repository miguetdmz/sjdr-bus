// Service worker de SJDR Bus (M-07). Lo arma vite.config.mjs al compilar: la
// lista ARCHIVOS y la VERSION se escriben solas con lo que salió de la compilación.
//
// Guarda la app y sus datos para que abra sin señal. NO guarda las teselas del
// mapa ni nada de otro dominio (HANDOFF §11.6): esas peticiones ni se tocan.
//
// Estrategia: primero la red (para que los datos estén al día) y, si no hay
// señal, la copia guardada.
const VERSION = '__VERSION__';
const ARCHIVOS = __ARCHIVOS__;
const CACHE = `sjdr-bus-${VERSION}`;

self.addEventListener('install', (evento) => {
  evento.waitUntil(caches.open(CACHE).then((c) => c.addAll(ARCHIVOS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (evento) => {
  evento.waitUntil(
    caches
      .keys()
      .then((nombres) => Promise.all(nombres.filter((n) => n.startsWith('sjdr-bus-') && n !== CACHE).map((n) => caches.delete(n))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (evento) => {
  const peticion = evento.request;
  if (peticion.method !== 'GET') return;
  const url = new URL(peticion.url);
  // Solo lo de la propia app. Teselas de OpenStreetMap y cualquier otro dominio: sin tocar.
  if (url.origin !== self.location.origin) return;
  evento.respondWith(
    fetch(peticion)
      .then((respuesta) => {
        if (respuesta.ok) {
          const copia = respuesta.clone();
          caches.open(CACHE).then((c) => c.put(peticion, copia));
        }
        return respuesta;
      })
      .catch(async () => {
        // ignoreVary: el servidor responde «Vary: Origin» y el código de la app se pide
        // con Origin (módulo) y sin él (al guardarlo); es el mismo archivo.
        const guardada = await caches.match(peticion, { ignoreVary: true });
        if (guardada) return guardada;
        if (peticion.mode === 'navigate') return (await caches.match('./', { ignoreVary: true })) ?? Response.error();
        return Response.error();
      }),
  );
});
