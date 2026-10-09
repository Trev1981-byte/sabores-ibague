import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CategoryGrid } from "@/components/CategoryGrid";
import {
  getApprovedRestaurantCount,
  getApprovedRestaurantsForSearch,
  getCategories,
  getMenuItemsForSearch,
} from "@/lib/queries";
import { getCityBySlug } from "@/lib/cities";
import { getCityHomeContent } from "@/lib/cityHome";
import { SITE_URL } from "@/lib/site";

// Always fetch fresh from Supabase on every visit instead of freezing the
// category/restaurant list at build time — otherwise anything added or
// changed directly in the Supabase dashboard would never show up on the
// live site until the next code deploy.
export const dynamic = "force-dynamic";

// The bare site root ("/") just redirects here, and this page had no
// title/description of its own — so every search result for the site
// showed nothing but the generic "Colcocina" brand name, with no mention
// of what it is or where. This gives the actual home page (and therefore
// what Google shows for the whole domain) a real, specific title.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ ciudad: string }>;
}): Promise<Metadata> {
  const { ciudad } = await params;
  const city = getCityBySlug(ciudad);

  if (!city) {
    return { title: "Ciudad no encontrada — Colcocina" };
  }

  const restaurantCount = await getApprovedRestaurantCount(city.name);
  const title = `Restaurantes y comida en ${city.name} — Colcocina`;
  const description =
    restaurantCount > 0
      ? `${restaurantCount} restaurantes, cafés y puestos de comida verificados en ${city.name}: teléfono, WhatsApp, menú y ubicación — gratis.`
      : `Descubre los mejores restaurantes, cafés y puestos de comida en ${city.name} — teléfono, WhatsApp y menú.`;
  const url = `${SITE_URL}/${city.slug}`;

  return {
    title,
    description,
    // Tells Google this exact URL is the authoritative version of this
    // page. Without it, the same content reachable at a www/http variant
    // or Vercel's own project domain reads as an unresolved duplicate
    // ("Duplicate without user-selected canonical" in Search Console)
    // instead of pointing back here.
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "Colcocina",
      locale: "es_CO",
      type: "website",
    },
  };
}

export default async function CityHome({
  params,
}: {
  params: Promise<{ ciudad: string }>;
}) {
  const { ciudad } = await params;
  const city = getCityBySlug(ciudad);

  if (!city) {
    notFound();
  }

  const [categories, restaurantCount, restaurants, menuItems] = await Promise.all([
    getCategories(),
    getApprovedRestaurantCount(city.name),
    getApprovedRestaurantsForSearch(city.name),
    getMenuItemsForSearch(city.name),
  ]);

  // Hand-written copy for this city, if any (src/lib/cityHome.ts). A city
  // without its own gets a generic hero and skips the intro and FAQ.
  const content = getCityHomeContent(city.slug);
  const heroTitle = content?.h1 ?? `Restaurantes en ${city.name}`;
  const heroLede =
    content?.lede ??
    `Tamales, salchipapas, almuerzos corrientes, la parrilla del barrio — encuentra dónde comer en ${city.name}, por categoría.`;

  // FAQPage structured data, built from the same list the visible FAQ
  // renders, so Google only ever sees questions that are on the page.
  const faqJsonLd = content && {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: content.faq.items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <>
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}

      <CategoryGrid
        categories={categories}
        restaurantCount={restaurantCount}
        citySlug={city.slug}
        restaurants={restaurants}
        menuItems={menuItems}
        heroTitle={heroTitle}
        heroLede={heroLede}
      >
        {content && (
          <>
            <section className="wrap home-copy" aria-labelledby="home-about-title">
              <h2 id="home-about-title">{content.about.heading}</h2>
              <p>{content.about.paragraph}</p>
            </section>

            <section className="wrap home-copy home-faq" aria-labelledby="home-faq-title">
              <h2 id="home-faq-title">{content.faq.heading}</h2>
              {content.faq.items.map((item) => (
                <div className="faq-item" key={item.question}>
                  <h3>{item.question}</h3>
                  <p>{item.answer}</p>
                </div>
              ))}
            </section>
          </>
        )}
      </CategoryGrid>

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
              ¿Tienes una fonda o un restaurante en {city.name}? Añádelo tú
              mismo, sin complicaciones — es gratis.
            </p>
            <Link href="/agregar" className="strip-cta">
              Añadir mi restaurante →
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
