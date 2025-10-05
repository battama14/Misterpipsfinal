# 🚀 Instructions Déploiement Netlify - Misterpips

## 📋 Fichiers Critiques à Uploader

### ✅ Scripts Récents (OBLIGATOIRES) :
```
deploy-version.js
extension-errors-fix.js  
mobile-errors-fix.js
nickname-sync-fix.js
popup-fix.js
fix-nickname-mobile.js
fix-notifications-direct.js
mobile-functions-check.js
ranking-nickname-sync.js
vip-redirect-fix.js
```

### ✅ Pages Principales :
```
index.html
mobile-dashboard.html
dashboard.html
vip-space.html
```

### ✅ Configuration Netlify :
```
netlify.toml
_redirects
```

## 🧪 Tests Après Déploiement

### 1. Test Version :
- URL : `ton-site.netlify.app/version-check-simple.html`
- Résultat attendu : "✅ Version 2.1.0 détectée !"

### 2. Test Mobile Dashboard :
- URL : `ton-site.netlify.app/mobile-dashboard.html`
- Console : Chercher "Version déploiement Netlify"
- Badge : "v2.1.0" en bas à gauche

### 3. Test Pseudo :
- Modifier pseudo dans Paramètres
- Actualiser page (F5)
- Pseudo doit rester identique

## 🚨 Si Problème

### Symptômes :
- Pas de badge version
- Pseudo se remet à l'email
- Erreurs dans console

### Solutions :
1. **Re-upload tous les fichiers .js**
2. **Attendre 2-3 minutes** (cache Netlify)
3. **Vider cache navigateur** : Ctrl+Shift+R
4. **Vérifier** : `ton-site.netlify.app/version-check-simple.html`

## 📞 Debug Rapide

### Console Commands :
```javascript
// Vérifier version
console.log(window.MISTERPIPS_VERSION);

// Vérifier pseudo
console.log(sessionStorage.getItem('userNickname'));

// Vérifier fonctions
console.log(typeof window.nicknameSyncFix);
```

### URLs de Test :
- Version : `/version-check-simple.html`
- Mobile : `/mobile-dashboard.html`
- VIP : `/vip-space.html`