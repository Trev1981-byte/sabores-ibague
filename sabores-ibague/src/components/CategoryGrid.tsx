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

export function CategoryGrid({ categories }: { categories: Category[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = normalize(query.trim());
    if (!q) return categories;
    return categories.filter((c) => normalize(c.label).includes(q));
  }, [categories, query]);

  return (
    <div>
      <label htmlFor="category-search" className="sr-only">
        Buscar por categoría
      </label>
      <input
        id="category-search"
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar: hamburguesas, arepas, tamales..."
        className="w-full rounded-full border border-neutral-300 bg-white px-5 py-3 text-base text-neutral-900 shadow-sm outline-none placeholder:text-neutral-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:focus:border-orange-400 dark:focus:ring-orange-900"
      />

      {filtered.length === 0 ? (
        <p className="mt-6 text-center text-sm text-neutral-500 dark:text-neutral-400">
          No hay categorías que coincidan con &ldquo;{query}&rdquo;.
        </p>
      ) : (
        <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {filtered.map((category) => (
            <li key={category.id}>
              <Link
                href={`/categoria/${category.slug}`}
                className="flex flex-col items-center gap-2 rounded-2xl border border-neutral-200 bg-white px-4 py-5 text-center transition hover:-translate-y-0.5 hover:border-orange-300 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-orange-700"
              >
                <span className="text-3xl" aria-hidden="true">
                  {category.emoji}
                </span>
                <span className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                  {category.label}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
