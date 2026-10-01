-- ---------------------------------------------------------------------------
-- restaurant_categories: at most 2 categories per restaurant, and only the
-- restaurant's own signup/edit flow can write tags.
--
-- 1. Cap. A trigger rejects any insert (or update) that would give a
--    restaurant more than 2 categories. The limit lives here, not just in
--    the forms, so calling the API or a database function directly can't
--    get around it. Keep it in sync with MAX_CATEGORIES_PER_RESTAURANT in
--    src/lib/queries.ts.
--
--    The functions that rewrite a restaurant's tags
--    (update_restaurant_info_by_token, admin_merge_restaurant,
--    admin_revert_restaurant_edit) delete the old rows before inserting
--    the new ones in the same transaction, so a vendor changing their 2
--    categories is never blocked by the 2 they're replacing.
--
--    Restaurants already over the limit keep their existing rows — the
--    trigger only checks new writes. (Reverting an edit back to an
--    old >2-category set will now be refused.)
--
-- 2. Who can write. The "Public can tag a restaurant with categories"
--    policy was `with check (true)` for anon, so anyone could add any
--    category to any restaurant straight through the API. Every legitimate
--    write already goes through a SECURITY DEFINER function owned by
--    postgres (submit_restaurant, admin_create_restaurant,
--    update_restaurant_info_by_token, admin_merge_restaurant,
--    admin_revert_restaurant_edit), which bypasses RLS and table
--    privileges — so the policy and the public write privileges can go
--    without breaking anything. Public read access is unchanged.
-- ---------------------------------------------------------------------------

create or replace function public.enforce_max_categories_per_restaurant()
returns trigger
language plpgsql
set search_path = public
as $$
declare
  v_existing integer;
begin
  -- Two concurrent writes for the same restaurant would otherwise each
  -- see the old count and both get through; this makes them take turns.
  perform pg_advisory_xact_lock(hashtextextended(new.restaurant_id::text, 0));

  select count(*) into v_existing
  from restaurant_categories
  where restaurant_id = new.restaurant_id
    and category_id <> new.category_id
    -- On an update, the row being changed doesn't count against itself.
    and not (
      tg_op = 'UPDATE'
      and restaurant_id = old.restaurant_id
      and category_id = old.category_id
    );

  if v_existing >= 2 then
    raise exception 'A restaurant can have at most 2 categories'
      using errcode = 'check_violation';
  end if;

  return new;
end;
$$;

drop trigger if exists restaurant_categories_max_two on public.restaurant_categories;
create trigger restaurant_categories_max_two
  before insert or update of restaurant_id, category_id on public.restaurant_categories
  for each row execute function public.enforce_max_categories_per_restaurant();

drop policy if exists "Public can tag a restaurant with categories" on public.restaurant_categories;
revoke insert, update, delete, truncate on public.restaurant_categories from anon, authenticated;
