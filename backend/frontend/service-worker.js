// Distortion PWA - Service Worker
// Por Dante Ian Castañeda Valencia y Jesús Ángel Ramírez Díaz
// GitHub: https://github.com/DanteCval/Distortion
// ABRIR BRANCH "Distortion PWA"
// Versión de los caches
const STATIC_CACHE = 'distortion-static-v3';
const DYNAMIC_CACHE = 'distortion-dynamic-v1';

// Página de fallback offline
const OFFLINE_URL = './offline.html';

// Archivos que se precachean en la instalación
const STATIC_ASSETS = [
  './',
  './home.html',
  './offline.html',

  // CSS
  './css/style.css',

  // JS principales
  './js/script.js',
  './js/nav.js',
  './js/notifications.js',
  './js/catalog.js',
  './js/catalog_basses.js',
  './js/db.js',

  // Icono principal / PWA
  './img/icon.png',

  // Imágenes del home
  './img/inicio_carousel1.jpg',
  './img/inicio_carousel2.jpg',
  './img/inicio_carousel3.jpg',
  './img/featured_artist.jpg'
  // Si agregas más vistas importantes, ponlas aquí
];

// Utils

// Detectar si la petición es a la API del backend
function isApiRequest(request) {
  const url = new URL(request.url);

  // Ajusta esto si cambias tu backend
  const isLocalApi =
    url.origin === 'http://localhost:3000' && url.pathname.startsWith('/api/');
  const isProdApi =
    url.origin === 'https://distortion-production.up.railway.app' &&
    url.pathname.startsWith('/api/');

  return isLocalApi || isProdApi;
}

// Install

self.addEventListener('install', event => {
  console.log('[SW] Install');

  event.waitUntil(
    caches.open(STATIC_CACHE).then(cache => {
      return cache.addAll(STATIC_ASSETS);
    })
  );

  // Forzar que este SW nuevo pase a "activated" sin esperar
  self.skipWaiting();
});

// Activate


self.addEventListener('activate', event => {
  console.log('[SW] Activate');

  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(
            key => key !== STATIC_CACHE && key !== DYNAMIC_CACHE
          )
          .map(key => {
            console.log('[SW] Deleting old cache:', key);
            return caches.delete(key);
          })
      )
    ).then(() => self.clients.claim())
  );
});

// Fetch

self.addEventListener('fetch', event => {
  // Solo manejamos GET
  if (event.request.method !== 'GET') return;

  const req = event.request;

  // Estrategia network-first para API / contenido dinámico
  if (isApiRequest(req)) {
    event.respondWith(networkFirst(req));
  } else {
    // Estrategia cache-first para assets estáticos
    event.respondWith(cacheFirst(req));
  }
});

// Estrategia: cache-first
async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) return cachedResponse;

  try {
    const networkResponse = await fetch(request);
    const cache = await caches.open(DYNAMIC_CACHE);
    cache.put(request, networkResponse.clone());
    return networkResponse;
  } catch (err) {
    console.warn('[SW] cacheFirst fallo de red:', err);

    const acceptHeader = request.headers.get('accept') || '';

    // Si es HTML y falla, mandamos a la página offline
    if (acceptHeader.includes('text/html')) {
      const offlinePage = await caches.match(OFFLINE_URL);
      if (offlinePage) return offlinePage;
    }

    // Respuesta genérica si no hay nada mejor
    return new Response('Offline', {
      status: 503,
      statusText: 'Offline'
    });
  }
}

// Estrategia: network-first

async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    const cache = await caches.open(DYNAMIC_CACHE);
    cache.put(request, networkResponse.clone());
    return networkResponse;
  } catch (err) {
    console.warn('[SW] networkFirst fallo de red:', err);

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

// Notificaciones: click handler

self.addEventListener('notificationclick', event => {
  event.notification.close();
  const action = event.action;

  if (action === 'open-catalog') {
    // Acción de botón: abrir catálogo de guitarras
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
    // Click normal en la notificación
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
