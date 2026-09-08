"use client";

import { use, useEffect, useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import {
  getRestaurantByEditToken,
  getMenuItemsByRestaurant,
  addMenuItem,
  deleteMenuItem,
} from "@/lib/queries";
import type { Restaurant, MenuItem } from "@/lib/queries";

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
    })();

    return () => {
      cancelled = true;
    };
  }, [token]);

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

    setAdding(true);
    const result = await addMenuItem(token, name, price);
    setAdding(false);

    if ("error" in result) {
      setItemError(result.error);
      return;
    }

    setMenuItems((current) => [...current, result]);
    form.reset();
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

      <p className="manage-note">
        {restaurant.is_approved
          ? "Tu restaurante ya está visible para todos en Sabores de Ibagué."
          : "Todavía estamos revisando tu restaurante, pero puedes agregar tu menú desde ya — se publicará junto con el resto en cuanto lo aprobemos."}
      </p>

      <h2 className="manage-section-title">Tu menú</h2>

      {menuItems.length === 0 ? (
        <p className="menu-empty">Todavía no has agregado ningún plato.</p>
      ) : (
        <ul className="menu-list">
          {menuItems.map((item) => (
            <li className="menu-item" key={item.id}>
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
