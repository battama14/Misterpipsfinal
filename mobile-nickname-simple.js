// Gestion simple du pseudo mobile
window.saveMobileNicknameFromSettings = async function() {
    const nicknameInput = document.getElementById('mobileNickname');
    if (!nicknameInput) return false;
    
    const newNickname = nicknameInput.value.trim();
    if (!newNickname) {
        alert('❌ Veuillez saisir un pseudo');
        return false;
    }
    
    if (newNickname.includes('@')) {
        alert('❌ Impossible d\'utiliser un email comme pseudo');
        return false;
    }
    
    const success = await window.saveVIPNickname(newNickname);
    if (success) {
        alert('✅ Pseudo sauvegardé !');
    } else {
        alert('❌ Erreur sauvegarde');
    }
    return success;
};

// Lier le bouton
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const saveBtn = document.getElementById('saveNicknameBtn');
        if (saveBtn) {
            saveBtn.addEventListener('click', window.saveMobileNicknameFromSettings);
        }
    }, 2000);
});

console.log('📱 Pseudo mobile simple chargé');