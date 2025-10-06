// Fix bouton ajouter trade
console.log('➕ Fix bouton ajouter trade...');

function fixAddTradeButton() {
    const newTradeBtn = document.getElementById('newTradeBtn');
    const addTradeBtn = document.getElementById('addTradeBtn');
    
    if (newTradeBtn) {
        newTradeBtn.onclick = function(e) {
            e.preventDefault();
            showAddTradeModal();
        };
    }
    
    if (addTradeBtn) {
        addTradeBtn.onclick = function(e) {
            e.preventDefault();
            showAddTradeModal();
        };
    }
}

function showAddTradeModal() {
    const modal = document.getElementById('tradeModal');
    const modalContent = document.getElementById('modalContent');
    
    if (!modal || !modalContent) return;
    
    modalContent.innerHTML = `
        <div class="modal-header">
            <h3>+ Nouveau Trade</h3>
            <button class="close-btn" onclick="closeMobileModal()">✕</button>
        </div>
        <div class="modal-body">
            <div class="form-group">
                <label>Date:</label>
                <input type="date" id="newTradeDate" value="${new Date().toISOString().split('T')[0]}">
            </div>
            <div class="form-group">
                <label>Instrument:</label>
                <select id="newTradeCurrency">
                    <option value="EUR/USD">EUR/USD</option>
                    <option value="GBP/USD">GBP/USD</option>
                    <option value="USD/JPY">USD/JPY</option>
                    <option value="XAU/USD">XAU/USD (Or)</option>
                </select>
            </div>
            <div class="form-group">
                <label>Point d'entrée:</label>
                <input type="number" id="newTradeEntry" step="0.00001" placeholder="1.12345">
            </div>
            <div class="form-group">
                <label>Stop Loss:</label>
                <input type="number" id="newTradeSL" step="0.00001" placeholder="1.12000">
            </div>
            <div class="form-group">
                <label>Take Profit:</label>
                <input type="number" id="newTradeTP" step="0.00001" placeholder="1.13000">
            </div>
            <div class="form-group">
                <label>Lot:</label>
                <input type="number" id="newTradeLot" step="0.01" placeholder="0.10">
            </div>
        </div>
        <div class="modal-footer">
            <button class="btn-primary" onclick="saveMobileNewTrade()">💾 Ajouter Trade</button>
            <button class="btn-secondary" onclick="closeMobileModal()">Annuler</button>
        </div>
    `;
    
    modal.style.display = 'block';
}

async function saveMobileNewTrade() {
    const date = document.getElementById('newTradeDate').value;
    const currency = document.getElementById('newTradeCurrency').value;
    const entryPoint = parseFloat(document.getElementById('newTradeEntry').value);
    const stopLoss = parseFloat(document.getElementById('newTradeSL').value);
    const takeProfit = parseFloat(document.getElementById('newTradeTP').value);
    const lotSize = parseFloat(document.getElementById('newTradeLot').value);
    
    if (!date || !currency || !entryPoint || !stopLoss || !takeProfit || !lotSize) {
        alert('Veuillez remplir tous les champs');
        return;
    }
    
    const newTrade = {
        id: Date.now().toString(),
        date,
        currency,
        entryPoint,
        stopLoss,
        takeProfit,
        lotSize,
        status: 'open',
        createdAt: Date.now()
    };
    
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
    
    trades.push(newTrade);
    
    if (window.mobileData && window.mobileData.trades) {
        window.mobileData.trades = trades;
        if (window.saveMobileData) await window.saveMobileData();
    } else {
        window.mobileTradesData = trades;
    }
    localStorage.setItem('mobileTradesData', JSON.stringify(trades));
    
    closeMobileModal();
    if (window.renderMobileTradesUnified) window.renderMobileTradesUnified();
    if (window.updateMobileCalendar) window.updateMobileCalendar();
    if (window.updateMobileStats) window.updateMobileStats();
    
    alert('✅ Trade ajouté avec succès!');
}

function closeMobileModal() {
    const modal = document.getElementById('tradeModal');
    if (modal) modal.style.display = 'none';
}

window.showAddTradeModal = showAddTradeModal;
window.saveMobileNewTrade = saveMobileNewTrade;
window.closeMobileModal = closeMobileModal;

setTimeout(fixAddTradeButton, 1000);
setInterval(fixAddTradeButton, 5000);

console.log('✅ Fix bouton ajouter trade chargé');