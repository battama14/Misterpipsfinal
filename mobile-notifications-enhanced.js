// Notifications mobiles améliorées avec bannières
console.log('🔔 Notifications mobiles améliorées...');

// Système de notifications avec bannières
class MobileNotificationSystem {
    constructor() {
        this.settings = this.loadSettings();
        this.messageCount = 0;
        this.lastMessageTime = Date.now();
        this.init();
    }

    init() {
        this.createNotificationContainer();
        this.setupChatListener();
        this.setupBadgeSystem();
    }

    loadSettings() {
        try {
            return JSON.parse(localStorage.getItem('mobileNotificationSettings')) || {
                sound: true,
                push: true,
                vibrate: true,
                banner: true
            };
        } catch (e) {
            return { sound: true, push: true, vibrate: true, banner: true };
        }
    }

    createNotificationContainer() {
        if (document.getElementById('mobileNotificationContainer')) return;

        const container = document.createElement('div');
        container.id = 'mobileNotificationContainer';
        container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 10000;
            pointer-events: none;
        `;
        document.body.appendChild(container);
    }

    async setupChatListener() {
        if (!window.firebaseDB) {
            setTimeout(() => this.setupChatListener(), 1000);
            return;
        }

        try {
            const { ref, onValue } = await import('https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js');
            const messagesRef = ref(window.firebaseDB, 'vip_chat');
            
            onValue(messagesRef, (snapshot) => {
                if (!snapshot.exists()) return;

                const messages = Object.values(snapshot.val())
                    .sort((a, b) => a.timestamp - b.timestamp);

                const myUID = sessionStorage.getItem('firebaseUID');
                const newMessages = messages.filter(msg =>
                    msg.timestamp > this.lastMessageTime &&
                    msg.userId !== myUID &&
                    msg.timestamp > (Date.now() - 120000) &&
                    msg.message && msg.nickname
                );

                if (newMessages.length > 0) {
                    console.log(`🔔 ${newMessages.length} nouveaux messages`);
                    
                    newMessages.forEach(msg => {
                        this.showNotification(msg);
                        this.incrementBadge();
                    });
                    
                    this.lastMessageTime = Math.max(...messages.map(m => m.timestamp));
                }
            });
        } catch (error) {
            console.error('Erreur listener chat:', error);
        }
    }

    showNotification(message) {
        // Bannière visuelle
        if (this.settings.banner) {
            this.showBanner(message);
        }

        // Notification push
        if (this.settings.push && Notification.permission === 'granted') {
            this.showPushNotification(message);
        }

        // Son
        if (this.settings.sound) {
            this.playSound();
        }

        // Vibration
        if (this.settings.vibrate && 'vibrate' in navigator) {
            navigator.vibrate([300, 100, 300]);
        }
    }

    showBanner(message) {
        const banner = document.createElement('div');
        banner.className = 'mobile-notification-banner';
        banner.style.cssText = `
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 15px 20px;
            margin: 10px;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
            transform: translateY(-100%);
            transition: all 0.3s ease;
            pointer-events: auto;
            cursor: pointer;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        `;

        banner.innerHTML = `
            <div style="display: flex; align-items: center; gap: 12px;">
                <div style="font-size: 24px;">💬</div>
                <div style="flex: 1;">
                    <div style="font-weight: 600; font-size: 14px; margin-bottom: 2px;">
                        ${message.nickname}
                    </div>
                    <div style="font-size: 13px; opacity: 0.9; line-height: 1.3;">
                        ${message.message.substring(0, 80)}${message.message.length > 80 ? '...' : ''}
                    </div>
                </div>
                <div style="font-size: 12px; opacity: 0.7;">
                    ${new Date(message.timestamp).toLocaleTimeString('fr-FR', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                    })}
                </div>
            </div>
        `;

        // Clic pour ouvrir le chat
        banner.onclick = () => {
            if (window.showMobileSection) {
                window.showMobileSection('chat');
            }
            this.resetBadge();
            banner.remove();
        };

        const container = document.getElementById('mobileNotificationContainer');
        container.appendChild(banner);

        // Animation d'entrée
        setTimeout(() => {
            banner.style.transform = 'translateY(0)';
        }, 100);

        // Auto-suppression après 5 secondes
        setTimeout(() => {
            banner.style.transform = 'translateY(-100%)';
            setTimeout(() => banner.remove(), 300);
        }, 5000);
    }

    showPushNotification(message) {
        try {
            const notification = new Notification(`💬 ${message.nickname}`, {
                body: message.message.substring(0, 100),
                icon: './Misterpips.jpg',
                badge: './Misterpips.jpg',
                tag: 'misterpips-chat',
                requireInteraction: false,
                silent: !this.settings.sound,
                vibrate: this.settings.vibrate ? [300, 100, 300] : [],
                data: { messageId: message.id }
            });

            notification.onclick = () => {
                window.focus();
                if (window.showMobileSection) {
                    window.showMobileSection('chat');
                }
                this.resetBadge();
                notification.close();
            };

            // Auto-fermeture après 8 secondes
            setTimeout(() => notification.close(), 8000);

        } catch (error) {
            console.error('Erreur push notification:', error);
        }
    }

    playSound() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            if (audioContext.state === 'suspended') {
                audioContext.resume();
            }
            
            // Son plus agréable
            const oscillator1 = audioContext.createOscillator();
            const oscillator2 = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator1.connect(gainNode);
            oscillator2.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            // Accord harmonieux
            oscillator1.frequency.setValueAtTime(523.25, audioContext.currentTime); // Do
            oscillator2.frequency.setValueAtTime(659.25, audioContext.currentTime); // Mi
            
            gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
            
            oscillator1.start(audioContext.currentTime);
            oscillator2.start(audioContext.currentTime);
            oscillator1.stop(audioContext.currentTime + 0.4);
            oscillator2.stop(audioContext.currentTime + 0.4);
            
        } catch (error) {
            console.log('Son non disponible:', error);
        }
    }

    setupBadgeSystem() {
        // Badge sur l'icône PWA
        this.updateAppBadge();
        
        // Badge sur navigation
        this.updateNavBadge();
    }

    incrementBadge() {
        this.messageCount++;
        this.updateAppBadge();
        this.updateNavBadge();
    }

    resetBadge() {
        this.messageCount = 0;
        this.updateAppBadge();
        this.updateNavBadge();
    }

    updateAppBadge() {
        if ('setAppBadge' in navigator) {
            if (this.messageCount > 0) {
                navigator.setAppBadge(this.messageCount);
            } else {
                navigator.clearAppBadge();
            }
        }
    }

    updateNavBadge() {
        const chatNavBtn = document.querySelector('.nav-btn[onclick*="chat"]');
        if (!chatNavBtn) return;

        let badge = chatNavBtn.querySelector('.nav-badge');

        if (this.messageCount > 0) {
            if (!badge) {
                badge = document.createElement('div');
                badge.className = 'nav-badge';
                badge.style.cssText = `
                    position: absolute;
                    top: 5px;
                    right: 5px;
                    background: #ff4757;
                    color: white;
                    border-radius: 50%;
                    width: 20px;
                    height: 20px;
                    font-size: 11px;
                    font-weight: bold;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    animation: pulse 2s infinite;
                `;
                chatNavBtn.style.position = 'relative';
                chatNavBtn.appendChild(badge);
            }
            badge.textContent = this.messageCount > 99 ? '99+' : this.messageCount;
        } else if (badge) {
            badge.remove();
        }
    }

    // Méthodes publiques
    updateSettings(newSettings) {
        this.settings = { ...this.settings, ...newSettings };
        localStorage.setItem('mobileNotificationSettings', JSON.stringify(this.settings));
    }

    testNotification() {
        const testMessage = {
            nickname: 'Test',
            message: 'Ceci est un test de notification mobile',
            timestamp: Date.now(),
            id: 'test_' + Date.now()
        };
        this.showNotification(testMessage);
    }
}

// Ajouter CSS pour les animations
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
    }
    
    .mobile-notification-banner:hover {
        transform: translateY(0) scale(1.02) !important;
    }
`;
document.head.appendChild(style);

// Initialiser le système
let mobileNotificationSystem;

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        mobileNotificationSystem = new MobileNotificationSystem();
        
        // Exposer globalement
        window.mobileNotificationSystem = mobileNotificationSystem;
        
        // Reset badge quand on ouvre le chat
        const chatSection = document.getElementById('chat');
        if (chatSection) {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.target.classList.contains('active')) {
                        mobileNotificationSystem.resetBadge();
                    }
                });
            });
            observer.observe(chatSection, { attributes: true, attributeFilter: ['class'] });
        }
        
        console.log('✅ Système de notifications mobiles initialisé');
    }, 2000);
});

// Fonctions globales pour compatibilité
window.resetUnreadCount = () => {
    if (mobileNotificationSystem) {
        mobileNotificationSystem.resetBadge();
    }
};

window.testMobileNotification = () => {
    if (mobileNotificationSystem) {
        mobileNotificationSystem.testNotification();
    }
};

console.log('✅ Notifications mobiles améliorées chargées');