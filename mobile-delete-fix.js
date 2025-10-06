// Fix simple pour boutons supprimer mobile
console.log('🔧 Mobile Delete Fix - Démarrage...');

let lastDeleteAction = 0;

function canDelete() {
    const now = Date.now();
    if (now - lastDeleteAction < 500) return false;
    lastDeleteAction = now;
    return true;
}

function fixMobileDeleteButtons() {
    const observer = new MutationObserver(() => {
        const deleteButtons = document.querySelectorAll('.btn-delete:not([data-mobile-fixed])');
        deleteButtons.forEach((btn, index) => {
            btn.setAttribute('data-mobile-fixed', 'true');
            btn.onclick = function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                if (!canDelete()) return;
                
                if (confirm('Supprimer ce trade ?')) {
                    console.log('🗑️ Suppression trade mobile index:', index);
                    
                    // Trouver l'index réel dans la liste
                    const tradeItem = this.closest('.trade-item');
                    if (tradeItem) {
                        const allItems = Array.from(document.querySelectorAll('.trade-item'));
                        const realIndex = allItems.indexOf(tradeItem);
                        
                        // Supprimer de mobileData
                        if (window.mobileData && window.mobileData.trades) {
                            window.mobileData.trades.splice(realIndex, 1);
                            if (window.saveMobileDataComplete) {
                                window.saveMobileDataComplete();
                            }
                        }
                        
                        // Supprimer l'élément visuel
                        tradeItem.remove();
                        
                        // Mettre à jour l'affichage
                        if (window.updateMobileStats) window.updateMobileStats();
                        if (window.updateMobileCalendar) window.updateMobileCalendar();
                        
                        console.log('✅ Trade supprimé');
                    }
                }
            };
        });
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
    console.log('✅ Observer boutons supprimer mobile activé');
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fixMobileDeleteButtons);
} else {
    fixMobileDeleteButtons();
}