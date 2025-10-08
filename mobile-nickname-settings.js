// Gestion des pseudos depuis les paramètres mobiles
window.saveMobileNicknameFromSettings = async function() {
    const nicknameInput = document.getElementById('mobileNickname');
    if (!nicknameInput) {
        console.error('Input pseudo mobile non trouvé');
        return false;
    }
    
    const newNickname = nicknameInput.value.trim();
    if (!newNickname) {
        alert('⚠️ Veuillez saisir un pseudo');
        return false;
    }
    
    // Bloquer les emails
    if (newNickname.includes('@') || newNickname.includes('kamel.lou')) {
        alert('❌ Impossible d\'utiliser un email comme pseudo');
        nicknameInput.value = '';
        return false;
    }
    
    try {
        const uid = sessionStorage.getItem('firebaseUID');
        if (!uid || !window.firebaseDB) {
            alert('❌ Erreur de connexion Firebase');
            return false;
        }
        
        const { ref, set } = await import('https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js');
        
        // Sauvegarder dans toutes les structures Firebase
        const saves = [
            set(ref(window.firebaseDB, `users/${uid}/nickname`), newNickname),
            set(ref(window.firebaseDB, `users/${uid}/profile/nickname`), newNickname),
            set(ref(window.firebaseDB, `nicknames/${uid}`), newNickname),
            set(ref(window.firebaseDB, `profiles/${uid}/nickname`), newNickname)
        ];
        
        await Promise.all(saves);
        
        console.log('✅ Pseudo mobile sauvegardé:', newNickname);
        
        // Synchroniser avec le système unifié
        if (window.unifiedNickname) {
            window.unifiedNickname.nickname = newNickname;
            window.unifiedNickname.syncToAllInterfaces();
        }
        
        // Mettre à jour le chat
        if (window.iMessageChat) {
            window.iMessageChat.nickname = newNickname;
        }
        
        alert('✅ Pseudo sauvegardé avec succès !');
        return true;
        
    } catch (error) {
        console.error('Erreur sauvegarde pseudo mobile:', error);
        alert('❌ Erreur lors de la sauvegarde: ' + error.message);
        return false;
    }
};

// Charger le pseudo actuel dans les paramètres mobiles
window.loadMobileNickname = async function() {
    const nicknameInput = document.getElementById('mobileNickname');
    if (!nicknameInput) return;
    
    try {
        const uid = sessionStorage.getItem('firebaseUID');
        if (!uid || !window.firebaseDB) return;
        
        const { ref, get } = await import('https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js');
        const nicknameRef = ref(window.firebaseDB, `users/${uid}/nickname`);
        const snapshot = await get(nicknameRef);
        
        if (snapshot.exists() && snapshot.val()) {
            nicknameInput.value = snapshot.val();
            console.log('📱 Pseudo mobile chargé:', snapshot.val());
        }
        
    } catch (error) {
        console.error('Erreur chargement pseudo mobile:', error);
    }
};

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        // Charger le pseudo actuel
        if (window.loadMobileNickname) {
            window.loadMobileNickname();
        }
        
        // Lier le bouton de sauvegarde
        const saveBtn = document.getElementById('saveNicknameBtn');
        if (saveBtn && !saveBtn.hasAttribute('data-nickname-initialized')) {
            saveBtn.setAttribute('data-nickname-initialized', 'true');
            saveBtn.addEventListener('click', async (e) => {
                e.preventDefault();
                e.stopPropagation();
                await window.saveMobileNicknameFromSettings();
            });
        }
        
    }, 2000);
});

console.log('📱 Gestion pseudo mobile chargée');