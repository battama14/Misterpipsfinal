// Modal de paramètres avec gestion des pseudos
class SettingsModal {
    constructor() {
        this.currentUser = sessionStorage.getItem('firebaseUID');
        this.userEmail = sessionStorage.getItem('userEmail');
        this.createModal();
        this.bindEvents();
    }

    createModal() {
        // Créer le modal s'il n'existe pas
        let modal = document.getElementById('settingsModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'settingsModal';
            modal.className = 'modal';
            modal.innerHTML = `
                <div class="modal-content settings-modal-content">
                    <div class="modal-header">
                        <h2>⚙️ Paramètres</h2>
                        <span class="close" onclick="closeSettingsModal()">&times;</span>
                    </div>
                    <div class="modal-body">
                        <div class="settings-section">
                            <h3>👤 Profil Utilisateur</h3>
                            <div class="setting-item">
                                <label>Email:</label>
                                <input type="email" id="settingsEmail" readonly style="background: #f5f5f5;">
                            </div>
                            <div class="setting-item">
                                <label>Pseudo:</label>
                                <input type="text" id="settingsNickname" placeholder="Votre pseudo pour le chat et classement">
                                <small>Ce pseudo sera affiché dans le chat VIP et le classement</small>
                            </div>
                        </div>
                        
                        <div class="settings-section">
                            <h3>🔔 Notifications</h3>
                            <div class="setting-item">
                                <label class="checkbox-label">
                                    <input type="checkbox" id="settingsSounds" checked>
                                    <span>Sons de notification</span>
                                </label>
                            </div>
                            <div class="setting-item">
                                <label class="checkbox-label">
                                    <input type="checkbox" id="settingsPush" checked>
                                    <span>Notifications push</span>
                                </label>
                            </div>
                        </div>
                        
                        <div class="settings-section">
                            <h3>💰 Trading</h3>
                            <div class="setting-item">
                                <label>Capital initial ($):</label>
                                <input type="number" id="settingsCapital" value="1000" min="1">
                            </div>
                            <div class="setting-item">
                                <label>Objectif journalier ($):</label>
                                <input type="number" id="settingsDailyGoal" value="10" min="1">
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn-secondary" onclick="closeSettingsModal()">Annuler</button>
                        <button class="btn-primary" onclick="saveSettings()">💾 Sauvegarder</button>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
        }
        
        // Ajouter les styles CSS
        this.addStyles();
    }

    addStyles() {
        if (document.getElementById('settingsModalStyles')) return;
        
        const styles = document.createElement('style');
        styles.id = 'settingsModalStyles';
        styles.textContent = `
            .settings-modal-content {
                max-width: 600px;
                max-height: 80vh;
                overflow-y: auto;
            }
            
            .modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 20px;
                border-bottom: 1px solid rgba(255,255,255,0.1);
            }
            
            .modal-header h2 {
                margin: 0;
                color: #00d4ff;
            }
            
            .modal-body {
                padding: 20px;
            }
            
            .settings-section {
                margin-bottom: 30px;
                padding: 20px;
                background: rgba(255,255,255,0.05);
                border-radius: 10px;
                border: 1px solid rgba(0,212,255,0.2);
            }
            
            .settings-section h3 {
                margin: 0 0 20px 0;
                color: #00d4ff;
                font-size: 1.2em;
            }
            
            .setting-item {
                margin-bottom: 15px;
            }
            
            .setting-item label {
                display: block;
                margin-bottom: 5px;
                color: #ffffff;
                font-weight: 500;
            }
            
            .setting-item input[type="text"],
            .setting-item input[type="email"],
            .setting-item input[type="number"] {
                width: 100%;
                padding: 12px;
                border: 1px solid rgba(0,212,255,0.3);
                border-radius: 8px;
                background: rgba(255,255,255,0.1);
                color: #ffffff;
                font-size: 14px;
            }
            
            .setting-item input[type="text"]:focus,
            .setting-item input[type="email"]:focus,
            .setting-item input[type="number"]:focus {
                outline: none;
                border-color: #00d4ff;
                box-shadow: 0 0 0 2px rgba(0,212,255,0.2);
                background: rgba(255,255,255,0.15) !important;
                color: #ffffff !important;
            }
            
            .setting-item input[type="text"]:not([readonly]),
            .setting-item input[type="email"]:not([readonly]),
            .setting-item input[type="number"]:not([readonly]) {
                background: rgba(255,255,255,0.1) !important;
                color: #ffffff !important;
            }
            
            .setting-item small {
                display: block;
                margin-top: 5px;
                color: rgba(255,255,255,0.6);
                font-size: 12px;
            }
            
            .checkbox-label {
                display: flex !important;
                align-items: center;
                cursor: pointer;
            }
            
            .checkbox-label input[type="checkbox"] {
                margin-right: 10px;
                width: auto;
            }
            
            .modal-footer {
                display: flex;
                justify-content: flex-end;
                gap: 10px;
                padding: 20px;
                border-top: 1px solid rgba(255,255,255,0.1);
            }
            
            .modal-footer button {
                padding: 12px 24px;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                font-weight: 500;
            }
            
            .btn-secondary {
                background: rgba(255,255,255,0.1);
                color: #ffffff;
            }
            
            .btn-primary {
                background: linear-gradient(135deg, #00d4ff, #5b86e5);
                color: #ffffff;
            }
        `;
        document.head.appendChild(styles);
    }

    async show() {
        const modal = document.getElementById('settingsModal');
        if (!modal) return;
        
        // Charger les données actuelles
        await this.loadCurrentSettings();
        
        modal.style.display = 'block';
        
        // Focus sur le pseudo
        setTimeout(() => {
            const nicknameInput = document.getElementById('settingsNickname');
            if (nicknameInput) nicknameInput.focus();
        }, 100);
    }

    async loadCurrentSettings() {
        // Email
        const emailInput = document.getElementById('settingsEmail');
        if (emailInput) {
            emailInput.value = this.userEmail || '';
        }
        
        // Pseudo géré par profiles/{uid}/nickname
        const nicknameInput = document.getElementById('settingsNickname');
        if (nicknameInput && window.cleanNicknameSystem) {
            nicknameInput.readOnly = false;
            nicknameInput.style.backgroundColor = 'rgba(255,255,255,0.1)';
            nicknameInput.style.color = '#ffffff';
            const nickname = await window.cleanNicknameSystem.getCurrentNickname();
            nicknameInput.value = nickname || '';
        }
        
        // Autres paramètres depuis localStorage
        const settings = JSON.parse(localStorage.getItem('userSettings')) || {};
        
        const soundsInput = document.getElementById('settingsSounds');
        const pushInput = document.getElementById('settingsPush');
        const capitalInput = document.getElementById('settingsCapital');
        const dailyGoalInput = document.getElementById('settingsDailyGoal');
        
        if (soundsInput) soundsInput.checked = settings.sounds !== false;
        if (pushInput) pushInput.checked = settings.push !== false;
        if (capitalInput) capitalInput.value = settings.capital || 1000;
        if (dailyGoalInput) dailyGoalInput.value = settings.dailyGoal || 10;
    }

    hide() {
        const modal = document.getElementById('settingsModal');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    async save() {
        const nicknameInput = document.getElementById('settingsNickname');
        const soundsInput = document.getElementById('settingsSounds');
        const pushInput = document.getElementById('settingsPush');
        const capitalInput = document.getElementById('settingsCapital');
        const dailyGoalInput = document.getElementById('settingsDailyGoal');
        
        try {
            // Sauvegarder le pseudo avec profiles/{uid}/nickname
            if (nicknameInput && nicknameInput.value.trim() && window.cleanNicknameSystem) {
                const success = await window.cleanNicknameSystem.changeNickname(nicknameInput.value.trim());
                if (!success) {
                    alert('❌ Erreur lors de la sauvegarde du pseudo');
                    return;
                }
            }
            
            // Sauvegarder les autres paramètres
            const settings = {
                sounds: soundsInput ? soundsInput.checked : true,
                push: pushInput ? pushInput.checked : true,
                capital: capitalInput ? parseFloat(capitalInput.value) || 1000 : 1000,
                dailyGoal: dailyGoalInput ? parseFloat(dailyGoalInput.value) || 10 : 10
            };
            
            localStorage.setItem('userSettings', JSON.stringify(settings));
            
            // Mettre à jour l'interface
            if (window.dashboard && window.dashboard.updateStats) {
                window.dashboard.updateStats();
            }
            
            alert('✅ Paramètres sauvegardés avec succès !');
            this.hide();
            
        } catch (error) {
            console.error('Erreur sauvegarde paramètres:', error);
            alert('❌ Erreur lors de la sauvegarde');
        }
    }

    bindEvents() {
        // Fermer avec Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const modal = document.getElementById('settingsModal');
                if (modal && modal.style.display === 'block') {
                    this.hide();
                }
            }
        });
        
        // Fermer en cliquant à l'extérieur
        document.addEventListener('click', (e) => {
            const modal = document.getElementById('settingsModal');
            if (e.target === modal) {
                this.hide();
            }
        });
    }
}

// Fonctions globales
window.openSettingsModal = function() {
    if (!window.settingsModal) {
        window.settingsModal = new SettingsModal();
    }
    window.settingsModal.show();
};

window.closeSettingsModal = function() {
    if (window.settingsModal) {
        window.settingsModal.hide();
    }
};

window.saveSettings = function() {
    if (window.settingsModal) {
        window.settingsModal.save();
    }
};

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    // Créer le modal au chargement
    setTimeout(() => {
        if (sessionStorage.getItem('firebaseUID')) {
            window.settingsModal = new SettingsModal();
        }
    }, 1000);
});

console.log('⚙️ Modal paramètres chargé');