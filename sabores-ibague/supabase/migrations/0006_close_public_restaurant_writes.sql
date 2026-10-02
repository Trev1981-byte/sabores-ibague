-- ---------------------------------------------------------------------------
-- restaurants: no direct writes from public roles.
--
-- "Public can submit new restaurants" let anon insert rows straight into
-- restaurants through the REST API (unapproved and unfeatured, but still
-- a spam door that skips the signup form entirely). anon/authenticated
-- also held table-wide INSERT, UPDATE, DELETE and TRUNCATE. Updates and
-- deletes were already blocked by RLS (no policy allowed them); TRUNCATE
-- isn't subject to RLS at all, and nothing should be able to use it.
--
-- Every legitimate write goes through a SECURITY DEFINER function owned by
-- postgres — submit_restaurant, admin_create_restaurant,
-- update_restaurant_info_by_token, set_restaurant_photo_by_token,
-- admin_approve_restaurant, admin_reject_restaurant,
-- admin_merge_restaurant, admin_revert_restaurant_edit — which run with
-- the owner's privileges, so they're unaffected. Public read access (the
-- column-level SELECT from 0003_hide_edit_token.sql and the "Public can
-- view approved restaurants" policy) is left exactly as it is.
-- ---------------------------------------------------------------------------
drop policy if exists "Public can submit new restaurants" on public.restaurants;

revoke insert, update, delete, truncate on public.restaurants from anon, authenticated;
