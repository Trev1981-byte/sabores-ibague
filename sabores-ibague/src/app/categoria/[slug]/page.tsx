import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getApprovedRestaurantsByCategory,
  getCategoryBySlug,
} from "@/lib/queries";

// Same reasoning as the home page: always ask Supabase fresh, never freeze
// this page's data at build time.
export const dynamic = "force-dynamic";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const restaurants = await getApprovedRestaurantsByCategory(category.id);

  return (
    <main className="wrap">
      <Link href="/" className="back-link">
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
            <div className="restaurant-card" key={restaurant.id}>
              <p className="name">{restaurant.name}</p>
              <p className="meta">
                {restaurant.neighborhood} · {restaurant.price_level}
              </p>
              {restaurant.blurb && <p className="blurb">{restaurant.blurb}</p>}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
