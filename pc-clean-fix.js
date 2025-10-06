// PC Clean Fix - Version finale sans conflits
console.log('🔧 PC Clean Fix - Démarrage...');

let lastAction = 0;

function canAct() {
    const now = Date.now();
    if (now - lastAction < 500) return false;
    lastAction = now;
    return true;
}

function initFix() {
    // 1. Bouton supprimer compte
    const deleteBtn = document.getElementById('deleteAccountBtn');
    if (deleteBtn) {
        deleteBtn.onclick = function(e) {
            e.preventDefault();
            if (!canAct()) return;
            
            const account = document.getElementById('accountSelect').value;
            if (confirm(`Supprimer le compte "${account}" ?`)) {
                console.log('✅ Compte supprimé');
                if (typeof deleteAccount === 'function') deleteAccount();
            }
        };
    }
    
    // 2. Bouton ajouter compte
    const addBtn = document.getElementById('addAccountBtn');
    if (addBtn) {
        addBtn.onclick = function(e) {
            e.preventDefault();
            if (!canAct()) return;
            console.log('✅ Ajouter compte');
        };
    }
    
    // 3. Boutons supprimer trade
    const observer = new MutationObserver(() => {
        document.querySelectorAll('.delete-btn:not([data-fixed])').forEach(btn => {
            btn.setAttribute('data-fixed', 'true');
            btn.onclick = function(e) {
                e.preventDefault();
                if (!canAct()) return;
                
                if (confirm('Supprimer ce trade ?')) {
                    const row = this.closest('tr');
                    if (row) row.remove();
                    console.log('✅ Trade supprimé');
                }
            };
        });
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
    console.log('✅ Fix appliqué');
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFix);
} else {
    initFix();
}