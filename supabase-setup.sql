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
-- Captés depuis les formulaires publics : tout le monde peut SOUMETTRE,
-- mais PERSONNE ne peut lire via l'API (aucune policy SELECT).
-- Le propriétaire consulte les leads dans Supabase → Table editor → leads.
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
  user_id     uuid references auth.users (id) on delete set null,
  created_at  timestamptz not null default now()
);

alter table public.leads enable row level security;

-- Soumission ouverte (visiteur anonyme ou connecté), sans lecture possible.
create policy "leads : soumettre"
  on public.leads for insert
  with check (true);
