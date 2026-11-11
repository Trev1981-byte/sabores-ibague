import Link from "next/link";
import { AddRestaurantForm } from "@/components/AddRestaurantForm";
import { getApprovedRestaurantCount, getCategories } from "@/lib/queries";
import { getCityBySlug, DEFAULT_CITY_SLUG } from "@/lib/cities";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-dynamic";

// Previously this page had no metadata of its own, so it silently inherited
// the root layout's generic "Colcocina" title/description — and, more to
// the point, no canonical URL at all. Both are set explicitly here now.
export const metadata = {
  title: "Añade tu restaurante — Colcocina",
  description:
    "Publica gratis tu restaurante, food truck o puesto de comida en Colcocina, el directorio de comida de Ibagué.",
  alternates: {
    canonical: `${SITE_URL}/agregar`,
  },
};

export default async function AddRestaurantPage() {
  const categories = await getCategories();
  const cityName = getCityBySlug(DEFAULT_CITY_SLUG)?.name ?? "Ibagué";
  const restaurantCount = await getApprovedRestaurantCount(cityName);

  return (
    <main className="wrap form-page">
      <Link href="/" className="back-link">
        ← Volver al inicio
      </Link>

      <div className="detail-head">
        <span className="detail-emoji" aria-hidden="true">
          🏪
        </span>
        <h1>Añade tu restaurante</h1>
      </div>

      {/* Same promise the Meta ad makes, so people arriving from it see the
          message continue instead of a generic page. */}
      <p className="signup-lead">
        Recibe pedidos directo por WhatsApp. Sin comisiones.
      </p>
      {/* Audience hook for owners. GA4 showed ~2K active users for the last
          30 days (it rounds), so this is deliberately rounded DOWN. Check
          GA4 monthly and keep it true — never round up, and don't turn it
          into a claim about customers or orders. */}
      <p className="signup-reach">
        Más de 1.500 personas visitaron Colcocina el último mes para ver
        restaurantes de Ibagué.
      </p>

      <p className="form-intro">
        ¿Tienes un restaurante, food truck, carrito o puesto de comida en
        Ibagué? Cuéntanos lo básico y lo revisamos para publicarlo. Gratis, y
        no necesitas crear una cuenta.
      </p>

      {/* Sells the signup and sets expectations *before* the form — the
          form itself stays exactly as strict as it was (photo, menu,
          WhatsApp hint), because that strictness is what keeps new
          listings good. This only helps real owners decide to finish it
          and show up prepared. */}
      <section className="signup-pitch" aria-label="Qué incluye publicar tu restaurante">
        <h2>Qué incluye</h2>
        <ul>
          <li>Tu propia página en Colcocina, gratis, con foto, menú y precios.</li>
          <li>Quien vea tu página puede escribirte por WhatsApp o llamarte directo.</li>
          <li>
            Apareces en las categorías de {cityName} (Hamburguesas, Almuerzos,
            Tamales...) donde la gente busca dónde comer.
          </li>
          <li>Ves cuántas personas visitan tu página.</li>
        </ul>
        <h2>Ten a la mano</h2>
        <p>
          Una foto de tu local o de tu plato estrella, tu número de WhatsApp y
          tus platos principales con su precio (mejor si son 3 o más). Toma
          unos 5 minutos.
        </p>
        {restaurantCount > 0 && (
          <p className="signup-pitch-count">
            Ya hay {restaurantCount} restaurantes en Colcocina.
          </p>
        )}
      </section>

      <AddRestaurantForm categories={categories} />
    </main>
  );
}
