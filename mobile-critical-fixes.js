// Corrections critiques pour mobile - Boutons supprimer, Calendrier, Notifications
console.log('🔧 Chargement corrections critiques mobile...');

class MobileCriticalFixer {
    constructor() {
        this.init();
    }

    init() {
        console.log('🔧 Initialisation corrections critiques mobile...');
        
        // Attendre que le DOM soit prêt
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.applyFixes());
        } else {
            this.applyFixes();
        }
    }

    applyFixes() {
        console.log('🔧 Application des corrections critiques...');
        
        // Fix 1: Boutons supprimer dans les trades
        setTimeout(() => this.fixDeleteButtons(), 1000);
        
        // Fix 2: Calendrier qui ne se met pas à jour
        setTimeout(() => this.fixCalendarUpdates(), 1500);
        
        // Fix 3: Notifications push
        setTimeout(() => this.fixPushNotifications(), 2000);
    }

    // ========================================
    // FIX 1: BOUTONS SUPPRIMER TRADES
    // ========================================
    fixDeleteButtons() {
        console.log('🔧 Correction des boutons supprimer...');
        
        // Observer les changements dans la liste des trades
        const tradesContainer = document.getElementById('mobileTradesList');
        if (!tradesContainer) {
            console.warn('⚠️ Container mobileTradesList non trouvé');
            return;
        }

        // Fonction pour corriger les boutons dans le container
        const fixButtonsInContainer = () => {
            const deleteButtons = tradesContainer.querySelectorAll('.btn-delete');
            console.log(`🔧 ${deleteButtons.length} boutons supprimer trouvés`);
            
            deleteButtons.forEach((button, index) => {
                // Supprimer l'ancien onclick
                button.removeAttribute('onclick');
                
                // Créer un nouveau bouton pour éviter les conflits
                const newButton = button.cloneNode(true);
                button.parentNode.replaceChild(newButton, button);
                
                // Ajouter le nouvel événement
                newButton.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log(`🗑️ Suppression trade index ${index}`);
                    this.deleteMobileTrade(index);
                });
                
                console.log(`✅ Bouton supprimer ${index} corrigé`);
            });
        };

        // Corriger immédiatement
        fixButtonsInContainer();

        // Observer les changements pour corriger les nouveaux boutons
        const observer = new MutationObserver((mutations) => {
            let shouldFix = false;
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === 1 && (
                            node.classList?.contains('trade-item') ||
                            node.querySelector?.('.btn-delete')
                        )) {
                            shouldFix = true;
                        }
                    });
                }
            });
            
            if (shouldFix) {
                console.log('🔄 Nouveaux trades détectés, correction des boutons...');
                setTimeout(fixButtonsInContainer, 100);
            }
        });

        observer.observe(tradesContainer, {
            childList: true,
            subtree: true
        });

        console.log('✅ Correction boutons supprimer activée');
    }

    // Fonction de suppression de trade mobile
    async deleteMobileTrade(index) {
        console.log(`🗑️ Suppression du trade à l'index ${index}`);
        
        if (!confirm('Supprimer ce trade ?')) {
            return;
        }

        try {
            // Récupérer les données de trades
            let trades = [];
            
            if (window.mobileData && Array.isArray(window.mobileData.trades)) {
                trades = window.mobileData.trades;
            } else if (window.mobileTradesData && Array.isArray(window.mobileTradesData)) {
                trades = window.mobileTradesData;
            } else {
                console.error('❌ Aucune donnée de trades trouvée');
                alert('❌ Erreur: Données de trades non trouvées');
                return;
            }

            if (index < 0 || index >= trades.length) {
                console.error('❌ Index invalide:', index, 'sur', trades.length, 'trades');
                alert('❌ Erreur: Trade non trouvé');
                return;
            }

            const tradeToDelete = trades[index];
            console.log('🗑️ Trade à supprimer:', tradeToDelete);

            // Supprimer le trade
            trades.splice(index, 1);
            
            // Mettre à jour les données globales
            if (window.mobileData) {
                window.mobileData.trades = trades;
            }
            if (window.mobileTradesData) {
                window.mobileTradesData = trades;
            }

            // Sauvegarder
            if (window.saveMobileTrades) {
                await window.saveMobileTrades();
            } else if (window.saveMobileDataComplete) {
                await window.saveMobileDataComplete();
            }

            // Mettre à jour l'affichage
            if (window.updateMobileTradesList) {
                window.updateMobileTradesList();
            }
            if (window.updateMobileStats) {
                window.updateMobileStats();
            }
            if (window.updateMobileCalendar) {
                window.updateMobileCalendar();
            }

            console.log('✅ Trade supprimé avec succès');
            alert('✅ Trade supprimé');

        } catch (error) {
            console.error('❌ Erreur suppression trade:', error);
            alert('❌ Erreur lors de la suppression');
        }
    }

    // ========================================
    // FIX 2: CALENDRIER QUI NE SE MET PAS À JOUR
    // ========================================
    fixCalendarUpdates() {
        console.log('📅 Correction mise à jour calendrier...');

        // Fonction de mise à jour forcée du calendrier
        const forceCalendarUpdate = () => {
            console.log('📅 Mise à jour forcée du calendrier mobile...');
            
            const calendar = document.getElementById('mobileCalendar');
            if (!calendar) {
                console.warn('⚠️ Calendrier mobile non trouvé');
                return;
            }

            // Récupérer les trades depuis toutes les sources possibles
            let trades = [];
            
            if (window.mobileData && Array.isArray(window.mobileData.trades)) {
                trades = window.mobileData.trades;
                console.log('📅 Utilisation mobileData.trades:', trades.length);
            } else if (window.mobileTradesData && Array.isArray(window.mobileTradesData)) {
                trades = window.mobileTradesData;
                console.log('📅 Utilisation mobileTradesData:', trades.length);
            } else {
                // Essayer localStorage
                const sources = [
                    'mobileData',
                    'trades',
                    `trades_${sessionStorage.getItem('firebaseUID')}`,
                    'dashboard_data'
                ];
                
                for (const source of sources) {
                    try {
                        const data = localStorage.getItem(source);
                        if (data) {
                            const parsed = JSON.parse(data);
                            if (Array.isArray(parsed)) {
                                trades = parsed;
                                console.log(`📅 Utilisation localStorage ${source}:`, trades.length);
                                break;
                            } else if (parsed.trades && Array.isArray(parsed.trades)) {
                                trades = parsed.trades;
                                console.log(`📅 Utilisation localStorage ${source}.trades:`, trades.length);
                                break;
                            }
                        }
                    } catch (e) {}
                }
            }

            console.log(`📅 ${trades.length} trades trouvés pour le calendrier`);

            // Générer le calendrier avec les trades
            this.renderMobileCalendar(trades);
        };

        // Intercepter les fonctions de sauvegarde pour forcer la mise à jour
        const originalSaveFunctions = [
            'saveMobileTrades',
            'saveMobileDataComplete',
            'closeTrade',
            'saveMobileTrade'
        ];

        originalSaveFunctions.forEach(funcName => {
            if (window[funcName]) {
                const originalFunc = window[funcName];
                window[funcName] = async function(...args) {
                    console.log(`📅 Interception ${funcName} pour mise à jour calendrier`);
                    
                    // Appeler la fonction originale
                    const result = await originalFunc.apply(this, args);
                    
                    // Forcer la mise à jour du calendrier après un délai
                    setTimeout(() => {
                        forceCalendarUpdate();
                    }, 500);
                    
                    return result;
                };
                console.log(`✅ ${funcName} interceptée pour calendrier`);
            }
        });

        // Fonction globale de mise à jour
        window.forceCalendarUpdate = forceCalendarUpdate;
        
        // Mise à jour initiale
        setTimeout(forceCalendarUpdate, 1000);

        console.log('✅ Correction calendrier activée');
    }

    renderMobileCalendar(trades) {
        const calendar = document.getElementById('mobileCalendar');
        if (!calendar) return;

        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDay = new Date(year, month, 1).getDay();

        // Calculer les données par jour
        const tradesData = {};
        
        trades.forEach(trade => {
            if (!trade) return;
            
            let tradeDate;
            
            // Essayer différents formats de date
            if (trade.date) {
                tradeDate = new Date(trade.date);
            } else if (trade.closeDate) {
                tradeDate = new Date(trade.closeDate);
            } else if (trade.timestamp) {
                tradeDate = new Date(trade.timestamp);
            } else if (trade.createdAt) {
                tradeDate = new Date(trade.createdAt);
            }
            
            if (tradeDate && !isNaN(tradeDate.getTime())) {
                if (tradeDate.getMonth() === month && tradeDate.getFullYear() === year) {
                    const day = tradeDate.getDate();
                    if (!tradesData[day]) {
                        tradesData[day] = { count: 0, pnl: 0 };
                    }
                    tradesData[day].count++;
                    
                    // Calculer P&L seulement pour les trades fermés
                    if (trade.status === 'closed' || trade.status === 'tp' || trade.status === 'sl') {
                        const pnl = parseFloat(trade.pnl) || 0;
                        tradesData[day].pnl += pnl;
                    }
                }
            }
        });

        // Générer le HTML du calendrier
        const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
                      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

        let html = `
            <div class="calendar-header">
                <h3>${months[month]} ${year}</h3>
            </div>
            <div class="calendar-grid">
        `;

        // Jours de la semaine
        const dayNames = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];
        dayNames.forEach(day => {
            html += `<div class="calendar-day-header">${day}</div>`;
        });

        // Jours vides au début
        for (let i = 0; i < firstDay; i++) {
            html += '<div class="calendar-day empty"></div>';
        }

        // Jours du mois
        for (let day = 1; day <= daysInMonth; day++) {
            const dayData = tradesData[day];
            const hasData = dayData && dayData.count > 0;
            
            let dayClass = 'calendar-day';
            if (hasData) {
                if (dayData.pnl > 0) dayClass += ' profit-day';
                else if (dayData.pnl < 0) dayClass += ' loss-day';
                else dayClass += ' neutral-day';
            }
            
            if (day === today.getDate()) {
                dayClass += ' today';
            }

            html += `<div class="${dayClass}">`;
            html += `<div class="calendar-date">${day}</div>`;
            
            if (hasData) {
                html += `<div class="calendar-trades">${dayData.count}T</div>`;
                if (dayData.pnl !== 0) {
                    const sign = dayData.pnl > 0 ? '+' : '';
                    html += `<div class="calendar-pnl ${dayData.pnl > 0 ? 'positive' : 'negative'}">${sign}$${dayData.pnl.toFixed(0)}</div>`;
                }
            }
            
            html += '</div>';
        }

        html += '</div>';
        calendar.innerHTML = html;

        console.log(`✅ Calendrier rendu avec ${Object.keys(tradesData).length} jours de trading`);
    }

    // ========================================
    // FIX 3: NOTIFICATIONS PUSH
    // ========================================
    fixPushNotifications() {
        console.log('🔔 Correction notifications push...');

        // Vérifier le support des notifications
        if (!('Notification' in window)) {
            console.error('❌ Notifications non supportées par ce navigateur');
            return;
        }

        // Fonction pour demander les permissions
        const requestNotificationPermission = async () => {
            try {
                const permission = await Notification.requestPermission();
                console.log('🔔 Permission notifications:', permission);
                
                if (permission === 'granted') {
                    // Test notification
                    const testNotif = new Notification('✅ Notifications activées !', {
                        body: 'Vous recevrez maintenant les notifications du chat VIP',
                        icon: './Misterpips.jpg',
                        badge: './Misterpips.jpg',
                        tag: 'misterpips-test',
                        requireInteraction: false,
                        silent: false
                    });
                    
                    setTimeout(() => testNotif.close(), 5000);
                    
                    // Mettre à jour le bouton
                    const activateBtn = document.getElementById('activateNotificationsBtn');
                    if (activateBtn) {
                        activateBtn.textContent = '✅ Notifications Activées';
                        activateBtn.style.background = '#28a745';
                        activateBtn.disabled = true;
                    }
                    
                    return true;
                } else {
                    console.warn('⚠️ Permission notifications refusée');
                    return false;
                }
            } catch (error) {
                console.error('❌ Erreur demande permission:', error);
                return false;
            }
        };

        // Corriger le bouton d'activation
        const activateBtn = document.getElementById('activateNotificationsBtn');
        if (activateBtn) {
            // Supprimer les anciens événements
            const newBtn = activateBtn.cloneNode(true);
            activateBtn.parentNode.replaceChild(newBtn, activateBtn);
            
            // Ajouter le nouvel événement
            newBtn.addEventListener('click', async (e) => {
                e.preventDefault();
                console.log('🔔 Activation notifications demandée');
                
                const success = await requestNotificationPermission();
                if (success) {
                    // Activer les notifications dans les paramètres
                    const pushToggle = document.getElementById('mobilePushToggle');
                    if (pushToggle) {
                        pushToggle.checked = true;
                        
                        // Sauvegarder les paramètres
                        const settings = {
                            sound: document.getElementById('mobileSoundToggle')?.checked || true,
                            push: true,
                            vibrate: document.getElementById('mobileVibrateToggle')?.checked || true
                        };
                        
                        localStorage.setItem('mobileNotificationSettings', JSON.stringify(settings));
                        console.log('✅ Paramètres notifications sauvegardés');
                    }
                }
            });
            
            // Vérifier l'état actuel
            if (Notification.permission === 'granted') {
                newBtn.textContent = '✅ Notifications Activées';
                newBtn.style.background = '#28a745';
                newBtn.disabled = true;
            } else if (Notification.permission === 'denied') {
                newBtn.textContent = '❌ Permissions Refusées';
                newBtn.style.background = '#dc3545';
                newBtn.disabled = true;
            }
        }

        // Améliorer la fonction de notification
        const enhancedNotificationFunction = (message) => {
            console.log('🔔 Affichage notification améliorée:', message);
            
            if (Notification.permission !== 'granted') {
                console.log('❌ Permissions non accordées');
                return;
            }

            // Récupérer les paramètres
            const settings = this.getNotificationSettings();
            if (!settings.push) {
                console.log('🔕 Notifications push désactivées');
                return;
            }

            // Ne pas notifier si on est sur le chat et que l'app est active
            if (document.hasFocus() && this.isOnChatSection()) {
                console.log('🔕 Pas de notification - sur le chat');
                if (settings.sound) {
                    this.playNotificationSound();
                }
                return;
            }

            try {
                const notification = new Notification(`💬 ${message.nickname}`, {
                    body: message.message.substring(0, 100),
                    icon: './Misterpips.jpg',
                    badge: './Misterpips.jpg',
                    tag: 'misterpips-chat-' + Date.now(),
                    requireInteraction: false,
                    silent: true, // Gérer le son manuellement
                    vibrate: settings.vibrate ? [300, 100, 300] : []
                });

                // Son personnalisé
                if (settings.sound) {
                    this.playNotificationSound();
                }

                // Vibration
                if (settings.vibrate && 'vibrate' in navigator) {
                    navigator.vibrate([300, 100, 300]);
                }

                // Clic pour ouvrir
                notification.onclick = () => {
                    window.focus();
                    this.showChatSection();
                    notification.close();
                };

                // Auto-fermer
                setTimeout(() => {
                    try {
                        notification.close();
                    } catch (e) {}
                }, 10000);

                console.log('✅ Notification affichée');

            } catch (error) {
                console.error('❌ Erreur création notification:', error);
            }
        };

        // Remplacer la fonction globale
        window.showMobileChatNotification = enhancedNotificationFunction;

        console.log('✅ Notifications push corrigées');
    }

    // Fonctions utilitaires pour les notifications
    getNotificationSettings() {
        try {
            return JSON.parse(localStorage.getItem('mobileNotificationSettings')) || {
                sound: true,
                push: true,
                vibrate: true
            };
        } catch (e) {
            return { sound: true, push: true, vibrate: true };
        }
    }

    isOnChatSection() {
        const chatSection = document.getElementById('chat');
        return chatSection && chatSection.classList.contains('active');
    }

    showChatSection() {
        // Afficher la section chat
        document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
        const chatSection = document.getElementById('chat');
        if (chatSection) {
            chatSection.classList.add('active');
        }
        
        // Mettre à jour la navigation
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        const chatNavBtn = document.querySelector('.nav-btn[onclick*="chat"]');
        if (chatNavBtn) {
            chatNavBtn.classList.add('active');
        }
    }

    playNotificationSound() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);

            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);

            console.log('🔊 Son notification joué');
        } catch (error) {
            console.log('❌ Erreur son:', error);
        }
    }
}

// Initialiser les corrections
let mobileCriticalFixer;

function initMobileCriticalFixes() {
    if (!mobileCriticalFixer) {
        mobileCriticalFixer = new MobileCriticalFixer();
        window.mobileCriticalFixer = mobileCriticalFixer;
        console.log('✅ Corrections critiques mobile initialisées');
    }
}

// Lancer immédiatement
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMobileCriticalFixes);
} else {
    initMobileCriticalFixes();
}

// Fonction globale pour forcer les corrections
window.fixMobileCritical = () => {
    if (mobileCriticalFixer) {
        mobileCriticalFixer.applyFixes();
    } else {
        initMobileCriticalFixes();
    }
};

console.log('✅ Script corrections critiques mobile prêt');