import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { CITIES } from "@/lib/cities";
import { getCategories, getApprovedRestaurantSlugs } from "@/lib/queries";

// Generates /sitemap.xml automatically — Next.js's built-in convention for
// this file. Lists every real page Google should know about: each city's
// home page, its category pages, and every approved restaurant's page, plus
// the handful of static pages. Rebuilds itself from Supabase on request, so
// a newly-approved restaurant shows up here without a code deploy.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const categories = await getCategories();

  const entries: MetadataRoute.Sitemap = [
    { url: SITE_URL },
    { url: `${SITE_URL}/agregar` },
    { url: `${SITE_URL}/seguridad` },
    { url: `${SITE_URL}/terminos` },
    { url: `${SITE_URL}/privacidad` },
  ];

  for (const city of CITIES) {
    entries.push({ url: `${SITE_URL}/${city.slug}` });

    for (const category of categories) {
      entries.push({ url: `${SITE_URL}/${city.slug}/categoria/${category.slug}` });
    }

    const slugs = await getApprovedRestaurantSlugs(city.name);
    for (const slug of slugs) {
      entries.push({ url: `${SITE_URL}/${city.slug}/restaurante/${slug}` });
    }
  }

  return entries;
}
