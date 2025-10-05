// Fix redirection VIP - Misterpips
console.log('🔄 Fix redirection VIP');

// Vérifier si on doit rediriger vers vip-space
function checkVIPRedirection() {
    const currentPage = window.location.pathname.split('/').pop();
    const isAuthenticated = sessionStorage.getItem('authenticated') === 'true';
    const firebaseUID = sessionStorage.getItem('firebaseUID');
    
    // Pages qui nécessitent une authentification
    const protectedPages = ['dashboard.html', 'mobile-dashboard.html'];
    
    // Si on est sur une page protégée sans être passé par vip-space
    if (protectedPages.includes(currentPage) && isAuthenticated && firebaseUID) {
        const hasVisitedVIPSpace = sessionStorage.getItem('visitedVIPSpace');
        
        if (!hasVisitedVIPSpace) {
            console.log('🔄 Redirection vers VIP Space');
            sessionStorage.setItem('intendedDestination', currentPage);
            window.location.href = 'vip-space.html';
            return;
        }
    }
    
    // Si on est sur vip-space, marquer comme visité
    if (currentPage === 'vip-space.html' && isAuthenticated) {
        sessionStorage.setItem('visitedVIPSpace', 'true');
    }
}

// Fonction pour aller directement au dashboard depuis vip-space
function goToDashboard() {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
                     (window.innerWidth <= 768 && window.innerHeight <= 1024);
    
    if (isMobile) {
        window.location.href = 'mobile-dashboard.html';
    } else {
        window.location.href = 'dashboard.html';
    }
}

// Exposer la fonction globalement
window.goToDashboard = goToDashboard;

// Vérifier au chargement
document.addEventListener('DOMContentLoaded', checkVIPRedirection);

console.log('✅ Fix redirection VIP prêt');