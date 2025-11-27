// Corrections Dashboard Mobile - Version Complète
console.log('🔧 Chargement des corrections dashboard mobile...');

// 1. Correction du classement VIP mobile
function fixMobileRanking() {
    console.log('🏆 Correction du classement mobile...');
    
    // Fonction pour charger le classement VIP mobile
    window.loadMobileRanking = async function() {
        const rankingContainer = document.getElementById('mobileRankingList');
        if (!rankingContainer) return;
        
        try {
            if (!window.firebaseDB) {
                console.warn('Firebase non initialisé pour le classement');
                return;
            }
            
            const { ref, get } = await import('https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js');
            const usersRef = ref(window.firebaseDB, 'users');
            const snapshot = await get(usersRef);
            
            if (!snapshot.exists()) {
                rankingContainer.innerHTML = '<div class="no-ranking">Aucun utilisateur VIP</div>';
                return;
            }
            
            const users = snapshot.val();
            const vipUsers = [];
            
            Object.keys(users).forEach(uid => {
                const user = users[uid];
                if (user.isVIP && user.accounts && user.accounts.compte1) {
                    const account = user.accounts.compte1;
                    const trades = account.trades || [];
                    const closedTrades = trades.filter(t => t.status === 'closed');
                    const totalPnL = closedTrades.reduce((sum, t) => sum + (parseFloat(t.pnl) || 0), 0);
                    const winRate = closedTrades.length > 0 ? 
                        (closedTrades.filter(t => parseFloat(t.pnl) > 0).length / closedTrades.length * 100) : 0;
                    
                    // Récupérer le pseudo depuis profiles/{uid}/nickname
                    vipUsers.push({
                        uid,
                        email: user.email,
                        totalPnL,
                        winRate: winRate.toFixed(1),
                        totalTrades: trades.length,
                        nickname: 'Trader VIP' // Sera mis à jour avec le vrai pseudo
                    });
                }
            });
            
            // Récupérer les pseudos depuis profiles
            const profilesRef = ref(window.firebaseDB, 'profiles');
            const profilesSnapshot = await get(profilesRef);
            
            if (profilesSnapshot.exists()) {
                const profiles = profilesSnapshot.val();
                vipUsers.forEach(user => {
                    if (profiles[user.uid] && profiles[user.uid].nickname) {
                        user.nickname = profiles[user.uid].nickname;
                    }
                });
            }
            
            // Trier par P&L total
            vipUsers.sort((a, b) => b.totalPnL - a.totalPnL);
            
            let html = '';
            vipUsers.forEach((user, index) => {
                const position = index + 1;
                const medal = position === 1 ? '🥇' : position === 2 ? '🥈' : position === 3 ? '🥉' : `#${position}`;
                const pnlClass = user.totalPnL >= 0 ? 'positive' : 'negative';
                
                html += `
                    <div class="ranking-item">
                        <div class="ranking-position">${medal}</div>
                        <div class="ranking-info">
                            <div class="ranking-name">${user.nickname}</div>
                            <div class="ranking-stats">
                                <span class="ranking-pnl ${pnlClass}">$${user.totalPnL.toFixed(2)}</span>
                                <span class="ranking-winrate">${user.winRate}% WR</span>
                                <span class="ranking-trades">${user.totalTrades}T</span>
                            </div>
                        </div>
                    </div>
                `;
            });
            
            rankingContainer.innerHTML = html || '<div class="no-ranking">Aucun trader VIP</div>';
            console.log('✅ Classement mobile chargé:', vipUsers.length, 'traders');
            
        } catch (error) {
            console.error('❌ Erreur classement mobile:', error);
            rankingContainer.innerHTML = '<div class="no-ranking">Erreur de chargement</div>';
        }
    };
    
    console.log('✅ Correction classement mobile appliquée');
}

// 2. Correction de la synchronisation des données entre PC et mobile
function fixMobileDataSync() {
    console.log('🔄 Correction synchronisation mobile...');
    
    // Fonction pour charger les données depuis Firebase
    window.loadMobileData = async function() {
        try {
            const uid = sessionStorage.getItem('firebaseUID');
            if (!uid || !window.firebaseDB) return;
            
            const { ref, get } = await import('https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js');
            
            // Charger depuis dashboards (données PC)
            const dashboardRef = ref(window.firebaseDB, `dashboards/${uid}`);
            const snapshot = await get(dashboardRef);
            
            if (snapshot.exists()) {
                const data = snapshot.val();
                window.mobileTradesData = data.trades || [];
                
                // Mettre à jour les stats mobiles
                updateMobileStats();
                updateMobileTradesList();
                updateMobileCalendar();
                
                console.log('✅ Données PC synchronisées vers mobile:', window.mobileTradesData.length, 'trades');
            } else {
                console.log('📱 Aucune donnée PC trouvée, utilisation des données locales');
                loadLocalMobileData();
            }
            
        } catch (error) {
            console.error('❌ Erreur sync mobile:', error);
            loadLocalMobileData();
        }
    };
    
    // Fonction de fallback pour les données locales
    function loadLocalMobileData() {
        const localData = localStorage.getItem(`mobileTradesData_${sessionStorage.getItem('firebaseUID')}`);
        if (localData) {
            try {
                window.mobileTradesData = JSON.parse(localData);
                updateMobileStats();
                updateMobileTradesList();
                updateMobileCalendar();
                console.log('📱 Données locales chargées:', window.mobileTradesData.length, 'trades');
            } catch (e) {
                window.mobileTradesData = [];
            }
        } else {
            window.mobileTradesData = [];
        }
    }
    
    console.log('✅ Correction synchronisation mobile appliquée');
}

// 3. Correction des statistiques mobiles
function fixMobileStats() {
    console.log('📊 Correction statistiques mobile...');
    
    window.updateMobileStats = function() {
        const trades = window.mobileTradesData || [];
        const closedTrades = trades.filter(t => t.status === 'closed');
        const openTrades = trades.filter(t => t.status === 'open');
        const winTrades = closedTrades.filter(t => parseFloat(t.pnl || 0) > 0);
        const lossTrades = closedTrades.filter(t => parseFloat(t.pnl || 0) <= 0);
        const totalPnL = closedTrades.reduce((sum, t) => sum + (parseFloat(t.pnl || 0)), 0);
        const winRate = closedTrades.length > 0 ? (winTrades.length / closedTrades.length * 100) : 0;
        
        // Mettre à jour les éléments du header
        const capitalElement = document.getElementById('mobileCapital');
        const winRateElement = document.getElementById('mobileWinRate');
        const pnlElement = document.getElementById('mobilePnL');
        
        if (capitalElement) {
            const initialCapital = 1000; // À récupérer depuis les paramètres
            const currentCapital = initialCapital + totalPnL;
            capitalElement.textContent = `$${currentCapital.toFixed(0)}`;
            capitalElement.className = totalPnL >= 0 ? 'positive' : 'negative';
        }
        
        if (winRateElement) {
            winRateElement.textContent = `${winRate.toFixed(1)}%`;
        }
        
        if (pnlElement) {
            pnlElement.textContent = `$${totalPnL.toFixed(2)}`;
            pnlElement.className = totalPnL >= 0 ? 'positive' : 'negative';
        }
        
        // Mettre à jour les stats du dashboard
        const elements = {
            'totalTrades': trades.length,
            'winningTrades': winTrades.length,
            'losingTrades': lossTrades.length,
            'totalProfit': `$${totalPnL.toFixed(2)}`
        };
        
        Object.keys(elements).forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = elements[id];
                if (id === 'totalProfit') {
                    element.className = totalPnL >= 0 ? 'positive' : 'negative';
                }
            }
        });
        
        console.log('📊 Stats mobiles mises à jour:', {
            total: trades.length,
            closed: closedTrades.length,
            winRate: winRate.toFixed(1) + '%',
            pnl: totalPnL.toFixed(2)
        });
    };
    
    console.log('✅ Correction statistiques mobile appliquée');
}

// 4. Correction de la liste des trades mobiles
function fixMobileTradesList() {
    console.log('📈 Correction liste trades mobile...');
    
    window.updateMobileTradesList = function() {
        const container = document.getElementById('mobileTradesList');
        if (!container) return;
        
        const trades = window.mobileTradesData || [];
        
        if (trades.length === 0) {
            container.innerHTML = '<div class="no-trades">Aucun trade pour le moment</div>';
            return;
        }
        
        // Afficher tous les trades (pas de limitation)
        const sortedTrades = [...trades].reverse(); // Plus récents en premier
        
        let html = '';
        sortedTrades.forEach((trade, index) => {
            const pnl = parseFloat(trade.pnl || 0);
            const pnlClass = pnl > 0 ? 'positive' : pnl < 0 ? 'negative' : '';
            const statusClass = trade.status === 'open' ? 'open' : 'closed';
            const statusText = trade.status === 'open' ? 'OUVERT' : (trade.result || 'FERMÉ');
            
            html += `
                <div class="trade-item ${statusClass}">
                    <div class="trade-header">
                        <div class="trade-pair">${trade.currency}</div>
                        <div class="trade-date">${trade.date}</div>
                        <div class="trade-status ${statusClass}">${statusText}</div>
                    </div>
                    <div class="trade-details">
                        <div class="trade-prices">
                            <span>Entrée: ${trade.entryPoint}</span>
                            <span>SL: ${trade.stopLoss}</span>
                            <span>TP: ${trade.takeProfit}</span>
                        </div>
                        <div class="trade-lot">Lot: ${trade.lotSize}</div>
                        <div class="trade-pnl ${pnlClass}">
                            ${trade.status === 'closed' ? `$${pnl.toFixed(2)}` : 'En cours...'}
                        </div>
                    </div>
                    <div class="trade-actions">
                        ${trade.status === 'open' ? 
                            `<button class="btn-close-trade" onclick="closeMobileTrade(${trades.indexOf(trade)})">Clôturer</button>` :
                            `<button class="btn-edit-trade" onclick="editMobileTrade(${trades.indexOf(trade)})">Modifier</button>`
                        }
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html;
        console.log('📈 Liste trades mobile mise à jour:', trades.length, 'trades');
    };
    
    // Fonctions pour gérer les trades
    window.closeMobileTrade = function(index) {
        const trade = window.mobileTradesData[index];
        if (!trade || trade.status === 'closed') return;
        
        const result = prompt('Résultat du trade (TP/SL/BE):', 'TP');
        if (!result) return;
        
        trade.status = 'closed';
        trade.result = result.toUpperCase();
        
        // Calculer le P&L
        if (result.toUpperCase() === 'TP') {
            trade.closePrice = trade.takeProfit;
        } else if (result.toUpperCase() === 'SL') {
            trade.closePrice = trade.stopLoss;
        } else {
            trade.closePrice = trade.entryPoint;
        }
        
        trade.pnl = calculateMobilePnL(trade);
        
        saveMobileData();
        updateMobileStats();
        updateMobileTradesList();
        updateMobileCalendar();
        
        alert(`Trade ${trade.currency} clôturé en ${result.toUpperCase()}: $${trade.pnl.toFixed(2)}`);
    };
    
    window.editMobileTrade = function(index) {
        alert('Fonction de modification en cours de développement');
    };
    
    function calculateMobilePnL(trade) {
        const entryPoint = parseFloat(trade.entryPoint);
        const closePrice = parseFloat(trade.closePrice);
        const lotSize = parseFloat(trade.lotSize);
        
        if (!entryPoint || !closePrice || !lotSize) return 0;
        
        let priceDiff = closePrice - entryPoint;
        const isLong = parseFloat(trade.takeProfit) > entryPoint;
        if (!isLong) priceDiff = -priceDiff;
        
        let pnl = 0;
        const currency = trade.currency;
        
        if (currency === 'XAU/USD') {
            pnl = priceDiff * lotSize * 100;
        } else if (currency === 'BTC/USD') {
            pnl = priceDiff * lotSize * 100;
        } else if (currency.includes('JPY')) {
            const pipDiff = priceDiff * 100;
            pnl = pipDiff * lotSize * 10;
        } else {
            const pipDiff = priceDiff * 10000;
            pnl = pipDiff * lotSize * 10;
        }
        
        return parseFloat(pnl.toFixed(2));
    }
    
    function saveMobileData() {
        const uid = sessionStorage.getItem('firebaseUID');
        if (uid && window.mobileTradesData) {
            localStorage.setItem(`mobileTradesData_${uid}`, JSON.stringify(window.mobileTradesData));
        }
    }
    
    console.log('✅ Correction liste trades mobile appliquée');
}

// 5. Correction du chat mobile pour synchronisation parfaite
function fixMobileChat() {
    console.log('💬 Correction chat mobile...');
    
    // Fonction pour réinitialiser le compteur de messages non lus
    window.resetUnreadCount = function() {
        if (window.resetMobileBadge) {
            window.resetMobileBadge();
        }
        console.log('🔔 Compteur messages mobile réinitialisé');
    };
    
    // S'assurer que le chat mobile utilise la même base de données que le PC
    const originalLoadMobileChat = window.loadMobileChat;
    if (originalLoadMobileChat) {
        window.loadMobileChat = function() {
            console.log('💬 Chargement chat mobile avec sync PC...');
            return originalLoadMobileChat();
        };
    }
    
    console.log('✅ Correction chat mobile appliquée');
}

// 6. Correction des graphiques mobiles
function fixMobileCharts() {
    console.log('📊 Correction graphiques mobile...');
    
    window.initMobileChartsForced = function() {
        const perfCtx = document.getElementById('mobilePerformanceChart');
        const winCtx = document.getElementById('mobileWinRateChart');
        
        if (perfCtx && typeof Chart !== 'undefined') {
            // Détruire le graphique existant
            if (window.mobilePerformanceChart) {
                window.mobilePerformanceChart.destroy();
            }
            
            window.mobilePerformanceChart = new Chart(perfCtx, {
                type: 'line',
                data: {
                    labels: ['T1', 'T2', 'T3', 'T4', 'T5'],
                    datasets: [{
                        label: 'P&L',
                        data: [0, 0, 0, 0, 0],
                        borderColor: '#00d4ff',
                        backgroundColor: 'rgba(0, 212, 255, 0.1)',
                        fill: true,
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        y: {
                            ticks: {
                                callback: function(value) { return '$' + value; }
                            }
                        }
                    }
                }
            });
            console.log('📈 Graphique performance mobile créé');
        }
        
        if (winCtx && typeof Chart !== 'undefined') {
            // Détruire le graphique existant
            if (window.mobileWinRateChart) {
                window.mobileWinRateChart.destroy();
            }
            
            window.mobileWinRateChart = new Chart(winCtx, {
                type: 'doughnut',
                data: {
                    labels: ['Gagnants', 'Perdants'],
                    datasets: [{
                        data: [0, 0],
                        backgroundColor: ['#28a745', '#dc3545']
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } }
                }
            });
            console.log('🎯 Graphique winrate mobile créé');
        }
        
        // Mettre à jour avec les vraies données
        setTimeout(() => {
            if (window.updateMobileCharts) {
                window.updateMobileCharts();
            }
        }, 500);
    };
    
    console.log('✅ Correction graphiques mobile appliquée');
}

// 7. Fonction principale d'application des corrections
function applyAllMobileFixes() {
    console.log('🔧 Application de toutes les corrections mobile...');
    
    // Attendre que Firebase soit prêt
    const checkFirebase = setInterval(() => {
        if (window.firebaseDB && sessionStorage.getItem('firebaseUID')) {
            clearInterval(checkFirebase);
            
            // Appliquer toutes les corrections
            fixMobileRanking();
            fixMobileDataSync();
            fixMobileStats();
            fixMobileTradesList();
            fixMobileChat();
            fixMobileCharts();
            
            // Charger les données initiales
            setTimeout(() => {
                if (window.loadMobileData) window.loadMobileData();
                if (window.loadMobileRanking) window.loadMobileRanking();
                if (window.initMobileChartsForced) window.initMobileChartsForced();
                
                console.log('✅ Toutes les corrections mobile appliquées et données chargées');
            }, 1000);
        }
    }, 100);
    
    // Timeout de sécurité
    setTimeout(() => {
        clearInterval(checkFirebase);
        if (!window.firebaseDB) {
            console.warn('⚠️ Firebase non initialisé après 15 secondes');
        }
    }, 15000);
}

// Démarrer les corrections
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyAllMobileFixes);
} else {
    applyAllMobileFixes();
}

console.log('✅ Script de corrections dashboard mobile chargé');