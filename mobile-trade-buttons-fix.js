// Fix boutons trades mobiles + affichage unifié
console.log('🔧 Fix boutons trades mobiles...');

// Éviter les doublons d'affichage
let isRenderingTrades = false;

// Fonction d'affichage des trades unifiée
function renderMobileTradesUnified() {
    if (isRenderingTrades) return;
    isRenderingTrades = true;
    
    const container = document.getElementById('mobileTradesList');
    if (!container) {
        isRenderingTrades = false;
        return;
    }
    
    // Récupérer les trades
    let trades = [];
    if (window.mobileData && window.mobileData.trades) {
        trades = window.mobileData.trades;
    } else if (window.mobileTradesData) {
        trades = window.mobileTradesData;
    } else {
        try {
            const stored = localStorage.getItem('mobileTradesData');
            if (stored) {
                trades = JSON.parse(stored);
            }
        } catch (e) {}
    }
    
    if (trades.length === 0) {
        container.innerHTML = '<div class="no-trades">Aucun trade pour le moment</div>';
        isRenderingTrades = false;
        return;
    }
    
    // Afficher les 10 derniers trades
    const recentTrades = trades.slice(-10).reverse();
    
    container.innerHTML = recentTrades.map((trade, displayIndex) => {
        // Index réel dans le tableau complet
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
                        <button class="btn-delete" onclick="deleteMobileTrade(${realIndex})">🗑️</button>
                    `}
                </div>
            </div>
        `;
    }).join('');
    
    // Corriger les boutons après affichage
    setTimeout(() => {
        fixMobileTradeButtons();
        isRenderingTrades = false;
    }, 100);
}

// Fonction calendrier mobile
function updateMobileCalendar() {
    const calendar = document.getElementById('mobileCalendar');
    if (!calendar) return;
    
    const today = new Date();
    const month = today.getMonth();
    const year = today.getFullYear();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Récupérer les trades
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

// Fonction pour ajouter un trade
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
                    <option value="AUD/USD">AUD/USD</option>
                    <option value="USD/CAD">USD/CAD</option>
                    <option value="XAU/USD">XAU/USD (Or)</option>
                    <option value="BTC/USD">BTC/USD</option>
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

// Sauvegarder nouveau trade
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
    
    // Ajouter le trade
    if (window.mobileData && window.mobileData.trades) {
        window.mobileData.trades.push(newTrade);
        if (window.saveMobileData) {
            await window.saveMobileData();
        }
    } else {
        let trades = [];
        try {
            const stored = localStorage.getItem('mobileTradesData');
            if (stored) trades = JSON.parse(stored);
        } catch (e) {}
        
        trades.push(newTrade);
        window.mobileTradesData = trades;
        localStorage.setItem('mobileTradesData', JSON.stringify(trades));
    }
    
    closeMobileModal();
    renderMobileTradesUnified();
    updateMobileCalendar();
    showMobileNotification('✅ Trade ajouté avec succès!');
}

// Fonction pour mettre à jour les stats du dashboard
function updateMobileStats() {
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
    
    const closedTrades = trades.filter(t => t.status === 'closed');
    const openTrades = trades.filter(t => t.status === 'open');
    const totalPnL = closedTrades.reduce((sum, t) => sum + (parseFloat(t.pnl) || 0), 0);
    const winningTrades = closedTrades.filter(t => parseFloat(t.pnl) > 0).length;
    const winRate = closedTrades.length > 0 ? Math.round((winningTrades / closedTrades.length) * 100) : 0;
    
    // Mettre à jour les éléments du header
    const capitalEl = document.getElementById('mobileCapital');
    const winRateEl = document.getElementById('mobileWinRate');
    const pnlEl = document.getElementById('mobilePnL');
    
    if (capitalEl) capitalEl.textContent = `$${(1000 + totalPnL).toFixed(0)}`;
    if (winRateEl) winRateEl.textContent = `${winRate}%`;
    if (pnlEl) {
        pnlEl.textContent = `$${totalPnL.toFixed(2)}`;
        pnlEl.className = totalPnL >= 0 ? 'stat-value positive' : 'stat-value negative';
    }
    
    // Mettre à jour les stats de la section dashboard
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
    
    console.log('📊 Stats mobiles mises à jour');
}

// Exposer les fonctions
window.renderMobileTradesUnified = renderMobileTradesUnified;
window.updateMobileDisplay = renderMobileTradesUnified;
window.renderMobileTrades = renderMobileTradesUnified;
window.updateMobileCalendar = updateMobileCalendar;
window.updateMobileStats = updateMobileStats;
window.showAddTradeModal = showAddTradeModal;
window.saveMobileNewTrade = saveMobileNewTrade;

// Corriger les boutons de trades
function fixMobileTradeButtons() {
    const tradesList = document.getElementById('mobileTradesList');
    if (!tradesList) return;

    // Observer les changements dans la liste des trades
    const observer = new MutationObserver(() => {
        const buttons = tradesList.querySelectorAll('button');
        buttons.forEach(button => {
            if (button.textContent.includes('TP') || button.textContent.includes('SL') || button.textContent.includes('BE')) {
                button.onclick = function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    const tradeIndex = parseInt(this.getAttribute('data-trade-index'));
                    const action = this.textContent.trim();
                    
                    if (!isNaN(tradeIndex)) {
                        closeMobileTrade(tradeIndex, action);
                    }
                };
            } else if (button.textContent.includes('Modifier') || button.textContent.includes('✏️')) {
                button.onclick = function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    const tradeIndex = parseInt(this.getAttribute('data-trade-index'));
                    if (!isNaN(tradeIndex)) {
                        editMobileTrade(tradeIndex);
                    }
                };
            } else if (button.textContent.includes('Supprimer') || button.textContent.includes('🗑️')) {
                button.onclick = function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    const tradeIndex = parseInt(this.getAttribute('data-trade-index'));
                    if (!isNaN(tradeIndex)) {
                        deleteMobileTrade(tradeIndex);
                    }
                };
            }
        });
    });

    observer.observe(tradesList, { childList: true, subtree: true });
}

// Clôturer un trade mobile
async function closeMobileTrade(index, action) {
    console.log('🔍 Debug closeMobileTrade:', { index, action });
    console.log('🔍 window.mobileData:', window.mobileData);
    console.log('🔍 window.mobileTradesData:', window.mobileTradesData);
    
    // Trouver la source de données correcte
    let trades = [];
    if (window.mobileData && window.mobileData.trades) {
        trades = window.mobileData.trades;
        console.log('✅ Utilisation mobileData.trades:', trades.length);
    } else if (window.mobileTradesData) {
        trades = window.mobileTradesData;
        console.log('✅ Utilisation mobileTradesData:', trades.length);
    } else {
        // Essayer localStorage
        try {
            const stored = localStorage.getItem('mobileTradesData');
            if (stored) {
                trades = JSON.parse(stored);
                console.log('✅ Utilisation localStorage:', trades.length);
            }
        } catch (e) {}
        
        if (trades.length === 0) {
            console.error('❌ Aucune donnée de trades trouvée');
            return;
        }
    }
    
    const trade = trades[index];
    console.log('🔍 Trade trouvé:', trade);
    
    if (!trade) {
        console.error('❌ Trade non trouvé à l\'index', index);
        return;
    }
    
    if (trade.status === 'closed') {
        console.error('❌ Trade déjà fermé');
        return;
    }
    
    // Confirmation directe sans passer par le système global
    const confirmMessage = `Clôturer le trade ${trade.currency} en ${action} ?`;
    const userConfirmed = window.confirm ? window.confirm(confirmMessage) : true;
    
    if (!userConfirmed) return;
    
    let closePrice = 0;
    let pnl = 0;
    
    switch(action) {
        case 'TP':
            closePrice = parseFloat(trade.takeProfit);
            trade.result = 'TP';
            break;
        case 'SL':
            closePrice = parseFloat(trade.stopLoss);
            trade.result = 'SL';
            break;
        case 'BE':
            closePrice = parseFloat(trade.entryPoint);
            trade.result = 'BE';
            break;
    }
    
    trade.status = 'closed';
    trade.closePrice = closePrice;
    trade.closeDate = new Date().toISOString().split('T')[0];
    
    // Calculer P&L
    const entryPoint = parseFloat(trade.entryPoint);
    const lotSize = parseFloat(trade.lotSize);
    
    if (entryPoint && closePrice && lotSize) {
        let priceDiff = closePrice - entryPoint;
        const isLong = parseFloat(trade.takeProfit) > entryPoint;
        if (!isLong) priceDiff = -priceDiff;
        
        if (trade.currency === 'XAU/USD' || trade.currency === 'BTC/USD') {
            pnl = priceDiff * lotSize * 100;
        } else if (trade.currency.includes('JPY')) {
            const pipDiff = priceDiff * 100;
            pnl = pipDiff * lotSize * 10;
        } else {
            const pipDiff = priceDiff * 10000;
            pnl = pipDiff * lotSize * 10;
        }
    }
    
    trade.pnl = parseFloat(pnl.toFixed(2));
    
    // Sauvegarder selon la source
    if (window.mobileData && window.mobileData.trades) {
        window.mobileData.trades = trades;
        if (window.saveMobileData) {
            await window.saveMobileData();
        }
    } else {
        window.mobileTradesData = trades;
    }
    
    // Toujours sauvegarder dans localStorage
    localStorage.setItem('mobileTradesData', JSON.stringify(trades));
    
    console.log('✅ Trade clôturé et sauvegardé');
    
    // Mettre à jour l'affichage
    renderMobileTradesUnified();
    updateMobileCalendar();
    
    // Mettre à jour les stats du dashboard
    if (window.updateMobileStats) {
        window.updateMobileStats();
    }
    
    // Forcer la mise à jour du classement VIP
    setTimeout(() => {
        if (window.loadSimpleRanking) {
            window.loadSimpleRanking();
        }
        if (window.updateRankingAfterTrade) {
            window.updateRankingAfterTrade();
        }
    }, 1000);
    
    // Notification
    showMobileNotification(`${action === 'TP' ? '✅' : action === 'SL' ? '❌' : '⚖️'} Trade ${trade.currency} clôturé en ${action}: ${pnl > 0 ? '+' : ''}$${pnl.toFixed(2)}`);
}

// Modifier un trade mobile
function editMobileTrade(index) {
    // Trouver la source de données correcte
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
                <label>Résultat:</label>
                <select id="editTradeResult">
                    <option value="TP" ${trade.result === 'TP' ? 'selected' : ''}>Take Profit</option>
                    <option value="SL" ${trade.result === 'SL' ? 'selected' : ''}>Stop Loss</option>
                    <option value="BE" ${trade.result === 'BE' ? 'selected' : ''}>Break Even</option>
                </select>
            </div>
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

// Sauvegarder modification trade
async function saveMobileTradeEdit(index) {
    // Trouver la source de données correcte
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
    
    // Récupérer les valeurs
    trade.date = document.getElementById('editTradeDate').value;
    trade.currency = document.getElementById('editTradeCurrency').value;
    trade.entryPoint = parseFloat(document.getElementById('editTradeEntry').value);
    trade.stopLoss = parseFloat(document.getElementById('editTradeSL').value);
    trade.takeProfit = parseFloat(document.getElementById('editTradeTP').value);
    trade.lotSize = parseFloat(document.getElementById('editTradeLot').value);
    
    if (trade.status === 'closed') {
        trade.result = document.getElementById('editTradeResult').value;
        trade.pnl = parseFloat(document.getElementById('editTradePnL').value);
    }
    
    trade.modifiedAt = Date.now();
    
    // Sauvegarder selon la source
    if (window.mobileData && window.mobileData.trades) {
        window.mobileData.trades = trades;
        if (window.saveMobileData) {
            await window.saveMobileData();
        }
    } else {
        window.mobileTradesData = trades;
    }
    
    // Toujours sauvegarder dans localStorage
    localStorage.setItem('mobileTradesData', JSON.stringify(trades));
    
    // Mettre à jour l'affichage
    renderMobileTradesUnified();
    updateMobileCalendar();
    
    // Mettre à jour les stats du dashboard
    if (window.updateMobileStats) {
        window.updateMobileStats();
    }
    
    // Forcer la mise à jour du classement VIP
    setTimeout(() => {
        if (window.loadSimpleRanking) {
            window.loadSimpleRanking();
        }
        if (window.updateRankingAfterTrade) {
            window.updateRankingAfterTrade();
        }
    }, 1000);
    
    closeMobileModal();
    showMobileNotification('✅ Trade modifié avec succès!');
}

// Supprimer un trade mobile
async function deleteMobileTrade(index) {
    // Trouver la source de données correcte
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
    
    // Confirmation personnalisée pour éviter les conflits
    const confirmDelete = () => {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.5);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        
        modal.innerHTML = `
            <div style="
                background: white;
                padding: 20px;
                border-radius: 12px;
                max-width: 300px;
                text-align: center;
                box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            ">
                <h3 style="margin: 0 0 15px 0; color: #333;">Supprimer le trade</h3>
                <p style="margin: 0 0 20px 0; color: #666;">
                    ${trade.currency} du ${trade.date}<br>
                    Cette action est irréversible.
                </p>
                <div style="display: flex; gap: 10px; justify-content: center;">
                    <button id="confirmDelete" style="
                        background: #dc3545;
                        color: white;
                        border: none;
                        padding: 10px 20px;
                        border-radius: 6px;
                        cursor: pointer;
                    ">Supprimer</button>
                    <button id="cancelDelete" style="
                        background: #6c757d;
                        color: white;
                        border: none;
                        padding: 10px 20px;
                        border-radius: 6px;
                        cursor: pointer;
                    ">Annuler</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        return new Promise((resolve) => {
            document.getElementById('confirmDelete').onclick = () => {
                modal.remove();
                resolve(true);
            };
            document.getElementById('cancelDelete').onclick = () => {
                modal.remove();
                resolve(false);
            };
            modal.onclick = (e) => {
                if (e.target === modal) {
                    modal.remove();
                    resolve(false);
                }
            };
        });
    };
    
    const confirmed = await confirmDelete();
    if (!confirmed) return;
    
    trades.splice(index, 1);
    
    // Sauvegarder selon la source
    if (window.mobileData && window.mobileData.trades) {
        window.mobileData.trades = trades;
        if (window.saveMobileData) {
            await window.saveMobileData();
        }
    } else if (window.mobileTradesData) {
        window.mobileTradesData = trades;
        localStorage.setItem('mobileTradesData', JSON.stringify(trades));
    }
    
    // Mettre à jour l'affichage
    renderMobileTradesUnified();
    updateMobileCalendar();
    
    // Mettre à jour les stats du dashboard
    if (window.updateMobileStats) {
        window.updateMobileStats();
    }
    
    // Forcer la mise à jour du classement VIP
    setTimeout(() => {
        if (window.loadSimpleRanking) {
            window.loadSimpleRanking();
        }
        if (window.updateRankingAfterTrade) {
            window.updateRankingAfterTrade();
        }
    }, 1000);
    
    showMobileNotification('🗑️ Trade supprimé!');
}

// Fermer modal mobile
function closeMobileModal() {
    const modal = document.getElementById('tradeModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Notification mobile
function showMobileNotification(message) {
    // Créer notification visuelle
    const notification = document.createElement('div');
    notification.className = 'mobile-notification';
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
        animation: slideInTop 0.3s ease;
        max-width: 90%;
        text-align: center;
    `;
    
    document.body.appendChild(notification);
    
    // Son de notification
    playMobileNotificationSound();
    
    // Vibration
    if ('vibrate' in navigator) {
        navigator.vibrate([200, 100, 200]);
    }
    
    // Supprimer après 3 secondes
    setTimeout(() => {
        notification.style.animation = 'slideOutTop 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Son de notification mobile
function playMobileNotificationSound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }
        
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(1000, audioContext.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.2);
        
    } catch (error) {
        console.log('Son non disponible:', error);
    }
}

// Ajouter CSS pour les animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInTop {
        from {
            transform: translateX(-50%) translateY(-100%);
            opacity: 0;
        }
        to {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutTop {
        from {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
        }
        to {
            transform: translateX(-50%) translateY(-100%);
            opacity: 0;
        }
    }
    
    .mobile-notification {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
`;
document.head.appendChild(style);

// Initialiser les corrections et l'affichage
setTimeout(() => {
    renderMobileTradesUnified();
    updateMobileCalendar();
    updateMobileStats();
    fixMobileTradeButtons();
    
    // Corriger le bouton d'ajout de trade
    const newTradeBtn = document.getElementById('newTradeBtn');
    const addTradeBtn = document.getElementById('addTradeBtn');
    
    if (newTradeBtn) {
        newTradeBtn.onclick = showAddTradeModal;
    }
    if (addTradeBtn) {
        addTradeBtn.onclick = showAddTradeModal;
    }
    
    console.log('✅ Boutons trades mobiles corrigés');
}, 2000);

// Recharger l'affichage toutes les 5 secondes
setInterval(() => {
    if (!isRenderingTrades) {
        renderMobileTradesUnified();
        updateMobileCalendar();
    }
}, 5000);

// Exposer les fonctions
window.closeMobileTrade = closeMobileTrade;
window.editMobileTrade = editMobileTrade;
window.deleteMobileTrade = deleteMobileTrade;
window.saveMobileTradeEdit = saveMobileTradeEdit;
window.closeMobileModal = closeMobileModal;
window.showMobileNotification = showMobileNotification;
window.playMobileNotificationSound = playMobileNotificationSound;

console.log('✅ Fix boutons trades mobiles chargé');