// Reset complet du chat - Une seule exécution
console.log('🔄 Reset complet du chat...');

// Reset toutes les données chat
localStorage.removeItem('chatSound');
localStorage.removeItem('chatSoundEnabled');
localStorage.removeItem('chatNotifications');
localStorage.removeItem('chatDarkMode');
localStorage.removeItem('lastChatMessageTime');
localStorage.removeItem('chatBadgeCount');

// Reset variables globales
if (window.chatNotificationCount) window.chatNotificationCount = 0;
if (window.lastChatMessageTime) window.lastChatMessageTime = Date.now();

// Reset badge immédiatement
const badge = document.getElementById('chatBadge');
if (badge) {
    badge.style.display = 'none';
    badge.textContent = '0';
}

// Reset fonctions globales
if (window.updateChatBadge) window.updateChatBadge(0);
if (window.resetChatBadge) window.resetChatBadge();
if (window.markChatAsRead) window.markChatAsRead();

console.log('✅ Chat reset terminé');

// Auto-suppression du script
setTimeout(() => {
    const script = document.querySelector('script[src="reset-chat.js"]');
    if (script) script.remove();
}, 1000);