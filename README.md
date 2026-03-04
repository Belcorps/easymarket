# Easymarket AI — App Promo / Marchés

Outil de création de visuels promotionnels pour supermarchés (inspiré de Promo AI).

## Démarrage (local)

1. **Installation**
   ```bash
   cd PROMO-APP
   npm install
   ```

2. **Variables d'environnement**
   ```bash
   cp .env.example .env
   ```
   Renseigner au minimum : `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `DATABASE_URL` (Supabase).  
   Pour les uploads en local, optionnel : `NEXT_PUBLIC_SUPABASE_URL` et `SUPABASE_SERVICE_ROLE_KEY`.

3. **Base de données (Supabase)**
   - Créer un projet sur [supabase.com](https://supabase.com) (gratuit).
   - **Settings > Database** : copier l’URL de connexion (mode **Session**, port 6543) dans `DATABASE_URL`.
   - Exécuter les migrations (une seule migration PostgreSQL est appliquée) :
   ```bash
   npx prisma migrate deploy
   npx prisma db seed
   ```
   Compte de test : `test@test.com` / `test1234`.  
   *Note : le projet utilise désormais PostgreSQL (Supabase) ; l’ancienne base SQLite locale n’est plus utilisée.*

4. **Lancer l’app**
   ```bash
   npm run dev
   ```
   Ouvrir [http://localhost:3000](http://localhost:3000).

## Déploiement (accès partout : Vercel + Supabase)

Pour faire tourner l’app sur internet (gratuit) et y accéder de partout :

### 1. Supabase (base + stockage)

1. Créer un projet sur [supabase.com](https://supabase.com).
2. **Settings > Database** : noter l’URL de connexion (Session / port 6543) pour `DATABASE_URL`.
3. **Settings > API** : noter **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`, et **service_role** (secret) → `SUPABASE_SERVICE_ROLE_KEY`.
4. **Storage** : créer un bucket nommé `uploads`, le rendre **Public** (Policy : allow public read).
5. En local (avec ce `.env`) : `npx prisma migrate deploy` puis `npx prisma db seed`.

### 2. Vercel (hébergement de l’app)

1. Pousser le code sur GitHub (ou GitLab / Bitbucket).
2. Aller sur [vercel.com](https://vercel.com), **Add New Project**, importer le repo.
3. Dans **Environment Variables** du projet, ajouter :
   - `NEXTAUTH_SECRET` (ex. `openssl rand -base64 32`)
   - `NEXTAUTH_URL` = `https://votre-projet.vercel.app` (remplacer par l’URL réelle après 1er déploiement)
   - `DATABASE_URL` (l’URL Supabase Session)
   - `NEXT_PUBLIC_SUPABASE_URL` et `SUPABASE_SERVICE_ROLE_KEY`
4. Déployer. Après le premier déploiement, mettre à jour `NEXTAUTH_URL` si besoin et redéployer.

L’app sera accessible partout via l’URL Vercel (ex. `https://promo-app.vercel.app`).

## Fonctionnalités actuelles

- **Landing** : Connexion / S'inscrire
- **Inscription** : Nom du magasin, E-mail, Téléphone, Mot de passe
- **Connexion** : E-mail + Mot de passe
- **Tableau de bord** : Accueil (après connexion)
- **Mon Compte** : Infos entreprise (nom magasin, tél, adresse), gestion du logo (upload, option « Supprimer l'arrière-plan (IA) » si clé remove.bg configurée)

## Stack

- Next.js 14 (App Router), React, TypeScript
- NextAuth (credentials), Prisma (PostgreSQL / Supabase), Supabase Storage (optionnel en local)
- Tailwind CSS
