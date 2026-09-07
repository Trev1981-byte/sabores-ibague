import { CategoryGrid } from "@/components/CategoryGrid";
import { getApprovedRestaurantCount, getCategories } from "@/lib/queries";

export default async function Home() {
  const [categories, restaurantCount] = await Promise.all([
    getCategories(),
    getApprovedRestaurantCount(),
  ]);

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col items-center gap-8 px-4 py-12 text-center sm:py-16">
      <div className="flex flex-col items-center gap-3">
        <h1 className="text-4xl font-semibold text-neutral-900 sm:text-5xl dark:text-neutral-50">
          Sabores de Ibagué
        </h1>
        <p className="max-w-md text-neutral-600 dark:text-neutral-400">
          Descubre restaurantes, cafés y puestos de comida en Ibagué, Tolima —
          por categoría.
        </p>
      </div>

      <div className="w-full max-w-lg">
        <CategoryGrid categories={categories} />
      </div>

      {restaurantCount === 0 && (
        <p className="max-w-md text-sm text-neutral-500 dark:text-neutral-400">
          Todavía no hay restaurantes publicados — estamos empezando. Muy
          pronto podrás explorarlos por categoría desde aquí.
        </p>
      )}
    </main>
  );
}
