import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GuideBlock } from "@/components/GuideText";
import { getCityBySlug } from "@/lib/cities";
import { GUIDES, getGuide } from "@/lib/guides";
import { SITE_URL } from "@/lib/site";

// Long-form guides (content in src/lib/guides.ts). Static content, so every
// guide is prerendered at build time.
export function generateStaticParams() {
  return GUIDES.map((g) => ({ ciudad: g.citySlug, slug: g.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ ciudad: string; slug: string }>;
}): Promise<Metadata> {
  const { ciudad, slug } = await params;
  const city = getCityBySlug(ciudad);
  const guide = city ? getGuide(city.slug, slug) : undefined;

  if (!city || !guide) {
    return { title: "Guía no encontrada — Colcocina" };
  }

  const url = `${SITE_URL}/${city.slug}/guias/${guide.slug}`;

  return {
    title: guide.metaTitle,
    description: guide.metaDescription,
    alternates: { canonical: url },
    openGraph: {
      title: guide.metaTitle,
      description: guide.metaDescription,
      url,
      siteName: "Colcocina",
      locale: "es_CO",
      type: "article",
    },
  };
}

export default async function GuidePage({
  params,
}: {
  params: Promise<{ ciudad: string; slug: string }>;
}) {
  const { ciudad, slug } = await params;
  const city = getCityBySlug(ciudad);
  const guide = city ? getGuide(city.slug, slug) : undefined;

  if (!city || !guide) {
    notFound();
  }

  // Same approach as the blog: Article schema without an invented
  // publish date.
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.metaDescription,
    author: { "@type": "Organization", name: "Colcocina" },
    publisher: { "@type": "Organization", name: "Colcocina" },
    mainEntityOfPage: `${SITE_URL}/${city.slug}/guias/${guide.slug}`,
  };

  return (
    <main className="wrap blog-page guide-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      <h1>{guide.title}</h1>

      {/* The keyword-rich opening paragraph comes first; the byline
          follows it rather than sitting between the H1 and the text. */}
      <GuideBlock text={guide.intro} />
      <p className="blog-byline">Escrito por el equipo de Colcocina</p>

      {guide.sections.map((section) => (
        <section key={section.heading}>
          <h2>{section.heading}</h2>
          {section.body.map((text, i) => (
            <GuideBlock key={i} text={text} />
          ))}
        </section>
      ))}

      <p className="guide-checked">
        Precios, horarios y formas de contacto según las fichas de cada
        restaurante en Colcocina ({guide.checkedOn}). Pueden cambiar:
        confirma con el lugar antes de ir.
      </p>

      <Link href={`/${city.slug}/guias`} className="back-link guide-back">
        ← Todas las guías de {city.name}
      </Link>
    </main>
  );
}
