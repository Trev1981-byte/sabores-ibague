import { notFound, redirect } from "next/navigation";
import { getRandomApprovedRestaurant } from "@/lib/queries";
import { getCityBySlug } from "@/lib/cities";

// Never cache this — the whole point is a fresh pick every time someone
// lands here, not the same restaurant shown to everyone who clicks the
// button in a given window.
export const dynamic = "force-dynamic";

export default async function SorpresaPage({
  params,
}: {
  params: Promise<{ ciudad: string }>;
}) {
  const { ciudad } = await params;
  const city = getCityBySlug(ciudad);

  if (!city) {
    notFound();
  }

  const pick = await getRandomApprovedRestaurant(city.name);

  // No restaurants published yet for this city — send them back to the
  // category grid instead of a dead page.
  if (!pick) {
    redirect(`/${city.slug}`);
  }

  redirect(`/${city.slug}/restaurante/${pick.slug}`);
}
