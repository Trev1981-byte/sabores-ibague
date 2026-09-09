"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { submitRestaurant } from "@/lib/queries";
import type { Category } from "@/lib/queries";
import { CategoryIcon } from "@/components/CategoryIcon";

const PRICE_LEVELS = [
  { value: "$", label: "$ — Económico (hasta $15.000 por persona)" },
  { value: "$$", label: "$$ — Precio medio ($15.000–$30.000 por persona)" },
  { value: "$$$", label: "$$$ — Más alto (más de $30.000 por persona)" },
] as const;

export function AddRestaurantForm({ categories }: { categories: Category[] }) {
  const [status, setStatus] = useState<"idle" | "saving" | "done">("idle");
  const [error, setError] = useState<string | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [editLink, setEditLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  // Most Ibagué places do at least dine-in, so it starts checked — the
  // vendor can uncheck it if that's not true for them (a food truck, say).
  const [hasDineIn, setHasDineIn] = useState(true);
  const [hasTakeout, setHasTakeout] = useState(false);
  const [hasDelivery, setHasDelivery] = useState(false);

  function toggleCategory(id: string) {
    setSelectedCategories((current) =>
      current.includes(id)
        ? current.filter((c) => c !== id)
        : [...current, id]
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const form = event.currentTarget;
    const data = new FormData(form);

    // Honeypot: a real visitor never fills this in (it's visually hidden),
    // so anything here means it's very likely an automated bot.
    if (String(data.get("company_website") ?? "").trim() !== "") {
      setStatus("done");
      return;
    }

    const name = String(data.get("name") ?? "").trim();
    const neighborhood = String(data.get("neighborhood") ?? "").trim();
    const priceLevel = String(data.get("priceLevel") ?? "");
    const phoneNumber = String(data.get("phoneNumber") ?? "").trim();
    const whatsappNumber = String(data.get("whatsappNumber") ?? "").trim();
    const hoursText = String(data.get("hoursText") ?? "").trim();

    if (!name || !neighborhood || !phoneNumber || !hoursText) {
      setError(
        "Por favor completa nombre, barrio, teléfono y horario — son obligatorios."
      );
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
      setError("Selecciona al menos una opción: domicilio, para llevar o comer en el sitio.");
      return;
    }

    setStatus("saving");

    const result = await submitRestaurant({
      name,
      neighborhood,
      priceLevel,
      phoneNumber,
      whatsappNumber: whatsappNumber || undefined,
      hoursText,
      mapsLink: String(data.get("mapsLink") ?? "").trim() || undefined,
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

    setEditLink(`${window.location.origin}/mi-restaurante/${result.editToken}`);
    setStatus("done");
  }

  async function handleCopyLink() {
    if (!editLink) return;
    try {
      await navigator.clipboard.writeText(editLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Clipboard access can fail (older browsers, permissions) — the link
      // is still selectable and copyable by hand, so this isn't fatal.
    }
  }

  if (status === "done") {
    return (
      <div className="form-success">
        <span className="form-success-emoji" aria-hidden="true">
          🎉
        </span>
        <h2>¡Listo, gracias!</h2>
        <p>
          Recibimos tu restaurante. Nuestro equipo lo revisa y lo publica
          pronto — normalmente en uno o dos días. Te contactaremos por
          WhatsApp si nos falta algún dato.
        </p>

        {editLink && (
          <div className="edit-link-box">
            <p className="edit-link-warning">
              ⚠️ Guarda este enlace — es el único que te permite editar tu
              restaurante y agregar tu menú con precios. No lo pierdas.
            </p>
            <div className="edit-link-row">
              <input
                type="text"
                readOnly
                value={editLink}
                onFocus={(e) => e.currentTarget.select()}
                aria-label="Tu enlace privado para editar tu restaurante"
              />
              <button type="button" onClick={handleCopyLink}>
                {copied ? "¡Copiado!" : "Copiar"}
              </button>
            </div>
            <p className="edit-link-hint">
              Puedes usar este enlace ahora mismo para agregar los platos de
              tu menú con sus precios — no necesitas esperar a que lo
              aprobemos para eso.
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <form className="add-form" onSubmit={handleSubmit}>
      {/* Hidden from real visitors via CSS, but a bot filling every field
          it finds will fill this too — see the honeypot check above. */}
      <div className="form-hp" aria-hidden="true">
        <label htmlFor="company_website">No llenar este campo</label>
        <input id="company_website" name="company_website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="field">
        <label htmlFor="name">Nombre del negocio *</label>
        <input
          id="name"
          name="name"
          type="text"
          required
          placeholder="Ej: Asadero Doña Rosa, Food Truck El Parche, Carrito Don Beto"
        />
        <p className="field-hint">
          Restaurante, food truck, carrito o puesto de comida — cualquier
          lugar donde la gente pueda comer.
        </p>
      </div>

      <div className="field">
        <label htmlFor="neighborhood">Barrio *</label>
        <input id="neighborhood" name="neighborhood" type="text" required placeholder="Ej: Belén, Cádiz, El Salado..." />
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
        <p className="field-hint">
          El número al que los clientes te pueden llamar — celular o fijo.
        </p>
      </div>

      <div className="field">
        <label htmlFor="whatsappNumber">Número de WhatsApp (opcional)</label>
        <input
          id="whatsappNumber"
          name="whatsappNumber"
          type="tel"
          placeholder="Ej: 3001234567 (sin +57, solo el número)"
        />
        <p className="field-hint">
          Si tienes WhatsApp, los clientes también podrán escribirte
          directamente ahí. Si es el mismo número de arriba, repítelo aquí.
        </p>
      </div>

      <div className="field">
        <label htmlFor="hoursText">Horario *</label>
        <input id="hoursText" name="hoursText" type="text" required placeholder="Ej: Lun-Sáb 11am-9pm" />
      </div>

      <div className="field">
        <label htmlFor="mapsLink">Enlace de Google Maps (opcional)</label>
        <input id="mapsLink" name="mapsLink" type="url" placeholder="https://maps.google.com/..." />
      </div>

      <div className="field">
        <label htmlFor="blurb">Cuéntanos de tu restaurante (opcional)</label>
        <textarea
          id="blurb"
          name="blurb"
          rows={3}
          placeholder="Ej: Comida a la parrilla, ambiente familiar, parqueadero propio."
        />
      </div>

      <div className="field">
        <span className="field-label-static">¿Cómo atiendes? *</span>
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
        {status === "saving" ? "Enviando..." : "Enviar restaurante"}
      </button>
    </form>
  );
}
