-- Sabores de Ibagué — initial schema.
--
-- This file documents what is ALREADY LIVE on the Supabase project
-- (josxuxityplchyrvlffz), pulled from the database itself — it replaces an
-- earlier draft of this file that guessed at a different, unused schema.
-- It's written to be safe to run again (IF NOT EXISTS / ON CONFLICT
-- throughout), so it doubles as the way to bootstrap a fresh project from
-- scratch if this one is ever recreated. You do not need to run it against
-- the current project — it's already there.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- categories — the kinds of food a restaurant serves. Kept deliberately
-- short (10 rows) rather than exhaustive, since restaurants are being added
-- one at a time by hand for now — see supabase/seed.sql for the current list.
-- ---------------------------------------------------------------------------
create table if not exists categories (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  label       text not null,
  emoji       text not null,
  sort_order  int not null default 0
);

-- ---------------------------------------------------------------------------
-- restaurants — one row per place. No separate neighborhoods/cities table:
-- `neighborhood` is free text (not yet worth normalizing at this size), and
-- `city` defaults to Ibagué but isn't hard-coded, so this can grow beyond
-- one city later without a schema change.
--
-- `edit_token` is what makes "easy to add your restaurant" work without a
-- login: whoever submits a listing gets a private link built around this
-- token to come back and edit it later, instead of creating an account.
-- `is_approved` gates what shoppers ever see (default false — nothing is
-- public until approved). `is_featured` is for manually promoting listings
-- on the home page.
-- ---------------------------------------------------------------------------
create table if not exists restaurants (
  id               uuid primary key default gen_random_uuid(),
  slug             text not null unique,
  name             text not null,
  city             text not null default 'Ibagué',
  neighborhood     text not null,
  price_level      text not null check (price_level in ('$', '$$', '$$$')),
  blurb            text,
  whatsapp_number  text not null,
  phone_number     text,
  hours_text       text,
  maps_link        text,
  edit_token       uuid not null default gen_random_uuid(),
  is_approved      boolean not null default false,
  is_featured      boolean not null default false,
  created_at       timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- restaurant_categories — many-to-many: a restaurant can serve more than
-- one kind of food (e.g. both hamburguesas and perros).
-- ---------------------------------------------------------------------------
create table if not exists restaurant_categories (
  restaurant_id  uuid not null references restaurants(id) on delete cascade,
  category_id    uuid not null references categories(id) on delete cascade,
  primary key (restaurant_id, category_id)
);

-- ---------------------------------------------------------------------------
-- menu_items — individual dishes for a restaurant. Deliberately minimal:
-- name, an optional price, and a sort_order for display — no per-item
-- category, description, or photo yet. Add columns here if/when the menu
-- page needs more than a simple priced list.
-- ---------------------------------------------------------------------------
create table if not exists menu_items (
  id             uuid primary key default gen_random_uuid(),
  restaurant_id  uuid not null references restaurants(id) on delete cascade,
  name           text not null,
  price          numeric,
  sort_order     int not null default 0
);

-- ---------------------------------------------------------------------------
-- Row Level Security
--
-- Current state: read-only for the public (anon/publishable) key.
--   - categories, menu_items, restaurant_categories: always readable.
--   - restaurants: only rows where is_approved = true.
-- There is NO insert policy on any table yet — the anon key cannot create a
-- restaurant, menu item, or category right now. That's fine for browsing
-- (step 3) but means the "add your restaurant" submission flow (a later
-- step) will need either: a scoped insert policy (e.g. "anyone can insert
-- a restaurant with is_approved = false"), or a server-side route using the
-- service role key. Worth deciding deliberately when we build that step
-- rather than opening it up by default.
-- ---------------------------------------------------------------------------
alter table categories enable row level security;
alter table restaurants enable row level security;
alter table restaurant_categories enable row level security;
alter table menu_items enable row level security;

drop policy if exists "Public can view categories" on categories;
create policy "Public can view categories"
  on categories for select
  using (true);

drop policy if exists "Public can view approved restaurants" on restaurants;
create policy "Public can view approved restaurants"
  on restaurants for select
  using (is_approved = true);

drop policy if exists "Public can view restaurant_categories" on restaurant_categories;
create policy "Public can view restaurant_categories"
  on restaurant_categories for select
  using (true);

drop policy if exists "Public can view menu_items" on menu_items;
create policy "Public can view menu_items"
  on menu_items for select
  using (true);
