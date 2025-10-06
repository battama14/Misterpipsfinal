// Gestionnaire de pseudo unifié PC/Mobile
class UnifiedNicknameManager {
    constructor() {
        this.currentUser = null;
        this.nickname = null;
        this.initialized = false;
        this.isPrompting = false;
        this.initPromise = null;
    }

    async initialize() {
        // Éviter les initialisations multiples
        if (this.initPromise) {
            return await this.initPromise;
        }
        
        this.initPromise = this._doInitialize();
        return await this.initPromise;
    }
    
    async _doInitialize() {
        const uid = sessionStorage.getItem('firebaseUID');
        if (!uid || !window.firebaseDB) {
            console.log('❌ Firebase non prêt pour le pseudo');
            return null;
        }
        
        this.currentUser = uid;
        await this.loadNickname();
        this.initialized = true;
        return this.nickname;
    }

    async ensureNickname() {
        if (!this.initialized) {
            await this.initialize();
        }

        // Si pas de pseudo ET pas déjà en train de demander, demander à l'utilisateur
        if (!this.nickname && !this.isPrompting) {
            this.isPrompting = true;
            await this.promptForNickname();
            this.isPrompting = false;
        }

        return this.nickname;
    }

    async loadNickname() {
        if (!this.currentUser || !window.firebaseDB) return null;
        
        try {
            const { ref, get } = await import('https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js');
            const nicknameRef = ref(window.firebaseDB, `users/${this.currentUser}/nickname`);
            const snapshot = await get(nicknameRef);
            
            if (snapshot.exists()) {
                this.nickname = snapshot.val();
                sessionStorage.setItem('userNickname', this.nickname);
                this.updateUI();
                console.log('✅ Pseudo chargé:', this.nickname);
            }
            
            return this.nickname;
        } catch (error) {
            console.error('Erreur chargement pseudo:', error);
            return null;
        }
    }

    async promptForNickname() {
        const nickname = prompt('🏷️ Choisissez votre pseudo pour le chat VIP et le classement:', 'Trader VIP');
        
        if (nickname && nickname.trim()) {
            const finalNickname = nickname.trim().substring(0, 20);
            const success = await this.saveNickname(finalNickname);
            
            if (success) {
                alert(`✅ Pseudo "${finalNickname}" enregistré avec succès !`);
                return finalNickname;
            } else {
                alert('❌ Erreur lors de la sauvegarde du pseudo');
            }
        } else {
            // Utiliser un pseudo par défaut
            const defaultNickname = 'Trader VIP';
            await this.saveNickname(defaultNickname);
            return defaultNickname;
        }
        
        return this.nickname;
    }

    async saveNickname(nickname) {
        if (!this.currentUser || !nickname || !window.firebaseDB) return false;
        
        try {
            const { ref, set } = await import('https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js');
            
            // Sauvegarder le pseudo
            const nicknameRef = ref(window.firebaseDB, `users/${this.currentUser}/nickname`);
            await set(nicknameRef, nickname);
            
            // Mettre à jour les données utilisateur
            const userRef = ref(window.firebaseDB, `users/${this.currentUser}`);
            await set(userRef, {
                nickname: nickname,
                isVIP: true,
                plan: 'VIP',
                email: sessionStorage.getItem('userEmail') || 'user@example.com',
                displayName: nickname,
                lastUpdated: new Date().toISOString()
            });
            
            this.nickname = nickname;
            sessionStorage.setItem('userNickname', nickname);
            this.updateUI();
            
            console.log('✅ Pseudo sauvegardé:', nickname);
            
            // Mettre à jour le classement VIP
            setTimeout(() => {
                if (window.vipRanking && window.vipRanking.loadRanking) {
                    window.vipRanking.loadRanking();
                }
            }, 1000);
            
            return true;
        } catch (error) {
            console.error('Erreur sauvegarde pseudo:', error);
            return false;
        }
    }

    updateUI() {
        // Mettre à jour les champs de pseudo sur PC
        const pcNicknameInput = document.getElementById('nicknameInput');
        if (pcNicknameInput) {
            pcNicknameInput.value = this.nickname || '';
        }

        // Mettre à jour les champs de pseudo sur mobile
        const mobileNicknameInput = document.getElementById('mobileNickname');
        if (mobileNicknameInput) {
            mobileNicknameInput.value = this.nickname || '';
        }
    }

    getNickname() {
        return this.nickname || sessionStorage.getItem('userNickname') || 'Trader VIP';
    }

    // Méthode pour changer le pseudo depuis l'interface
    async changeNickname(newNickname) {
        if (!newNickname || newNickname.trim().length === 0) {
            alert('❌ Le pseudo ne peut pas être vide');
            return false;
        }

        const finalNickname = newNickname.trim().substring(0, 20);
        const success = await this.saveNickname(finalNickname);
        
        if (success) {
            alert(`✅ Pseudo changé en "${finalNickname}"`);
            return true;
        } else {
            alert('❌ Erreur lors du changement de pseudo');
            return false;
        }
    }
}

// Instance globale
window.nicknameManager = new UnifiedNicknameManager();

// Fonctions globales pour compatibilité
window.saveUnifiedNickname = async function(fromSettings = false) {
    const input = fromSettings ? 
        document.getElementById('mobileNickname') || document.getElementById('nicknameInput') :
        document.getElementById('nicknameInput') || document.getElementById('mobileNickname');
    
    if (input && input.value.trim()) {
        const success = await window.nicknameManager.changeNickname(input.value.trim());
        return success;
    }
    
    return false;
};

window.loadMobileNicknameSimple = async function() {
    if (window.nicknameManager) {
        await window.nicknameManager.initialize();
    }
};

console.log('🏷️ Gestionnaire de pseudo unifié chargé');