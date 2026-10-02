-- ---------------------------------------------------------------------------
-- category_descriptions — the intro paragraph shown under a category page's
-- H1, per category AND per city.
--
-- Per city on purpose: the text is city-specific ("las mejores hamburguesas
-- en Ibagué… La Macarena, San Francisco y Varsovia"), so a single column on
-- categories would show Ibagué copy on every future city's pages. Here a
-- city with no row for a category simply shows no paragraph.
--
-- `city` matches restaurants.city and CityInfo.name in src/lib/cities.ts
-- (e.g. 'Ibagué'). Additive only: a new table plus its rows; nothing
-- existing is altered.
-- ---------------------------------------------------------------------------
create table if not exists public.category_descriptions (
  category_id  uuid not null references public.categories(id) on delete cascade,
  city         text not null,
  description  text not null,
  primary key (category_id, city)
);

-- Public can read; only you (dashboard / SQL editor / migrations) can write.
alter table public.category_descriptions enable row level security;

drop policy if exists "Public can view category_descriptions" on public.category_descriptions;
create policy "Public can view category_descriptions"
  on public.category_descriptions for select
  using (true);

revoke insert, update, delete, truncate on public.category_descriptions from anon, authenticated;

-- Ibagué copy, matched by category slug. Re-running updates the text.
insert into public.category_descriptions (category_id, city, description)
select c.id, 'Ibagué', d.description
from (values
  ('hamburguesas', $$Si buscas las mejores hamburguesas en Ibagué, aquí están los locales activos de la ciudad, desde propuestas clásicas hasta opciones artesanales en barrios como La Macarena, San Francisco y Varsovia. Revisa los menús y contacta directo por WhatsApp para hacer tu pedido.$$),
  ('pizza', $$Si buscas las mejores pizzas en Ibagué, estas son las pizzerías activas en sectores como el Centro, La Pola y Macarena Alta. Explora los menús de cada una y contacta directo para hacer tu pedido.$$),
  ('pollo', $$Si buscas el mejor pollo en Ibagué, encuentra alitas y preparaciones a la parrilla en sectores como el Centro, El Jardín y Mirolindo. Mira los menús disponibles y escribe por WhatsApp para pedir.$$),
  ('parrilla', $$Si buscas la mejor parrilla en Ibagué, conoce los restaurantes de carnes asadas y cortes a la brasa en sectores como Mirolindo, Picaleña y Piedra Pintada.$$),
  ('cafe', $$Si buscas el mejor café en Ibagué, estas son las cafeterías activas en sectores como La Macarena, La Pola y el Jordán. Encuentra horarios y ubicación de cada una antes de visitar.$$),
  ('perros', $$Perros calientes en Ibagué: una tradición callejera presente en sectores como el Centro, Prados del Norte y Valparaíso. Compara los toppings y salsas de cada local antes de decidir cuál probar.$$),
  ('salchipapas', $$Salchipapas en Ibagué: papas fritas, salchicha y salsas en locales de barrios como Ambalá, Belalcázar y Jordán. Revisa precios y porciones entre las opciones disponibles.$$),
  ('almuerzos', $$Almuerzos en Ibagué: menús ejecutivos y platos del día en zonas como el Centro, El Limonar y La Pola. Revisa qué incluye cada menú antes de decidir dónde almorzar.$$),
  ('desayunos', $$Desayunos en Ibagué: calentado, huevos y café en locales de zonas como La Pola y San Jerónimo. Descubre qué ofrece cada lugar y a qué hora abre.$$),
  ('empanadas', $$Empanadas en Ibagué: el antojo de toda la vida, con locales en el Centro y Macarena Baja. Compara los rellenos disponibles y elige tu favorita.$$),
  ('arepas', $$Arepas en Ibagué: un clásico colombiano disponible en barrios como Ambalá y Piedra Pintada. Revisa los locales que las preparan antes de visitar.$$),
  ('tamales', $$Tamales en Ibagué: el sabor casero de toda la vida, con locales en Gaitán, Jordán y La Francia. Mira qué restaurantes los tienen disponibles este fin de semana.$$),
  ('otros', $$Otras opciones en Ibagué: restaurantes de barrios como Ambalá, El Vergel y Entrerríos que no encajan en una sola categoría. Explora qué tienen para ofrecer.$$),
  ('internacional', $$Comida internacional en Ibagué: sabores de otras partes del mundo en sectores como Hipódromo y Prados del Norte. Descubre qué restaurantes ofrecen estas opciones.$$),
  ('postres', $$Postres en Ibagué: dulces y antojos en zonas como Interlaken y Santa Ana. Encuentra las pastelerías activas antes de decidir cuál visitar.$$)
) as d(slug, description)
join public.categories c on c.slug = d.slug
on conflict (category_id, city) do update set description = excluded.description;
