// Script de debug pour vérifier les pseudos dans Firebase
async function debugNicknames() {
    if (!window.firebaseDB) {
        console.log('❌ Firebase non disponible');
        return;
    }
    
    try {
        const { ref, get } = await import('https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js');
        
        // Récupérer tous les utilisateurs
        const usersRef = ref(window.firebaseDB, 'users');
        const usersSnapshot = await get(usersRef);
        
        if (!usersSnapshot.exists()) {
            console.log('❌ Aucun utilisateur trouvé');
            return;
        }
        
        const users = usersSnapshot.val();
        console.log('🔍 Debug des pseudos:');
        
        Object.entries(users).forEach(([uid, userData]) => {
            if (userData.isVIP) {
                console.log(`👤 Utilisateur ${uid}:`);
                console.log(`  - Email: ${userData.email}`);
                console.log(`  - Pseudo: ${userData.nickname || 'AUCUN'}`);
                console.log(`  - VIP: ${userData.isVIP}`);
                console.log('---');
            }
        });
        
        // Vérifier aussi la structure nicknames
        const nicknamesRef = ref(window.firebaseDB, 'nicknames');
        const nicknamesSnapshot = await get(nicknamesRef);
        
        if (nicknamesSnapshot.exists()) {
            console.log('🏷️ Structure nicknames:');
            console.log(nicknamesSnapshot.val());
        }
        
    } catch (error) {
        console.error('❌ Erreur debug:', error);
    }
}

// Fonction accessible depuis la console
window.debugNicknames = debugNicknames;

// Auto-debug après 5 secondes
setTimeout(() => {
    if (sessionStorage.getItem('firebaseUID')) {
        debugNicknames();
    }
}, 5000);

console.log('🔍 Debug nicknames chargé - tapez debugNicknames() dans la console');