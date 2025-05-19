self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('my-cache').then((cache) => {
      return cache.addAll([
        '/', // Halaman utama aplikasi
        '/index.html',
        '/styles/styles.css',
        '/scripts/index.js',
        'scripts/push-notification.js',
        '/public/images/icons/icon-x192.png',
        'https://a.tile.openstreetmap.org/12/1024/2048.png', // Tambahkan URL tile peta OpenStreetMap
        // Tambahkan gambar lain yang perlu disimpan
        '/images/story-image.jpg',
      ]);
    })
    
  );
});

self.addEventListener('push', (event) => {
  const options = {
    body: event.data.text(),
    icon: '/images/icons/icon-x192.png',
    badge: '/images/icons/icon-x192.png',
  };

  event.waitUntil(
    self.registration.showNotification('New Story Notification', options)
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      // Caching untuk tile peta OpenStreetMap
      if (event.request.url.includes('tile.openstreetmap.org')) {
        return caches.open('map-tiles').then((cache) => {
          return fetch(event.request).then((response) => {
            cache.put(event.request, response.clone());  // Cache tile peta
            return response;
          });
        });
      }

      // Jika tidak ada di cache, ambil dari server
      return fetch(event.request);
    })
  );
});
