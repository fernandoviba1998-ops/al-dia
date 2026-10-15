// Al Día · service worker: abre al instante y funciona sin conexión.
// Si cambias archivos de la app, sube también este archivo con un número nuevo en CACHE.
const CACHE = 'al-dia-v2';
const SHELL = [
  './',
  './index.html',
  './config.js',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-192.png',
  './icons/icon-maskable-512.png',
  './icons/apple-touch-icon.png',
  './icons/favicon-48.png',
];
const SUPABASE_JS = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.117.2/dist/umd/supabase.js';
// Datos en vivo: nunca se sirven desde la caché.
const LIVE_HOSTS = ['supabase.co', 'supabase.in', 'open-meteo.com', 'bigdatacloud.net'];

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await cache.addAll(SHELL);
    try { await cache.add(new Request(SUPABASE_JS, { mode: 'cors' })); } catch (e) { /* se guardará en la próxima visita */ }
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

function save(request, response) {
  if (!response || !(response.ok || response.type === 'opaque')) return;
  const copy = response.clone();
  caches.open(CACHE).then(c => c.put(request, copy)).catch(() => {});
}

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (LIVE_HOSTS.some(h => url.hostname === h || url.hostname.endsWith('.' + h))) return;

  // Páginas: primero la red (para recibir actualizaciones), si no hay conexión la copia guardada.
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then(res => { save(new Request('./index.html'), res); return res; })
        .catch(() => caches.match('./index.html'))
    );
    return;
  }

  if (url.origin === self.location.origin) {
    // Íconos: desde la caché. Código y configuración: red primero.
    if (/\.(png|svg|ico|webp)$/.test(url.pathname)) {
      event.respondWith(caches.match(req).then(hit => hit || fetch(req).then(res => { save(req, res); return res; })));
    } else {
      event.respondWith(fetch(req).then(res => { save(req, res); return res; }).catch(() => caches.match(req, { ignoreSearch: true })));
    }
    return;
  }

  // Fuentes y librerías externas: la copia guardada al tiro y se renueva por detrás.
  event.respondWith(
    caches.match(req).then(hit => {
      const fresh = fetch(req).then(res => { save(req, res); return res; }).catch(() => hit);
      return hit || fresh;
    })
  );
});
