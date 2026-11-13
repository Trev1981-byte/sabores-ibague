"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { Category, MenuSearchResult, RestaurantSearchResult } from "@/lib/queries";
import { CategoryIcon } from "@/components/CategoryIcon";
import { CATEGORY_PHOTOS } from "@/lib/categoryPhotos";

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, ""); // strip accents so "arepa" matches "Arepas"
}

// Homepage card order: the meals people look for most come first. Every
// other category follows in its normal (database sort_order) position.
const HOME_FIRST = ["desayunos", "almuerzos", "arepas", "hamburguesas", "empanadas"];

export function CategoryGrid({
  categories,
  restaurantCount,
  citySlug,
  restaurants,
  menuItems,
  heroTitle,
  heroLede,
  children,
}: {
  categories: Category[];
  restaurantCount: number;
  citySlug: string;
  restaurants: RestaurantSearchResult[];
  menuItems: MenuSearchResult[];
  /** The page's one <h1> — per-city copy from src/lib/cityHome.ts. */
  heroTitle: string;
  heroLede: string;
  /** Extra sections rendered after the category grid, inside <main>. */
  children?: ReactNode;
}) {
  const [query, setQuery] = useState("");
  const hasQuery = query.trim().length > 0;

  // Array.sort is stable, so categories not listed in HOME_FIRST keep their
  // original relative order.
  const homeCategories = useMemo(() => {
    const rank = (slug: string) => {
      const i = HOME_FIRST.indexOf(slug);
      return i === -1 ? HOME_FIRST.length : i;
    };
    return [...categories].sort((a, b) => rank(a.slug) - rank(b.slug));
  }, [categories]);

  const filteredCategories = useMemo(() => {
    const q = normalize(query.trim());
    if (!q) return categories;
    return categories.filter((c) => normalize(c.label).includes(q));
  }, [categories, query]);

  // Restaurant names and specific dishes only ever show up once someone's
  // actually typed something — with no query, the categories below are
  // the whole home page, same as always.
  const filteredRestaurants = useMemo(() => {
    if (!hasQuery) return [];
    const q = normalize(query.trim());
    return restaurants.filter((r) => normalize(r.name).includes(q));
  }, [restaurants, query, hasQuery]);

  const filteredMenuItems = useMemo(() => {
    if (!hasQuery) return [];
    const q = normalize(query.trim());
    return menuItems.filter((m) => normalize(m.name).includes(q));
  }, [menuItems, query, hasQuery]);

  const totalMatches =
    filteredCategories.length + filteredRestaurants.length + filteredMenuItems.length;

  return (
    <>
      <section className="photo-cats" aria-labelledby="photo-cats-title">
        <div className="wrap">
          <h2 id="photo-cats-title" className="photo-cats-title">
            ¿Qué se te antoja&nbsp;hoy?
          </h2>
          <div className="photo-grid">
            {homeCategories.map((category, index) => {
              const photo = CATEGORY_PHOTOS[category.slug];
              return (
                <Link
                  key={category.id}
                  className={photo ? "photo-tile" : "photo-tile photo-tile--plain"}
                  href={`/${citySlug}/categoria/${category.slug}`}
                >
                  {photo ? (
                    <Image
                      src={photo}
                      alt=""
                      fill
                      sizes="(min-width: 64rem) 20vw, (min-width: 40rem) 33vw, 50vw"
                      priority={index < 6}
                      className="photo-tile-img"
                    />
                  ) : (
                    <CategoryIcon
                      category={category}
                      iconClassName="photo-tile-icon"
                      emojiClassName="photo-tile-emoji"
                    />
                  )}
                  <span className="photo-tile-label">{category.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <div className="fringe fringe-top" aria-hidden="true">
        <svg viewBox="0 0 200 22" preserveAspectRatio="none">
          <path d="M0,0 H200 V10 C195,10 190,22 185,22 C180,22 178,10 175,10 C170,10 168,22 163,22 C158,22 156,10 151,10 C146,10 144,22 139,22 C134,22 132,10 127,10 C122,10 120,22 115,22 C110,22 108,10 103,10 C98,10 96,22 91,22 C86,22 84,10 79,10 C74,10 72,22 67,22 C62,22 60,10 55,10 C50,10 48,22 43,22 C38,22 36,10 31,10 C26,10 24,22 19,22 C14,22 12,10 7,10 C4,10 2,10 0,10 Z" />
        </svg>
      </div>

      <header className="hero">
        <div className="hero-glow" aria-hidden="true"></div>
        <div className="wrap hero-inner">
          <span className="eyebrow">¿Buscas algo en especial?</span>
          <h1>{heroTitle}</h1>
          <p className="lede">{heroLede}</p>

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
              Buscar por categoría, restaurante o plato
            </label>
            <input
              id="category-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar: hamburguesas, Asadero Doña Rosa, arepa con queso..."
              autoComplete="off"
            />
            <button type="button">Buscar</button>
          </form>

          <Link href={`/${citySlug}/sorpresa`} className="surprise-btn">
            🎲 Sorpréndeme
          </Link>

        </div>
      </header>

      <div className="fringe" aria-hidden="true">
        <svg viewBox="0 0 200 22" preserveAspectRatio="none">
          <path d="M0,0 H200 V10 C195,10 190,22 185,22 C180,22 178,10 175,10 C170,10 168,22 163,22 C158,22 156,10 151,10 C146,10 144,22 139,22 C134,22 132,10 127,10 C122,10 120,22 115,22 C110,22 108,10 103,10 C98,10 96,22 91,22 C86,22 84,10 79,10 C74,10 72,22 67,22 C62,22 60,10 55,10 C50,10 48,22 43,22 C38,22 36,10 31,10 C26,10 24,22 19,22 C14,22 12,10 7,10 C4,10 2,10 0,10 Z" />
        </svg>
      </div>

      <main>
        <div className={hasQuery ? "wrap section" : "wrap"}>
          {hasQuery && totalMatches === 0 ? (
            <p className="no-match">
              No encontramos nada para &ldquo;{query}&rdquo;. Prueba con otra
              palabra.
            </p>
          ) : (
            <>
              {hasQuery && filteredRestaurants.length > 0 && (
                <div className="search-result-block">
                  <h2 className="search-result-title">Restaurantes</h2>
                  <div className="search-result-list">
                    {filteredRestaurants.map((restaurant) => (
                      <Link
                        key={restaurant.id}
                        href={`/${citySlug}/restaurante/${restaurant.slug}`}
                        className="search-result-row"
                      >
                        <span className="search-result-name">{restaurant.name}</span>
                        <span className="search-result-arrow" aria-hidden="true">
                          →
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {hasQuery && filteredMenuItems.length > 0 && (
                <div className="search-result-block">
                  <h2 className="search-result-title">Platos</h2>
                  <div className="search-result-list">
                    {filteredMenuItems.map((item) => (
                      <Link
                        key={item.id}
                        href={`/${citySlug}/restaurante/${item.restaurantSlug}`}
                        className="search-result-row"
                      >
                        <span className="search-result-name">{item.name}</span>
                        <span className="search-result-meta">en {item.restaurantName}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {hasQuery && filteredCategories.length > 0 && (
                <div className="search-result-block">
                  <h2 className="search-result-title">Categorías</h2>
                  <div className="search-result-list">
                    {filteredCategories.map((category) => (
                      <Link
                        key={category.id}
                        href={`/${citySlug}/categoria/${category.slug}`}
                        className="search-result-row"
                      >
                        <span className="search-result-name">{category.label}</span>
                        <span className="search-result-arrow" aria-hidden="true">
                          →
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {restaurantCount === 0 && (
            <p className="empty-note">
              Todavía no hay restaurantes publicados — estamos empezando. Muy
              pronto podrás explorarlos por categoría desde aquí.
            </p>
          )}
        </div>

        {children}
      </main>
    </>
  );
}
