// Nettoyage des scripts en doublon - Misterpips
console.log('🧹 Nettoyage des doublons...');

// Scripts à supprimer (doublons/obsolètes)
const scriptsToRemove = [
    'mobile-buttons-fix.js', // Remplacé par mobile-trade-buttons-fix.js
    'mobile-critical-fixes.js', // Fusionné dans mobile-fix-urgent.js
    'mobile-fixes-urgent.js', // Doublon de mobile-fix-urgent.js
    'mobile-notifications-fix.js', // Remplacé par mobile-notifications-enhanced.js
    'chat-fixes.js', // Obsolète
    'chat-simple-fix.js', // Obsolète
    'chat-toggle-fix.js', // Obsolète
    'dashboard-emergency-fix.js', // Obsolète
    'dashboard-fix-urgent.js', // Obsolète
    'pc-buttons-fix.js', // Conflits avec mobile
    'pc-clean-fix.js', // Obsolète
    'pc-final-fix.js', // Obsolète
    'ranking-fix.js', // Remplacé par ranking-simple-fix.js
    'mobile-delete-fix.js', // Intégré dans mobile-trade-buttons-fix.js
    'force-badge-zero.js', // Obsolète
    'chat-badge-fix.js', // Obsolète
    'button-fix.js', // Obsolète
    'modal-fix.js', // Obsolète
    'modal-close-fix.js' // Obsolète
];

// Désactiver les scripts obsolètes
function disableObsoleteScripts() {
    scriptsToRemove.forEach(scriptName => {
        // Marquer comme désactivé
        if (window[scriptName.replace('.js', '').replace('-', '_')]) {
            window[scriptName.replace('.js', '').replace('-', '_')] = null;
        }
        
        console.log(`🗑️ Script ${scriptName} désactivé`);
    });
}

// Nettoyer les événements en doublon
function cleanupDuplicateEvents() {
    // Supprimer les anciens event listeners
    const buttons = document.querySelectorAll('button[data-fixed], button[data-initialized]');
    buttons.forEach(btn => {
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
    });
    
    console.log('🧹 Événements en doublon nettoyés');
}

// Nettoyer les variables globales en conflit
function cleanupGlobalVariables() {
    // Variables obsolètes à nettoyer
    const obsoleteVars = [
        'mobileButtonsFix',
        'mobileCriticalFixes',
        'chatFixes',
        'dashboardFix',
        'pcButtonsFix'
    ];
    
    obsoleteVars.forEach(varName => {
        if (window[varName]) {
            window[varName] = null;
            delete window[varName];
        }
    });
    
    console.log('🧹 Variables globales nettoyées');
}

// Nettoyer les observers en doublon
function cleanupObservers() {
    // Arrêter tous les observers obsolètes
    if (window.buttonObserver) {
        window.buttonObserver.disconnect();
        window.buttonObserver = null;
    }
    
    if (window.mobileObserver) {
        window.mobileObserver.disconnect();
        window.mobileObserver = null;
    }
    
    console.log('🧹 Observers nettoyés');
}

// Fonction principale de nettoyage
function performCleanup() {
    console.log('🧹 Début du nettoyage...');
    
    disableObsoleteScripts();
    cleanupDuplicateEvents();
    cleanupGlobalVariables();
    cleanupObservers();
    
    // Forcer le garbage collection si disponible
    if (window.gc) {
        window.gc();
    }
    
    console.log('✅ Nettoyage terminé');
}

// Auto-nettoyage au chargement
setTimeout(performCleanup, 1000);

// Nettoyage périodique
setInterval(() => {
    cleanupDuplicateEvents();
}, 30000);

// Exposer la fonction
window.performCleanup = performCleanup;

console.log('🧹 Script de nettoyage chargé');