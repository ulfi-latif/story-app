export function requestNotificationPermission() {
  if ('Notification' in window) {
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        console.log('Notification permission granted.');
      } else {
        console.log('Notification permission denied.');
      }
    });
  }
}

export function showNotification(title, options) {
  if (Notification.permission === 'granted') {
    new Notification(title, options);  // Menampilkan notifikasi
  } else {
    console.log('Notification permission not granted.');
  }
}

export async function subscribeToPushNotifications() {
  try {
    const registration = await navigator.serviceWorker.ready;
    const pushSubscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: '<YOUR_PUBLIC_VAPID_KEY>', // Ganti dengan Public VAPID Key
    });

    await sendSubscriptionToServer(pushSubscription);
    console.log('User is subscribed to push notifications.');
  } catch (error) {
    console.error('Failed to subscribe to push notifications', error);
  }
}

async function sendSubscriptionToServer(subscription) {
  const response = await fetch('/push-notification', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ subscription }),
  });

  if (!response.ok) {
    console.error('Failed to send subscription to the server');
  }
}
