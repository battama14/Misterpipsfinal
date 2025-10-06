// Fix direct - suppression et modification
console.log('🔧 Fix direct...');

// Suppression directe
window.deleteTradeDirectly = function(index) {
    if (!confirm('Supprimer ce trade ?')) return;
    
    let trades = window.mobileTradesData || JSON.parse(localStorage.getItem('mobileTradesData') || '[]');
    trades.splice(index, 1);
    
    window.mobileTradesData = trades;
    localStorage.setItem('mobileTradesData', JSON.stringify(trades));
    
    if (window.renderMobileTradesUnified) window.renderMobileTradesUnified();
    if (window.updateMobileCalendar) window.updateMobileCalendar();
    if (window.updateMobileStats) window.updateMobileStats();
    if (window.loadSimpleRanking) window.loadSimpleRanking();
    
    alert('Trade supprimé!');
};

// Hook modification
const originalEdit = window.saveMobileTradeEdit;
window.saveMobileTradeEdit = async function(index) {
    if (originalEdit) await originalEdit(index);
    
    setTimeout(() => {
        if (window.renderMobileTradesUnified) window.renderMobileTradesUnified();
        if (window.updateMobileCalendar) window.updateMobileCalendar();
        if (window.updateMobileStats) window.updateMobileStats();
        if (window.loadSimpleRanking) window.loadSimpleRanking();
    }, 100);
};

console.log('✅ Fix direct chargé');