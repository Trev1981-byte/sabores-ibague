"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  getPendingRestaurants,
  approveRestaurant,
  rejectRestaurant,
} from "@/lib/queries";
import type { PendingRestaurant } from "@/lib/queries";
import { ServiceBadges } from "@/components/ServiceBadges";

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

export default function ReviewPage() {
  const [restaurants, setRestaurants] = useState<PendingRestaurant[] | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function load() {
    const data = await getPendingRestaurants(ADMIN_KEY);
    setRestaurants(data);
  }

  useEffect(() => {
    (async () => {
      const data = await getPendingRestaurants(ADMIN_KEY);
      setRestaurants(data);
    })();
  }, []);

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
                <p className="review-meta">📱 WhatsApp: {r.whatsapp_number}</p>
                {r.phone_number && <p className="review-meta">☎️ Fijo: {r.phone_number}</p>}
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
                    className="review-reject"
                    disabled={busyId === r.id}
                    onClick={() => handleReject(r.id, r.name)}
                  >
                    🗑️ Rechazar
                  </button>
                </div>
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
