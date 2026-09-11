import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getRestaurantBySlug, getMenuItemsByRestaurant } from "@/lib/queries";
import { getCityBySlug } from "@/lib/cities";
import { ShareButton } from "@/components/ShareButton";
import { ServiceBadges } from "@/components/ServiceBadges";
import { ContactButtons } from "@/components/ContactButtons";
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

  return (
    <main className="wrap">
      <Link href={`/${city.slug}`} className="back-link">
        ← Volver al inicio
      </Link>

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

      <ServiceBadges restaurant={restaurant} />

      <div className="restaurant-meta-list">
        <p>
          <b>Barrio:</b> {restaurant.neighborhood} · {restaurant.price_level}
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

      <div className="safety-note">
        <span className="safety-note-icon" aria-hidden="true">
          ⚠️
        </span>
        <p>
          Preferimos que pagues contra entrega, sobre todo la primera vez
          que le compras a este restaurante. Colcocina solo los
          conecta — el pedido y el pago se hacen directamente con ellos.{" "}
          <Link href="/seguridad">Más consejos de seguridad →</Link>
        </p>
      </div>

      <ContactButtons
        restaurantId={restaurant.id}
        callHref={callHref}
        whatsappHref={whatsappHref}
      />

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
    </main>
  );
}
