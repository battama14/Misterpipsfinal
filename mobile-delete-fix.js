// Fix simple pour boutons supprimer mobile
console.log('🔧 Mobile Delete Fix - Démarrage...');



function fixMobileDeleteButtons() {
    const observer = new MutationObserver(() => {
        const deleteButtons = document.querySelectorAll('.btn-delete:not([data-mobile-fixed])');
        deleteButtons.forEach((btn, index) => {
            btn.setAttribute('data-mobile-fixed', 'true');
            btn.onclick = function(e) {
                e.preventDefault();
                
                if (confirm('Supprimer ce trade ?')) {
                    const tradeItem = this.closest('.trade-item');
                    if (tradeItem) {
                        const allItems = Array.from(document.querySelectorAll('.trade-item'));
                        const realIndex = allItems.indexOf(tradeItem);
                        
                        if (window.deleteMobileTrade) {
                            window.deleteMobileTrade(realIndex);
                        } else {
                            tradeItem.remove();
                        }
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