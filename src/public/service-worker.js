self.addEventListener('push', (event) => {
  const options = {
    body: event.data.text(),
    icon: '/images/icons/icon-x192.png',  // path icon yang digunakan
    badge: '/images/icons/icon-x192.png', // path badge jika ada
  };

  event.waitUntil(
    self.registration.showNotification('New Story Notification', options)
  );
});
