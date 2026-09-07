# Sabores de Ibagué

Sitio de descubrimiento gastronómico para Ibagué, Tolima — en español, primero.

## Stack

- **Next.js** (App Router) + **TypeScript**
- **Tailwind CSS** for styling
- **Supabase** for the database (restaurants, menu items, categories) —
  live project: `josxuxityplchyrvlffz`
- **Vercel** for deployment

## Project structure

```
src/
  app/
    layout.tsx           # Root layout: <html lang="es">, header/nav, fonts
    page.tsx              # Home page: search + browse by category
    categoria/[slug]/
      page.tsx             # One category's restaurants (or an empty state)
    globals.css            # Tailwind entry point + global styles
  lib/
    supabase.ts    # Supabase client, typed against the live schema
    queries.ts      # Typed data-fetching helpers (categories, restaurants)
  components/
    CategoryGrid.tsx  # Client component: search box + category tiles
  types/
    database.ts    # Generated TypeScript types matching the live Supabase schema
supabase/
  migrations/
    0001_initial_schema.sql  # Documents the live schema — safe to re-run, not required to
  seed.sql          # The 11 categories currently live, as an idempotent upsert
.env.local.example  # Template for the Supabase keys you'll need locally
```

## Getting started locally

```bash
npm install
cp .env.local.example .env.local   # then fill in your Supabase URL + anon key
npm run dev
```

Visit http://localhost:3000.

### Database

The schema already exists on the live Supabase project — nothing to run to
set it up. `supabase/migrations/0001_initial_schema.sql` and
`supabase/seed.sql` are here as a record of what's live (both written to be
safe to re-run, e.g. against a fresh project if this one ever needs to be
recreated), not as setup steps you need to take now.

Your project URL and a public (anon/publishable) key go in `.env.local` —
see `.env.local.example`. These are safe to expose client-side; they only
grant what the database's row-level security policies allow.

## Current schema

Four tables, all in the `public` schema:

- **`categories`** — `slug`, `label`, `emoji`, `sort_order`. 11 rows today:
  Hamburguesas, Perros, Salchipapas, Empanadas, Arepas, Almuerzos, Pizza,
  Pollo, Parrilla, Postres, Tamales. Deliberately short — restaurants are
  being added by hand for now, so the list only grows when a real restaurant
  needs a tag that isn't there yet. (See `supabase/seed.sql` to add more.)
- **`restaurants`** — `name`, `slug`, `city` (defaults to Ibagué, so this can
  expand to other cities without a schema change), `neighborhood` (free
  text), `price_level` (`$`/`$$`/`$$$`), `blurb`, `whatsapp_number`,
  `phone_number`, `hours_text` (free text), `maps_link`, `is_approved`,
  `is_featured`, and `edit_token`. Empty right now.
- **`menu_items`** — `restaurant_id`, `name`, `price`, `sort_order`. One row
  per dish. Empty right now.
- **`restaurant_categories`** — join table, a restaurant can carry more than
  one category (e.g. both Hamburguesas and Perros). Empty right now.

**`edit_token`** is the mechanism for "easy to add your restaurant" without
building a login system: whoever submits a listing gets a private link built
around this token to come back and edit it later, instead of an account.

**`is_approved`** gates what shoppers ever see — a restaurant is invisible
on the public site until this is `true`. Right now that flag has to be
flipped by hand in the Supabase dashboard (Table Editor → restaurants); an
admin view for that can come later if that gets tedious.

**Row-level security** — currently read-only for the public key:
categories, menu_items, and restaurant_categories are always readable;
restaurants only where `is_approved = true`. There is **no insert policy
yet** on any table, so the public key can't create a restaurant, menu item,
or category as things stand. That's fine for browsing (step 3 below) but
means the submission form (step 5) needs a deliberate decision: either a
scoped insert policy (e.g. "anyone can insert a restaurant, but only with
`is_approved = false`"), or a server-side route using the service role key.
Worth deciding when we get there, not defaulting to wide-open.

**No tables yet for:** reviews, photos, or a normalized neighborhoods list
(neighborhood is just a text field on `restaurants` for now). Add these if
and when they're actually needed — nothing here blocks adding them later.

## Status

Live at https://sabores-ibague.vercel.app — home page and category pages are
built and deployed. Still zero restaurants, so every category currently
shows its empty state ("no restaurants here yet").

## Roadmap

1. ~~Project scaffold~~
2. ~~Database schema~~ (categories, restaurants, menu_items — live on Supabase)
3. ~~Build the home page~~ (search box that filters categories, a tile grid
   linking to `/categoria/[slug]`, which lists that category's approved
   restaurants or an empty state)
4. Restaurant detail pages (with menu items) — worth doing once there's at
   least one real restaurant to build against
5. "Add your restaurant" submission form (needs the RLS decision noted above)
6. ~~Deploy to Vercel~~ — auto-deploys on every push to `main` via the
   GitHub integration

## Publishing changes

This repo is connected to Vercel through GitHub: push to `main` and Vercel
rebuilds and republishes automatically within a minute or two. No manual
deploy step. (One setting to remember if this project is ever re-imported
from scratch: Vercel's **Root Directory** must be set to `sabores-ibague`,
and **Framework Preset** to **Next.js** — both are already set correctly on
the live project.)
