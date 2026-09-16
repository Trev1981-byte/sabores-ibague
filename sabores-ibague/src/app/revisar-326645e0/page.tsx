"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  getPendingRestaurants,
  approveRestaurant,
  rejectRestaurant,
  mergeRestaurant,
  getApprovedRestaurantsForSearch,
} from "@/lib/queries";
import type { PendingRestaurant, RestaurantSearchResult } from "@/lib/queries";
import { ServiceBadges } from "@/components/ServiceBadges";
import { CITIES } from "@/lib/cities";

// This page has no login system — the key below stands in for one, the
// same way a vendor's private edit link stands in for a password. Nobody
// sees this page's code unless they already have this exact URL (Next.js
// only ever sends a page's code to someone who visits it), and even
// someone who somehow found the URL still can't call the database
// functions behind it without this key, because the database checks it
// too. Don't share this URL outside the people who should be approving
// restaurants.
const ADMIN_KEY = "dd4b0c00-c1cb-4880-920b-3706f4a3d35a";

const pesos = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, ""); // strip accents so "cafe" matches "Café"
}

export default function ReviewPage() {
  const [restaurants, setRestaurants] = useState<PendingRestaurant[] | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  // --- "this is already listed" merge flow ------------------------------
  // A pending submission can turn out to be a restaurant that's already
  // published under a different name, number, or both. Instead of
  // approving it as a confusing second copy, this folds it into the
  // existing listing (same URL, same stats) via admin_merge_restaurant.
  const [existingRestaurants, setExistingRestaurants] = useState<RestaurantSearchResult[]>([]);
  const [mergingId, setMergingId] = useState<string | null>(null);
  const [mergeQuery, setMergeQuery] = useState("");
  const [mergeBusyId, setMergeBusyId] = useState<string | null>(null);

  async function load() {
    const data = await getPendingRestaurants(ADMIN_KEY);
    setRestaurants(data);
  }

  useEffect(() => {
    (async () => {
      const [pending, existing] = await Promise.all([
        getPendingRestaurants(ADMIN_KEY),
        getApprovedRestaurantsForSearch(CITIES[0].name),
      ]);
      setRestaurants(pending);
      setExistingRestaurants(existing);
    })();
  }, []);

  const mergeMatches = useMemo(() => {
    const q = normalize(mergeQuery.trim());
    if (!q) return existingRestaurants.slice(0, 8);
    return existingRestaurants.filter((r) => normalize(r.name).includes(q)).slice(0, 8);
  }, [existingRestaurants, mergeQuery]);

  async function handleApprove(id: string) {
    setBusyId(id);
    const ok = await approveRestaurant(ADMIN_KEY, id);
    setBusyId(null);
    if (ok) {
      setRestaurants((current) => (current ?? []).filter((r) => r.id !== id));
    }
  }

  async function handleReject(id: string, name: string) {
    if (!window.confirm(`¿Borrar "${name}" para siempre? Esto no se puede deshacer.`)) {
      return;
    }
    setBusyId(id);
    const ok = await rejectRestaurant(ADMIN_KEY, id);
    setBusyId(null);
    if (ok) {
      setRestaurants((current) => (current ?? []).filter((r) => r.id !== id));
    }
  }

  function toggleMergePicker(id: string) {
    setMergingId((current) => (current === id ? null : id));
    setMergeQuery("");
  }

  async function handleMergeConfirm(
    pendingId: string,
    pendingName: string,
    existingId: string,
    existingName: string
  ) {
    if (
      !window.confirm(
        `¿Actualizar "${existingName}" con la información que envió "${pendingName}"? El enlace y las estadísticas de "${existingName}" se mantienen — esto no se puede deshacer.`
      )
    ) {
      return;
    }
    setMergeBusyId(pendingId);
    const ok = await mergeRestaurant(ADMIN_KEY, pendingId, existingId);
    setMergeBusyId(null);
    if (ok) {
      setRestaurants((current) => (current ?? []).filter((r) => r.id !== pendingId));
      setMergingId(null);
    }
  }

  return (
    <main className="wrap review-page">
      <div className="review-head">
        <h1>Revisar restaurantes</h1>
        <button type="button" className="review-refresh" onClick={load}>
          ↻ Actualizar
        </button>
      </div>

      {restaurants === null ? (
        <p className="manage-loading">Cargando...</p>
      ) : restaurants.length === 0 ? (
        <p className="manage-loading">No hay nada pendiente de revisión ahora mismo.</p>
      ) : (
        <div className="review-list">
          {restaurants.map((r) => (
            <div className="review-card" key={r.id}>
              {r.photo_url ? (
                <img src={r.photo_url} alt={r.name} className="review-card-photo" />
              ) : (
                <div className="review-card-photo review-card-photo-empty" aria-hidden="true">
                  🍽️
                </div>
              )}

              <div className="review-card-body">
                <h2>{r.name}</h2>
                <p className="review-meta">
                  {r.neighborhood} · {r.price_level}
                </p>
                <ServiceBadges restaurant={r} />
                <p className="review-meta">☎️ Teléfono: {r.phone_number}</p>
                {r.whatsapp_number && <p className="review-meta">📱 WhatsApp: {r.whatsapp_number}</p>}
                {r.address && <p className="review-meta">📍 {r.address}</p>}
                {r.hours_text && <p className="review-meta">🕐 {r.hours_text}</p>}
                {r.maps_link && (
                  <p className="review-meta">
                    <a href={r.maps_link} target="_blank" rel="noopener noreferrer">
                      Ver en Google Maps →
                    </a>
                  </p>
                )}
                {r.blurb && <p className="review-blurb">{r.blurb}</p>}

                {r.menu_items.length > 0 && (
                  <div className="review-menu">
                    <p className="review-menu-title">Menú ({r.menu_items.length})</p>
                    <ul className="review-menu-list">
                      {r.menu_items.map((item) => (
                        <li className="review-menu-item" key={item.id}>
                          {item.photo_url ? (
                            <img
                              src={item.photo_url}
                              alt=""
                              className="review-menu-item-photo"
                            />
                          ) : (
                            <span
                              className="review-menu-item-photo review-menu-item-photo-empty"
                              aria-hidden="true"
                            >
                              📷
                            </span>
                          )}
                          <span className="review-menu-item-text">
                            <span>{item.name}</span>
                            <span className="review-menu-item-price">
                              {item.price !== null ? pesos.format(item.price) : "—"}
                            </span>
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="review-actions">
                  <button
                    type="button"
                    className="review-approve"
                    disabled={busyId === r.id}
                    onClick={() => handleApprove(r.id)}
                  >
                    {busyId === r.id ? "..." : "✅ Aprobar y publicar"}
                  </button>
                  <button
                    type="button"
                    className="review-merge"
                    disabled={busyId === r.id}
                    onClick={() => toggleMergePicker(r.id)}
                  >
                    🔗 Ya existe — actualizar
                  </button>
                  <button
                    type="button"
                    className="review-reject"
                    disabled={busyId === r.id}
                    onClick={() => handleReject(r.id, r.name)}
                  >
                    🗑️ Rechazar
                  </button>
                </div>

                {mergingId === r.id && (
                  <div className="merge-picker">
                    <p className="merge-picker-label">
                      ¿Cuál restaurante ya publicado es en realidad este mismo?
                    </p>
                    <input
                      type="text"
                      placeholder="Busca por nombre..."
                      value={mergeQuery}
                      onChange={(event) => setMergeQuery(event.target.value)}
                      autoFocus
                    />
                    {mergeMatches.length === 0 ? (
                      <p className="merge-picker-empty">No encontramos ningún restaurante con ese nombre.</p>
                    ) : (
                      <div className="merge-picker-list">
                        {mergeMatches.map((existing) => (
                          <button
                            type="button"
                            key={existing.id}
                            className="merge-picker-item"
                            disabled={mergeBusyId === r.id}
                            onClick={() => handleMergeConfirm(r.id, r.name, existing.id, existing.name)}
                          >
                            <span>{existing.name}</span>
                            <span aria-hidden="true">→</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <Link href="/" className="back-link">
        ← Volver al inicio
      </Link>
    </main>
  );
}
