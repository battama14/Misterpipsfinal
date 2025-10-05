// Système de notifications chat - Misterpips
let messageCount = 0;
let lastMessageTime = Date.now();

// Initialiser les notifications chat
async function initChatNotifications() {
    if (!window.firebaseDB) {
        setTimeout(initChatNotifications, 2000);
        return;
    }

    console.log('🔔 Initialisation notifications chat');

    try {
        const { ref, onValue } = await import('https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js');
        const messagesRef = ref(window.firebaseDB, 'vip_chat');
        
        onValue(messagesRef, (snapshot) => {
            if (!snapshot.exists()) return;
            
            const messages = Object.values(snapshot.val());
            const myUID = sessionStorage.getItem('firebaseUID');
            
            // Filtrer les nouveaux messages des autres utilisateurs
            const newMessages = messages.filter(msg => 
                msg.timestamp > lastMessageTime &&
                msg.userId !== myUID &&
                msg.timestamp > (Date.now() - 60000) // 1 minute max
            );
            
            if (newMessages.length > 0) {
                newMessages.forEach(msg => {
                    showChatNotification(msg);
                    incrementBadge();
                });
                lastMessageTime = Math.max(...messages.map(m => m.timestamp));
            }
        });
        
    } catch (error) {
        console.error('Erreur notifications chat:', error);
    }
}

// Afficher notification
function showChatNotification(message) {
    // Vérifier permissions
    if (Notification.permission !== 'granted') return;
    
    // Ne pas notifier si l'app est active et sur le chat
    if (document.hasFocus() && isOnChatSection()) return;
    
    console.log('🔔 Notification:', message.nickname);
    
    const notification = new Notification(`💬 ${message.nickname}`, {
        body: message.message.substring(0, 100),
        icon: './Misterpips.jpg',
        badge: './Misterpips.jpg',
        tag: 'misterpips-chat',
        requireInteraction: false,
        silent: false
    });
    
    // Vibration mobile
    if ('vibrate' in navigator) {
        navigator.vibrate([300, 100, 300]);
    }
    
    // Clic pour ouvrir
    notification.onclick = () => {
        window.focus();
        
        if (window.showMobileSection) {
            window.showMobileSection('chat');
        }
        
        resetBadge();
        notification.close();
    };
    
    // Auto-fermer après 8 secondes
    setTimeout(() => notification.close(), 8000);
}

// Vérifier si on est sur le chat
function isOnChatSection() {
    const chatSection = document.getElementById('chat');
    return chatSection && chatSection.classList.contains('active');
}

// Incrémenter badge
function incrementBadge() {
    messageCount++;
    updateBadge();
}

// Reset badge
function resetBadge() {
    messageCount = 0;
    updateBadge();
}

// Mettre à jour badge
function updateBadge() {
    // Badge sur l'icône PWA
    if ('setAppBadge' in navigator) {
        if (messageCount > 0) {
            navigator.setAppBadge(messageCount);
        } else {
            navigator.clearAppBadge();
        }
    }
    
    // Badge sur navigation
    const chatNavBtn = document.querySelector('[onclick*="chat"]');
    if (chatNavBtn) {
        let badge = chatNavBtn.querySelector('.nav-badge');
        
        if (messageCount > 0) {
            if (!badge) {
                badge = document.createElement('div');
                badge.className = 'nav-badge';
                chatNavBtn.appendChild(badge);
            }
            badge.textContent = messageCount > 99 ? '99+' : messageCount;
        } else if (badge) {
            badge.remove();
        }
    }
}

// Reset badge quand on ouvre le chat
function setupBadgeReset() {
    // Navigation bottom
    const chatNavBtn = document.querySelector('[onclick*="chat"]');
    if (chatNavBtn) {
        chatNavBtn.addEventListener('click', resetBadge);
    }
    
    // Observer changement de section
    const chatSection = document.getElementById('chat');
    if (chatSection) {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.target.classList.contains('active')) {
                    resetBadge();
                }
            });
        });
        observer.observe(chatSection, { attributes: true, attributeFilter: ['class'] });
    }
}

// Initialiser au chargement
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        initChatNotifications();
        setupBadgeReset();
    }, 3000);
});

// Exposer fonctions
window.resetChatBadge = resetBadge;
window.incrementChatBadge = incrementBadge;

console.log('🔔 Système notifications chat chargé');