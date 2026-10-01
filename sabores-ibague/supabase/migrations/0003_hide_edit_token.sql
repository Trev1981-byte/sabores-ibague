-- ---------------------------------------------------------------------------
-- Stop the public API from handing out vendors' private edit links.
--
-- edit_token is the only thing that proves someone owns a restaurant's
-- listing — the /mi-restaurante/<token> page and every *_by_token function
-- trust it completely. But the "Public can view approved restaurants" RLS
-- policy lets anyone read approved rows, and anon/authenticated had SELECT
-- on every column, so anyone with the site's public key could ask the REST
-- API for every approved restaurant's edit_token and take over its listing.
--
-- RLS decides which ROWS a role sees; column privileges decide which
-- COLUMNS. This swaps the table-wide SELECT for a column-level one that
-- leaves edit_token out. Postgres checks column privileges on every query,
-- so select=* on restaurants is refused for these roles from now on —
-- queries must name their columns.
--
-- Nothing that legitimately needs the token breaks: every function that
-- reads or checks edit_token (submit_restaurant, get_restaurant_by_edit_token,
-- the *_by_token functions, the admin functions) is SECURITY DEFINER and
-- runs with its owner's privileges, not the caller's. restaurants_ranked
-- doesn't include edit_token, so it's unaffected too.
--
-- Only SELECT changes; other privileges (and the RLS policies) are left
-- exactly as they were. A column added to restaurants later is private
-- by default until it's granted here.
-- ---------------------------------------------------------------------------
revoke select on public.restaurants from anon, authenticated;

grant select (
  id,
  name,
  slug,
  city,
  neighborhood,
  price_level,
  blurb,
  whatsapp_number,
  phone_number,
  hours_text,
  maps_link,
  is_approved,
  is_featured,
  created_at,
  photo_url,
  has_delivery,
  has_takeout,
  has_dine_in,
  address
) on public.restaurants to anon, authenticated;
