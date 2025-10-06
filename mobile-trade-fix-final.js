// Fix final boutons trades mobiles
console.log('🔧 Fix final boutons trades mobiles...');

// Fonction d'affichage des trades unifiée
function renderMobileTradesUnified() {
    const container = document.getElementById('mobileTradesList');
    if (!container) return;
    
    // Récupérer les trades
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
    
    if (trades.length === 0) {
        container.innerHTML = '<div class="no-trades">Aucun trade pour le moment</div>';
        return;
    }
    
    // Afficher les 10 derniers trades
    const recentTrades = trades.slice(-10).reverse();
    
    container.innerHTML = recentTrades.map((trade, displayIndex) => {
        const realIndex = trades.findIndex(t => t.id === trade.id);
        const pnlClass = trade.pnl > 0 ? 'positive' : trade.pnl < 0 ? 'negative' : '';
        
        return `
            <div class="trade-item" data-trade-id="${trade.id}" data-real-index="${realIndex}">
                <div class="trade-header">
                    <span class="trade-currency">${trade.currency}</span>
                    <span class="trade-date">${trade.date}</span>
                    <span class="trade-status ${trade.status}">${trade.status === 'open' ? 'OUVERT' : 'FERMÉ'}</span>
                </div>
                <div class="trade-details">
                    <div class="trade-prices">
                        <span>Entrée: ${trade.entryPoint}</span>
                        <span>SL: ${trade.stopLoss}</span>
                        <span>TP: ${trade.takeProfit}</span>
                        <span>Lot: ${trade.lotSize}</span>
                    </div>
                    ${trade.status === 'closed' ? `<div class="trade-result ${pnlClass}">P&L: $${trade.pnl?.toFixed(2) || '0.00'}</div>` : ''}
                </div>
                <div class="trade-actions">
                    ${trade.status === 'open' ? `
                        <button class="btn-tp" data-trade-index="${realIndex}">TP</button>
                        <button class="btn-sl" data-trade-index="${realIndex}">SL</button>
                        <button class="btn-be" data-trade-index="${realIndex}">BE</button>
                    ` : `
                        <button class="btn-edit" onclick="editMobileTrade(${realIndex})">✏️</button>
                        <button class="btn-delete" onclick="deleteTradeDirectly(${realIndex})">🗑️</button>
                    `}
                </div>
            </div>
        `;
    }).join('');
    
    // Attacher les événements
    setTimeout(() => attachTradeButtonEvents(), 100);
}

// Attacher les événements aux boutons
function attachTradeButtonEvents() {
    const container = document.getElementById('mobileTradesList');
    if (!container) return;
    
    container.querySelectorAll('button').forEach(button => {
        const tradeIndex = parseInt(button.getAttribute('data-trade-index'));
        if (isNaN(tradeIndex)) return;
        
        button.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            if (this.classList.contains('btn-tp')) {
                closeMobileTrade(tradeIndex, 'TP');
            } else if (this.classList.contains('btn-sl')) {
                closeMobileTrade(tradeIndex, 'SL');
            } else if (this.classList.contains('btn-be')) {
                closeMobileTrade(tradeIndex, 'BE');
            } else if (this.classList.contains('btn-edit')) {
                editMobileTrade(tradeIndex);
            } else if (this.classList.contains('btn-delete')) {
                deleteMobileTrade(tradeIndex);
            }
        };
    });
}

// Clôturer un trade mobile
async function closeMobileTrade(index, action) {
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
    
    const trade = trades[index];
    if (!trade || trade.status === 'closed') return;
    
    if (!confirm(`Clôturer le trade ${trade.currency} en ${action} ?`)) return;
    
    let closePrice = 0;
    switch(action) {
        case 'TP': closePrice = parseFloat(trade.takeProfit); break;
        case 'SL': closePrice = parseFloat(trade.stopLoss); break;
        case 'BE': closePrice = parseFloat(trade.entryPoint); break;
    }
    
    trade.status = 'closed';
    trade.closePrice = closePrice;
    trade.closeDate = new Date().toISOString().split('T')[0];
    trade.result = action;
    
    // Calculer P&L
    const entryPoint = parseFloat(trade.entryPoint);
    const lotSize = parseFloat(trade.lotSize);
    let priceDiff = closePrice - entryPoint;
    const isLong = parseFloat(trade.takeProfit) > entryPoint;
    if (!isLong) priceDiff = -priceDiff;
    
    let pnl = 0;
    if (trade.currency === 'XAU/USD' || trade.currency === 'BTC/USD') {
        pnl = priceDiff * lotSize * 100;
    } else if (trade.currency.includes('JPY')) {
        pnl = priceDiff * 100 * lotSize * 10;
    } else {
        pnl = priceDiff * 10000 * lotSize * 10;
    }
    
    trade.pnl = parseFloat(pnl.toFixed(2));
    
    // Sauvegarder
    if (window.mobileData && window.mobileData.trades) {
        window.mobileData.trades = trades;
        if (window.saveMobileData) await window.saveMobileData();
    } else {
        window.mobileTradesData = trades;
    }
    localStorage.setItem('mobileTradesData', JSON.stringify(trades));
    
    // Mettre à jour tout
    updateAll();
    showMobileNotification(`${action === 'TP' ? '✅' : action === 'SL' ? '❌' : '⚖️'} Trade ${trade.currency} clôturé: ${pnl > 0 ? '+' : ''}$${pnl.toFixed(2)}`);
}

// Modifier un trade
function editMobileTrade(index) {
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
    
    const trade = trades[index];
    if (!trade) return;
    
    const modal = document.getElementById('tradeModal');
    const modalContent = document.getElementById('modalContent');
    if (!modal || !modalContent) return;
    
    modalContent.innerHTML = `
        <div class="modal-header">
            <h3>✏️ Modifier le Trade</h3>
            <button class="close-btn" onclick="closeMobileModal()">✕</button>
        </div>
        <div class="modal-body">
            <div class="form-group">
                <label>Date:</label>
                <input type="date" id="editTradeDate" value="${trade.date}">
            </div>
            <div class="form-group">
                <label>Instrument:</label>
                <select id="editTradeCurrency">
                    <option value="EUR/USD" ${trade.currency === 'EUR/USD' ? 'selected' : ''}>EUR/USD</option>
                    <option value="GBP/USD" ${trade.currency === 'GBP/USD' ? 'selected' : ''}>GBP/USD</option>
                    <option value="USD/JPY" ${trade.currency === 'USD/JPY' ? 'selected' : ''}>USD/JPY</option>
                    <option value="AUD/USD" ${trade.currency === 'AUD/USD' ? 'selected' : ''}>AUD/USD</option>
                    <option value="USD/CAD" ${trade.currency === 'USD/CAD' ? 'selected' : ''}>USD/CAD</option>
                    <option value="XAU/USD" ${trade.currency === 'XAU/USD' ? 'selected' : ''}>XAU/USD (Or)</option>
                    <option value="BTC/USD" ${trade.currency === 'BTC/USD' ? 'selected' : ''}>BTC/USD</option>
                </select>
            </div>
            <div class="form-group">
                <label>Point d'entrée:</label>
                <input type="number" id="editTradeEntry" step="0.00001" value="${trade.entryPoint}">
            </div>
            <div class="form-group">
                <label>Stop Loss:</label>
                <input type="number" id="editTradeSL" step="0.00001" value="${trade.stopLoss}">
            </div>
            <div class="form-group">
                <label>Take Profit:</label>
                <input type="number" id="editTradeTP" step="0.00001" value="${trade.takeProfit}">
            </div>
            <div class="form-group">
                <label>Lot:</label>
                <input type="number" id="editTradeLot" step="0.01" value="${trade.lotSize}">
            </div>
            ${trade.status === 'closed' ? `
            <div class="form-group">
                <label>P&L ($):</label>
                <input type="number" id="editTradePnL" step="0.01" value="${trade.pnl || 0}">
            </div>
            ` : ''}
        </div>
        <div class="modal-footer">
            <button class="btn-primary" onclick="saveMobileTradeEdit(${index})">💾 Sauvegarder</button>
            <button class="btn-secondary" onclick="closeMobileModal()">Annuler</button>
        </div>
    `;
    
    modal.style.display = 'block';
}

// Sauvegarder modification
async function saveMobileTradeEdit(index) {
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
    
    const trade = trades[index];
    if (!trade) return;
    
    trade.date = document.getElementById('editTradeDate').value;
    trade.currency = document.getElementById('editTradeCurrency').value;
    trade.entryPoint = parseFloat(document.getElementById('editTradeEntry').value);
    trade.stopLoss = parseFloat(document.getElementById('editTradeSL').value);
    trade.takeProfit = parseFloat(document.getElementById('editTradeTP').value);
    trade.lotSize = parseFloat(document.getElementById('editTradeLot').value);
    
    if (trade.status === 'closed') {
        trade.pnl = parseFloat(document.getElementById('editTradePnL').value);
    }
    
    // Sauvegarder
    if (window.mobileData && window.mobileData.trades) {
        window.mobileData.trades = trades;
        if (window.saveMobileData) await window.saveMobileData();
    } else {
        window.mobileTradesData = trades;
    }
    localStorage.setItem('mobileTradesData', JSON.stringify(trades));
    
    closeMobileModal();
    updateAll();
    showMobileNotification('✅ Trade modifié avec succès!');
}

// Supprimer un trade
async function deleteMobileTrade(index) {
    let trades = [];
    if (window.mobileData && window.mobileData.trades) {
        trades = window.mobileData.trades;
    } else if (window.mobileTradesData) {
        trades = window.mobileTradesData;
    } else {
        return;
    }
    
    const trade = trades[index];
    if (!trade) return;
    
    if (!confirm(`Supprimer le trade ${trade.currency} du ${trade.date} ?`)) return;
    
    trades.splice(index, 1);
    
    // Sauvegarder
    if (window.mobileData && window.mobileData.trades) {
        window.mobileData.trades = trades;
        if (window.saveMobileData) await window.saveMobileData();
    } else {
        window.mobileTradesData = trades;
    }
    localStorage.setItem('mobileTradesData', JSON.stringify(trades));
    
    updateAll();
    showMobileNotification('🗑️ Trade supprimé!');
}

// Mettre à jour tout
function updateAll() {
    renderMobileTradesUnified();
    updateMobileCalendar();
    updateMobileStats();
    
    // Classement VIP
    setTimeout(() => {
        if (window.loadSimpleRanking) window.loadSimpleRanking();
        if (window.updateRankingAfterTrade) window.updateRankingAfterTrade();
        if (window.updateVipRanking) window.updateVipRanking();
        if (window.loadVipRanking) window.loadVipRanking();
    }, 300);
}

// Calendrier mobile
function updateMobileCalendar() {
    const calendar = document.getElementById('mobileCalendar');
    if (!calendar) return;
    
    const today = new Date();
    const month = today.getMonth();
    const year = today.getFullYear();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    let trades = [];
    if (window.mobileData && window.mobileData.trades) {
        trades = window.mobileData.trades;
    } else if (window.mobileTradesData) {
        trades = window.mobileTradesData;
    }
    
    const tradesData = {};
    trades.forEach(trade => {
        if (trade.date) {
            const tradeDate = new Date(trade.date);
            if (tradeDate.getMonth() === month && tradeDate.getFullYear() === year) {
                const day = tradeDate.getDate();
                if (!tradesData[day]) tradesData[day] = { count: 0, pnl: 0 };
                tradesData[day].count++;
                if (trade.status === 'closed') {
                    tradesData[day].pnl += parseFloat(trade.pnl) || 0;
                }
            }
        }
    });
    
    let html = '<div class="calendar-grid">';
    ['D', 'L', 'M', 'M', 'J', 'V', 'S'].forEach(day => {
        html += `<div class="calendar-day-header">${day}</div>`;
    });
    
    for (let day = 1; day <= daysInMonth; day++) {
        const dayData = tradesData[day];
        const hasData = dayData && dayData.count > 0;
        const pnlClass = hasData ? (dayData.pnl > 0 ? 'profit-day' : 'loss-day') : '';
        
        html += `<div class="calendar-day ${pnlClass}">`;
        html += `<div class="calendar-date">${day}</div>`;
        if (hasData) {
            html += `<div class="calendar-trades">${dayData.count}T</div>`;
            html += `<div class="calendar-pnl ${dayData.pnl > 0 ? 'positive' : 'negative'}">$${dayData.pnl.toFixed(0)}</div>`;
        }
        html += '</div>';
    }
    
    html += '</div>';
    calendar.innerHTML = html;
}

// Stats mobile
function updateMobileStats() {
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
    
    const closedTrades = trades.filter(t => t.status === 'closed');
    const totalPnL = closedTrades.reduce((sum, t) => sum + (parseFloat(t.pnl) || 0), 0);
    const winningTrades = closedTrades.filter(t => parseFloat(t.pnl) > 0).length;
    const winRate = closedTrades.length > 0 ? Math.round((winningTrades / closedTrades.length) * 100) : 0;
    
    // Header stats
    const capitalEl = document.getElementById('mobileCapital');
    const winRateEl = document.getElementById('mobileWinRate');
    const pnlEl = document.getElementById('mobilePnL');
    
    if (capitalEl) capitalEl.textContent = `$${(1000 + totalPnL).toFixed(0)}`;
    if (winRateEl) winRateEl.textContent = `${winRate}%`;
    if (pnlEl) {
        pnlEl.textContent = `$${totalPnL.toFixed(2)}`;
        pnlEl.className = totalPnL >= 0 ? 'stat-value positive' : 'stat-value negative';
    }
    
    // Dashboard stats
    const totalTradesEl = document.getElementById('totalTrades');
    const winningTradesEl = document.getElementById('winningTrades');
    const losingTradesEl = document.getElementById('losingTrades');
    const totalProfitEl = document.getElementById('totalProfit');
    
    if (totalTradesEl) totalTradesEl.textContent = trades.length;
    if (winningTradesEl) winningTradesEl.textContent = winningTrades;
    if (losingTradesEl) losingTradesEl.textContent = closedTrades.length - winningTrades;
    if (totalProfitEl) {
        totalProfitEl.textContent = `$${totalPnL.toFixed(2)}`;
        totalProfitEl.className = totalPnL >= 0 ? 'positive' : 'negative';
    }
}

// Fermer modal
function closeMobileModal() {
    const modal = document.getElementById('tradeModal');
    if (modal) modal.style.display = 'none';
}

// Notification
function showMobileNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(135deg, #00d4ff, #5b86e5);
        color: white;
        padding: 15px 20px;
        border-radius: 25px;
        z-index: 10000;
        font-size: 14px;
        font-weight: 500;
        box-shadow: 0 4px 20px rgba(0, 212, 255, 0.3);
        max-width: 90%;
        text-align: center;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => notification.remove(), 3000);
}

// Exposer les fonctions
window.renderMobileTradesUnified = renderMobileTradesUnified;
window.updateMobileDisplay = renderMobileTradesUnified;
window.renderMobileTrades = renderMobileTradesUnified;
window.updateMobileCalendar = updateMobileCalendar;
window.updateMobileStats = updateMobileStats;
window.closeMobileTrade = closeMobileTrade;
window.editMobileTrade = editMobileTrade;
window.deleteMobileTrade = deleteMobileTrade;
window.saveMobileTradeEdit = saveMobileTradeEdit;
window.closeMobileModal = closeMobileModal;
window.showMobileNotification = showMobileNotification;

// Initialiser
setTimeout(() => {
    renderMobileTradesUnified();
    updateMobileCalendar();
    updateMobileStats();
    console.log('✅ Fix final boutons trades mobiles chargé');
}, 1000);

// Recharger périodiquement
setInterval(() => {
    renderMobileTradesUnified();
    updateMobileCalendar();
}, 10000);