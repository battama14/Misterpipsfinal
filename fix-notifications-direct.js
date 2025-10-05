// Fix notifications direct - Force activation
console.log('🔔 Fix notifications direct');

let notificationEnabled = false;

// Forcer activation notifications
async function forceEnableNotifications() {
    if (!('Notification' in window)) {
        console.log('❌ Pas de support notifications');
        return false;
    }
    
    try {
        const permission = await Notification.requestPermission();
        console.log('🔔 Permission:', permission);
        
        if (permission === 'granted') {
            notificationEnabled = true;
            
            // Test immédiat
            const testNotif = new Notification('✅ Notifications activées !', {
                body: 'Misterpips peut maintenant vous notifier',
                icon: './Misterpips.jpg'
            });
            
            setTimeout(() => testNotif.close(), 3000);
            
            // Démarrer écoute
            startDirectListening();
            return true;
        }
    } catch (error) {
        console.error('Erreur notifications:', error);
    }
    
    return false;
}

// Écoute directe des messages
function startDirectListening() {
    if (!window.firebaseDB) {
        setTimeout(startDirectListening, 2000);
        return;
    }
    
    console.log('👂 Écoute messages directe...');
    
    import('https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js')
        .then(({ ref, onValue }) => {
            const messagesRef = ref(window.firebaseDB, 'vip_chat');
            let lastCheck = Date.now();
            
            onValue(messagesRef, (snapshot) => {
                if (!snapshot.exists() || !notificationEnabled) return;
                
                const messages = Object.values(snapshot.val());
                const myUID = sessionStorage.getItem('firebaseUID');
                
                // Nouveaux messages seulement
                const newMessages = messages.filter(msg => 
                    msg.timestamp > lastCheck &&
                    msg.userId !== myUID &&
                    msg.timestamp > (Date.now() - 30000) // 30 secondes max
                );
                
                if (newMessages.length > 0) {
                    const lastMsg = newMessages[newMessages.length - 1];
                    showDirectNotification(lastMsg);
                    lastCheck = Date.now();
                }
            });
        })
        .catch(error => {
            console.error('Erreur écoute:', error);
        });
}

// Notification directe
function showDirectNotification(message) {
    if (!notificationEnabled || document.hasFocus()) return;
    
    console.log('🔔 Notification:', message.nickname);
    
    const notification = new Notification(`💬 ${message.nickname}`, {
        body: message.message.substring(0, 80),
        icon: './Misterpips.jpg',
        tag: 'misterpips-chat',
        requireInteraction: false
    });
    
    // Vibration
    if ('vibrate' in navigator) {
        navigator.vibrate([300, 100, 300]);
    }
    
    // Clic pour ouvrir
    notification.onclick = () => {
        window.focus();
        
        // Mobile
        if (window.showMobileSection) {
            window.showMobileSection('chat');
        }
        
        // PC
        const chatWindow = document.getElementById('chatWindow');
        if (chatWindow) {
            chatWindow.classList.add('active');
        }
        
        notification.close();
    };
    
    // Auto-fermer
    setTimeout(() => notification.close(), 6000);
}

// Test manuel
function testDirectNotification() {
    if (!notificationEnabled) {
        forceEnableNotifications();
        return;
    }
    
    showDirectNotification({
        nickname: 'Test',
        message: 'Ceci est un test de notification !',
        timestamp: Date.now()
    });
}

// Auto-activation
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(forceEnableNotifications, 1000);
});

// Bouton de test visible
setTimeout(() => {
    const testBtn = document.createElement('button');
    testBtn.textContent = '🔔 ACTIVER NOTIF';
    testBtn.style.cssText = `
        position: fixed; top: 20px; right: 20px; z-index: 99999;
        background: #ff4757; color: white; border: none;
        padding: 15px 20px; border-radius: 30px; font-size: 16px;
        font-weight: bold; box-shadow: 0 4px 15px rgba(0,0,0,0.3);
    `;
    testBtn.onclick = testDirectNotification;
    document.body.appendChild(testBtn);
}, 2000);

// Exposer fonctions
window.forceEnableNotifications = forceEnableNotifications;
window.testDirectNotification = testDirectNotification;

console.log('✅ Fix notifications direct prêt');