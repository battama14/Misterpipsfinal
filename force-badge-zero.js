// Force badge à 0 - Solution radicale
console.log('🔧 Force badge à 0...');

function forceBadgeZero() {
    const badge = document.getElementById('chatBadge');
    if (badge) {
        badge.style.display = 'none !important';
        badge.textContent = '0';
        badge.innerHTML = '0';
    }
    
    // Reset toutes les variables
    if (window.chatNotificationCount) window.chatNotificationCount = 0;
    if (window.lastChatMessageTime) window.lastChatMessageTime = Date.now();
    
    console.log('✅ Badge forcé à 0');
}

// Forcer immédiatement
forceBadgeZero();

// Forcer toutes les 100ms pendant 5 secondes
const interval = setInterval(forceBadgeZero, 100);
setTimeout(() => clearInterval(interval), 5000);

// Override toutes les fonctions qui touchent au badge
window.updateChatBadge = () => {};
window.showPCChatNotification = (message) => {
    console.log('🔔 Message reçu mais badge bloqué à 0');
};

console.log('✅ Badge bloqué à 0');