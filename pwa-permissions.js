// PWA Permissions et Badge - Misterpips
let messageCount = 0;

// Demander permissions au premier lancement PWA
function requestPWAPermissions() {
    if (window.matchMedia('(display-mode: standalone)').matches) {
        setTimeout(async () => {
            try {
                // Demander permission notifications
                if ('Notification' in window && Notification.permission === 'default') {
                    const permission = await Notification.requestPermission();
                    if (permission === 'granted') {
                        console.log('✅ Permissions notifications accordées');
                        
                        // Test notification
                        new Notification('🎉 Misterpips installé !', {
                            body: 'Vous recevrez maintenant les notifications du chat VIP',
                            icon: './Misterpips.jpg',
                            badge: './Misterpips.jpg'
                        });
                    }
                }
            } catch (error) {
                console.error('Erreur permissions:', error);
            }
        }, 2000);
    }
}

// Mettre à jour le badge de l'icône
function updateAppBadge(count) {
    if ('setAppBadge' in navigator) {
        if (count > 0) {
            navigator.setAppBadge(count);
        } else {
            navigator.clearAppBadge();
        }
    }
}

// Incrémenter le compteur de messages
function incrementMessageBadge() {
    messageCount++;
    updateAppBadge(messageCount);
    console.log(`📱 Badge mis à jour: ${messageCount}`);
}

// Reset le compteur
function resetMessageBadge() {
    messageCount = 0;
    updateAppBadge(0);
    console.log('📱 Badge reset');
}

// Écouter les nouveaux messages pour le badge
function initBadgeSystem() {
    if (!window.firebaseDB) return;
    
    const { ref, onValue } = window.firebaseModules;
    const messagesRef = ref(window.firebaseDB, 'vip_chat');
    
    let lastMessageTime = Date.now();
    
    onValue(messagesRef, (snapshot) => {
        if (snapshot.exists()) {
            const messages = Object.values(snapshot.val());
            const newMessages = messages.filter(msg => 
                msg.timestamp > lastMessageTime && 
                msg.userId !== sessionStorage.getItem('firebaseUID')
            );
            
            if (newMessages.length > 0) {
                newMessages.forEach(() => incrementMessageBadge());
                lastMessageTime = Math.max(...messages.map(m => m.timestamp));
            }
        }
    });
}

// Reset badge quand on ouvre le chat
function resetBadgeOnChatOpen() {
    const chatToggle = document.getElementById('chatToggle');
    const chatNavBtn = document.querySelector('[onclick*="chat"]');
    
    if (chatToggle) {
        chatToggle.addEventListener('click', resetMessageBadge);
    }
    
    if (chatNavBtn) {
        chatNavBtn.addEventListener('click', resetMessageBadge);
    }
}

// Initialiser au chargement
document.addEventListener('DOMContentLoaded', () => {
    requestPWAPermissions();
    
    setTimeout(() => {
        if (window.firebaseDB) {
            initBadgeSystem();
            resetBadgeOnChatOpen();
        }
    }, 3000);
});

// Exposer les fonctions
window.incrementMessageBadge = incrementMessageBadge;
window.resetMessageBadge = resetMessageBadge;
window.updateAppBadge = updateAppBadge;

console.log('📱 PWA Permissions et Badge système chargé');