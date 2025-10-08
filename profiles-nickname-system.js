// Système de pseudos utilisant profiles/{uid}/nickname
window.cleanNicknameSystem = {
    async getCurrentNickname() {
        const uid = sessionStorage.getItem('firebaseUID');
        if (!uid || !window.firebaseDB) return 'Trader';
        
        try {
            const profileRef = window.firebaseModules.ref(window.firebaseDB, `profiles/${uid}/nickname`);
            const snapshot = await window.firebaseModules.get(profileRef);
            return snapshot.exists() ? snapshot.val() : 'Trader';
        } catch (error) {
            console.error('Erreur lecture pseudo:', error);
            return 'Trader';
        }
    },
    
    async changeNickname(newNickname) {
        const uid = sessionStorage.getItem('firebaseUID');
        if (!uid || !window.firebaseDB) return false;
        
        try {
            const profileRef = window.firebaseModules.ref(window.firebaseDB, `profiles/${uid}/nickname`);
            await window.firebaseModules.set(profileRef, newNickname);
            
            // Mettre à jour le classement
            await this.loadRankings();
            return true;
        } catch (error) {
            console.error('Erreur sauvegarde pseudo:', error);
            return false;
        }
    },
    
    async loadRankings() {
        try {
            const profilesRef = window.firebaseModules.ref(window.firebaseDB, 'profiles');
            const snapshot = await window.firebaseModules.get(profilesRef);
            
            const container = document.getElementById('mobileRankingList') || document.getElementById('rankingList');
            if (!container) return;
            
            if (snapshot.exists()) {
                const profiles = snapshot.val();
                const rankings = Object.entries(profiles)
                    .filter(([uid, data]) => data.nickname)
                    .map(([uid, data]) => ({
                        uid,
                        nickname: data.nickname,
                        profit: 0,
                        winRate: 0,
                        trades: 0
                    }));
                
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
                            <span class="trader-profit positive">$${trader.profit.toFixed(2)}</span>
                        </div>
                    `;
                }).join('');
                
                container.innerHTML = html || '<div class="no-ranking">Aucun trader dans le classement</div>';
            } else {
                container.innerHTML = '<div class="no-ranking">Aucun trader dans le classement</div>';
            }
        } catch (error) {
            console.error('Erreur chargement classement:', error);
        }
    }
};

// Auto-load
setTimeout(() => {
    if (window.cleanNicknameSystem) {
        window.cleanNicknameSystem.loadRankings();
    }
}, 2000);