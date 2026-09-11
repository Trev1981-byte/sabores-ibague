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
  getContactClickCounts,
} from "@/lib/queries";
import type { Restaurant, MenuItem, ContactClickCounts } from "@/lib/queries";
import { uploadPhoto } from "@/lib/uploadPhoto";

const pesos = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

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
  const [clickCounts, setClickCounts] = useState<ContactClickCounts>({
    callCount: 0,
    whatsappCount: 0,
  });

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const found = await getRestaurantByEditToken(token);
      if (cancelled) return;
      setRestaurant(found);
      if (found) {
        const items = await getMenuItemsByRestaurant(found.id);
        if (!cancelled) setMenuItems(items);
      }
      const counts = await getContactClickCounts(token);
      if (!cancelled) setClickCounts(counts);
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
        <span
          className={`status-badge ${
            restaurant.is_approved ? "is-published" : "is-pending"
          }`}
        >
          {restaurant.is_approved ? "Publicado" : "Pendiente de revisión"}
        </span>
      </div>

      <div className="stats-box">
        <div className="stats-box-item">
          <span className="stats-box-number">{clickCounts.callCount}</span>
          <span className="stats-box-label">📞 Llamadas</span>
        </div>
        <div className="stats-box-item">
          <span className="stats-box-number">{clickCounts.whatsappCount}</span>
          <span className="stats-box-label">💬 WhatsApp</span>
        </div>
      </div>
      <p className="stats-box-hint">
        Cuántas veces la gente ha tocado "Llamar" o "Escribir por WhatsApp"
        en tu página — prueba real de que Colcocina te está mandando
        clientes.
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
                <button
                  type="button"
                  className="menu-item-delete"
                  disabled={deletingId === item.id}
                  onClick={() => handleDeleteItem(item.id)}
                >
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
