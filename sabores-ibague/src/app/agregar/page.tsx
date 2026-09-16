import Link from "next/link";
import { AddRestaurantForm } from "@/components/AddRestaurantForm";
import { getCategories } from "@/lib/queries";
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

      <p className="form-intro">
        ¿Tienes un restaurante, food truck, carrito o puesto de comida en
        Ibagué? Cuéntanos lo básico y lo revisamos para publicarlo. Gratis, y
        no necesitas crear una cuenta.
      </p>

      <AddRestaurantForm categories={categories} />
    </main>
  );
}
