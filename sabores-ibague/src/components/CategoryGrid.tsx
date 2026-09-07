"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Category } from "@/lib/queries";

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, ""); // strip accents so "arepa" matches "Arepas"
}

// The stored emoji for tamales (🫔) is the Mexican-style husk-wrapped
// tamale — pointed at both ends. A Colombian tamal is round, wrapped in
// banana leaf and tied off with a knot at the top, so it gets a small
// hand-drawn icon here instead of the emoji from the database.
function TamalIcon() {
  return (
    <svg className="cat-icon" viewBox="0 0 32 32" aria-hidden="true">
      <circle cx="16" cy="19" r="9.5" fill="var(--tamal-leaf)" />
      <path
        d="M12.2 9.6c0-2.4 1.7-4.1 3.8-4.1s3.8 1.7 3.8 4.1c0 2.1-1.7 3.4-3.8 3.4s-3.8-1.3-3.8-3.4z"
        fill="var(--tamal-leaf)"
      />
      <path
        d="M14.6 5.6c.5-.9 1.4-1.4 1.4-1.4s.9.5 1.4 1.4"
        fill="none"
        stroke="var(--tamal-tie)"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <path
        d="M7.3 16.6c3-1.1 14.4-1.1 17.4 0M7 20.8c3.2-1.2 14.8-1.2 18 0M8.4 24.7c2.6-1 12.2-1 14.8 0"
        fill="none"
        stroke="var(--tamal-leaf-deep)"
        strokeWidth="1.1"
        strokeLinecap="round"
        opacity="0.55"
      />
    </svg>
  );
}

export function CategoryGrid({
  categories,
  restaurantCount,
}: {
  categories: Category[];
  restaurantCount: number;
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
          <span className="eyebrow">Recién empezando en Ibagué</span>
          <h1>¿Qué se te antoja&nbsp;hoy?</h1>
          <p className="lede">
            Tamales, salchipapas, almuerzos corrientes, la parrilla del
            barrio — encuentra dónde comer en Ibagué, por categoría.
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
            <span aria-hidden="true">·</span>
            <span>en español, primero</span>
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
                  href={`/categoria/${category.slug}`}
                >
                  {category.slug === "tamales" ? (
                    <TamalIcon />
                  ) : (
                    <span className="cat-emoji" aria-hidden="true">
                      {category.emoji}
                    </span>
                  )}
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
