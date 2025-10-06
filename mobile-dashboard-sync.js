// Mobile Dashboard Sync - Adaptation de la logique PC
console.log('🔄 Mobile Dashboard Sync - Chargement...');

class MobileDashboardSync {
    constructor() {
        this.currentUser = sessionStorage.getItem('firebaseUID');
        this.currentAccount = 'compte1';
        this.trades = [];
        this.settings = { 
            capital: 1000, 
            riskPerTrade: 2,
            dailyTarget: 1,
            weeklyTarget: 3,
            monthlyTarget: 15,
            yearlyTarget: 200
        };
        this.accounts = {
            'compte1': { name: 'Compte Principal', capital: 1000 },
            'compte2': { name: 'Compte Démo', capital: 500 },
            'compte3': { name: 'Compte Swing', capital: 2000 }
        };
        this.isInitialized = false;
    }

    async init() {
        if (this.isInitialized) return;
        
        console.log('🚀 Initialisation Mobile Dashboard Sync...');
        
        if (!this.currentUser) {
            console.error('❌ Aucun UID Firebase trouvé!');
            return;
        }

        await this.loadData();
        this.updateMobileStats();
        this.updateMobileTradesList();
        this.updateMobileCalendar();
        
        this.isInitialized = true;
        console.log('✅ Mobile Dashboard Sync initialisé');
    }

    async loadData() {
        try {
            if (window.firebaseDB) {
                await this.loadFromFirebase();
            } else {
                this.loadFromLocalStorage();
            }
        } catch (error) {
            console.error('❌ Erreur chargement données:', error);
            this.loadFromLocalStorage();
        }
    }

    loadFromLocalStorage() {
        try {
            const savedData = localStorage.getItem(`dashboard_${this.currentUser}`);
            if (savedData) {
                const data = JSON.parse(savedData);
                this.trades = data.trades || [];
                this.settings = data.settings || this.settings;
                this.accounts = data.accounts || this.accounts;
                this.currentAccount = data.currentAccount || this.currentAccount;
                
                console.log('📱 Données chargées depuis localStorage:', this.trades.length, 'trades');
            }
        } catch (error) {
            console.error('❌ Erreur chargement local:', error);
        }
    }

    async loadFromFirebase() {
        try {
            const { ref, get } = await import('https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js');
            const userRef = ref(window.firebaseDB, `dashboards/${this.currentUser}`);
            const snapshot = await get(userRef);
            
            if (snapshot.exists()) {
                const data = snapshot.val();
                this.trades = data.trades || [];
                this.settings = data.settings || this.settings;
                this.accounts = data.accounts || this.accounts;
                this.currentAccount = data.currentAccount || this.currentAccount;
                console.log('🔥 Données chargées depuis Firebase:', this.trades.length, 'trades');
            } else {
                console.log('📝 Aucune donnée Firebase, utilisation des valeurs par défaut');
            }
        } catch (error) {
            console.error('❌ Erreur chargement Firebase:', error);
            throw error;
        }
    }

    async saveData() {
        try {
            if (window.firebaseDB) {
                await this.saveToFirebase();
            }
            this.saveToLocalStorage();
        } catch (error) {
            console.error('❌ Erreur sauvegarde données:', error);
            this.saveToLocalStorage();
        }
    }

    saveToLocalStorage() {
        try {
            const allData = {
                trades: this.trades,
                settings: this.settings,
                accounts: this.accounts,
                currentAccount: this.currentAccount,
                lastUpdated: new Date().toISOString()
            };
            
            localStorage.setItem(`dashboard_${this.currentUser}`, JSON.stringify(allData));
            console.log('💾 Données sauvegardées localement');
        } catch (error) {
            console.error('❌ Erreur sauvegarde locale:', error);
        }
    }

    async saveToFirebase() {
        if (!window.firebaseDB) return;
        
        try {
            const { ref, set } = await import('https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js');
            
            const dataToSave = {
                trades: this.trades,
                settings: this.settings,
                accounts: this.accounts,
                currentAccount: this.currentAccount,
                lastUpdated: new Date().toISOString(),
                version: Date.now()
            };
            
            // Sauvegarder dans dashboards
            const dashboardRef = ref(window.firebaseDB, `dashboards/${this.currentUser}`);
            await set(dashboardRef, dataToSave);
            
            // Sauvegarder dans users pour le classement VIP
            const userRef = ref(window.firebaseDB, `users/${this.currentUser}`);
            await set(userRef, {
                isVIP: true,
                plan: 'VIP',
                email: sessionStorage.getItem('userEmail') || 'user@example.com',
                displayName: sessionStorage.getItem('userEmail')?.split('@')[0] || 'Trader',
                nickname: sessionStorage.getItem('userNickname') || '',
                accounts: {
                    compte1: {
                        trades: this.trades,
                        capital: this.accounts[this.currentAccount]?.capital || this.settings.capital,
                        settings: this.settings
                    }
                },
                lastUpdated: new Date().toISOString()
            });
            
            console.log('🔥 Données sauvegardées dans Firebase');
        } catch (error) {
            console.error('❌ Erreur sauvegarde Firebase:', error);
        }
    }

    updateMobileStats() {
        const closedTrades = this.trades.filter(t => t.status === 'closed');
        const openTrades = this.trades.filter(t => t.status === 'open');
        const totalPnL = closedTrades.reduce((sum, t) => sum + parseFloat(t.pnl || 0), 0);
        const winRate = closedTrades.length > 0 ? 
            (closedTrades.filter(t => parseFloat(t.pnl || 0) > 0).length / closedTrades.length * 100).toFixed(1) : 0;
        
        const initialCapital = this.accounts[this.currentAccount]?.capital || this.settings.capital;
        const currentCapital = initialCapital + totalPnL;
        
        // Mettre à jour les éléments mobiles
        this.updateMobileElement('mobileCapital', `$${currentCapital.toFixed(2)}`);
        this.updateMobileElement('mobileWinRate', `${winRate}%`);
        this.updateMobileElement('mobilePnL', `$${totalPnL.toFixed(2)}`);
        this.updateMobileElement('totalTrades', this.trades.length);
        this.updateMobileElement('winningTrades', closedTrades.filter(t => parseFloat(t.pnl || 0) > 0).length);
        this.updateMobileElement('losingTrades', closedTrades.filter(t => parseFloat(t.pnl || 0) <= 0).length);
        this.updateMobileElement('totalProfit', `$${totalPnL.toFixed(2)}`);
        
        console.log('📊 Stats mobiles mises à jour');
    }

    updateMobileElement(id, text) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = text;
        }
    }

    updateMobileTradesList() {
        const container = document.getElementById('mobileTradesList');
        if (!container) return;
        
        if (this.trades.length === 0) {
            container.innerHTML = '<div class="no-trades">Aucun trade pour le moment</div>';
            return;
        }
        
        container.innerHTML = '';
        
        // Afficher les 10 derniers trades
        this.trades.slice(-10).reverse().forEach((trade, index) => {
            const tradeDiv = document.createElement('div');
            tradeDiv.className = 'trade-item';
            
            const pnl = parseFloat(trade.pnl || 0);
            const pnlClass = pnl > 0 ? 'positive' : pnl < 0 ? 'negative' : '';
            const statusText = trade.status === 'open' ? 'OUVERT' : trade.result || 'FERMÉ';
            
            tradeDiv.innerHTML = `
                <div class="trade-header">
                    <span class="trade-currency">${trade.currency}</span>
                    <span class="trade-date">${trade.date}</span>
                </div>
                <div class="trade-details">
                    <div class="trade-prices">
                        <span>Entrée: ${trade.entryPoint}</span>
                        <span>SL: ${trade.stopLoss}</span>
                        <span>TP: ${trade.takeProfit}</span>
                    </div>
                    <div class="trade-result">
                        <span class="trade-status">${statusText}</span>
                        <span class="trade-pnl ${pnlClass}">$${pnl.toFixed(2)}</span>
                    </div>
                </div>
                ${trade.status === 'open' ? `
                <div class="trade-actions">
                    <button class="btn-tp" onclick="mobileDashboard.closeTrade(${this.trades.indexOf(trade)}, 'TP')">TP</button>
                    <button class="btn-sl" onclick="mobileDashboard.closeTrade(${this.trades.indexOf(trade)}, 'SL')">SL</button>
                    <button class="btn-be" onclick="mobileDashboard.closeTrade(${this.trades.indexOf(trade)}, 'BE')">BE</button>
                </div>
                ` : ''}
            `;
            
            container.appendChild(tradeDiv);
        });
        
        console.log('📈 Liste des trades mise à jour');
    }

    updateMobileCalendar() {
        const calendar = document.getElementById('mobileCalendar');
        if (!calendar) return;
        
        const today = new Date();
        const month = today.getMonth();
        const year = today.getFullYear();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        const tradesData = {};
        
        this.trades.forEach(trade => {
            const tradeDate = new Date(trade.date);
            if (tradeDate.getMonth() === month && tradeDate.getFullYear() === year) {
                const day = tradeDate.getDate();
                if (!tradesData[day]) tradesData[day] = { count: 0, pnl: 0 };
                tradesData[day].count++;
                
                if (trade.status === 'closed') {
                    tradesData[day].pnl += parseFloat(trade.pnl || 0);
                }
            }
        });
        
        let html = '<div class="calendar-grid">';
        
        // Jours de la semaine
        ['D', 'L', 'M', 'M', 'J', 'V', 'S'].forEach(day => {
            html += `<div class="calendar-day-header">${day}</div>`;
        });
        
        // Jours du mois
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
        
        console.log('📅 Calendrier mobile mis à jour');
    }

    async addTrade(tradeData) {
        const trade = {
            ...tradeData,
            id: `${this.currentUser}_${Date.now()}`,
            status: 'open',
            createdAt: Date.now()
        };
        
        this.trades.push(trade);
        await this.saveData();
        this.updateMobileStats();
        this.updateMobileTradesList();
        this.updateMobileCalendar();
        
        console.log('✅ Trade ajouté:', trade.currency);
    }

    async closeTrade(index, result) {
        const trade = this.trades[index];
        if (!trade || trade.status !== 'open') {
            console.error('❌ Trade invalide ou déjà fermé');
            return;
        }
        
        let closePrice = 0;
        
        switch(result) {
            case 'TP':
                closePrice = parseFloat(trade.takeProfit);
                break;
            case 'SL':
                closePrice = parseFloat(trade.stopLoss);
                break;
            case 'BE':
                closePrice = parseFloat(trade.entryPoint);
                break;
            default:
                console.error('❌ Type de clôture invalide');
                return;
        }
        
        trade.status = 'closed';
        trade.result = result;
        trade.closePrice = closePrice;
        trade.closeDate = new Date().toISOString().split('T')[0];
        trade.pnl = this.calculatePnL(trade);
        
        await this.saveData();
        this.updateMobileStats();
        this.updateMobileTradesList();
        this.updateMobileCalendar();
        
        const emoji = result === 'TP' ? '✅' : result === 'SL' ? '❌' : '⚖️';
        this.showMobileNotification(`${emoji} Trade clôturé en ${result}: ${trade.pnl > 0 ? '+' : ''}$${trade.pnl.toFixed(2)}`);
        
        console.log('✅ Trade clôturé:', trade.currency, result);
    }

    calculatePnL(trade) {
        const entryPoint = parseFloat(trade.entryPoint);
        const closePrice = parseFloat(trade.closePrice);
        const lotSize = parseFloat(trade.lotSize);
        const currency = trade.currency;
        
        if (!entryPoint || !closePrice || !lotSize) return 0;
        
        let priceDiff = closePrice - entryPoint;
        
        const isLong = parseFloat(trade.takeProfit) > entryPoint;
        if (!isLong) priceDiff = -priceDiff;
        
        let pnl = 0;
        
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

    showMobileNotification(message) {
        // Créer notification mobile
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
            border-radius: 8px;
            z-index: 10000;
            animation: slideDown 0.3s ease;
            max-width: 90%;
            text-align: center;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideUp 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Méthodes pour compatibilité avec les boutons existants
    async newTrade() {
        if (window.showTradeModal) {
            window.showTradeModal();
        } else {
            console.log('📱 Modal trade non disponible');
        }
    }

    async refreshData() {
        await this.loadData();
        this.updateMobileStats();
        this.updateMobileTradesList();
        this.updateMobileCalendar();
        console.log('🔄 Données rafraîchies');
    }
}

// Instance globale
let mobileDashboard = null;

// Initialisation
async function initMobileDashboard() {
    if (mobileDashboard) return mobileDashboard;
    
    console.log('🚀 Initialisation Mobile Dashboard...');
    
    // Attendre Firebase
    let attempts = 0;
    while (!window.firebaseDB && attempts < 10) {
        await new Promise(resolve => setTimeout(resolve, 500));
        attempts++;
    }
    
    mobileDashboard = new MobileDashboardSync();
    await mobileDashboard.init();
    
    // Exposer globalement
    window.mobileDashboard = mobileDashboard;
    
    // Connecter aux boutons existants
    const newTradeBtn = document.getElementById('newTradeBtn');
    const addTradeBtn = document.getElementById('addTradeBtn');
    
    if (newTradeBtn) {
        newTradeBtn.onclick = () => mobileDashboard.newTrade();
    }
    if (addTradeBtn) {
        addTradeBtn.onclick = () => mobileDashboard.newTrade();
    }
    
    console.log('✅ Mobile Dashboard initialisé');
    return mobileDashboard;
}

// Auto-initialisation
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMobileDashboard);
} else {
    setTimeout(initMobileDashboard, 1000);
}

// Initialisation de secours
window.addEventListener('load', () => {
    if (!mobileDashboard) {
        setTimeout(initMobileDashboard, 2000);
    }
});

console.log('📱 Mobile Dashboard Sync chargé');