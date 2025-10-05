// Synchronisation classement avec pseudos unifiés
console.log('🏆 Sync classement-pseudos chargé');

// Fonction pour charger le classement avec pseudos synchronisés
async function loadUnifiedRanking() {
    if (!window.firebaseDB) {
        console.log('⏳ Firebase non prêt pour classement');
        return;
    }

    try {
        const { ref, get } = await import('https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js');
        
        // Charger les profils utilisateurs
        const usersSnapshot = await get(ref(window.firebaseDB, 'users'));
        const rankingSnapshot = await get(ref(window.firebaseDB, 'ranking'));
        
        const users = usersSnapshot.exists() ? usersSnapshot.val() : {};
        const ranking = rankingSnapshot.exists() ? rankingSnapshot.val() : {};
        
        // Créer le classement unifié
        const unifiedRanking = [];
        
        Object.keys(users).forEach(uid => {
            const user = users[uid];
            const userRanking = ranking[uid] || {};
            
            // Vérifier si l'utilisateur est VIP et a un pseudo
            if (user.isVIP && user.nickname) {
                unifiedRanking.push({
                    uid: uid,
                    nickname: user.nickname,
                    email: user.email || 'N/A',
                    winRate: userRanking.winRate || 0,
                    totalTrades: userRanking.totalTrades || 0,
                    profit: userRanking.profit || 0,
                    lastUpdate: userRanking.lastUpdate || 0
                });
            }
        });
        
        // Trier par profit décroissant
        unifiedRanking.sort((a, b) => b.profit - a.profit);
        
        // Afficher le classement
        displayUnifiedRanking(unifiedRanking);
        
        console.log('✅ Classement unifié chargé:', unifiedRanking.length, 'utilisateurs');
        
    } catch (error) {
        console.error('❌ Erreur chargement classement:', error);
    }
}

// Afficher le classement unifié
function displayUnifiedRanking(ranking) {
    const containers = [
        document.getElementById('rankingList'),
        document.getElementById('mobileRankingList')
    ];
    
    containers.forEach(container => {
        if (!container) return;
        
        if (ranking.length === 0) {
            container.innerHTML = '<div class="no-ranking">Aucun utilisateur dans le classement</div>';
            return;
        }
        
        let html = '';
        
        ranking.forEach((user, index) => {
            const position = index + 1;
            const medal = position === 1 ? '🥇' : position === 2 ? '🥈' : position === 3 ? '🥉' : `${position}.`;
            const profitClass = user.profit >= 0 ? 'profit' : 'loss';
            
            html += `
                <div class="ranking-item ${position <= 3 ? 'top-3' : ''}">
                    <div class="ranking-position">${medal}</div>
                    <div class="ranking-info">
                        <div class="ranking-nickname">${user.nickname}</div>
                        <div class="ranking-stats">
                            <span class="ranking-trades">${user.totalTrades} trades</span>
                            <span class="ranking-winrate">${user.winRate}% WR</span>
                        </div>
                    </div>
                    <div class="ranking-profit ${profitClass}">
                        ${user.profit >= 0 ? '+' : ''}$${user.profit.toFixed(2)}
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html;
    });
}

// Mettre à jour le classement d'un utilisateur
async function updateUserRanking(uid, stats) {
    if (!window.firebaseDB || !uid) return;
    
    try {
        const { ref, set } = await import('https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js');
        
        const rankingData = {
            winRate: Math.round(stats.winRate || 0),
            totalTrades: stats.totalTrades || 0,
            profit: parseFloat(stats.profit || 0),
            lastUpdate: Date.now()
        };
        
        await set(ref(window.firebaseDB, `ranking/${uid}`), rankingData);
        
        console.log('✅ Classement utilisateur mis à jour:', rankingData);
        
        // Recharger le classement
        setTimeout(() => loadUnifiedRanking(), 1000);
        
    } catch (error) {
        console.error('❌ Erreur mise à jour classement:', error);
    }
}

// Calculer les stats d'un utilisateur
function calculateUserStats(trades) {
    if (!Array.isArray(trades) || trades.length === 0) {
        return { winRate: 0, totalTrades: 0, profit: 0 };
    }
    
    const closedTrades = trades.filter(t => t.status === 'closed' || t.status === 'tp' || t.status === 'sl');
    const winningTrades = closedTrades.filter(t => (t.pnl || t.profit || 0) > 0);
    
    const totalProfit = closedTrades.reduce((sum, t) => sum + (parseFloat(t.pnl) || parseFloat(t.profit) || 0), 0);
    const winRate = closedTrades.length > 0 ? (winningTrades.length / closedTrades.length) * 100 : 0;
    
    return {
        winRate: Math.round(winRate),
        totalTrades: closedTrades.length,
        profit: totalProfit
    };
}

// Synchroniser automatiquement quand les trades changent
function syncRankingOnTradeUpdate() {
    const uid = sessionStorage.getItem('firebaseUID');
    if (!uid) return;
    
    // Récupérer les trades de l'utilisateur
    let trades = [];
    
    // Essayer différentes sources
    const sources = [
        localStorage.getItem('trades'),
        localStorage.getItem(`trades_${uid}`),
        window.mobileTradesData,
        window.tradesData
    ];
    
    for (const source of sources) {
        if (source) {
            try {
                if (typeof source === 'string') {
                    trades = JSON.parse(source);
                } else if (Array.isArray(source)) {
                    trades = source;
                }
                if (Array.isArray(trades) && trades.length > 0) break;
            } catch (e) {}
        }
    }
    
    if (trades.length > 0) {
        const stats = calculateUserStats(trades);
        updateUserRanking(uid, stats);
    }
}

// Exposer les fonctions globalement
window.loadUnifiedRanking = loadUnifiedRanking;
window.updateUserRanking = updateUserRanking;
window.syncRankingOnTradeUpdate = syncRankingOnTradeUpdate;

// Remplacer les anciennes fonctions de classement
window.loadMobileRanking = loadUnifiedRanking;
window.loadRanking = loadUnifiedRanking;

// Auto-chargement
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        if (sessionStorage.getItem('firebaseUID')) {
            loadUnifiedRanking();
        }
    }, 3000);
});

console.log('✅ Sync classement-pseudos prêt');