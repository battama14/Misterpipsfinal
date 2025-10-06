// Test du système de pseudo unifié
console.log('🧪 Test du système de pseudo unifié...');

// Vérifier que le gestionnaire est chargé
setTimeout(() => {
    if (window.nicknameManager) {
        console.log('✅ Gestionnaire de pseudo unifié chargé');
        
        // Test d'initialisation
        window.nicknameManager.initialize().then(nickname => {
            if (nickname) {
                console.log('✅ Pseudo initialisé:', nickname);
            } else {
                console.log('📝 Aucun pseudo trouvé - sera demandé à l'utilisateur');
            }
        }).catch(error => {
            console.error('❌ Erreur initialisation pseudo:', error);
        });
        
    } else {
        console.error('❌ Gestionnaire de pseudo non trouvé');
    }
    
    // Vérifier les fonctions de nettoyage mobile
    if (window.loadMobileNickname) {
        console.log('✅ Fonction mobile loadMobileNickname disponible');
    }
    
    if (window.saveMobileNicknameFromSettings) {
        console.log('✅ Fonction mobile saveMobileNicknameFromSettings disponible');
    }
    
    // Vérifier Firebase
    if (window.firebaseDB) {
        console.log('✅ Firebase Database connecté');
    } else {
        console.log('⏳ Firebase Database en attente...');
    }
    
    // Vérifier l'utilisateur
    const uid = sessionStorage.getItem('firebaseUID');
    if (uid) {
        console.log('✅ Utilisateur connecté:', uid);
    } else {
        console.log('❌ Aucun utilisateur connecté');
    }
    
}, 2000);

console.log('🧪 Test du système de pseudo lancé');