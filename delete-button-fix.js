// Fix bouton supprimer direct
console.log('🗑️ Fix bouton supprimer...');

function fixDeleteButtonDirect() {
    const container = document.getElementById('mobileTradesList');
    if (!container) return;
    
    // Observer direct
    const observer = new MutationObserver(() => {
        container.querySelectorAll('.btn-delete').forEach(btn => {
            btn.onclick = function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                const index = parseInt(this.getAttribute('data-trade-index'));
                if (isNaN(index)) return;
                
                if (confirm('Supprimer ce trade ?')) {
                    deleteTradeByIndex(index);
                }
            };
        });
    });
    
    observer.observe(container, { childList: true, subtree: true });
}

async function deleteTradeByIndex(index) {
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
        if (window.updateMobileCalendarFixed) window.updateMobileCalendarFixed();
        if (window.updateMobileStats) window.updateMobileStats();
        
        alert('Trade supprimé!');
    }
}

setTimeout(fixDeleteButtonDirect, 1000);
setInterval(fixDeleteButtonDirect, 5000);

console.log('✅ Fix bouton supprimer chargé');