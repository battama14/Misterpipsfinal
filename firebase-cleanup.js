// Script pour nettoyer complètement Firebase des anciens pseudos
async function cleanupFirebaseNicknames() {
    if (!window.firebaseDB || !window.firebaseAuth.currentUser) {
        console.log('❌ Firebase non prêt');
        return;
    }

    try {
        console.log('🧹 Nettoyage Firebase en cours...');
        
        // Supprimer tous les anciens chemins de pseudos
        const pathsToClean = [
            'users',
            'nicknames', 
            'vip_nicknames',
            'user_nicknames',
            'rankings',
            'vip_rankings'
        ];

        for (const path of pathsToClean) {
            try {
                const ref = window.firebaseModules.ref(window.firebaseDB, path);
                await window.firebaseModules.set(ref, null);
                console.log(`✅ Supprimé: ${path}`);
            } catch (error) {
                console.log(`⚠️ Erreur suppression ${path}:`, error.message);
            }
        }

        console.log('🎉 Nettoyage Firebase terminé !');
        
        // Nettoyer aussi le localStorage
        const keysToRemove = [
            'userNickname',
            'vipNickname', 
            'currentNickname',
            'rankingData',
            'vipRankings'
        ];
        
        keysToRemove.forEach(key => {
            localStorage.removeItem(key);
            sessionStorage.removeItem(key);
        });
        
        console.log('🧹 LocalStorage nettoyé');
        
        // Redémarrer le système propre
        if (window.cleanNicknameSystem) {
            await window.cleanNicknameSystem.init();
        }
        
        alert('✅ Nettoyage terminé ! Les pseudos repartent de zéro.');
        
    } catch (error) {
        console.error('❌ Erreur nettoyage:', error);
        alert('❌ Erreur lors du nettoyage: ' + error.message);
    }
}

// Auto-nettoyage au chargement
if (window.firebaseAuth && window.firebaseDB) {
    cleanupFirebaseNicknames();
} else {
    const checkFirebase = setInterval(() => {
        if (window.firebaseAuth && window.firebaseDB) {
            clearInterval(checkFirebase);
            cleanupFirebaseNicknames();
        }
    }, 1000);
}

// Exposer la fonction
window.cleanupFirebaseNicknames = cleanupFirebaseNicknames;