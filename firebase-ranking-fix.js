// Utiliser le classement existant dans Firebase
async function loadFirebaseRanking() {
    if (!window.firebaseDB) return;
    
    try {
        const rankingRef = window.firebaseModules.ref(window.firebaseDB, 'ranking');
        const snapshot = await window.firebaseModules.get(rankingRef);
        
        const container = document.getElementById('mobileRankingList') || document.getElementById('rankingList');
        if (!container) return;
        
        if (snapshot.exists()) {
            const data = snapshot.val();
            const rankings = Object.entries(data).map(([uid, userData]) => ({
                uid,
                nickname: userData.nickname || userData.name || 'Trader',
                profit: userData.profit || 0,
                winRate: userData.winRate || 0,
                trades: userData.trades || 0
            })).sort((a, b) => b.profit - a.profit);
            
            const html = rankings.map((trader, index) => {
                const position = index + 1;
                const medal = position === 1 ? '🥇' : position === 2 ? '🥈' : position === 3 ? '🥉' : `${position}.`;
                
                return `
                    <div class="ranking-item">
                        <span class="rank">${medal}</span>
                        <div class="trader-info">
                            <span class="trader-name">${trader.nickname}</span>
                            <span class="trader-stats">${trader.trades} trades • ${trader.winRate}% WR</span>
                        </div>
                        <span class="trader-profit ${trader.profit >= 0 ? 'positive' : 'negative'}">
                            ${trader.profit >= 0 ? '+' : ''}$${trader.profit.toFixed(2)}
                        </span>
                    </div>
                `;
            }).join('');
            
            container.innerHTML = html;
        } else {
            container.innerHTML = '<div class="no-ranking">Aucun trader dans le classement</div>';
        }
    } catch (error) {
        console.error('Erreur chargement classement:', error);
    }
}

// Remplacer le système
window.cleanRankingSystem = {
    loadRankings: loadFirebaseRanking
};

// Auto-load
setTimeout(loadFirebaseRanking, 2000);