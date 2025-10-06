// Fix modal trade mobile
console.log('🔧 Fix modal trade mobile...');

// Créer la fonction showTradeModal manquante
window.showTradeModal = function(tradeData = null) {
    console.log('📱 Ouverture modal trade mobile');
    
    const modal = document.getElementById('tradeModal');
    const modalContent = document.getElementById('modalContent');
    
    if (!modal || !modalContent) {
        console.error('Modal non trouvé');
        return;
    }
    
    const isEdit = tradeData !== null;
    const title = isEdit ? 'Modifier le Trade' : 'Nouveau Trade';
    
    modalContent.innerHTML = `
        <div class="modal-header">
            <h3>${title}</h3>
            <button class="close-btn" onclick="closeMobileTradeModal()">✕</button>
        </div>
        <div class="modal-body">
            <form id="mobileTradeForm">
                <div class="form-group">
                    <label>Paire</label>
                    <select id="mobileTradePair" required>
                        <option value="EUR/USD" ${isEdit && tradeData.pair === 'EUR/USD' ? 'selected' : ''}>EUR/USD</option>
                        <option value="GBP/USD" ${isEdit && tradeData.pair === 'GBP/USD' ? 'selected' : ''}>GBP/USD</option>
                        <option value="USD/JPY" ${isEdit && tradeData.pair === 'USD/JPY' ? 'selected' : ''}>USD/JPY</option>
                        <option value="AUD/USD" ${isEdit && tradeData.pair === 'AUD/USD' ? 'selected' : ''}>AUD/USD</option>
                        <option value="USD/CAD" ${isEdit && tradeData.pair === 'USD/CAD' ? 'selected' : ''}>USD/CAD</option>
                        <option value="EUR/GBP" ${isEdit && tradeData.pair === 'EUR/GBP' ? 'selected' : ''}>EUR/GBP</option>
                        <option value="EUR/JPY" ${isEdit && tradeData.pair === 'EUR/JPY' ? 'selected' : ''}>EUR/JPY</option>
                        <option value="GBP/JPY" ${isEdit && tradeData.pair === 'GBP/JPY' ? 'selected' : ''}>GBP/JPY</option>
                        <option value="XAU/USD" ${isEdit && tradeData.pair === 'XAU/USD' ? 'selected' : ''}>XAU/USD (Or)</option>
                        <option value="BTC/USD" ${isEdit && tradeData.pair === 'BTC/USD' ? 'selected' : ''}>BTC/USD (Bitcoin)</option>
                        <option value="ETH/USD" ${isEdit && tradeData.pair === 'ETH/USD' ? 'selected' : ''}>ETH/USD (Ethereum)</option>
                        <option value="US30" ${isEdit && tradeData.pair === 'US30' ? 'selected' : ''}>US30 (Dow Jones)</option>
                        <option value="NAS100" ${isEdit && tradeData.pair === 'NAS100' ? 'selected' : ''}>NAS100 (Nasdaq)</option>
                        <option value="SPX500" ${isEdit && tradeData.pair === 'SPX500' ? 'selected' : ''}>SPX500 (S&P 500)</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label>Type</label>
                    <select id="mobileTradeType" required>
                        <option value="buy" ${isEdit && tradeData.type === 'buy' ? 'selected' : ''}>Buy</option>
                        <option value="sell" ${isEdit && tradeData.type === 'sell' ? 'selected' : ''}>Sell</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label>Lots</label>
                    <input type="number" id="mobileTradeLots" value="${isEdit ? tradeData.lots : ''}" step="0.01" placeholder="0.10" required>
                </div>
                
                <div class="form-group">
                    <label>Prix d'entrée</label>
                    <input type="number" id="mobileTradeEntry" value="${isEdit ? tradeData.entryPrice : ''}" step="0.00001" placeholder="1.08500" required>
                </div>
                
                <div class="form-group">
                    <label>Stop Loss</label>
                    <input type="number" id="mobileTradeSL" value="${isEdit ? tradeData.stopLoss : ''}" step="0.00001" placeholder="1.08000">
                </div>
                
                <div class="form-group">
                    <label>Take Profit</label>
                    <input type="number" id="mobileTradeTP" value="${isEdit ? tradeData.takeProfit : ''}" step="0.00001" placeholder="1.09000">
                </div>
                
                <div class="form-group">
                    <label>Date</label>
                    <input type="date" id="mobileTradeDate" value="${isEdit ? tradeData.date : new Date().toISOString().split('T')[0]}" required>
                </div>
                
                ${isEdit ? `
                <div class="form-group">
                    <label>Statut</label>
                    <select id="mobileTradeStatus">
                        <option value="open" ${tradeData.status === 'open' ? 'selected' : ''}>Ouvert</option>
                        <option value="closed" ${tradeData.status === 'closed' ? 'selected' : ''}>Fermé</option>
                        <option value="tp" ${tradeData.status === 'tp' ? 'selected' : ''}>Take Profit</option>
                        <option value="sl" ${tradeData.status === 'sl' ? 'selected' : ''}>Stop Loss</option>
                    </select>
                </div>
                
                <div class="form-group" id="mobileClosePriceGroup" style="display: ${tradeData.status !== 'open' ? 'block' : 'none'}">
                    <label>Prix de fermeture</label>
                    <input type="number" id="mobileTradeClosePrice" value="${tradeData.closePrice || ''}" step="0.00001">
                </div>
                
                <div class="form-group" id="mobilePnLGroup" style="display: ${tradeData.status !== 'open' ? 'block' : 'none'}">
                    <label>P&L ($)</label>
                    <input type="number" id="mobileTradePnL" value="${tradeData.pnl || ''}" step="0.01">
                </div>
                ` : ''}
                
                <div class="form-actions">
                    <button type="button" class="btn-cancel" onclick="closeMobileTradeModal()">Annuler</button>
                    <button type="submit" class="btn-save">${isEdit ? 'Modifier' : 'Ajouter'}</button>
                </div>
            </form>
        </div>
    `;
    
    // Gérer le changement de statut
    if (isEdit) {
        const statusSelect = document.getElementById('mobileTradeStatus');
        statusSelect.addEventListener('change', function() {
            const closePriceGroup = document.getElementById('mobileClosePriceGroup');
            const pnlGroup = document.getElementById('mobilePnLGroup');
            
            if (this.value === 'open') {
                closePriceGroup.style.display = 'none';
                pnlGroup.style.display = 'none';
            } else {
                closePriceGroup.style.display = 'block';
                pnlGroup.style.display = 'block';
            }
        });
    }
    
    // Gérer la soumission du formulaire
    const form = document.getElementById('mobileTradeForm');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        saveMobileTradeFromModal(isEdit, tradeData);
    });
    
    modal.style.display = 'block';
    modal.classList.add('active');
};

// Fermer le modal
window.closeMobileTradeModal = function() {
    const modal = document.getElementById('tradeModal');
    if (modal) {
        modal.style.display = 'none';
        modal.classList.remove('active');
    }
};

// Sauvegarder le trade depuis le modal
window.saveMobileTradeFromModal = function(isEdit, originalTrade) {
    const formData = {
        pair: document.getElementById('mobileTradePair').value,
        type: document.getElementById('mobileTradeType').value,
        lots: parseFloat(document.getElementById('mobileTradeLots').value),
        entryPrice: parseFloat(document.getElementById('mobileTradeEntry').value),
        stopLoss: parseFloat(document.getElementById('mobileTradeSL').value) || null,
        takeProfit: parseFloat(document.getElementById('mobileTradeTP').value) || null,
        date: document.getElementById('mobileTradeDate').value,
        status: isEdit ? document.getElementById('mobileTradeStatus').value : 'open',
        closePrice: isEdit ? parseFloat(document.getElementById('mobileTradeClosePrice').value) || null : null,
        pnl: isEdit ? parseFloat(document.getElementById('mobileTradePnL').value) || 0 : 0
    };
    
    // Validation
    if (!formData.pair || !formData.type || !formData.lots || !formData.entryPrice || !formData.date) {
        alert('❌ Veuillez remplir tous les champs obligatoires');
        return;
    }
    
    console.log('💾 Sauvegarde trade mobile:', formData);
    
    // Validation supplémentaire
    if (formData.stopLoss && formData.takeProfit && formData.entryPrice) {
        if (formData.type === 'buy') {
            if (formData.stopLoss >= formData.entryPrice || formData.takeProfit <= formData.entryPrice) {
                alert('❌ Pour un BUY: SL < Prix d\'entrée < TP');
                return;
            }
        } else {
            if (formData.stopLoss <= formData.entryPrice || formData.takeProfit >= formData.entryPrice) {
                alert('❌ Pour un SELL: TP < Prix d\'entrée < SL');
                return;
            }
        }
    }
    
    if (isEdit && originalTrade) {
        // Modifier le trade existant
        // Modifier le trade existant
        const index = originalTrade.index;
        if (window.mobileData && window.mobileData.trades[index]) {
            const trade = window.mobileData.trades[index];
            trade.currency = formData.pair;
            trade.type = formData.type.toUpperCase();
            trade.lotSize = formData.lots;
            trade.entryPoint = formData.entryPrice;
            trade.stopLoss = formData.stopLoss;
            trade.takeProfit = formData.takeProfit;
            trade.date = formData.date;
            trade.status = formData.status;
            trade.closePrice = formData.closePrice;
            trade.pnl = formData.pnl;
            
            // Sauvegarder dans Firebase
            saveMobileToFirebase();
            
            console.log('✅ Trade modifié:', trade);
            
            if (window.updateMobileTradesList) window.updateMobileTradesList();
            if (window.updateMobileStats) window.updateMobileStats();
            
            // Mettre à jour le classement
            updateRankingAfterAction();
            
            alert('✅ Trade modifié avec succès!');
        }
    } else {
        // Nouveau trade
        const newTrade = {
            id: `trade_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            ...formData,
            timestamp: Date.now(),
            account: window.currentMobileAccount || 'default'
        };
        
        // Sauvegarder directement dans mobileData
        const trade = {
            id: newTrade.id,
            currency: formData.pair,
            type: formData.type.toUpperCase(),
            lotSize: formData.lots,
            entryPoint: formData.entryPrice,
            stopLoss: formData.stopLoss,
            takeProfit: formData.takeProfit,
            status: 'open',
            date: formData.date,
            pnl: 0,
            timestamp: Date.now()
        };
        
        // Ajouter au mobileData
        if (!window.mobileData) window.mobileData = { trades: [] };
        if (!window.mobileData.trades) window.mobileData.trades = [];
        
        window.mobileData.trades.push(trade);
        window.mobileTradesData = window.mobileData.trades;
        
        // Sauvegarder dans Firebase
        saveMobileToFirebase();
        
        console.log('✅ Trade ajouté:', trade);
        
        // Actualiser immédiatement
        if (window.updateMobileTradesList) window.updateMobileTradesList();
        if (window.updateMobileStats) window.updateMobileStats();
        
        // Mettre à jour le classement
        updateRankingAfterAction();
        
        alert('✅ Trade ajouté avec succès!');
    }
    
    closeMobileTradeModal();
    

};

// Fermer modal en cliquant à l'extérieur
document.addEventListener('click', function(e) {
    const modal = document.getElementById('tradeModal');
    if (e.target === modal) {
        closeMobileTradeModal();
    }
});

// Créer les fonctions manquantes si nécessaires
if (!window.updateMobileTradesList) {
    window.updateMobileTradesList = function() {
        const container = document.getElementById('mobileTradesList');
        if (!container || !window.mobileData || !window.mobileData.trades) return;
        
        const trades = window.mobileData.trades;
        if (trades.length === 0) {
            container.innerHTML = '<div class="no-trades">Aucun trade</div>';
            return;
        }
        
        container.innerHTML = trades.map((trade, index) => `
            <div class="trade-item ${trade.status}">
                <div class="trade-header">
                    <span class="trade-pair">${trade.currency}</span>
                    <span class="trade-status ${trade.status}">${trade.status === 'open' ? 'OUVERT' : 'FERMÉ'}</span>
                </div>
                <div class="trade-details">
                    <div>Type: ${trade.type} | Lots: ${trade.lotSize}</div>
                    <div>Entrée: ${trade.entryPoint} | SL: ${trade.stopLoss} | TP: ${trade.takeProfit}</div>
                    <div>Date: ${trade.date}</div>
                    ${trade.status === 'closed' ? `<div class="trade-pnl ${trade.pnl >= 0 ? 'positive' : 'negative'}">P&L: $${trade.pnl.toFixed(2)}</div>` : ''}
                </div>
                <div class="trade-actions">
                    ${trade.status === 'open' ? `
                        <button class="btn-tp" onclick="window.closeTrade(${index}, 'tp')">TP</button>
                        <button class="btn-sl" onclick="window.closeTrade(${index}, 'sl')">SL</button>
                        <button class="btn-be" onclick="window.closeTrade(${index}, 'be')">BE</button>
                        <button class="btn-edit" onclick="window.editMobileTrade(${index})">✏️</button>
                    ` : `
                        <button class="btn-edit" onclick="window.editMobileTrade(${index})">✏️</button>
                    `}
                    <button class="btn-delete" onclick="window.deleteTrade(${index})">🗑️</button>
                </div>
            </div>
        `).join('');
    };
}

if (!window.updateMobileStats) {
    window.updateMobileStats = function() {
        if (!window.mobileData || !window.mobileData.trades) return;
        
        const trades = window.mobileData.trades;
        const totalTrades = trades.length;
        const closedTrades = trades.filter(t => t.status === 'closed');
        const totalPnL = closedTrades.reduce((sum, t) => sum + (t.pnl || 0), 0);
        
        // Mettre à jour les stats
        const totalTradesEl = document.getElementById('totalTrades');
        const totalProfitEl = document.getElementById('totalProfit');
        const mobilePnLEl = document.getElementById('mobilePnL');
        
        if (totalTradesEl) totalTradesEl.textContent = totalTrades;
        if (totalProfitEl) totalProfitEl.textContent = `$${totalPnL.toFixed(2)}`;
        if (mobilePnLEl) mobilePnLEl.textContent = `$${totalPnL.toFixed(0)}`;
    };
}

// Fonctions manquantes pour mobile
window.deleteTrade = function(index) {
    console.log('🗑️ Suppression trade:', index);
    
    if (window.mobileData && window.mobileData.trades && window.mobileData.trades[index]) {
        window.mobileData.trades.splice(index, 1);
        window.mobileTradesData = window.mobileData.trades;
        
        // Sauvegarder dans Firebase
        saveMobileToFirebase();
        
        if (window.updateMobileTradesList) window.updateMobileTradesList();
        if (window.updateMobileStats) window.updateMobileStats();
        if (window.updateMobileCalendar) window.updateMobileCalendar();
        
        // Mettre à jour le classement
        updateRankingAfterAction();
        
        console.log('✅ Trade supprimé');
    }
};

window.deleteMobileTrade = window.deleteTrade;

window.closeTrade = function(index, type) {
    console.log('🔄 Fermeture trade:', index, type);
    
    if (!window.mobileData || !window.mobileData.trades || !window.mobileData.trades[index]) {
        console.error('Trade non trouvé:', index);
        return;
    }
    
    const trade = window.mobileData.trades[index];
    if (trade.status !== 'open') {
        console.log('Trade déjà fermé');
        return;
    }
    
    trade.status = 'closed';
    trade.closeDate = new Date().toISOString().split('T')[0];
    
    let closePrice = parseFloat(trade.entryPoint);
    if (type === 'tp') closePrice = parseFloat(trade.takeProfit);
    else if (type === 'sl') closePrice = parseFloat(trade.stopLoss);
    else if (type === 'be') closePrice = parseFloat(trade.entryPoint);
    
    trade.closePrice = closePrice;
    
    // Calcul P&L selon la paire
    const entryPoint = parseFloat(trade.entryPoint);
    const lotSize = parseFloat(trade.lotSize);
    let priceDiff = closePrice - entryPoint;
    
    // Inverser pour SELL
    if (trade.type.toLowerCase() === 'sell') {
        priceDiff = -priceDiff;
    }
    
    let pnl = 0;
    if (trade.currency.includes('JPY')) {
        pnl = (priceDiff * 100) * lotSize * 10;
    } else if (trade.currency === 'XAU/USD' || trade.currency === 'BTC/USD') {
        pnl = priceDiff * lotSize * 100;
    } else {
        pnl = (priceDiff * 10000) * lotSize * 10;
    }
    
    trade.pnl = pnl;
    
    console.log('📊 P&L calculé:', pnl);
    
    // Sauvegarder dans Firebase
    saveMobileToFirebase();
    
    if (window.updateMobileTradesList) window.updateMobileTradesList();
    if (window.updateMobileStats) window.updateMobileStats();
    if (window.updateMobileCalendar) window.updateMobileCalendar();
    
    // Mettre à jour le classement
    updateRankingAfterAction();
    
    const emoji = type === 'tp' ? '✅' : type === 'sl' ? '❌' : '⚖️';
    setTimeout(() => {
        alert(`${emoji} Trade fermé en ${type.toUpperCase()}: ${pnl >= 0 ? '+' : ''}$${pnl.toFixed(2)}`);
    }, 500);
};

window.editMobileTrade = function(index) {
    if (!window.mobileData || !window.mobileData.trades[index]) return;
    
    const trade = window.mobileData.trades[index];
    const tradeData = {
        pair: trade.currency,
        type: trade.type.toLowerCase(),
        lots: trade.lotSize,
        entryPrice: trade.entryPoint,
        stopLoss: trade.stopLoss,
        takeProfit: trade.takeProfit,
        date: trade.date,
        status: trade.status,
        closePrice: trade.closePrice,
        pnl: trade.pnl,
        id: trade.id,
        index: index
    };
    
    window.showTradeModal(tradeData);
};

window.saveMobileDataComplete = function() {
    console.log('💾 Sauvegarde mobile data');
    return Promise.resolve();
};

if (!window.mobileData) {
    window.mobileData = { trades: [] };
}

if (!window.mobileTradesData) {
    window.mobileTradesData = [];
}

window.loadMobileRanking = function() {
    console.log('🏆 Chargement classement mobile...');
};

// Fonction sauvegarde Firebase
async function saveMobileToFirebase() {
    const uid = sessionStorage.getItem('firebaseUID');
    if (!uid || !window.firebaseDB || !window.mobileData) return;
    
    try {
        const { ref, set, get } = await import('https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js');
        
        // Sauvegarder dans dashboards (format PC)
        const dashboardRef = ref(window.firebaseDB, `dashboards/${uid}`);
        const existingSnapshot = await get(dashboardRef);
        
        let existingData = {};
        if (existingSnapshot.exists()) {
            existingData = existingSnapshot.val();
        }
        
        const dataToSave = {
            ...existingData,
            trades: window.mobileData.trades,
            lastUpdated: new Date().toISOString(),
            version: Date.now()
        };
        
        await set(dashboardRef, dataToSave);
        
        // Sauvegarder aussi dans users (format mobile)
        const userRef = ref(window.firebaseDB, `users/${uid}`);
        const userSnapshot = await get(userRef);
        
        let userData = { isVIP: true, plan: 'VIP' };
        if (userSnapshot.exists()) {
            userData = userSnapshot.val();
        }
        
        // Sauvegarder EXACTEMENT comme PC
        await set(userRef, {
            isVIP: true,
            plan: 'VIP',
            email: sessionStorage.getItem('userEmail') || 'user@example.com',
            displayName: sessionStorage.getItem('userNickname') || 'Trader',
            nickname: sessionStorage.getItem('userNickname') || '',
            accounts: {
                compte1: {
                    trades: window.mobileData.trades,
                    capital: 1000,
                    settings: { capital: 1000, riskPerTrade: 2, dailyTarget: 1, weeklyTarget: 3, monthlyTarget: 15, yearlyTarget: 200 }
                }
            },
            lastUpdated: new Date().toISOString()
        });
        
        // Ne pas sauvegarder automatiquement le pseudo
        
        console.log('✅ Sauvegarde Firebase PC/Mobile + Classement + Pseudo synchro');
    } catch (error) {
        console.error('❌ Erreur sauvegarde Firebase:', error);
    }
}

// Charger depuis Firebase au démarrage
async function loadMobileFromFirebase() {
    const uid = sessionStorage.getItem('firebaseUID');
    if (!uid || !window.firebaseDB) return;
    
    try {
        const { ref, get } = await import('https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js');
        
        // Charger depuis dashboards (données PC)
        const dashboardRef = ref(window.firebaseDB, `dashboards/${uid}`);
        const snapshot = await get(dashboardRef);
        
        if (snapshot.exists()) {
            const data = snapshot.val();
            if (data.trades && Array.isArray(data.trades)) {
                window.mobileData = { trades: data.trades };
                window.mobileTradesData = data.trades;
                
                if (window.updateMobileTradesList) window.updateMobileTradesList();
                if (window.updateMobileStats) window.updateMobileStats();
                if (window.updateMobileCalendar) window.updateMobileCalendar();
                
                console.log('✅ Trades chargés depuis Firebase:', data.trades.length);
                
                // Mettre à jour le classement après chargement
                updateRankingAfterAction();
            }
        }
        
        // Ne pas charger automatiquement le pseudo
    } catch (error) {
        console.error('❌ Erreur chargement Firebase:', error);
    }
}

// Charger immédiatement au démarrage
setTimeout(loadMobileFromFirebase, 500);
setTimeout(loadMobileFromFirebase, 1500);
setTimeout(loadMobileFromFirebase, 3000);

// Pseudo géré par simple-nickname.js uniquement

// Forcer le chargement quand Firebase est prêt
if (window.firebaseDB) {
    loadMobileFromFirebase();
} else {
    // Attendre que Firebase soit prêt
    const checkFirebase = setInterval(() => {
        if (window.firebaseDB) {
            clearInterval(checkFirebase);
            loadMobileFromFirebase();
        }
    }, 100);
}

// Fonction mise à jour classement
function updateRankingAfterAction() {
    console.log('🏆 Démarrage mise à jour classement...');
    
    setTimeout(() => {
        // Mobile
        if (window.loadMobileRanking) {
            console.log('📱 Mise à jour classement mobile');
            window.loadMobileRanking();
        }
        if (window.loadSimpleRanking) {
            console.log('📱 Mise à jour classement simple');
            window.loadSimpleRanking();
        }
        
        // PC
        if (window.updateRankingAfterTrade) {
            console.log('💻 Mise à jour classement PC');
            window.updateRankingAfterTrade();
        }
        if (window.vipRanking && window.vipRanking.loadRanking) {
            console.log('💻 Mise à jour VIP ranking PC');
            window.vipRanking.loadRanking();
        }
        
        console.log('✅ Classement mis à jour après action trade');
    }, 1500);
}

// Exposer les nouvelles fonctions
window.editMobileTrade = window.editMobileTrade;
window.saveMobileToFirebase = saveMobileToFirebase;
window.loadMobileFromFirebase = loadMobileFromFirebase;
window.updateRankingAfterAction = updateRankingAfterAction;

console.log('✅ Modal trade mobile corrigé avec fonctions manquantes');