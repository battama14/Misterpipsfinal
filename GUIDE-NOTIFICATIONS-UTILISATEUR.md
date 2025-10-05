# 🔔 Guide Utilisateur - Notifications Mobile

## 🚀 Activation Rapide (3 étapes)

### Étape 1 : Ouvrir les Paramètres
1. Ouvrir l'application Misterpips sur votre mobile
2. Cliquer sur le menu **☰** (en haut à gauche)
3. Sélectionner **⚙️ Paramètres**

### Étape 2 : Activer les Notifications
1. Descendre jusqu'à la section **🔔 Notifications Chat**
2. Cliquer sur le bouton **🔔 Activer les Notifications**
3. Accepter les permissions dans la popup du navigateur

### Étape 3 : Vérifier
✅ Vous devriez recevoir une notification de test avec :
- 📱 Une notification visuelle
- 🔊 Un son
- 📳 Une vibration

**C'est tout ! Vous êtes prêt à recevoir les notifications du chat VIP !**

---

## 🎛️ Personnalisation

### Contrôler les Notifications

Dans **Paramètres** → **Notifications Chat**, vous pouvez activer/désactiver :

#### 🔊 Sons
- **Activé** : Un son se joue à chaque nouveau message
- **Désactivé** : Aucun son (notifications silencieuses)

#### 🔔 Notifications Push
- **Activé** : Notifications visuelles sur votre écran
- **Désactivé** : Aucune notification (seulement le badge)

#### 📳 Vibrations
- **Activé** : Votre téléphone vibre à chaque notification
- **Désactivé** : Pas de vibration

**💡 Astuce** : Les changements sont sauvegardés automatiquement !

---

## 📱 Comportement des Notifications

### Quand recevez-vous une notification ?

✅ **Vous recevez une notification quand :**
- Un nouveau message arrive dans le chat VIP
- Vous n'êtes PAS sur l'écran du chat
- Les notifications push sont activées
- Les permissions sont accordées

❌ **Vous ne recevez PAS de notification quand :**
- Vous êtes déjà sur l'écran du chat
- Les notifications push sont désactivées
- Les permissions sont refusées
- C'est votre propre message

**Note** : Le son peut quand même se jouer si vous êtes sur le chat (si activé)

### Badge de Notification

Un badge rouge avec un chiffre apparaît sur l'icône **💬 Chat** en bas de l'écran :
- Indique le nombre de messages non lus
- Se réinitialise quand vous ouvrez le chat
- Visible même si les notifications sont désactivées

---

## 🔧 Résolution de Problèmes

### Je ne reçois pas de notifications

#### 1. Vérifier les Permissions
- Aller dans **Paramètres** → **Notifications Chat**
- Le bouton doit afficher **✅ Notifications Activées** (vert)
- Si rouge ou gris, cliquer dessus pour réactiver

#### 2. Vérifier les Paramètres du Navigateur
**Chrome/Safari :**
1. Paramètres du navigateur
2. Paramètres du site
3. Notifications → Autoriser

**Firefox :**
1. Menu → Paramètres
2. Confidentialité et sécurité
3. Permissions → Notifications

#### 3. Vérifier les Toggles
- **🔔 Notifications Push** doit être activé (bleu)
- Si désactivé, les activer dans les paramètres

#### 4. iOS : Installer en PWA
Sur iPhone/iPad, les notifications ne fonctionnent qu'en mode PWA :
1. Safari → Partager
2. "Sur l'écran d'accueil"
3. Ouvrir l'app depuis l'écran d'accueil

### Le son ne fonctionne pas

#### 1. Vérifier le Toggle Son
- **🔊 Sons** doit être activé (bleu)

#### 2. Vérifier le Volume
- Augmenter le volume de votre téléphone
- Désactiver le mode silencieux

#### 3. Tester le Son
- Aller dans **Paramètres** → **Notifications Chat**
- Cliquer sur **🔔 Activer les Notifications**
- Un son de test devrait se jouer

### Les vibrations ne fonctionnent pas

#### 1. Vérifier le Toggle Vibrations
- **📳 Vibrations** doit être activé (bleu)

#### 2. Vérifier les Paramètres du Téléphone
- Désactiver le mode "Ne pas déranger"
- Vérifier que les vibrations sont activées dans les paramètres système

### Le badge ne se met pas à jour

#### 1. Rafraîchir la Page
- Tirer vers le bas pour rafraîchir
- Ou fermer et rouvrir l'app

#### 2. Ouvrir le Chat
- Le badge se réinitialise automatiquement
- Quand vous ouvrez l'écran du chat

---

## 📊 Comprendre les Notifications

### Types de Notifications

#### Notification Visuelle (Push)
```
┌─────────────────────────┐
│ 💬 Pseudo de l'utilisateur │
│ Message du chat...      │
└─────────────────────────┘
```
- Apparaît en haut de l'écran
- Reste 10 secondes
- Cliquer dessus ouvre le chat

#### Son de Notification
- 🎵 Son personnalisé (bip-bip)
- Durée : 0.5 seconde
- Volume : 30% du volume système

#### Vibration
- 📳 Pattern : Vibration-Pause-Vibration
- Durée : 300ms - 100ms - 300ms

#### Badge
- 🔴 Chiffre rouge sur l'icône Chat
- Compte les messages non lus
- Maximum affiché : 99+

---

## 💡 Conseils et Astuces

### Pour une Expérience Optimale

#### 1. Installer en PWA (Recommandé)
**Avantages :**
- Notifications plus fiables
- Fonctionne comme une vraie app
- Icône sur l'écran d'accueil

**Comment :**
- **Android** : Chrome → Menu → "Installer l'application"
- **iOS** : Safari → Partager → "Sur l'écran d'accueil"

#### 2. Personnaliser selon vos Besoins

**Mode Discret** (réunion, cours, etc.)
- ❌ Sons : Désactivé
- ✅ Push : Activé
- ❌ Vibrations : Désactivé

**Mode Normal** (utilisation quotidienne)
- ✅ Sons : Activé
- ✅ Push : Activé
- ✅ Vibrations : Activé

**Mode Silencieux** (nuit, concentration)
- ❌ Sons : Désactivé
- ❌ Push : Désactivé
- ❌ Vibrations : Désactivé
- ℹ️ Le badge continuera de compter les messages

#### 3. Tester Régulièrement
- Cliquer sur **🔔 Activer les Notifications** de temps en temps
- Pour vérifier que tout fonctionne
- Surtout après une mise à jour du navigateur

---

## 🆘 Support

### Besoin d'Aide ?

#### Option 1 : Page de Test
1. Ouvrir `test-notifications-mobile.html`
2. Tester chaque fonctionnalité
3. Vérifier les logs en bas de page

#### Option 2 : Réinitialiser
1. **Paramètres** → **Notifications Chat**
2. Désactiver tous les toggles
3. Cliquer sur **💾 Sauvegarder**
4. Réactiver les toggles
5. Cliquer sur **🔔 Activer les Notifications**

#### Option 3 : Réinstaller
1. Supprimer l'app de l'écran d'accueil
2. Vider le cache du navigateur
3. Réinstaller l'app en PWA
4. Réactiver les notifications

---

## 📱 Compatibilité

### Navigateurs Supportés

| Navigateur | Android | iOS | Notes |
|------------|---------|-----|-------|
| Chrome | ✅ | ❌ | Recommandé pour Android |
| Safari | ❌ | ✅ | Uniquement en PWA sur iOS |
| Firefox | ✅ | ⚠️ | Peut nécessiter interaction |
| Edge | ✅ | ❌ | Fonctionne comme Chrome |
| Samsung Internet | ✅ | ❌ | Supporté |

**Légende :**
- ✅ Entièrement supporté
- ⚠️ Supporté avec limitations
- ❌ Non supporté

---

## 🎯 FAQ

### Les notifications fonctionnent-elles en arrière-plan ?
**Android** : Oui, si l'app est installée en PWA  
**iOS** : Partiellement, l'app doit être ouverte

### Puis-je choisir un son personnalisé ?
Pas encore, mais c'est prévu dans une future mise à jour !

### Les notifications consomment-elles beaucoup de batterie ?
Non, l'impact est minimal (< 1% par jour)

### Puis-je désactiver uniquement certaines notifications ?
Oui ! Utilisez les toggles pour personnaliser :
- Sons uniquement
- Push uniquement
- Vibrations uniquement
- Ou toute combinaison

### Que se passe-t-il si je refuse les permissions ?
- Vous ne recevrez pas de notifications push
- Le badge continuera de fonctionner
- Vous pouvez réactiver plus tard dans les paramètres

### Les notifications fonctionnent-elles hors ligne ?
Non, vous devez être connecté à Internet pour recevoir les messages du chat

---

## ✅ Checklist de Configuration

Suivez cette checklist pour une configuration parfaite :

- [ ] App installée en PWA (recommandé)
- [ ] Permissions accordées (bouton vert)
- [ ] Toggle **🔊 Sons** configuré selon préférence
- [ ] Toggle **🔔 Push** configuré selon préférence
- [ ] Toggle **📳 Vibrations** configuré selon préférence
- [ ] Test de notification effectué (son + push + vibration)
- [ ] Badge visible sur l'icône Chat
- [ ] Notification reçue lors d'un test réel

**Si tous les points sont cochés, vous êtes prêt ! 🎉**

---

## 📞 Contact

Pour toute question ou problème :
1. Consulter ce guide
2. Tester avec `test-notifications-mobile.html`
3. Vérifier les logs console (F12)
4. Contacter le support technique

---

**Bon trading et bonne communication ! 📈💬**

*Dernière mise à jour : 2024*