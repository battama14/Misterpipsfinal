// PC Final Fix - Correction définitive des problèmes PC
console.log('🔧 PC Final Fix - Démarrage...');

// Variables globales pour éviter les doublons
let fixApplied = false;
let confirmBlocked = false;

// Fonction pour nettoyer les anciens event listeners
function cleanupEventListeners() {
    // Supprimer tous les anciens listeners sur les boutons problématiques
    const deleteButtons = document.querySelectorAll('.delete-btn, .delete-trade-btn, #deleteAccountBtn');
    deleteButtons.forEach(btn => {
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
    });
}

// Override du confirm pour éviter les boucles
const originalConfirm = window.confirm;
window.confirm = function(message) {
    if (confirmBlocked) {
        console.log('🚫 Confirm bloqué pour éviter la boucle');
        return false;
    }
    confirmBlocked = true;
    const result = originalConfirm.call(this, message);
    setTimeout(() => { confirmBlocked = false; }, 100);
    return result;
};

// Fonction principale de correction
function applyFinalFix() {
    if (fixApplied) return;
    fixApplied = true;
    
    console.log('🔧 Application des corrections finales...');
    
    // 1. Correction du bouton supprimer compte
    function fixDeleteAccountButton() {
        const deleteAccountBtn = document.getElementById('deleteAccountBtn');
        if (deleteAccountBtn) {
            // Nettoyer les anciens listeners
            const newBtn = deleteAccountBtn.cloneNode(true);
            deleteAccountBtn.parentNode.replaceChild(newBtn, deleteAccountBtn);
            
            newBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                const currentAccount = document.getElementById('accountSelect').value;
                if (confirm(`Supprimer le compte "${currentAccount}" et toutes ses données ?`)) {
                    // Logique de suppression
                    if (typeof deleteAccount === 'function') {
                        deleteAccount();
                    }
                }
            });
            console.log('✅ Bouton supprimer compte corrigé');
        }
    }
    
    // 2. Correction des boutons supprimer trade
    function fixDeleteTradeButtons() {
        const observer = new MutationObserver(() => {
            const deleteButtons = document.querySelectorAll('.delete-btn:not([data-fixed])');
            deleteButtons.forEach(btn => {
                btn.setAttribute('data-fixed', 'true');
                btn.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    const tradeRow = this.closest('tr');
                    if (tradeRow && confirm('Supprimer ce trade ?')) {
                        const tradeIndex = Array.from(tradeRow.parentNode.children).indexOf(tradeRow);
                        if (typeof deleteTrade === 'function') {
                            deleteTrade(tradeIndex);
                        } else {
                            tradeRow.remove();
                        }
                    }
                });
            });
        });
        
        observer.observe(document.body, { childList: true, subtree: true });
        console.log('✅ Boutons supprimer trade corrigés');
    }
    
    // 3. Correction des popups de nouveau trade
    function fixTradePopups() {
        // Bloquer les popups répétitifs
        let lastPopupTime = 0;
        const originalAlert = window.alert;
        
        window.alert = function(message) {
            const now = Date.now();
            if (now - lastPopupTime < 1000) {
                console.log('🚫 Popup bloqué (trop rapide)');
                return;
            }
            lastPopupTime = now;
            return originalAlert.call(this, message);
        };
        
        // Intercepter les soumissions de formulaire
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.addEventListener('submit', function(e) {
                const now = Date.now();
                if (now - lastPopupTime < 2000) {
                    e.preventDefault();
                    console.log('🚫 Soumission bloquée (trop rapide)');
                }
            });
        });
        
        console.log('✅ Popups de trade corrigés');
    }
    
    // 4. Correction du bouton ajouter compte
    function fixAddAccountButton() {
        const addAccountBtn = document.getElementById('addAccountBtn');
        if (addAccountBtn) {
            let lastClick = 0;
            
            const newBtn = addAccountBtn.cloneNode(true);
            addAccountBtn.parentNode.replaceChild(newBtn, addAccountBtn);
            
            newBtn.addEventListener('click', function(e) {
                const now = Date.now();
                if (now - lastClick < 1000) {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('🚫 Clic ajouter compte bloqué (trop rapide)');
                    return;
                }
                lastClick = now;
            });
            console.log('✅ Bouton ajouter compte corrigé');
        }
    }
    
    // Appliquer toutes les corrections
    fixDeleteAccountButton();
    fixDeleteTradeButtons();
    fixTradePopups();
    fixAddAccountButton();
    
    console.log('✅ Toutes les corrections PC appliquées');
}

// Démarrage des corrections
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyFinalFix);
} else {
    applyFinalFix();
}

// Nettoyage au démarrage
cleanupEventListeners();