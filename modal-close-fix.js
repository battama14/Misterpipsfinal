// Correction spécifique pour la fermeture des modales
console.log('🔧 Script de correction des modales chargé');

class ModalCloseFixer {
    constructor() {
        this.init();
    }

    init() {
        console.log('🔧 Initialisation de la correction des modales...');
        
        // Attendre que le DOM soit prêt
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupModalFixes());
        } else {
            this.setupModalFixes();
        }
    }

    setupModalFixes() {
        console.log('🔧 Configuration des corrections de modales...');
        
        // Fonction universelle de fermeture
        this.createCloseFunction();
        
        // Écouter tous les événements de fermeture
        this.setupEventListeners();
        
        // Observer les nouvelles modales
        this.observeNewModals();
        
        console.log('✅ Corrections des modales configurées');
    }

    createCloseFunction() {
        // Fonction de fermeture universelle
        const universalClose = () => {
            console.log('🔒 Fermeture universelle des modales...');
            
            // Liste des modales à fermer
            const modalIds = ['tradeModal', 'fullscreenModal'];
            let modalsClosed = 0;
            
            modalIds.forEach(modalId => {
                const modal = document.getElementById(modalId);
                if (modal) {
                    const isVisible = modal.style.display === 'block' || 
                                    modal.style.display === 'flex' || 
                                    modal.classList.contains('show') ||
                                    window.getComputedStyle(modal).display !== 'none';
                    
                    if (isVisible) {
                        modal.style.display = 'none';
                        modal.classList.remove('show');
                        modalsClosed++;
                        console.log(`✅ Modal ${modalId} fermée`);
                    }
                }
            });
            
            // Fermer aussi les modales personnalisées du dashboard
            if (window.dashboard && typeof window.dashboard.closeModal === 'function') {
                try {
                    window.dashboard.closeModal();
                    console.log('✅ Fonction closeModal du dashboard appelée');
                } catch (error) {
                    console.warn('⚠️ Erreur lors de l\\'appel de closeModal:', error);
                }
            }
            
            if (modalsClosed === 0) {
                console.log('ℹ️ Aucune modale visible à fermer');
            }
            
            return modalsClosed > 0;
        };
        
        // Remplacer les fonctions globales
        window.closeModal = universalClose;
        window.closeFullscreen = universalClose;
        
        // Fonction spécifique pour les boutons de validation
        window.closeModalAfterValidation = () => {
            console.log('✅ Fermeture après validation...');
            setTimeout(universalClose, 100); // Petit délai pour permettre le traitement
        };
        
        console.log('✅ Fonctions de fermeture créées');
    }

    setupEventListeners() {
        console.log('🔧 Configuration des écouteurs d\\'événements...');
        
        // Écouteur principal pour les clics
        document.addEventListener('click', (e) => {
            this.handleClick(e);
        }, true); // Utiliser la capture pour intercepter avant les autres handlers
        
        // Écouteur pour la touche Échap
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                e.preventDefault();
                window.closeModal();
            }
        });
        
        console.log('✅ Écouteurs d\\'événements configurés');
    }

    handleClick(e) {
        const target = e.target;
        
        // Vérifier si c'est un élément de fermeture
        const isCloseElement = this.isCloseElement(target);
        
        if (isCloseElement) {
            console.log('🔒 Élément de fermeture détecté:', target);
            e.preventDefault();
            e.stopPropagation();
            window.closeModal();
            return;
        }
        
        // Vérifier si c'est un clic sur l'arrière-plan d'une modale
        if (this.isModalBackground(target)) {
            console.log('🔒 Clic sur arrière-plan de modale détecté');
            e.preventDefault();
            window.closeModal();
            return;
        }
        
        // Vérifier si c'est un bouton de validation qui devrait fermer la modale
        if (this.isValidationButton(target)) {
            console.log('✅ Bouton de validation détecté');
            // Laisser le bouton faire son travail, puis fermer la modale
            setTimeout(() => {
                window.closeModal();
            }, 500);
        }
    }

    isCloseElement(element) {
        if (!element) return false;
        
        // Classes de fermeture
        const closeClasses = ['close', 'close-btn', 'close-fullscreen', 'modal-close'];
        if (closeClasses.some(cls => element.classList.contains(cls))) {
            return true;
        }
        
        // Texte de fermeture
        const closeTexts = ['×', '✕', 'Fermer', 'Annuler'];
        if (closeTexts.includes(element.textContent?.trim())) {
            return true;
        }
        
        // Attributs de fermeture
        if (element.hasAttribute('data-close') || element.hasAttribute('data-dismiss')) {
            return true;
        }
        
        return false;
    }

    isModalBackground(element) {
        const modalIds = ['tradeModal', 'fullscreenModal'];
        return modalIds.includes(element.id);
    }

    isValidationButton(element) {
        if (element.tagName !== 'BUTTON') return false;
        
        // Classes de validation
        const validationClasses = ['btn-submit', 'btn-save', 'btn-validate'];
        if (validationClasses.some(cls => element.classList.contains(cls))) {
            return true;
        }
        
        // Texte de validation
        const validationTexts = ['Sauvegarder', 'Enregistrer', 'Valider', 'OK'];
        if (validationTexts.some(text => element.textContent?.includes(text))) {
            return true;
        }
        
        // Onclick qui contient des fonctions de sauvegarde
        const onclick = element.getAttribute('onclick') || '';
        if (onclick.includes('save') || onclick.includes('validate')) {
            return true;
        }
        
        return false;
    }

    observeNewModals() {
        // Observer l'ajout de nouvelles modales
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === 1) {
                            // Vérifier si c'est une modale
                            if (node.classList?.contains('modal') || node.id?.includes('modal')) {
                                console.log('🆕 Nouvelle modale détectée:', node.id);
                                this.setupModalSpecificFixes(node);
                            }
                            
                            // Vérifier les modales dans les enfants
                            const modals = node.querySelectorAll?.('.modal, [id*=\"modal\"]');
                            modals?.forEach(modal => {
                                console.log('🆕 Modale enfant détectée:', modal.id);
                                this.setupModalSpecificFixes(modal);
                            });
                        }
                    });
                }
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        console.log('👁️ Observateur de nouvelles modales activé');
    }

    setupModalSpecificFixes(modal) {
        // Ajouter des écouteurs spécifiques à cette modale
        const closeElements = modal.querySelectorAll('.close, .close-btn, [data-close]');
        closeElements.forEach(element => {
            element.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                window.closeModal();
            });
        });
        
        // Ajouter un écouteur pour les clics sur l'arrière-plan
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                window.closeModal();
            }
        });
        
        console.log(`✅ Corrections spécifiques appliquées à la modale ${modal.id}`);
    }
}

// Initialiser le correcteur de modales
let modalFixer;

function initModalFixer() {
    if (!modalFixer) {
        modalFixer = new ModalCloseFixer();
        window.modalFixer = modalFixer;
        console.log('✅ Correcteur de modales initialisé');
    }
}

// Lancer immédiatement
initModalFixer();

// Fonction globale pour forcer la correction des modales
window.fixModals = () => {
    if (modalFixer) {
        modalFixer.setupModalFixes();
    } else {
        initModalFixer();
    }
};

console.log('🔧 Script de correction des modales prêt');