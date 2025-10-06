// Classement VIP Fonctionnel
class VIPRanking {
    constructor() {
        this.currentUser = sessionStorage.getItem('firebaseUID');
        this.rankings = [];
        this.isLoading = false;
        this.init();
    }

    async init() {
        if (!this.currentUser) return;
        
        console.log('🏆 Initialisation du classement VIP...');
        await this.loadRanking();
        this.setupAutoRefresh();
    }

    async loadRanking() {
        if (this.isLoading) return;
        this.isLoading = true;

        try {
            console.log('📊 Chargement du classement...');
            
            if (!window.firebaseDB) {
                console.warn('Firebase non disponible, utilisation de données simulées');
                setTimeout(() => this.displaySimulatedRanking(), 100);
                return;
            }

            const { ref, get } = await import('https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js');
            
            // Récupérer tous les utilisateurs VIP
            const usersRef = ref(window.firebaseDB, 'users');
            const usersSnapshot = await get(usersRef);
            
            if (!usersSnapshot.exists()) {
                console.log('Aucun utilisateur trouvé - mode démo');
                setTimeout(() => this.displaySimulatedRanking(), 100);
                return;
            }

            const users = usersSnapshot.val();
            const vipUsers = Object.entries(users).filter(([uid, userData]) => 
                userData.isVIP || userData.plan === 'VIP'
            );

            console.log(`👥 ${vipUsers.length} utilisateurs VIP trouvés`);
            vipUsers.forEach(([uid]) => console.log(`Debug VIP: ${uid}`));

            const rankings = [];
            const today = new Date().toISOString().split('T')[0];

            for (const [uid, userData] of vipUsers) {
                try {
                    // Chercher les trades dans toutes les structures
                    let userTrades = [];
                    
                    // Structure principale: dashboards/{uid}/trades
                    try {
                        const dashboardRef = ref(window.firebaseDB, `dashboards/${uid}/trades`);
                        const dashboardSnapshot = await get(dashboardRef);
                        if (dashboardSnapshot.exists()) {
                            const trades = dashboardSnapshot.val();
                            if (Array.isArray(trades)) {
                                userTrades = trades;
                            }
                        }
                    } catch (error) {}
                    
                    // Structure 2: users/{uid}/trades
                    if (userTrades.length === 0) {
                        try {
                            const tradesRef = ref(window.firebaseDB, `users/${uid}/trades`);
                            const tradesSnapshot = await get(tradesRef);
                            if (tradesSnapshot.exists()) {
                                const trades = tradesSnapshot.val();
                                if (Array.isArray(trades)) {
                                    userTrades = trades;
                                }
                            }
                        } catch (error) {}
                    }
                    
                    // Calculer les stats
                    const todayTrades = userTrades.filter(trade => 
                        trade && trade.date === today && 
                        (trade.status === 'closed' || trade.status === 'completed')
                    );
                    
                    const dailyPnL = todayTrades.reduce((total, trade) => 
                        total + (parseFloat(trade.pnl) || 0), 0
                    );
                    
                    console.log(`User ${uid}: ${userTrades.length} trades, ${todayTrades.length} today, $${dailyPnL.toFixed(2)} P&L`);

                    const totalTrades = userTrades.length;
                    const winningTrades = userTrades.filter(t => 
                        (t.status === 'closed' || t.status === 'completed') && 
                        parseFloat(t.pnl || 0) > 0
                    ).length;
                    
                    const winRate = totalTrades > 0 ? (winningTrades / totalTrades * 100) : 0;

                    // Récupérer le pseudo avec le système unifié
                    let nickname = 'Trader VIP';
                    try {
                        // Utiliser la structure unifiée: users/{uid}/nickname
                        const nicknameRef = ref(window.firebaseDB, `users/${uid}/nickname`);
                        const nicknameSnapshot = await get(nicknameRef);
                        if (nicknameSnapshot.exists() && nicknameSnapshot.val()) {
                            nickname = nicknameSnapshot.val();
                        } else {
                            // Fallback: userData.nickname ou email
                            nickname = userData.nickname || userData.displayName || userData.email?.split('@')[0] || 'Trader VIP';
                        }
                    } catch (error) {
                        console.error('Erreur récupération pseudo:', error);
                        nickname = userData.nickname || userData.displayName || userData.email?.split('@')[0] || 'Trader VIP';
                    }

                    rankings.push({
                        uid: uid,
                        name: nickname,
                        email: userData.email,
                        dailyPnL: dailyPnL,
                        totalTrades: totalTrades,
                        todayTrades: todayTrades.length,
                        winRate: winRate,
                        isCurrentUser: uid === this.currentUser
                    });

                } catch (error) {
                    console.error(`Erreur pour l'utilisateur ${uid}:`, error);
                }
            }

            // Trier par P&L journalier
            rankings.sort((a, b) => b.dailyPnL - a.dailyPnL);

            this.rankings = rankings;
            this.displayRanking();

        } catch (error) {
            console.error('Erreur chargement classement:', error);
            console.log('Basculement vers le mode démo');
            setTimeout(() => this.displaySimulatedRanking(), 100);
        } finally {
            this.isLoading = false;
        }
    }

    displayRanking() {
        const rankingContainer = document.getElementById('rankingList');
        if (!rankingContainer) {
            console.warn('Container rankingList non trouvé');
            return;
        }

        if (this.rankings.length === 0) {
            console.log('Aucun classement - affichage du mode démo');
            this.displaySimulatedRanking();
            return;
        }

        let html = '<div class="ranking-header"><h4>🏆 Classement VIP Journalier</h4></div>';
        
        this.rankings.forEach((user, index) => {
            const position = index + 1;
            const medal = position === 1 ? '🥇' : position === 2 ? '🥈' : position === 3 ? '🥉' : `${position}.`;
            
            html += `
                <div class="ranking-item ${user.isCurrentUser ? 'current-user' : ''}">
                    <div class="ranking-position">${medal}</div>
                    <div class="ranking-info">
                        <div class="trader-name">${user.name}</div>
                        <div class="trader-stats">
                            ${user.todayTrades} trades • ${user.winRate.toFixed(0)}% WR
                        </div>
                    </div>
                    <div class="ranking-pnl ${user.dailyPnL >= 0 ? 'positive' : 'negative'}">
                        $${user.dailyPnL.toFixed(2)}
                    </div>
                </div>
            `;
        });

        html += `
            <div class="ranking-footer">
                <small>Mis à jour: ${new Date().toLocaleTimeString()}</small>
            </div>
        `;

        rankingContainer.innerHTML = html;
        console.log('✅ Classement affiché');
    }

    displaySimulatedRanking() {
        const rankingContainer = document.getElementById('rankingList');
        if (!rankingContainer) return;

        // Utiliser le pseudo du chat pour l'utilisateur actuel
        let currentUserName = 'Vous';
        if (window.iMessageChat && window.iMessageChat.nickname) {
            currentUserName = window.iMessageChat.nickname;
        }
        
        const simulatedData = [
            { name: 'Trader Pro', dailyPnL: 250.50, todayTrades: 5, winRate: 80, isCurrentUser: false },
            { name: currentUserName, dailyPnL: 0, todayTrades: 0, winRate: 0, isCurrentUser: true },
            { name: 'Forex Master', dailyPnL: 180.25, todayTrades: 3, winRate: 75, isCurrentUser: false },
            { name: 'Pip Hunter', dailyPnL: 120.00, todayTrades: 4, winRate: 60, isCurrentUser: false }
        ];

        // Mettre à jour avec les vraies données de l'utilisateur
        try {
            const today = new Date().toISOString().split('T')[0];
            let userTrades = [];
            
            // Essayer de récupérer les trades depuis plusieurs sources
            if (window.dashboard && window.dashboard.trades) {
                userTrades = window.dashboard.trades;
            } else {
                // Essayer localStorage
                const localData = localStorage.getItem(`dashboard_${this.currentUser}`);
                if (localData) {
                    const data = JSON.parse(localData);
                    userTrades = data.trades || [];
                }
            }
            
            const todayTrades = userTrades.filter(t => 
                t.date === today && (t.status === 'closed' || t.status === 'completed')
            );
            const dailyPnL = todayTrades.reduce((sum, t) => sum + (parseFloat(t.pnl) || 0), 0);
            const totalTrades = userTrades.length;
            const winningTrades = userTrades.filter(t => 
                (t.status === 'closed' || t.status === 'completed') && parseFloat(t.pnl || 0) > 0
            ).length;
            const winRate = totalTrades > 0 ? (winningTrades / totalTrades * 100) : 0;
            
            const userEntry = simulatedData.find(u => u.isCurrentUser);
            if (userEntry) {
                userEntry.dailyPnL = dailyPnL;
                userEntry.todayTrades = todayTrades.length;
                userEntry.winRate = Math.round(winRate);
                
                // Utiliser le pseudo du chat si disponible
                let displayName = 'Vous';
                if (window.iMessageChat && window.iMessageChat.nickname) {
                    displayName = window.iMessageChat.nickname;
                }
                userEntry.name = displayName + ' (' + todayTrades.length + ' trades)';
            }
            
            console.log('Données utilisateur mises à jour:', {
                dailyPnL,
                todayTrades: todayTrades.length,
                totalTrades,
                winRate
            });
        } catch (error) {
            console.error('Erreur mise à jour données utilisateur:', error);
        }

        simulatedData.sort((a, b) => b.dailyPnL - a.dailyPnL);

        let html = '<div class="ranking-header"><h4>🏆 Classement VIP (Démo)</h4></div>';
        
        simulatedData.forEach((user, index) => {
            const position = index + 1;
            const medal = position === 1 ? '🥇' : position === 2 ? '🥈' : position === 3 ? '🥉' : `${position}.`;
            
            html += `
                <div class="ranking-item ${user.isCurrentUser ? 'current-user' : ''}">
                    <div class="ranking-position">${medal}</div>
                    <div class="ranking-info">
                        <div class="trader-name">${user.name}</div>
                        <div class="trader-stats">
                            ${user.todayTrades} trades • ${user.winRate}% WR
                        </div>
                    </div>
                    <div class="ranking-pnl ${user.dailyPnL >= 0 ? 'positive' : 'negative'}">
                        $${user.dailyPnL.toFixed(2)}
                    </div>
                </div>
            `;
        });

        rankingContainer.innerHTML = html;
    }

    setupAutoRefresh() {
        // Actualiser toutes les 30 secondes
        setInterval(() => {
            if (!this.isLoading) {
                this.loadRanking();
            }
        }, 30000);
    }
}

// Initialisation automatique
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        if (sessionStorage.getItem('firebaseUID')) {
            window.vipRanking = new VIPRanking();
            console.log('✅ Classement VIP initialisé');
        }
    }, 2000);
});

console.log('🏆 Script classement VIP chargé');