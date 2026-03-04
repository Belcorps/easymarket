# Stratégie & architecture projet — App Promo / Marchés

**Rôle :** Strategy & Project Architect  
**Date :** 2 mars 2026  
**Contexte :** Réplique / inspiration Promo AI (promo.alsapixel.com) — outil interne puis produit pour marchés et agence.

---

## 1. Contexte & objectifs

### 1.1 Contexte

- **Référence :** Promo AI (bafra) — création de visuels promo (campagnes, annonces, offres d’emploi, Reels) pour marchés, avec templates, logo, produits, multilingue, crédits/abonnement.
- **Besoin :** Un outil similaire d’abord en **usage interne** pour ton agence digitale : 2–3 marchés clients, infos centralisées, création d’annonces plus rapide.
- **Vision :** Démarrer en interne, puis éventuellement proposer le produit à d’autres marchés / agences.

### 1.2 Objectifs principaux

| # | Objectif | Mesure |
|---|----------|--------|
| O1 | Réduire le temps de création des visuels promo pour tes marchés | Temps par visuel (avant/après) |
| O2 | Centraliser infos marchés (nom, logo, coordonnées) dans un seul outil | 1 fiche par marché, utilisée partout |
| O3 | Permettre la création sans designer : templates + champs éditables (prix, produits, textes) | Nombre de visuels créés sans brief design |
| O4 | Couvrir campagnes promo, annonces, offres d’emploi, et à terme Reels | 4 types de contenus disponibles |

### 1.3 Contraintes (à valider)

- **Périmètre initial :** Usage interne (toi + ton équipe, 2–3 marchés).
- **Pas d’hallucination :** Ce document ne suppose pas de budget, délai ou stack imposés — à préciser en phase suivante.
- **Livrable attendu après cette phase :** Document stratégie/architecture clair pour enchaîner avec l’App Product Builder (spécifications, priorités, roadmap).

---

## 2. Périmètre fonctionnel (scope)

### 2.1 Inclus (MVP interne)

- **Authentification :** Inscription / connexion (email + mot de passe), récupération mot de passe.
- **Profil marché / entreprise (au démarrage ou dans Mon Compte) :**
  - Nom du magasin / marché  
  - Téléphone, adresse, email  
  - Logo : upload + option « supprimer l’arrière-plan » (API type remove.bg ou équivalent)  
  - Optionnel : numéro TVA, prénom/nom du contact  
- **Templates prédéfinis :**
  - Campagnes promo (format type 1:1, 3:4, 9:16) avec zones : produit, prix barré, nouveau prix, titre promo, dates, nom du marché.
  - Annonces (du jour, Ramazan, etc.) — même logique de champs éditables.
  - Offres d’emploi — texte + nom du marché.
- **Édition des visuels :**
  - Choix du template → remplacement des champs (texte, prix, produit).
  - Upload photo produit ; option suppression de fond sur le produit.
  - Prévisualisation → export image (PNG/JPG) pour partage ou impression.
- **Gestion des créations :**
  - Liste « Mes campagnes » / « Mes annonces » / « Mes offres d’emploi » avec aperçu, modifier, dupliquer, supprimer, imprimer / partager (lien ou fichier).
- **Reels (MVP léger ou Phase 2) :**
  - À définir : génération à partir d’un visuel de campagne (images + musique + format 9:16) ou manuelle ; à préciser avec Product Builder.
- **Mon Compte :**
  - Édition infos entreprise, logo, mot de passe.
  - Paramètres : langue par défaut (TR, DE, FR, EN) pour les nouveaux contenus.
- **Multilingue (priorité selon tes marchés) :** Interface + textes des templates en au moins TR/FR (puis DE, EN si besoin).

### 2.2 Exclu ou reporté (pour ne pas déraper)

- **Paiement / abonnements / crédits** en MVP interne : pas obligatoire si usage uniquement interne.
- **Facturation, historique de factures** : Phase 2 si tu ouvres à des clients externes.
- **Reels avec voix-off automatique** : « bientôt disponible » sur la ref — à traiter après MVP.
- **Catalogue produits central (type 744 produits en base)** : en MVP on peut se contenter d’upload produit par visuel ; base produits optionnelle plus tard.
- **Réseaux sociaux (post direct Instagram/Facebook)** : possible en Phase 2 ; en MVP = export image + partage manuel.

### 2.3 Hypothèses à trancher

- Nom du produit (marque) pour l’app.
- Stack technique (voir section 6) : à valider avec toi et le Product Builder.
- Hébergement et domaine (où sera hébergé l’outil en interne).
- Délai cible pour la première version utilisable (même approximatif).

---

## 3. Parcours utilisateur cible (résumé)

### 3.1 Premier usage (onboarding)

1. Inscription (email, mot de passe).
2. **Formulaire « Infos entreprise »** : nom du magasin, téléphone, adresse, email.
3. **Upload logo** → option « enlever l’arrière-plan » → enregistrement.
4. Choix de la **langue par défaut** (TR, FR, etc.).
5. Redirection vers tableau de bord (ou « Mes campagnes »).

### 3.2 Création d’un visuel campagne

1. **Mes Campagnes** → « Nouvelle campagne » ou « Créer à partir d’un template ».
2. Choix du **template** (filtre par format 1:1, 3:4, 9:16 si pertinent).
3. **Édition :**
   - Upload photo produit (option : suppression fond).
   - Ancien prix / nouveau prix.
   - Titre promo, dates, texte optionnel.
   - Nom du marché / logo (pré-rempli depuis le profil).
4. Prévisualisation → **Enregistrer** → **Exporter** (image) ou **Imprimer** / partager.

### 3.3 Annonces & offres d’emploi

- Même logique : choix template → remplir champs (texte annonce, ou texte offre d’emploi) → enregistrer → exporter.

### 3.4 Reels (Phase 2)

- À partir d’une campagne existante ou d’un ensemble d’images : génération d’une courte vidéo 9:16 avec musique/transitions ; export pour Instagram/TikTok.

---

## 4. Fonctionnalités détaillées (backlog orienté produit)

### 4.1 Priorisation proposée (P0 = MVP interne)

| Id | Fonctionnalité | Priorité | Note |
|----|----------------|----------|------|
| F01 | Auth : inscription, connexion, mot de passe oublié | P0 | Base |
| F02 | Profil entreprise : nom, tél, adresse, email, logo | P0 | Demandé dès l’ouverture |
| F03 | Upload logo + suppression arrière-plan (API) | P0 | Différenciant |
| F04 | Templates campagnes (3–5 templates, formats 1:1, 3:4) | P0 | Cœur métier |
| F05 | Éditeur : champs texte/prix/produit, prévisualisation | P0 | Cœur métier |
| F06 | Upload photo produit + option suppression fond | P0 | Aligné ref |
| F07 | Liste campagnes : voir, modifier, dupliquer, supprimer, export PNG/JPG | P0 | Indispensable |
| F08 | Templates annonces (2–3) + même logique édition/liste | P0 | Aligné ref |
| F09 | Templates offres d’emploi (2–3) + édition/liste | P0 | Aligné ref |
| F10 | Mon Compte : édition profil, logo, mot de passe | P0 | Standard |
| F11 | Paramètres : langue par défaut (TR, FR, DE, EN) | P0 | Multilingue |
| F12 | Dashboard simple : stats (nb campagnes, annonces, offres) | P1 | Utile |
| F13 | Reels : génération vidéo courte à partir de visuels | P1/P2 | Après MVP stable |
| F14 | Multilingue templates : TR, FR (DE, EN si besoin) | P1 | Selon tes marchés |
| F15 | Crédits / abonnement / Stripe | P2 | Si ouverture à des clients externes |
| F16 | Factures, historique | P2 | Si monétisation |

### 4.2 Risques fonctionnels

| Risque | Impact | Mitigation |
|--------|--------|------------|
| Qualité suppression de fond (logo + produit) | Moyen | Choisir une API fiable (ex. remove.bg), fallback « sans suppression » |
| Complexité de l’éditeur (positionnement produit/texte) | Élevé | Templates avec zones fixes + champs éditables ; éviter un éditeur type Canva en v1 |
| Coût API suppression de fond à l’usage | Moyen | Quotas gratuits ou forfait ; en interne, volume limité |

---

## 5. Nom / marque (recommandations)

- **Contraintes :** Court, mémorisable, évoquant promo / marchés / rapidité. Pas de conflit avec « Promo AI » ou « bafra ».
- **Pistes (à valider par toi) :**
  - **PromoKit** — outil promo tout-en-un.
  - **MarketPost** — visuels pour marchés.
  - **QuickPromo** — rapidité.
  - **Nom de ton agence + « Studio » ou « Creator »** — si l’outil reste marqué agence.
- Tu peux garder un nom interne pour la phase 1 (ex. « Outil Promo Interne ») et fixer le nom produit avant ouverture à des tiers.

---

## 6. Architecture technique (niveau stratégie)

### 6.1 Principes

- **Séparation front / back** pour évolutivité et travail en parallèle avec l’App Product Builder.
- **APIs externes** pour suppression de fond et, si besoin, traduction (Phase 2).
- **Multi-tenant simple** : chaque compte utilisateur = un ou plusieurs « marchés » (en v1, 1 marché par compte possible pour simplifier).

### 6.2 Blocs logiques (sans imposer de stack)

| Bloc | Rôle | Options courantes (à valider avec Product Builder) |
|------|------|-----------------------------------------------------|
| Frontend | SPA : auth, dashboard, éditeur, listes, compte | React, Next.js, Vue, etc. |
| Backend | API : auth, CRUD profil, campagnes, annonces, offres, fichiers | Node (Express/Fastify), Python (FastAPI), etc. |
| Base de données | Utilisateurs, profils, métadonnées campagnes/annonces/offres | PostgreSQL, MySQL, ou Supabase/Firebase selon stack |
| Stockage fichiers | Logos, photos produits, visuels générés | S3-compatible, Cloudinary, ou stockage serveur |
| Génération d’images | Rendu template + textes + images → PNG/JPG | Backend (Canvas, Sharp, Puppeteer) ou service dédié |
| Suppression de fond | Logo et produit | remove.bg, Cloudinary AI, ou autre API |
| Reels (Phase 2) | Assemblage images + musique + format 9:16 | FFmpeg, service vidéo, ou API tierce |
| Hébergement | App + DB + stockage | Vercel + DB + S3, ou VPS, ou autre selon budget |

### 6.3 Intégrations à prévoir plus tard

- **Paiement (Phase 2) :** Stripe (comme la ref) — abonnements et/ou packs de crédits.
- **Traduction (optionnel) :** API type Google Translate / DeepL pour textes des templates.
- **Réseaux sociaux (optionnel) :** APIs Instagram/Facebook pour publication directe.

---

## 7. Roadmap proposée (phases)

### Phase 0 — Préparation (avant dev)

- [ ] Valider ce document (objectifs, scope, priorités).
- [ ] Choisir nom produit (ou garder « interne »).
- [ ] Décider stack avec App Product Builder (front, back, DB, hébergement).
- [ ] Créer repo, environnement dev, pipeline basique.
- [ ] Décider : 1 compte = 1 marché en v1 ou multi-marchés dès le début.

### Phase 1 — MVP interne (objectif : usage réel sur 2–3 marchés)

- [ ] Auth + profil entreprise + logo + suppression de fond.
- [ ] 3–5 templates campagnes + éditeur (texte, prix, produit, upload + fond).
- [ ] Liste campagnes + export image.
- [ ] 2–3 templates annonces + 2–3 templates offres d’emploi + listes + export.
- [ ] Mon Compte + paramètres langue.
- [ ] Déploiement sur un environnement accessible à ton équipe (staging puis prod interne).
- [ ] Tests avec tes 2–3 marchés réels.

### Phase 2 — Consolidation & Reels

- [ ] Dashboard statistiques.
- [ ] Reels : génération vidéo courte à partir de visuels.
- [ ] Ajustements templates et UX selon retours.
- [ ] Multilingue complet (TR, FR, DE, EN) si pas déjà fait.

### Phase 3 — Produit (si ouverture à des clients)

- [ ] Modèle crédits + abonnements (Stripe).
- [ ] Facturation et historique factures.
- [ ] Gestion multi-marchés par compte (agences).
- [ ] Landing page, onboarding public, support.

---

## 8. Handoff vers App Product Builder

Pour l’agent **App Product Builder**, fournir :

1. **Ce document** (STRATEGIE-ET-ARCHITECTURE-PROJET.md) comme référence stratégie et scope.
2. **Backlog priorisé** : tableau section 4.1 (F01–F16) avec P0/P1/P2.
3. **Parcours utilisateur** : section 3 (onboarding, création campagne, annonces, offres).
4. **Contraintes techniques** : section 6 (blocs, pas de stack imposée ici — à décider ensemble).
5. **Référence visuelle** : captures Promo AI déjà partagées (login, dashboard, campagnes, annonces, offres, Reel, compte, forfaits).
6. **Décisions à trancher avec toi :**
   - Nom du produit.
   - Stack (front, back, DB, hébergement).
   - Délai cible Phase 1.
   - 1 compte = 1 marché ou multi-marchés en v1.

---

## 9. Prochaines actions immédiates

| # | Action | Responsable | Note |
|---|--------|-------------|------|
| 1 | Lire et valider ce document (ajouts / suppressions) | Toi | Ajuster scope si besoin |
| 2 | Choisir un nom (ou « interne » pour l’instant) | Toi | Optionnel Phase 0 |
| 3 | Décider stack avec App Product Builder | Toi + Product Builder | Repo, env, DB |
| 4 | Créer le projet (dossier/repo) et document de spec technique détaillée | Product Builder | À partir de la section 6 et du backlog |
| 5 | Démarrer implémentation Phase 1 (auth + profil + logo) | Product Builder | Premier sprint |

---

## 10. Résumé exécutif

- **Quoi :** Une web app type Promo AI pour créer des visuels promo (campagnes, annonces, offres d’emploi, puis Reels) avec infos marché, logo, templates et édition simple.
- **Pour qui (v1) :** Toi et ton agence — 2–3 marchés, usage interne pour aller plus vite.
- **Comment :** Auth → profil entreprise + logo (avec suppression de fond) → templates éditables (produit, prix, textes) → export image. Pas de paiement en MVP.
- **Ensuite :** Reels, puis si besoin crédits/abonnements et ouverture à d’autres marchés/agences.

Tu peux partager ce fichier à l’App Product Builder et on enchaîne sur la spec technique et le premier sprint dès que tu valides les grandes lignes.
