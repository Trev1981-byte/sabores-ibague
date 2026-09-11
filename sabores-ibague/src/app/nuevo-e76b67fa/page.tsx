"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { adminCreateRestaurant, getCategories } from "@/lib/queries";
import type { Category } from "@/lib/queries";
import { CategoryIcon } from "@/components/CategoryIcon";

// Same stand-in-for-a-login approach as the review page (revisar-326645e0)
// — this URL is the secret, and the database double-checks this exact key
// before it lets anything through. Don't share this URL outside yourself.
const ADMIN_KEY = "dd4b0c00-c1cb-4880-920b-3706f4a3d35a";

const PRICE_LEVELS = [
  { value: "$", label: "$ — Económico (hasta $15.000 por persona)" },
  { value: "$$", label: "$$ — Precio medio ($15.000–$30.000 por persona)" },
  { value: "$$$", label: "$$$ — Más alto (más de $30.000 por persona)" },
] as const;

export default function AdminAddRestaurantPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[] | null>(null);
  const [status, setStatus] = useState<"idle" | "saving">("idle");
  const [error, setError] = useState<string | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  // Most Ibagué places do at least dine-in, so it starts checked — same
  // default the public form uses.
  const [hasDineIn, setHasDineIn] = useState(true);
  const [hasTakeout, setHasTakeout] = useState(false);
  const [hasDelivery, setHasDelivery] = useState(false);

  const addressRequired = hasDineIn || hasTakeout;

  useEffect(() => {
    (async () => {
      const data = await getCategories();
      setCategories(data);
    })();
  }, []);

  function toggleCategory(id: string) {
    setSelectedCategories((current) =>
      current.includes(id) ? current.filter((c) => c !== id) : [...current, id]
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const form = event.currentTarget;
    const data = new FormData(form);

    const name = String(data.get("name") ?? "").trim();
    const neighborhood = String(data.get("neighborhood") ?? "").trim();
    const priceLevel = String(data.get("priceLevel") ?? "");
    const phoneNumber = String(data.get("phoneNumber") ?? "").trim();
    const whatsappNumber = String(data.get("whatsappNumber") ?? "").trim();
    const hoursText = String(data.get("hoursText") ?? "").trim();
    const address = String(data.get("address") ?? "").trim();

    if (!name || !neighborhood || !phoneNumber) {
      setError("Completa al menos nombre, barrio y teléfono.");
      return;
    }
    if (priceLevel !== "$" && priceLevel !== "$$" && priceLevel !== "$$$") {
      setError("Selecciona un rango de precios.");
      return;
    }
    if (selectedCategories.length === 0) {
      setError("Selecciona al menos una categoría.");
      return;
    }
    if (!hasDineIn && !hasTakeout && !hasDelivery) {
      setError(
        "Selecciona al menos una opción: domicilio, para llevar o comer en el sitio."
      );
      return;
    }
    if (addressRequired && !address) {
      setError(
        "Agrega una dirección — si la gente puede comer en el sitio o pasar a recoger su pedido, necesita saber dónde encontrarlo."
      );
      return;
    }

    setStatus("saving");

    const result = await adminCreateRestaurant(ADMIN_KEY, {
      name,
      neighborhood,
      priceLevel,
      phoneNumber,
      whatsappNumber: whatsappNumber || undefined,
      hoursText: hoursText || undefined,
      mapsLink: String(data.get("mapsLink") ?? "").trim() || undefined,
      address: address || undefined,
      blurb: String(data.get("blurb") ?? "").trim() || undefined,
      categoryIds: selectedCategories,
      hasDineIn,
      hasTakeout,
      hasDelivery,
    });

    if ("error" in result) {
      setError(result.error);
      setStatus("idle");
      return;
    }

    // Straight into the same page a vendor uses to manage their own
    // listing — from here you can add menu items and upload real photos
    // right away. No approval step to wait on since it's already live.
    router.push(`/mi-restaurante/${result.editToken}`);
  }

  return (
    <main className="wrap form-page">
      <Link href="/" className="back-link">
        ← Volver al inicio
      </Link>

      <div className="detail-head">
        <span className="detail-emoji" aria-hidden="true">
          🔑
        </span>
        <h1>Agregar restaurante (admin)</h1>
      </div>

      <p className="form-intro">
        Se publica de inmediato — sin pasar por la cola de revisión. Después
        de guardar, vas directo a la página donde puedes agregar el menú con
        precios y subir fotos reales.
      </p>

      {categories === null ? (
        <p className="manage-loading">Cargando categorías...</p>
      ) : (
        <form className="add-form" onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="name">Nombre del negocio *</label>
            <input
              id="name"
              name="name"
              type="text"
              required
              placeholder="Ej: Asadero Doña Rosa"
            />
          </div>

          <div className="field">
            <label htmlFor="neighborhood">Barrio *</label>
            <input
              id="neighborhood"
              name="neighborhood"
              type="text"
              required
              placeholder="Ej: Belén, Cádiz, El Salado..."
            />
          </div>

          <div className="field">
            <label htmlFor="priceLevel">Rango de precios *</label>
            <select id="priceLevel" name="priceLevel" required defaultValue="">
              <option value="" disabled>
                Selecciona uno
              </option>
              {PRICE_LEVELS.map((level) => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="phoneNumber">Teléfono *</label>
            <input
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              required
              placeholder="Ej: 3001234567 o 608 1234567"
            />
          </div>

          <div className="field">
            <label htmlFor="whatsappNumber">Número de WhatsApp</label>
            <input
              id="whatsappNumber"
              name="whatsappNumber"
              type="tel"
              placeholder="Ej: 3001234567 (solo si está confirmado)"
            />
          </div>

          <div className="field">
            <label htmlFor="hoursText">Horario (opcional)</label>
            <input
              id="hoursText"
              name="hoursText"
              type="text"
              placeholder="Ej: Lun-Sáb 11am-9pm"
            />
          </div>

          <div className="field">
            <label htmlFor="address">
              Dirección{addressRequired ? " *" : " (opcional)"}
            </label>
            <input
              id="address"
              name="address"
              type="text"
              required={addressRequired}
              placeholder="Ej: Carrera 5 #12-34, o Esquina Calle 15 con Carrera 3"
            />
          </div>

          <div className="field">
            <label htmlFor="mapsLink">Enlace de Google Maps (opcional)</label>
            <input id="mapsLink" name="mapsLink" type="url" placeholder="https://maps.google.com/..." />
          </div>

          <div className="field">
            <label htmlFor="blurb">Descripción (opcional)</label>
            <textarea
              id="blurb"
              name="blurb"
              rows={3}
              placeholder="Ej: Comida a la parrilla, ambiente familiar, parqueadero propio."
            />
          </div>

          <div className="field">
            <span className="field-label-static">¿Cómo atiende? *</span>
            <div className="service-checks">
              <label className="service-check">
                <input
                  type="checkbox"
                  checked={hasDineIn}
                  onChange={() => setHasDineIn((v) => !v)}
                />
                <span aria-hidden="true">🍽️</span>
                <span>Comer en el sitio</span>
              </label>
              <label className="service-check">
                <input
                  type="checkbox"
                  checked={hasTakeout}
                  onChange={() => setHasTakeout((v) => !v)}
                />
                <span aria-hidden="true">🥡</span>
                <span>Para llevar</span>
              </label>
              <label className="service-check">
                <input
                  type="checkbox"
                  checked={hasDelivery}
                  onChange={() => setHasDelivery((v) => !v)}
                />
                <span aria-hidden="true">🛵</span>
                <span>Domicilio</span>
              </label>
            </div>
          </div>

          <div className="field">
            <span className="field-label-static">Categorías *</span>
            <div className="category-checks">
              {categories.map((category) => (
                <label key={category.id} className="category-check">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category.id)}
                    onChange={() => toggleCategory(category.id)}
                  />
                  <CategoryIcon
                    category={category}
                    iconClassName="category-check-icon"
                    emojiClassName="category-check-emoji"
                  />
                  <span className="category-check-label">{category.label}</span>
                </label>
              ))}
            </div>
          </div>

          {error && <p className="form-error">{error}</p>}

          <button type="submit" className="form-submit" disabled={status === "saving"}>
            {status === "saving" ? "Guardando..." : "Publicar ahora"}
          </button>
        </form>
      )}
    </main>
  );
}
