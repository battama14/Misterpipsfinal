// Mobile Final Sync - Synchronisation finale PC/Mobile
console.log('🎯 Mobile Final Sync - Chargement...');

class MobileFinalSync {
    constructor() {
        this.syncInterval = null;
        this.isActive = false;
    }

    async init() {
        if (this.isActive) return;
        
        console.log('🚀 Initialisation Mobile Final Sync...');
        
        // Attendre que tous les systèmes soient prêts
        await this.waitForSystems();
        
        // Synchroniser avec la version PC
        await this.syncWithPC();
        
        // Démarrer la synchronisation périodique
        this.startPeriodicSync();
        
        // Corriger les fonctions globales
        this.fixGlobalFunctions();
        
        this.isActive = true;
        console.log('✅ Mobile Final Sync actif');
    }

    async waitForSystems() {
        console.log('⏳ Attente des systèmes...');
        
        // Attendre Firebase
        let attempts = 0;
        while (!window.firebaseDB && attempts < 20) {
            await new Promise(resolve => setTimeout(resolve, 500));
            attempts++;
        }
        
        // Attendre Mobile Dashboard
        attempts = 0;
        while (!window.mobileDashboard && attempts < 10) {
            await new Promise(resolve => setTimeout(resolve, 500));
            attempts++;
        }
        
        // Attendre Mobile Buttons Fix
        attempts = 0;
        while (!window.mobileButtonsFix && attempts < 10) {
            await new Promise(resolve => setTimeout(resolve, 500));
            attempts++;
        }
        
        console.log('✅ Systèmes prêts');
    }

    async syncWithPC() {
        console.log('🔄 Synchronisation avec PC...');
        
        if (!window.mobileDashboard) {
            console.warn('⚠️ Mobile Dashboard non disponible');
            return;
        }
        
        try {
            // Recharger les données depuis Firebase
            await window.mobileDashboard.refreshData();
            
            // Mettre à jour tous les affichages
            this.updateAllDisplays();
            
            console.log('✅ Synchronisation PC terminée');
        } catch (error) {
            console.error('❌ Erreur synchronisation PC:', error);
        }
    }

    updateAllDisplays() {
        if (!window.mobileDashboard) return;
        
        // Mettre à jour les stats
        window.mobileDashboard.updateMobileStats();
        
        // Mettre à jour la liste des trades
        window.mobileDashboard.updateMobileTradesList();
        
        // Mettre à jour le calendrier
        window.mobileDashboard.updateMobileCalendar();
        
        // Corriger les boutons après mise à jour
        setTimeout(() => {
            if (window.mobileButtonsFix) {
                window.mobileButtonsFix.forceFixAllButtons();
            }
        }, 500);
        
        console.log('📱 Tous les affichages mis à jour');
    }

    startPeriodicSync() {
        // Synchronisation toutes les 30 secondes
        this.syncInterval = setInterval(async () => {
            if (document.hidden) return; // Ne pas synchroniser si l'onglet n'est pas visible
            
            try {
                await this.syncWithPC();
            } catch (error) {
                console.error('❌ Erreur sync périodique:', error);
            }
        }, 30000);
        
        console.log('🔄 Synchronisation périodique démarrée');
    }

    fixGlobalFunctions() {
        // S'assurer que showMobileSection fonctionne
        if (!window.showMobileSection) {
            window.showMobileSection = (sectionId) => {
                if (window.mobileButtonsFix) {
                    window.mobileButtonsFix.showMobileSection(sectionId);
                } else {
                    // Fallback
                    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
                    const section = document.getElementById(sectionId);
                    if (section) section.classList.add('active');
                }
            };
        }
        
        // S'assurer que resetUnreadCount fonctionne
        if (!window.resetUnreadCount) {
            window.resetUnreadCount = () => {
                if (window.resetMobileBadge) {
                    window.resetMobileBadge();
                }
                console.log('🔔 Badge chat reset');
            };
        }
        
        // Fonction pour forcer la mise à jour
        window.forceMobileUpdate = () => {
            this.updateAllDisplays();
        };
        
        // Fonction pour resynchroniser
        window.resyncMobile = async () => {
            await this.syncWithPC();
        };
        
        console.log('🔧 Fonctions globales corrigées');
    }

    // Méthode pour gérer les nouveaux trades depuis le modal
    async handleNewTrade(tradeData) {
        if (!window.mobileDashboard) {
            console.error('❌ Mobile Dashboard non disponible');
            return false;
        }
        
        try {
            await window.mobileDashboard.addTrade(tradeData);
            
            // Mettre à jour immédiatement
            this.updateAllDisplays();
            
            // Synchroniser avec Firebase
            await window.mobileDashboard.saveData();
            
            console.log('✅ Nouveau trade ajouté et synchronisé');
            return true;
        } catch (error) {
            console.error('❌ Erreur ajout trade:', error);
            return false;
        }
    }

    // Méthode pour gérer la clôture de trades
    async handleCloseTrade(tradeIndex, result) {
        if (!window.mobileDashboard) {
            console.error('❌ Mobile Dashboard non disponible');
            return false;
        }
        
        try {
            await window.mobileDashboard.closeTrade(tradeIndex, result);
            
            // Mettre à jour immédiatement
            this.updateAllDisplays();
            
            console.log('✅ Trade clôturé et synchronisé');
            return true;
        } catch (error) {
            console.error('❌ Erreur clôture trade:', error);
            return false;
        }
    }

    stop() {
        if (this.syncInterval) {
            clearInterval(this.syncInterval);
            this.syncInterval = null;
        }
        this.isActive = false;
        console.log('🛑 Mobile Final Sync arrêté');
    }
}

// Instance globale
let mobileFinalSync = null;

// Initialisation
async function initMobileFinalSync() {
    if (mobileFinalSync) return;
    
    mobileFinalSync = new MobileFinalSync();
    await mobileFinalSync.init();
    
    // Exposer globalement
    window.mobileFinalSync = mobileFinalSync;
    
    // Connecter aux événements du modal de trade
    const modal = document.getElementById('tradeModal');
    if (modal) {
        // Observer les changements dans le modal
        const modalObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                // Détecter quand le modal se ferme après un ajout de trade
                if (mutation.type === 'attributes' && 
                    mutation.attributeName === 'style' && 
                    modal.style.display === 'none') {
                    
                    // Mettre à jour après fermeture du modal
                    setTimeout(() => {
                        mobileFinalSync.updateAllDisplays();
                    }, 500);
                }
            });
        });
        
        modalObserver.observe(modal, {
            attributes: true,
            attributeFilter: ['style']
        });
    }
    
    console.log('✅ Mobile Final Sync initialisé');
}

// Auto-initialisation avec délai pour s'assurer que tout est prêt
setTimeout(async () => {
    try {
        await initMobileFinalSync();
    } catch (error) {
        console.error('❌ Erreur init Mobile Final Sync:', error);
        // Retry après 5 secondes
        setTimeout(initMobileFinalSync, 5000);
    }
}, 3000);

// Initialisation de secours
window.addEventListener('load', () => {
    if (!mobileFinalSync) {
        setTimeout(initMobileFinalSync, 5000);
    }
});

// Nettoyage à la fermeture
window.addEventListener('beforeunload', () => {
    if (mobileFinalSync) {
        mobileFinalSync.stop();
    }
});

console.log('🎯 Mobile Final Sync chargé');