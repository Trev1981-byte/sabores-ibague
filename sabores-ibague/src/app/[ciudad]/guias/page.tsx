import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CITIES, getCityBySlug } from "@/lib/cities";
import { getGuidesForCity } from "@/lib/guides";
import { SITE_URL } from "@/lib/site";

// Index of every guide for a city — linked from the site footer so the
// guides are never orphaned. A city with no guides yet has no index page.
export function generateStaticParams() {
  return CITIES.filter((c) => getGuidesForCity(c.slug).length > 0).map((c) => ({
    ciudad: c.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ ciudad: string }>;
}): Promise<Metadata> {
  const { ciudad } = await params;
  const city = getCityBySlug(ciudad);

  if (!city || getGuidesForCity(city.slug).length === 0) {
    return { title: "Guías no encontradas — Colcocina" };
  }

  const title = `Guías para comer en ${city.name} | Colcocina`;
  const description = `Dónde comer barato, qué está abierto de noche, comida típica, planes de fin de semana y más: guías prácticas para comer en ${city.name}.`;
  const url = `${SITE_URL}/${city.slug}/guias`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, siteName: "Colcocina", locale: "es_CO", type: "website" },
  };
}

export default async function GuidesIndexPage({
  params,
}: {
  params: Promise<{ ciudad: string }>;
}) {
  const { ciudad } = await params;
  const city = getCityBySlug(ciudad);
  const guides = city ? getGuidesForCity(city.slug) : [];

  if (!city || guides.length === 0) {
    notFound();
  }

  return (
    <main className="wrap blog-page guide-index">
      <h1>Guías para comer en {city.name}</h1>
      <p>
        Guías prácticas escritas a partir de los restaurantes reales del
        directorio: dónde comer barato, qué sigue abierto de noche, qué probar
        de la cocina tolimense y cómo armar un buen fin de semana en{" "}
        {city.name}. Si prefieres explorar por tu cuenta, en la{" "}
        <Link href={`/${city.slug}`}>página principal</Link> están todas las
        categorías.
      </p>

      <ul className="guide-list">
        {guides.map((guide) => (
          <li key={guide.slug} className="guide-card">
            <h2>
              <Link href={`/${city.slug}/guias/${guide.slug}`}>{guide.title}</Link>
            </h2>
            <p>{guide.summary}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
