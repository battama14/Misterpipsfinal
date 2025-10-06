// Correction spécifique des notifications push mobile
console.log('🔔 Chargement correction notifications mobile...');

class MobileNotificationsFixer {
    constructor() {
        this.lastMessageTimestamp = Date.now();
        this.messageCount = 0;
        this.init();
    }

    init() {
        console.log('🔔 Initialisation correction notifications...');
        
        // Attendre que Firebase soit prêt
        this.waitForFirebase();
        
        // Corriger immédiatement les boutons
        setTimeout(() => this.fixNotificationButtons(), 1000);
        
        // Configurer les notifications
        setTimeout(() => this.setupNotifications(), 2000);
    }

    async waitForFirebase() {
        let attempts = 0;
        while (!window.firebaseDB && attempts < 50) {
            await new Promise(resolve => setTimeout(resolve, 200));
            attempts++;
        }
        
        if (window.firebaseDB) {
            console.log('✅ Firebase prêt pour notifications');
            this.setupChatListener();
        } else {
            console.error('❌ Firebase non disponible pour notifications');
        }
    }

    fixNotificationButtons() {
        console.log('🔧 Correction boutons notifications...');
        
        // Corriger le bouton d'activation
        const activateBtn = document.getElementById('activateNotificationsBtn');
        if (activateBtn) {
            // Supprimer les anciens événements
            const newBtn = activateBtn.cloneNode(true);
            activateBtn.parentNode.replaceChild(newBtn, activateBtn);
            
            // Ajouter le nouvel événement
            newBtn.addEventListener('click', async (e) => {
                e.preventDefault();
                console.log('🔔 Demande activation notifications');
                
                try {
                    if ('Notification' in window) {
                        const permission = await Notification.requestPermission();
                        console.log('🔔 Permission:', permission);
                        
                        if (permission === 'granted') {
                            // Activer automatiquement les notifications push
                            const pushToggle = document.getElementById('mobilePushToggle');
                            if (pushToggle) {
                                pushToggle.checked = true;
                            }
                            
                            // Sauvegarder les paramètres
                            this.saveNotificationSettings({
                                sound: document.getElementById('mobileSoundToggle')?.checked || true,
                                push: true,
                                vibrate: document.getElementById('mobileVibrateToggle')?.checked || true
                            });
                            
                            // Notification de test
                            const testNotif = new Notification('✅ Notifications activées !', {
                                body: 'Vous recevrez les messages du chat VIP',
                                icon: './Misterpips.jpg',
                                silent: false
                            });
                            
                            // Mettre à jour le bouton
                            newBtn.textContent = '✅ Notifications Activées';
                            newBtn.style.background = '#28a745';
                            newBtn.disabled = true;
                            
                            setTimeout(() => testNotif.close(), 5000);
                            
                        } else {
                            alert('❌ Permissions refusées. Veuillez autoriser les notifications dans les paramètres de votre navigateur.');
                        }
                    } else {
                        alert('❌ Notifications non supportées par votre navigateur');
                    }
                } catch (error) {
                    console.error('Erreur notifications:', error);
                    alert('❌ Erreur activation notifications: ' + error.message);
                }
            });
            
            // Vérifier l'état actuel
            if (Notification.permission === 'granted') {
                newBtn.textContent = '✅ Notifications Activées';
                newBtn.style.background = '#28a745';
                newBtn.disabled = true;
            } else if (Notification.permission === 'denied') {
                newBtn.textContent = '❌ Permissions Refusées';
                newBtn.style.background = '#dc3545';
                newBtn.disabled = true;
            }
            
            console.log('✅ Bouton activation corrigé');
        }

        // Corriger les toggles
        const toggles = ['mobileSoundToggle', 'mobilePushToggle', 'mobileVibrateToggle'];
        toggles.forEach(toggleId => {
            const toggle = document.getElementById(toggleId);
            if (toggle) {
                toggle.addEventListener('change', () => {
                    const settings = this.getNotificationSettings();
                    settings[toggleId.replace('mobile', '').replace('Toggle', '').toLowerCase()] = toggle.checked;
                    this.saveNotificationSettings(settings);
                    console.log(`🔧 ${toggleId}:`, toggle.checked);
                });
            }
        });
    }

    setupNotifications() {
        console.log('🔔 Configuration notifications...');
        
        // Vérifier le support
        if (!('Notification' in window)) {
            console.error('❌ Notifications non supportées');
            return;
        }

        // Charger les paramètres
        const settings = this.getNotificationSettings();
        
        // Mettre à jour les toggles
        const soundToggle = document.getElementById('mobileSoundToggle');
        const pushToggle = document.getElementById('mobilePushToggle');
        const vibrateToggle = document.getElementById('mobileVibrateToggle');
        
        if (soundToggle) soundToggle.checked = settings.sound;
        if (pushToggle) pushToggle.checked = settings.push;
        if (vibrateToggle) vibrateToggle.checked = settings.vibrate;
        
        console.log('✅ Notifications configurées:', settings);
    }

    async setupChatListener() {
        console.log('👂 Configuration écoute chat pour notifications...');
        
        try {
            const { ref, onValue } = await import('https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js');
            const messagesRef = ref(window.firebaseDB, 'vip_chat');
            
            onValue(messagesRef, (snapshot) => {
                if (!snapshot.exists()) return;
                
                const messages = Object.values(snapshot.val())
                    .sort((a, b) => a.timestamp - b.timestamp);
                
                // Vérifier les nouveaux messages
                const myUID = sessionStorage.getItem('firebaseUID');
                const newMessages = messages.filter(msg =>
                    msg.timestamp > this.lastMessageTimestamp &&
                    msg.userId !== myUID &&
                    msg.timestamp > (Date.now() - 120000) && // 2 minutes max
                    msg.message && msg.nickname
                );
                
                if (newMessages.length > 0) {
                    console.log(`🔔 ${newMessages.length} nouveaux messages détectés`);
                    
                    // Incrémenter le badge pour chaque nouveau message
                    newMessages.forEach(() => {
                        this.incrementBadge();
                    });
                    
                    // Afficher notification pour le dernier message
                    const lastMessage = newMessages[newMessages.length - 1];
                    this.showNotification(lastMessage);
                    
                    this.lastMessageTimestamp = Math.max(...messages.map(m => m.timestamp));
                }
            });
            
            console.log('✅ Écoute chat configurée');
            
        } catch (error) {
            console.error('❌ Erreur configuration écoute chat:', error);
        }
    }

    showNotification(message) {
        console.log('🔔 Affichage notification:', message.nickname, message.message);
        
        // Vérifier permissions
        if (Notification.permission !== 'granted') {
            console.log('❌ Permissions non accordées');
            return;
        }

        // Vérifier paramètres
        const settings = this.getNotificationSettings();
        if (!settings.push) {
            console.log('🔕 Notifications push désactivées');
            return;
        }

        // Ne pas notifier si on est sur le chat et que l'app est active
        if (document.hasFocus() && this.isOnChatSection()) {
            console.log('🔕 Pas de notification - sur le chat');
            if (settings.sound) {
                this.playSound();
            }
            return;
        }

        try {
            const notification = new Notification(`💬 ${message.nickname}`, {
                body: message.message.substring(0, 100),
                icon: './Misterpips.jpg',
                badge: './Misterpips.jpg',
                tag: 'misterpips-mobile-chat-' + Date.now(),
                requireInteraction: false,
                silent: true, // Gérer le son manuellement
                vibrate: settings.vibrate ? [300, 100, 300] : []
            });

            // Son personnalisé
            if (settings.sound) {
                this.playSound();
            }

            // Vibration
            if (settings.vibrate && 'vibrate' in navigator) {
                navigator.vibrate([300, 100, 300]);
            }

            // Clic pour ouvrir
            notification.onclick = () => {
                console.log('🔔 Clic notification');
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
            }, 10000);

            console.log('✅ Notification affichée');

        } catch (error) {
            console.error('❌ Erreur création notification:', error);
        }
    }

    playSound() {
        try {
            const settings = this.getNotificationSettings();
            if (!settings.sound) return;

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

    incrementBadge() {
        this.messageCount++;
        this.updateBadge();
    }

    resetBadge() {
        this.messageCount = 0;
        this.updateBadge();
    }

    updateBadge() {
        // Badge sur l'icône PWA
        if ('setAppBadge' in navigator) {
            if (this.messageCount > 0) {
                navigator.setAppBadge(this.messageCount);
            } else {
                navigator.clearAppBadge();
            }
        }

        // Badge sur navigation bottom
        const chatNavBtn = document.querySelector('.nav-btn[onclick*="chat"]');
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

    isOnChatSection() {
        const chatSection = document.getElementById('chat');
        return chatSection && chatSection.classList.contains('active');
    }

    showChatSection() {
        // Afficher la section chat
        document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
        const chatSection = document.getElementById('chat');
        if (chatSection) {
            chatSection.classList.add('active');
        }
        
        // Mettre à jour la navigation
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        const chatNavBtn = document.querySelector('.nav-btn[onclick*="chat"]');
        if (chatNavBtn) {
            chatNavBtn.classList.add('active');
        }
    }

    getNotificationSettings() {
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

    saveNotificationSettings(settings) {
        try {
            localStorage.setItem('mobileNotificationSettings', JSON.stringify(settings));
            console.log('✅ Paramètres notifications sauvegardés:', settings);
        } catch (error) {
            console.error('❌ Erreur sauvegarde paramètres:', error);
        }
    }
}

// Initialiser les corrections de notifications
let mobileNotificationsFixer;

function initMobileNotificationsFixes() {
    if (!mobileNotificationsFixer) {
        mobileNotificationsFixer = new MobileNotificationsFixer();
        window.mobileNotificationsFixer = mobileNotificationsFixer;
        
        // Exposer les fonctions globalement
        window.resetMobileBadge = () => mobileNotificationsFixer.resetBadge();
        window.incrementMobileBadge = () => mobileNotificationsFixer.incrementBadge();
        
        console.log('✅ Corrections notifications mobile initialisées');
    }
}

// Lancer après le chargement
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(initMobileNotificationsFixes, 3000);
    });
} else {
    setTimeout(initMobileNotificationsFixes, 3000);
}

console.log('✅ Script corrections notifications mobile prêt');