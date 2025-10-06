// Fix Chat PC - Notifications et Emojis
console.log('🔧 Chat PC Fix - Démarrage...');

// Variables globales pour le chat PC
let chatNotificationCount = 0;
let lastChatMessageTime = Date.now();

// Fix 1: Notifications PC
function fixPCChatNotifications() {
    // Créer le badge de notification s'il n'existe pas
    let chatBadge = document.getElementById('chatBadge');
    if (!chatBadge) {
        const chatToggle = document.getElementById('chatToggle');
        if (chatToggle) {
            chatBadge = document.createElement('div');
            chatBadge.id = 'chatBadge';
            chatBadge.className = 'chat-badge';
            chatBadge.style.cssText = `
                position: absolute;
                top: -8px;
                right: -8px;
                background: #ff3b30;
                color: white;
                border-radius: 50%;
                width: 20px;
                height: 20px;
                font-size: 12px;
                display: none;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                z-index: 1000;
            `;
            chatToggle.appendChild(chatBadge);
        }
    }
    
    // Fonction pour mettre à jour le badge
    window.updateChatBadge = function(count) {
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
    
    // Fonction pour réinitialiser le badge
    window.resetChatBadge = function() {
        chatNotificationCount = 0;
        window.updateChatBadge(0);
        lastChatMessageTime = Date.now();
        console.log('🔄 Badge chat réinitialisé');
    };
    
    // Fonction pour marquer comme lu
    window.markChatAsRead = function() {
        chatNotificationCount = 0;
        window.updateChatBadge(0);
        lastChatMessageTime = Date.now();
        console.log('📖 Messages marqués comme lus');
    };
    
    // Fonction de notification PC
    window.showPCChatNotification = function(message) {
        const chatWindow = document.getElementById('chatWindow');
        const isOpen = chatWindow && chatWindow.classList.contains('show');
        
        if (!isOpen) {
            chatNotificationCount++;
            window.updateChatBadge(chatNotificationCount);
            
            // Son de notification
            playPCNotificationSound();
            
            // Notification système
            if ('Notification' in window && Notification.permission === 'granted') {
                const notification = new Notification(`💬 ${message.nickname}`, {
                    body: message.message.substring(0, 100),
                    icon: './Misterpips.jpg',
                    tag: 'pc-chat-notification'
                });
                
                notification.onclick = function() {
                    window.focus();
                    openPCChat();
                    notification.close();
                };
                
                setTimeout(() => notification.close(), 5000);
            }
        } else {
            // Juste le son si le chat est ouvert
            playPCNotificationSound();
        }
    };
    
    // Ouvrir le chat PC
    window.openPCChat = function() {
        const chatWindow = document.getElementById('chatWindow');
        const chatToggle = document.getElementById('chatToggle');
        
        if (chatWindow) {
            chatWindow.classList.add('show');
            if (chatToggle) chatToggle.style.display = 'none';
            
            // Réinitialiser immédiatement
            window.markChatAsRead();
            
            setTimeout(() => {
                const input = document.getElementById('chatInput');
                if (input) input.focus();
                // Double réinitialisation pour être sûr
                window.markChatAsRead();
            }, 300);
        }
    };
    
    // Fermer le chat PC
    window.closePCChat = function() {
        const chatWindow = document.getElementById('chatWindow');
        const chatToggle = document.getElementById('chatToggle');
        
        if (chatWindow) {
            chatWindow.classList.remove('show');
            if (chatToggle) chatToggle.style.display = 'flex';
        }
    };
    
    console.log('✅ Notifications PC configurées');
}

// Fix 2: Emoji Picker PC
function fixPCEmojiPicker() {
    const emojiBtn = document.getElementById('emojiBtn');
    if (!emojiBtn) return;
    
    // Créer le panneau d'emojis
    let emojiPanel = document.getElementById('emojiPanel');
    if (!emojiPanel) {
        emojiPanel = document.createElement('div');
        emojiPanel.id = 'emojiPanel';
        emojiPanel.className = 'emoji-panel';
        emojiPanel.style.cssText = `
            position: absolute;
            bottom: 60px;
            left: 10px;
            background: white;
            border: 1px solid #ddd;
            border-radius: 12px;
            padding: 15px;
            display: none;
            grid-template-columns: repeat(5, 1fr);
            gap: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            z-index: 1000;
            max-width: 250px;
        `;
        
        // Emojis populaires
        const emojis = [
            '😀', '😂', '🤣', '😊', '😍', '🥰', '😘', '😋', '😎', '🤔',
            '😴', '🤤', '😷', '🤒', '🤕', '🤢', '🤮', '🤧', '🥵', '🥶',
            '😱', '😨', '😰', '😥', '😢', '😭', '😤', '😠', '😡', '🤬',
            '👍', '👎', '👌', '✌️', '🤞', '🤟', '🤘', '👊', '✊', '🙌',
            '👏', '🤝', '🙏', '✍️', '💪', '🦵', '🦶', '👂', '👃', '🧠',
            '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔',
            '💕', '💖', '💗', '💘', '💝', '💟', '💌', '💤', '💢', '💣',
            '💥', '💦', '💨', '💫', '💬', '🗨️', '🗯️', '💭', '🕳️', '👁️',
            '🔥', '⭐', '🌟', '✨', '⚡', '☄️', '💥', '🔴', '🟠', '🟡',
            '🟢', '🔵', '🟣', '⚫', '⚪', '🟤', '🔺', '🔻', '🔸', '🔹',
            '🚀', '🛸', '🌍', '🌎', '🌏', '🌕', '🌖', '🌗', '🌘', '🌑',
            '☀️', '🌤️', '⛅', '🌦️', '🌧️', '⛈️', '🌩️', '🌨️', '❄️', '☃️',
            '💰', '💵', '💴', '💶', '💷', '💸', '💳', '💎', '⚖️', '🔧',
            '📈', '📉', '📊', '📋', '📌', '📍', '📎', '📏', '📐', '✂️'
        ];
        
        emojis.forEach(emoji => {
            const btn = document.createElement('button');
            btn.textContent = emoji;
            btn.className = 'emoji-btn';
            btn.style.cssText = `
                background: none;
                border: none;
                font-size: 20px;
                cursor: pointer;
                padding: 5px;
                border-radius: 6px;
                transition: background 0.2s;
            `;
            
            btn.onmouseover = () => btn.style.background = '#f0f0f0';
            btn.onmouseout = () => btn.style.background = 'none';
            
            btn.onclick = () => {
                const input = document.getElementById('chatInput');
                if (input) {
                    input.value += emoji;
                    input.focus();
                    
                    // Déclencher l'événement input pour mettre à jour le bouton send
                    const event = new Event('input', { bubbles: true });
                    input.dispatchEvent(event);
                }
                emojiPanel.style.display = 'none';
            };
            
            emojiPanel.appendChild(btn);
        });
        
        // Ajouter le panneau au chat
        const chatWindow = document.getElementById('chatWindow');
        if (chatWindow) {
            chatWindow.appendChild(emojiPanel);
        }
    }
    
    // Remplacer l'événement du bouton emoji
    emojiBtn.onclick = function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const isVisible = emojiPanel.style.display === 'grid';
        emojiPanel.style.display = isVisible ? 'none' : 'grid';
    };
    
    // Fermer le panneau si on clique ailleurs
    document.addEventListener('click', (e) => {
        if (!emojiPanel.contains(e.target) && e.target !== emojiBtn) {
            emojiPanel.style.display = 'none';
        }
    });
    
    console.log('✅ Emoji picker PC configuré');
}

// Fix 3: Son de notification PC
function playPCNotificationSound() {
    // Vérifier si le son est activé
    const soundEnabled = localStorage.getItem('chatSoundEnabled') !== 'false';
    if (!soundEnabled) {
        console.log('🔇 Son désactivé');
        return;
    }
    
    try {
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
        
        console.log('🔊 Son notification PC joué');
    } catch (error) {
        console.log('❌ Erreur son PC:', error);
    }
}

// Fix 4: Intercepter les messages entrants
function interceptChatMessages() {
    const messagesContainer = document.getElementById('chatMessages');
    if (!messagesContainer) return;
    
    const observer = new MutationObserver((mutations) => {
        const chatWindow = document.getElementById('chatWindow');
        const isOpen = chatWindow && chatWindow.classList.contains('show');
        
        if (isOpen) {
            window.markChatAsRead();
            return;
        }
        
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1 && node.classList.contains('message-group')) {
                    const messageData = extractMessageData(node);
                    if (messageData && messageData.userId !== sessionStorage.getItem('firebaseUID')) {
                        if (messageData.timestamp > lastChatMessageTime) {
                            window.showPCChatNotification(messageData);
                        }
                    }
                }
            });
        });
    });
    
    observer.observe(messagesContainer, { childList: true, subtree: true });
    console.log('✅ Intercepteur messages PC activé');
}

// Extraire les données d'un message
function extractMessageData(messageElement) {
    try {
        const authorElement = messageElement.querySelector('.message-author');
        const contentElement = messageElement.querySelector('.message-content');
        const timeElement = messageElement.querySelector('.message-time');
        
        if (contentElement) {
            return {
                nickname: authorElement ? authorElement.textContent : 'Utilisateur',
                message: contentElement.textContent || '',
                timestamp: Date.now(),
                userId: messageElement.dataset.userId || 'unknown'
            };
        }
    } catch (error) {
        console.error('Erreur extraction message:', error);
    }
    return null;
}

// Fix 5: Corriger les événements du chat
function fixChatEvents() {
    // Toggle chat
    const chatToggle = document.getElementById('chatToggle');
    if (chatToggle) {
        chatToggle.onclick = window.openPCChat;
    }
    
    // Fermer chat
    const closeChatBtn = document.getElementById('closeChatBtn');
    if (closeChatBtn) {
        closeChatBtn.onclick = window.closePCChat;
    }
    
    // Corriger le toggle son
    const soundToggle = document.getElementById('soundToggle');
    if (soundToggle) {
        soundToggle.onclick = function() {
            const isEnabled = localStorage.getItem('chatSoundEnabled') !== 'false';
            localStorage.setItem('chatSoundEnabled', !isEnabled);
            soundToggle.classList.toggle('active', !isEnabled);
            console.log('🔊 Son chat:', !isEnabled ? 'activé' : 'désactivé');
        };
        
        // Initialiser l'état
        const soundEnabled = localStorage.getItem('chatSoundEnabled') !== 'false';
        soundToggle.classList.toggle('active', soundEnabled);
    }
    
    console.log('✅ Événements chat PC corrigés');
}

// Initialisation
function initPCChatFixes() {
    console.log('🔧 Initialisation fixes chat PC...');
    
    fixPCChatNotifications();
    fixPCEmojiPicker();
    interceptChatMessages();
    fixChatEvents();
    
    // Demander les permissions de notification
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission().then(permission => {
            console.log('🔔 Permission notifications:', permission);
        });
    }
    
    console.log('✅ Fixes chat PC appliqués');
}

// Lancer les fixes après le chargement du chat
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(initPCChatFixes, 4000);
    });
} else {
    setTimeout(initPCChatFixes, 4000);
}