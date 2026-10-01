-- ---------------------------------------------------------------------------
-- Every restaurant's edit_token must be unique. The token is the only proof
-- of ownership the /mi-restaurante/<token> page and the *_by_token functions
-- accept, so two restaurants sharing one would let one vendor edit the
-- other's listing. New tokens come from gen_random_uuid(), so a collision
-- is practically impossible — this makes the database guarantee it rather
-- than relying on chance. The unique index it creates also makes the
-- token lookups in those functions an index lookup instead of a table scan.
-- ---------------------------------------------------------------------------
alter table public.restaurants
  add constraint restaurants_edit_token_key unique (edit_token);
