// Test complet de tous les boutons et actions du dashboard PC
console.log('🔍 Test complet dashboard PC - Démarrage...');

class DashboardTester {
    constructor() {
        this.results = [];
        this.init();
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.runTests());
        } else {
            setTimeout(() => this.runTests(), 2000);
        }
    }

    log(test, status, details = '') {
        const result = { test, status, details, timestamp: new Date().toLocaleTimeString() };
        this.results.push(result);
        const icon = status === 'PASS' ? '✅' : status === 'FAIL' ? '❌' : '⚠️';
        console.log(`${icon} ${test}: ${status} ${details}`);
    }

    async runTests() {
        console.log('🔍 === DÉBUT DES TESTS DASHBOARD PC ===');
        
        // Test 1: Éléments DOM
        this.testDOMElements();
        
        // Test 2: Boutons principaux
        this.testMainButtons();
        
        // Test 3: Navigation
        this.testNavigation();
        
        // Test 4: Modales
        this.testModals();
        
        // Test 5: Formulaires
        this.testForms();
        
        // Test 6: Graphiques
        this.testCharts();
        
        // Test 7: Firebase
        await this.testFirebase();
        
        // Test 8: Fonctions dashboard
        this.testDashboardFunctions();
        
        // Rapport final
        this.generateReport();
    }

    testDOMElements() {
        console.log('📋 Test des éléments DOM...');
        
        const elements = [
            'newTradeBtn', 'settingsBtn', 'closeTradeBtn', 'exportBtn', 'historyTradeBtn',
            'addAccountBtn', 'deleteAccountBtn', 'vipHomeBtn', 'accountSelect',
            'prevMonth', 'nextMonth', 'tradeModal', 'modalContent', 'fullscreenModal',
            'capital', 'winRate', 'totalPnL', 'openTrades', 'totalTrades',
            'performanceChart', 'winRateChart', 'monthlyChart', 'gainsGauge',
            'calendarGrid', 'monthYear', 'tradesTable', 'syncStatus'
        ];
        
        elements.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                this.log(`DOM ${id}`, 'PASS', 'Élément trouvé');
            } else {
                this.log(`DOM ${id}`, 'FAIL', 'Élément manquant');
            }
        });
    }

    testMainButtons() {
        console.log('🔘 Test des boutons principaux...');
        
        const buttons = [
            { id: 'newTradeBtn', action: 'startNewTrade' },
            { id: 'settingsBtn', action: 'showSettings' },
            { id: 'closeTradeBtn', action: 'showCloseTradeModal' },
            { id: 'exportBtn', action: 'exportToExcel' },
            { id: 'historyTradeBtn', action: 'showHistoryTradeModal' },
            { id: 'addAccountBtn', action: 'addNewAccount' },
            { id: 'deleteAccountBtn', action: 'deleteAccount' },
            { id: 'vipHomeBtn', action: 'goToVipHome' }
        ];
        
        buttons.forEach(({ id, action }) => {
            const button = document.getElementById(id);
            if (button) {
                // Test si le bouton est cliquable
                const hasClick = button.onclick || button.addEventListener;
                if (hasClick) {
                    this.log(`Bouton ${id}`, 'PASS', `Action: ${action}`);
                } else {
                    this.log(`Bouton ${id}`, 'WARN', 'Pas d\'événement click détecté');
                }
                
                // Test si le bouton est visible et activé
                const isVisible = button.offsetParent !== null;
                const isEnabled = !button.disabled;
                
                if (isVisible && isEnabled) {
                    this.log(`Bouton ${id} état`, 'PASS', 'Visible et activé');
                } else {
                    this.log(`Bouton ${id} état`, 'WARN', `Visible: ${isVisible}, Activé: ${isEnabled}`);
                }
            } else {
                this.log(`Bouton ${id}`, 'FAIL', 'Bouton non trouvé');
            }
        });
    }

    testNavigation() {
        console.log('🧭 Test de la navigation...');
        
        // Test sélecteur de compte
        const accountSelect = document.getElementById('accountSelect');
        if (accountSelect) {
            const hasOptions = accountSelect.options.length > 0;
            this.log('Navigation comptes', hasOptions ? 'PASS' : 'FAIL', 
                `${accountSelect.options.length} comptes`);
        }
        
        // Test navigation calendrier
        const prevMonth = document.getElementById('prevMonth');
        const nextMonth = document.getElementById('nextMonth');
        
        if (prevMonth && nextMonth) {
            this.log('Navigation calendrier', 'PASS', 'Boutons mois présents');
        } else {
            this.log('Navigation calendrier', 'FAIL', 'Boutons mois manquants');
        }
    }

    testModals() {
        console.log('📱 Test des modales...');
        
        const tradeModal = document.getElementById('tradeModal');
        const fullscreenModal = document.getElementById('fullscreenModal');
        const modalContent = document.getElementById('modalContent');
        
        if (tradeModal) {
            this.log('Modale trade', 'PASS', 'Modale présente');
        } else {
            this.log('Modale trade', 'FAIL', 'Modale manquante');
        }
        
        if (fullscreenModal) {
            this.log('Modale fullscreen', 'PASS', 'Modale présente');
        } else {
            this.log('Modale fullscreen', 'FAIL', 'Modale manquante');
        }
        
        if (modalContent) {
            this.log('Contenu modal', 'PASS', 'Container présent');
        } else {
            this.log('Contenu modal', 'FAIL', 'Container manquant');
        }
        
        // Test fermeture modale
        const closeButtons = document.querySelectorAll('.close');
        this.log('Boutons fermeture', closeButtons.length > 0 ? 'PASS' : 'WARN', 
            `${closeButtons.length} boutons trouvés`);
    }

    testForms() {
        console.log('📝 Test des formulaires...');
        
        // Test si les inputs existent dans le DOM (même s'ils ne sont pas visibles)
        const formElements = ['currency', 'entryPoint', 'stopLoss', 'takeProfit', 'lotSize'];
        let formsReady = 0;
        
        formElements.forEach(id => {
            // Chercher dans tout le document, y compris dans les templates
            const exists = document.body.innerHTML.includes(`id="${id}"`);
            if (exists) {
                formsReady++;
            }
        });
        
        this.log('Formulaires trade', formsReady === formElements.length ? 'PASS' : 'WARN',
            `${formsReady}/${formElements.length} champs détectés`);
    }

    testCharts() {
        console.log('📊 Test des graphiques...');
        
        const charts = ['performanceChart', 'winRateChart', 'monthlyChart'];
        
        charts.forEach(chartId => {
            const canvas = document.getElementById(chartId);
            if (canvas) {
                this.log(`Graphique ${chartId}`, 'PASS', 'Canvas présent');
            } else {
                this.log(`Graphique ${chartId}`, 'FAIL', 'Canvas manquant');
            }
        });
        
        // Test Chart.js
        if (typeof Chart !== 'undefined') {
            this.log('Chart.js', 'PASS', 'Librairie chargée');
        } else {
            this.log('Chart.js', 'FAIL', 'Librairie manquante');
        }
    }

    async testFirebase() {
        console.log('🔥 Test Firebase...');
        
        if (window.firebaseDB) {
            this.log('Firebase DB', 'PASS', 'Base de données connectée');
        } else {
            this.log('Firebase DB', 'FAIL', 'Base de données non connectée');
        }
        
        if (window.firebaseAuth) {
            this.log('Firebase Auth', 'PASS', 'Authentification disponible');
        } else {
            this.log('Firebase Auth', 'FAIL', 'Authentification manquante');
        }
        
        const uid = sessionStorage.getItem('firebaseUID');
        if (uid) {
            this.log('Utilisateur connecté', 'PASS', `UID: ${uid.substring(0, 8)}...`);
        } else {
            this.log('Utilisateur connecté', 'FAIL', 'Pas d\'UID trouvé');
        }
    }

    testDashboardFunctions() {
        console.log('⚙️ Test des fonctions dashboard...');
        
        if (window.dashboard) {
            this.log('Instance dashboard', 'PASS', 'Dashboard créé');
            
            const methods = [
                'startNewTrade', 'showSettings', 'saveSettings', 'exportToExcel',
                'addNewAccount', 'deleteAccount', 'switchAccount', 'saveTrade',
                'closeTrade', 'updateStats', 'renderTradesTable', 'initCharts'
            ];
            
            methods.forEach(method => {
                if (typeof window.dashboard[method] === 'function') {
                    this.log(`Méthode ${method}`, 'PASS', 'Fonction disponible');
                } else {
                    this.log(`Méthode ${method}`, 'FAIL', 'Fonction manquante');
                }
            });
        } else {
            this.log('Instance dashboard', 'FAIL', 'Dashboard non créé');
        }
    }

    generateReport() {
        console.log('📊 === RAPPORT FINAL ===');
        
        const passed = this.results.filter(r => r.status === 'PASS').length;
        const failed = this.results.filter(r => r.status === 'FAIL').length;
        const warnings = this.results.filter(r => r.status === 'WARN').length;
        const total = this.results.length;
        
        console.log(`✅ Tests réussis: ${passed}/${total}`);
        console.log(`❌ Tests échoués: ${failed}/${total}`);
        console.log(`⚠️ Avertissements: ${warnings}/${total}`);
        
        const score = Math.round((passed / total) * 100);
        console.log(`🎯 Score global: ${score}%`);
        
        if (failed > 0) {
            console.log('❌ PROBLÈMES CRITIQUES:');
            this.results.filter(r => r.status === 'FAIL').forEach(r => {
                console.log(`  - ${r.test}: ${r.details}`);
            });
        }
        
        if (warnings > 0) {
            console.log('⚠️ AVERTISSEMENTS:');
            this.results.filter(r => r.status === 'WARN').forEach(r => {
                console.log(`  - ${r.test}: ${r.details}`);
            });
        }
        
        // Stocker les résultats pour inspection
        window.testResults = this.results;
        console.log('📋 Résultats stockés dans window.testResults');
    }
}

// Lancer les tests
new DashboardTester();