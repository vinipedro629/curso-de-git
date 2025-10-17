// Service worker minimal cache (static assets)
const CACHE_NAME = 'todoapp-cache-v1';
const ASSETS = [
  './',
  './index.html',
  './css/style.css',
  './js/app.js',
  './manifest.json'
];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
});
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(resp => {
      return resp || fetch(event.request).catch(()=>{
        // could return offline fallback here
        return caches.match('./index.html');
      });
    })
  );
});
