// Chat Toggle Fix - Correction du widget chat PC
console.log('💬 Chat Toggle Fix - Chargement...');

function fixChatToggle() {
    const chatToggle = document.getElementById('chatToggle');
    const chatWindow = document.getElementById('chatWindow');
    
    if (chatToggle && chatWindow) {
        // Supprimer les anciens événements
        chatToggle.onclick = null;
        
        // Ajouter le nouvel événement
        chatToggle.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const isOpen = chatWindow.classList.contains('show');
            
            if (isOpen) {
                chatWindow.classList.remove('show');
                chatToggle.style.display = 'flex';
            } else {
                chatWindow.classList.add('show');
                chatToggle.style.display = 'none';
                
                // Focus sur l'input
                setTimeout(() => {
                    const chatInput = document.getElementById('chatInput');
                    if (chatInput) chatInput.focus();
                }, 400);
            }
            
            console.log('💬 Chat toggle:', isOpen ? 'fermé' : 'ouvert');
        };
        
        console.log('✅ Chat toggle corrigé');
    }
}

// Corriger immédiatement et périodiquement
setTimeout(fixChatToggle, 1000);
setTimeout(fixChatToggle, 3000);
setTimeout(fixChatToggle, 5000);

// Observer pour recorriger si nécessaire
const observer = new MutationObserver(() => {
    fixChatToggle();
});

observer.observe(document.body, { childList: true, subtree: true });

console.log('💬 Chat Toggle Fix actif');