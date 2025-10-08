// Solution permanente pour les pseudos
class PermanentNickname {
    constructor() {
        this.uid = sessionStorage.getItem('firebaseUID');
        this.email = sessionStorage.getItem('userEmail');
        if (this.uid) this.init();
    }

    async init() {
        await this.ensureNickname();
        this.blockAllChanges();
        this.displayNickname();
    }

    async ensureNickname() {
        if (!window.firebaseDB) return;
        
        try {
            const { ref, get } = await import('https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js');
            const nicknameRef = ref(window.firebaseDB, `users/${this.uid}/nickname`);
            const snapshot = await get(nicknameRef);
            
            if (snapshot.exists() && snapshot.val()) {
                // Pseudo existe déjà
                this.nickname = snapshot.val();
                console.log('✅ Pseudo existant chargé:', this.nickname);
                
                // Forcer dans sessionStorage
                sessionStorage.setItem('userNickname', this.nickname);
            } else {
                // Aucun pseudo - ne pas en créer automatiquement
                console.log('⚠️ Aucun pseudo défini pour cet utilisateur');
                this.nickname = null;
            }
            
        } catch (error) {
            console.error('Erreur pseudo permanent:', error);
        }
    }

    blockAllChanges() {
        // Bloquer tous les inputs de pseudo
        const observer = new MutationObserver(() => {
            this.forceNicknameInInputs();
        });
        observer.observe(document.body, { childList: true, subtree: true });
        
        // Forcer immédiatement
        this.forceNicknameInInputs();
        
        // Bloquer sessionStorage
        const originalSetItem = sessionStorage.setItem;
        sessionStorage.setItem = (key, value) => {
            if (key === 'userNickname' && value !== this.nickname) {
                console.log('🚫 Changement pseudo bloqué');
                return originalSetItem.call(sessionStorage, key, this.nickname);
            }
            return originalSetItem.call(sessionStorage, key, value);
        };
    }

    forceNicknameInInputs() {
        if (!this.nickname) return;
        
        const inputs = [
            document.getElementById('nicknameInput'),
            document.getElementById('mobileNickname'),
            ...document.querySelectorAll('input[placeholder*="pseudo"]'),
            ...document.querySelectorAll('input[placeholder*="Pseudo"]')
        ];
        
        inputs.forEach(input => {
            if (input) {
                // Ne pas bloquer les inputs dans les paramètres
                const isInSettings = input.closest('#settingsModal') || 
                                   input.closest('.settings-section') ||
                                   input.id === 'settingsNickname';
                
                if (!isInSettings) {
                    if (input.value !== this.nickname) {
                        input.value = this.nickname;
                    }
                    input.readOnly = true;
                    input.style.backgroundColor = '#f0f0f0';
                    input.title = 'Modifiable uniquement dans les paramètres';
                } else {
                    // Dans les paramètres, permettre la modification
                    input.readOnly = false;
                    input.style.backgroundColor = '';
                    input.style.color = '#ffffff';
                    input.title = '';
                }
            }
        });
    }

    displayNickname() {
        if (!this.nickname) return;
        
        // Afficher dans le classement
        const displays = [
            ...document.querySelectorAll('.trader-name'),
            ...document.querySelectorAll('.user-nickname'),
            ...document.querySelectorAll('#currentNickname')
        ];
        
        displays.forEach(display => {
            if (display) display.textContent = this.nickname;
        });
        
        // Forcer dans le chat
        if (window.iMessageChat) {
            window.iMessageChat.nickname = this.nickname;
        }
    }

    async updateFromSettings(newNickname) {
        if (!newNickname || newNickname.includes('@')) return false;
        
        try {
            const { ref, set } = await import('https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js');
            await set(ref(window.firebaseDB, `users/${this.uid}/nickname`), newNickname);
            
            this.nickname = newNickname;
            sessionStorage.setItem('userNickname', newNickname);
            this.displayNickname();
            this.forceNicknameInInputs();
            
            return true;
        } catch (error) {
            console.error('Erreur mise à jour pseudo:', error);
            return false;
        }
    }
}

// Initialisation quand l'utilisateur est connecté
document.addEventListener('DOMContentLoaded', () => {
    const checkUID = setInterval(() => {
        const uid = sessionStorage.getItem('firebaseUID');
        if (uid && !window.permanentNickname) {
            clearInterval(checkUID);
            window.permanentNickname = new PermanentNickname();
            console.log(`🔒 Pseudo permanent activé pour ${uid}`);
        }
    }, 500);
});

// Override des fonctions de sauvegarde
window.saveNicknameFromChat = () => {
    alert('⚠️ Pseudo modifiable uniquement dans les paramètres');
    return false;
};

window.saveNicknameFromSettings = async (newNickname) => {
    if (window.permanentNickname) {
        return await window.permanentNickname.updateFromSettings(newNickname);
    }
    return false;
};

console.log('🔒 Pseudo permanent activé');