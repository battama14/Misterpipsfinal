// Mobile Buttons Fix - Correction des boutons TP/SL/BE
console.log('🔧 Mobile Buttons Fix - Chargement...');

class MobileButtonsFix {
    constructor() {
        this.isInitialized = false;
        this.buttonObserver = null;
    }

    init() {
        if (this.isInitialized) return;
        
        console.log('🚀 Initialisation Mobile Buttons Fix...');
        
        // Observer pour détecter les nouveaux boutons
        this.setupButtonObserver();
        
        // Corriger les boutons existants
        this.fixExistingButtons();
        
        // Corriger les boutons de navigation
        this.fixNavigationButtons();
        
        this.isInitialized = true;
        console.log('✅ Mobile Buttons Fix initialisé');
    }

    setupButtonObserver() {
        // Observer pour les boutons dynamiques
        this.buttonObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        // Chercher les boutons TP/SL/BE
                        const buttons = node.querySelectorAll ? 
                            node.querySelectorAll('.btn-tp, .btn-sl, .btn-be, .trade-actions button') : [];
                        
                        buttons.forEach(button => this.fixTradeButton(button));
                        
                        // Si le node lui-même est un bouton
                        if (node.classList && (node.classList.contains('btn-tp') || 
                            node.classList.contains('btn-sl') || 
                            node.classList.contains('btn-be'))) {
                            this.fixTradeButton(node);
                        }
                    }
                });
            });
        });

        // Observer le container des trades
        const tradesContainer = document.getElementById('mobileTradesList');
        if (tradesContainer) {
            this.buttonObserver.observe(tradesContainer, {
                childList: true,
                subtree: true
            });
        }

        // Observer le modal
        const modal = document.getElementById('tradeModal');
        if (modal) {
            this.buttonObserver.observe(modal, {
                childList: true,
                subtree: true
            });
        }
    }

    fixExistingButtons() {
        // Corriger tous les boutons existants
        const buttons = document.querySelectorAll('.btn-tp, .btn-sl, .btn-be, .trade-actions button');
        buttons.forEach(button => this.fixTradeButton(button));
        
        console.log(`🔧 ${buttons.length} boutons existants corrigés`);
    }

    fixTradeButton(button) {
        if (!button || button.hasAttribute('data-fixed')) return;
        
        // Marquer comme corrigé
        button.setAttribute('data-fixed', 'true');
        
        // Supprimer les anciens événements
        button.onclick = null;
        button.removeAttribute('onclick');
        
        // Déterminer le type de bouton
        let actionType = null;
        if (button.classList.contains('btn-tp') || button.textContent.includes('TP')) {
            actionType = 'TP';
        } else if (button.classList.contains('btn-sl') || button.textContent.includes('SL')) {
            actionType = 'SL';
        } else if (button.classList.contains('btn-be') || button.textContent.includes('BE')) {
            actionType = 'BE';
        }
        
        if (!actionType) return;
        
        // Trouver l'index du trade
        const tradeItem = button.closest('.trade-item');
        if (!tradeItem) return;
        
        const tradeIndex = this.findTradeIndex(tradeItem);
        if (tradeIndex === -1) return;
        
        // Ajouter le nouvel événement
        button.addEventListener('click', async (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            console.log(`📱 Clic bouton ${actionType} pour trade ${tradeIndex}`);
            
            // Confirmation
            if (!confirm(`Clôturer le trade en ${actionType} ?`)) return;
            
            // Désactiver le bouton temporairement
            button.disabled = true;
            button.textContent = '...';
            
            try {
                // Utiliser le système mobile dashboard
                if (window.mobileDashboard) {
                    await window.mobileDashboard.closeTrade(tradeIndex, actionType);
                } else {
                    console.error('❌ Mobile Dashboard non disponible');
                    alert('Erreur: Système non initialisé');
                }
            } catch (error) {
                console.error('❌ Erreur clôture trade:', error);
                alert('Erreur lors de la clôture du trade');
            } finally {
                // Réactiver le bouton
                button.disabled = false;
                button.textContent = actionType;
            }
        });
        
        console.log(`✅ Bouton ${actionType} corrigé`);
    }

    findTradeIndex(tradeItem) {
        // Chercher l'index du trade dans la liste
        const tradesList = document.getElementById('mobileTradesList');
        if (!tradesList) return -1;
        
        const allTradeItems = tradesList.querySelectorAll('.trade-item');
        const itemIndex = Array.from(allTradeItems).indexOf(tradeItem);
        
        if (itemIndex === -1) return -1;
        
        // L'index réel dépend de l'ordre d'affichage (les 10 derniers trades inversés)
        if (window.mobileDashboard && window.mobileDashboard.trades) {
            const totalTrades = window.mobileDashboard.trades.length;
            const displayedTrades = Math.min(10, totalTrades);
            const realIndex = totalTrades - displayedTrades + itemIndex;
            return realIndex;
        }
        
        return itemIndex;
    }

    fixNavigationButtons() {
        // Corriger les boutons de navigation
        const navButtons = document.querySelectorAll('.nav-btn');
        navButtons.forEach(button => {
            if (button.hasAttribute('data-nav-fixed')) return;
            button.setAttribute('data-nav-fixed', 'true');
            
            // Supprimer l'ancien onclick
            const oldOnclick = button.getAttribute('onclick');
            if (oldOnclick) {
                button.removeAttribute('onclick');
                
                // Ajouter le nouvel événement
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    
                    // Extraire la section du onclick
                    const sectionMatch = oldOnclick.match(/showMobileSection\('([^']+)'\)/);
                    if (sectionMatch) {
                        const section = sectionMatch[1];
                        this.showMobileSection(section);
                        
                        // Reset badge pour le chat
                        if (section === 'chat' && window.resetUnreadCount) {
                            window.resetUnreadCount();
                        }
                    }
                });
            }
        });
        
        console.log('🔧 Boutons de navigation corrigés');
    }

    showMobileSection(sectionId) {
        // Masquer toutes les sections
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });
        
        // Afficher la section demandée
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
        }
        
        // Mettre à jour la navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Activer le bouton correspondant
        const activeBtn = document.querySelector(`.nav-btn[onclick*="${sectionId}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }
        
        console.log(`📱 Section ${sectionId} affichée`);
    }

    // Méthode pour forcer la correction de tous les boutons
    forceFixAllButtons() {
        console.log('🔧 Force fix de tous les boutons...');
        
        // Supprimer les marqueurs de correction
        document.querySelectorAll('[data-fixed]').forEach(el => {
            el.removeAttribute('data-fixed');
        });
        
        document.querySelectorAll('[data-nav-fixed]').forEach(el => {
            el.removeAttribute('data-nav-fixed');
        });
        
        // Recorriger
        this.fixExistingButtons();
        this.fixNavigationButtons();
        
        console.log('✅ Force fix terminé');
    }
}

// Instance globale
let mobileButtonsFix = null;

// Initialisation
function initMobileButtonsFix() {
    if (mobileButtonsFix) return;
    
    mobileButtonsFix = new MobileButtonsFix();
    mobileButtonsFix.init();
    
    // Exposer globalement
    window.mobileButtonsFix = mobileButtonsFix;
    window.showMobileSection = (sectionId) => mobileButtonsFix.showMobileSection(sectionId);
}

// Auto-initialisation
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(initMobileButtonsFix, 500);
    });
} else {
    setTimeout(initMobileButtonsFix, 500);
}

// Initialisation de secours
window.addEventListener('load', () => {
    if (!mobileButtonsFix) {
        setTimeout(initMobileButtonsFix, 1000);
    }
});

// Re-correction périodique
setInterval(() => {
    if (mobileButtonsFix) {
        mobileButtonsFix.fixExistingButtons();
    }
}, 5000);

console.log('🔧 Mobile Buttons Fix chargé');