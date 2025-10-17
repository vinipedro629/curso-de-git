// Service worker minimal cache (static assets)
const CACHE_NAME = 'todoapp-cache-v1';
const ASSETS = [
  '/ToDoApp/',
  '/ToDoApp/index.html',
  '/ToDoApp/css/style.css',
  '/ToDoApp/js/app.js'
];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
});
self.addEventListener('fetch', event => {
  event.respondWith(caches.match(event.request).then(resp => resp || fetch(event.request)));
});
