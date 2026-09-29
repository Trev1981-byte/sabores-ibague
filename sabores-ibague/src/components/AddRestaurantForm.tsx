"use client";

import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { addMenuItem, setRestaurantPhoto, submitRestaurant } from "@/lib/queries";
import type { Category } from "@/lib/queries";
import { uploadPhoto } from "@/lib/uploadPhoto";
import { CategoryIcon } from "@/components/CategoryIcon";

const PRICE_LEVELS = [
  { value: "$", label: "$ — Económico (hasta $15.000 por persona)" },
  { value: "$$", label: "$$ — Precio medio ($15.000–$30.000 por persona)" },
  { value: "$$$", label: "$$$ — Más alto (más de $30.000 por persona)" },
] as const;

type MenuRow = { key: number; name: string; price: string };

// Everything that still has to happen after submit_restaurant succeeds and
// hands back the edit token — the cover photo and the menu both need that
// token to save. Kept in a ref so the "Intentar de nuevo" button can pick
// up exactly where the last attempt stopped: the restaurant itself already
// exists by then, so re-submitting the whole form would create a duplicate.
type PendingSetup = {
  token: string;
  coverFile: File;
  coverUrl: string | null;
  coverSaved: boolean;
  itemsLeft: { name: string; price: number }[];
};

/**
 * Runs `attempt` up to `tries` times, waiting a little longer between each
 * (1s, then 2s) — enough to ride out a flaky mobile connection without
 * leaving the vendor staring at a spinner forever. `attempt` signals
 * failure by returning null.
 */
async function withRetries<T>(attempt: () => Promise<T | null>, tries = 3): Promise<T | null> {
  for (let i = 0; i < tries; i++) {
    const result = await attempt();
    if (result !== null) return result;
    if (i < tries - 1) {
      await new Promise((resolve) => setTimeout(resolve, 1000 * 2 ** i));
    }
  }
  return null;
}

// Colombian prices are usually typed with a period as the thousands
// separator (10.000 = diez mil), so keep only the digits — same rule as the
// vendor's own menu page.
function parsePesos(raw: string): number {
  const digits = raw.replace(/[^\d]/g, "");
  return digits ? Number(digits) : NaN;
}

export function AddRestaurantForm({ categories }: { categories: Category[] }) {
  const [status, setStatus] = useState<"idle" | "saving" | "failed" | "retrying" | "done">(
    "idle"
  );
  const [error, setError] = useState<string | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [editLink, setEditLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  // Most Ibagué places do at least dine-in, so it starts checked — the
  // vendor can uncheck it if that's not true for them (a food truck, say).
  const [hasDineIn, setHasDineIn] = useState(true);
  const [hasTakeout, setHasTakeout] = useState(false);
  const [hasDelivery, setHasDelivery] = useState(false);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [menuRows, setMenuRows] = useState<MenuRow[]>([{ key: 0, name: "", price: "" }]);
  const nextRowKey = useRef(1);
  const pendingSetup = useRef<PendingSetup | null>(null);

  // Frees the temporary preview URL once it's replaced or the form goes
  // away, so the browser doesn't hold on to the picked file's memory.
  useEffect(() => {
    return () => {
      if (coverPreview) URL.revokeObjectURL(coverPreview);
    };
  }, [coverPreview]);

  function handleCoverChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    setCoverFile(file);
    setCoverPreview(file ? URL.createObjectURL(file) : null);
  }

  function updateMenuRow(key: number, field: "name" | "price", value: string) {
    setMenuRows((rows) => rows.map((row) => (row.key === key ? { ...row, [field]: value } : row)));
  }

  function addMenuRow() {
    setMenuRows((rows) => [...rows, { key: nextRowKey.current++, name: "", price: "" }]);
  }

  function removeMenuRow(key: number) {
    setMenuRows((rows) => rows.filter((row) => row.key !== key));
  }

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

    // Honeypot: a real visitor never fills this in, since it's hidden with
    // display:none (not just visually clipped) — that's what actually keeps
    // browsers and password managers from autofilling it. Its name is also
    // deliberately meaningless ("no known-website/company field for
    // autofill to latch onto") rather than something like "company_website",
    // which Chrome and some password managers were autofilling on their
    // own, silently triggering this bot check for real vendors.
    if (String(data.get("extra_confirm_9f2") ?? "").trim() !== "") {
      setStatus("done");
      return;
    }

    const name = String(data.get("name") ?? "").trim();
    const neighborhood = String(data.get("neighborhood") ?? "").trim();
    const priceLevel = String(data.get("priceLevel") ?? "");
    const phoneNumber = String(data.get("phoneNumber") ?? "").trim();
    const whatsappNumber = String(data.get("whatsappNumber") ?? "").trim();
    const hoursText = String(data.get("hoursText") ?? "").trim();
    const address = String(data.get("address") ?? "").trim();

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
    if (!address) {
      setError(
        "Agrega una dirección — aunque sea solo domicilio, alguien necesita poder ubicarte si hay un problema con un pedido."
      );
      return;
    }
    if (!coverFile) {
      setError("Agrega una foto principal de tu restaurante.");
      return;
    }

    // Rows left completely blank are just ignored; a half-filled one is
    // almost certainly a mistake, so it's flagged instead of dropped.
    const menuItems: { name: string; price: number }[] = [];
    for (const row of menuRows) {
      const itemName = row.name.trim();
      const itemPrice = row.price.trim();
      if (!itemName && !itemPrice) continue;
      const price = parsePesos(itemPrice);
      if (!itemName || Number.isNaN(price) || price < 0) {
        setError("Cada plato necesita nombre y un precio válido en pesos.");
        return;
      }
      menuItems.push({ name: itemName, price });
    }
    if (menuItems.length === 0) {
      setError("Agrega al menos un plato de tu menú, con nombre y precio.");
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
      address,
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

    pendingSetup.current = {
      token: result.editToken,
      coverFile,
      coverUrl: null,
      coverSaved: false,
      itemsLeft: menuItems,
    };
    await finishSetup();
  }

  // Uploads the cover photo and saves the menu for the restaurant that was
  // just created, retrying each step a few times. If a step still fails,
  // the vendor lands on an error screen whose button calls this again —
  // steps that already succeeded are skipped, so nothing gets duplicated.
  async function finishSetup() {
    const setup = pendingSetup.current;
    if (!setup) return;

    if (!setup.coverSaved) {
      if (!setup.coverUrl) {
        // Not foldered by token or restaurant id: the token is the vendor's
        // password and photo URLs are public, and submit_restaurant doesn't
        // hand back the id.
        setup.coverUrl = await withRetries(() => uploadPhoto(setup.coverFile, "restaurants/signup"));
      }
      const coverUrl = setup.coverUrl;
      if (coverUrl) {
        setup.coverSaved =
          (await withRetries(async () =>
            (await setRestaurantPhoto(setup.token, coverUrl)) ? true : null
          )) !== null;
      }
      if (!setup.coverSaved) {
        setStatus("failed");
        return;
      }
    }

    while (setup.itemsLeft.length > 0) {
      const item = setup.itemsLeft[0];
      const saved = await withRetries(async () => {
        const saveResult = await addMenuItem(setup.token, item.name, item.price);
        return "error" in saveResult ? null : saveResult;
      });
      if (!saved) {
        setStatus("failed");
        return;
      }
      setup.itemsLeft.shift();
    }

    setEditLink(`${window.location.origin}/mi-restaurante/${setup.token}`);
    setStatus("done");
  }

  async function handleRetry() {
    setStatus("retrying");
    await finishSetup();
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

  if (status === "failed" || status === "retrying") {
    return (
      <div className="form-success">
        <span className="form-success-emoji" aria-hidden="true">
          ⚠️
        </span>
        <h2>Algo salió mal</h2>
        <p>
          No pudimos terminar de subir la foto o el menú de tu restaurante —
          puede ser la conexión. Revisa tu internet e intenta de nuevo; no
          tienes que volver a llenar el formulario.
        </p>
        <button
          type="button"
          className="form-submit form-retry"
          disabled={status === "retrying"}
          onClick={handleRetry}
        >
          {status === "retrying" ? "Reintentando..." : "Intentar de nuevo"}
        </button>
      </div>
    );
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
          pronto — normalmente en uno o dos días.
        </p>

        {editLink && (
          <div className="edit-link-box">
            <p className="edit-link-intro">Este es tu enlace privado. Con él puedes:</p>
            <ul className="edit-link-uses">
              <li>Editar la información de tu restaurante</li>
              <li>Agregar o cambiar platos, precios y fotos de tu menú</li>
              <li>Ver cuántas personas visitan tu página</li>
            </ul>
            <p className="edit-link-warning">
              ⚠️ Guárdalo en un lugar seguro (por ejemplo, envíatelo a ti
              mismo por WhatsApp o correo). Lo vas a necesitar, y si lo
              pierdes no podemos recuperarlo.
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
      {/* Hidden from real visitors via display:none, but a bot filling
          every field it finds will still fill this in — see the honeypot
          check above. */}
      <div className="form-hp" aria-hidden="true">
        <label htmlFor="extra_confirm_9f2">No llenar este campo</label>
        <input id="extra_confirm_9f2" name="extra_confirm_9f2" type="text" tabIndex={-1} autoComplete="off" />
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
        <label htmlFor="whatsappNumber">Número de WhatsApp</label>
        <input
          id="whatsappNumber"
          name="whatsappNumber"
          type="tel"
          placeholder="Ej: 3001234567 (sin +57, solo el número)"
        />
        <p className="field-hint">
          La mayoría de tus clientes va a preferir escribirte antes que
          llamar — agrégalo si lo tienes. Si es el mismo número de arriba,
          repítelo aquí.
        </p>
      </div>

      <div className="field">
        <label htmlFor="hoursText">Horario *</label>
        <input id="hoursText" name="hoursText" type="text" required placeholder="Ej: Lun-Sáb 11am-9pm" />
      </div>

      <div className="field">
        <label htmlFor="address">Dirección *</label>
        <input
          id="address"
          name="address"
          type="text"
          required
          placeholder="Ej: Carrera 5 #12-34, o Esquina Calle 15 con Carrera 3"
        />
        <p className="field-hint">
          Toda ubicación cuenta, incluso si solo haces domicilios — así
          alguien puede ubicarte si hay un problema con un pedido. No tiene
          que ser una dirección formal — un punto de referencia también
          sirve (&quot;frente al parque de Belén&quot;, &quot;esquina de la
          15 con 3ra&quot;).
        </p>
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
        <span className="field-label-static">Foto principal *</span>
        <label className="cover-photo-label">
          {coverPreview ? (
            <img src={coverPreview} alt="" className="cover-photo" />
          ) : (
            <span className="cover-photo-placeholder">
              📷 Toca aquí para elegir una foto de tu restaurante
            </span>
          )}
          <input
            type="file"
            accept="image/*"
            className="cover-photo-input"
            aria-label="Foto principal de tu restaurante"
            onChange={handleCoverChange}
          />
        </label>
        <p className="field-hint">
          {coverPreview
            ? "Toca la foto para cambiarla."
            : "Aparece en tu página y en las categorías — sube algo que dé ganas de ir a comer."}
        </p>
      </div>

      <div className="field">
        <span className="field-label-static">Tu menú *</span>
        <p className="field-hint">
          Agrega al menos un plato con su precio. Después puedes agregar más
          y ponerles foto desde tu enlace privado.
        </p>
        {menuRows.map((row) => (
          <div className="signup-menu-row" key={row.key}>
            <input
              type="text"
              value={row.name}
              onChange={(e) => updateMenuRow(row.key, "name", e.target.value)}
              placeholder="Ej: Tamal tolimense"
              aria-label="Nombre del plato"
            />
            <input
              type="text"
              inputMode="numeric"
              value={row.price}
              onChange={(e) => updateMenuRow(row.key, "price", e.target.value)}
              placeholder="Ej: 15.000"
              aria-label="Precio en pesos"
            />
            {menuRows.length > 1 && (
              <button
                type="button"
                className="signup-menu-remove"
                onClick={() => removeMenuRow(row.key)}
                aria-label="Quitar este plato"
              >
                ✕
              </button>
            )}
          </div>
        ))}
        <button type="button" className="signup-menu-add" onClick={addMenuRow}>
          + Agregar otro plato
        </button>
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
