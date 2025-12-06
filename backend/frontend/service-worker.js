// ================================
// Distortion PWA - Service Worker (light version)
// ================================

const STATIC_CACHE = 'distortion-static-v4';
const DYNAMIC_CACHE = 'distortion-dynamic-v1';
const OFFLINE_URL = './offline.html';

// Solo lo esencial para el home y el modo offline
const STATIC_ASSETS = [
  './',
  './home.html',
  './offline.html',

  // CSS principal
  './css/style.css',

  // JS base para home / navegación / notificaciones
  './js/script.js',
  './js/nav.js',
  './js/notifications.js',

  // Icono principal
  './img/icon.png',

  // Imágenes críticas del home (ya optimizadas)
  './img/inicio_carousel1.jpg',
  './img/inicio_carousel2.jpg',
  './img/inicio_carousel3.jpg',
  './img/featured_artist.jpg'
];

// --------------------
// Utils
// --------------------

function isApiRequest(request) {
  const url = new URL(request.url);

  const isLocalApi =
    url.origin === 'http://localhost:3000' && url.pathname.startsWith('/api/');
  const isProdApi =
    url.origin === 'https://distortion-production.up.railway.app' &&
    url.pathname.startsWith('/api/');

  return isLocalApi || isProdApi;
}

// ================================
// Install
// ================================

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then(cache => cache.addAll(STATIC_ASSETS))
  );

  self.skipWaiting();
});

// ================================
// Activate
// ================================

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== STATIC_CACHE && key !== DYNAMIC_CACHE)
          .map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

// ================================
// Fetch
// ================================

self.addEventListener('fetch', event => {
  const req = event.request;

  // Solo manejamos GET
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // Ignorar cosas que no sean http(s) o de otros orígenes (chrome-extension, etc.)
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    return;
  }

  // Peticiones a la API → network-first
  if (isApiRequest(req)) {
    event.respondWith(networkFirst(req));
    return;
  }

  // Resto de recursos de nuestro origen → cache-first
  if (url.origin === self.location.origin) {
    event.respondWith(cacheFirst(req));
    return;
  }

  // Recursos externos (CDNs, fuentes, etc.) → no tocar, que vayan normal
  event.respondWith(fetch(req));
});

// -------------------------
// Estrategia: cache-first
// -------------------------
async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) return cachedResponse;

  try {
    const networkResponse = await fetch(request);
    const cache = await caches.open(DYNAMIC_CACHE);
    cache.put(request, networkResponse.clone());
    return networkResponse;
  } catch (err) {
    const acceptHeader = request.headers.get('accept') || '';

    if (acceptHeader.includes('text/html')) {
      const offlinePage = await caches.match(OFFLINE_URL);
      if (offlinePage) return offlinePage;
    }

    return new Response('Offline', {
      status: 503,
      statusText: 'Offline'
    });
  }
}

// -------------------------
// Estrategia: network-first
// -------------------------
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    const cache = await caches.open(DYNAMIC_CACHE);
    cache.put(request, networkResponse.clone());
    return networkResponse;
  } catch (err) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) return cachedResponse;

    const acceptHeader = request.headers.get('accept') || '';

    if (acceptHeader.includes('text/html')) {
      const offlinePage = await caches.match(OFFLINE_URL);
      if (offlinePage) return offlinePage;
    }

    return new Response('Offline', {
      status: 503,
      statusText: 'Offline'
    });
  }
}

// ================================
// Notificaciones: click handler
// ================================

self.addEventListener('notificationclick', event => {
  event.notification.close();
  const action = event.action;

  if (action === 'open-catalog') {
    event.waitUntil(
      clients
        .matchAll({ type: 'window', includeUncontrolled: true })
        .then(clientList => {
          for (const client of clientList) {
            if ('focus' in client) {
              client.navigate('./catalog_guitars.html');
              return client.focus();
            }
          }
          if (clients.openWindow) {
            return clients.openWindow('./catalog_guitars.html');
          }
        })
    );
  } else {
    event.waitUntil(
      clients
        .matchAll({ type: 'window', includeUncontrolled: true })
        .then(clientList => {
          for (const client of clientList) {
            if ('focus' in client) {
              return client.focus();
            }
          }
          if (clients.openWindow) {
            return clients.openWindow('./home.html');
          }
        })
    );
  }
});
