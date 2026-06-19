const CACHE_NAME = 'skyline-weather-v1';
const ASSETS_TO_CACHE = [
  '/Skyline-Weather-App/',
  '/Skyline-Weather-App/index.html',
  '/Skyline-Weather-App/assets/css/styles.css',
  '/Skyline-Weather-App/assets/js/app.js',
  '/Skyline-Weather-App/assets/images/cloudy.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
});
