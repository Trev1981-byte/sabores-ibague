import { CategoryGrid } from "@/components/CategoryGrid";
import { getApprovedRestaurantCount, getCategories } from "@/lib/queries";

// Always fetch fresh from Supabase on every visit instead of freezing the
// category/restaurant list at build time — otherwise anything added or
// changed directly in the Supabase dashboard would never show up on the
// live site until the next code deploy.
export const dynamic = "force-dynamic";

export default async function Home() {
  const [categories, restaurantCount] = await Promise.all([
    getCategories(),
    getApprovedRestaurantCount(),
  ]);

  return (
    <>
      <CategoryGrid categories={categories} restaurantCount={restaurantCount} />

      <div className="strip">
        <div className="wrap strip-grid">
          <div className="strip-card">
            <h3>
              <span className="tag">Para comer</span>
            </h3>
            <p>
              Busca por lo que se te antoja y encuentra el puesto o
              restaurante más cercano en tu barrio.
            </p>
          </div>
          <div className="strip-card">
            <h3>
              <span className="tag">Para vender</span>
            </h3>
            <p>
              ¿Tienes una fonda o un restaurante en Ibagué? Muy pronto podrás
              añadirlo tú mismo, sin complicaciones.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
