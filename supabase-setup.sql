-- ============================================================
-- Xeext — tables Supabase : favoris et rendez-vous
-- À exécuter une seule fois dans le SQL Editor du projet Supabase.
-- Les comptes (e-mail / mot de passe) sont gérés par Supabase Auth,
-- rien à créer pour eux.
-- ============================================================

-- ---------- Favoris : un enregistrement par bien mis en favori ----------
create table public.favoris (
  user_id    uuid not null references auth.users (id) on delete cascade,
  bien_id    text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, bien_id)
);

alter table public.favoris enable row level security;

create policy "favoris : lire les siens"
  on public.favoris for select
  using (auth.uid() = user_id);

create policy "favoris : ajouter les siens"
  on public.favoris for insert
  with check (auth.uid() = user_id);

create policy "favoris : supprimer les siens"
  on public.favoris for delete
  using (auth.uid() = user_id);

-- ---------- Rendez-vous ----------
create table public.rendez_vous (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users (id) on delete cascade,
  bien_id     text not null,
  bien_titre  text not null,
  bien_ville  text not null,
  date_visite date not null,
  date_label  text,
  creneau     text not null,
  nom         text not null,
  email       text not null,
  telephone   text,
  message     text,
  created_at  timestamptz not null default now()
);

alter table public.rendez_vous enable row level security;

create policy "rdv : lire les siens"
  on public.rendez_vous for select
  using (auth.uid() = user_id);

create policy "rdv : ajouter les siens"
  on public.rendez_vous for insert
  with check (auth.uid() = user_id);

create policy "rdv : annuler les siens"
  on public.rendez_vous for delete
  using (auth.uid() = user_id);

-- ---------- Leads (estimations, contacts, alertes) ----------
-- Captés depuis les formulaires publics : tout le monde peut SOUMETTRE ; la
-- lecture est réservée à l'administrateur (par e-mail). Les pièces jointes
-- éventuelles sont stockées dans le bucket privé `dossiers` (voir plus bas), et
-- la colonne `documents` en conserve les chemins.
create table public.leads (
  id          uuid primary key default gen_random_uuid(),
  type        text not null,            -- 'estimation' | 'contact' | 'alerte'
  nom         text,
  email       text not null,
  telephone   text,
  message     text,
  segment     text,                     -- bien concerné (estimation/alerte)
  ville       text,
  surface     integer,
  loyer       integer,
  criteres    jsonb,                    -- critères du questionnaire (alerte)
  documents   text[] default '{}',      -- pièces jointes (chemins bucket `dossiers`)
  user_id     uuid references auth.users (id) on delete set null,
  created_at  timestamptz not null default now()
);

alter table public.leads enable row level security;

-- Soumission ouverte (visiteur anonyme ou connecté).
create policy "leads : soumettre"
  on public.leads for insert
  with check (true);

-- Lecture / gestion réservée à l'administrateur (par e-mail).
create policy "leads : admin lit"
  on public.leads for select
  using ((auth.jwt() ->> 'email') = 'ahagry54@gmail.com');

-- ---------- Biens (catalogue géré depuis le back-office /admin.html) ----------
-- Lecture publique (le catalogue est visible par tous) ; écriture réservée à
-- l'administrateur, identifié par son e-mail. Remplacez l'e-mail ci-dessous
-- si vous changez de compte admin.
create table public.biens (
  id          text primary key,
  segment     text not null,
  titre       text not null,
  ville       text not null,
  dept        text,
  surface     integer,
  loyer       integer,
  dispo       text,
  dispo_rank  integer default 0,
  resume      text,
  adresse     text,                     -- adresse exacte (facultative)
  lat         double precision,         -- coordonnées exactes du bien (carte + POI)
  lon         double precision,
  specs       jsonb default '{}'::jsonb,
  photos      text[] default '{}',
  images      text[] default '{}',
  ordre       integer default 0,
  created_at  timestamptz not null default now()
);

alter table public.biens enable row level security;

create policy "biens : lecture publique"
  on public.biens for select
  using (true);

create policy "biens : admin écrit"
  on public.biens for all
  using ((auth.jwt() ->> 'email') = 'ahagry54@gmail.com')
  with check ((auth.jwt() ->> 'email') = 'ahagry54@gmail.com');

-- ---------- Mises à jour de colonnes (tables déjà existantes) ----------
-- À exécuter si les tables existaient déjà avant l'ajout de ces fonctionnalités.
-- Biens bilingues : titre/description en anglais (back-office). Si vides, le site
-- retombe sur la traduction automatique (titre) ou le français (description).
alter table public.biens add column if not exists titre_en  text;
alter table public.biens add column if not exists resume_en text;
-- Adresse exacte + coordonnées : carte et services à proximité centrés sur le bien.
alter table public.biens add column if not exists adresse text;
alter table public.biens add column if not exists lat double precision;
alter table public.biens add column if not exists lon double precision;
-- Pièces jointes des demandes.
alter table public.leads add column if not exists documents text[] default '{}';

-- ---------- Dossiers : stockage des pièces jointes (Supabase Storage) ----------
-- Bucket PRIVÉ « dossiers » : 10 Mo/fichier, types autorisés (bornés côté serveur).
-- Dépôt ouvert (prospects sans compte) ; lecture/téléchargement réservés à l'admin.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'dossiers', 'dossiers', false, 10485760,
  array['application/pdf','image/jpeg','image/png','image/heic',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
)
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

create policy "dossiers : depot"
  on storage.objects for insert
  to anon, authenticated
  with check (bucket_id = 'dossiers');

create policy "dossiers : lecture admin"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'dossiers' and (auth.jwt() ->> 'email') = 'ahagry54@gmail.com');
