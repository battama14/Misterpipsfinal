// ========================================
// SYSTÈME DE SYNCHRONISATION PSEUDO UNIFIÉ
// Version: 2.0 - Synchronisation PC/Mobile
// ========================================

console.log('🔄 Chargement système de synchronisation pseudo unifié...');

class NicknameSyncSystem {
    constructor() {
        this.uid = null;
        this.email = null;
        this.nickname = null;
        this.initialized = false;
        this.listeners = [];
    }

    // ========================================
    // INITIALISATION
    // ========================================
    async init() {
        if (this.initialized) {
            console.log('⚠️ Système déjà initialisé');
            return;
        }

        console.log('🔧 Initialisation du système de pseudo...');

        // Attendre Firebase
        await this.waitForFirebase();

        // Récupérer l'utilisateur
        this.uid = sessionStorage.getItem('firebaseUID');
        this.email = sessionStorage.getItem('userEmail');

        if (!this.uid || !this.email) {
            console.error('❌ Utilisateur non connecté');
            return;
        }

        console.log('✅ Utilisateur:', this.email, '(UID:', this.uid + ')');

        // Charger le pseudo depuis Firebase (source de vérité)
        await this.loadNicknameFromFirebase();

        // Si pas de pseudo, en créer un
        if (!this.nickname) {
            await this.createDefaultNickname();
        }

        // Mettre à jour l'interface
        this.updateAllUI();

        // Écouter les changements en temps réel
        this.setupRealtimeListener();

        this.initialized = true;
        console.log('✅ Système de pseudo initialisé:', this.nickname);
    }

    // ========================================
    // CHARGEMENT DU PSEUDO
    // ========================================
    async loadNicknameFromFirebase() {
        if (!window.firebaseDB) {
            console.error('❌ Firebase non disponible');
            return;
        }

        try {
            const { ref, get } = await import('https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js');

            // Chercher dans l'ordre de priorité
            const paths = [
                `users/${this.uid}/profile/nickname`,  // Priorité 1
                `users/${this.uid}/nickname`,          // Priorité 2
                `ranking/${this.uid}/nickname`         // Priorité 3
            ];

            for (const path of paths) {
                try {
                    const snapshot = await get(ref(window.firebaseDB, path));
                    if (snapshot.exists() && snapshot.val()) {
                        this.nickname = snapshot.val();
                        console.log(`✅ Pseudo chargé depuis ${path}:`, this.nickname);
                        
                        // Sauvegarder localement
                        this.saveToLocalStorage();
                        
                        return;
                    }
                } catch (error) {
                    console.log(`⚠️ Erreur lecture ${path}:`, error.message);
                }
            }

            console.log('ℹ️ Aucun pseudo trouvé dans Firebase');

        } catch (error) {
            console.error('❌ Erreur chargement pseudo:', error);
        }
    }

    // ========================================
    // CRÉATION PSEUDO PAR DÉFAUT
    // ========================================
    async createDefaultNickname() {
        const baseName = this.email.split('@')[0];
        const randomNum = Math.floor(Math.random() * 999) + 1;
        this.nickname = `${baseName}${randomNum}`;

        console.log('🆕 Création pseudo par défaut:', this.nickname);

        // Sauvegarder immédiatement
        await this.saveNickname(this.nickname);
    }

    // ========================================
    // SAUVEGARDE DU PSEUDO (MULTI-EMPLACEMENTS)
    // ========================================
    async saveNickname(newNickname) {
        if (!newNickname || !this.uid) {
            console.error('❌ Pseudo ou UID manquant');
            return false;
        }

        newNickname = newNickname.trim();
        
        if (newNickname.length < 3) {
            console.error('❌ Pseudo trop court (min 3 caractères)');
            return false;
        }

        this.nickname = newNickname;

        console.log('💾 Sauvegarde du pseudo:', this.nickname);

        // 1. Sauvegarder localement immédiatement
        this.saveToLocalStorage();

        // 2. Sauvegarder dans Firebase (TOUS les emplacements)
        if (window.firebaseDB) {
            try {
                const { ref, set, update } = await import('https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js');

                const timestamp = Date.now();

                // Sauvegarder dans TOUS les emplacements pour garantir la synchronisation
                const updates = {};
                
                // Emplacement principal (profile)
                updates[`users/${this.uid}/profile/nickname`] = this.nickname;
                updates[`users/${this.uid}/profile/email`] = this.email;
                updates[`users/${this.uid}/profile/lastUpdate`] = timestamp;
                
                // Emplacement secondaire (racine users)
                updates[`users/${this.uid}/nickname`] = this.nickname;
                
                // Emplacement classement
                updates[`ranking/${this.uid}/nickname`] = this.nickname;
                updates[`ranking/${this.uid}/email`] = this.email;
                updates[`ranking/${this.uid}/lastUpdate`] = timestamp;

                // Appliquer toutes les mises à jour en une seule transaction
                await update(ref(window.firebaseDB), updates);

                console.log('✅ Pseudo sauvegardé dans Firebase (tous emplacements)');
                
                // Notifier les listeners
                this.notifyListeners();
                
                return true;

            } catch (error) {
                console.error('❌ Erreur sauvegarde Firebase:', error);
                return false;
            }
        }

        return false;
    }

    // ========================================
    // SAUVEGARDE LOCALE
    // ========================================
    saveToLocalStorage() {
        if (!this.nickname || !this.uid) return;

        // Sauvegarder dans plusieurs clés pour compatibilité
        localStorage.setItem(`nickname_${this.uid}`, this.nickname);
        localStorage.setItem(`nickname_${this.email}`, this.nickname);
        localStorage.setItem('currentNickname', this.nickname);
        
        sessionStorage.setItem('userNickname', this.nickname);
        sessionStorage.setItem(`nickname_${this.uid}`, this.nickname);

        console.log('💾 Pseudo sauvegardé localement');
    }

    // ========================================
    // MISE À JOUR INTERFACE
    // ========================================
    updateAllUI() {
        if (!this.nickname) return;

        console.log('🎨 Mise à jour interface avec pseudo:', this.nickname);

        // Tous les inputs possibles
        const selectors = [
            '#mobileNickname',
            '#nicknameInput',
            '#userNickname',
            'input[placeholder*="pseudo" i]',
            'input[placeholder*="Pseudo" i]',
            'input[name="nickname"]'
        ];

        selectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                if (element && element.value !== this.nickname) {
                    element.value = this.nickname;
                    console.log(`✅ Input mis à jour: ${selector}`);
                }
            });
        });

        // Mettre à jour les affichages texte
        const displaySelectors = [
            '.user-nickname',
            '.current-nickname',
            '#displayNickname'
        ];

        displaySelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                if (element) {
                    element.textContent = this.nickname;
                }
            });
        });

        // Mettre à jour sessionStorage
        sessionStorage.setItem('userNickname', this.nickname);
    }

    // ========================================
    // ÉCOUTE TEMPS RÉEL
    // ========================================
    setupRealtimeListener() {
        if (!window.firebaseDB) return;

        import('https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js')
            .then(({ ref, onValue }) => {
                const nicknameRef = ref(window.firebaseDB, `users/${this.uid}/profile/nickname`);
                
                onValue(nicknameRef, (snapshot) => {
                    if (snapshot.exists()) {
                        const newNickname = snapshot.val();
                        if (newNickname && newNickname !== this.nickname) {
                            console.log('🔄 Pseudo mis à jour en temps réel:', newNickname);
                            this.nickname = newNickname;
                            this.saveToLocalStorage();
                            this.updateAllUI();
                            this.notifyListeners();
                        }
                    }
                });

                console.log('👂 Écoute temps réel activée');
            })
            .catch(error => {
                console.error('❌ Erreur setup listener:', error);
            });
    }

    // ========================================
    // SYSTÈME DE LISTENERS
    // ========================================
    addListener(callback) {
        this.listeners.push(callback);
    }

    notifyListeners() {
        this.listeners.forEach(callback => {
            try {
                callback(this.nickname);
            } catch (error) {
                console.error('❌ Erreur listener:', error);
            }
        });
    }

    // ========================================
    // UTILITAIRES
    // ========================================
    async waitForFirebase() {
        let attempts = 0;
        while (!window.firebaseDB && attempts < 20) {
            console.log(`⏳ Attente Firebase... (${attempts + 1}/20)`);
            await new Promise(resolve => setTimeout(resolve, 500));
            attempts++;
        }

        if (!window.firebaseDB) {
            console.error('❌ Firebase non disponible après 10 secondes');
            return false;
        }

        console.log('✅ Firebase disponible');
        return true;
    }

    getNickname() {
        return this.nickname || sessionStorage.getItem('userNickname') || 'Utilisateur';
    }

    async changeNickname(newNickname) {
        if (!newNickname || newNickname.trim() === this.nickname) {
            return false;
        }

        const success = await this.saveNickname(newNickname);
        
        if (success) {
            this.updateAllUI();
            
            // Recharger les classements
            setTimeout(() => {
                if (window.loadMobileRanking) {
                    console.log('🔄 Rechargement classement mobile...');
                    window.loadMobileRanking();
                }
                if (window.vipRanking && window.vipRanking.loadRanking) {
                    console.log('🔄 Rechargement classement PC...');
                    window.vipRanking.loadRanking();
                }
            }, 1000);
        }

        return success;
    }
}

// ========================================
// INSTANCE GLOBALE
// ========================================
window.nicknameSyncSystem = new NicknameSyncSystem();

// ========================================
// FONCTION GLOBALE DE SAUVEGARDE
// ========================================
window.saveNicknameUnified = async function() {
    console.log('💾 Sauvegarde pseudo demandée...');

    // Chercher l'input avec le nouveau pseudo
    const inputs = [
        document.getElementById('mobileNickname'),
        document.getElementById('nicknameInput'),
        document.getElementById('userNickname')
    ];

    let newNickname = null;
    for (const input of inputs) {
        if (input && input.value.trim()) {
            newNickname = input.value.trim();
            break;
        }
    }

    if (!newNickname) {
        alert('❌ Veuillez entrer un pseudo');
        return false;
    }

    if (newNickname.length < 3) {
        alert('❌ Le pseudo doit contenir au moins 3 caractères');
        return false;
    }

    const success = await window.nicknameSyncSystem.changeNickname(newNickname);
    
    if (success) {
        alert('✅ Pseudo sauvegardé et synchronisé sur tous vos appareils !');
    } else {
        alert('⚠️ Pseudo sauvegardé localement (vérifiez votre connexion)');
    }

    return success;
};

// ========================================
// AUTO-INITIALISATION
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('📱 DOM chargé, initialisation du système de pseudo...');
    
    const initSystem = () => {
        const uid = sessionStorage.getItem('firebaseUID');
        if (uid) {
            console.log('✅ Utilisateur détecté, initialisation...');
            window.nicknameSyncSystem.init();
        } else {
            console.log('⏳ En attente de l\'authentification...');
            setTimeout(initSystem, 1000);
        }
    };

    setTimeout(initSystem, 2000);
});

// Écouter les changements d'authentification
setTimeout(() => {
    if (window.firebaseAuth) {
        import('https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js')
            .then(({ onAuthStateChanged }) => {
                onAuthStateChanged(window.firebaseAuth, (user) => {
                    if (user && !window.nicknameSyncSystem.initialized) {
                        console.log('🔐 Authentification détectée, initialisation...');
                        setTimeout(() => window.nicknameSyncSystem.init(), 1000);
                    }
                });
            })
            .catch(error => {
                console.error('❌ Erreur listener auth:', error);
            });
    }
}, 3000);

console.log('✅ Système de synchronisation pseudo unifié chargé');