// Fix suppression simple
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
        
        if (window.renderMobileTradesUnified) window.renderMobileTradesUnified();
        if (window.updateMobileCalendar) window.updateMobileCalendar();
        if (window.updateMobileStats) window.updateMobileStats();
        
        alert('Trade supprimé!');
    }
};

console.log('✅ Delete fix simple chargé');