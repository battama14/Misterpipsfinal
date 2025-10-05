// Fix pseudo mobile - Force persistance
console.log('🔧 Fix pseudo mobile');

// Sauvegarder pseudo mobile FORCE
function forceSaveNickname() {
    const input = document.getElementById('mobileNickname');
    if (!input || !input.value.trim()) return;
    
    const nickname = input.value.trim();
    const uid = sessionStorage.getItem('firebaseUID');
    const email = sessionStorage.getItem('userEmail');
    
    // Sauvegarder PARTOUT
    localStorage.setItem('NICKNAME_FORCE', nickname);
    localStorage.setItem('userNickname', nickname);
    sessionStorage.setItem('userNickname', nickname);
    
    if (uid) {
        localStorage.setItem(`nickname_${uid}`, nickname);
        localStorage.setItem(`user_${uid}`, nickname);
    }
    if (email) {
        localStorage.setItem(`nickname_${email}`, nickname);
    }
    
    console.log('💾 Pseudo forcé:', nickname);
    alert('✅ Pseudo sauvegardé !');
}

// Charger pseudo mobile FORCE
function forceLoadNickname() {
    const input = document.getElementById('mobileNickname');
    if (!input) return;
    
    const uid = sessionStorage.getItem('firebaseUID');
    const email = sessionStorage.getItem('userEmail');
    
    // Essayer toutes les sources
    let nickname = localStorage.getItem('NICKNAME_FORCE') ||
                   localStorage.getItem('userNickname') ||
                   sessionStorage.getItem('userNickname');
    
    if (!nickname && uid) {
        nickname = localStorage.getItem(`nickname_${uid}`) ||
                   localStorage.getItem(`user_${uid}`);
    }
    
    if (!nickname && email) {
        nickname = localStorage.getItem(`nickname_${email}`) ||
                   email.split('@')[0];
    }
    
    if (nickname) {
        input.value = nickname;
        sessionStorage.setItem('userNickname', nickname);
        console.log('📥 Pseudo chargé:', nickname);
    }
}

// Remplacer les fonctions existantes
window.saveMobileNicknameSimple = forceSaveNickname;
window.loadMobileNicknameSimple = forceLoadNickname;

// Charger au démarrage
setTimeout(forceLoadNickname, 500);
setTimeout(forceLoadNickname, 2000);
setTimeout(forceLoadNickname, 5000);

// Sauvegarder à chaque changement
document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('mobileNickname');
    if (input) {
        input.addEventListener('blur', forceSaveNickname);
        input.addEventListener('change', forceSaveNickname);
    }
    
    // Remplacer bouton sauvegarde
    const saveBtn = document.getElementById('saveSettingsBtn');
    if (saveBtn) {
        saveBtn.onclick = forceSaveNickname;
    }
});

console.log('✅ Fix pseudo mobile prêt');