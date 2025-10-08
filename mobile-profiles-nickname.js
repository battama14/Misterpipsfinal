// Mobile Profiles Nickname System - Version unifiée
// Utilise exclusivement profiles/{uid}/nickname comme source unique

(function() {
    'use strict';
    
    console.log('🔧 Mobile Profiles Nickname System - Initialisation');
    
    // Système unifié de gestion des pseudos mobiles
    window.mobileNicknameSystem = {
        // Obtenir le pseudo actuel depuis Firebase profiles/{uid}/nickname
        async getCurrentNickname() {
            try {
                const uid = sessionStorage.getItem('firebaseUID');
                if (!uid || !window.firebaseDB) {
                    console.log('❌ Mobile: UID ou Firebase manquant');
                    return 'Mobile User';
                }
                
                const { ref, get } = await import('https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js');
                const nicknameRef = ref(window.firebaseDB, `profiles/${uid}/nickname`);
                const snapshot = await get(nicknameRef);
                
                if (snapshot.exists()) {
                    const nickname = snapshot.val();
                    console.log('✅ Mobile: Pseudo chargé depuis profiles:', nickname);
                    return nickname;
                } else {
                    console.log('⚠️ Mobile: Aucun pseudo dans profiles, utilisation par défaut');
                    return 'Mobile User';
                }
            } catch (error) {
                console.error('❌ Mobile: Erreur lecture pseudo:', error);
                return 'Mobile User';
            }
        },
        
        // Changer le pseudo et le sauvegarder dans profiles/{uid}/nickname
        async changeNickname(newNickname) {
            try {
                const uid = sessionStorage.getItem('firebaseUID');
                if (!uid || !window.firebaseDB) {
                    console.error('❌ Mobile: UID ou Firebase manquant pour changement pseudo');
                    return false;
                }
                
                if (!newNickname || newNickname.trim().length === 0) {
                    console.error('❌ Mobile: Pseudo vide');
                    return false;
                }
                
                const cleanNickname = newNickname.trim();
                
                const { ref, set } = await import('https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js');
                const nicknameRef = ref(window.firebaseDB, `profiles/${uid}/nickname`);
                await set(nicknameRef, cleanNickname);
                
                console.log('✅ Mobile: Pseudo sauvegardé dans profiles:', cleanNickname);
                
                // Mettre à jour l'affichage mobile
                this.updateMobileNicknameDisplay(cleanNickname);
                
                return true;
            } catch (error) {
                console.error('❌ Mobile: Erreur sauvegarde pseudo:', error);
                return false;
            }
        },
        
        // Mettre à jour l'affichage du pseudo dans l'interface mobile
        updateMobileNicknameDisplay(nickname) {
            const nicknameInput = document.getElementById('mobileNickname');
            if (nicknameInput) {
                nicknameInput.value = nickname;
            }
            
            // Mettre à jour autres éléments d'affichage si nécessaire
            const nicknameDisplays = document.querySelectorAll('.mobile-nickname-display');
            nicknameDisplays.forEach(element => {
                element.textContent = nickname;
            });
        },
        
        // Initialiser le système mobile
        async init() {
            console.log('🔧 Mobile: Initialisation système pseudo profiles');
            
            // Attendre que Firebase soit prêt
            let attempts = 0;
            while (!window.firebaseDB && attempts < 50) {
                await new Promise(resolve => setTimeout(resolve, 100));
                attempts++;
            }
            
            if (!window.firebaseDB) {
                console.error('❌ Mobile: Firebase non disponible après 5s');
                return;
            }
            
            // Charger le pseudo actuel
            const currentNickname = await this.getCurrentNickname();
            this.updateMobileNicknameDisplay(currentNickname);
            
            // Configurer le bouton de sauvegarde
            this.setupSaveButton();
            
            console.log('✅ Mobile: Système pseudo profiles initialisé');
        },
        
        // Configurer le bouton de sauvegarde du pseudo
        setupSaveButton() {
            const saveBtn = document.getElementById('saveNicknameBtn');
            if (saveBtn && !saveBtn.hasAttribute('data-mobile-profiles-init')) {
                saveBtn.setAttribute('data-mobile-profiles-init', 'true');
                
                saveBtn.addEventListener('click', async (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    const input = document.getElementById('mobileNickname');
                    const newNickname = input ? input.value.trim() : '';
                    
                    if (!newNickname) {
                        alert('❌ Veuillez saisir un pseudo');
                        return;
                    }
                    
                    const success = await this.changeNickname(newNickname);
                    if (success) {
                        alert('✅ Pseudo sauvegardé !');
                    } else {
                        alert('❌ Erreur lors de la sauvegarde');
                    }
                });
                
                console.log('✅ Mobile: Bouton sauvegarde pseudo configuré');
            }
        }
    };
    
    // Fonction globale pour la sauvegarde depuis les paramètres
    window.saveMobileNicknameFromSettings = async function() {
        const input = document.getElementById('mobileNickname');
        const newNickname = input ? input.value.trim() : '';
        
        if (!newNickname) {
            console.log('⚠️ Mobile: Pseudo vide, pas de sauvegarde');
            return false;
        }
        
        return await window.mobileNicknameSystem.changeNickname(newNickname);
    };
    
    // Bloquer les anciens systèmes de pseudo mobile
    const blockOldMobileSystems = () => {
        // Bloquer localStorage.setItem pour les anciens pseudos
        const originalSetItem = localStorage.setItem;
        localStorage.setItem = function(key, value) {
            if (key.includes('nickname') || key.includes('pseudo') || key.includes('Nickname')) {
                console.log('🚫 Mobile: Blocage ancien système localStorage pseudo:', key);
                return;
            }
            return originalSetItem.call(this, key, value);
        };
        
        // Bloquer sessionStorage.setItem pour les anciens pseudos
        const originalSessionSetItem = sessionStorage.setItem;
        sessionStorage.setItem = function(key, value) {
            if (key.includes('nickname') || key.includes('pseudo') || key.includes('Nickname')) {
                console.log('🚫 Mobile: Blocage ancien système sessionStorage pseudo:', key);
                return;
            }
            return originalSessionSetItem.call(this, key, value);
        };
        
        console.log('🚫 Mobile: Anciens systèmes de pseudo bloqués');
    };
    
    // Initialisation
    document.addEventListener('DOMContentLoaded', () => {
        blockOldMobileSystems();
        
        // Initialiser après un délai pour s'assurer que Firebase est prêt
        setTimeout(() => {
            window.mobileNicknameSystem.init();
        }, 2000);
    });
    
    // Si le DOM est déjà chargé
    if (document.readyState === 'loading') {
        // Attendre le DOMContentLoaded
    } else {
        blockOldMobileSystems();
        setTimeout(() => {
            window.mobileNicknameSystem.init();
        }, 2000);
    }
    
})();