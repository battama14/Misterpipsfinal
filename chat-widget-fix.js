// Fix widget chat PC
console.log('💬 Fix widget chat PC...');

function fixChatWidget() {
    const chatToggle = document.getElementById('chatToggle');
    const chatWindow = document.getElementById('chatWindow');
    
    if (chatToggle) {
        chatToggle.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            if (chatWindow) {
                const isOpen = chatWindow.classList.contains('show');
                if (isOpen) {
                    chatWindow.classList.remove('show');
                    chatToggle.style.display = 'flex';
                } else {
                    chatWindow.classList.add('show');
                    chatToggle.style.display = 'none';
                    setTimeout(() => {
                        const input = document.getElementById('chatInput');
                        if (input) input.focus();
                    }, 100);
                }
            }
        };
    }
    
    const closeChatBtn = document.getElementById('closeChatBtn');
    if (closeChatBtn) {
        closeChatBtn.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            if (chatWindow) {
                chatWindow.classList.remove('show');
            }
            if (chatToggle) {
                chatToggle.style.display = 'flex';
            }
        };
    }
    
    const chatSettingsBtn = document.getElementById('chatSettingsBtn');
    const chatSettings = document.getElementById('chatSettings');
    
    if (chatSettingsBtn && chatSettings) {
        chatSettingsBtn.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            chatSettings.classList.toggle('show');
        };
    }
}

setTimeout(fixChatWidget, 1000);
setInterval(fixChatWidget, 5000);

console.log('✅ Fix widget chat PC chargé');