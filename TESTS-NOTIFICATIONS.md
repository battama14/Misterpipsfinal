# 🧪 Plan de Tests - Notifications Mobile

## 📋 Tests à Effectuer

### Test 1 : Activation des Permissions ✅

**Objectif** : Vérifier que les permissions peuvent être accordées

**Étapes :**
1. Ouvrir `mobile-dashboard.html` sur mobile
2. Aller dans Paramètres → Notifications Chat
3. Cliquer sur "🔔 Activer les Notifications"
4. Accepter les permissions dans la popup

**Résultat Attendu :**
- ✅ Popup de permissions s'affiche
- ✅ Bouton devient vert "✅ Notifications Activées"
- ✅ Notification de test s'affiche
- ✅ Son de test se joue
- ✅ Vibration de test se déclenche
- ✅ Toggle "Push" est automatiquement activé

**Résultat Réel :** _À compléter_

---

### Test 2 : Son de Notification 🔊

**Objectif** : Vérifier que le son fonctionne correctement

**Étapes :**
1. Activer le toggle "🔊 Sons"
2. Ouvrir la console (F12)
3. Envoyer un message depuis un autre appareil
4. Observer les logs et écouter

**Résultat Attendu :**
- ✅ Log : "🔊 Son notification mobile joué"
- ✅ Son audible (bip-bip)
- ✅ Durée : ~0.5 seconde
- ✅ Volume : ~30% du volume système

**Test Négatif :**
1. Désactiver le toggle "🔊 Sons"
2. Envoyer un message
3. Observer les logs

**Résultat Attendu :**
- ✅ Log : "🔇 Son désactivé dans les paramètres"
- ✅ Aucun son joué

**Résultat Réel :** _À compléter_

---

### Test 3 : Notifications Push 🔔

**Objectif** : Vérifier que les notifications push s'affichent

**Étapes :**
1. Activer le toggle "🔔 Notifications Push"
2. Quitter l'écran du chat (aller sur Dashboard)
3. Envoyer un message depuis un autre appareil
4. Observer la notification

**Résultat Attendu :**
- ✅ Notification s'affiche en haut de l'écran
- ✅ Titre : "💬 [Pseudo]"
- ✅ Corps : Message (max 100 caractères)
- ✅ Icône : Misterpips.jpg
- ✅ Fermeture automatique après 10 secondes
- ✅ Clic ouvre le chat

**Test Négatif :**
1. Désactiver le toggle "🔔 Notifications Push"
2. Envoyer un message
3. Observer

**Résultat Attendu :**
- ✅ Log : "🔕 Notifications push désactivées dans les paramètres"
- ✅ Aucune notification affichée
- ✅ Badge quand même mis à jour

**Résultat Réel :** _À compléter_

---

### Test 4 : Vibrations 📳

**Objectif** : Vérifier que les vibrations fonctionnent

**Étapes :**
1. Activer le toggle "📳 Vibrations"
2. Envoyer un message depuis un autre appareil
3. Sentir la vibration

**Résultat Attendu :**
- ✅ Vibration : 300ms - pause 100ms - 300ms
- ✅ Pattern distinct et reconnaissable

**Test Négatif :**
1. Désactiver le toggle "📳 Vibrations"
2. Envoyer un message
3. Observer

**Résultat Attendu :**
- ✅ Aucune vibration

**Résultat Réel :** _À compléter_

---

### Test 5 : Sauvegarde des Paramètres 💾

**Objectif** : Vérifier que les paramètres sont sauvegardés

**Étapes :**
1. Modifier les toggles (ex: désactiver Sons)
2. Observer la console
3. Rafraîchir la page
4. Vérifier les toggles

**Résultat Attendu :**
- ✅ Log : "🔊 Son notifications: désactivé"
- ✅ Après refresh : Toggle toujours désactivé
- ✅ localStorage contient les bons paramètres

**Commande Console :**
```javascript
localStorage.getItem('mobileNotificationSettings')
// Devrait retourner : {"sound":false,"push":true,"vibrate":true}
```

**Résultat Réel :** _À compléter_

---

### Test 6 : Badge de Notification 🔴

**Objectif** : Vérifier que le badge se met à jour

**Étapes :**
1. Être sur l'écran Dashboard (pas Chat)
2. Envoyer 3 messages depuis un autre appareil
3. Observer l'icône Chat en bas
4. Cliquer sur l'icône Chat
5. Observer le badge

**Résultat Attendu :**
- ✅ Badge apparaît avec "3"
- ✅ Badge rouge visible
- ✅ Après ouverture du chat : Badge disparaît
- ✅ Log : Badge mis à jour dans la console

**Résultat Réel :** _À compléter_

---

### Test 7 : Notification sur Chat Actif 💬

**Objectif** : Vérifier le comportement quand on est sur le chat

**Étapes :**
1. Ouvrir l'écran Chat
2. Activer le toggle "🔊 Sons"
3. Envoyer un message depuis un autre appareil
4. Observer

**Résultat Attendu :**
- ✅ Log : "🔕 Pas de notification - sur le chat"
- ✅ Aucune notification push affichée
- ✅ Son quand même joué (si activé)
- ✅ Message apparaît dans le chat

**Résultat Réel :** _À compléter_

---

### Test 8 : Permissions Refusées ❌

**Objectif** : Vérifier le comportement si permissions refusées

**Étapes :**
1. Réinitialiser les permissions du site
2. Ouvrir `mobile-dashboard.html`
3. Aller dans Paramètres → Notifications
4. Cliquer sur "🔔 Activer les Notifications"
5. Refuser les permissions

**Résultat Attendu :**
- ✅ Alert : "❌ Permissions refusées..."
- ✅ Bouton devient rouge "❌ Permissions Refusées"
- ✅ Bouton désactivé
- ✅ Log dans la console

**Résultat Réel :** _À compléter_

---

### Test 9 : Plusieurs Messages Simultanés 📨

**Objectif** : Vérifier la gestion de plusieurs messages

**Étapes :**
1. Être sur l'écran Dashboard
2. Envoyer 5 messages rapidement depuis un autre appareil
3. Observer les notifications

**Résultat Attendu :**
- ✅ Une seule notification (dernier message)
- ✅ Badge indique "5"
- ✅ Log : "🔔 5 nouveaux messages détectés"
- ✅ Pas de spam de notifications

**Résultat Réel :** _À compléter_

---

### Test 10 : Changement de Compte 👤

**Objectif** : Vérifier que les paramètres sont liés au compte

**Étapes :**
1. Compte 1 : Désactiver Sons
2. Sauvegarder
3. Changer pour Compte 2
4. Vérifier les toggles
5. Revenir au Compte 1

**Résultat Attendu :**
- ✅ Compte 2 : Sons activés (paramètres par défaut)
- ✅ Compte 1 : Sons désactivés (paramètres sauvegardés)
- ✅ Chaque compte a ses propres paramètres

**Résultat Réel :** _À compléter_

---

### Test 11 : Page de Test 🧪

**Objectif** : Vérifier que la page de test fonctionne

**Étapes :**
1. Ouvrir `test-notifications-mobile.html`
2. Tester chaque bouton :
   - Demander Permission
   - Tester Son
   - Tester Vibration
   - Tester Notification
   - Test Complet
3. Observer les logs

**Résultat Attendu :**
- ✅ Tous les tests fonctionnent
- ✅ Logs affichés correctement
- ✅ Toggles fonctionnent
- ✅ État des permissions correct

**Résultat Réel :** _À compléter_

---

### Test 12 : Compatibilité Navigateurs 🌐

**Objectif** : Vérifier la compatibilité multi-navigateurs

**Navigateurs à Tester :**

#### Chrome Android
- [ ] Permissions
- [ ] Son
- [ ] Vibration
- [ ] Notification
- [ ] Badge

#### Safari iOS (PWA)
- [ ] Permissions
- [ ] Son
- [ ] Vibration
- [ ] Notification
- [ ] Badge

#### Firefox Mobile
- [ ] Permissions
- [ ] Son
- [ ] Vibration
- [ ] Notification
- [ ] Badge

#### Samsung Internet
- [ ] Permissions
- [ ] Son
- [ ] Vibration
- [ ] Notification
- [ ] Badge

**Résultat Réel :** _À compléter_

---

### Test 13 : Performance ⚡

**Objectif** : Vérifier l'impact sur les performances

**Métriques à Mesurer :**
1. Temps de chargement de la page
2. Utilisation mémoire
3. Utilisation CPU
4. Consommation batterie (sur 1h)

**Outils :**
- Chrome DevTools → Performance
- Chrome DevTools → Memory
- Paramètres Android → Batterie

**Résultat Attendu :**
- ✅ Temps de chargement : < 3 secondes
- ✅ Mémoire : < 50 MB
- ✅ CPU : < 5% en idle
- ✅ Batterie : < 1% par heure

**Résultat Réel :** _À compléter_

---

### Test 14 : Cas Limites 🔍

**Objectif** : Tester les cas limites

#### Test 14.1 : Message Très Long
- Envoyer un message de 500 caractères
- Vérifier que la notification tronque à 100 caractères

#### Test 14.2 : Caractères Spéciaux
- Envoyer un message avec emojis : "🚀💰📈"
- Vérifier l'affichage correct

#### Test 14.3 : Connexion Lente
- Activer "Slow 3G" dans DevTools
- Envoyer un message
- Vérifier que la notification arrive

#### Test 14.4 : Hors Ligne
- Désactiver la connexion
- Envoyer un message (ne sera pas reçu)
- Réactiver la connexion
- Vérifier que le message arrive

**Résultat Réel :** _À compléter_

---

## 📊 Rapport de Tests

### Résumé

| Test | Status | Notes |
|------|--------|-------|
| Test 1 : Permissions | ⏳ | _À tester_ |
| Test 2 : Son | ⏳ | _À tester_ |
| Test 3 : Push | ⏳ | _À tester_ |
| Test 4 : Vibrations | ⏳ | _À tester_ |
| Test 5 : Sauvegarde | ⏳ | _À tester_ |
| Test 6 : Badge | ⏳ | _À tester_ |
| Test 7 : Chat Actif | ⏳ | _À tester_ |
| Test 8 : Refusées | ⏳ | _À tester_ |
| Test 9 : Multiples | ⏳ | _À tester_ |
| Test 10 : Comptes | ⏳ | _À tester_ |
| Test 11 : Page Test | ⏳ | _À tester_ |
| Test 12 : Navigateurs | ⏳ | _À tester_ |
| Test 13 : Performance | ⏳ | _À tester_ |
| Test 14 : Cas Limites | ⏳ | _À tester_ |

**Légende :**
- ⏳ À tester
- ✅ Réussi
- ⚠️ Réussi avec remarques
- ❌ Échoué

---

## 🐛 Bugs Trouvés

### Bug #1
**Description :** _À compléter_  
**Sévérité :** Critique / Majeur / Mineur  
**Étapes de Reproduction :**
1. _À compléter_

**Résultat Attendu :** _À compléter_  
**Résultat Réel :** _À compléter_  
**Solution Proposée :** _À compléter_

---

## ✅ Validation Finale

### Checklist de Validation

- [ ] Tous les tests passent
- [ ] Aucun bug critique
- [ ] Performance acceptable
- [ ] Compatible tous navigateurs principaux
- [ ] Documentation complète
- [ ] Page de test fonctionnelle
- [ ] Logs console clairs
- [ ] Expérience utilisateur fluide

### Approbation

**Testé par :** _________________  
**Date :** _________________  
**Signature :** _________________

**Status Final :** ⏳ En Attente / ✅ Approuvé / ❌ Refusé

---

## 📝 Notes Additionnelles

_Espace pour notes, observations, suggestions..._

---

**Document créé le :** 2024  
**Dernière mise à jour :** _________________  
**Version :** 1.0