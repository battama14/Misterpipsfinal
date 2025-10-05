// Fix erreurs extensions - Misterpips
console.log('🛡️ Fix erreurs extensions');

// Bloquer erreurs SES/lockdown
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

console.error = function(...args) {
    const message = args.join(' ');
    if (message.includes('SES_UNCAUGHT_EXCEPTION') || 
        message.includes('lockdown') ||
        message.includes('moz-extension') ||
        message.includes('contentscript') ||
        message.includes('An invalid or illegal string')) {
        return; // Ignorer ces erreurs
    }
    originalConsoleError.apply(console, args);
};

console.warn = function(...args) {
    const message = args.join(' ');
    if (message.includes('lockdown') || 
        message.includes('moz-extension') ||
        message.includes('Removing')) {
        return; // Ignorer ces warnings
    }
    originalConsoleWarn.apply(console, args);
};

// Test synchronisation pseudo
function testNicknameSync() {
    const uid = sessionStorage.getItem('firebaseUID');
    if (!uid) return;
    
    const nickname = sessionStorage.getItem('userNickname');
    if (nickname) {
        console.log('✅ Pseudo actuel:', nickname);
        
        // Vérifier si synchronisé
        const sources = [
            localStorage.getItem('userNickname'),
            localStorage.getItem(`nickname_${uid}`),
            sessionStorage.getItem('userNickname')
        ];
        
        const synced = sources.filter(s => s === nickname).length;
        console.log(`🔄 Synchronisation: ${synced}/3 sources`);
        
        if (synced >= 2) {
            console.log('✅ Pseudo bien synchronisé');
        } else {
            console.log('⚠️ Synchronisation partielle');
        }
    }
}

// Test au chargement
setTimeout(testNicknameSync, 3000);

console.log('✅ Fix erreurs extensions prêt');