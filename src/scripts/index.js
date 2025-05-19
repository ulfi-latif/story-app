// CSS imports
import '../styles/styles.css';

import App from './pages/app';
import { requestNotificationPermission } from './push-notification';

document.addEventListener('DOMContentLoaded', async () => {
   // Minta izin notifikasi
  requestNotificationPermission();
  // Membuat instance App dan merender halaman
  const app = new App({
    content: document.querySelector('#main-content'),
    drawerButton: document.querySelector('#drawer-button'),
    navigationDrawer: document.querySelector('#navigation-drawer'),
  });
  await app.renderPage();


  // **Pendaftaran Service Worker setelah aplikasi siap**
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
      .then((registration) => {
        console.log('Service Worker registered with scope: ', registration.scope);
      })
      .catch((error) => {
        console.error('Service Worker registration failed: ', error);
      });
  }
    // Memantau perubahan hash pada URL untuk mengubah halaman
  window.addEventListener('hashchange', async () => {
    await app.renderPage();
  });
});
