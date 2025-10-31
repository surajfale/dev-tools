const CACHE_NAME = 'dev-tools-cache-v1';
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/offline.html',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS)).then(self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Strategy: 
// - Navigation requests: network-first, fall back to offline.html
// - Static assets under /assets/: cache-first
// - Other requests: stale-while-revalidate
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Only handle same-origin
  const requestUrl = new URL(request.url);
  if (requestUrl.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          const cachePut = caches.open(CACHE_NAME).then((cache) => cache.put('/index.html', copy));
          event.waitUntil(cachePut);
          return response;
        })
        .catch(() => caches.match('/offline.html'))
    );
    return;
  }

  if (requestUrl.pathname.startsWith('/assets/')) {
    event.respondWith(
      caches.match(request).then((cached) => cached || fetch(request).then((response) => {
        const copy = response.clone();
        event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.put(request, copy)));
        return response;
      }))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      const fetchPromise = fetch(request)
        .then((response) => {
          const copy = response.clone();
          event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.put(request, copy)));
          return response;
        })
        .catch(() => cached || caches.match('/offline.html'));
      return cached || fetchPromise;
    })
  );
});


