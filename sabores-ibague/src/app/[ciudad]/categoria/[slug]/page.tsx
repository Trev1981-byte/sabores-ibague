import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { after } from "next/server";
import {
  getApprovedRestaurantsByCategory,
  getCategoryBySlug,
  logRestaurantImpressions,
  priceLevelBadge,
} from "@/lib/queries";
import { getCityBySlug } from "@/lib/cities";
import { ServiceBadges } from "@/components/ServiceBadges";
import { LikeButton } from "@/components/LikeButton";
import { SITE_URL } from "@/lib/site";

// Same reasoning as the home page: always ask Supabase fresh, never freeze
// this page's data at build time.
export const dynamic = "force-dynamic";

// How long a restaurant keeps its "Nuevo" badge after being added — long
// enough to actually be seen by returning visitors, short enough that the
// badge still means something instead of sitting on half the category
// forever.
const NEW_BADGE_DAYS = 30;

function isNewListing(createdAt: string): boolean {
  const ageMs = Date.now() - new Date(createdAt).getTime();
  return ageMs < NEW_BADGE_DAYS * 24 * 60 * 60 * 1000;
}

// Every category used to inherit the site-wide "Colcocina" title, which
// meant a search for "hamburguesas Ibagué" had nothing on the page itself
// to match against. Each category now gets its own title and description,
// built from real data (the category name and how many places are on it)
// instead of generic filler.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ ciudad: string; slug: string }>;
}): Promise<Metadata> {
  const { ciudad, slug } = await params;
  const city = getCityBySlug(ciudad);
  const category = await getCategoryBySlug(slug);

  if (!city || !category) {
    return { title: "Categoría no encontrada — Colcocina" };
  }

  const restaurants = await getApprovedRestaurantsByCategory(category.id, city.name);
  const count = restaurants.length;
  const categoryLower = category.label.toLowerCase();

  const title = `${category.label} en ${city.name} — Colcocina`;
  const description =
    count > 0
      ? `${count} ${count === 1 ? "lugar verificado" : "lugares verificados"} de ${categoryLower} en ${city.name}: teléfono, WhatsApp y menú, todo en un solo lugar.`
      : `Descubre los mejores lugares de ${categoryLower} en ${city.name} — teléfono, WhatsApp y menú.`;
  const url = `${SITE_URL}/${city.slug}/categoria/${category.slug}`;

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

  // Every restaurant card shown here counts as one "impression" for that
  // restaurant — scheduled with after() so it runs once the page has
  // already been sent to the visitor, instead of adding a database
  // round-trip to the page they're waiting on.
  after(() => logRestaurantImpressions(restaurants.map((restaurant) => restaurant.id)));

  // Tells Google this page is a list of specific, named places — not just
  // a pile of cards and photos. Only listed restaurants go in here; no
  // ratings or hours are claimed, since that data isn't something we
  // reliably have for every listing yet.
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${category.label} en ${city.name}`,
    itemListElement: restaurants.map((restaurant, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${SITE_URL}/${city.slug}/restaurante/${restaurant.slug}`,
      name: restaurant.name,
    })),
  };

  return (
    <main className="wrap">
      {restaurants.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
        />
      )}

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
            <div className="restaurant-card" key={restaurant.id}>
              <Link href={`/${city.slug}/restaurante/${restaurant.slug}`} className="restaurant-card-link">
                {restaurant.photo_url ? (
                  <img
                    src={restaurant.photo_url}
                    alt={restaurant.name}
                    className="restaurant-card-photo"
                  />
                ) : (
                  <div className="restaurant-card-photo restaurant-card-photo-empty" aria-hidden="true">
                    🍽️
                  </div>
                )}
                <div className="restaurant-card-body">
                  <p className="name">{restaurant.name}</p>
                  <p className="meta">{restaurant.neighborhood}</p>
                  <div className="price-row">
                    <span className="price-badge">{priceLevelBadge(restaurant.price_level)}</span>
                  </div>
                  <ServiceBadges restaurant={restaurant} />
                  {restaurant.blurb && <p className="blurb">{restaurant.blurb}</p>}
                </div>
              </Link>
              {isNewListing(restaurant.created_at) && (
                <span className="new-badge">Nuevo</span>
              )}
              <LikeButton restaurantId={restaurant.id} />
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
