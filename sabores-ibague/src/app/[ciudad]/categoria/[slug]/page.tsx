import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getApprovedRestaurantsByCategory,
  getCategoryBySlug,
} from "@/lib/queries";
import { getCityBySlug } from "@/lib/cities";
import { ServiceBadges } from "@/components/ServiceBadges";

// Same reasoning as the home page: always ask Supabase fresh, never freeze
// this page's data at build time.
export const dynamic = "force-dynamic";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ ciudad: string; slug: string }>;
}) {
  const { ciudad, slug } = await params;
  const city = getCityBySlug(ciudad);
  const category = await getCategoryBySlug(slug);

  if (!city || !category) {
    notFound();
  }

  const restaurants = await getApprovedRestaurantsByCategory(category.id, city.name);

  return (
    <main className="wrap">
      <Link href={`/${city.slug}`} className="back-link">
        ← Volver a todas las categorías
      </Link>

      <div className="detail-head">
        <span className="detail-emoji" aria-hidden="true">
          {category.emoji}
        </span>
        <h1>{category.label}</h1>
      </div>

      {restaurants.length === 0 ? (
        <p className="empty-detail">
          Todavía no hay restaurantes publicados en {category.label}. Vuelve
          pronto.
        </p>
      ) : (
        <div className="restaurant-list">
          {restaurants.map((restaurant) => (
            <Link
              href={`/${city.slug}/restaurante/${restaurant.slug}`}
              className="restaurant-card"
              key={restaurant.id}
            >
              {restaurant.photo_url ? (
                <img
                  src={restaurant.photo_url}
                  alt={restaurant.name}
                  className="restaurant-card-photo"
                />
              ) : (
                <div
                  className="restaurant-card-photo restaurant-card-photo-empty"
                  aria-hidden="true"
                >
                  🍽️
                </div>
              )}
              <div className="restaurant-card-body">
                <p className="name">{restaurant.name}</p>
                <p className="meta">
                  {restaurant.neighborhood} · {restaurant.price_level}
                </p>
                <ServiceBadges restaurant={restaurant} />
                {restaurant.blurb && <p className="blurb">{restaurant.blurb}</p>}
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
