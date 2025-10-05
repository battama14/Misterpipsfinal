// Système unifié de pseudos - Misterpips
console.log('🏷️ Système pseudo unifié chargé');

class UnifiedNicknameSystem {
    constructor() {
        this.uid = null;
        this.email = null;
        this.nickname = null;
        this.initialized = false;
    }

    async init() {
        if (this.initialized) return;
        
        this.uid = sessionStorage.getItem('firebaseUID');
        this.email = sessionStorage.getItem('userEmail');
        
        if (!this.uid || !this.email) {
            console.log('❌ Pas d\'utilisateur connecté');
            return;
        }
        
        console.log('🔑 Utilisateur:', this.email);
        
        // Charger pseudo existant
        await this.loadNickname();
        
        // Si pas de pseudo, en créer un
        if (!this.nickname) {
            await this.createDefaultNickname();
        }
        
        // Mettre à jour l'interface
        this.updateUI();
        
        this.initialized = true;
        console.log('✅ Pseudo unifié initialisé:', this.nickname);
    }

    async loadNickname() {
        // 1. Essayer Firebase d'abord
        if (window.firebaseDB) {
            try {
                const { ref, get } = await import('https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js');
                const snapshot = await get(ref(window.firebaseDB, `users/${this.uid}/profile/nickname`));
                
                if (snapshot.exists()) {
                    this.nickname = snapshot.val();
                    this.saveLocal();
                    console.log('📥 Pseudo chargé Firebase:', this.nickname);
                    return;
                }
            } catch (error) {
                console.error('Erreur Firebase:', error);
            }
        }
        
        // 2. Essayer localStorage
        const localNickname = localStorage.getItem(`nickname_${this.uid}`);
        if (localNickname) {
            this.nickname = localNickname;
            console.log('📥 Pseudo chargé local:', this.nickname);
            return;
        }
    }

    async createDefaultNickname() {
        // Générer pseudo depuis email
        const baseName = this.email.split('@')[0];
        const randomNum = Math.floor(Math.random() * 999) + 1;
        this.nickname = `${baseName}${randomNum}`;
        
        console.log('🆕 Pseudo généré:', this.nickname);
        await this.saveNickname(this.nickname);
    }

    async saveNickname(newNickname) {
        if (!newNickname || !this.uid) return false;
        
        this.nickname = newNickname.trim();
        
        // Sauvegarder local immédiatement
        this.saveLocal();
        
        // Sauvegarder Firebase
        if (window.firebaseDB) {
            try {
                const { ref, set } = await import('https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js');
                
                // Structure unifiée
                const updates = {};
                updates[`users/${this.uid}/profile/nickname`] = this.nickname;
                updates[`users/${this.uid}/profile/email`] = this.email;
                updates[`users/${this.uid}/profile/lastUpdate`] = Date.now();
                
                // Pour le classement
                updates[`ranking/${this.uid}/nickname`] = this.nickname;
                updates[`ranking/${this.uid}/email`] = this.email;
                
                await Promise.all([
                    set(ref(window.firebaseDB, `users/${this.uid}/profile`), {
                        nickname: this.nickname,
                        email: this.email,
                        lastUpdate: Date.now()
                    }),
                    set(ref(window.firebaseDB, `ranking/${this.uid}/nickname`), this.nickname)
                ]);
                
                console.log('✅ Pseudo sauvegardé Firebase:', this.nickname);
                return true;
            } catch (error) {
                console.error('❌ Erreur sauvegarde Firebase:', error);
            }
        }
        
        return false;
    }

    saveLocal() {
        if (!this.nickname || !this.uid) return;
        
        // Sauvegarder dans plusieurs endroits
        localStorage.setItem(`nickname_${this.uid}`, this.nickname);
        localStorage.setItem(`nickname_${this.email}`, this.nickname);
        localStorage.setItem('currentNickname', this.nickname);
        sessionStorage.setItem('userNickname', this.nickname);
        
        console.log('💾 Pseudo sauvegardé local:', this.nickname);
    }

    updateUI() {
        if (!this.nickname) return;
        
        // Mettre à jour tous les champs pseudo
        const inputs = [
            document.getElementById('mobileNickname'),
            document.getElementById('nicknameInput'),
            document.querySelector('input[placeholder*="pseudo"]'),
            document.querySelector('input[placeholder*="Pseudo"]')
        ];
        
        inputs.forEach(input => {
            if (input && input.value !== this.nickname) {
                input.value = this.nickname;
            }
        });
        
        // Mettre à jour sessionStorage pour les messages
        sessionStorage.setItem('userNickname', this.nickname);
    }

    getNickname() {
        return this.nickname || sessionStorage.getItem('userNickname') || 'Utilisateur';
    }

    async changeNickname(newNickname) {
        if (!newNickname || newNickname.trim() === this.nickname) return false;
        
        const success = await this.saveNickname(newNickname);
        if (success) {
            this.updateUI();
            
            // Recharger le classement si disponible
            if (window.loadMobileRanking) {
                setTimeout(() => window.loadMobileRanking(), 1000);
            }
            if (window.loadRanking) {
                setTimeout(() => window.loadRanking(), 1000);
            }
        }
        
        return success;
    }
}

// Instance globale
window.unifiedNickname = new UnifiedNicknameSystem();

// Fonction de sauvegarde unifiée
window.saveUnifiedNickname = async function() {
    const inputs = [
        document.getElementById('mobileNickname'),
        document.getElementById('nicknameInput')
    ];
    
    let newNickname = null;
    for (const input of inputs) {
        if (input && input.value.trim()) {
            newNickname = input.value.trim();
            break;
        }
    }
    
    if (!newNickname) {
        alert('Veuillez entrer un pseudo');
        return false;
    }
    
    const success = await window.unifiedNickname.changeNickname(newNickname);
    if (success) {
        alert('✅ Pseudo sauvegardé et synchronisé !');
    } else {
        alert('✅ Pseudo sauvegardé localement !');
    }
    
    return success;
};

// Auto-initialisation
document.addEventListener('DOMContentLoaded', () => {
    // Attendre Firebase
    const initNickname = () => {
        if (sessionStorage.getItem('firebaseUID')) {
            window.unifiedNickname.init();
        } else {
            setTimeout(initNickname, 1000);
        }
    };
    
    setTimeout(initNickname, 2000);
});

// Écouter les changements d'authentification
if (window.firebaseAuth) {
    import('https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js')
        .then(({ onAuthStateChanged }) => {
            onAuthStateChanged(window.firebaseAuth, (user) => {
                if (user && !window.unifiedNickname.initialized) {
                    setTimeout(() => window.unifiedNickname.init(), 1000);
                }
            });
        });
}

console.log('✅ Système pseudo unifié prêt');