// Version de déploiement - Misterpips
console.log('🚀 Version déploiement Netlify');

// Informations de version
window.MISTERPIPS_VERSION = {
    version: '2.1.0',
    build: Date.now(),
    date: new Date().toISOString(),
    files: [
        'extension-errors-fix.js',
        'mobile-errors-fix.js',
        'nickname-sync-fix.js', 
        'popup-fix.js',
        'fix-nickname-mobile.js',
        'fix-notifications-direct.js',
        'mobile-functions-check.js',
        'ranking-nickname-sync.js',
        'vip-redirect-fix.js'
    ],
    features: [
        'Pseudo synchronisé PC/Mobile',
        'Notifications push iPhone',
        'Fix popups doubles',
        'Erreurs extensions masquées',
        'Classement unifié',
        'VIP Space redirection'
    ]
};

// Afficher version dans console
console.log('📦 Misterpips Version:', window.MISTERPIPS_VERSION.version);
console.log('🕐 Build:', new Date(window.MISTERPIPS_VERSION.build).toLocaleString());
console.log('✨ Fonctionnalités:', window.MISTERPIPS_VERSION.features);

// Badge version visible
setTimeout(() => {
    const badge = document.createElement('div');
    badge.style.cssText = `
        position: fixed; bottom: 10px; left: 10px; z-index: 99999;
        background: rgba(0,0,0,0.8); color: #00d4ff; 
        padding: 5px 10px; border-radius: 15px; font-size: 12px;
        font-family: monospace; cursor: pointer;
    `;
    badge.textContent = `v${window.MISTERPIPS_VERSION.version}`;
    badge.onclick = () => {
        console.log('📊 Version complète:', window.MISTERPIPS_VERSION);
        alert(`Misterpips v${window.MISTERPIPS_VERSION.version}\nBuild: ${new Date(window.MISTERPIPS_VERSION.build).toLocaleString()}`);
    };
    document.body.appendChild(badge);
}, 2000);

console.log('✅ Version déploiement prête');