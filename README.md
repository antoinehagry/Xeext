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
- Toute la logique d'accès est isolée dans [`assets/store.js`](assets/store.js) ;
  le reste de l'interface lit un cache synchrone et se resynchronise via
  l'évènement `xeext:change`.

## Réglages Supabase requis

1. **SQL Editor** → exécuter `supabase-setup.sql` (tables favoris / rendez-vous).
2. **Authentication → Sign In / Up → Email** : pour tester sans étape de validation,
   désactiver « Confirm email ». Le réactiver avant la mise en production.

## À prévoir avant une mise en production

- Réactiver « Confirm email » dans Supabase.
- Remplacer les visuels rayés (placeholders) par de vraies photos des biens.
- Renseigner un domaine de production dans Supabase (Authentication → URL Configuration).
