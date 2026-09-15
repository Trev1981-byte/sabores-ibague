import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CategoryGrid } from "@/components/CategoryGrid";
import {
  getApprovedRestaurantCount,
  getApprovedRestaurantsForSearch,
  getCategories,
  getMenuItemsForSearch,
} from "@/lib/queries";
import { getCityBySlug } from "@/lib/cities";
import { SITE_URL } from "@/lib/site";

// Always fetch fresh from Supabase on every visit instead of freezing the
// category/restaurant list at build time — otherwise anything added or
// changed directly in the Supabase dashboard would never show up on the
// live site until the next code deploy.
export const dynamic = "force-dynamic";

// The bare site root ("/") just redirects here, and this page had no
// title/description of its own — so every search result for the site
// showed nothing but the generic "Colcocina" brand name, with no mention
// of what it is or where. This gives the actual home page (and therefore
// what Google shows for the whole domain) a real, specific title.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ ciudad: string }>;
}): Promise<Metadata> {
  const { ciudad } = await params;
  const city = getCityBySlug(ciudad);

  if (!city) {
    return { title: "Ciudad no encontrada — Colcocina" };
  }

  const restaurantCount = await getApprovedRestaurantCount(city.name);
  const title = `Restaurantes y comida en ${city.name} — Colcocina`;
  const description =
    restaurantCount > 0
      ? `${restaurantCount} restaurantes, cafés y puestos de comida verificados en ${city.name}: teléfono, WhatsApp, menú y ubicación — gratis.`
      : `Descubre los mejores restaurantes, cafés y puestos de comida en ${city.name} — teléfono, WhatsApp y menú.`;
  const url = `${SITE_URL}/${city.slug}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: "Colcocina",
      locale: "es_CO",
      type: "website",
    },
  };
}

export default async function CityHome({
  params,
}: {
  params: Promise<{ ciudad: string }>;
}) {
  const { ciudad } = await params;
  const city = getCityBySlug(ciudad);

  if (!city) {
    notFound();
  }

  const [categories, restaurantCount, restaurants, menuItems] = await Promise.all([
    getCategories(),
    getApprovedRestaurantCount(city.name),
    getApprovedRestaurantsForSearch(city.name),
    getMenuItemsForSearch(city.name),
  ]);

  return (
    <>
      <CategoryGrid
        categories={categories}
        restaurantCount={restaurantCount}
        citySlug={city.slug}
        cityName={city.name}
        restaurants={restaurants}
        menuItems={menuItems}
      />

      <div className="strip">
        <div className="wrap strip-grid">
          <div className="strip-card">
            <h3>
              <span className="tag">Para comer</span>
            </h3>
            <p>
              Busca por lo que se te antoja y encuentra el puesto o
              restaurante más cercano en tu barrio.
            </p>
          </div>
          <div className="strip-card">
            <h3>
              <span className="tag">Para vender</span>
            </h3>
            <p>
              ¿Tienes una fonda o un restaurante en {city.name}? Añádelo tú
              mismo, sin complicaciones — es gratis.
            </p>
            <Link href="/agregar" className="strip-cta">
              Añadir mi restaurante →
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
