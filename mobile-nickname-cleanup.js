// Nettoyage et simplification des pseudos mobile
console.log('🧹 Nettoyage système pseudo mobile...');

// Supprimer les anciennes fonctions conflictuelles
window.saveUnifiedNickname = undefined;
window.loadMobileNicknameSimple = undefined;
window.saveMobileNickname = undefined;

// Fonction simplifiée pour sauvegarder le pseudo depuis les paramètres mobile
window.saveMobileNicknameFromSettings = async function() {
    const input = document.getElementById('mobileNickname');
    if (!input || !input.value.trim()) {
        // Si pas de pseudo saisi, demander maintenant
        if (window.nicknameManager && !window.nicknameManager.getNickname()) {
            await window.nicknameManager.ensureNickname();
            const nickname = window.nicknameManager.getNickname();
            if (nickname && input) {
                input.value = nickname;
            }
        }
        return true;
    }

    const nickname = input.value.trim();
    
    if (window.nicknameManager) {
        const success = await window.nicknameManager.changeNickname(nickname);
        if (success) {
            console.log('✅ Pseudo mobile sauvegardé:', nickname);
            return true;
        }
    }
    
    alert('❌ Erreur lors de la sauvegarde du pseudo');
    return false;
};

// Fonction pour charger le pseudo au démarrage mobile (sans demander)
window.loadMobileNickname = async function() {
    if (window.nicknameManager) {
        await window.nicknameManager.initialize();
        const nickname = window.nicknameManager.getNickname();
        
        // Mettre à jour l'interface mobile
        const input = document.getElementById('mobileNickname');
        if (input && nickname) {
            input.value = nickname;
        }
        
        console.log('📱 Pseudo mobile chargé:', nickname);
        return nickname;
    }
    
    return null;
};

// Remplacer la fonction de sauvegarde des paramètres
const originalSaveSettings = window.saveMobileAccountSettings;
window.saveMobileAccountSettings = function() {
    // Sauvegarder le pseudo d'abord
    window.saveMobileNicknameFromSettings();
    
    // Puis sauvegarder les autres paramètres
    if (originalSaveSettings) {
        originalSaveSettings();
    }
};

console.log('✅ Nettoyage pseudo mobile terminé');