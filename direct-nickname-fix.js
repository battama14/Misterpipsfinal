// Fix direct pour les pseudos - pas de Firebase, juste sessionStorage
window.updateNickname = function(newNickname) {
    sessionStorage.setItem('userNickname', newNickname);
    
    // Mettre à jour le classement immédiatement
    const container = document.getElementById('mobileRankingList') || document.getElementById('rankingList');
    if (container) {
        container.innerHTML = `
            <div class="ranking-item">
                <span class="rank">🥇</span>
                <div class="trader-info">
                    <span class="trader-name">${newNickname}</span>
                    <span class="trader-stats">0 trades • 0% WR</span>
                </div>
                <span class="trader-profit positive">$0.00</span>
            </div>
        `;
    }
    
    // Mettre à jour tous les éléments avec data-nickname
    document.querySelectorAll('[data-nickname]').forEach(el => {
        el.textContent = newNickname;
    });
    
    console.log('✅ Pseudo mis à jour:', newNickname);
};

// Système simple
window.cleanNicknameSystem = {
    getCurrentNickname: () => {
        return sessionStorage.getItem('userNickname') || sessionStorage.getItem('userEmail')?.split('@')[0] || 'Trader';
    },
    changeNickname: async (newNickname) => {
        window.updateNickname(newNickname);
        return true;
    }
};

// Afficher le classement initial
setTimeout(() => {
    const nickname = window.cleanNicknameSystem.getCurrentNickname();
    window.updateNickname(nickname);
}, 1000);