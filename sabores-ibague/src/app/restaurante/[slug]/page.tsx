import Link from "next/link";
import { notFound } from "next/navigation";
import { getRestaurantBySlug, getMenuItemsByRestaurant } from "@/lib/queries";

// Same reasoning as the other data-backed pages: never freeze this at
// build time, since a restaurant's menu can change any time in Supabase.
export const dynamic = "force-dynamic";

const pesos = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

export default async function RestaurantPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const restaurant = await getRestaurantBySlug(slug);

  if (!restaurant) {
    notFound();
  }

  const menuItems = await getMenuItemsByRestaurant(restaurant.id);
  const whatsappHref = `https://wa.me/57${restaurant.whatsapp_number.replace(/\D/g, "")}`;

  return (
    <main className="wrap">
      <Link href="/" className="back-link">
        ← Volver al inicio
      </Link>

      <div className="detail-head">
        <h1>{restaurant.name}</h1>
      </div>

      <div className="restaurant-meta-list">
        <p>
          <b>Barrio:</b> {restaurant.neighborhood} · {restaurant.price_level}
        </p>
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

      
        className="whatsapp-btn"
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
      >
        Escribir por WhatsApp
      </a>

      <h2 className="manage-section-title">Menú</h2>
      {menuItems.length === 0 ? (
        <p className="menu-empty">Este restaurante todavía no publicó su menú.</p>
      ) : (
        <ul className="menu-public-list">
          {menuItems.map((item) => (
            <li className="menu-public-item" key={item.id}>
              <span className="name">{item.name}</span>
              <span className="price">
                {item.price !== null ? pesos.format(item.price) : ""}
              </span>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
