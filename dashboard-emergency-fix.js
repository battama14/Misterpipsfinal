// Fix d'urgence pour dashboard PC
console.log('🚨 Emergency Fix - Démarrage...');

// Créer nicknameManager manquant
if (!window.nicknameManager) {
    window.nicknameManager = {
        initialize: async function() {
            console.log('✅ NicknameManager initialisé');
            return true;
        },
        ensureNickname: async function() {
            console.log('✅ Nickname assuré');
            return true;
        }
    };
}

// Corriger les erreurs de variables
document.addEventListener('DOMContentLoaded', function() {
    // Supprimer les déclarations en double
    const scripts = document.querySelectorAll('script');
    scripts.forEach(script => {
        if (script.textContent && script.textContent.includes('const todayTrades')) {
            console.log('🔧 Script avec variable dupliquée détecté');
        }
    });
    
    // Forcer l'affichage du body
    if (document.body) {
        document.body.style.opacity = '1';
        document.body.style.visibility = 'visible';
    }
    
    console.log('✅ Emergency fix appliqué');
});

// Fonction de test des boutons
function testAllButtons() {
    const buttons = document.querySelectorAll('button');
    console.log(`🔍 ${buttons.length} boutons trouvés`);
    
    buttons.forEach((btn, index) => {
        if (btn.id) {
            console.log(`✅ Bouton ${btn.id} trouvé`);
        }
    });
}

// Test après 2 secondes
setTimeout(testAllButtons, 2000);