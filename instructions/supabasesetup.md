# Reddit Analysis Platform - Project Details

## Introduction

Actuellement, notre **Plateforme d'Analyse Reddit** récupère les données et effectue des analyses via l'API OpenAI chaque fois qu'un utilisateur ouvre une page de subreddit. Cette méthode entraîne des performances sous-optimales et des coûts accrus en raison des appels redondants aux API externes. Pour améliorer l'efficacité, nous souhaitons intégrer **Supabase** afin de stocker les données des posts Reddit et les analyses effectuées par l'IA. Les données seront mises en cache dans Supabase et ne seront refetchées que si leur dernière mise à jour dépasse 24 heures.

## Structure Actuelle du Projet

Le projet est structuré de la manière suivante :

```
app/
├── api/
│   └── reddit/
│       ├── posts/
│       │   └── route.ts    # Point d'API pour récupérer les posts
│       └── analyze/
│           └── route.ts    # Point d'API pour l'analyse des posts
├── page.tsx               # Page d'accueil
└── subreddit/
    └── [name]/
        └── page.tsx       # Page dédiée à chaque subreddit

components/
├── subreddit/
│   ├── AddCategoryModal.tsx  # Modal pour ajouter des catégories
│   ├── PostsTable.tsx        # Table des posts avec catégories
│   └── ThemesGrid.tsx        # Grille d'analyse des thèmes
└── ui/                       # Composants UI réutilisables
    ├── badge.tsx
    ├── button.tsx
    └── dialog.tsx

lib/
├── constants/
│   └── categories.ts      # Définitions des catégories
├── store/
│   └── categories.ts      # Store Zustand pour les catégories
├── utils.ts              # Utilitaires généraux
├── reddit.ts            # Client Reddit et fonctions
└── openai.ts            # Client OpenAI et fonctions d'analyse

.env                     # Variables d'environnement par défaut
.env.local              # Variables d'environnement locales
next.config.js          # Configuration Next.js
README.md               # Documentation
```

## Objectifs de l'Intégration avec Supabase

1. **Stockage des Données Reddit** : Sauvegarder les posts récupérés de Reddit dans Supabase.
2. **Stockage des Analyses IA** : Enregistrer les résultats des analyses effectuées par OpenAI.
3. **Gestion du Cache** : Refetcher les données uniquement si leur dernière mise à jour est antérieure à 24 heures.
4. **Optimisation des Performances** : Réduire les appels redondants aux API externes pour améliorer les temps de réponse.
5. **Sécurité et Gestion des Clés API** : Assurer la sécurité des clés API et des données sensibles stockées.

## Conception du Schéma de Base de Données

### Tables Principales

#### 1. Subreddits
- `id` : UUID (clé primaire)
- `name` : String (nom du subreddit)
- `description` : String (description du subreddit)
- `created_at` : Timestamp (date de création)
- `updated_at` : Timestamp (date de dernière mise à jour)
- `last_fetched_at` : Timestamp (date de dernière récupération des données)

#### 2. Posts
- `id` : UUID (clé primaire)
- `subreddit_id` : UUID (clé étrangère vers Subreddits)
- `title` : String (titre du post)
- `content` : Text (contenu du post)
- `score` : Integer (score du post)
- `num_comments` : Integer (nombre de commentaires)
- `created_utc` : Timestamp (date de création UTC)
- `url` : String (URL du post)
- `created_at` : Timestamp (date d'ajout)
- `updated_at` : Timestamp (date de dernière mise à jour)

#### 3. Analyses
- `id` : UUID (clé primaire)
- `post_id` : UUID (clé étrangère vers Posts)
- `category` : Enum (Solution Requests, Pain & Anger, Advice Requests, Money Talk)
- `confidence` : Float (niveau de confiance de l'analyse)
- `reason` : Text (explication de la catégorie)
- `created_at` : Timestamp (date d'analyse)
- `updated_at` : Timestamp (date de dernière mise à jour)

### Relations

- Un **Subreddit** peut avoir plusieurs **Posts**
- Un **Post** peut avoir une seule **Analyse**

## Intégration Backend avec Supabase

### Configuration de Supabase

1. **Création du Projet Supabase**
   - Inscrivez-vous sur [Supabase](https://supabase.com/) et créez un nouveau projet
   - Notez l'URL du projet et la clé API publique et secrète

2. **Configuration des Tables**
   - Utilisez le schéma de base de données décrit ci-dessus pour créer les tables `Subreddits`, `Posts` et `Analyses`
   - Définissez les relations entre les tables via des clés étrangères

3. **Gestion des Clés API**
   - Stockez les clés API Supabase dans le fichier `.env.local` :
   ```env
   SUPABASE_URL="your_supabase_url"
   SUPABASE_ANON_KEY="your_supabase_anon_key"
   SUPABASE_SERVICE_ROLE_KEY="your_supabase_service_role_key"
   ```

### Adaptation des Fonctions Existantes

1. **Récupération des Posts**
   - Modifier la fonction `getRecentPosts` dans `lib/reddit.ts` pour vérifier si les données existent dans Supabase et sont à jour
   - Si les données existent et ont été mises à jour il y a moins de 24 heures, les récupérer depuis Supabase au lieu de faire un appel à Reddit
   - Sinon, fetcher les données depuis Reddit, les stocker dans Supabase, puis les retourner

2. **Analyse des Posts**
   - Adapter la fonction d'analyse dans `lib/openai.ts` pour sauvegarder les résultats dans la table `Analyses` de Supabase après avoir obtenu l'analyse de chaque post
   - Lors de l'analyse multiple, enregistrer chaque analyse associée au post correspondant dans Supabase

3. **Routes API**
   - Mettre à jour les routes API (`app/api/reddit/posts/route.ts` et `app/api/reddit/analyze/route.ts`) pour interagir avec Supabase au lieu d'appeler directement Reddit et OpenAI
   - Assurer que les données renvoyées aux composants frontend proviennent de Supabase

## Gestion du Cache

### 1. Vérification de la Date de Mise à Jour

- Ajouter un champ `last_fetched_at` dans la table `Subreddits` pour suivre la dernière mise à jour des données
- Avant de fetcher les données, vérifier si `last_fetched_at` est inférieur à 24 heures
- Si oui, utiliser les données existantes depuis Supabase ; sinon, fetcher les nouvelles données depuis Reddit, les stocker dans Supabase, puis mettre à jour `last_fetched_at`

### 2. Automatisation des Mises à Jour

- Envisager l'utilisation de tâches cron ou de fonctions serverless pour automatiser les mises à jour périodiques des données sans besoin d'action utilisateur
- Configurer des triggers dans Supabase pour notifier ou exécuter des actions après certaines opérations si nécessaire

## Flux de Données Mis à Jour

### 1. Lors de l'Ouverture d'une Page de Subreddit

- Vérifier Supabase pour les posts et les analyses associés au subreddit spécifique
- Si les données sont à jour (moins de 24 heures), les afficher directement depuis Supabase
- Sinon, fetcher les nouvelles données depuis Reddit, les analyser via OpenAI, les stocker dans Supabase, puis les afficher

### 2. Ajout de Nouveaux Subreddits

- Lorsqu'un utilisateur ajoute un nouveau subreddit via l'interface, créer une entrée correspondante dans la table `Subreddits`
- Fetcher les posts du subreddit ajouté depuis Reddit, les stocker dans Supabase, puis les afficher

## Sécurité et Gestion des Clés API

### 1. Variables d'Environnement

- Stocker toutes les clés sensibles (Reddit, OpenAI, Supabase) dans le fichier `.env.local`
- Assurer que `.gitignore` inclut `.env.local` pour éviter les violations accidentelles de sécurité

### 2. Rôles et Permissions dans Supabase

- Configurer les politiques de sécurité dans Supabase pour restreindre l'accès aux données sensibles
- Utiliser les rôles prédéfinis de Supabase ou créer des rôles personnalisés selon les besoins du projet
- Limiter les permissions des clés API en fonction des opérations nécessaires (lecture, écriture, mise à jour)

## Points Clés pour le Développeur Backend

### 1. Compréhension du Schéma de Base de Données

- Familiarisez-vous avec les tables `Subreddits`, `Posts` et `Analyses`
- Comprenez les relations et les dépendances entre ces tables

### 2. Intégration avec Supabase

- Utilisez le client Supabase pour interagir avec la base de données
- Implémentez les opérations CRUD (Créer, Lire, Mettre à jour, Supprimer) pour les entités principales
- Assurez-vous que les requêtes sont optimisées pour les performances

### 3. Optimisation des Appels API

- Implémentez la logique de cache pour minimiser les appels à Reddit et OpenAI
- Vérifiez la validité des données avant de décider de fetcher de nouvelles données

### 4. Gestion des Erreurs et des Logs

- Implémentez une gestion robuste des erreurs pour les interactions avec Supabase
- Assurez-vous que les erreurs sont correctement logguées pour faciliter le débogage

### 5. Tests

- Écrivez des tests unitaires et d'intégration pour vérifier la fonctionnalité de l'intégration Supabase
- Testez les scénarios de mise à jour des données et de récupération depuis le cache

### 6. Documentation et Maintenance

- Documentez les nouvelles fonctionnalités et les modifications apportées au code existant
- Maintenez le code propre et bien structuré pour faciliter la maintenance future

## Conclusion

L'intégration de **Supabase** dans notre **Plateforme d'Analyse Reddit** permettra d'optimiser les performances, de réduire les coûts liés aux appels API redondants et d'améliorer l'expérience utilisateur en fournissant des données rapides et fiables. En suivant la structure et les recommandations décrites dans ce document, le développeur backend pourra implémenter une solution robuste et scalable, garantissant ainsi la pérennité et l'efficacité de notre application.