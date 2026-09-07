import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getApprovedRestaurantsByCategory,
  getCategoryBySlug,
} from "@/lib/queries";

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
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-12">
      <Link
        href="/"
        className="text-sm text-neutral-500 hover:text-orange-600 dark:text-neutral-400 dark:hover:text-orange-400"
      >
        ← Volver a todas las categorías
      </Link>

      <div className="flex items-center gap-3">
        <span className="text-4xl" aria-hidden="true">
          {category.emoji}
        </span>
        <h1 className="text-3xl font-semibold text-neutral-900 dark:text-neutral-50">
          {category.label}
        </h1>
      </div>

      {restaurants.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-neutral-300 px-6 py-10 text-center text-neutral-500 dark:border-neutral-700 dark:text-neutral-400">
          Todavía no hay restaurantes publicados en {category.label}. Vuelve
          pronto.
        </p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {restaurants.map((restaurant) => (
            <li
              key={restaurant.id}
              className="rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900"
            >
              <p className="font-medium text-neutral-900 dark:text-neutral-50">
                {restaurant.name}
              </p>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                {restaurant.neighborhood} · {restaurant.price_level}
              </p>
              {restaurant.blurb && (
                <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">
                  {restaurant.blurb}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
