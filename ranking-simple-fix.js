// Classement VIP simple - Contourne les restrictions
console.log('🏆 Classement VIP simple...');

async function loadRealFirebaseRanking() {
    if (!window.firebaseDB) {
        console.log('Firebase non disponible');
        return [];
    }
    
    try {
        const { ref, get } = await import('https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js');
        const usersRef = ref(window.firebaseDB, 'users');
        const snapshot = await get(usersRef);
        
        if (!snapshot.exists()) {
            console.log('Aucun utilisateur trouvé');
            return [];
        }
        
        const users = snapshot.val();
        const today = new Date().toISOString().split('T')[0];
        const rankings = [];
        
        for (const [uid, userData] of Object.entries(users)) {
            if (!userData.isVIP && userData.plan !== 'VIP') continue;
            
            // Récupérer les trades
            let userTrades = [];
            
            // Dashboards
            try {
                const dashRef = ref(window.firebaseDB, `dashboards/${uid}/trades`);
                const dashSnapshot = await get(dashRef);
                if (dashSnapshot.exists()) {
                    const trades = dashSnapshot.val();
                    userTrades = Array.isArray(trades) ? trades : Object.values(trades || {});
                }
            } catch (e) {}
            
            // Users accounts
            if (userTrades.length === 0 && userData.accounts) {
                Object.values(userData.accounts).forEach(account => {
                    if (account.trades) {
                        const trades = Array.isArray(account.trades) ? account.trades : Object.values(account.trades || {});
                        userTrades = trades;
                    }
                });
            }
            
            // S'assurer que userTrades est un tableau
            if (!Array.isArray(userTrades)) {
                userTrades = [];
            }
            
            const todayTrades = userTrades.filter(t => 
                t && t.date === today && t.status === 'closed'
            );
            
            const dailyPnL = todayTrades.reduce((sum, t) => 
                sum + (parseFloat(t.pnl) || 0), 0
            );
            
            const winningTrades = todayTrades.filter(t => parseFloat(t.pnl) > 0).length;
            const winRate = todayTrades.length > 0 ? Math.round((winningTrades / todayTrades.length) * 100) : 0;
            
            const nickname = userData.nickname || 'Trader VIP';
            
            rankings.push({
                uid,
                name: nickname,
                dailyPnL,
                todayTrades: todayTrades.length,
                winRate,
                isCurrentUser: uid === sessionStorage.getItem('firebaseUID')
            });
        }
        
        return rankings.sort((a, b) => b.dailyPnL - a.dailyPnL);
    } catch (error) {
        console.error('Erreur Firebase ranking:', error);
        return [];
    }
}

async function loadSimpleRanking() {
    const containers = [
        document.getElementById('rankingList'),
        document.getElementById('mobileRankingList')
    ];
    
    const rankings = await loadRealFirebaseRanking();
    
    containers.forEach(container => {
        if (!container) return;
        
        console.log('🏆 Affichage classement Firebase dans:', container.id, rankings.length, 'utilisateurs');
        
        let html = '<div class="ranking-header"><h4>🏆 Classement VIP Journalier</h4></div>';
        
        rankings.forEach((user, index) => {
            const position = index + 1;
            const medal = position === 1 ? '🥇' : position === 2 ? '🥈' : position === 3 ? '🥉' : `${position}.`;
            
            html += `
                <div class="ranking-item ${user.isCurrentUser ? 'current-user' : ''}">
                    <div class="ranking-position">${medal}</div>
                    <div class="ranking-info">
                        <div class="trader-name">${user.name}</div>
                        <div class="trader-stats">${user.todayTrades} trades • ${user.winRate}% WR</div>
                    </div>
                    <div class="ranking-pnl ${user.dailyPnL >= 0 ? 'positive' : 'negative'}">
                        $${user.dailyPnL.toFixed(2)}
                    </div>
                </div>
            `;
        });
        
        if (rankings.length === 0) {
            container.innerHTML = '<div class="no-ranking">🏆 Aucun trader VIP actif aujourd\'hui</div>';
            return;
        }
        
        html += `
            <div class="ranking-footer">
                <small>Temps réel Firebase • ${new Date().toLocaleTimeString()}</small>
            </div>
        `;
        
        container.innerHTML = html;
        console.log('✅ Classement Firebase affiché:', rankings.length, 'traders');
    });
}

// Charger immédiatement
setTimeout(loadSimpleRanking, 2000);
setTimeout(loadSimpleRanking, 5000);

// Recharger toutes les 15 secondes pour temps réel
setInterval(loadSimpleRanking, 15000);

// Recharger après chaque action de trade
function updateRankingAfterTrade() {
    setTimeout(loadSimpleRanking, 1000);
}

// Exposer pour les autres scripts
window.updateRankingAfterTrade = updateRankingAfterTrade;

// Exposer globalement
window.loadSimpleRanking = loadSimpleRanking;
window.loadRealFirebaseRanking = loadRealFirebaseRanking;

console.log('✅ Classement VIP simple chargé');