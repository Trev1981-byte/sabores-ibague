import { redirect } from "next/navigation";
import { DEFAULT_CITY_SLUG } from "@/lib/cities";

// Restaurant pages now live under /[ciudad]/restaurante/[slug] (e.g.
// /ibague/restaurante/mi-perro-classic), so any old link to this city-less
// path still lands somewhere real instead of 404ing.
export default async function LegacyRestaurantRedirect({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  redirect(`/${DEFAULT_CITY_SLUG}/restaurante/${slug}`);
}
