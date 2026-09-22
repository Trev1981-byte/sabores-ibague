import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { after } from "next/server";
import {
  getRestaurantBySlug,
  getMenuItemsByRestaurant,
  getRestaurantCategories,
  getRestaurantNeighborsInCategory,
  logRestaurantView,
  priceLevelBadge,
} from "@/lib/queries";
import { getCityBySlug } from "@/lib/cities";
import { ShareButton } from "@/components/ShareButton";
import { ServiceBadges } from "@/components/ServiceBadges";
import { ContactButtons } from "@/components/ContactButtons";
import { BackLink } from "@/components/BackLink";
import { SITE_URL } from "@/lib/site";

// Same reasoning as the other data-backed pages: never freeze this at
// build time, since a restaurant's menu can change any time in Supabase.
export const dynamic = "force-dynamic";

const pesos = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

// Runs alongside the page itself, so a link pasted into WhatsApp or
// Instagram shows this restaurant's own name, photo and description
// instead of a bare, generic link.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ ciudad: string; slug: string }>;
}): Promise<Metadata> {
  const { ciudad, slug } = await params;
  const city = getCityBySlug(ciudad);

  if (!city) {
    return { title: "Restaurante no encontrado — Colcocina" };
  }

  const restaurant = await getRestaurantBySlug(slug, city.name);

  if (!restaurant) {
    return { title: "Restaurante no encontrado — Colcocina" };
  }

  const description =
    restaurant.blurb ||
    `${restaurant.neighborhood} · ${restaurant.price_level} — en Colcocina.`;
  const url = `${SITE_URL}/${city.slug}/restaurante/${restaurant.slug}`;

  return {
    title: `${restaurant.name} — Colcocina`,
    description,
    // Same reasoning as the other data-backed pages' canonical: declares
    // this URL as the authoritative one for this restaurant's page.
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: restaurant.name,
      description,
      url,
      siteName: "Colcocina",
      locale: "es_CO",
      type: "website",
      images: restaurant.photo_url ? [{ url: restaurant.photo_url }] : undefined,
    },
  };
}

export default async function RestaurantPage({
  params,
}: {
  params: Promise<{ ciudad: string; slug: string }>;
}) {
  const { ciudad, slug } = await params;
  const city = getCityBySlug(ciudad);

  if (!city) {
    notFound();
  }

  const restaurant = await getRestaurantBySlug(slug, city.name);

  if (!restaurant) {
    notFound();
  }

  const menuItems = await getMenuItemsByRestaurant(restaurant.id);

  // A restaurant can sit in more than one category (an asadero selling
  // both pollo and parrilla, say) — the first one, in the same order the
  // home page lists categories, is treated as "primary" for the
  // prev/next pair at the bottom of the page.
  const categories = await getRestaurantCategories(restaurant.id);
  const primaryCategory = categories[0] ?? null;
  const neighbors = primaryCategory
    ? await getRestaurantNeighborsInCategory(primaryCategory.id, city.name, restaurant.slug)
    : { prev: null, next: null };

  // One "profile view" for this load — scheduled with after() so it runs
  // once the page has already been sent, instead of adding a database
  // round-trip in front of the page the visitor is waiting on.
  after(() => logRestaurantView(restaurant.id));

  // Every restaurant has a phone number — that one's required at signup, so
  // the call button always shows. WhatsApp is optional on top of that, and
  // only shows when the restaurant actually has one.
  const callHref = `tel:${restaurant.phone_number.replace(/\D/g, "")}`;
  // Pre-fills the chat with a line identifying Colcocina as the source —
  // generic enough to fit any kind of inquiry (not just orders), and the
  // bare domain text auto-links once WhatsApp sends it.
  const whatsappHref = restaurant.whatsapp_number
    ? `https://wa.me/57${restaurant.whatsapp_number.replace(/\D/g, "")}?text=${encodeURIComponent(
        "Hola, te escribo desde Colcocina.com 👋\n\n"
      )}`
    : null;

  // Structured data so Google can understand this as an actual place, not
  // just a page of text — name, address, phone, price tier. Deliberately
  // leaves out things like opening hours or a rating: hours_text is
  // free-form Spanish ("Lunes a sábado, 8am–3pm"), not the strict format
  // schema.org expects, and there's no real rating data yet — claiming
  // either would risk a Search Console error instead of helping.
  const restaurantJsonLd = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: restaurant.name,
    url: `${SITE_URL}/${city.slug}/restaurante/${restaurant.slug}`,
    ...(restaurant.photo_url ? { image: restaurant.photo_url } : {}),
    telephone: restaurant.phone_number,
    priceRange: restaurant.price_level,
    address: {
      "@type": "PostalAddress",
      streetAddress: restaurant.address || restaurant.neighborhood,
      addressLocality: city.name,
      addressRegion: city.department,
      addressCountry: "CO",
    },
    ...(primaryCategory ? { servesCuisine: primaryCategory.label } : {}),
  };

  return (
    <main className="wrap">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(restaurantJsonLd) }}
      />
      <BackLink fallbackHref={`/${city.slug}`} label="← Volver" />

      {restaurant.photo_url && (
        <img src={restaurant.photo_url} alt={restaurant.name} className="restaurant-cover" />
      )}

      <div className="restaurant-head">
        <h1>{restaurant.name}</h1>
        <ShareButton
          name={restaurant.name}
          url={`${SITE_URL}/${city.slug}/restaurante/${restaurant.slug}`}
        />
      </div>

      <div className="price-row">
        <span className="price-badge">{priceLevelBadge(restaurant.price_level)}</span>
      </div>
      <ServiceBadges restaurant={restaurant} />

      {/* Contact moved up here (above the address/hours/blurb block) so a
          visitor doesn't have to scroll past all of that to find how to
          reach the restaurant — this is the page's main job. */}
      <div className="safety-note">
        <span className="safety-note-icon" aria-hidden="true">
          ⚠️
        </span>
        <p>
          Preferimos que no pagues ni transfieras dinero por adelantado,
          sobre todo la primera vez que le compras a este restaurante — paga
          en persona, ya sea al recibir tu pedido o directamente en el
          restaurante. Colcocina solo los conecta — el pedido y el pago se
          hacen directamente con ellos.{" "}
          <Link href="/seguridad">Más consejos de seguridad →</Link>
        </p>
      </div>

      <ContactButtons
        restaurantId={restaurant.id}
        callHref={callHref}
        whatsappHref={whatsappHref}
      />

      <div className="restaurant-meta-list">
        <p>
          <b>Barrio:</b> {restaurant.neighborhood}
        </p>
        {restaurant.address && (
          <p>
            <b>Dirección:</b> {restaurant.address}
          </p>
        )}
        {restaurant.hours_text && (
          <p>
            <b>Horario:</b> {restaurant.hours_text}
          </p>
        )}
        {restaurant.maps_link && (
          <p>
            <a href={restaurant.maps_link} target="_blank" rel="noopener noreferrer">
              Ver ubicación en Google Maps →
            </a>
          </p>
        )}
        {restaurant.blurb && <p>{restaurant.blurb}</p>}
      </div>

      <h2 className="manage-section-title">Menú</h2>
      {menuItems.length === 0 ? (
        <p className="menu-empty">Este restaurante todavía no publicó su menú.</p>
      ) : (
        <div className="menu-public-grid">
          {menuItems.map((item) => (
            <div className="menu-public-card" key={item.id}>
              {item.photo_url && (
                <img
                  src={item.photo_url}
                  alt={item.name}
                  className="menu-public-card-photo"
                />
              )}
              <div className="menu-public-card-body">
                <span className="menu-public-card-name">{item.name}</span>
                <span className="menu-public-card-price">
                  {item.price !== null ? pesos.format(item.price) : ""}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {primaryCategory && (neighbors.prev || neighbors.next) && (
        <nav className="restaurant-pager" aria-label="Más restaurantes en esta categoría">
          <Link
            href={`/${city.slug}/categoria/${primaryCategory.slug}`}
            className="restaurant-pager-category"
          >
            Más en {primaryCategory.emoji} {primaryCategory.label} →
          </Link>
          <div className="restaurant-pager-row">
            {neighbors.prev ? (
              <Link
                href={`/${city.slug}/restaurante/${neighbors.prev.slug}`}
                className="restaurant-pager-link restaurant-pager-prev"
              >
                <span className="restaurant-pager-dir">← Anterior</span>
                <span className="restaurant-pager-name">{neighbors.prev.name}</span>
              </Link>
            ) : (
              <span />
            )}
            {neighbors.next ? (
              <Link
                href={`/${city.slug}/restaurante/${neighbors.next.slug}`}
                className="restaurant-pager-link restaurant-pager-next"
              >
                <span className="restaurant-pager-dir">Siguiente →</span>
                <span className="restaurant-pager-name">{neighbors.next.name}</span>
              </Link>
            ) : (
              <span />
            )}
          </div>
        </nav>
      )}
    </main>
  );
}
