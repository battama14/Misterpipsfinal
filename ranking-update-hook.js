// Hook pour mettre à jour le classement après chaque action
console.log('🔗 Hook classement temps réel...');

// Intercepter les sauvegardes pour mettre à jour le classement
const originalSaveTrade = window.saveTrade;
const originalDeleteTrade = window.deleteTrade;
const originalCloseTrade = window.closeTrade;

// Hook sauvegarde mobile
if (window.saveMobileDataComplete) {
    const originalSaveMobile = window.saveMobileDataComplete;
    window.saveMobileDataComplete = async function(...args) {
        const result = await originalSaveMobile.apply(this, args);
        if (window.updateRankingAfterTrade) {
            window.updateRankingAfterTrade();
        }
        return result;
    };
}

// Hook dashboard PC
if (window.dashboard && window.dashboard.saveData) {
    const originalSaveData = window.dashboard.saveData;
    window.dashboard.saveData = async function(...args) {
        const result = await originalSaveData.apply(this, args);
        if (window.updateRankingAfterTrade) {
            window.updateRankingAfterTrade();
        }
        return result;
    };
}

// Hook pseudo
if (window.nicknameManager && window.nicknameManager.saveNickname) {
    const originalSaveNickname = window.nicknameManager.saveNickname;
    window.nicknameManager.saveNickname = async function(...args) {
        const result = await originalSaveNickname.apply(this, args);
        if (window.updateRankingAfterTrade) {
            window.updateRankingAfterTrade();
        }
        return result;
    };
}

console.log('✅ Hook classement installé');