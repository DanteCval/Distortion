// js/notifications.js

const ENABLE_NOTIFICATIONS_ID = 'enable-notifications-btn';

document.addEventListener('DOMContentLoaded', () => {
  // Creamos un botón flotante si no existe en el HTML
  let btn = document.getElementById(ENABLE_NOTIFICATIONS_ID);

  if (!btn) {
    btn = document.createElement('button');
    btn.id = ENABLE_NOTIFICATIONS_ID;
    btn.textContent = 'Enable notifications';
    btn.style.position = 'fixed';
    btn.style.bottom = '1rem';
    btn.style.right = '1rem';
    btn.style.zIndex = '9999';
    btn.style.padding = '0.6rem 1rem';
    btn.style.borderRadius = '999px';
    btn.style.border = 'none';
    btn.style.cursor = 'pointer';
    btn.style.backgroundColor = '#e74c3c';
    btn.style.color = '#fff';
    btn.style.fontSize = '0.9rem';
    btn.style.boxShadow = '0 4px 10px rgba(0,0,0,0.3)';
    btn.style.opacity = '0.9';

    document.body.appendChild(btn);
  }

  btn.addEventListener('click', async () => {
    await requestNotificationPermission();
  });
});

async function requestNotificationPermission() {
  if (!('Notification' in window)) {
    alert('Notifications are not supported in this browser.');
    return;
  }

  const currentPermission = Notification.permission;

  if (currentPermission === 'granted') {
    showTestNotification();
    triggerVibration();
    return;
  }

  if (currentPermission === 'denied') {
    alert('You have blocked notifications. Please enable them in your browser settings.');
    return;
  }

  try {
    const result = await Notification.requestPermission();
    if (result === 'granted') {
      showTestNotification();
      triggerVibration();
    } else {
      alert('Notifications permission was not granted.');
    }
  } catch (err) {
    console.error('Error requesting notification permission', err);
  }
}

function triggerVibration() {
  if ('vibrate' in navigator) {
    // Patrón sencillo: vibra 100ms, pausa 50ms, vibra 100ms
    navigator.vibrate([100, 50, 100]);
  }
}

function showTestNotification() {
  if (!('serviceWorker' in navigator)) {
    // Fallback: notificación simple sin SW
    new Notification('Distortion', {
      body: 'Notifications are now enabled!',
      icon: 'img/icon.png'
    });
    return;
  }

  navigator.serviceWorker.ready.then(registration => {
    registration.showNotification('Distortion', {
      body: 'Notifications are now enabled!',
      icon: 'img/icon.png',
      badge: 'img/icon.png',
      vibrate: [100, 50, 100],
      data: {
        url: './home.html'
      },
      actions: [
        {
          action: 'open-catalog',
          title: 'Open catalog'
        }
      ]
    });
  });
}
