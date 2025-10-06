// Bloqueur de pseudo automatique
console.log('🚫 Bloqueur pseudo automatique...');

// Bloquer tous les chargements automatiques de pseudo
function blockAutoNickname() {
    const inputs = [
        document.getElementById('mobileNickname'),
        document.getElementById('nicknameInput'),
        document.querySelector('input[placeholder*="pseudo"]'),
        document.querySelector('input[placeholder*="Pseudo"]')
    ];
    
    inputs.forEach(input => {
        if (input) {
            // Bloquer si contient email
            if (input.value && (input.value.includes('@') || input.value.includes('kamel.lou'))) {
                input.value = '';
                console.log('🚫 Pseudo email bloqué:', input.id);
            }
            
            // Observer les changements
            const observer = new MutationObserver(() => {
                if (input.value && (input.value.includes('@') || input.value.includes('kamel.lou'))) {
                    input.value = '';
                    console.log('🚫 Pseudo email auto-bloqué');
                }
            });
            observer.observe(input, { attributes: true, attributeFilter: ['value'] });
        }
    });
}

// Bloquer sessionStorage
const originalSetItem = sessionStorage.setItem;
sessionStorage.setItem = function(key, value) {
    if (key === 'userNickname' && value && (value.includes('@') || value.includes('kamel.lou'))) {
        console.log('🚫 Pseudo email bloqué dans sessionStorage');
        return;
    }
    return originalSetItem.call(this, key, value);
};

// Nettoyer sessionStorage existant
if (sessionStorage.getItem('userNickname')) {
    const current = sessionStorage.getItem('userNickname');
    if (current.includes('@') || current.includes('kamel.lou')) {
        sessionStorage.removeItem('userNickname');
        console.log('🚫 Pseudo email supprimé de sessionStorage');
    }
}

// Exécuter immédiatement et périodiquement
blockAutoNickname();
setInterval(blockAutoNickname, 1000);

console.log('✅ Bloqueur pseudo chargé');