# ✅ Checklist de Test Manuel - Site Misterpips

**Date:** $(Get-Date -Format "yyyy-MM-dd")  
**Testeur:** _________________  
**Navigateur:** _________________  
**Version:** _________________

---

## 📋 Instructions

Pour chaque test, cochez ✅ si réussi, ❌ si échoué, ou ⚠️ si problème mineur.

---

## 🏠 PAGE D'ACCUEIL (index.html)

### Navigation
- [ ] Le logo Misterpips s'affiche correctement
- [ ] Le menu de navigation est visible et fonctionnel
- [ ] Les liens du menu fonctionnent (Présentation, Apprentissage, À propos, Contact)
- [ ] Le bouton "CONNEXION VIP" est visible et cliquable
- [ ] Le bouton "Support Telegram" ouvre le bon lien

### Sections
- [ ] La section Hero s'affiche avec le titre et les boutons
- [ ] La section Présentation s'affiche
- [ ] La section Actualités charge les news publiques
- [ ] La section Apprentissage affiche l'e-book
- [ ] La section À propos s'affiche correctement
- [ ] La section Contact fonctionne

### Responsive
- [ ] Le site s'adapte correctement sur mobile (< 768px)
- [ ] Le site s'adapte correctement sur tablette (768px - 1024px)
- [ ] Le site s'adapte correctement sur desktop (> 1024px)

### Performance
- [ ] La page charge en moins de 3 secondes
- [ ] Les images se chargent correctement
- [ ] Pas d'erreurs dans la console

**Notes:** _______________________________________________

---

## 💼 DASHBOARD PC (dashboard.html)

### Authentification
- [ ] Redirection vers index.html si non connecté
- [ ] Redirection vers mobile-dashboard.html sur mobile
- [ ] L'utilisateur connecté reste sur la page

### Interface Principale
- [ ] Le header s'affiche avec le titre "Dashboard Trading"
- [ ] Le bouton "Accueil VIP" fonctionne
- [ ] Le sélecteur de compte s'affiche
- [ ] Les 3 comptes par défaut sont présents (Principal, Démo, Swing)
- [ ] Le bouton "+ Nouveau" permet d'ajouter un compte
- [ ] Le bouton "Supprimer" supprime le compte sélectionné
- [ ] L'indicateur "Sync Auto" s'affiche

### Statistiques Overview
- [ ] Capital s'affiche correctement
- [ ] Winrate s'affiche en pourcentage
- [ ] P&L Total s'affiche avec le bon signe (+/-)
- [ ] Trades Ouverts affiche le bon nombre
- [ ] Total Trades affiche le bon nombre

### Boutons d'Action
- [ ] "Nouveau Trade" ouvre le modal de création
- [ ] "Trade Passé" ouvre le modal pour trade historique
- [ ] "Paramètres" ouvre le modal de configuration
- [ ] "Clôturer Trade" ouvre le modal de clôture
- [ ] "Export Excel" télécharge un fichier Excel

### Graphiques
- [ ] Graphique "Performance Cumulative" s'affiche
- [ ] Graphique "Taux de Réussite" s'affiche
- [ ] Graphique "Performance Mensuelle" s'affiche
- [ ] Graphique "Performance Totale" s'affiche
- [ ] Les graphiques se mettent à jour avec les données

### Modal Nouveau Trade
- [ ] Le modal s'ouvre correctement
- [ ] Tous les champs sont présents (Paire, Type, Lots, Entry, SL, TP)
- [ ] Le calcul du Risk/Reward fonctionne
- [ ] Le calcul du P&L potentiel fonctionne
- [ ] Le bouton "Ouvrir Trade" enregistre le trade
- [ ] Le bouton "Annuler" ferme le modal

### Modal Clôturer Trade
- [ ] Le modal liste tous les trades ouverts
- [ ] Chaque trade affiche les bonnes informations
- [ ] Le prix de sortie peut être saisi
- [ ] Le P&L est calculé automatiquement
- [ ] Le bouton "Clôturer" ferme le trade
- [ ] Les statistiques se mettent à jour après clôture

### Modal Paramètres
- [ ] Le capital initial peut être modifié
- [ ] Le pourcentage de risque peut être modifié
- [ ] Les paramètres sont sauvegardés
- [ ] Les paramètres persistent après rechargement

### Calculs Trading
- [ ] **Test P&L:** Entry 1.1000 → Exit 1.1050 (1 lot) = $500 ✅
- [ ] **Test P&L:** Entry 1.2000 → Exit 1.1950 (1 lot) = -$500 ✅
- [ ] **Test Winrate:** 7 wins / 10 trades = 70% ✅
- [ ] **Test Risk/Reward:** Risk $100, Reward $300 = 1:3 ✅
- [ ] Les calculs sont précis à 2 décimales

### Synchronisation Firebase
- [ ] Les trades sont sauvegardés dans Firebase
- [ ] Les trades se chargent au démarrage
- [ ] Les modifications sont synchronisées en temps réel
- [ ] Le changement de compte charge les bonnes données

**Notes:** _______________________________________________

---

## 📱 DASHBOARD MOBILE (mobile-dashboard.html)

### Authentification
- [ ] Redirection vers index.html si non connecté
- [ ] Accès direct depuis dashboard.html sur mobile

### Navigation Mobile
- [ ] La barre de navigation inférieure s'affiche
- [ ] 5 onglets sont présents (Accueil, Trades, Chat, Classement, Compte)
- [ ] Le changement d'onglet fonctionne
- [ ] L'onglet actif est mis en surbrillance
- [ ] Les badges de notification s'affichent

### Onglet Accueil
- [ ] Les statistiques principales s'affichent
- [ ] Le graphique de performance s'affiche
- [ ] Les trades récents sont listés
- [ ] Le bouton "Nouveau Trade" fonctionne

### Onglet Trades
- [ ] Les trades ouverts sont listés
- [ ] Les trades fermés sont listés
- [ ] Le filtre "Ouverts/Fermés" fonctionne
- [ ] Chaque trade affiche les bonnes informations
- [ ] Le swipe pour clôturer fonctionne
- [ ] Le bouton "+" ouvre le modal de création

### Onglet Chat
- [ ] La liste des conversations s'affiche
- [ ] Le badge de messages non lus fonctionne
- [ ] Cliquer sur une conversation l'ouvre
- [ ] Les messages s'affichent correctement
- [ ] L'envoi de message fonctionne
- [ ] Les emojis fonctionnent
- [ ] Les messages sont synchronisés en temps réel

### Onglet Classement
- [ ] Le classement général s'affiche
- [ ] Les utilisateurs sont triés par performance
- [ ] Le pseudo de l'utilisateur s'affiche
- [ ] Les statistiques de chaque utilisateur sont correctes
- [ ] Le filtre par période fonctionne (Semaine, Mois, Année)

### Onglet Compte
- [ ] Les informations du compte s'affichent
- [ ] Le sélecteur de compte fonctionne
- [ ] Le bouton "Ajouter un compte" fonctionne
- [ ] Le bouton "Paramètres" ouvre les réglages
- [ ] Le bouton "Déconnexion" déconnecte l'utilisateur

### Notifications Push 🔔
- [ ] Le bouton "Activer les notifications" s'affiche
- [ ] Cliquer demande la permission du navigateur
- [ ] Une notification de test s'affiche après activation
- [ ] Les notifications de nouveaux messages fonctionnent
- [ ] Les notifications s'affichent même quand l'app est fermée
- [ ] Les notifications se ferment automatiquement après 10 secondes
- [ ] Cliquer sur une notification ouvre le chat correspondant

### Son des Notifications 🔊
- [ ] Le toggle "Son" dans les paramètres fonctionne
- [ ] Le son se joue quand activé
- [ ] Le son ne se joue pas quand désactivé
- [ ] Le son respecte les paramètres utilisateur
- [ ] Le son se joue même sur chat actif (si activé)
- [ ] Le volume du son est approprié

### Vibrations 📳
- [ ] Le toggle "Vibrations" dans les paramètres fonctionne
- [ ] Le téléphone vibre lors d'une notification (si activé)
- [ ] Pas de vibration si désactivé
- [ ] La vibration fonctionne sur mobile uniquement

### Paramètres de Notifications
- [ ] Les toggles se sauvegardent en temps réel
- [ ] Pas besoin de cliquer sur "Sauvegarder"
- [ ] Les paramètres persistent après rechargement
- [ ] Les paramètres sont spécifiques à chaque compte
- [ ] Le bouton "Tester les notifications" fonctionne

### Responsive Mobile
- [ ] L'interface s'adapte aux petits écrans (< 375px)
- [ ] L'interface s'adapte aux écrans moyens (375px - 414px)
- [ ] L'interface s'adapte aux grands écrans (> 414px)
- [ ] L'orientation paysage fonctionne correctement

### Performance Mobile
- [ ] La page charge en moins de 3 secondes sur 4G
- [ ] Les animations sont fluides (60 FPS)
- [ ] Pas de lag lors du scroll
- [ ] La batterie n'est pas drainée excessivement

**Notes:** _______________________________________________

---

## 👑 ESPACE VIP (vip-space.html)

### Accès
- [ ] Accessible uniquement aux utilisateurs VIP
- [ ] Redirection si non VIP

### Contenu VIP
- [ ] Les news VIP s'affichent
- [ ] Les analyses exclusives sont visibles
- [ ] Les signaux de trading s'affichent
- [ ] Le chat VIP fonctionne

**Notes:** _______________________________________________

---

## 🔧 ADMIN DASHBOARD (admin-dashboard.html)

### Accès Admin
- [ ] Accessible uniquement aux administrateurs
- [ ] Redirection si non admin

### Gestion des Utilisateurs
- [ ] La liste des utilisateurs s'affiche
- [ ] Les statistiques par utilisateur sont correctes
- [ ] La modification des rôles fonctionne
- [ ] La suppression d'utilisateur fonctionne

### Gestion du Contenu
- [ ] Ajout de news fonctionne
- [ ] Modification de news fonctionne
- [ ] Suppression de news fonctionne
- [ ] Upload d'images fonctionne

**Notes:** _______________________________________________

---

## 📅 PLANNING FOREX (planning-forex.html)

### Affichage
- [ ] Le calendrier économique s'affiche
- [ ] Les événements sont listés par date
- [ ] Les niveaux d'importance sont visibles
- [ ] Le filtre par devise fonctionne

**Notes:** _______________________________________________

---

## 🔥 TESTS FIREBASE

### Authentification
- [ ] Connexion avec email/password fonctionne
- [ ] Déconnexion fonctionne
- [ ] Persistance de session fonctionne
- [ ] Gestion des erreurs d'authentification

### Base de Données
- [ ] Lecture des données fonctionne
- [ ] Écriture des données fonctionne
- [ ] Mise à jour des données fonctionne
- [ ] Suppression des données fonctionne
- [ ] Synchronisation temps réel fonctionne

### Sécurité
- [ ] Les règles de sécurité sont appliquées
- [ ] Les utilisateurs ne peuvent accéder qu'à leurs données
- [ ] Les admins ont accès à toutes les données

**Notes:** _______________________________________________

---

## 🌐 TESTS MULTI-NAVIGATEURS

### Chrome
- [ ] Toutes les fonctionnalités fonctionnent
- [ ] Pas d'erreurs console
- [ ] Performance optimale

### Firefox
- [ ] Toutes les fonctionnalités fonctionnent
- [ ] Pas d'erreurs console
- [ ] Performance optimale

### Safari
- [ ] Toutes les fonctionnalités fonctionnent
- [ ] Pas d'erreurs console
- [ ] Performance optimale

### Edge
- [ ] Toutes les fonctionnalités fonctionnent
- [ ] Pas d'erreurs console
- [ ] Performance optimale

### Mobile Chrome
- [ ] Toutes les fonctionnalités fonctionnent
- [ ] Notifications push fonctionnent
- [ ] Performance optimale

### Mobile Safari
- [ ] Toutes les fonctionnalités fonctionnent
- [ ] Notifications push fonctionnent (si supportées)
- [ ] Performance optimale

**Notes:** _______________________________________________

---

## 📱 TESTS PWA (Progressive Web App)

### Installation
- [ ] Le prompt d'installation s'affiche
- [ ] L'installation fonctionne sur Android
- [ ] L'installation fonctionne sur iOS
- [ ] L'icône apparaît sur l'écran d'accueil

### Fonctionnement Hors Ligne
- [ ] Le service worker est enregistré
- [ ] Les pages principales sont mises en cache
- [ ] L'application fonctionne hors ligne (mode limité)
- [ ] La synchronisation reprend en ligne

### Manifest
- [ ] Le nom de l'app s'affiche correctement
- [ ] L'icône s'affiche correctement
- [ ] La couleur de thème est appliquée
- [ ] L'orientation est correcte

**Notes:** _______________________________________________

---

## 🔒 TESTS DE SÉCURITÉ

### Données Sensibles
- [ ] Pas de mots de passe en clair dans le code
- [ ] Les clés API sont protégées
- [ ] Les données utilisateur sont chiffrées

### Injection
- [ ] Protection contre XSS
- [ ] Protection contre injection SQL (Firebase)
- [ ] Validation des entrées utilisateur

### Authentification
- [ ] Les sessions expirent correctement
- [ ] Les tokens sont sécurisés
- [ ] La déconnexion nettoie les données locales

**Notes:** _______________________________________________

---

## ⚡ TESTS DE PERFORMANCE

### Temps de Chargement
- [ ] Page d'accueil < 3 secondes
- [ ] Dashboard PC < 3 secondes
- [ ] Dashboard Mobile < 3 secondes
- [ ] Espace VIP < 3 secondes

### Taille des Fichiers
- [ ] index.html < 500 KB
- [ ] dashboard.html < 1000 KB
- [ ] mobile-dashboard.html < 1000 KB
- [ ] CSS total < 500 KB
- [ ] JS total < 1000 KB

### Optimisation
- [ ] Images optimisées
- [ ] CSS minifié (en production)
- [ ] JS minifié (en production)
- [ ] Lazy loading des images

**Notes:** _______________________________________________

---

## 📊 RÉSUMÉ FINAL

### Statistiques
- **Total de tests:** _____
- **Tests réussis:** _____
- **Tests échoués:** _____
- **Taux de réussite:** _____%

### Problèmes Critiques
1. _______________________________________________
2. _______________________________________________
3. _______________________________________________

### Problèmes Mineurs
1. _______________________________________________
2. _______________________________________________
3. _______________________________________________

### Recommandations
1. _______________________________________________
2. _______________________________________________
3. _______________________________________________

### Décision Finale
- [ ] ✅ **APPROUVÉ POUR PRODUCTION**
- [ ] ⚠️ **APPROUVÉ AVEC RÉSERVES**
- [ ] ❌ **NON APPROUVÉ - CORRECTIONS NÉCESSAIRES**

**Signature:** _________________  
**Date:** _________________

---

## 📝 Notes Additionnelles

_______________________________________________
_______________________________________________
_______________________________________________
_______________________________________________
_______________________________________________