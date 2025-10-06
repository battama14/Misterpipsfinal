// Correction spécifique pour la mise à jour du calendrier
console.log('📅 Script de correction du calendrier chargé');

class CalendarUpdateFixer {
    constructor() {
        this.updateQueue = [];
        this.isUpdating = false;
        this.init();
    }

    init() {
        console.log('📅 Initialisation de la correction du calendrier...');
        
        // Attendre que le dashboard soit prêt
        this.waitForDashboard();
        
        // Intercepter les sauvegardes
        this.interceptSaveOperations();
        
        // Créer des fonctions de mise à jour forcée
        this.createUpdateFunctions();
        
        console.log('✅ Correction du calendrier initialisée');
    }

    waitForDashboard() {
        if (window.dashboard && typeof window.dashboard === 'object') {
            console.log('✅ Dashboard détecté pour la correction du calendrier');
            this.setupCalendarFixes();
        } else {
            setTimeout(() => this.waitForDashboard(), 1000);
        }
    }

    setupCalendarFixes() {
        console.log('📅 Configuration des corrections du calendrier...');
        
        // Sauvegarder les fonctions originales
        this.originalRenderCalendar = window.dashboard.renderCalendar;
        this.originalUpdateCalendarStats = window.dashboard.updateCalendarStats;
        this.originalSaveData = window.dashboard.saveData;
        this.originalSaveTrade = window.dashboard.saveTrade;
        this.originalCloseTrade = window.dashboard.closeTrade;
        
        // Améliorer les fonctions de rendu
        this.enhanceCalendarFunctions();
        
        // Intercepter les opérations qui affectent le calendrier
        this.interceptTradeOperations();
        
        console.log('✅ Corrections du calendrier configurées');
    }

    enhanceCalendarFunctions() {
        const self = this;
        
        // Améliorer renderCalendar
        if (this.originalRenderCalendar) {
            window.dashboard.renderCalendar = function() {
                console.log('📅 Rendu du calendrier amélioré...');
                try {
                    const result = self.originalRenderCalendar.call(this);
                    
                    // Forcer la mise à jour des statistiques après le rendu
                    setTimeout(() => {
                        if (typeof this.updateCalendarStats === 'function') {
                            this.updateCalendarStats();
                        }
                    }, 100);
                    
                    console.log('✅ Calendrier rendu avec succès');
                    return result;
                } catch (error) {
                    console.error('❌ Erreur lors du rendu du calendrier:', error);
                    self.fallbackRenderCalendar();
                }
            };
        }
        
        // Améliorer updateCalendarStats
        if (this.originalUpdateCalendarStats) {
            window.dashboard.updateCalendarStats = function() {
                console.log('📊 Mise à jour des statistiques du calendrier...');
                try {
                    const result = self.originalUpdateCalendarStats.call(this);
                    console.log('✅ Statistiques du calendrier mises à jour');
                    return result;
                } catch (error) {
                    console.error('❌ Erreur lors de la mise à jour des statistiques:', error);
                    self.fallbackUpdateStats();
                }
            };
        }
    }

    interceptTradeOperations() {
        const self = this;
        
        // Intercepter saveTrade
        if (this.originalSaveTrade) {
            window.dashboard.saveTrade = function() {
                console.log('💾 Sauvegarde de trade interceptée...');
                const result = self.originalSaveTrade.call(this);
                
                // Programmer la mise à jour du calendrier
                self.scheduleCalendarUpdate();
                
                return result;
            };
        }
        
        // Intercepter closeTrade
        if (this.originalCloseTrade) {
            window.dashboard.closeTrade = function(...args) {
                console.log('🔒 Fermeture de trade interceptée...');
                const result = self.originalCloseTrade.call(this, ...args);
                
                // Programmer la mise à jour du calendrier
                self.scheduleCalendarUpdate();
                
                return result;
            };
        }
        
        // Intercepter saveData
        if (this.originalSaveData) {
            window.dashboard.saveData = async function(...args) {
                console.log('💾 Sauvegarde de données interceptée...');
                const result = await self.originalSaveData.call(this, ...args);
                
                // Programmer la mise à jour du calendrier
                self.scheduleCalendarUpdate();
                
                return result;
            };
        }
    }

    interceptSaveOperations() {
        // Intercepter les modifications du localStorage
        const originalSetItem = localStorage.setItem;
        localStorage.setItem = (key, value) => {
            const result = originalSetItem.call(localStorage, key, value);
            
            // Si c'est une sauvegarde de dashboard, mettre à jour le calendrier
            if (key.includes('dashboard_')) {
                console.log('💾 Sauvegarde localStorage détectée, mise à jour du calendrier...');
                this.scheduleCalendarUpdate();
            }
            
            return result;
        };
    }

    scheduleCalendarUpdate() {
        // Éviter les mises à jour multiples simultanées
        if (this.isUpdating) {
            console.log('📅 Mise à jour déjà en cours, ajout à la queue...');
            this.updateQueue.push(Date.now());
            return;
        }
        
        this.isUpdating = true;
        
        // Attendre un peu pour permettre à toutes les opérations de se terminer
        setTimeout(() => {
            this.performCalendarUpdate();
        }, 300);
    }

    performCalendarUpdate() {
        console.log('📅 Exécution de la mise à jour du calendrier...');
        
        try {
            if (window.dashboard) {
                // Mettre à jour le calendrier
                if (typeof window.dashboard.renderCalendar === 'function') {
                    window.dashboard.renderCalendar();
                    console.log('✅ Calendrier rendu');
                }
                
                // Mettre à jour les statistiques
                if (typeof window.dashboard.updateCalendarStats === 'function') {
                    window.dashboard.updateCalendarStats();
                    console.log('✅ Statistiques mises à jour');
                }
                
                // Mettre à jour les graphiques si nécessaire
                if (typeof window.dashboard.initCharts === 'function') {
                    setTimeout(() => {
                        window.dashboard.initCharts();
                        console.log('✅ Graphiques mis à jour');
                    }, 100);
                }
                
                // Mettre à jour la jauge
                if (typeof window.dashboard.initGauge === 'function') {
                    setTimeout(() => {
                        window.dashboard.initGauge();
                        console.log('✅ Jauge mise à jour');
                    }, 200);
                }
            }
        } catch (error) {
            console.error('❌ Erreur lors de la mise à jour du calendrier:', error);
            this.fallbackUpdate();
        } finally {
            this.isUpdating = false;
            
            // Traiter la queue s'il y a des mises à jour en attente
            if (this.updateQueue.length > 0) {
                console.log(`📅 ${this.updateQueue.length} mises à jour en attente...`);
                this.updateQueue = [];
                setTimeout(() => this.scheduleCalendarUpdate(), 500);
            }
        }
    }

    createUpdateFunctions() {
        // Fonction globale pour forcer la mise à jour du calendrier
        window.forceCalendarUpdate = () => {
            console.log('🔄 Mise à jour forcée du calendrier...');
            this.scheduleCalendarUpdate();
        };
        
        // Fonction pour mettre à jour après un trade
        window.updateCalendarAfterTrade = () => {
            console.log('📈 Mise à jour du calendrier après trade...');
            setTimeout(() => {
                this.scheduleCalendarUpdate();
            }, 500);
        };
        
        // Fonction pour mise à jour complète
        window.fullCalendarRefresh = () => {
            console.log('🔄 Actualisation complète du calendrier...');
            if (window.dashboard) {
                // Recharger les données
                if (typeof window.dashboard.loadData === 'function') {
                    window.dashboard.loadData().then(() => {
                        this.scheduleCalendarUpdate();
                    });
                } else {
                    this.scheduleCalendarUpdate();
                }
            }
        };
    }

    fallbackRenderCalendar() {
        console.log('🔄 Rendu de calendrier de secours...');
        
        const calendarGrid = document.getElementById('calendarGrid');
        if (!calendarGrid) return;
        
        // Rendu basique du calendrier
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth();
        
        const monthYear = document.getElementById('monthYear');
        if (monthYear) {
            monthYear.textContent = new Intl.DateTimeFormat('fr-FR', { 
                month: 'long', 
                year: 'numeric' 
            }).format(today);
        }
        
        console.log('✅ Rendu de secours terminé');
    }

    fallbackUpdateStats() {
        console.log('📊 Mise à jour de statistiques de secours...');
        
        // Mise à jour basique des statistiques
        const elements = ['dailyProgress', 'weeklyProgress', 'monthProgress', 'yearlyProgress'];
        elements.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = '0%';
            }
        });
        
        console.log('✅ Mise à jour de secours terminée');
    }

    fallbackUpdate() {
        console.log('🔄 Mise à jour complète de secours...');
        this.fallbackRenderCalendar();
        this.fallbackUpdateStats();
    }
}

// Initialiser le correcteur de calendrier
let calendarFixer;

function initCalendarFixer() {
    if (!calendarFixer) {
        calendarFixer = new CalendarUpdateFixer();
        window.calendarFixer = calendarFixer;
        console.log('✅ Correcteur de calendrier initialisé');
    }
}

// Lancer après le chargement du DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(initCalendarFixer, 2000);
    });
} else {
    setTimeout(initCalendarFixer, 2000);
}

console.log('📅 Script de correction du calendrier prêt');