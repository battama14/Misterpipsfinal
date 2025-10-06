// Gestion simple des pseudos - SANS CHARGEMENT AUTOMATIQUE
console.log('📝 Simple Nickname - Chargement...');

// Créer le gestionnaire global pour compatibilité
window.nicknameManager = {
    async saveNickname(nickname) {
        const uid = sessionStorage.getItem('firebaseUID');
        if (!uid || !window.firebaseDB) {
            return false;
        }
        
        try {
            const { ref, set } = await import('https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js');
            const nicknameRef = ref(window.firebaseDB, `users/${uid}/nickname`);
            await set(nicknameRef, nickname);
            
            sessionStorage.setItem('userNickname', nickname);
            console.log('✅ Pseudo sauvegardé:', nickname);
            return true;
        } catch (error) {
            console.error('Erreur sauvegarde:', error);
            return false;
        }
    }
};

// Fonction simple de sauvegarde UNIQUEMENT
async function saveSimpleNickname() {
    const input = document.getElementById('mobileNickname');
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
    
    const success = await window.nicknameManager.saveNickname(nickname);
    if (success) {
        alert('✅ Pseudo sauvegardé !');
        // Mettre à jour le classement
        if (window.loadSimpleRanking) {
            setTimeout(() => window.loadSimpleRanking(), 1000);
        }
    } else {
        alert('❌ Erreur sauvegarde');
    }
}

// Attacher au bouton UNIQUEMENT
setTimeout(() => {
    const btn = document.getElementById('saveNicknameBtn');
    if (btn) {
        btn.onclick = saveSimpleNickname;
    }
    
    // S'assurer que le champ reste vide
    const input = document.getElementById('mobileNickname');
    if (input) {
        input.value = '';
        input.placeholder = 'Saisissez votre pseudo';
    }
    
    // Nettoyer aussi le champ PC
    const pcInput = document.getElementById('nicknameInput');
    if (pcInput) {
        pcInput.value = '';
        pcInput.placeholder = 'Votre pseudo';
    }
}, 1000);

// Bloquer toute tentative de chargement automatique
setInterval(() => {
    const input = document.getElementById('mobileNickname');
    if (input && input.value && input.value.includes('kamel.lou')) {
        input.value = '';
        console.log('🚫 Pseudo email bloqué');
    }
}, 2000);

console.log('✅ Simple Nickname chargé - SANS AUTO-LOAD');