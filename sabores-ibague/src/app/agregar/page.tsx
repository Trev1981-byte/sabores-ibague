import Link from "next/link";
import { AddRestaurantForm } from "@/components/AddRestaurantForm";
import { getCategories } from "@/lib/queries";

export const dynamic = "force-dynamic";

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
        Sin complicaciones: cuéntanos lo básico y lo revisamos para
        publicarlo. Gratis, y no necesitas crear una cuenta.
      </p>

      <AddRestaurantForm categories={categories} />
    </main>
  );
}
