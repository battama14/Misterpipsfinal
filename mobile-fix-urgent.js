// ========================================
// FIX URGENT MOBILE - Menu, Chat, Graphiques
// ========================================

console.log('🔧 Chargement fix urgent mobile v2...');

// Attendre que tout soit chargé
window.addEventListener('load', function() {
    console.log('✅ Page chargée, application des correctifs...');
    
    // ========================================
    // 1. FIX MENU NAVIGATION
    // ========================================
    setTimeout(() => {
        const menuToggle = document.getElementById('menuToggle');
        const mobileMenu = document.getElementById('mobileMenu');
        const menuOverlay = document.getElementById('menuOverlay');
        const closeMenu = document.getElementById('closeMenu');
        
        if (menuToggle && mobileMenu && menuOverlay) {
            console.log('🔧 Fix menu navigation...');
            
            // Supprimer tous les anciens listeners
            const newMenuToggle = menuToggle.cloneNode(true);
            menuToggle.parentNode.replaceChild(newMenuToggle, menuToggle);
            
            const newCloseMenu = closeMenu.cloneNode(true);
            closeMenu.parentNode.replaceChild(newCloseMenu, closeMenu);
            
            const newOverlay = menuOverlay.cloneNode(true);
            menuOverlay.parentNode.replaceChild(newOverlay, menuOverlay);
            
            // Ajouter les nouveaux listeners
            newMenuToggle.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('📱 Ouverture menu');
                document.getElementById('mobileMenu').classList.add('active');
                document.getElementById('menuOverlay').classList.add('active');
            });
            
            function closeMenuFunc() {
                console.log('📱 Fermeture menu');
                document.getElementById('mobileMenu').classList.remove('active');
                document.getElementById('menuOverlay').classList.remove('active');
            }
            
            newCloseMenu.addEventListener('click', closeMenuFunc);
            newOverlay.addEventListener('click', closeMenuFunc);
            
            // Fix liens du menu
            const menuLinks = document.querySelectorAll('.menu-list a[data-section]');
            menuLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const section = link.getAttribute('data-section');
                    console.log('📱 Navigation vers:', section);
                    if (window.showMobileSection) {
                        window.showMobileSection(section);
                    }
                    closeMenuFunc();
                });
            });
            
            console.log('✅ Menu fixé');
        }
    }, 500);
    
    // ========================================
    // 2. FIX NAVIGATION BOTTOM
    // ========================================
    setTimeout(() => {
        console.log('🔧 Fix navigation bottom...');
        const navBtns = document.querySelectorAll('.bottom-nav .nav-btn');
        
        navBtns.forEach((btn, index) => {
            // Supprimer onclick
            btn.removeAttribute('onclick');
            
            // Déterminer la section
            let section = 'dashboard';
            if (index === 1) section = 'trades';
            else if (index === 2) section = 'calendar';
            else if (index === 3) section = 'chat';
            else if (index === 4) section = 'ranking';
            
            // Ajouter le nouvel event listener
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('📱 Navigation bottom vers:', section);
                
                // Retirer active de tous les boutons
                navBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Afficher la section
                document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
                const targetSection = document.getElementById(section);
                if (targetSection) {
                    targetSection.classList.add('active');
                    console.log('✅ Section affichée:', section);
                }
                
                // Reset badge si chat
                if (section === 'chat' && window.resetUnreadCount) {
                    window.resetUnreadCount();
                }
            });
        });
        
        console.log('✅ Navigation bottom fixée');
    }, 600);
    
    // ========================================
    // 3. FIX CHAT - AFFICHAGE ET ENVOI
    // ========================================
    setTimeout(() => {
        console.log('🔧 Fix chat complet...');
        const sendBtn = document.getElementById('sendBtn');
        const chatInput = document.getElementById('chatInput');
        
        if (sendBtn && chatInput) {
            // Supprimer anciens listeners
            const newSendBtn = sendBtn.cloneNode(true);
            sendBtn.parentNode.replaceChild(newSendBtn, sendBtn);
            
            const newChatInput = chatInput.cloneNode(true);
            chatInput.parentNode.replaceChild(newChatInput, chatInput);
            
            // Fonction d'envoi
            async function sendChatMessage() {
                const input = document.getElementById('chatInput');
                const message = input.value.trim();
                
                if (!message) {
                    console.log('❌ Message vide');
                    return;
                }
                
                console.log('📤 Envoi message:', message);
                
                if (!window.firebaseDB) {
                    console.error('❌ Firebase non prêt');
                    alert('⚠️ Connexion Firebase en cours...');
                    return;
                }
                
                const uid = sessionStorage.getItem('firebaseUID');
                const nickname = sessionStorage.getItem('userNickname') || 'Utilisateur';
                
                const messageData = {
                    id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                    userId: uid,
                    nickname: nickname,
                    message: message,
                    timestamp: Date.now(),
                    type: 'text'
                };
                
                input.value = '';
                
                try {
                    const { ref, push } = await import('https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js');
                    const messagesRef = ref(window.firebaseDB, 'vip_chat');
                    await push(messagesRef, messageData);
                    console.log('✅ Message envoyé avec succès');
                } catch (error) {
                    console.error('❌ Erreur envoi:', error);
                    alert('❌ Erreur lors de l\'envoi du message');
                    input.value = message; // Restaurer le message
                }
            }
            
            // Ajouter les nouveaux listeners
            newSendBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                sendChatMessage();
            });
            
            newChatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    sendChatMessage();
                }
            });
            
            console.log('✅ Chat envoi fixé');
        }
        
        // FIX AFFICHAGE DES MESSAGES
        console.log('🔧 Fix affichage messages chat...');
        
        // Fonction pour charger et afficher les messages
        async function loadAndDisplayMobileChat() {
            console.log('📥 Chargement messages chat...');
            
            if (!window.firebaseDB) {
                console.error('❌ Firebase non disponible');
                setTimeout(loadAndDisplayMobileChat, 2000);
                return;
            }
            
            try {
                const { ref, onValue } = await import('https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js');
                const messagesRef = ref(window.firebaseDB, 'vip_chat');
                
                onValue(messagesRef, (snapshot) => {
                    const container = document.getElementById('chatMessages');
                    if (!container) {
                        console.error('❌ Container chatMessages non trouvé');
                        return;
                    }
                    
                    console.log('📨 Mise à jour messages...');
                    container.innerHTML = '';
                    
                    if (snapshot.exists()) {
                        const messages = Object.values(snapshot.val())
                            .sort((a, b) => a.timestamp - b.timestamp)
                            .slice(-50);
                        
                        console.log(`✅ ${messages.length} messages chargés`);
                        
                        const myUID = sessionStorage.getItem('firebaseUID');
                        
                        messages.forEach(msg => {
                            const messageDiv = document.createElement('div');
                            const isOwn = msg.userId === myUID;
                            messageDiv.className = `message ${isOwn ? 'sent' : 'received'}`;
                            
                            const time = new Date(msg.timestamp).toLocaleTimeString('fr-FR', {
                                hour: '2-digit',
                                minute: '2-digit'
                            });
                            
                            messageDiv.innerHTML = `
                                <div class="message-content">
                                    <div class="message-text">${msg.message}</div>
                                    <div class="message-info">
                                        <span class="message-sender">${msg.nickname}</span>
                                        <span class="message-time">${time}</span>
                                    </div>
                                </div>
                            `;
                            
                            container.appendChild(messageDiv);
                        });
                        
                        // Scroll vers le bas
                        container.scrollTop = container.scrollHeight;
                        console.log('✅ Messages affichés');
                        
                    } else {
                        container.innerHTML = '<div class="no-messages">💬 Aucun message</div>';
                        console.log('ℹ️ Aucun message dans le chat');
                    }
                });
                
            } catch (error) {
                console.error('❌ Erreur chargement chat:', error);
            }
        }
        
        // Lancer le chargement
        loadAndDisplayMobileChat();
        
        // Exposer globalement
        window.loadAndDisplayMobileChat = loadAndDisplayMobileChat;
        
    }, 1000);
    
    // ========================================
    // 4. FIX GRAPHIQUES - AFFICHAGE FORCÉ
    // ========================================
    
    // Fonction pour vérifier et initialiser les graphiques
    function tryInitCharts(attempt = 1) {
        console.log(`🔧 Tentative ${attempt} d'initialisation des graphiques...`);
        
        // Vérifier que Chart.js est chargé
        if (typeof Chart === 'undefined') {
            console.error(`❌ Tentative ${attempt}: Chart.js non chargé !`);
            
            if (attempt === 1) {
                console.log('📥 Chargement manuel de Chart.js...');
                const script = document.createElement('script');
                script.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js';
                script.onload = () => {
                    console.log('✅ Chart.js chargé manuellement');
                    setTimeout(() => tryInitCharts(2), 500);
                };
                script.onerror = () => {
                    console.error('❌ Impossible de charger Chart.js');
                };
                document.head.appendChild(script);
            } else if (attempt < 5) {
                setTimeout(() => tryInitCharts(attempt + 1), 1000);
            } else {
                console.error('❌ ÉCHEC: Chart.js ne se charge pas après 5 tentatives');
            }
            return;
        }
        
        console.log(`✅ Tentative ${attempt}: Chart.js disponible (version ${Chart.version})`);
        
        // Vérifier que les canvas existent
        const perfCanvas = document.getElementById('mobilePerformanceChart');
        const winCanvas = document.getElementById('mobileWinRateChart');
        
        if (!perfCanvas || !winCanvas) {
            console.error(`❌ Tentative ${attempt}: Canvas non trouvés`, {
                perfCanvas: !!perfCanvas,
                winCanvas: !!winCanvas
            });
            
            if (attempt < 5) {
                setTimeout(() => tryInitCharts(attempt + 1), 1000);
            } else {
                console.error('❌ ÉCHEC: Canvas non trouvés après 5 tentatives');
            }
            return;
        }
        
        console.log(`✅ Tentative ${attempt}: Canvas trouvés, lancement de l'initialisation...`);
        initMobileChartsForced();
    }
    
    // Lancer après un délai
    setTimeout(() => tryInitCharts(1), 2000);
});

// ========================================
// FONCTION CHARGEMENT TRADES RÉELS
// ========================================
async function loadRealMobileTradesData() {
    console.log('📥 Chargement des trades réels depuis Firebase...');
    
    const uid = sessionStorage.getItem('firebaseUID');
    if (!uid) {
        console.error('❌ Pas d\'UID utilisateur');
        return null;
    }
    
    if (!window.firebaseDB) {
        console.error('❌ Firebase non disponible');
        return null;
    }
    
    try {
        const { ref, get } = await import('https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js');
        let userTrades = [];
        
        // PRIORITÉ 1: Chercher dans users/{uid}/accounts
        console.log('🔍 Recherche dans users/accounts...');
        const userAccountsRef = ref(window.firebaseDB, `users/${uid}/accounts`);
        const accountsSnapshot = await get(userAccountsRef);
        
        if (accountsSnapshot.exists()) {
            const accounts = accountsSnapshot.val();
            console.log('✅ Comptes trouvés:', Object.keys(accounts));
            
            // Prendre les trades du premier compte qui en a
            for (const [accountId, account] of Object.entries(accounts)) {
                if (account.trades && Array.isArray(account.trades)) {
                    userTrades = account.trades;
                    console.log(`✅ ${userTrades.length} trades trouvés dans ${accountId}`);
                    break;
                }
            }
        }
        
        // FALLBACK: Chercher dans dashboards/{uid}/trades
        if (userTrades.length === 0) {
            console.log('🔍 Recherche dans dashboards...');
            const dashboardRef = ref(window.firebaseDB, `dashboards/${uid}/trades`);
            const dashboardSnapshot = await get(dashboardRef);
            
            if (dashboardSnapshot.exists()) {
                const trades = dashboardSnapshot.val();
                if (Array.isArray(trades)) {
                    userTrades = trades;
                    console.log(`✅ ${userTrades.length} trades trouvés dans dashboards`);
                }
            }
        }
        
        // Filtrer les trades fermés
        const closedTrades = userTrades.filter(t => t && t.status === 'closed');
        console.log(`📊 ${closedTrades.length} trades fermés sur ${userTrades.length} total`);
        
        // Calculer les statistiques
        const wins = closedTrades.filter(t => parseFloat(t.pnl || 0) > 0).length;
        const losses = closedTrades.length - wins;
        
        console.log(`✅ Statistiques: ${wins} gagnants, ${losses} perdants`);
        
        // Calculer P&L cumulé pour le graphique de performance
        let cumulativePnL = 0;
        const performanceData = [0]; // Commence à 0
        const performanceLabels = ['Début'];
        
        closedTrades.forEach((trade, index) => {
            cumulativePnL += parseFloat(trade.pnl || 0);
            performanceData.push(cumulativePnL);
            performanceLabels.push(`T${index + 1}`);
        });
        
        return {
            wins,
            losses,
            closedTrades: closedTrades.length,
            performanceData,
            performanceLabels
        };
        
    } catch (error) {
        console.error('❌ Erreur chargement trades:', error);
        return null;
    }
}

// ========================================
// FONCTION INITIALISATION GRAPHIQUES FORCÉE
// ========================================
async function initMobileChartsForced() {
    console.log('📊 Initialisation FORCÉE des graphiques mobile...');
    
    const perfCanvas = document.getElementById('mobilePerformanceChart');
    const winRateCanvas = document.getElementById('mobileWinRateChart');
    
    if (!perfCanvas) {
        console.error('❌ Canvas mobilePerformanceChart non trouvé');
        return;
    }
    
    if (!winRateCanvas) {
        console.error('❌ Canvas mobileWinRateChart non trouvé');
        return;
    }
    
    console.log('✅ Canvas trouvés:', perfCanvas, winRateCanvas);
    
    try {
        // Détruire les anciens graphiques s'ils existent ET s'ils ont la méthode destroy
        if (window.mobilePerformanceChart && typeof window.mobilePerformanceChart.destroy === 'function') {
            console.log('🗑️ Destruction ancien graphique Performance');
            window.mobilePerformanceChart.destroy();
        } else if (window.mobilePerformanceChart) {
            console.log('⚠️ mobilePerformanceChart existe mais n\'est pas un Chart.js, réinitialisation...');
            window.mobilePerformanceChart = null;
        }
        
        if (window.mobileWinRateChart && typeof window.mobileWinRateChart.destroy === 'function') {
            console.log('🗑️ Destruction ancien graphique WinRate');
            window.mobileWinRateChart.destroy();
        } else if (window.mobileWinRateChart) {
            console.log('⚠️ mobileWinRateChart existe mais n\'est pas un Chart.js, réinitialisation...');
            window.mobileWinRateChart = null;
        }
        
        // S'assurer que les canvas sont visibles
        perfCanvas.style.display = 'block';
        perfCanvas.style.visibility = 'visible';
        winRateCanvas.style.display = 'block';
        winRateCanvas.style.visibility = 'visible';
        
        // Charger les données réelles
        console.log('📥 Chargement des données réelles...');
        const realData = await loadRealMobileTradesData();
        
        // Données par défaut si pas de trades
        let performanceLabels = ['Début', 'T1', 'T2', 'T3', 'T4', 'T5'];
        let performanceData = [0, 50, 120, 80, 200, 350];
        let wins = 7;
        let losses = 3;
        
        if (realData) {
            console.log('✅ Utilisation des données réelles');
            wins = realData.wins;
            losses = realData.losses;
            
            // Utiliser les données de performance si disponibles
            if (realData.performanceData.length > 1) {
                performanceLabels = realData.performanceLabels;
                performanceData = realData.performanceData;
            }
        } else {
            console.log('⚠️ Utilisation des données de démonstration');
        }
        
        console.log('📊 Création graphique Performance...');
        
        // Graphique Performance
        window.mobilePerformanceChart = new Chart(perfCanvas, {
            type: 'line',
            data: {
                labels: performanceLabels,
                datasets: [{
                    label: 'P&L Cumulé ($)',
                    data: performanceData,
                    borderColor: '#00d4ff',
                    backgroundColor: 'rgba(0, 212, 255, 0.2)',
                    tension: 0.4,
                    fill: true,
                    borderWidth: 3,
                    pointRadius: 5,
                    pointBackgroundColor: '#00d4ff',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                aspectRatio: 1.5,
                plugins: {
                    legend: {
                        display: true,
                        labels: { 
                            color: '#fff',
                            font: { size: 14 }
                        }
                    },
                    tooltip: {
                        enabled: true,
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#00d4ff',
                        bodyColor: '#fff'
                    }
                },
                scales: {
                    y: {
                        ticks: { 
                            color: '#fff',
                            font: { size: 12 }
                        },
                        grid: { 
                            color: 'rgba(255,255,255,0.1)',
                            drawBorder: false
                        }
                    },
                    x: {
                        ticks: { 
                            color: '#fff',
                            font: { size: 12 }
                        },
                        grid: { 
                            color: 'rgba(255,255,255,0.1)',
                            drawBorder: false
                        }
                    }
                }
            }
        });
        
        console.log('✅ Graphique Performance créé:', window.mobilePerformanceChart);
        
        console.log('📊 Création graphique WinRate...');
        console.log(`📊 Données WinRate: ${wins} gagnants, ${losses} perdants`);
        
        // Graphique WinRate avec données réelles
        window.mobileWinRateChart = new Chart(winRateCanvas, {
            type: 'doughnut',
            data: {
                labels: ['Gagnants', 'Perdants'],
                datasets: [{
                    data: [wins, losses],
                    backgroundColor: ['#00ff88', '#ff4444'],
                    borderWidth: 0,
                    hoverOffset: 10
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                aspectRatio: 1,
                plugins: {
                    legend: {
                        display: true,
                        position: 'bottom',
                        labels: { 
                            color: '#fff',
                            font: { size: 14 },
                            padding: 15
                        }
                    },
                    tooltip: {
                        enabled: true,
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#00d4ff',
                        bodyColor: '#fff'
                    }
                }
            }
        });
        
        console.log('✅ Graphique WinRate créé:', window.mobileWinRateChart);
        
        console.log('✅✅✅ TOUS LES GRAPHIQUES INITIALISÉS AVEC SUCCÈS ✅✅✅');
        
        // Forcer un redraw
        setTimeout(() => {
            if (window.mobilePerformanceChart) window.mobilePerformanceChart.update();
            if (window.mobileWinRateChart) window.mobileWinRateChart.update();
            console.log('🔄 Graphiques mis à jour');
        }, 500);
        
    } catch (error) {
        console.error('❌ ERREUR CRITIQUE initialisation graphiques:', error);
        console.error('Stack:', error.stack);
    }
}

// Exposer les fonctions globalement
window.initMobileChartsForced = initMobileChartsForced;
window.loadRealMobileTradesData = loadRealMobileTradesData;
window.refreshMobileCharts = initMobileChartsForced; // Alias pour rafraîchir

console.log('✅ Fix urgent mobile v2 chargé avec chargement de données réelles');