// Banner iPhone PWA - Production
function showInstallBannerNow() {
    // Supprimer ancien banner
    const oldBanner = document.getElementById('iphone-install-banner');
    if (oldBanner) oldBanner.remove();
    
    const banner = document.createElement('div');
    banner.id = 'iphone-install-banner';
    banner.style.cssText = `
        position: fixed !important; 
        top: 0 !important; 
        left: 0 !important; 
        right: 0 !important; 
        z-index: 99999 !important;
        background: #007AFF !important;
        color: white !important; 
        padding: 20px !important; 
        text-align: center !important;
        font-size: 16px !important;
        font-weight: bold !important;
        box-shadow: 0 4px 20px rgba(0,0,0,0.5) !important;
    `;
    
    banner.innerHTML = `
        <div style="margin-bottom: 10px; font-size: 18px;">
            📱 <strong>INSTALLER MISTERPIPS</strong>
        </div>
        <div style="font-size: 14px; line-height: 1.5;">
            <strong>1.</strong> Appuyez sur <strong>📤 PARTAGER</strong> (en bas Safari)<br>
            <strong>2.</strong> Sélectionnez <strong>➕ SUR L'ÉCRAN D'ACCUEIL</strong><br>
            <strong>3.</strong> Appuyez sur <strong>AJOUTER</strong>
        </div>
        <div style="margin-top: 10px; font-size: 12px; opacity: 0.8;">
            Nécessaire pour les notifications push
        </div>
        <button onclick="this.parentElement.remove()" 
                style="position: absolute; top: 10px; right: 15px; background: rgba(255,255,255,0.2); border: none; color: white; font-size: 20px; width: 30px; height: 30px; border-radius: 50%; cursor: pointer;">
            ✕
        </button>
    `;
    
    document.body.appendChild(banner);
}

// Afficher seulement sur iPhone/iPad Safari
if (/iPhone|iPad/.test(navigator.userAgent) && /Safari/.test(navigator.userAgent) && !/CriOS|FxiOS/.test(navigator.userAgent)) {
    setTimeout(showInstallBannerNow, 2000);
}

window.showInstallBannerNow = showInstallBannerNow;