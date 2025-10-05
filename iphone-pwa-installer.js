// Installation PWA iPhone pour notifications - Misterpips
console.log('📱 Module PWA iPhone chargé');

class iPhonePWAInstaller {
    constructor() {
        this.isIPhone = /iPhone|iPad|iPod/.test(navigator.userAgent);
        this.isPWA = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
        this.installPromptShown = localStorage.getItem('pwa_install_prompt_shown') === 'true';
    }

    init() {
        if (!this.isIPhone) return;
        
        console.log('🍎 iPhone détecté');
        console.log('📱 PWA installée:', this.isPWA);
        
        if (this.isPWA) {
            this.setupPWANotifications();
        } else {
            this.showInstallPrompt();
        }
    }

    showInstallPrompt() {
        // Forcer l'affichage même si déjà montré
        setTimeout(() => {
            const banner = document.createElement('div');
            banner.id = 'iphone-install-banner';
            banner.style.cssText = `
                position: fixed; top: 0; left: 0; right: 0; z-index: 10000;
                background: linear-gradient(135deg, #007AFF, #5856D6);
                color: white; padding: 15px; text-align: center;
                font-family: -apple-system, BlinkMacSystemFont, sans-serif;
                font-size: 14px; line-height: 1.4;
                box-shadow: 0 2px 10px rgba(0,0,0,0.3);
            `;
            
            banner.innerHTML = `
                <div style="margin-bottom: 8px;">
                    <strong>📱 Installer Misterpips pour les notifications</strong>
                </div>
                <div style="font-size: 13px; opacity: 0.9;">
                    1. Appuyez sur <strong>📤 Partager</strong> (en bas)<br>
                    2. Sélectionnez <strong>➕ Sur l'écran d'accueil</strong><br>
                    3. Confirmez l'installation
                </div>
                <button onclick="this.parentElement.remove(); localStorage.setItem('pwa_install_prompt_shown', 'true');" 
                        style="position: absolute; top: 10px; right: 15px; background: none; border: none; color: white; font-size: 18px; cursor: pointer;">
                    ✕
                </button>
            `;
            
            document.body.appendChild(banner);
            
            // Auto-masquer après 15 secondes
            setTimeout(() => {
                if (banner.parentElement) {
                    banner.remove();
                }
            }, 30000);
            
            this.installPromptShown = true;
        }, 500);
    }

    async setupPWANotifications() {
        console.log('🔔 Configuration notifications PWA iPhone...');
        
        // Enregistrer Service Worker
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.register('./sw.js');
                console.log('✅ Service Worker enregistré');
                
                // Demander permission notifications
                if ('Notification' in window) {
                    const permission = await Notification.requestPermission();
                    console.log('🔔 Permission notifications:', permission);
                    
                    if (permission === 'granted') {
                        this.showSuccessMessage();
                    }
                }
            } catch (error) {
                console.error('❌ Erreur Service Worker:', error);
            }
        }
    }

    showSuccessMessage() {
        const message = document.createElement('div');
        message.style.cssText = `
            position: fixed; top: 20px; left: 20px; right: 20px; z-index: 10000;
            background: #34C759; color: white; padding: 15px; border-radius: 10px;
            text-align: center; font-family: -apple-system, BlinkMacSystemFont, sans-serif;
            font-size: 14px; box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        `;
        
        message.innerHTML = `
            <strong>✅ Notifications activées !</strong><br>
            Vous recevrez maintenant les messages du chat VIP
        `;
        
        document.body.appendChild(message);
        
        setTimeout(() => message.remove(), 4000);
    }

    // Créer notification iPhone
    static createNotification(title, body, icon = './Misterpips.jpg') {
        if ('Notification' in window && Notification.permission === 'granted') {
            const notification = new Notification(title, {
                body: body,
                icon: icon,
                tag: 'misterpips-chat',
                requireInteraction: false,
                silent: false
            });
            
            notification.onclick = () => {
                window.focus();
                if (window.showMobileSection) {
                    window.showMobileSection('chat');
                }
                notification.close();
            };
            
            // Auto-fermer après 5 secondes
            setTimeout(() => notification.close(), 5000);
            
            return notification;
        }
        return null;
    }
}

// Instance globale
window.iPhonePWAInstaller = new iPhonePWAInstaller();

// Initialiser automatiquement
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        window.iPhonePWAInstaller.init();
    }, 1000);
});

// Fonction globale pour créer notifications
window.createiPhoneNotification = (title, body) => {
    return iPhonePWAInstaller.createNotification(title, body);
};

console.log('✅ Module PWA iPhone prêt');