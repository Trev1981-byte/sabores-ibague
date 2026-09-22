"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  getAdminVisitsByCity,
  getAdminEngagementByRestaurant,
} from "@/lib/queries";
import type { CityVisitCount, RestaurantEngagement } from "@/lib/queries";

// Same no-login pattern as the other private admin pages (/revisar-...,
// /nuevo-...): this URL is the only way in, and the database checks this
// exact key too. Don't share this link outside the people who should see
// site stats.
const ADMIN_KEY = "dd4b0c00-c1cb-4880-920b-3706f4a3d35a";

const RANGES = [
  { label: "Hoy", days: 1 as number | null },
  { label: "7 días", days: 7 as number | null },
  { label: "30 días", days: 30 as number | null },
  { label: "Todo", days: null as number | null },
];

const numberFormat = new Intl.NumberFormat("es-CO");

type LoadedResult = {
  rangeIndex: number;
  cities: CityVisitCount[];
  engagement: RestaurantEngagement[];
};

export default function StatsPage() {
  const [rangeIndex, setRangeIndex] = useState(1); // default: 7 días
  const [result, setResult] = useState<LoadedResult | null>(null);

  const sinceDays = RANGES[rangeIndex].days;

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const [cityData, engagementData] = await Promise.all([
        getAdminVisitsByCity(ADMIN_KEY, sinceDays),
        getAdminEngagementByRestaurant(ADMIN_KEY, sinceDays),
      ]);
      if (cancelled) return;
      setResult({ rangeIndex, cities: cityData, engagement: engagementData });
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- rangeIndex and sinceDays always change together
  }, [sinceDays]);

  // Still showing the previous range's numbers until the new range's
  // request resolves, so switching ranges doesn't flash an empty page.
  const loading = result === null || result.rangeIndex !== rangeIndex;
  const cities = useMemo(() => result?.cities ?? [], [result]);
  const engagement = useMemo(() => result?.engagement ?? [], [result]);

  const totals = useMemo(() => {
    const totalVisits = cities.reduce((sum, c) => sum + c.visitCount, 0);
    const totalCalls = engagement.reduce((sum, r) => sum + r.callCount, 0);
    const totalWhatsapp = engagement.reduce((sum, r) => sum + r.whatsappCount, 0);
    const totalViews = engagement.reduce((sum, r) => sum + r.viewCount, 0);
    const totalImpressions = engagement.reduce((sum, r) => sum + r.impressionCount, 0);
    return { totalVisits, totalCalls, totalWhatsapp, totalViews, totalImpressions };
  }, [cities, engagement]);

  // Most-engaged restaurants first (calls + WhatsApp taps), not
  // alphabetical — that's the order that's actually useful to scan.
  const sortedEngagement = useMemo(() => {
    return [...engagement].sort((a, b) => {
      const aTotal = a.callCount + a.whatsappCount;
      const bTotal = b.callCount + b.whatsappCount;
      if (bTotal !== aTotal) return bTotal - aTotal;
      return b.viewCount - a.viewCount;
    });
  }, [engagement]);

  return (
    <main className="wrap stats-page">
      <div className="stats-head">
        <h1>Estadísticas</h1>
        <div className="stats-range" role="group" aria-label="Rango de fechas">
          {RANGES.map((range, index) => (
            <button
              key={range.label}
              type="button"
              aria-pressed={index === rangeIndex}
              onClick={() => setRangeIndex(index)}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="manage-loading">Cargando...</p>
      ) : (
        <>
          <div className="stats-summary">
            <div className="stats-tile">
              <span className="stats-tile-value">{numberFormat.format(totals.totalVisits)}</span>
              <span className="stats-tile-label">Visitas al sitio</span>
            </div>
            <div className="stats-tile">
              <span className="stats-tile-value">{numberFormat.format(totals.totalViews)}</span>
              <span className="stats-tile-label">Perfiles vistos</span>
            </div>
            <div className="stats-tile">
              <span className="stats-tile-value">{numberFormat.format(totals.totalImpressions)}</span>
              <span className="stats-tile-label">Apariciones en listas</span>
            </div>
            <div className="stats-tile">
              <span className="stats-tile-value">{numberFormat.format(totals.totalCalls)}</span>
              <span className="stats-tile-label">Llamadas</span>
            </div>
            <div className="stats-tile">
              <span className="stats-tile-value">{numberFormat.format(totals.totalWhatsapp)}</span>
              <span className="stats-tile-label">WhatsApp</span>
            </div>
          </div>

          <section className="stats-section">
            <h2>Visitas por ciudad</h2>
            <p className="stats-section-note">
              La ciudad se detecta automáticamente por la ubicación del
              visitante — así puedes ver si tus anuncios realmente están
              llegando a Ibagué. &ldquo;Desconocida&rdquo; suele ser una
              visita local durante desarrollo o un bot, no un visitante real
              perdido.
            </p>
            <div className="stats-table-wrap">
              {cities && cities.length > 0 ? (
                <table className="stats-table">
                  <thead>
                    <tr>
                      <th>Ciudad</th>
                      <th>Región</th>
                      <th>Visitas</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cities.map((c) => (
                      <tr key={`${c.city}-${c.region}`}>
                        <td>{c.city}</td>
                        <td>{c.region || "—"}</td>
                        <td>{numberFormat.format(c.visitCount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="stats-empty">No hay visitas registradas en este rango.</p>
              )}
            </div>
          </section>

          <section className="stats-section">
            <h2>Por restaurante</h2>
            <p className="stats-section-note">
              Ordenado por más llamadas + WhatsApp primero — los que más
              contacto están generando.
            </p>
            <div className="stats-table-wrap">
              {sortedEngagement.length > 0 ? (
                <table className="stats-table">
                  <thead>
                    <tr>
                      <th>Restaurante</th>
                      <th>Vistas</th>
                      <th>Apariciones</th>
                      <th>Llamadas</th>
                      <th>WhatsApp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedEngagement.map((r) => (
                      <tr key={r.restaurantId}>
                        <td>
                          <Link href={`/ibague/restaurante/${r.slug}`}>{r.name}</Link>
                        </td>
                        <td>{numberFormat.format(r.viewCount)}</td>
                        <td>{numberFormat.format(r.impressionCount)}</td>
                        <td>{numberFormat.format(r.callCount)}</td>
                        <td>{numberFormat.format(r.whatsappCount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="stats-empty">No hay restaurantes publicados todavía.</p>
              )}
            </div>
          </section>
        </>
      )}

      <Link href="/" className="back-link">
        ← Volver al inicio
      </Link>
    </main>
  );
}
