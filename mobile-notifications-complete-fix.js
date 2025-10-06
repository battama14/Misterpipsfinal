// Correction complète notifications mobile
console.log('🔔 Correction notifications mobile...');

class MobileNotificationsCompleteFix {
    constructor() {
        this.messageCount = 0;
        this.lastMessageTimestamp = Date.now();
        this.isOnChat = false;
        this.init();
    }

    init() {
        console.log('🔔 Initialisation correction notifications...');
        
        // Attendre Firebase
        this.waitForFirebase();
        
        // Corriger immédiatement
        setTimeout(() => this.fixNotifications(), 1000);
        
        // Observer les changements de section
        this.observeSectionChanges();
    }

    async waitForFirebase() {
        let attempts = 0;
        while (!window.firebaseDB && attempts < 50) {
            await new Promise(resolve => setTimeout(resolve, 200));
            attempts++;
        }
        
        if (window.firebaseDB) {
            console.log('✅ Firebase prêt');
            this.setupChatListener();
        }
    }

    fixNotifications() {
        console.log('🔧 Correction système notifications...');
        
        // Corriger le reset du badge
        this.fixBadgeReset();
        
        // Corriger les sons
        this.fixNotificationSounds();
        
        // Corriger l'affichage des bannières
        this.fixNotificationBanners();
        
        // Corriger les permissions
        this.fixPermissions();
    }

    // Fix reset badge quand on lit les messages
    fixBadgeReset() {
        console.log('🔧 Correction reset badge...');
        
        // Observer quand on va sur le chat
        const chatNavBtns = document.querySelectorAll('.nav-btn');
        chatNavBtns.forEach((btn, index) => {
            if (index === 3) { // Chat est le 4ème bouton
                btn.addEventListener('click', () => {
                    console.log('📱 Navigation vers chat détectée');
                    setTimeout(() => {
                        this.resetBadge();
                        this.isOnChat = true;
                    }, 100);
                });
            } else {
                btn.addEventListener('click', () => {
                    this.isOnChat = false;
                });
            }
        });

        // Observer les changements de section active
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.target.id === 'chat' && mutation.type === 'attributes') {
                    if (mutation.target.classList.contains('active')) {
                        console.log('📱 Section chat activée');
                        setTimeout(() => {
                            this.resetBadge();
                            this.isOnChat = true;
                        }, 200);
                    } else {
                        this.isOnChat = false;
                    }
                }
            });
        });

        const chatSection = document.getElementById('chat');
        if (chatSection) {
            observer.observe(chatSection, { attributes: true, attributeFilter: ['class'] });
        }

        // Reset manuel quand on scroll dans les messages
        const chatMessages = document.getElementById('chatMessages');
        if (chatMessages) {
            chatMessages.addEventListener('scroll', () => {
                if (this.isOnChat) {
                    this.resetBadge();
                }
            });
        }

        // Fonction globale de reset
        window.resetUnreadCount = () => {
            console.log('🔄 Reset manuel badge');
            this.resetBadge();
        };

        console.log('✅ Reset badge corrigé');
    }

    // Fix sons de notification
    fixNotificationSounds() {
        console.log('🔧 Correction sons notifications...');
        
        // Créer un contexte audio réutilisable
        this.audioContext = null;
        
        // Fonction de son améliorée
        this.playSound = () => {
            try {
                // Vérifier les paramètres
                const settings = this.getSettings();
                if (!settings.sound) {
                    console.log('🔇 Son désactivé');
                    return;
                }

                // Créer le contexte si nécessaire
                if (!this.audioContext) {
                    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
                }

                // Son de notification
                const oscillator = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();

                oscillator.connect(gainNode);
                gainNode.connect(this.audioContext.destination);

                // Fréquences pour un son agréable
                oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
                oscillator.frequency.setValueAtTime(600, this.audioContext.currentTime + 0.1);

                // Volume
                gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);

                oscillator.start(this.audioContext.currentTime);
                oscillator.stop(this.audioContext.currentTime + 0.5);

                console.log('🔊 Son notification joué');
            } catch (error) {
                console.log('❌ Erreur son:', error);
                
                // Fallback avec beep simple
                try {
                    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT');
                    audio.play();
                } catch (e) {
                    console.log('❌ Fallback son échoué');
                }
            }
        };

        console.log('✅ Sons notifications corrigés');
    }

    // Fix bannières de notification
    fixNotificationBanners() {
        console.log('🔧 Correction bannières notifications...');
        
        this.showBanner = (message) => {
            console.log('🔔 Affichage bannière:', message.nickname);
            
            // Vérifier permissions
            if (Notification.permission !== 'granted') {
                console.log('❌ Permissions non accordées');
                return;
            }

            // Vérifier paramètres
            const settings = this.getSettings();
            if (!settings.push) {
                console.log('🔕 Bannières désactivées');
                return;
            }

            // Ne pas afficher si on est sur le chat
            if (document.hasFocus() && this.isOnChat) {
                console.log('🔕 Pas de bannière - sur le chat');
                this.playSound(); // Juste le son
                return;
            }

            try {
                const notification = new Notification(`💬 ${message.nickname}`, {
                    body: message.message.substring(0, 100),
                    icon: './Misterpips.jpg',
                    badge: './Misterpips.jpg',
                    tag: 'misterpips-chat-' + Date.now(),
                    requireInteraction: false,
                    silent: true, // Gérer le son manuellement
                    vibrate: settings.vibrate ? [300, 100, 300] : []
                });

                // Son
                this.playSound();

                // Vibration
                if (settings.vibrate && 'vibrate' in navigator) {
                    navigator.vibrate([300, 100, 300]);
                }

                // Clic pour ouvrir
                notification.onclick = () => {
                    console.log('🔔 Clic bannière');
                    window.focus();
                    this.showChatSection();
                    this.resetBadge();
                    notification.close();
                };

                // Auto-fermer
                setTimeout(() => {
                    try {
                        notification.close();
                    } catch (e) {}
                }, 8000);

                console.log('✅ Bannière affichée');

            } catch (error) {
                console.error('❌ Erreur bannière:', error);
            }
        };

        console.log('✅ Bannières notifications corrigées');
    }

    // Fix permissions
    fixPermissions() {
        console.log('🔧 Correction permissions...');
        
        const activateBtn = document.getElementById('activateNotificationsBtn');
        if (activateBtn) {
            // Remplacer le bouton
            const newBtn = activateBtn.cloneNode(true);
            activateBtn.parentNode.replaceChild(newBtn, activateBtn);
            
            newBtn.onclick = async () => {
                console.log('🔔 Demande permissions');
                
                try {
                    const permission = await Notification.requestPermission();
                    console.log('🔔 Permission:', permission);
                    
                    if (permission === 'granted') {
                        // Activer les paramètres
                        const pushToggle = document.getElementById('mobilePushToggle');
                        if (pushToggle) pushToggle.checked = true;
                        
                        this.saveSettings({
                            sound: document.getElementById('mobileSoundToggle')?.checked || true,
                            push: true,
                            vibrate: document.getElementById('mobileVibrateToggle')?.checked || true
                        });
                        
                        // Test
                        const testNotif = new Notification('✅ Notifications activées !', {
                            body: 'Test réussi - Vous recevrez les messages',
                            icon: './Misterpips.jpg'
                        });
                        
                        this.playSound();
                        
                        newBtn.textContent = '✅ Notifications Activées';
                        newBtn.style.background = '#28a745';
                        newBtn.disabled = true;
                        
                        setTimeout(() => testNotif.close(), 5000);
                        
                    } else {
                        alert('❌ Permissions refusées');
                    }
                } catch (error) {
                    console.error('Erreur permissions:', error);
                    alert('❌ Erreur: ' + error.message);
                }
            };
        }

        console.log('✅ Permissions corrigées');
    }

    // Setup écoute chat avec corrections
    async setupChatListener() {
        console.log('👂 Configuration écoute chat...');
        
        try {
            const { ref, onValue } = await import('https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js');
            const messagesRef = ref(window.firebaseDB, 'vip_chat');
            
            onValue(messagesRef, (snapshot) => {
                if (!snapshot.exists()) return;
                
                const messages = Object.values(snapshot.val())
                    .sort((a, b) => a.timestamp - b.timestamp);
                
                // Vérifier nouveaux messages
                const myUID = sessionStorage.getItem('firebaseUID');
                const newMessages = messages.filter(msg =>
                    msg.timestamp > this.lastMessageTimestamp &&
                    msg.userId !== myUID &&
                    msg.timestamp > (Date.now() - 120000) && // 2 minutes max
                    msg.message && msg.nickname
                );
                
                if (newMessages.length > 0) {
                    console.log(`🔔 ${newMessages.length} nouveaux messages`);
                    
                    // Incrémenter badge pour chaque message
                    newMessages.forEach(() => {
                        this.incrementBadge();
                    });
                    
                    // Afficher bannière pour le dernier
                    const lastMessage = newMessages[newMessages.length - 1];
                    this.showBanner(lastMessage);
                    
                    this.lastMessageTimestamp = Math.max(...messages.map(m => m.timestamp));
                }
            });
            
            console.log('✅ Écoute chat configurée');
            
        } catch (error) {
            console.error('❌ Erreur écoute chat:', error);
        }
    }

    // Observer changements de section
    observeSectionChanges() {
        const sections = document.querySelectorAll('.section');
        sections.forEach(section => {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                        if (section.id === 'chat' && section.classList.contains('active')) {
                            console.log('📱 Chat section active');
                            this.isOnChat = true;
                            setTimeout(() => this.resetBadge(), 500);
                        } else if (section.classList.contains('active')) {
                            this.isOnChat = false;
                        }
                    }
                });
            });
            
            observer.observe(section, { attributes: true, attributeFilter: ['class'] });
        });
    }

    // Fonctions utilitaires
    incrementBadge() {
        this.messageCount++;
        this.updateBadge();
        console.log('📈 Badge incrémenté:', this.messageCount);
    }

    resetBadge() {
        this.messageCount = 0;
        this.updateBadge();
        console.log('🔄 Badge reset');
    }

    updateBadge() {
        // Badge PWA
        if ('setAppBadge' in navigator) {
            if (this.messageCount > 0) {
                navigator.setAppBadge(this.messageCount);
            } else {
                navigator.clearAppBadge();
            }
        }

        // Badge navigation
        const chatNavBtn = document.querySelector('.bottom-nav .nav-btn:nth-child(4)');
        if (chatNavBtn) {
            let badge = chatNavBtn.querySelector('.nav-badge');

            if (this.messageCount > 0) {
                if (!badge) {
                    badge = document.createElement('div');
                    badge.className = 'nav-badge';
                    badge.style.cssText = `
                        position: absolute;
                        top: -5px;
                        right: -5px;
                        background: #ff3b30;
                        color: white;
                        border-radius: 50%;
                        width: 20px;
                        height: 20px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 12px;
                        font-weight: bold;
                        z-index: 10;
                    `;
                    chatNavBtn.style.position = 'relative';
                    chatNavBtn.appendChild(badge);
                }
                badge.textContent = this.messageCount > 99 ? '99+' : this.messageCount;
            } else if (badge) {
                badge.remove();
            }
        }
    }

    showChatSection() {
        document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
        const chatSection = document.getElementById('chat');
        if (chatSection) {
            chatSection.classList.add('active');
        }
        
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        const chatNavBtn = document.querySelector('.bottom-nav .nav-btn:nth-child(4)');
        if (chatNavBtn) {
            chatNavBtn.classList.add('active');
        }
    }

    getSettings() {
        try {
            return JSON.parse(localStorage.getItem('mobileNotificationSettings')) || {
                sound: true,
                push: true,
                vibrate: true
            };
        } catch (e) {
            return { sound: true, push: true, vibrate: true };
        }
    }

    saveSettings(settings) {
        localStorage.setItem('mobileNotificationSettings', JSON.stringify(settings));
        console.log('💾 Paramètres sauvegardés:', settings);
    }
}

// Initialiser
let mobileNotificationsCompleteFix;

function initMobileNotificationsCompleteFix() {
    if (!mobileNotificationsCompleteFix) {
        mobileNotificationsCompleteFix = new MobileNotificationsCompleteFix();
        window.mobileNotificationsCompleteFix = mobileNotificationsCompleteFix;
        
        // Exposer les fonctions
        window.resetUnreadCount = () => mobileNotificationsCompleteFix.resetBadge();
        window.resetMobileBadge = () => mobileNotificationsCompleteFix.resetBadge();
        
        console.log('✅ Correction notifications complète initialisée');
    }
}

// Lancer après chargement
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(initMobileNotificationsCompleteFix, 2000);
    });
} else {
    setTimeout(initMobileNotificationsCompleteFix, 2000);
}

console.log('✅ Script correction notifications complète prêt');