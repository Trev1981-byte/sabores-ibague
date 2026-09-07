import { CategoryGrid } from "@/components/CategoryGrid";
import { getApprovedRestaurantCount, getCategories } from "@/lib/queries";

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
