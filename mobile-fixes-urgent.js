// Corrections urgentes mobile
console.log('🚨 Corrections urgentes mobile...');

// 1. Forcer le chargement du classement VIP Firebase
setTimeout(() => {
    if (window.loadMobileRanking) {
        console.log('🏆 Forçage chargement classement Firebase...');
        window.loadMobileRanking();
    }
}, 3000);

// Retry si échec
setTimeout(() => {
    const rankingContainer = document.getElementById('mobileRankingList');
    if (rankingContainer && (!rankingContainer.innerHTML || rankingContainer.innerHTML.includes('Chargement'))) {
        console.log('🏆 Retry classement Firebase...');
        if (window.loadMobileRanking) {
            window.loadMobileRanking();
        }
    }
}, 6000);

// 2. Corriger les boutons de trade
setTimeout(() => {
    const newTradeBtn = document.getElementById('newTradeBtn');
    const addTradeBtn = document.getElementById('addTradeBtn');
    
    if (newTradeBtn && !newTradeBtn.onclick) {
        newTradeBtn.onclick = () => {
            console.log('🔘 Clic newTradeBtn');
            if (window.showTradeModal) {
                window.showTradeModal();
            } else {
                console.error('showTradeModal non trouvée');
            }
        };
        console.log('✅ newTradeBtn corrigé');
    }
    
    if (addTradeBtn && !addTradeBtn.onclick) {
        addTradeBtn.onclick = () => {
            console.log('🔘 Clic addTradeBtn');
            if (window.showTradeModal) {
                window.showTradeModal();
            } else {
                console.error('showTradeModal non trouvée');
            }
        };
        console.log('✅ addTradeBtn corrigé');
    }
}, 2000);

// 3. Corriger le calendrier mobile
window.updateMobileCalendarFixed = function() {
    const calendar = document.getElementById('mobileCalendar');
    if (!calendar) return;
    
    console.log('📅 Mise à jour calendrier mobile...');
    
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Récupérer les trades
    let trades = [];
    if (window.mobileData && window.mobileData.trades) {
        trades = window.mobileData.trades;
    } else if (window.mobileTradesData) {
        trades = window.mobileTradesData;
    }
    
    console.log('📅 Trades trouvés:', trades.length);
    
    let html = '<div class="calendar-grid">';
    
    // En-têtes jours
    ['D', 'L', 'M', 'M', 'J', 'V', 'S'].forEach(day => {
        html += `<div class="calendar-day-header">${day}</div>`;
    });
    
    // Jours du mois
    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        
        const dayTrades = trades.filter(trade => {
            const tradeDate = trade.closeDate || trade.date;
            return tradeDate === dateStr && trade.status === 'closed';
        });
        
        const dayPnL = dayTrades.reduce((sum, trade) => sum + (parseFloat(trade.pnl) || 0), 0);
        
        let dayClass = 'calendar-day';
        if (dayTrades.length > 0) {
            dayClass += dayPnL > 0 ? ' profit-day' : dayPnL < 0 ? ' loss-day' : ' be-day';
        }
        
        html += `
            <div class="${dayClass}">
                <div class="calendar-date">${day}</div>
                ${dayTrades.length > 0 ? `
                    <div class="calendar-pnl ${dayPnL >= 0 ? 'positive' : 'negative'}">${dayPnL >= 0 ? '+' : ''}$${dayPnL.toFixed(0)}</div>
                    <div class="calendar-trades">${dayTrades.length}T</div>
                ` : ''}
            </div>
        `;
    }
    
    html += '</div>';
    calendar.innerHTML = html;
    console.log('✅ Calendrier mobile mis à jour');
};

// Remplacer la fonction originale
setTimeout(() => {
    window.updateMobileCalendar = window.updateMobileCalendarFixed;
    window.updateMobileCalendarFixed();
}, 1000);

// 4. Activer les notifications push au démarrage
setTimeout(() => {
    if ('Notification' in window && Notification.permission === 'default') {
        console.log('🔔 Demande permissions notifications...');
        Notification.requestPermission().then(permission => {
            console.log('🔔 Permission:', permission);
            if (permission === 'granted') {
                // Test notification
                const testNotif = new Notification('✅ Notifications activées', {
                    body: 'Vous recevrez les messages du chat VIP',
                    icon: './Misterpips.jpg',
                    silent: false,
                    requireInteraction: false
                });
                setTimeout(() => testNotif.close(), 3000);
            }
        });
    }
}, 5000);

// 5. Forcer le classement PC Firebase
setTimeout(() => {
    if (window.vipRanking && window.vipRanking.loadRanking) {
        console.log('🏆 Forçage classement PC Firebase...');
        window.vipRanking.loadRanking();
    }
}, 4000);

console.log('✅ Corrections urgentes appliquées');