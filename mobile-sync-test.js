// Test de synchronisation Mobile ↔ PC
console.log('🧪 Test synchronisation Mobile ↔ PC...');

// Vérifier les fonctions critiques
setTimeout(() => {
    console.log('=== VÉRIFICATION FONCTIONS MOBILE ===');
    
    // Fonctions de trade
    if (window.deleteTrade) {
        console.log('✅ deleteTrade disponible');
    } else {
        console.error('❌ deleteTrade manquante');
    }
    
    if (window.closeTrade) {
        console.log('✅ closeTrade disponible');
    } else {
        console.error('❌ closeTrade manquante');
    }
    
    if (window.saveMobileDataComplete) {
        console.log('✅ saveMobileDataComplete disponible');
    } else {
        console.error('❌ saveMobileDataComplete manquante');
    }
    
    // Données
    if (window.mobileData && window.mobileData.trades) {
        console.log('✅ mobileData.trades:', window.mobileData.trades.length, 'trades');
    } else {
        console.error('❌ mobileData.trades manquante');
    }
    
    if (window.mobileTradesData) {
        console.log('✅ mobileTradesData:', window.mobileTradesData.length, 'trades');
    } else {
        console.error('❌ mobileTradesData manquante');
    }
    
    // Firebase
    if (window.firebaseDB) {
        console.log('✅ Firebase Database connecté');
    } else {
        console.error('❌ Firebase Database manquant');
    }
    
    // Classement VIP
    if (window.loadMobileRanking) {
        console.log('✅ loadMobileRanking disponible');
    } else {
        console.error('❌ loadMobileRanking manquante');
    }
    
    // Pseudo unifié
    if (window.nicknameManager) {
        console.log('✅ nicknameManager disponible');
        console.log('   Pseudo actuel:', window.nicknameManager.getNickname());
    } else {
        console.error('❌ nicknameManager manquant');
    }
    
    console.log('=== FIN VÉRIFICATION ===');
    
    // Test de synchronisation
    testSyncronization();
    
}, 3000);

async function testSyncronization() {
    console.log('🔄 Test de synchronisation...');
    
    const uid = sessionStorage.getItem('firebaseUID');
    if (!uid || !window.firebaseDB) {
        console.error('❌ Impossible de tester - Firebase non prêt');
        return;
    }
    
    try {
        const { ref, get } = await import('https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js');
        
        // Vérifier dashboards (données PC)
        const dashboardRef = ref(window.firebaseDB, `dashboards/${uid}`);
        const dashboardSnapshot = await get(dashboardRef);
        
        if (dashboardSnapshot.exists()) {
            const pcData = dashboardSnapshot.val();
            console.log('✅ Données PC trouvées:', {
                trades: pcData.trades?.length || 0,
                settings: pcData.settings ? 'OK' : 'Manquant',
                accounts: pcData.accounts ? Object.keys(pcData.accounts).length : 0
            });
        } else {
            console.log('⚠️ Aucune donnée PC trouvée');
        }
        
        // Vérifier users (données utilisateur)
        const userRef = ref(window.firebaseDB, `users/${uid}`);
        const userSnapshot = await get(userRef);
        
        if (userSnapshot.exists()) {
            const userData = userSnapshot.val();
            console.log('✅ Données utilisateur trouvées:', {
                nickname: userData.nickname || 'Manquant',
                isVIP: userData.isVIP,
                accounts: userData.accounts ? Object.keys(userData.accounts).length : 0
            });
        } else {
            console.log('⚠️ Aucune donnée utilisateur trouvée');
        }
        
        // Vérifier pseudo
        const nicknameRef = ref(window.firebaseDB, `users/${uid}/nickname`);
        const nicknameSnapshot = await get(nicknameRef);
        
        if (nicknameSnapshot.exists()) {
            console.log('✅ Pseudo Firebase:', nicknameSnapshot.val());
        } else {
            console.log('⚠️ Aucun pseudo Firebase');
        }
        
    } catch (error) {
        console.error('❌ Erreur test synchronisation:', error);
    }
}

// Test des boutons de suppression
function testDeleteButtons() {
    const deleteButtons = document.querySelectorAll('.btn-delete');
    console.log(`🔍 ${deleteButtons.length} boutons de suppression trouvés`);
    
    deleteButtons.forEach((btn, index) => {
        if (btn.onclick || btn.getAttribute('onclick')) {
            console.log(`✅ Bouton ${index + 1}: Event configuré`);
        } else {
            console.error(`❌ Bouton ${index + 1}: Pas d'event`);
        }
    });
}

// Tester après chargement des trades
setTimeout(() => {
    testDeleteButtons();
}, 5000);

console.log('🧪 Test de synchronisation lancé');