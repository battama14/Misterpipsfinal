// Fix synchronisation pseudos PC/Mobile - Misterpips
console.log('🔄 Fix sync pseudos PC/Mobile');

// Système de synchronisation unifié
class NicknameSyncFix {
    constructor() {
        this.saving = false;
        this.loading = false;
    }

    async saveNickname(nickname) {
        if (this.saving || !nickname) return false;
        this.saving = true;

        const uid = sessionStorage.getItem('firebaseUID');
        if (!uid) {
            this.saving = false;
            return false;
        }

        try {
            // Sauvegarder local immédiatement
            localStorage.setItem('userNickname', nickname);
            sessionStorage.setItem('userNickname', nickname);
            localStorage.setItem(`nickname_${uid}`, nickname);

            // Sauvegarder Firebase dans TOUS les emplacements
            if (window.firebaseDB) {
                const { ref, set } = await import('https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js');
                
                await Promise.all([
                    set(ref(window.firebaseDB, `users/${uid}/nickname`), nickname),
                    set(ref(window.firebaseDB, `users/${uid}/profile/nickname`), nickname),
                    set(ref(window.firebaseDB, `nicknames/${uid}`), nickname),
                    set(ref(window.firebaseDB, `profiles/${uid}/nickname`), nickname)
                ]);

                console.log('✅ Pseudo synchronisé partout:', nickname);
            }

            this.updateAllInputs(nickname);
            return true;
        } catch (error) {
            console.error('❌ Erreur sync pseudo:', error);
        } finally {
            this.saving = false;
        }
        return false;
    }

    async loadNickname() {
        if (this.loading) return null;
        this.loading = true;

        const uid = sessionStorage.getItem('firebaseUID');
        if (!uid) {
            this.loading = false;
            return null;
        }

        try {
            let nickname = null;

            // 1. Essayer Firebase TOUS les emplacements
            if (window.firebaseDB) {
                const { ref, get } = await import('https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js');
                
                const locations = [
                    `users/${uid}/profile/nickname`,
                    `users/${uid}/nickname`,
                    `nicknames/${uid}`,
                    `profiles/${uid}/nickname`
                ];

                for (const location of locations) {
                    try {
                        const snapshot = await get(ref(window.firebaseDB, location));
                        if (snapshot.exists()) {
                            nickname = snapshot.val();
                            console.log(`📥 Pseudo trouvé Firebase (${location}):`, nickname);
                            break;
                        }
                    } catch (e) {}
                }
            }

            // 2. Fallback localStorage
            if (!nickname) {
                nickname = localStorage.getItem(`nickname_${uid}`) || 
                          localStorage.getItem('userNickname') ||
                          sessionStorage.getItem('userNickname');
            }

            if (nickname) {
                this.updateAllInputs(nickname);
                // Sauvegarder partout pour sync future
                this.saveNickname(nickname);
            }

            return nickname;
        } catch (error) {
            console.error('❌ Erreur load pseudo:', error);
        } finally {
            this.loading = false;
        }
        return null;
    }

    updateAllInputs(nickname) {
        const inputs = [
            document.getElementById('mobileNickname'),
            document.getElementById('nicknameInput'),
            document.querySelector('input[placeholder*="pseudo"]'),
            document.querySelector('input[placeholder*="Pseudo"]')
        ];

        inputs.forEach(input => {
            if (input && input.value !== nickname) {
                input.value = nickname;
            }
        });

        sessionStorage.setItem('userNickname', nickname);
        localStorage.setItem('userNickname', nickname);
    }
}

// Instance globale
window.nicknameSyncFix = new NicknameSyncFix();

// Remplacer toutes les fonctions existantes
window.saveUnifiedNickname = async function() {
    if (window.nicknameSyncFix.saving) return false;

    const inputs = [
        document.getElementById('mobileNickname'),
        document.getElementById('nicknameInput')
    ];

    let nickname = null;
    for (const input of inputs) {
        if (input && input.value.trim()) {
            nickname = input.value.trim();
            break;
        }
    }

    if (!nickname) {
        alert('Veuillez entrer un pseudo');
        return false;
    }

    const success = await window.nicknameSyncFix.saveNickname(nickname);
    if (success) {
        // UN SEUL popup
        if (!window.lastNicknameAlert || Date.now() - window.lastNicknameAlert > 2000) {
            alert('✅ Pseudo sauvegardé et synchronisé PC/Mobile !');
            window.lastNicknameAlert = Date.now();
        }
    }
    return success;
};

// Fonction mobile
window.forceSaveNickname = window.saveUnifiedNickname;

// Chargement automatique
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(async () => {
        const uid = sessionStorage.getItem('firebaseUID');
        if (uid && !window.nicknameLoaded) {
            window.nicknameLoaded = true;
            await window.nicknameSyncFix.loadNickname();
        }
    }, 1000);
});

console.log('✅ Fix sync pseudos PC/Mobile prêt');