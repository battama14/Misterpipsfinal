// Test du système de pseudo unifié mobile
console.log('🧪 Test système pseudo mobile unifié');

// Test après chargement complet
setTimeout(async () => {
    console.log('🧪 === DÉBUT DES TESTS MOBILE ===');
    
    // Test 1: Vérifier que le système mobile est chargé
    if (window.mobileNicknameSystem) {
        console.log('✅ Test 1: Système mobile chargé');
        
        // Test 2: Récupérer le pseudo actuel
        try {
            const currentNickname = await window.mobileNicknameSystem.getCurrentNickname();
            console.log('✅ Test 2: Pseudo actuel récupéré:', currentNickname);
            
            // Test 3: Vérifier l'affichage dans l'input
            const nicknameInput = document.getElementById('mobileNickname');
            if (nicknameInput) {
                console.log('✅ Test 3: Input pseudo trouvé, valeur:', nicknameInput.value);
            } else {
                console.log('❌ Test 3: Input pseudo non trouvé');
            }
            
            // Test 4: Vérifier le bouton de sauvegarde
            const saveBtn = document.getElementById('saveNicknameBtn');
            if (saveBtn && saveBtn.hasAttribute('data-mobile-profiles-init')) {
                console.log('✅ Test 4: Bouton sauvegarde configuré');
            } else {
                console.log('❌ Test 4: Bouton sauvegarde non configuré');
            }
            
        } catch (error) {
            console.log('❌ Test 2: Erreur récupération pseudo:', error);
        }
        
    } else {
        console.log('❌ Test 1: Système mobile non chargé');
    }
    
    // Test 5: Vérifier que les anciens systèmes sont bloqués
    console.log('🧪 Test 5: Vérification blocage anciens systèmes');
    
    // Tenter de sauvegarder un ancien pseudo
    const originalLength = Object.keys(localStorage).length;
    localStorage.setItem('userNickname', 'test');
    const newLength = Object.keys(localStorage).length;
    
    if (newLength === originalLength) {
        console.log('✅ Test 5: Ancien système localStorage bloqué');
    } else {
        console.log('❌ Test 5: Ancien système localStorage non bloqué');
        localStorage.removeItem('userNickname');
    }
    
    // Test 6: Vérifier Firebase
    if (window.firebaseDB) {
        console.log('✅ Test 6: Firebase disponible');
        
        const uid = sessionStorage.getItem('firebaseUID');
        if (uid) {
            console.log('✅ Test 6b: UID utilisateur disponible:', uid);
        } else {
            console.log('❌ Test 6b: UID utilisateur manquant');
        }
    } else {
        console.log('❌ Test 6: Firebase non disponible');
    }
    
    // Test 7: Vérifier le chat utilise le bon système
    if (window.sendMessage) {
        console.log('✅ Test 7: Fonction sendMessage disponible');
    } else {
        console.log('❌ Test 7: Fonction sendMessage manquante');
    }
    
    console.log('🧪 === FIN DES TESTS MOBILE ===');
    
}, 5000);

// Test en continu du pseudo affiché
setInterval(() => {
    const nicknameInput = document.getElementById('mobileNickname');
    if (nicknameInput && nicknameInput.value && nicknameInput.value !== 'Mobile User') {
        console.log('📱 Pseudo mobile actuel:', nicknameInput.value);
    }
}, 30000);