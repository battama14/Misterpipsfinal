// Fix complet mobile - Boutons, calendrier, classement
console.log('🔧 Fix complet mobile...');

// 1. Fix bouton supprimer avec confirmation personnalisée
function fixDeleteButton() {
    const container = document.getElementById('mobileTradesList');
    if (!container) return;
    
    const observer = new MutationObserver(() => {
        container.querySelectorAll('.btn-delete').forEach(btn => {
            if (btn.hasAttribute('data-fixed')) return;
            btn.setAttribute('data-fixed', 'true');
            
            btn.onclick = async function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                const index = parseInt(this.getAttribute('data-trade-index'));
                if (isNaN(index)) return;
                
                // Confirmation personnalisée
                const confirmed = await showCustomConfirm('Supprimer ce trade ?');
                if (!confirmed) return;
                
                // Supprimer le trade
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
                    
                    // Sauvegarder
                    if (window.mobileData && window.mobileData.trades) {
                        window.mobileData.trades = trades;
                        if (window.saveMobileData) await window.saveMobileData();
                    } else {
                        window.mobileTradesData = trades;
                    }
                    localStorage.setItem('mobileTradesData', JSON.stringify(trades));
                    
                    // Mettre à jour tout
                    updateAllMobile();
                    showMobileNotification('🗑️ Trade supprimé!');
                }
            };
        });
    });
    
    observer.observe(container, { childList: true, subtree: true });
}

// Confirmation personnalisée
function showCustomConfirm(message) {
    return new Promise((resolve) => {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed; top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0,0,0,0.5); z-index: 10000;
            display: flex; align-items: center; justify-content: center;
        `;
        
        modal.innerHTML = `
            <div style="background: white; padding: 20px; border-radius: 12px; max-width: 300px; text-align: center;">
                <h3 style="margin: 0 0 15px 0;">${message}</h3>
                <div style="display: flex; gap: 10px; justify-content: center;">
                    <button id="confirmYes" style="background: #dc3545; color: white; border: none; padding: 10px 20px; border-radius: 6px;">Oui</button>
                    <button id="confirmNo" style="background: #6c757d; color: white; border: none; padding: 10px 20px; border-radius: 6px;">Non</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        document.getElementById('confirmYes').onclick = () => {
            modal.remove();
            resolve(true);
        };
        document.getElementById('confirmNo').onclick = () => {
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
}

// 2. Fix calendrier pour afficher les trades validés
function updateMobileCalendarFixed() {
    const calendar = document.getElementById('mobileCalendar');
    if (!calendar) return;
    
    const today = new Date();
    const month = today.getMonth();
    const year = today.getFullYear();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Récupérer tous les trades
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
    
    console.log('📅 Calendrier: Trades trouvés:', trades.length);
    
    const tradesData = {};
    trades.forEach(trade => {
        if (trade.date) {
            const tradeDate = new Date(trade.date);
            if (tradeDate.getMonth() === month && tradeDate.getFullYear() === year) {
                const day = tradeDate.getDate();
                if (!tradesData[day]) tradesData[day] = { count: 0, pnl: 0 };
                tradesData[day].count++;
                
                // Compter tous les trades fermés (TP, SL, BE, closed)
                if (trade.status === 'closed' || trade.result === 'TP' || trade.result === 'SL' || trade.result === 'BE') {
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
        const pnlClass = hasData ? (dayData.pnl > 0 ? 'profit-day' : dayData.pnl < 0 ? 'loss-day' : '') : '';
        
        html += `<div class="calendar-day ${pnlClass}">`;
        html += `<div class="calendar-date">${day}</div>`;
        if (hasData) {
            html += `<div class="calendar-trades">${dayData.count}T</div>`;
            if (dayData.pnl !== 0) {
                html += `<div class="calendar-pnl ${dayData.pnl > 0 ? 'positive' : 'negative'}">$${dayData.pnl.toFixed(0)}</div>`;
            }
        }
        html += '</div>';
    }
    
    html += '</div>';
    calendar.innerHTML = html;
    console.log('✅ Calendrier mis à jour avec', Object.keys(tradesData).length, 'jours de trading');
}

// 3. Fix classement VIP pour prendre les gains mobiles
async function updateVipRankingWithMobile() {
    if (!window.firebaseDB) return;
    
    try {
        // Récupérer les trades mobiles actuels
        let myTrades = [];
        if (window.mobileData && window.mobileData.trades) {
            myTrades = window.mobileData.trades;
        } else if (window.mobileTradesData) {
            myTrades = window.mobileTradesData;
        } else {
            try {
                const stored = localStorage.getItem('mobileTradesData');
                if (stored) myTrades = JSON.parse(stored);
            } catch (e) {}
        }
        
        const today = new Date().toISOString().split('T')[0];
        const todayTrades = myTrades.filter(t => 
            t && t.date === today && (t.status === 'closed' || t.result)
        );
        
        const dailyPnL = todayTrades.reduce((sum, t) => sum + (parseFloat(t.pnl) || 0), 0);
        
        console.log('🏆 Mise à jour classement avec trades mobiles:', todayTrades.length, 'trades, P&L:', dailyPnL);
        
        // Sauvegarder dans Firebase pour le classement
        const uid = sessionStorage.getItem('firebaseUID');
        if (uid && dailyPnL !== 0) {
            const { ref, set } = await import('https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js');
            const userRef = ref(window.firebaseDB, `dashboards/${uid}/trades`);
            await set(userRef, myTrades);
            console.log('✅ Trades mobiles synchronisés avec Firebase pour classement');
        }
        
        // Recharger le classement
        if (window.loadSimpleRanking) {
            setTimeout(window.loadSimpleRanking, 500);
        }
        
    } catch (error) {
        console.error('❌ Erreur sync classement:', error);
    }
}

// Mettre à jour tout
function updateAllMobile() {
    if (window.renderMobileTradesUnified) window.renderMobileTradesUnified();
    updateMobileCalendarFixed();
    if (window.updateMobileStats) window.updateMobileStats();
    updateVipRankingWithMobile();
}

// Notification mobile
function showMobileNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
        background: linear-gradient(135deg, #00d4ff, #5b86e5);
        color: white; padding: 15px 20px; border-radius: 25px;
        z-index: 10000; font-size: 14px; font-weight: 500;
        box-shadow: 0 4px 20px rgba(0, 212, 255, 0.3);
    `;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

// Initialiser les corrections
setTimeout(() => {
    fixDeleteButton();
    updateMobileCalendarFixed();
    updateVipRankingWithMobile();
    console.log('✅ Fix complet mobile initialisé');
}, 2000);

// Recharger périodiquement
setInterval(() => {
    updateMobileCalendarFixed();
    updateVipRankingWithMobile();
}, 10000);

// Exposer les fonctions
window.updateMobileCalendarFixed = updateMobileCalendarFixed;
window.updateVipRankingWithMobile = updateVipRankingWithMobile;
window.updateAllMobile = updateAllMobile;
window.showMobileNotification = showMobileNotification;

console.log('✅ Fix complet mobile chargé');