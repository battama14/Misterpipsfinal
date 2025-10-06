// Force la mise à jour du classement avec le bon pseudo
console.log('🔄 Force ranking update...');

function forceRankingUpdate() {
    const nickname = sessionStorage.getItem('userNickname');
    if (nickname) {
        console.log('🏷️ Pseudo trouvé:', nickname);
        
        // Forcer plusieurs mises à jour
        if (window.loadSimpleRanking) {
            console.log('🏆 Force loadSimpleRanking');
            window.loadSimpleRanking();
        }
        
        setTimeout(() => {
            if (window.loadSimpleRanking) window.loadSimpleRanking();
        }, 2000);
        
        setTimeout(() => {
            if (window.loadSimpleRanking) window.loadSimpleRanking();
        }, 5000);
    }
}

// Forcer après chargement complet
setTimeout(forceRankingUpdate, 3000);
setTimeout(forceRankingUpdate, 6000);
setTimeout(forceRankingUpdate, 10000);

console.log('✅ Force ranking update chargé');