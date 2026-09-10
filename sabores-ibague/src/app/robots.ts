import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// Generates /robots.txt automatically — Next.js's built-in convention.
// Everything public is fair game for search engines; the two private,
// token-gated pages (a vendor's own menu editor, the admin review queue)
// are asked not to be crawled or indexed, even though search engines could
// never guess their exact URLs anyway.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/mi-restaurante/", "/revisar-326645e0"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
