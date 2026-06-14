# Xeext — Le conseil immobilier d'entreprise, repensé à 5%

Site vitrine + catalogue de biens, avec comptes utilisateurs (inscription / connexion),
favoris et prise de rendez-vous, synchronisés sur tous les appareils via Supabase.

## Lancer le site en local

Le site est 100 % statique. Servez le dossier avec n'importe quel serveur, par exemple :

```
python -m http.server 8000
```

puis ouvrez **http://localhost:8000**.

Pour la mise en ligne : déposez le dossier tel quel sur un hébergeur statique
(Netlify, Vercel, GitHub Pages, Firebase Hosting…).

## Comptes & données (Supabase)

- **Authentification** : Supabase Auth (e-mail / mot de passe). La configuration
  publique (URL du projet + clé `anon`) est dans [`assets/config.js`](assets/config.js).
  Ne mettez jamais la clé `service_role` dans le code du site.
- **Favoris / rendez-vous** : tables `favoris` et `rendez_vous`, protégées par
  Row Level Security — chaque utilisateur ne voit que ses données.
  Le script de création est dans [`supabase-setup.sql`](supabase-setup.sql)
  (à exécuter une fois dans le SQL Editor du projet).
- **Leads** (estimations propriétaires, contacts, alertes) : table `leads`.
  Tout le monde peut **soumettre** (formulaires publics), mais **personne ne peut
  lire** via l'API ; consultez les leads dans **Supabase → Table editor → leads**.
- Toute la logique d'accès est isolée dans [`assets/store.js`](assets/store.js) ;
  le reste de l'interface lit un cache synchrone et se resynchronise via
  l'évènement `xeext:change`.

## Réglages Supabase requis

1. **SQL Editor** → exécuter `supabase-setup.sql` (tables favoris / rendez-vous **et leads**).
   À relancer après cette mise à jour pour créer la table `leads`.
2. **Authentication → Sign In / Up → Email** : pour tester sans étape de validation,
   désactiver « Confirm email ». Le réactiver avant la mise en production.

## E-mails & mot de passe oublié

La page de connexion propose « Mot de passe oublié ? » → Supabase envoie un e-mail
contenant un lien vers `reinitialisation.html`, où l'utilisateur choisit un nouveau
mot de passe. Pour que ça fonctionne **en production** :

1. **Authentication → URL Configuration** :
   - *Site URL* : `https://antoinehagry.github.io/Xeext/index.html`
   - *Redirect URLs* : ajouter `https://antoinehagry.github.io/Xeext/reinitialisation.html`
     (et l'équivalent local, ex. `http://localhost:8000/reinitialisation.html`, pour tester).
2. **Authentication → Emails / SMTP** : l'envoi par défaut de Supabase est très limité et
   finit souvent en spam. Configurer un **SMTP perso** (Brevo, Resend, Mailgun…) pour des
   e-mails fiables — c'est requis aussi bien pour le reset que pour la confirmation d'inscription.
3. **Confirm email** : à réactiver avant l'ouverture publique (Authentication → Email).

## Pages légales

`mentions-legales.html` et `confidentialite.html` (liées dans le pied de page).
⚠️ Elles contiennent des champs **[à compléter]** (forme juridique, SIREN, n° de carte
professionnelle, garantie financière, adresse) — à renseigner avec les vraies informations
de la société avant la mise en ligne.

## Analytics (optionnel)

Les pages contiennent un script **Plausible** en commentaire (`<head>`). Pour l'activer :
créez un site sur [plausible.io](https://plausible.io), puis décommentez la balise
`<script ... data-domain="VOTRE-DOMAINE">` sur chaque page.

## À prévoir avant une mise en production

- Réactiver « Confirm email » dans Supabase + SMTP perso pour les e-mails.
- Pages légales / RGPD (confidentialité, mentions légales) — les formulaires collectent des données personnelles.
- Remplacer les visuels Unsplash (illustration) par de vraies photos des biens.
- Renseigner un domaine de production dans Supabase (Authentication → URL Configuration).
