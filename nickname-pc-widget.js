// Gestion pseudo PC via widget chat
console.log('🖥️ Pseudo PC Widget - Chargement...');

// Fonction pour sauvegarder le pseudo depuis le widget chat PC
async function savePCNickname() {
    const input = document.getElementById('nicknameInput');
    const nickname = input?.value?.trim();
    
    if (!nickname) {
        alert('❌ Veuillez saisir un pseudo');
        return;
    }
    
    const uid = sessionStorage.getItem('firebaseUID');
    if (!uid || !window.firebaseDB) {
        alert('❌ Erreur de connexion');
        return;
    }
    
    try {
        const { ref, set } = await import('https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js');
        const nicknameRef = ref(window.firebaseDB, `users/${uid}/nickname`);
        await set(nicknameRef, nickname);
        
        sessionStorage.setItem('userNickname', nickname);
        
        // Mettre à jour le chat
        if (window.iMessageChat) {
            window.iMessageChat.nickname = nickname;
        }
        
        // Mettre à jour le classement
        if (window.vipRanking && window.vipRanking.loadRanking) {
            setTimeout(() => window.vipRanking.loadRanking(), 1000);
        }
        
        console.log('✅ Pseudo PC sauvegardé:', nickname);
        
        // Feedback visuel
        const btn = document.getElementById('saveNicknameBtn');
        if (btn) {
            const originalText = btn.textContent;
            btn.textContent = '✅';
            setTimeout(() => {
                btn.textContent = originalText;
            }, 2000);
        }
        
    } catch (error) {
        console.error('Erreur:', error);
        alert('❌ Erreur sauvegarde');
    }
}

// Attacher au bouton du widget chat
setTimeout(() => {
    const btn = document.getElementById('saveNicknameBtn');
    if (btn) {
        btn.onclick = savePCNickname;
        console.log('✅ Bouton pseudo PC configuré');
    }
    
    // S'assurer que le champ reste vide par défaut
    const input = document.getElementById('nicknameInput');
    if (input && !input.value) {
        input.placeholder = 'Saisissez votre pseudo';
    }
}, 3000);

console.log('✅ Pseudo PC Widget chargé');