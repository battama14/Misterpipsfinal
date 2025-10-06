// Fix définitif du badge chat
console.log('🔧 Fix badge chat - Démarrage...');

// Override complet du système de badge
let chatBadgeCount = 0;

// Fonction pour forcer le badge à 0
window.forceChatBadgeZero = function() {
    chatBadgeCount = 0;
    const badge = document.getElementById('chatBadge');
    if (badge) {
        badge.style.display = 'none';
        badge.textContent = '0';
    }
    console.log('🔄 Badge forcé à 0');
};

// Override de toutes les fonctions de badge
window.updateChatBadge = function(count) {
    chatBadgeCount = count;
    const badge = document.getElementById('chatBadge');
    if (badge) {
        if (count > 0) {
            badge.textContent = count > 99 ? '99+' : count;
            badge.style.display = 'flex';
        } else {
            badge.style.display = 'none';
        }
    }
};

// Override de la fonction showNotification du chat original
setTimeout(() => {
    if (window.iMessageChat && window.iMessageChat.showNotification) {
        const originalShowNotification = window.iMessageChat.showNotification;
        window.iMessageChat.showNotification = function(message) {
            const chatWindow = document.getElementById('chatWindow');
            const isOpen = chatWindow && chatWindow.classList.contains('show');
            
            if (!isOpen) {
                // Ne pas utiliser updateBadge(1), utiliser le système PC
                if (window.showPCChatNotification) {
                    window.showPCChatNotification(message);
                }
            }
        };
        console.log('✅ showNotification overridée');
    }
}, 5000);

// Override de updateBadge dans la classe chat
setTimeout(() => {
    if (window.iMessageChat && window.iMessageChat.updateBadge) {
        window.iMessageChat.updateBadge = function(count) {
            // Ne rien faire - laisser le système PC gérer
            console.log('🚫 updateBadge bloquée');
        };
        console.log('✅ updateBadge overridée');
    }
}, 5000);

// Forcer le badge à 0 au démarrage
setTimeout(() => {
    window.forceChatBadgeZero();
}, 6000);

console.log('✅ Fix badge chat appliqué');