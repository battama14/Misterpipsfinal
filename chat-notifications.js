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
                msg.timestamp > (Date.now() - 120000) && // 2 minutes max
                msg.message && msg.nickname // Vérifier que le message est valide
            );
            
            if (newMessages.length > 0) {
                console.log(`🔔 ${newMessages.length} nouveaux messages détectés`);
                newMessages.forEach(msg => {
                    console.log('💬 Nouveau message de:', msg.nickname, '|', msg.message.substring(0, 50));
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

// Récupérer paramètres notifications
function getNotificationSettings() {
    try {
        const settings = JSON.parse(localStorage.getItem('mobileNotificationSettings')) || { sound: true, push: true, vibrate: true };
        return settings;
    } catch (e) {
        return { sound: true, push: true, vibrate: true };
    }
}

// Afficher notification
function showChatNotification(message) {
    const settings = getNotificationSettings();

    // Vérifier permissions et préférences push
    if (Notification.permission !== 'granted' || !settings.push) {
        console.log('❌ Permissions notifications refusées ou désactivées');
        return;
    }

    // Ne pas notifier si l'app est active et sur le chat
    if (document.hasFocus() && isOnChatSection()) {
        console.log('🔕 Pas de notification - sur le chat');
        return;
    }

    console.log('🔔 Affichage notification:', message.nickname, message.message);

    try {
        const notification = new Notification(`💬 ${message.nickname}`, {
            body: message.message.substring(0, 100),
            icon: './Misterpips.jpg',
            badge: './Misterpips.jpg',
            tag: 'misterpips-chat-' + Date.now(),
            requireInteraction: true,
            silent: !settings.sound, // Désactiver le son par défaut si paramétré
            vibrate: settings.vibrate ? [300, 100, 300] : [],
            actions: [
                {
                    action: 'open',
                    title: 'Ouvrir Chat'
                }
            ]
        });

        // Son personnalisé selon les préférences
        if (settings.sound) {
            playNotificationSound();
        }

        // Vibration mobile selon les préférences
        if (settings.vibrate && 'vibrate' in navigator) {
            navigator.vibrate([300, 100, 300]);
        }

        // Clic pour ouvrir
        notification.onclick = () => {
            console.log('🔔 Clic notification');
            window.focus();

            if (window.showMobileSection) {
                window.showMobileSection('chat');
            }

            resetBadge();
            notification.close();
        };

        // Auto-fermer après 10 secondes
        setTimeout(() => {
            try {
                notification.close();
            } catch (e) {}
        }, 10000);

    } catch (error) {
        console.error('❌ Erreur création notification:', error);
    }
}

// Vérifier si on est sur le chat
function isOnChatSection() {
    const chatSection = document.getElementById('chat');
    return chatSection && chatSection.classList.contains('active');
}

// Jouer son de notification
function playNotificationSound() {
    try {
        // Créer un son simple
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
        
        console.log('🔊 Son notification joué');
    } catch (error) {
        console.log('❌ Erreur son:', error);
    }
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