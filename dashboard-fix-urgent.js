// Script de correction urgent pour le dashboard PC
console.log('🔧 Script de correction urgent chargé');

class DashboardFixer {
    constructor() {
        this.fixAttempts = 0;
        this.maxAttempts = 5;
        this.init();
    }

    init() {
        console.log('🔧 Initialisation des corrections...');
        
        // Attendre que le dashboard soit prêt
        this.waitForDashboard();
        
        // Corrections immédiates
        this.fixModalClosing();
        this.fixButtonEvents();
        this.fixCalendarUpdates();
        
        // Observer les changements DOM
        this.observeDOM();
    }

    waitForDashboard() {
        if (window.dashboard && typeof window.dashboard === 'object') {
            console.log('✅ Dashboard détecté, application des corrections...');
            this.applyFixes();
        } else {
            this.fixAttempts++;
            if (this.fixAttempts < this.maxAttempts) {
                console.log(`⏳ Tentative ${this.fixAttempts}/${this.maxAttempts} - Attente du dashboard...`);
                setTimeout(() => this.waitForDashboard(), 1000);
            } else {
                console.warn('⚠️ Dashboard non trouvé après plusieurs tentatives');
                this.applyBasicFixes();
            }
        }
    }

    applyFixes() {
        console.log('🔧 Application des corrections...');
        
        // 1. Corriger le bouton supprimer
        this.fixDeleteButton();
        
        // 2. Corriger la fermeture des modales
        this.fixModalClosing();
        
        // 3. Corriger la mise à jour du calendrier
        this.fixCalendarUpdates();
        
        // 4. Corriger tous les boutons
        this.fixAllButtons();
        
        console.log('✅ Corrections appliquées');
    }

    fixDeleteButton() {
        console.log('🔧 Correction du bouton supprimer...');
        
        const deleteBtn = document.getElementById('deleteAccountBtn');
        if (deleteBtn) {
            // Supprimer tous les événements existants
            deleteBtn.onclick = null;
            deleteBtn.removeAttribute('onclick');
            
            // Créer un nouvel événement
            const newHandler = (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('🗑️ Bouton supprimer cliqué');
                
                if (window.dashboard && typeof window.dashboard.deleteAccount === 'function') {
                    window.dashboard.deleteAccount();
                } else {
                    console.error('❌ Fonction deleteAccount non trouvée');
                    this.fallbackDeleteAccount();
                }
            };
            
            deleteBtn.addEventListener('click', newHandler);
            deleteBtn.onclick = newHandler;
            
            console.log('✅ Bouton supprimer corrigé');
        } else {
            console.warn('⚠️ Bouton supprimer non trouvé');
        }
    }

    fallbackDeleteAccount() {
        console.log('🔧 Fonction de suppression de secours...');
        
        if (confirm('Supprimer ce compte et toutes ses données ?')) {
            try {
                // Récupérer les données actuelles
                const currentUser = sessionStorage.getItem('firebaseUID');
                if (!currentUser) {
                    alert('Erreur: Utilisateur non connecté');
                    return;
                }
                
                const savedData = localStorage.getItem(`dashboard_${currentUser}`);
                if (savedData) {
                    const data = JSON.parse(savedData);
                    const accounts = data.accounts || {};
                    const currentAccount = data.currentAccount || 'compte1';
                    
                    if (Object.keys(accounts).length <= 1) {
                        alert('Impossible de supprimer le dernier compte');
                        return;
                    }
                    
                    const accountName = accounts[currentAccount]?.name || currentAccount;
                    delete accounts[currentAccount];
                    
                    // Changer vers le premier compte restant
                    const newCurrentAccount = Object.keys(accounts)[0];
                    data.currentAccount = newCurrentAccount;
                    data.accounts = accounts;
                    data.trades = [];
                    
                    // Sauvegarder
                    localStorage.setItem(`dashboard_${currentUser}`, JSON.stringify(data));
                    
                    // Recharger la page
                    alert(`Compte "${accountName}" supprimé. La page va se recharger.`);
                    window.location.reload();
                } else {
                    alert('Aucune donnée trouvée');
                }
            } catch (error) {
                console.error('Erreur lors de la suppression:', error);
                alert('Erreur lors de la suppression du compte');
            }
        }
    }

    fixModalClosing() {
        console.log('🔧 Correction de la fermeture des modales...');
        
        // Fonction universelle de fermeture
        const closeModal = () => {
            console.log('🔒 Fermeture des modales...');
            
            const modals = ['tradeModal', 'fullscreenModal'];
            let closed = false;
            
            modals.forEach(modalId => {
                const modal = document.getElementById(modalId);
                if (modal && (modal.style.display === 'block' || modal.style.display === 'flex')) {
                    modal.style.display = 'none';
                    console.log(`✅ Modal ${modalId} fermée`);
                    closed = true;
                }
            });
            
            if (!closed) {
                console.log('ℹ️ Aucune modale ouverte');
            }
        };
        
        // Remplacer les fonctions globales
        window.closeModal = closeModal;
        window.closeFullscreen = closeModal;
        
        // Écouter les clics sur les éléments de fermeture
        document.addEventListener('click', (e) => {
            // Boutons de fermeture
            if (e.target.classList.contains('close') || 
                e.target.textContent === '×' || 
                e.target.textContent === '✕' ||
                e.target.classList.contains('close-btn') ||
                e.target.classList.contains('close-fullscreen')) {
                e.preventDefault();
                e.stopPropagation();
                closeModal();
                return;
            }
            
            // Clic sur l'arrière-plan
            if (e.target.id === 'tradeModal' || e.target.id === 'fullscreenModal') {
                closeModal();
                return;
            }
        });
        
        // Touche Échap
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeModal();
            }
        });
        
        console.log('✅ Fermeture des modales corrigée');
    }

    fixCalendarUpdates() {
        console.log('🔧 Correction des mises à jour du calendrier...');
        
        // Intercepter les sauvegardes pour forcer la mise à jour du calendrier
        const originalSaveData = window.dashboard?.saveData;
        if (originalSaveData && typeof originalSaveData === 'function') {
            window.dashboard.saveData = async function(...args) {
                console.log('💾 Sauvegarde interceptée, mise à jour du calendrier...');
                
                // Appeler la sauvegarde originale
                const result = await originalSaveData.apply(this, args);
                
                // Forcer la mise à jour du calendrier
                setTimeout(() => {
                    if (typeof this.renderCalendar === 'function') {
                        this.renderCalendar();
                        console.log('📅 Calendrier mis à jour');
                    }
                    if (typeof this.updateCalendarStats === 'function') {
                        this.updateCalendarStats();
                        console.log('📊 Statistiques du calendrier mises à jour');
                    }
                }, 500);
                
                return result;
            };
            
            console.log('✅ Mise à jour automatique du calendrier activée');
        }
        
        // Fonction de mise à jour manuelle
        window.forceCalendarUpdate = () => {
            if (window.dashboard) {
                if (typeof window.dashboard.renderCalendar === 'function') {
                    window.dashboard.renderCalendar();
                }
                if (typeof window.dashboard.updateCalendarStats === 'function') {
                    window.dashboard.updateCalendarStats();
                }
                console.log('📅 Calendrier mis à jour manuellement');
            }
        };
    }

    fixAllButtons() {
        console.log('🔧 Correction de tous les boutons...');
        
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
                // Supprimer les anciens événements
                button.onclick = null;
                button.removeAttribute('onclick');
                
                // Créer le nouvel événement
                const handler = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log(`🔘 Bouton ${id} cliqué`);
                    
                    if (window.dashboard && typeof window.dashboard[action] === 'function') {
                        window.dashboard[action]();
                    } else {
                        console.error(`❌ Fonction ${action} non trouvée`);
                        if (id === 'deleteAccountBtn') {
                            this.fallbackDeleteAccount();
                        }
                    }
                };
                
                button.addEventListener('click', handler);
                button.onclick = handler;
                
                console.log(`✅ Bouton ${id} corrigé`);
            } else {
                console.warn(`⚠️ Bouton ${id} non trouvé`);
            }
        });
    }

    fixButtonEvents() {
        console.log('🔧 Correction des événements des boutons...');
        
        // Attendre que les boutons soient dans le DOM
        setTimeout(() => {
            this.fixAllButtons();
        }, 1000);
    }

    applyBasicFixes() {
        console.log('🔧 Application des corrections de base...');
        
        // Corrections qui ne dépendent pas du dashboard
        this.fixModalClosing();
        
        // Essayer de corriger les boutons sans dashboard
        setTimeout(() => {
            const deleteBtn = document.getElementById('deleteAccountBtn');
            if (deleteBtn) {
                deleteBtn.onclick = () => this.fallbackDeleteAccount();
            }
        }, 1000);
    }

    observeDOM() {
        // Observer les changements dans le DOM pour réappliquer les corrections
        const observer = new MutationObserver((mutations) => {
            let shouldReapplyFixes = false;
            
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === 1 && (
                            node.id === 'tradeModal' || 
                            node.classList?.contains('modal') ||
                            node.tagName === 'BUTTON'
                        )) {
                            shouldReapplyFixes = true;
                        }
                    });
                }
            });
            
            if (shouldReapplyFixes) {
                console.log('🔄 Changements DOM détectés, réapplication des corrections...');
                setTimeout(() => {
                    this.fixModalClosing();
                    this.fixAllButtons();
                }, 100);
            }
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        console.log('👁️ Observateur DOM activé');
    }
}

// Initialiser le correcteur
let dashboardFixer;

function initFixer() {
    if (!dashboardFixer) {
        dashboardFixer = new DashboardFixer();
        window.dashboardFixer = dashboardFixer;
        console.log('✅ Correcteur de dashboard initialisé');
    }
}

// Lancer immédiatement
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFixer);
} else {
    initFixer();
}

// Fonction globale pour forcer les corrections
window.fixDashboard = () => {
    if (dashboardFixer) {
        dashboardFixer.applyFixes();
    } else {
        initFixer();
    }
};

console.log('🔧 Script de correction urgent prêt');