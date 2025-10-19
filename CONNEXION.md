# 🔐 Guide de connexion

## ✅ Tout est prêt !

Votre application de recettes est configurée et prête à l'emploi.

---

## 🚀 Applications lancées

- ✅ **Backend API (NestJS):** http://localhost:3007
- ✅ **Frontend (React + Vite):** http://localhost:5174

---

## 🔑 Identifiants de test

**Email:** `kriss.clotilde@gmail.com`
**Mot de passe:** `123456`

**Note:** Le mot de passe est correctement hashé avec bcrypt dans la base de données.

---

## 📋 Comment tester

### 1. Ouvrir l'application

Ouvrez votre navigateur et accédez à :
```
http://localhost:5174
```

### 2. Se connecter

Sur la page de connexion :
1. Entrez l'email : `kriss.clotilde@gmail.com`
2. Entrez le mot de passe : `123456`
3. Cliquez sur "Se connecter"

**✨ Nouvelles fonctionnalités à tester :**
- Validation en temps réel de l'email
- Icônes de validation (✓ verte pour valide, ✗ rouge pour invalide)
- Bouton avec indicateur de chargement pendant la connexion
- Messages d'erreur clairs via Toast

### 3. Créer un nouveau compte (optionnel)

Sur la page d'inscription :
1. Entrez un email valide
2. Entrez un mot de passe
3. **Observez l'indicateur de force du mot de passe :**
   - Rouge (Faible) : < 6 caractères
   - Jaune (Moyen) : 6-8 caractères
   - Vert (Fort) : 8+ caractères avec majuscules/chiffres/spéciaux
4. Le bouton "S'inscrire" est désactivé si le formulaire est invalide

**Note:** Pour l'inscription, vous devrez vérifier l'email. Les emails de vérification sont envoyés à l'adresse configurée.

---

## 🎨 Améliorations visuelles

### Thème MUI

L'application utilise maintenant un thème cohérent avec :
- **Couleur primaire:** #007BFF (Bleu)
- **Couleur secondaire:** #FF6B6B (Rouge/orange)
- **Background:** #f8f9fa
- Ombres et bordures harmonisées
- Typographie unifiée (Roboto, Exo)

### Animations

- Cards avec effet hover (élévation)
- Boutons avec ombres au survol
- Indicateurs de chargement fluides
- Transitions douces

---

## 🔧 Configuration technique

### Backend
- **Port:** 3007
- **Base de données:** MySQL (base3)
- **Authentification:** JWT + bcrypt
- **Email vérifié:** Oui (pour l'utilisateur de test)

### Frontend
- **Port:** 5174 (ou 5173)
- **Environnement:** Développement
- **API URL:** http://localhost:3007
- **Configuration:** Basculement automatique dev/prod

---

## 📊 Base de données

**Connexion MySQL:**
```
Serveur: localhost:3306
Utilisateur: root
Mot de passe: (vide)
Base de données: base3
```

**Tables principales:**
- `user` - Utilisateurs
- `recipe` - Recettes
- `ingredient` - Ingrédients
- `category` - Catégories
- `recipe_ingredient` - Junction table
- `calendar_event` - Planification des repas

---

## 🛠️ Commandes utiles

### Redémarrer le backend
```bash
cd C:\Users\kriss\IdeaProjects\recette_api\recipe-api
npm run start:dev
```

### Redémarrer le frontend
```bash
cd C:\Users\kriss\IdeaProjects\recette\recette
npm run dev
```

### Mettre à jour le mot de passe
```bash
cd C:\Users\kriss\IdeaProjects\recette_api\recipe-api
npm run update-password
```

---

## 🎯 Fonctionnalités disponibles

Après connexion, vous pouvez :

1. **Gérer les recettes**
   - Créer de nouvelles recettes
   - Modifier des recettes existantes
   - Supprimer des recettes
   - Ajouter des images
   - Filtrer par catégories et ingrédients

2. **Gérer les ingrédients**
   - Ajouter des ingrédients
   - Modifier les prix et calories
   - Supprimer des ingrédients

3. **Gérer les catégories**
   - Créer des catégories
   - Modifier des catégories
   - Supprimer des catégories

4. **Planifier les repas**
   - Ajouter des recettes au calendrier
   - Voir le calendrier des repas
   - Calculer les coûts des ingrédients

5. **Profil utilisateur**
   - Voir les informations de profil
   - Consulter vos recettes

---

## 🐛 Dépannage

### L'application frontend ne se connecte pas au backend

Vérifiez que :
1. Le backend est bien lancé sur le port 3007
2. MySQL est en cours d'exécution
3. La base de données `base3` existe
4. L'utilisateur existe dans la table `user`

### Erreur "Email not verified"

Utilisez le script pour marquer l'email comme vérifié :
```bash
npm run update-password
```

### Mot de passe incorrect

Le mot de passe est : `123456` (six chiffres)

Si vous avez modifié le mot de passe dans la base de données manuellement, il doit être hashé avec bcrypt. Utilisez le script `update-password` pour le faire correctement.

---

## 📝 Validation des formulaires

### Page de connexion
- ✅ Email validé en temps réel
- ✅ Feedback visuel (icônes ✓/✗)
- ✅ Messages d'erreur clairs
- ✅ Bouton désactivé si formulaire invalide

### Page d'inscription
- ✅ Email validé en temps réel
- ✅ Indicateur de force du mot de passe
- ✅ Barre de progression colorée
- ✅ Conseils pour améliorer le mot de passe
- ✅ Feedback visuel complet

---

## 🔐 Sécurité

**Bonnes pratiques implémentées :**
- ✅ Mots de passe hashés avec bcrypt (10 rounds)
- ✅ Tokens JWT pour l'authentification
- ✅ Validation des emails
- ✅ CORS configuré
- ✅ Variables d'environnement pour les secrets
- ✅ Vérification d'email obligatoire

**⚠️ En production :**
- Changez le secret JWT
- Utilisez des mots de passe forts
- Configurez HTTPS
- Limitez les tentatives de connexion
- Activez les logs de sécurité

---

## 📚 Documentation complète

- **Frontend:** Voir `AMELIORATIONS.md` pour toutes les améliorations
- **Backend:** Voir `IDENTIFIANTS.md` pour les détails techniques
- **API:** Endpoints documentés dans l'analyse du backend

---

## 🎉 Bon test !

Tout est configuré et prêt à l'emploi. Profitez de votre application de recettes améliorée !

**Questions ou problèmes ?**
Consultez les fichiers de documentation ou relancez les serveurs.

---

**Créé le:** 19 octobre 2025
**Dernière mise à jour:** 19 octobre 2025
