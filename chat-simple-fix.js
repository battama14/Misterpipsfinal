// Compteur simple
let badgeCount = 0;
let currentUser = sessionStorage.getItem('firebaseUID') || 'user_' + Date.now();
let lastMessageId = null;

// Son
const playSound = () => {
    // Vérifier les paramètres
    const soundEnabled = localStorage.getItem('chatSoundEnabled') !== 'false';
    
    if (!soundEnabled) {
        console.log('Son désactivé dans les paramètres');
        return;
    }
    
    try {
        console.log('🔊 Jouer son...');
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
    } catch (e) {
        console.log('Erreur son:', e);
        if ('vibrate' in navigator) navigator.vibrate(200);
    }
};

// Badge
const updateBadge = () => {
    const badge = document.getElementById('chatBadge');
    if (badge) {
        console.log('Mise à jour badge:', badgeCount);
        badge.textContent = badgeCount;
        badge.style.display = badgeCount > 0 ? 'flex' : 'none';
        badge.style.visibility = 'visible';
        badge.style.opacity = '1';
        
        // Forcer le refresh
        badge.offsetHeight;
    } else {
        console.log('Badge non trouvé!');
    }
};

// Firebase listener
function startListener() {
    if (!window.firebaseDB) {
        setTimeout(startListener, 1000);
        return;
    }
    
    import('https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js')
    .then(({ ref, onValue }) => {
        const messagesRef = ref(window.firebaseDB, 'vip_chat');
        
        onValue(messagesRef, (snapshot) => {
            if (snapshot.exists()) {
                const messages = Object.values(snapshot.val());
                const sortedMessages = messages.sort((a, b) => a.timestamp - b.timestamp);
                const latestMessage = sortedMessages[sortedMessages.length - 1];
                
                // Nouveau message détecté
                if (latestMessage && 
                    latestMessage.id !== lastMessageId && 
                    latestMessage.userId !== currentUser) {
                    
                    const chatWindow = document.getElementById('chatWindow');
                    const isOpen = chatWindow && chatWindow.classList.contains('show');
                    
                    if (!isOpen) {
                        badgeCount++;
                        console.log('Nouveau message! Badge:', badgeCount);
                        
                        // Attendre un peu pour être sûr que le DOM est prêt
                        setTimeout(() => {
                            updateBadge();
                            playSound();
                        }, 100);
                    }
                    
                    lastMessageId = latestMessage.id;
                }
            }
        });
    });
}

// Events
function setupEvents() {
    const chatToggle = document.getElementById('chatToggle');
    const chatWindow = document.getElementById('chatWindow');
    
    if (chatToggle) {
        chatToggle.addEventListener('click', () => {
            badgeCount = 0;
            updateBadge();
        });
    }
    
    // Observer pour détecter l'ouverture du chat
    if (chatWindow) {
        const observer = new MutationObserver(() => {
            if (chatWindow.classList.contains('show')) {
                badgeCount = 0;
                updateBadge();
            }
        });
        
        observer.observe(chatWindow, {
            attributes: true,
            attributeFilter: ['class']
        });
    }
}

// Init
setTimeout(() => {
    startListener();
    setupEvents();
}, 2000);

// Setup supplémentaire après init du chat
setTimeout(() => {
    setupEvents();
}, 5000);