// Fix erreurs mobiles - Misterpips
console.log('🔧 Fix erreurs mobiles');

// Fix fonction sendWidgetMessage manquante
window.sendWidgetMessage = async function() {
    const input = document.getElementById('widgetInput');
    if (!input) return;
    
    const message = input.value.trim();
    if (!message) return;
    
    const uid = sessionStorage.getItem('firebaseUID');
    let nickname = sessionStorage.getItem('userNickname') || 'Mobile User';
    
    const messageData = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId: uid,
        nickname: nickname,
        message: message,
        timestamp: Date.now(),
        type: 'text'
    };
    
    try {
        if (window.firebaseDB) {
            const { ref, push } = await import('https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js');
            const messagesRef = ref(window.firebaseDB, 'vip_chat');
            await push(messagesRef, messageData);
            input.value = '';
            console.log('✅ Message widget envoyé');
        }
    } catch (error) {
        console.error('❌ Erreur widget:', error);
    }
};

// Fix fonction showMobileSection manquante
window.showMobileSection = function(sectionId) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    const section = document.getElementById(sectionId);
    if (section) {
        section.classList.add('active');
    }
    
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    const navBtn = document.querySelector(`button[onclick*="${sectionId}"]`);
    if (navBtn) {
        navBtn.classList.add('active');
    }
    
    if (sectionId === 'chat' && window.resetSimpleBadge) {
        window.resetSimpleBadge();
    }
};

// Fix fonction resetUnreadCount manquante
window.resetUnreadCount = function() {
    if (window.resetSimpleBadge) {
        window.resetSimpleBadge();
    }
};

// Supprimer erreurs Chart.js
const originalError = console.error;
console.error = function(...args) {
    const message = args.join(' ');
    if (message.includes('chart.umd.min.js.map') || 
        message.includes('source map') ||
        message.includes('404')) {
        return; // Ignorer ces erreurs
    }
    originalError.apply(console, args);
};

console.log('✅ Fix erreurs mobiles prêt');