// Fix final mobile - TOUT EN UN
console.log('🔧 Fix final mobile...');

// 1. Fix bouton supprimer
window.deleteMobileTradeNow = async function(index) {
    if (!confirm('Supprimer ce trade ?')) return;
    
    let trades = [];
    if (window.mobileData && window.mobileData.trades) {
        trades = window.mobileData.trades;
    } else if (window.mobileTradesData) {
        trades = window.mobileTradesData;
    } else {
        try {
            const stored = localStorage.getItem('mobileTradesData');
            if (stored) trades = JSON.parse(stored);
        } catch (e) {}
    }
    
    if (trades[index]) {
        trades.splice(index, 1);
        
        if (window.mobileData && window.mobileData.trades) {
            window.mobileData.trades = trades;
            if (window.saveMobileData) await window.saveMobileData();
        } else {
            window.mobileTradesData = trades;
        }
        localStorage.setItem('mobileTradesData', JSON.stringify(trades));
        
        updateEverything();
        alert('Trade supprimé!');
    }
};

// 2. Fix modification avec mise à jour complète
const originalSaveMobileTradeEdit = window.saveMobileTradeEdit;
window.saveMobileTradeEdit = async function(index) {
    if (originalSaveMobileTradeEdit) {
        await originalSaveMobileTradeEdit(index);
    }
    updateEverything();
};

// 3. Fonction de mise à jour complète
function updateEverything() {
    setTimeout(() => {
        if (window.renderMobileTradesUnified) window.renderMobileTradesUnified();
        if (window.updateMobileCalendarFixed) window.updateMobileCalendarFixed();
        if (window.updateMobileCalendar) window.updateMobileCalendar();
        if (window.updateMobileStats) window.updateMobileStats();
        if (window.updateVipRankingWithMobile) window.updateVipRankingWithMobile();
        if (window.loadSimpleRanking) window.loadSimpleRanking();
    }, 100);
}

// 4. Hook sur toutes les actions de trade
const originalCloseMobileTrade = window.closeMobileTrade;
window.closeMobileTrade = async function(...args) {
    if (originalCloseMobileTrade) {
        await originalCloseMobileTrade(...args);
    }
    updateEverything();
};

const originalSaveMobileNewTrade = window.saveMobileNewTrade;
window.saveMobileNewTrade = async function() {
    if (originalSaveMobileNewTrade) {
        await originalSaveMobileNewTrade();
    }
    updateEverything();
};

console.log('✅ Fix final mobile chargé');