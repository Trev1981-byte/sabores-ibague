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

// Always fetch fresh from Supabase on every visit instead of freezing the
// category/restaurant list at build time — otherwise anything added or
// changed directly in the Supabase dashboard would never show up on the
// live site until the next code deploy.
export const dynamic = "force-dynamic";

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
