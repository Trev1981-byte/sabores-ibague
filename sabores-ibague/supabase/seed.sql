-- Sabores de Ibagué — categories currently live on the Supabase project.
-- Pulled from the database itself, not guessed — this replaces an earlier
-- draft that seeded a different (Tolima-heritage-focused) list that was
-- never actually used.
--
-- Kept short on purpose: restaurants are being added by hand for now, so a
-- long category list would mostly sit empty. Add more here as real
-- restaurants need them, rather than front-loading every Colombian dish.
--
-- Written as upserts (on slug), so it's safe to run again without creating
-- duplicates or wiping edits made through the Supabase dashboard.

insert into categories (slug, label, emoji, sort_order) values
  ('hamburguesas', 'Hamburguesas', '🍔', 1),
  ('perros',       'Perros',       '🌭', 2),
  ('salchipapas',  'Salchipapas',  '🍟', 3),
  ('empanadas',    'Empanadas',    '🥟', 4),
  ('arepas',       'Arepas',       '🫓', 5),
  ('almuerzos',    'Almuerzos',    '🍛', 6),
  ('pizza',        'Pizza',        '🍕', 7),
  ('pollo',        'Pollo',        '🍗', 8),
  ('parrilla',     'Parrilla',     '🔥', 9),
  ('postres',      'Postres',      '🍰', 10)
on conflict (slug) do update set
  label      = excluded.label,
  emoji      = excluded.emoji,
  sort_order = excluded.sort_order;
