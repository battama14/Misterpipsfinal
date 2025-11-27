// Corrections pour le Dashboard PC
console.log('🔧 Chargement des corrections dashboard...');

// 1. Correction de la date du calendrier
function fixCalendarDate() {
    const today = new Date();
    console.log('📅 Date actuelle:', today.toLocaleDateString('fr-FR'));
    
    // Forcer la mise à jour de la date dans le calendrier
    if (window.dashboard && window.dashboard.currentCalendarDate) {
        window.dashboard.currentCalendarDate = new Date();
        window.dashboard.renderCalendar();
        console.log('✅ Calendrier mis à jour avec la date correcte');
    }
}

// 2. Correction de la modification des trades fermés
function fixTradeModification() {
    if (!window.dashboard) return;
    
    // Remplacer la fonction saveEditedClosedTrade pour forcer la sauvegarde
    const originalSaveEditedClosedTrade = window.dashboard.saveEditedClosedTrade;
    
    window.dashboard.saveEditedClosedTrade = function(index) {
        console.log('🔧 Modification trade fermé - index:', index);
        
        const trade = this.trades[index];
        if (!trade) {
            console.error('Trade non trouvé à l\'index:', index);
            return;
        }
        
        const date = document.getElementById('editTradeDate')?.value;
        const currency = document.getElementById('editCurrency')?.value;
        const entryPoint = parseFloat(document.getElementById('editEntryPoint')?.value);
        const stopLoss = parseFloat(document.getElementById('editStopLoss')?.value);
        const takeProfit = parseFloat(document.getElementById('editTakeProfit')?.value);
        const lotSize = parseFloat(document.getElementById('editLotSize')?.value);
        const result = document.getElementById('editResult')?.value;
        const pnl = parseFloat(document.getElementById('editPnL')?.value);

        if (!date || !currency || !entryPoint || !stopLoss || !takeProfit || !lotSize) {
            alert('Veuillez remplir tous les champs obligatoires');
            return;
        }

        console.log('📝 Modification des données du trade:', {
            date, currency, entryPoint, stopLoss, takeProfit, lotSize, result, pnl
        });

        // Appliquer les modifications
        trade.date = date;
        trade.currency = currency;
        trade.entryPoint = entryPoint;
        trade.stopLoss = stopLoss;
        trade.takeProfit = takeProfit;
        trade.lotSize = lotSize;
        
        if (result) {
            trade.result = result;
            if (result === 'TP') {
                trade.closePrice = takeProfit;
            } else if (result === 'SL') {
                trade.closePrice = stopLoss;
            } else if (result === 'BE') {
                trade.closePrice = entryPoint;
            }
            // Recalculer le P&L automatiquement
            trade.pnl = this.calculatePnL(trade);
        } else if (!isNaN(pnl)) {
            trade.pnl = pnl;
        }
        
        trade.modifiedAt = Date.now();
        
        console.log('💾 Sauvegarde forcée du trade modifié...');
        
        // Forcer la sauvegarde immédiate
        this.saveData().then(() => {
            console.log('✅ Trade modifié et sauvegardé');
            this.closeModal();
            this.fullDashboardUpdate();
            this.showNotification('Trade modifié avec succès!');
        }).catch(error => {
            console.error('❌ Erreur sauvegarde:', error);
            // Sauvegarder en local en cas d'erreur Firebase
            this.saveToLocalStorage();
            this.closeModal();
            this.fullDashboardUpdate();
            this.showNotification('Trade modifié (sauvegarde locale)');
        });
    };
    
    console.log('✅ Correction modification trades appliquée');
}

// 3. Correction de l'affichage de tous les trades (pas seulement les 10 derniers)
function fixTradesDisplay() {
    if (!window.dashboard) return;
    
    // Remplacer la fonction renderTradesTable pour afficher tous les trades
    const originalRenderTradesTable = window.dashboard.renderTradesTable;
    
    window.dashboard.renderTradesTable = function() {
        const tbody = document.querySelector('#tradesTable tbody');
        if (!tbody) return;
        
        tbody.innerHTML = '';
        
        // Afficher TOUS les trades (pas seulement les 10 derniers)
        const allTrades = [...this.trades].reverse(); // Inverser pour avoir les plus récents en premier
        
        console.log(`📊 Affichage de ${allTrades.length} trades (tous)`);
        
        allTrades.forEach((trade, index) => {
            const originalIndex = this.trades.length - 1 - index; // Index réel dans le tableau original
            const row = document.createElement('tr');
            const pnl = parseFloat(trade.pnl || 0);
            const pnlClass = pnl > 0 ? 'positive' : pnl < 0 ? 'negative' : '';
            
            row.innerHTML = `
                <td>${trade.date}</td>
                <td>${trade.currency}</td>
                <td>${trade.entryPoint}</td>
                <td>${trade.stopLoss}</td>
                <td>${trade.takeProfit}</td>
                <td>${trade.lotSize}</td>
                <td>${trade.result || (trade.status === 'open' ? 'OPEN' : '-')}</td>
                <td class="${pnlClass}">$${pnl.toFixed(2)}</td>
                <td>
                    ${trade.status === 'open' ? 
                        `<button class="btn-small btn-primary" onclick="dashboard.editTrade(${originalIndex})" style="margin-right: 5px;">Modifier</button><button class="btn-small btn-danger" onclick="dashboard.quickCloseTrade(${originalIndex})">Clôturer</button>` : 
                        `<button class="btn-small btn-warning" onclick="dashboard.editClosedTrade(${originalIndex})" style="font-size: 11px;">✏️ Modifier</button>`
                    }
                </td>
            `;
            tbody.appendChild(row);
        });
        
        console.log('✅ Tableau des trades mis à jour avec tous les trades');
    };
    
    console.log('✅ Correction affichage trades appliquée');
}

// 4. Rendre les jours du calendrier cliquables
function fixCalendarClickable() {
    if (!window.dashboard) return;
    
    // Remplacer la fonction renderCalendar pour ajouter les événements de clic
    const originalRenderCalendar = window.dashboard.renderCalendar;
    
    window.dashboard.renderCalendar = function() {
        // Appeler la fonction originale
        originalRenderCalendar.call(this);
        
        // Ajouter les événements de clic sur les jours
        const calendarDays = document.querySelectorAll('.calendar-day');
        calendarDays.forEach(dayElement => {
            if (!dayElement.classList.contains('other-month')) {
                dayElement.style.cursor = 'pointer';
                dayElement.addEventListener('click', (e) => {
                    const day = e.target.getAttribute('data-day');
                    const tradeInfo = e.target.getAttribute('data-trade-info');
                    
                    if (tradeInfo) {
                        alert(`📅 ${day} - Détails:\n\n${tradeInfo}`);
                    } else {
                        const year = this.currentCalendarDate.getFullYear();
                        const month = this.currentCalendarDate.getMonth() + 1;
                        const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                        
                        if (confirm(`📅 ${day}/${month}/${year}\n\nAucun trade ce jour-là.\nVoulez-vous ajouter un trade pour cette date ?`)) {
                            // Pré-remplir la date dans le modal de trade passé
                            this.showHistoryTradeModal();
                            setTimeout(() => {
                                const dateInput = document.getElementById('historyDate');
                                if (dateInput) {
                                    dateInput.value = dateStr;
                                }
                            }, 100);
                        }
                    }
                });
            }
        });
        
        console.log('✅ Calendrier rendu cliquable');
    };
    
    console.log('✅ Correction calendrier cliquable appliquée');
}

// Appliquer toutes les corrections
function applyAllFixes() {
    console.log('🔧 Application de toutes les corrections...');
    
    // Attendre que le dashboard soit initialisé
    const checkDashboard = setInterval(() => {
        if (window.dashboard) {
            clearInterval(checkDashboard);
            
            fixCalendarDate();
            fixTradeModification();
            fixTradesDisplay();
            fixCalendarClickable();
            
            // Forcer une mise à jour complète
            setTimeout(() => {
                window.dashboard.fullDashboardUpdate();
                console.log('✅ Toutes les corrections appliquées et dashboard mis à jour');
            }, 500);
        }
    }, 100);
    
    // Timeout de sécurité
    setTimeout(() => {
        clearInterval(checkDashboard);
        if (!window.dashboard) {
            console.warn('⚠️ Dashboard non initialisé après 10 secondes');
        }
    }, 10000);
}

// Démarrer les corrections
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyAllFixes);
} else {
    applyAllFixes();
}

console.log('✅ Script de corrections dashboard chargé');