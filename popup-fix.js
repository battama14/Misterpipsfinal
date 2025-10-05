// Fix popups en double - Misterpips
console.log('🚫 Fix popups doubles');

// Système anti-double popup
class PopupFix {
    constructor() {
        this.lastAlerts = new Map();
        this.alertDelay = 2000; // 2 secondes minimum entre alertes
    }

    showAlert(message, type = 'default') {
        const now = Date.now();
        const lastTime = this.lastAlerts.get(message) || 0;
        
        if (now - lastTime < this.alertDelay) {
            console.log('🚫 Popup bloqué (double):', message);
            return false;
        }
        
        this.lastAlerts.set(message, now);
        alert(message);
        return true;
    }

    showConfirm(message) {
        const now = Date.now();
        const lastTime = this.lastAlerts.get(message) || 0;
        
        if (now - lastTime < this.alertDelay) {
            console.log('🚫 Confirm bloqué (double):', message);
            return false;
        }
        
        this.lastAlerts.set(message, now);
        return confirm(message);
    }
}

// Instance globale
window.popupFix = new PopupFix();

// Remplacer alert global
const originalAlert = window.alert;
window.alert = function(message) {
    return window.popupFix.showAlert(message);
};

// Remplacer confirm global
const originalConfirm = window.confirm;
window.confirm = function(message) {
    return window.popupFix.showConfirm(message);
};

// Fix boutons avec double événements
document.addEventListener('DOMContentLoaded', () => {
    // Supprimer tous les événements en double
    const buttons = document.querySelectorAll('button[data-initialized]');
    buttons.forEach(btn => {
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
    });
    
    // Marquer comme initialisé
    setTimeout(() => {
        document.querySelectorAll('button').forEach(btn => {
            if (!btn.hasAttribute('data-popup-fixed')) {
                btn.setAttribute('data-popup-fixed', 'true');
            }
        });
    }, 1000);
});

console.log('✅ Fix popups doubles prêt');