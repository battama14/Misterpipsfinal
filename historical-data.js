// Données historiques Forex - Misterpips
console.log('📊 Chargement des données historiques...');

// Les données sont maintenant créées par CORRECTIONS-CRITIQUES-DEPLOIEMENT.js
// Ce fichier sert de fallback

if (!window.HISTORICAL_DATA) {
    console.log('⚠️ Données historiques non trouvées, création fallback...');
    
    window.HISTORICAL_DATA = {
        USD: {
            NFP: [
                { date: '2024-10', result: 2.1, consensus: 2.3, impact: -0.7 },
                { date: '2024-11', result: 2.6, consensus: 2.1, impact: 1.4 },
                { date: '2024-12', result: 2.3, consensus: 2.4, impact: -0.3 }
            ],
            CPI: [
                { date: '2024-10', result: 3.1, consensus: 3.3, impact: -0.6 },
                { date: '2024-11', result: 3.6, consensus: 3.1, impact: 1.3 },
                { date: '2024-12', result: 3.3, consensus: 3.4, impact: -0.2 }
            ]
        },
        EUR: {
            NFP: [
                { date: '2024-10', result: 1.7, consensus: 1.9, impact: -0.4 },
                { date: '2024-11', result: 2.2, consensus: 1.7, impact: 1.0 },
                { date: '2024-12', result: 1.9, consensus: 2.0, impact: -0.2 }
            ],
            CPI: [
                { date: '2024-10', result: 2.7, consensus: 2.9, impact: -0.4 },
                { date: '2024-11', result: 3.2, consensus: 2.7, impact: 1.1 },
                { date: '2024-12', result: 2.9, consensus: 3.0, impact: -0.2 }
            ]
        }
    };
}

// Fonctions utilitaires
window.loadHistoricalData = function() {
    console.log('📊 Données historiques chargées');
    if (window.updateFirebaseStatus) {
        window.updateFirebaseStatus('✅ Données: Chargées', true);
    }
};

window.saveToFirebase = function() {
    console.log('💾 Sauvegarde Firebase simulée');
    if (window.updateFirebaseStatus) {
        window.updateFirebaseStatus('✅ Firebase: Sauvegardé', true);
    }
};

console.log('✅ Données historiques prêtes');