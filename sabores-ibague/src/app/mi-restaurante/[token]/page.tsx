"use client";

import { use, useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import Link from "next/link";
import {
  getRestaurantByEditToken,
  getMenuItemsByRestaurant,
  addMenuItem,
  deleteMenuItem,
  setMenuItemPhoto,
  setRestaurantPhoto,
  getRestaurantStats,
  getCategories,
  getRestaurantCategories,
  updateRestaurantInfo,
} from "@/lib/queries";
import type { Category, Restaurant, MenuItem, RestaurantStats } from "@/lib/queries";
import { uploadPhoto } from "@/lib/uploadPhoto";
import { CategoryIcon } from "@/components/CategoryIcon";

const pesos = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

const PRICE_LEVELS = [
  { value: "$", label: "$ — Económico (hasta $15.000 por persona)" },
  { value: "$$", label: "$$ — Precio medio ($15.000–$30.000 por persona)" },
  { value: "$$$", label: "$$$ — Más alto (más de $30.000 por persona)" },
] as const;

export default function ManageRestaurantPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = use(params);

  const [restaurant, setRestaurant] = useState<Restaurant | null | undefined>(
    undefined // undefined = still loading, null = invalid/not found
  );
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [itemError, setItemError] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingItemPhotoId, setUploadingItemPhotoId] = useState<string | null>(null);
  const [newItemPhotoFile, setNewItemPhotoFile] = useState<File | null>(null);
  const [newItemPhotoPreview, setNewItemPhotoPreview] = useState<string | null>(null);
  const [stats, setStats] = useState<RestaurantStats>({
    callCount: 0,
    whatsappCount: 0,
    viewCount: 0,
    impressionCount: 0,
  });

  // --- editing the restaurant's own info (everything except the slug,
  // which is what its URL is built from and never changes) -------------
  const [categories, setCategories] = useState<Category[]>([]);
  const [editing, setEditing] = useState(false);
  const [savingInfo, setSavingInfo] = useState(false);
  const [infoError, setInfoError] = useState<string | null>(null);
  const [infoSaved, setInfoSaved] = useState(false);
  const [editHasDineIn, setEditHasDineIn] = useState(true);
  const [editHasTakeout, setEditHasTakeout] = useState(false);
  const [editHasDelivery, setEditHasDelivery] = useState(false);
  const [editCategoryIds, setEditCategoryIds] = useState<string[]>([]);

  function toggleEditCategory(id: string) {
    setEditCategoryIds((current) =>
      current.includes(id) ? current.filter((c) => c !== id) : [...current, id]
    );
  }

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const [found, cats] = await Promise.all([
        getRestaurantByEditToken(token),
        getCategories(),
      ]);
      if (cancelled) return;
      setRestaurant(found);
      setCategories(cats);

      if (found) {
        const [items, restaurantCats] = await Promise.all([
          getMenuItemsByRestaurant(found.id),
          getRestaurantCategories(found.id),
        ]);
        if (cancelled) return;
        setMenuItems(items);
        setEditHasDineIn(found.has_dine_in);
        setEditHasTakeout(found.has_takeout);
        setEditHasDelivery(found.has_delivery);
        setEditCategoryIds(restaurantCats.map((c) => c.id));
      }

      const restaurantStats = await getRestaurantStats(token);
      if (!cancelled) setStats(restaurantStats);
    })();

    return () => {
      cancelled = true;
    };
  }, [token]);

  // The preview is a temporary local URL for the file the vendor just
  // picked, before it's actually uploaded — this frees it once it's no
  // longer needed, so the browser doesn't quietly leak memory over time.
  useEffect(() => {
    return () => {
      if (newItemPhotoPreview) URL.revokeObjectURL(newItemPhotoPreview);
    };
  }, [newItemPhotoPreview]);

  async function handleCoverPhotoChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || !restaurant) return;

    setUploadingCover(true);
    const url = await uploadPhoto(file, `restaurants/${restaurant.id}`);
    if (url) {
      const ok = await setRestaurantPhoto(token, url);
      if (ok) {
        setRestaurant((current) => (current ? { ...current, photo_url: url } : current));
      }
    }
    setUploadingCover(false);
  }

  function handleNewItemPhotoChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    if (newItemPhotoPreview) URL.revokeObjectURL(newItemPhotoPreview);
    setNewItemPhotoFile(file);
    setNewItemPhotoPreview(file ? URL.createObjectURL(file) : null);
  }

  async function handleItemPhotoChange(itemId: string, event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || !restaurant) return;

    setUploadingItemPhotoId(itemId);
    const url = await uploadPhoto(file, `restaurants/${restaurant.id}/items`);
    if (url) {
      const ok = await setMenuItemPhoto(token, itemId, url);
      if (ok) {
        setMenuItems((current) =>
          current.map((item) => (item.id === itemId ? { ...item, photo_url: url } : item))
        );
      }
    }
    setUploadingItemPhotoId(null);
  }

  async function handleAddItem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setItemError(null);

    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("itemName") ?? "").trim();
    const priceRaw = String(data.get("itemPrice") ?? "").trim();
    // Colombian prices are usually typed with a period as the thousands
    // separator (10.000 = diez mil), which a plain Number() would read as
    // 10. Stripping everything but the digits sidesteps that entirely —
    // "10.000", "10,000" and "10000" all end up meaning the same thing.
    const priceDigits = priceRaw.replace(/[^\d]/g, "");
    const price = priceDigits ? Number(priceDigits) : NaN;

    if (!name) {
      setItemError("Escribe el nombre del plato.");
      return;
    }
    if (!priceRaw || Number.isNaN(price) || price < 0) {
      setItemError("Escribe un precio válido en pesos.");
      return;
    }
    if (!restaurant) return;

    setAdding(true);

    let photoUrl: string | undefined;
    if (newItemPhotoFile) {
      const uploaded = await uploadPhoto(newItemPhotoFile, `restaurants/${restaurant.id}/items`);
      if (uploaded) photoUrl = uploaded;
    }

    const result = await addMenuItem(token, name, price, photoUrl);
    setAdding(false);

    if ("error" in result) {
      setItemError(result.error);
      return;
    }

    setMenuItems((current) => [...current, result]);
    form.reset();
    if (newItemPhotoPreview) URL.revokeObjectURL(newItemPhotoPreview);
    setNewItemPhotoFile(null);
    setNewItemPhotoPreview(null);
  }

  async function handleDeleteItem(itemId: string) {
    setDeletingId(itemId);
    const ok = await deleteMenuItem(token, itemId);
    setDeletingId(null);
    if (ok) {
      setMenuItems((current) => current.filter((item) => item.id !== itemId));
    }
  }

  async function handleSaveInfo(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setInfoError(null);
    if (!restaurant) return;

    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("editName") ?? "").trim();
    const neighborhood = String(data.get("editNeighborhood") ?? "").trim();
    const priceLevel = String(data.get("editPriceLevel") ?? "");
    const phoneNumber = String(data.get("editPhone") ?? "").trim();
    const whatsappNumber = String(data.get("editWhatsapp") ?? "").trim();
    const hoursText = String(data.get("editHours") ?? "").trim();
    const mapsLink = String(data.get("editMapsLink") ?? "").trim();
    const blurb = String(data.get("editBlurb") ?? "").trim();
    const address = String(data.get("editAddress") ?? "").trim();

    if (!name || !neighborhood || !phoneNumber || !address) {
      setInfoError("Nombre, barrio, teléfono y dirección son obligatorios.");
      return;
    }
    if (priceLevel !== "$" && priceLevel !== "$$" && priceLevel !== "$$$") {
      setInfoError("Selecciona un rango de precios.");
      return;
    }
    if (editCategoryIds.length === 0) {
      setInfoError("Selecciona al menos una categoría.");
      return;
    }
    if (!editHasDineIn && !editHasTakeout && !editHasDelivery) {
      setInfoError("Selecciona al menos una opción: domicilio, para llevar o comer en el sitio.");
      return;
    }

    setSavingInfo(true);
    const ok = await updateRestaurantInfo(token, {
      name,
      neighborhood,
      priceLevel,
      whatsappNumber,
      phoneNumber,
      hoursText,
      mapsLink,
      blurb,
      address,
      hasDelivery: editHasDelivery,
      hasTakeout: editHasTakeout,
      hasDineIn: editHasDineIn,
      categoryIds: editCategoryIds,
    });
    setSavingInfo(false);

    if (!ok) {
      setInfoError("No pudimos guardar los cambios. Intenta de nuevo.");
      return;
    }

    setRestaurant((current) =>
      current
        ? {
            ...current,
            name,
            neighborhood,
            price_level: priceLevel,
            whatsapp_number: whatsappNumber || null,
            phone_number: phoneNumber,
            hours_text: hoursText || null,
            maps_link: mapsLink || null,
            blurb: blurb || null,
            address,
            has_delivery: editHasDelivery,
            has_takeout: editHasTakeout,
            has_dine_in: editHasDineIn,
          }
        : current
    );
    setInfoSaved(true);
    setEditing(false);
    setTimeout(() => setInfoSaved(false), 4000);
  }

  if (restaurant === undefined) {
    return (
      <main className="wrap manage-page">
        <p className="manage-loading">Cargando tu restaurante...</p>
      </main>
    );
  }

  if (restaurant === null) {
    return (
      <main className="wrap manage-page">
        <p className="manage-notfound">
          Este enlace no es válido. Revisa que lo copiaste completo, o
          escríbenos si crees que esto es un error.
        </p>
        <Link href="/" className="back-link">
          ← Volver al inicio
        </Link>
      </main>
    );
  }

  return (
    <main className="wrap manage-page">
      <Link href="/" className="back-link">
        ← Volver al inicio
      </Link>

      <div className="manage-head">
        <h1>{restaurant.name}</h1>
        <span className={`status-badge ${restaurant.is_approved ? "is-published" : "is-pending"}`}>
          {restaurant.is_approved ? "Publicado" : "Pendiente de revisión"}
        </span>
      </div>

      <div className="stats-box">
        <div className="stats-box-item">
          <span className="stats-box-number">{stats.impressionCount}</span>
          <span className="stats-box-label">👀 Impresiones</span>
        </div>
        <div className="stats-box-item">
          <span className="stats-box-number">{stats.viewCount}</span>
          <span className="stats-box-label">📄 Vistas de tu página</span>
        </div>
        <div className="stats-box-item">
          <span className="stats-box-number">{stats.callCount}</span>
          <span className="stats-box-label">📞 Llamadas</span>
        </div>
        <div className="stats-box-item">
          <span className="stats-box-number">{stats.whatsappCount}</span>
          <span className="stats-box-label">💬 WhatsApp</span>
        </div>
      </div>
      <p className="stats-box-hint">
        Impresiones: cuántas veces tu restaurante apareció en una categoría.
        Vistas: cuántas veces alguien entró a tu página completa. Llamadas y
        WhatsApp: cuántas veces tocaron esos botones — prueba real de que
        Colcocina te está mandando clientes, incluso antes de que suene el
        teléfono.
      </p>

      <p className="manage-note">
        {restaurant.is_approved
          ? "Tu restaurante ya está visible para todos en Colcocina."
          : "Todavía estamos revisando tu restaurante, pero puedes agregar tu menú desde ya — se publicará junto con el resto en cuanto lo aprobemos."}
      </p>

      <div className="cover-photo-wrap">
        <label className="cover-photo-label">
          {uploadingCover ? (
            <span className="cover-photo-placeholder">Subiendo foto...</span>
          ) : restaurant.photo_url ? (
            <img src={restaurant.photo_url} alt={restaurant.name} className="cover-photo" />
          ) : (
            <span className="cover-photo-placeholder">
              📷 Agregar foto principal de tu restaurante
            </span>
          )}
          <input
            type="file"
            accept="image/*"
            className="cover-photo-input"
            disabled={uploadingCover}
            onChange={handleCoverPhotoChange}
          />
        </label>
        <p className="cover-photo-hint">
          {restaurant.photo_url
            ? "Toca la foto para cambiarla."
            : "Esta foto aparece en tu página y en las categorías — sube algo que dé ganas de ir a comer."}
        </p>
      </div>

      {infoSaved && <p className="manage-edit-saved">✅ Guardamos tus cambios.</p>}

      {!editing && (
        <button type="button" className="manage-edit-toggle" onClick={() => setEditing(true)}>
          ✏️ Editar información del restaurante
        </button>
      )}

      {editing && (
        <form className="manage-edit-form" onSubmit={handleSaveInfo}>
          <div className="field">
            <label htmlFor="editName">Nombre del negocio *</label>
            <input id="editName" name="editName" type="text" required defaultValue={restaurant.name} />
            <p className="field-hint">
              El enlace de tu página no cambia aunque cambies el nombre.
            </p>
          </div>

          <div className="field">
            <label htmlFor="editNeighborhood">Barrio *</label>
            <input
              id="editNeighborhood"
              name="editNeighborhood"
              type="text"
              required
              defaultValue={restaurant.neighborhood}
            />
          </div>

          <div className="field">
            <label htmlFor="editPriceLevel">Rango de precios *</label>
            <select id="editPriceLevel" name="editPriceLevel" required defaultValue={restaurant.price_level}>
              {PRICE_LEVELS.map((level) => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="editPhone">Teléfono *</label>
            <input
              id="editPhone"
              name="editPhone"
              type="tel"
              required
              defaultValue={restaurant.phone_number}
            />
          </div>

          <div className="field">
            <label htmlFor="editWhatsapp">Número de WhatsApp</label>
            <input
              id="editWhatsapp"
              name="editWhatsapp"
              type="tel"
              defaultValue={restaurant.whatsapp_number ?? ""}
              placeholder="Ej: 3001234567 (sin +57, solo el número)"
            />
          </div>

          <div className="field">
            <label htmlFor="editHours">Horario</label>
            <input
              id="editHours"
              name="editHours"
              type="text"
              defaultValue={restaurant.hours_text ?? ""}
              placeholder="Ej: Lun-Sáb 11am-9pm"
            />
          </div>

          <div className="field">
            <label htmlFor="editAddress">Dirección *</label>
            <input
              id="editAddress"
              name="editAddress"
              type="text"
              required
              defaultValue={restaurant.address ?? ""}
            />
          </div>

          <div className="field">
            <label htmlFor="editMapsLink">Enlace de Google Maps (opcional)</label>
            <input
              id="editMapsLink"
              name="editMapsLink"
              type="url"
              defaultValue={restaurant.maps_link ?? ""}
              placeholder="https://maps.google.com/..."
            />
          </div>

          <div className="field">
            <label htmlFor="editBlurb">Cuéntanos de tu restaurante (opcional)</label>
            <textarea id="editBlurb" name="editBlurb" rows={3} defaultValue={restaurant.blurb ?? ""} />
          </div>

          <div className="field">
            <span className="field-label-static">¿Cómo atiendes? *</span>
            <div className="service-checks">
              <label className="service-check">
                <input
                  type="checkbox"
                  checked={editHasDineIn}
                  onChange={() => setEditHasDineIn((v) => !v)}
                />
                <span aria-hidden="true">🍽️</span>
                <span>Comer en el sitio</span>
              </label>
              <label className="service-check">
                <input
                  type="checkbox"
                  checked={editHasTakeout}
                  onChange={() => setEditHasTakeout((v) => !v)}
                />
                <span aria-hidden="true">🥡</span>
                <span>Para llevar</span>
              </label>
              <label className="service-check">
                <input
                  type="checkbox"
                  checked={editHasDelivery}
                  onChange={() => setEditHasDelivery((v) => !v)}
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
                    checked={editCategoryIds.includes(category.id)}
                    onChange={() => toggleEditCategory(category.id)}
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

          {infoError && <p className="form-error">{infoError}</p>}

          <div className="manage-edit-actions">
            <button type="submit" className="form-submit" disabled={savingInfo}>
              {savingInfo ? "Guardando..." : "Guardar cambios"}
            </button>
            <button
              type="button"
              className="manage-edit-cancel"
              disabled={savingInfo}
              onClick={() => setEditing(false)}
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      <h2 className="manage-section-title">Tu menú</h2>

      {menuItems.length === 0 ? (
        <p className="menu-empty">Todavía no has agregado ningún plato.</p>
      ) : (
        <ul className="menu-list">
          {menuItems.map((item) => (
            <li className="menu-item" key={item.id}>
              <label className="menu-item-photo-label">
                {uploadingItemPhotoId === item.id ? (
                  <span className="menu-item-photo-placeholder" aria-hidden="true">
                    …
                  </span>
                ) : item.photo_url ? (
                  <img src={item.photo_url} alt="" className="menu-item-photo" />
                ) : (
                  <span className="menu-item-photo-placeholder" aria-hidden="true">
                    📷
                  </span>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="menu-item-photo-input"
                  disabled={uploadingItemPhotoId === item.id}
                  onChange={(event) => handleItemPhotoChange(item.id, event)}
                />
              </label>
              <span className="menu-item-name">{item.name}</span>
              <span className="menu-item-right">
                <span className="menu-item-price">
                  {item.price !== null ? pesos.format(item.price) : "—"}
                </span>
                <button type="button" className="menu-item-delete" disabled={deletingId === item.id} onClick={() => handleDeleteItem(item.id)}>
                  {deletingId === item.id ? "Borrando..." : "Borrar"}
                </button>
              </span>
            </li>
          ))}
        </ul>
      )}

      <form className="add-item-form" onSubmit={handleAddItem}>
        <label className="menu-item-photo-label add-item-photo-label">
          {newItemPhotoPreview ? (
            <img src={newItemPhotoPreview} alt="" className="menu-item-photo" />
          ) : (
            <span className="menu-item-photo-placeholder" aria-hidden="true">
              📷
            </span>
          )}
          <input
            type="file"
            accept="image/*"
            className="menu-item-photo-input"
            onChange={handleNewItemPhotoChange}
          />
        </label>
        <input
          type="text"
          name="itemName"
          placeholder="Ej: Tamal tolimense"
          aria-label="Nombre del plato"
        />
        <input
          type="text"
          inputMode="numeric"
          name="itemPrice"
          placeholder="Ej: 15.000"
          aria-label="Precio en pesos"
        />
        <button type="submit" disabled={adding}>
          {adding ? "Agregando..." : "Agregar plato"}
        </button>
      </form>
      {itemError && <p className="form-error">{itemError}</p>}
    </main>
  );
}
