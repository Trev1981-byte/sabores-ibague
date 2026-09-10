"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Category } from "@/lib/queries";
import { CategoryIcon } from "@/components/CategoryIcon";

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, ""); // strip accents so "arepa" matches "Arepas"
}

export function CategoryGrid({
  categories,
  restaurantCount,
  citySlug,
  cityName,
}: {
  categories: Category[];
  restaurantCount: number;
  citySlug: string;
  cityName: string;
}) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = normalize(query.trim());
    if (!q) return categories;
    return categories.filter((c) => normalize(c.label).includes(q));
  }, [categories, query]);

  return (
    <>
      <header className="hero">
        <div className="hero-glow" aria-hidden="true"></div>
        <div className="wrap hero-inner">
          <span className="eyebrow">Recién empezando en {cityName}</span>
          <h1>¿Qué se te antoja&nbsp;hoy?</h1>
          <p className="lede">
            Tamales, salchipapas, almuerzos corrientes, la parrilla del
            barrio — encuentra dónde comer en {cityName}, por categoría.
          </p>

          <form
            className="search-board"
            role="search"
            onSubmit={(e) => e.preventDefault()}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
              <path d="M21 21l-4.3-4.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <label htmlFor="category-search" className="sr-only">
              Buscar por categoría
            </label>
            <input
              id="category-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar: hamburguesas, arepas, tamales..."
              autoComplete="off"
            />
            <button type="button">Buscar</button>
          </form>

          <p className="hero-tags">
            <span>
              <b>{categories.length}</b> categorías
            </span>
          </p>
        </div>
      </header>

      <div className="fringe" aria-hidden="true">
        <svg viewBox="0 0 200 22" preserveAspectRatio="none">
          <path d="M0,0 H200 V10 C195,10 190,22 185,22 C180,22 178,10 175,10 C170,10 168,22 163,22 C158,22 156,10 151,10 C146,10 144,22 139,22 C134,22 132,10 127,10 C122,10 120,22 115,22 C110,22 108,10 103,10 C98,10 96,22 91,22 C86,22 84,10 79,10 C74,10 72,22 67,22 C62,22 60,10 55,10 C50,10 48,22 43,22 C38,22 36,10 31,10 C26,10 24,22 19,22 C14,22 12,10 7,10 C4,10 2,10 0,10 Z" />
        </svg>
      </div>

      <main>
        <div className="wrap section">
          <div className="section-head">
            <div>
              <h2>Explora por categoría</h2>
              <p>Cada fonda y restaurante puede aparecer en más de una.</p>
            </div>
            <span className="count-pill">
              {query.trim()
                ? `${filtered.length} de ${categories.length} categorías`
                : `${categories.length} categorías`}
            </span>
          </div>

          {filtered.length === 0 ? (
            <p className="no-match">
              No hay categorías que coincidan con &ldquo;{query}&rdquo;.
            </p>
          ) : (
            <div className="cat-grid">
              {filtered.map((category) => (
                <Link
                  key={category.id}
                  className="cat-tile"
                  href={`/${citySlug}/categoria/${category.slug}`}
                >
                  <CategoryIcon
                    category={category}
                    iconClassName="cat-icon"
                    emojiClassName="cat-emoji"
                  />
                  <span className="cat-label">{category.label}</span>
                </Link>
              ))}
            </div>
          )}

          {restaurantCount === 0 && (
            <p className="empty-note">
              Todavía no hay restaurantes publicados — estamos empezando. Muy
              pronto podrás explorarlos por categoría desde aquí.
            </p>
          )}
        </div>
      </main>
    </>
  );
}
