// Firebase Messaging Service Worker - Misterpips
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js');

// Configuration Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDSDK0NfVSs_VQb3TnrixiJbOpTsmoUMvU",
    authDomain: "misterpips-b71fb.firebaseapp.com",
    databaseURL: "https://misterpips-b71fb-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "misterpips-b71fb",
    storageBucket: "misterpips-b71fb.firebasestorage.app",
    messagingSenderId: "574231126409",
    appId: "1:574231126409:web:b7ed93ac4ea62e247dc158"
};

// Initialiser Firebase
firebase.initializeApp(firebaseConfig);

// Initialiser Firebase Messaging
const messaging = firebase.messaging();

// Gestion des messages en arrière-plan
messaging.onBackgroundMessage((payload) => {
    console.log('🔔 Message reçu en arrière-plan:', payload);
    
    const notificationTitle = payload.notification?.title || '💬 Misterpips Chat';
    const notificationOptions = {
        body: payload.notification?.body || 'Nouveau message VIP',
        icon: './Misterpips.jpg',
        badge: './Misterpips.jpg',
        tag: 'misterpips-chat',
        vibrate: [200, 100, 200],
        requireInteraction: false,
        data: {
            url: './mobile-dashboard.html#chat'
        }
    };
    
    return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Gestion des clics sur notifications
self.addEventListener('notificationclick', (event) => {
    console.log('🔔 Clic notification:', event.notification.tag);
    
    event.notification.close();
    
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true })
            .then((clientList) => {
                for (let client of clientList) {
                    if (client.url.includes('mobile-dashboard') && 'focus' in client) {
                        client.postMessage({ type: 'OPEN_CHAT' });
                        return client.focus();
                    }
                }
                
                if (clients.openWindow) {
                    return clients.openWindow('./mobile-dashboard.html#chat');
                }
            })
    );
});

console.log('🔥 Firebase Messaging Service Worker chargé');