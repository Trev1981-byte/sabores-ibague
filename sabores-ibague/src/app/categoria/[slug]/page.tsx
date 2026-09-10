import { redirect } from "next/navigation";
import { DEFAULT_CITY_SLUG } from "@/lib/cities";

// Category pages now live under /[ciudad]/categoria/[slug] (e.g.
// /ibague/categoria/hamburguesas), so any old link to this city-less path
// still lands somewhere real instead of 404ing.
export default async function LegacyCategoryRedirect({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  redirect(`/${DEFAULT_CITY_SLUG}/categoria/${slug}`);
}
