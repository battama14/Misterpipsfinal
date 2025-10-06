// Fix final chat avec Firebase
setTimeout(async () => {
    const sendBtn = document.getElementById('sendBtn');
    const chatInput = document.getElementById('chatInput');
    const messagesDiv = document.querySelector('div[style*="height: 450px"]');
    
    // Fonction pour ajouter un message
    function addMessage(message, isOwn = false) {
        if (messagesDiv) {
            const messageEl = document.createElement('div');
            messageEl.style.cssText = isOwn ? 
                'background: #007bff; color: white; padding: 10px; border-radius: 10px; margin-bottom: 10px; text-align: right;' :
                'background: #e9ecef; color: black; padding: 10px; border-radius: 10px; margin-bottom: 10px; text-align: left;';
            messageEl.innerHTML = isOwn ? `<strong>Vous:</strong> ${message.message}` : `<strong>${message.nickname}:</strong> ${message.message}`;
            messagesDiv.appendChild(messageEl);
            messagesDiv.scrollTop = messagesDiv.scrollHeight;
        }
    }
    
    // Écouter Firebase
    if (window.firebaseDB) {
        try {
            const { ref, onValue, get } = await import('https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js');
            const messagesRef = ref(window.firebaseDB, 'vip_chat');
            onValue(messagesRef, async (snapshot) => {
                if (snapshot.exists()) {
                    const messages = Object.values(snapshot.val()).sort((a, b) => a.timestamp - b.timestamp);
                    messagesDiv.innerHTML = '<div style="background: #e3f2fd; padding: 10px; border-radius: 10px; margin-bottom: 10px;"><strong>Misterpips Bot:</strong> Bienvenue dans le chat VIP ! 🚀</div>';
                    
                    // Charger tous les pseudos d'abord
                    const usersRef = ref(window.firebaseDB, 'users');
                    const usersSnap = await get(usersRef);
                    const nicknames = {};
                    
                    if (usersSnap.exists()) {
                        Object.entries(usersSnap.val()).forEach(([uid, userData]) => {
                            if (userData.nickname && !userData.nickname.includes('@')) {
                                nicknames[uid] = userData.nickname;
                            }
                        });
                    }
                    
                    // Afficher les messages avec les bons pseudos
                    messages.slice(-20).forEach(msg => {
                        msg.nickname = nicknames[msg.userId] || msg.nickname || 'Membre VIP';
                        const isOwn = msg.userId === sessionStorage.getItem('firebaseUID');
                        addMessage(msg, isOwn);
                    });
                }
            });
        } catch (e) {}
    }
    
    if (sendBtn && chatInput) {
        sendBtn.onclick = async () => {
            const message = chatInput.value.trim();
            if (message && window.firebaseDB) {
                try {
                    const { ref, push } = await import('https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js');
                    const messagesRef = ref(window.firebaseDB, 'vip_chat');
                    await push(messagesRef, {
                        userId: sessionStorage.getItem('firebaseUID'),
                        nickname: sessionStorage.getItem('userNickname') || 'Utilisateur',
                        message: message,
                        timestamp: Date.now()
                    });
                    chatInput.value = '';
                } catch (e) {}
            }
        };
        
        chatInput.onkeypress = (e) => {
            if (e.key === 'Enter') {
                sendBtn.click();
            }
        };
    }
}, 2000);

// Sauvegarder pseudo
window.saveNicknameFromChat = async function() {
    const input = document.getElementById('nicknameInput');
    const nickname = input.value.trim();
    
    if (!nickname) {
        alert('Veuillez saisir un pseudo');
        return;
    }
    
    try {
        if (window.firebaseDB) {
            const { ref, set } = await import('https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js');
            const uid = sessionStorage.getItem('firebaseUID');
            const nicknameRef = ref(window.firebaseDB, `users/${uid}/nickname`);
            await set(nicknameRef, nickname);
            sessionStorage.setItem('userNickname', nickname);
            
            // Mettre à jour le classement
            if (window.loadSimpleRanking) {
                setTimeout(() => window.loadSimpleRanking(), 1000);
            }
            
            alert('✅ Pseudo sauvegardé et classement mis à jour!');
            document.getElementById('chatSettings').style.display = 'none';
        }
    } catch (error) {
        alert('❌ Erreur sauvegarde');
    }
};