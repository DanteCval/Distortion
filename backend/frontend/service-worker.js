const CACHE_STATIC = 'distortion-static-v2';
const CACHE_DYNAMIC = 'distortion-dynamic-v1';

const STATIC_ASSETS = [
  './',
  './home.html',
  './offline.html',
  './css/style.css',
  './js/script.js',
  './img/icon.png',
  // Agrega aquí otras vistas principales, logos, etc.
   // 🔽 Imágenes del home:
  './img/inicio_carousel1.jpg',
  './img/inicio_carousel2.jpg',
  './img/inicio_carousel3.jpg',
  './img/featured_artist.jpg'
];

self.addEventListener('install', event => {
  console.log('[SW] Install');
  event.waitUntil(
    caches.open(CACHE_STATIC).then(cache => cache.addAll(STATIC_ASSETS))
  );
});

self.addEventListener('activate', event => {
  console.log('[SW] Activate');
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(
            key => key !== CACHE_STATIC && key !== CACHE_DYNAMIC
          )
          .map(key => caches.delete(key))
      )
    )
  );
});

// Utilidad: detectar si es una petición a tu backend/API
function isApiRequest(request) {
  const url = new URL(request.url);
  // Ajusta esto según tu backend (ejemplo):
  // return url.origin === 'http://localhost:3000' && url.pathname.startsWith('/api/');
  return url.pathname.startsWith('/api/');
}

self.addEventListener('fetch', event => {
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

async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) return cachedResponse;

  try {
    const networkResponse = await fetch(request);
    const cache = await caches.open(CACHE_DYNAMIC);
    cache.put(request, networkResponse.clone());
    return networkResponse;
  } catch (err) {
    // Si falla y es un HTML, mandar a offline.html
    if (request.headers.get('accept')?.includes('text/html')) {
      return caches.match('./offline.html');
    }
    return new Response('Sin conexión', { status: 503, statusText: 'Offline' });
  }
}

async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    const cache = await caches.open(CACHE_DYNAMIC);
    cache.put(request, networkResponse.clone());
    return networkResponse;
  } catch (err) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) return cachedResponse;

    if (request.headers.get('accept')?.includes('text/html')) {
      return caches.match('./offline.html');
    }
    return new Response('Sin conexión', { status: 503, statusText: 'Offline' });
  }
}

// 
self.addEventListener('notificationclick', event => {
  event.notification.close();

  const action = event.action;

  if (action === 'open-catalog') {
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
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
      clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
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
