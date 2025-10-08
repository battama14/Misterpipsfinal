// Gestion des pseudos depuis les paramètres mobiles
window.saveMobileNicknameFromSettings = async function() {
    const nicknameInput = document.getElementById('mobileNickname');
    if (!nicknameInput) return false;
    
    const newNickname = nicknameInput.value.trim();
    if (!newNickname || newNickname.includes('@')) {
        alert('❌ Pseudo invalide');
        return false;
    }
    
    if (window.permanentNickname) {
        const success = await window.permanentNickname.updateFromSettings(newNickname);
        if (success) {
            alert('✅ Pseudo sauvegardé !');
        } else {
            alert('❌ Erreur sauvegarde');
        }
        return success;
    }
    return false;
};

// Charger le pseudo actuel dans les paramètres mobiles
window.loadMobileNickname = async function() {
    const nicknameInput = document.getElementById('mobileNickname');
    if (!nicknameInput) return;
    
    let attempts = 0;
    const loadWithRetry = async () => {
        try {
            const uid = sessionStorage.getItem('firebaseUID');
            if (!uid) return;
            
            if (!window.firebaseDB && attempts < 10) {
                attempts++;
                setTimeout(loadWithRetry, 500);
                return;
            }
            
            if (window.firebaseDB) {
                const { ref, get } = await import('https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js');
                const nicknameRef = ref(window.firebaseDB, `users/${uid}/nickname`);
                const snapshot = await get(nicknameRef);
                
                if (snapshot.exists() && snapshot.val()) {
                    nicknameInput.value = snapshot.val();
                    console.log('📱 Pseudo mobile chargé:', snapshot.val());
                }
            }
            
        } catch (error) {
            console.error('Erreur chargement pseudo mobile:', error);
        }
    };
    
    loadWithRetry();
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