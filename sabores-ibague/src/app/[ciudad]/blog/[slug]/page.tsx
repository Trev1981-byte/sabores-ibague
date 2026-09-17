import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBlogPostBySlug } from "@/lib/blog";
import { getCityBySlug } from "@/lib/cities";
import { priceLevelBadge } from "@/lib/queries";
import { SITE_URL } from "@/lib/site";

// SEO articles, one per category, aimed at ranking in the SERPs for
// long-tail searches ("almuerzo ejecutivo económico en Ibagué" and
// similar) rather than at on-site browsing — see src/lib/blog.ts for the
// content itself and the reasoning behind each pick.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ ciudad: string; slug: string }>;
}): Promise<Metadata> {
  const { ciudad, slug } = await params;
  const city = getCityBySlug(ciudad);
  const post = city ? getBlogPostBySlug(city.slug, slug) : undefined;

  if (!city || !post) {
    return { title: "Artículo no encontrado — Colcocina" };
  }

  const url = `${SITE_URL}/${city.slug}/blog/${post.slug}`;

  return {
    title: post.metaTitle,
    description: post.metaDescription,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: post.metaTitle,
      description: post.metaDescription,
      url,
      siteName: "Colcocina",
      locale: "es_CO",
      type: "article",
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ ciudad: string; slug: string }>;
}) {
  const { ciudad, slug } = await params;
  const city = getCityBySlug(ciudad);
  const post = city ? getBlogPostBySlug(city.slug, slug) : undefined;

  if (!city || !post) {
    notFound();
  }

  // Article schema instead of a fake publish date — we'd rather leave
  // dates out than invent one just to satisfy the schema.
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.metaDescription,
    author: { "@type": "Organization", name: "Colcocina" },
    publisher: { "@type": "Organization", name: "Colcocina" },
    mainEntityOfPage: `${SITE_URL}/${city.slug}/blog/${post.slug}`,
  };

  return (
    <main className="wrap blog-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      <Link href={`/${city.slug}/categoria/${post.categorySlug}`} className="back-link">
        ← Volver a {post.categoryLabel}
      </Link>

      <h1>{post.title}</h1>
      <p className="blog-byline">Escrito por el equipo de Colcocina.</p>

      {/* Internal link to the category page right in the opening
          paragraph, as close to the top as the content allows. */}
      <p>
        {post.introBefore}
        <Link href={`/${city.slug}/categoria/${post.categorySlug}`}>
          {post.introLinkText}
        </Link>
        {post.introAfter}
      </p>

      <div className="blog-disclosure">
        Estas son las opciones aprobadas en el directorio de Colcocina para
        esta categoría. Ningún restaurante paga por aparecer aquí ni por
        salir mejor calificado — así que lo que ves es lo que hay, no un
        ranking patrocinado.
      </div>

      <div className="blog-picks">
        {post.picks.map((pick) => (
          <div className="blog-pick" key={pick.slug}>
            <div className="blog-pick-head">
              <span className="blog-pick-name">{pick.name}</span>
              <span className="blog-pick-meta">
                {pick.neighborhood} · {priceLevelBadge(pick.priceLevel)}
              </span>
            </div>
            <p className="blog-pick-note">{pick.note}</p>
            <Link href={`/${city.slug}/restaurante/${pick.slug}`} className="blog-pick-link">
              Ver ficha completa →
            </Link>
          </div>
        ))}
      </div>

      <div className="blog-closing">
        <p>
          ¿Conoces un negocio de {post.categoryLabel.toLowerCase()} en{" "}
          {city.name} que debería estar en esta lista?{" "}
          <Link href="/agregar">Puedes agregarlo gratis</Link>.
        </p>
        <p>
          También puedes ver{" "}
          <Link href={`/${city.slug}`}>todos los restaurantes de {city.name}</Link>{" "}
          o volver al{" "}
          <Link href={`/${city.slug}/categoria/${post.categorySlug}`}>
            directorio de {post.categoryLabel.toLowerCase()}
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
