// Système unifié de gestion des pseudos
class UnifiedNicknameSystem {
    constructor() {
        this.currentUser = sessionStorage.getItem('firebaseUID');
        this.userEmail = sessionStorage.getItem('userEmail');
        this.nickname = null;
        this.isSettingsPage = false;
        this.init();
    }

    async init() {
        if (!this.currentUser) return;
        
        console.log('🏷️ Initialisation système pseudo unifié...');
        
        // Détecter si on est sur une page de paramètres
        this.isSettingsPage = window.location.href.includes('settings') || 
                             document.querySelector('#settingsModal') || 
                             document.querySelector('.settings-section');
        
        await this.loadNickname();
        this.blockNicknameChanges();
        this.setupNicknameSync();
    }

    async loadNickname() {
        try {
            if (!window.firebaseDB) return;
            
            const { ref, get } = await import('https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js');
            
            // Charger depuis la source principale: users/{uid}/nickname
            const nicknameRef = ref(window.firebaseDB, `users/${this.currentUser}/nickname`);
            const snapshot = await get(nicknameRef);
            
            if (snapshot.exists() && snapshot.val()) {
                this.nickname = snapshot.val();
                console.log('✅ Pseudo chargé:', this.nickname);
                
                // Synchroniser avec toutes les interfaces
                this.syncToAllInterfaces();
            } else {
                console.log('ℹ️ Aucun pseudo défini');
            }
            
        } catch (error) {
            console.error('Erreur chargement pseudo:', error);
        }
    }

    async saveNickname(newNickname) {
        // Vérifier si on est autorisé à changer le pseudo
        if (!this.isSettingsPage && !this.isAuthorizedToChange()) {
            console.log('🚫 Changement de pseudo bloqué - utiliser les paramètres');
            return false;
        }
        
        if (!newNickname || newNickname.trim() === '') {
            console.log('🚫 Pseudo vide refusé');
            return false;
        }
        
        // Bloquer les emails
        if (newNickname.includes('@') || newNickname.includes('kamel.lou')) {
            console.log('🚫 Email comme pseudo refusé');
            return false;
        }
        
        try {
            if (!window.firebaseDB) return false;
            
            const { ref, set } = await import('https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js');
            
            // Sauvegarder dans toutes les structures Firebase
            const saves = [
                set(ref(window.firebaseDB, `users/${this.currentUser}/nickname`), newNickname),
                set(ref(window.firebaseDB, `users/${this.currentUser}/profile/nickname`), newNickname),
                set(ref(window.firebaseDB, `nicknames/${this.currentUser}`), newNickname),
                set(ref(window.firebaseDB, `profiles/${this.currentUser}/nickname`), newNickname)
            ];
            
            await Promise.all(saves);
            
            this.nickname = newNickname;
            console.log('✅ Pseudo sauvegardé:', newNickname);
            
            // Synchroniser immédiatement
            this.syncToAllInterfaces();
            
            return true;
            
        } catch (error) {
            console.error('Erreur sauvegarde pseudo:', error);
            return false;
        }
    }

    syncToAllInterfaces() {
        if (!this.nickname) return;
        
        // Synchroniser avec le chat
        if (window.iMessageChat) {
            window.iMessageChat.nickname = this.nickname;
        }
        
        // Synchroniser avec les inputs (lecture seule sauf paramètres)
        const inputs = [
            document.getElementById('nicknameInput'),
            document.getElementById('mobileNickname'),
            document.querySelector('input[placeholder*="pseudo"]'),
            document.querySelector('input[placeholder*="Pseudo"]')
        ];
        
        inputs.forEach(input => {
            if (input) {
                input.value = this.nickname;
                
                // Bloquer la modification si pas dans les paramètres
                if (!this.isSettingsPage) {
                    input.readOnly = true;
                    input.style.backgroundColor = '#f5f5f5';
                    input.title = 'Modifiable uniquement dans les paramètres';
                }
            }
        });
        
        // Mettre à jour les affichages
        const displays = [
            document.querySelector('.trader-name'),
            document.querySelector('.user-nickname'),
            document.querySelector('#currentNickname')
        ];
        
        displays.forEach(display => {
            if (display) {
                display.textContent = this.nickname;
            }
        });
        
        console.log('🔄 Pseudo synchronisé sur toutes les interfaces');
    }

    blockNicknameChanges() {
        // Bloquer tous les changements non autorisés
        const inputs = document.querySelectorAll('input[type="text"]');
        
        inputs.forEach(input => {
            if (input.placeholder && 
                (input.placeholder.toLowerCase().includes('pseudo') || 
                 input.placeholder.toLowerCase().includes('nickname'))) {
                
                if (!this.isSettingsPage) {
                    // Bloquer les changements
                    input.addEventListener('input', (e) => {
                        if (this.nickname && e.target.value !== this.nickname) {
                            e.target.value = this.nickname;
                            console.log('🚫 Changement de pseudo bloqué');
                        }
                    });
                    
                    input.addEventListener('change', (e) => {
                        if (this.nickname && e.target.value !== this.nickname) {
                            e.target.value = this.nickname;
                            console.log('🚫 Changement de pseudo bloqué');
                        }
                    });
                }
            }
        });
    }

    setupNicknameSync() {
        // Écouter les changements Firebase en temps réel
        if (window.firebaseDB && window.onValue) {
            const { ref } = window;
            const nicknameRef = ref(window.firebaseDB, `users/${this.currentUser}/nickname`);
            
            window.onValue(nicknameRef, (snapshot) => {
                if (snapshot.exists() && snapshot.val() !== this.nickname) {
                    this.nickname = snapshot.val();
                    console.log('🔄 Pseudo mis à jour depuis Firebase:', this.nickname);
                    this.syncToAllInterfaces();
                }
            });
        }
    }

    isAuthorizedToChange() {
        // Autoriser seulement dans certains contextes
        return this.isSettingsPage || 
               window.location.href.includes('settings') ||
               document.querySelector('#settingsModal')?.style.display === 'block';
    }

    // Méthode publique pour les paramètres
    async updateNicknameFromSettings(newNickname) {
        this.isSettingsPage = true; // Forcer l'autorisation
        const success = await this.saveNickname(newNickname);
        this.isSettingsPage = false;
        return success;
    }
}

// Fonction globale pour les paramètres
window.saveNicknameFromSettings = async function(newNickname) {
    if (window.unifiedNickname) {
        return await window.unifiedNickname.updateNicknameFromSettings(newNickname);
    }
    return false;
};

// Fonction globale pour le chat (bloquée)
window.saveNicknameFromChat = function() {
    console.log('🚫 Changement de pseudo depuis le chat bloqué - utiliser les paramètres');
    alert('⚠️ Le pseudo ne peut être modifié que dans les paramètres du dashboard');
    return false;
};

// Initialisation automatique
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        if (sessionStorage.getItem('firebaseUID')) {
            window.unifiedNickname = new UnifiedNicknameSystem();
            console.log('✅ Système pseudo unifié initialisé');
        }
    }, 1000);
});

console.log('🏷️ Système pseudo unifié chargé');