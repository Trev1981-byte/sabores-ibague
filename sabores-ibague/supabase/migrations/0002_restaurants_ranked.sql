-- ---------------------------------------------------------------------------
-- restaurants_ranked — restaurants plus their display order for public
-- listings (category pages, search). Display-order only: it reads
-- restaurants and changes nothing in it.
--
--   sort_tier          0 = is_featured (reserved for paid listings)
--                      1 = has a WhatsApp number
--                      2 = phone only
--   daily_shuffle_key  md5 of the id + today's date in Colombia — a shuffle
--                      that's identical for every visitor all day and
--                      changes at midnight Bogotá time, so placement can't
--                      be gamed by renaming a restaurant.
--
-- Listings order by sort_tier, then daily_shuffle_key. Applies to every
-- city automatically — nothing to flag per city or per restaurant.
--
-- security_invoker = true: queries against this view run with the
-- caller's own permissions, so the restaurants RLS policy ("Public can
-- view approved restaurants") still decides which rows anyone sees.
--
-- Columns are listed explicitly instead of r.* so edit_token (each
-- vendor's private edit link) is never exposed through this view, and so
-- a column added to restaurants later doesn't silently become public
-- here. If restaurants gains a column listings need, add it below.
-- ---------------------------------------------------------------------------
create or replace view public.restaurants_ranked
with (security_invoker = true) as
select
  r.id,
  r.name,
  r.slug,
  r.city,
  r.neighborhood,
  r.price_level,
  r.blurb,
  r.whatsapp_number,
  r.phone_number,
  r.hours_text,
  r.maps_link,
  r.is_approved,
  r.is_featured,
  r.created_at,
  r.photo_url,
  r.has_delivery,
  r.has_takeout,
  r.has_dine_in,
  r.address,
  case
    when r.is_featured then 0
    -- A blank or whitespace-only number counts as "no WhatsApp".
    when nullif(btrim(r.whatsapp_number), '') is not null then 1
    else 2
  end as sort_tier,
  md5(r.id::text || to_char(now() at time zone 'America/Bogota', 'YYYY-MM-DD')) as daily_shuffle_key
from public.restaurants r;

-- Read-only for the site's public roles. (Supabase's default privileges
-- would otherwise also grant insert/update/delete on a new view.)
revoke all on public.restaurants_ranked from anon, authenticated;
grant select on public.restaurants_ranked to anon, authenticated;
