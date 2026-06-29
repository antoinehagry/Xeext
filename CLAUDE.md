# CLAUDE.md — Guide projet Xeext

Contexte pour Claude Code. Lis ce fichier en entier avant toute modification.
Pour la mise en place Supabase et la checklist de mise en production, voir
aussi [README.md](README.md).

## 1. Le projet

**Xeext** — site de **conseil en immobilier d'entreprise** (bureaux, commerces,
logistique, terrains). Positionnement : honoraires à **5 %** (vs 15‑30 % du marché)
et **traitement des dossiers ultra rapide** (dépôt de pièces en ligne, dossier
locataire réutilisable). Marché **français**, interface **bilingue FR/EN**.

- Site **public** déployé sur **GitHub Pages** : https://antoinehagry.github.io/Xeext/
- Backend **Supabase** (Auth, base Postgres avec RLS, Storage).

## 2. Stack & contraintes (à respecter absolument)

- **100 % statique** : HTML + CSS + JavaScript **vanilla**. **Aucun build, aucun
  bundler, pas de framework, pas de TypeScript.** Pas de `node_modules`.
- **Pas de Node** dans l'environnement. La seule dépendance externe chargée est
  `@supabase/supabase-js` via CDN (jsDelivr), plus Mapbox GL (CDN) sur les fiches.
- Outillage de scripts : **Python 3** est disponible (utilisé pour le serveur local
  et d'éventuelles éditions de masse). Pas de gestionnaire de paquets JS.
- **GitHub Pages en sous-chemin `/Xeext/`** : les pages utilisent des liens
  **relatifs** (`biens.html`, `assets/…`). Seule exception : `404.html` utilise des
  chemins **absolus** `/Xeext/…` (elle peut être servie sur n'importe quelle URL).
- Environnement de dev : **Windows / PowerShell**. Éditer les fichiers en **UTF‑8**
  (accents) et préserver les fins de ligne.

## 3. Lancer & valider en local

```
python -m http.server 8000      # puis http://localhost:8000
```

Boucle de travail attendue : **modifier → servir en local → valider → demander
avant de pousser**. Il n'y a pas de tests automatisés : on valide à la main dans
le navigateur (et, pour Supabase, via des appels REST/clé `anon`).

## 4. Déploiement ⚠️

**`git push` sur `main` = mise en ligne immédiate** (GitHub Pages se redéploie).
**Toujours demander confirmation à l'utilisateur avant de pousser.** Ne commit /
push que lorsqu'il le demande explicitement. Travailler sur `main` est la norme ici.

Style de commit : message en **français**, court et descriptif (voir l'historique
`git log`). Terminer par la ligne de co‑auteur si l'environnement l'exige.

## 5. Architecture

Tout est à la racine (pages `.html`) + `assets/` (JS, CSS, images, SVG, polices).
Le JS expose un **namespace global unique `window.XEEXT`** ; chaque module est une
IIFE qui s'y greffe. Pas d'imports ES modules — l'ordre des `<script>` en bas de
chaque page fait foi.

### Pages (`*.html`)
`index.html` (accueil + simulateur + contact), `biens.html` (catalogue),
`fiche.html` (fiche d'un bien, `?id=`), `besoins.html` (questionnaire « Trouver mon
bien »), `apropos.html`, `compte.html` (espace membre), `admin.html` (back‑office),
`connexion.html` / `inscription.html` / `reinitialisation.html` (auth),
`mentions-legales.html`, `confidentialite.html`, `404.html`.

### Modules JS clés (`assets/`)
- **config.js** — `window.XEEXT_CONFIG` : URL Supabase, clé `anon` (publique),
  `ADMIN_EMAIL`, token Mapbox. **Ne jamais y mettre la clé `service_role`.**
- **store.js** — couche d'accès Supabase + **cache synchrone** + mutations
  optimistes. Auth, favoris, rendez‑vous, leads, upload de pièces (`uploadDocs`),
  back‑office biens (`adminSaveBien`/`adminListLeads`/`docSignedUrl`), dossier
  membre (`listMyDocs`/`uploadMyDoc`/`deleteMyDoc`). Émet l'évènement
  **`xeext:change`** ; l'UI réagit en relisant le cache. Hors‑ligne / sans config :
  dégradation propre.
- **biens.js** — données de démonstration (9 biens), chargement dynamique depuis
  Supabase (`biensReady`), helpers d'affichage (`money`/`currency`/`setCurrency`,
  `surface`/`setUnit`, `cover`/`imgTag`), `XEEXT_VILLES_COORDS`, `bienCoords`,
  **glossaires de traduction** des titres/specs (`bienTitle`, `specKey`/`specVal`).
- **i18n.js** — moteur bilingue (voir §7).
- **account.js** — modales d'auth + utilitaires UI (`ui.openModal`, `ui.toast`,
  `ui.ICON`), session.
- **fiche.js** — rendu d'une fiche : galerie, specs, carte Mapbox (repli OSM),
  panneau « Services à proximité » (POI via Mapbox Search, rayon 5 km), CTA RDV et
  « Déposer mon dossier ».
- **lead.js** — formulaires de captation : modale « Estimer mon bien »
  (propriétaire) et modale « Déposer mon dossier » (candidature locataire, pièces
  par type). Tout passe par `store.submitLead`.
- **compte.js** — espace membre : onglets Favoris / Rendez‑vous / **Mon dossier** /
  Profil.
- **admin.js** — back‑office : onglets **Biens** (CRUD) et **Dossiers** (leads +
  téléchargement des pièces). Accès filtré par e‑mail (`store.isAdmin`), sécurité
  réelle par RLS.
- **simulateur.js**, **besoins.js**, **catalogue.js**, **rdv.js**, **favoris.js**,
  **autocomplete.js** (villes via geo.api.gouv.fr ; adresses via la Base Adresse
  Nationale), **theme.js** (clair/sombre/auto), **nav.js**, **intro.js**,
  **cookies.js**, **breadcrumb.js**, **social.js**, **fill.js**, **app.js**, etc.

### CSS (`assets/`)
- **xeext.css** — base + **design tokens** dans `:root` (couleurs, rayons, ombres,
  typo, `--accent: #1f3df0`) + thème sombre via `[data-theme="dark"]`.
- **components.css** — composants (cartes, fiche, carte/POI…).
- **account.css** — auth, espace membre, back‑office, formulaires, dossier.
- **apropos.css** — page À propos.

Réutilise **toujours** les tokens et classes existants ; reste cohérent avec le
style en place (Apple‑like, sobre).

## 6. Supabase

- **Source de vérité du schéma : [`supabase-setup.sql`](supabase-setup.sql)**,
  **idempotent** (`create table if not exists`, `drop policy if exists` + recréation,
  `add column if not exists`). À exécuter dans **SQL Editor**. Après toute évolution
  de schéma, **mettre ce fichier à jour** et fournir le SQL à lancer.
- Tables : `biens` (lecture publique / écriture admin), `leads` (dépôt public /
  lecture admin), `rendez_vous` & `favoris` (cloisonnés par membre), `documents_membre`
  (dossier réutilisable du membre).
- **Storage** : bucket privé **`dossiers`** (10 Mo/fichier, types bornés). Dépôt
  ouvert à tous (prospects sans compte) ; lecture réservée à l'admin ; chaque membre
  gère ses fichiers sous `dossiers/<uid>/…`. Pièces de dossier classées par type
  (`kbis`, `bilans`, `fiscal`, `assurance`, `identite`, `rib`, `autre`).
- **Admin** = compte dont l'e‑mail correspond à `ADMIN_EMAIL` (config.js) **et** aux
  policies RLS. Les deux doivent rester synchronisés.
- **Sécurité** : la clé `anon` est publique (prévue côté client) ; la sécurité repose
  sur la **RLS**. **Ne jamais** committer de clé `service_role` ni de secret.

## 7. i18n — règle à connaître

- Le **français est la source** : c'est le texte écrit en dur dans le HTML.
- L'anglais vit dans `assets/i18n.js` : `window.XEEXT_I18N = { en:{…}, fr:{…} }`.
  `apply()` ne traduit la page **que si `lang === "en"`**.
- Attributs : `data-i18n` (texte), `data-i18n-html` (HTML interne),
  `data-i18n-attr` (ex. `content:cle`). Lecture en JS : `XEEXT.t("cle")`.
- **Tout texte généré en JavaScript doit avoir sa clé dans les DEUX blocs `en` ET
  `fr`** (sinon il ne s'affiche pas correctement dans une langue). Le texte injecté
  dans le HTML n'a besoin que de la clé **`en`** (le FR est déjà dans la page).
- `XEEXT.setLang()` **recharge la page** (`location.reload()`) — donc tout `init()`
  se ré‑exécute au changement de langue.
- Devises (EUR/USD/GBP/CHF/JPY, taux réels + repli) et unités (m²/sq ft) gérées dans
  `biens.js` ; titres/caractéristiques des biens traduits via des **glossaires**
  (FR inchangé, EN par règles). Ajouter un terme manquant au glossaire si besoin.

## 8. Pièges connus

- **Ordre des `<script>`** : un module suppose que ses dépendances `XEEXT.*` sont
  déjà chargées. Respecter l'ordre en bas de page.
- **Carte / POI** : nécessitent le token Mapbox (config.js) ; repli OpenStreetMap
  sans token. Les coordonnées d'un bien viennent de son adresse exacte (back‑office)
  sinon du centre‑ville (`XEEXT_VILLES_COORDS`).
- Si la table `biens` est vide/absente, le site affiche les **9 biens de démo** de
  `biens.js` — normal.
- Fichiers SVG/polices **non suivis** par git : ne les committer **que** s'ils sont
  réellement utilisés par une page (sinon laisser non suivis).

## 9. Avant une mise en production

Voir la checklist en bas du [README.md](README.md) : réactiver « Confirm email » +
SMTP perso, compléter les pages légales / RGPD (les formulaires collectent des
données personnelles, dont des **documents** de dossier), vraies photos, domaine de
prod dans Supabase.
