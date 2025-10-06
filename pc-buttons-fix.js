// Correction spécifique des boutons PC
console.log('🔧 Correction boutons PC...');

class PCButtonsFixer {
    constructor() {
        this.init();
    }

    init() {
        setTimeout(() => this.fixAllButtons(), 1000);
    }

    fixAllButtons() {
        this.fixDeleteAccountButton();
        this.fixDeleteTradeInModal();
        this.fixAddAccountPopup();
    }

    // Fix bouton supprimer compte
    fixDeleteAccountButton() {
        const deleteBtn = document.getElementById('deleteAccountBtn');
        if (!deleteBtn) return;

        // Remplacer complètement le bouton
        const newBtn = deleteBtn.cloneNode(true);
        deleteBtn.parentNode.replaceChild(newBtn, deleteBtn);

        newBtn.onclick = () => {
            console.log('🗑️ Suppression compte demandée');
            
            if (!window.dashboard || !window.dashboard.accounts) {
                alert('❌ Erreur: Données non disponibles');
                return;
            }

            const accounts = window.dashboard.accounts;
            const currentAccount = window.dashboard.currentAccount;

            if (Object.keys(accounts).length <= 1) {
                alert('❌ Impossible de supprimer le dernier compte');
                return;
            }

            const accountName = accounts[currentAccount]?.name || currentAccount;
            
            if (confirm(`Supprimer le compte "${accountName}" et toutes ses données ?`)) {
                try {
                    // Supprimer le compte
                    delete accounts[currentAccount];
                    
                    // Changer vers le premier compte restant
                    const newCurrentAccount = Object.keys(accounts)[0];
                    window.dashboard.currentAccount = newCurrentAccount;
                    window.dashboard.trades = [];
                    
                    // Sauvegarder
                    window.dashboard.saveData();
                    
                    // Recharger l'affichage
                    window.dashboard.updateAccountDisplay();
                    window.dashboard.updateStats();
                    window.dashboard.renderTradesTable();
                    
                    alert(`✅ Compte "${accountName}" supprimé`);
                } catch (error) {
                    console.error('Erreur suppression:', error);
                    alert('❌ Erreur lors de la suppression');
                }
            }
        };

        console.log('✅ Bouton supprimer compte corrigé');
    }

    // Fix bouton supprimer dans le modal de modification
    fixDeleteTradeInModal() {
        // Observer les changements dans les modales
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === 1 && node.innerHTML && node.innerHTML.includes('Supprimer')) {
                            this.fixDeleteButtonsInModal();
                        }
                    });
                }
            });
        });

        const modalContent = document.getElementById('modalContent');
        if (modalContent) {
            observer.observe(modalContent, { childList: true, subtree: true });
        }

        // Corriger immédiatement si des boutons existent
        setTimeout(() => this.fixDeleteButtonsInModal(), 500);
    }

    fixDeleteButtonsInModal() {
        const deleteButtons = document.querySelectorAll('.btn-danger');
        
        deleteButtons.forEach((btn) => {
            if (btn.textContent.includes('Supprimer') && btn.onclick && btn.onclick.toString().includes('deleteTrade')) {
                // Extraire l'index du onclick
                const onclickStr = btn.onclick.toString();
                const indexMatch = onclickStr.match(/deleteTrade\((\d+)\)/);
                
                if (indexMatch) {
                    const index = parseInt(indexMatch[1]);
                    
                    // Remplacer l'événement
                    btn.onclick = null;
                    btn.addEventListener('click', (e) => {
                        e.preventDefault();
                        this.deleteTradeFixed(index);
                    });
                    
                    console.log(`✅ Bouton supprimer trade ${index} corrigé`);
                }
            }
        });
    }

    deleteTradeFixed(index) {
        if (!window.dashboard || !window.dashboard.trades) {
            alert('❌ Erreur: Données non disponibles');
            return;
        }

        const trade = window.dashboard.trades[index];
        if (!trade) {
            alert('❌ Trade non trouvé');
            return;
        }

        if (confirm(`Supprimer le trade ${trade.currency} du ${trade.date} ?`)) {
            try {
                // Supprimer le trade
                window.dashboard.trades.splice(index, 1);
                
                // Sauvegarder
                window.dashboard.saveData();
                
                // Fermer la modale
                const modal = document.getElementById('tradeModal');
                if (modal) modal.style.display = 'none';
                
                // Mettre à jour l'affichage
                window.dashboard.renderTradesTable();
                window.dashboard.updateStats();
                window.dashboard.renderCalendar();
                
                alert('✅ Trade supprimé');
            } catch (error) {
                console.error('Erreur suppression trade:', error);
                alert('❌ Erreur lors de la suppression');
            }
        }
    }

    // Fix popup ajout compte qui revient indéfiniment
    fixAddAccountPopup() {
        const addBtn = document.getElementById('addAccountBtn');
        if (!addBtn) return;

        // Remplacer complètement le bouton
        const newBtn = addBtn.cloneNode(true);
        addBtn.parentNode.replaceChild(newBtn, addBtn);

        newBtn.onclick = () => {
            console.log('➕ Ajout compte demandé');
            this.showAddAccountDialog();
        };

        console.log('✅ Bouton ajouter compte corrigé');
    }

    showAddAccountDialog() {
        // Créer un dialog personnalisé pour éviter les boucles
        const dialog = document.createElement('div');
        dialog.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        `;

        dialog.innerHTML = `
            <div style="
                background: #1a1a1a;
                padding: 30px;
                border-radius: 15px;
                border: 1px solid rgba(0,212,255,0.3);
                max-width: 400px;
                width: 90%;
            ">
                <h3 style="color: #00d4ff; margin-bottom: 20px;">Nouveau Compte</h3>
                <div style="margin-bottom: 15px;">
                    <label style="color: white; display: block; margin-bottom: 5px;">Nom du compte:</label>
                    <input type="text" id="newAccountName" style="
                        width: 100%;
                        padding: 10px;
                        border: 1px solid #333;
                        border-radius: 5px;
                        background: #2a2a2a;
                        color: white;
                    " placeholder="Ex: Compte Swing">
                </div>
                <div style="margin-bottom: 20px;">
                    <label style="color: white; display: block; margin-bottom: 5px;">Capital initial ($):</label>
                    <input type="number" id="newAccountCapital" style="
                        width: 100%;
                        padding: 10px;
                        border: 1px solid #333;
                        border-radius: 5px;
                        background: #2a2a2a;
                        color: white;
                    " value="1000">
                </div>
                <div style="display: flex; gap: 10px; justify-content: flex-end;">
                    <button id="cancelAddAccount" style="
                        padding: 10px 20px;
                        border: 1px solid #666;
                        border-radius: 5px;
                        background: #333;
                        color: white;
                        cursor: pointer;
                    ">Annuler</button>
                    <button id="confirmAddAccount" style="
                        padding: 10px 20px;
                        border: none;
                        border-radius: 5px;
                        background: linear-gradient(135deg, #00d4ff, #5b86e5);
                        color: white;
                        cursor: pointer;
                    ">Créer</button>
                </div>
            </div>
        `;

        document.body.appendChild(dialog);

        // Focus sur le nom
        setTimeout(() => {
            document.getElementById('newAccountName').focus();
        }, 100);

        // Événements
        document.getElementById('cancelAddAccount').onclick = () => {
            document.body.removeChild(dialog);
        };

        document.getElementById('confirmAddAccount').onclick = () => {
            const name = document.getElementById('newAccountName').value.trim();
            const capital = parseFloat(document.getElementById('newAccountCapital').value) || 1000;

            if (!name) {
                alert('Veuillez entrer un nom de compte');
                return;
            }

            this.createNewAccount(name, capital);
            document.body.removeChild(dialog);
        };

        // Fermer avec Échap
        const handleKeydown = (e) => {
            if (e.key === 'Escape') {
                document.body.removeChild(dialog);
                document.removeEventListener('keydown', handleKeydown);
            }
        };
        document.addEventListener('keydown', handleKeydown);

        // Fermer en cliquant à l'extérieur
        dialog.onclick = (e) => {
            if (e.target === dialog) {
                document.body.removeChild(dialog);
            }
        };
    }

    createNewAccount(name, capital) {
        if (!window.dashboard) {
            alert('❌ Erreur: Dashboard non disponible');
            return;
        }

        try {
            // Générer un ID unique
            let accountId;
            let counter = Object.keys(window.dashboard.accounts).length + 1;
            do {
                accountId = 'compte' + counter;
                counter++;
            } while (window.dashboard.accounts[accountId]);

            // Créer le compte
            window.dashboard.accounts[accountId] = {
                name: name,
                capital: capital,
                trades: [],
                settings: { ...window.dashboard.settings, capital: capital }
            };

            // Sauvegarder
            window.dashboard.saveData();

            // Mettre à jour l'affichage
            window.dashboard.updateAccountDisplay();

            alert(`✅ Compte "${name}" créé avec succès!`);
            console.log('✅ Nouveau compte créé:', accountId, name);

        } catch (error) {
            console.error('Erreur création compte:', error);
            alert('❌ Erreur lors de la création du compte');
        }
    }
}

// Initialiser
let pcButtonsFixer;

function initPCButtonsFixer() {
    if (!pcButtonsFixer) {
        pcButtonsFixer = new PCButtonsFixer();
        window.pcButtonsFixer = pcButtonsFixer;
        console.log('✅ Correcteur boutons PC initialisé');
    }
}

// Attendre que le dashboard soit prêt
function waitForDashboard() {
    if (window.dashboard) {
        initPCButtonsFixer();
    } else {
        setTimeout(waitForDashboard, 1000);
    }
}

waitForDashboard();

// Fonction globale
window.fixPCButtons = () => {
    if (pcButtonsFixer) {
        pcButtonsFixer.fixAllButtons();
    } else {
        initPCButtonsFixer();
    }
};

console.log('✅ Script correction boutons PC prêt');