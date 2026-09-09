import { supabase } from "@/lib/supabase";
import type { Tables } from "@/types/database";

export type Category = Tables<"categories">;
export type Restaurant = Tables<"restaurants">;
export type MenuItem = Tables<"menu_items">;

/** All categories, in the order they should display (sort_order). */
export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("getCategories failed:", error.message);
    return [];
  }
  return data ?? [];
}

/** A single category by its slug, or null if it doesn't exist. */
export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error("getCategoryBySlug failed:", error.message);
    return null;
  }
  return data;
}

/**
 * Approved restaurants tagged with a given category, newest first.
 * Restaurants aren't public until is_approved = true (see
 * supabase/migrations/0001_initial_schema.sql), so this only ever returns
 * what a shopper is actually meant to see.
 */
export async function getApprovedRestaurantsByCategory(
  categoryId: string
): Promise<Restaurant[]> {
  const { data, error } = await supabase
    .from("restaurant_categories")
    .select("restaurants(*)")
    .eq("category_id", categoryId);

  if (error) {
    console.error("getApprovedRestaurantsByCategory failed:", error.message);
    return [];
  }

  return (data ?? [])
    .map((row) => row.restaurants)
    .filter((r): r is Restaurant => r !== null && r.is_approved);
}

/** A single approved restaurant by its slug, for its public page — null if it doesn't exist or isn't approved yet. */
export async function getRestaurantBySlug(slug: string): Promise<Restaurant | null> {
  const { data, error } = await supabase
    .from("restaurants")
    .select("*")
    .eq("slug", slug)
    .eq("is_approved", true)
    .maybeSingle();

  if (error) {
    console.error("getRestaurantBySlug failed:", error.message);
    return null;
  }
  return data;
}

/** A restaurant's menu, in display order. Menu items have no approval gate of their own. */
export async function getMenuItemsByRestaurant(restaurantId: string): Promise<MenuItem[]> {
  const { data, error } = await supabase
    .from("menu_items")
    .select("*")
    .eq("restaurant_id", restaurantId)
    .order("sort_order", { ascending: true })
    .order("id", { ascending: true });

  if (error) {
    console.error("getMenuItemsByRestaurant failed:", error.message);
    return [];
  }
  return data ?? [];
}

/**
 * Looks up a restaurant by its private edit token — the one thing that
 * works even before it's approved, since a vendor needs to be able to
 * build out their own listing while it's still waiting on you. Safe
 * because it goes through a database function that only ever returns the
 * one row matching the exact token (see the `get_restaurant_by_edit_token`
 * function), not a general "restaurants" read.
 */
export async function getRestaurantByEditToken(token: string): Promise<Restaurant | null> {
  const { data, error } = await supabase.rpc("get_restaurant_by_edit_token", {
    p_token: token,
  });

  if (error) {
    console.error("getRestaurantByEditToken failed:", error.message);
    return null;
  }
  return data?.[0] ?? null;
}

/** Adds a menu item to whichever restaurant this edit token belongs to. */
export async function addMenuItem(
  token: string,
  name: string,
  price: number,
  photoUrl?: string
): Promise<MenuItem | { error: string }> {
  const { data, error } = await supabase.rpc("add_menu_item_by_token", {
    p_token: token,
    p_name: name,
    p_price: price,
    p_photo_url: photoUrl || "",
  });

  if (error || !data || data.length === 0) {
    console.error("addMenuItem failed:", error?.message);
    return { error: "No pudimos guardar el plato. Intenta de nuevo." };
  }
  return data[0];
}

/** Removes a menu item — only works if the token actually owns that item. */
export async function deleteMenuItem(token: string, itemId: string): Promise<boolean> {
  const { error } = await supabase.rpc("delete_menu_item_by_token", {
    p_token: token,
    p_item_id: itemId,
  });

  if (error) {
    console.error("deleteMenuItem failed:", error.message);
    return false;
  }
  return true;
}

/** Sets or replaces a single dish's photo — used both when a photo is added
 *  right at creation and when one is added or swapped later. */
export async function setMenuItemPhoto(
  token: string,
  itemId: string,
  photoUrl: string
): Promise<boolean> {
  const { error } = await supabase.rpc("set_menu_item_photo_by_token", {
    p_token: token,
    p_item_id: itemId,
    p_photo_url: photoUrl,
  });

  if (error) {
    console.error("setMenuItemPhoto failed:", error.message);
    return false;
  }
  return true;
}

/** Sets or replaces the restaurant's own cover photo. */
export async function setRestaurantPhoto(token: string, photoUrl: string): Promise<boolean> {
  const { error } = await supabase.rpc("set_restaurant_photo_by_token", {
    p_token: token,
    p_photo_url: photoUrl,
  });

  if (error) {
    console.error("setRestaurantPhoto failed:", error.message);
    return false;
  }
  return true;
}

/** How many restaurants are live right now — used for the home page's empty state. */
export async function getApprovedRestaurantCount(): Promise<number> {
  const { count, error } = await supabase
    .from("restaurants")
    .select("*", { count: "exact", head: true })
    .eq("is_approved", true);

  if (error) {
    console.error("getApprovedRestaurantCount failed:", error.message);
    return 0;
  }
  return count ?? 0;
}

export type PendingMenuItem = {
  id: string;
  name: string;
  price: number | null;
  photo_url: string | null;
};

export type PendingRestaurant = {
  id: string;
  name: string;
  neighborhood: string;
  price_level: string;
  whatsapp_number: string | null;
  phone_number: string;
  hours_text: string | null;
  maps_link: string | null;
  blurb: string | null;
  photo_url: string | null;
  created_at: string;
  has_delivery: boolean;
  has_takeout: boolean;
  has_dine_in: boolean;
  menu_items: PendingMenuItem[];
};

/**
 * The restaurants waiting on moderation, each with its own menu items
 * nested right alongside it — built specifically so a phone-in-hand review
 * doesn't mean hunting through separate tables to match a dish photo back
 * to the restaurant it belongs to.
 *
 * There's no login system on this site, so — same idea as a vendor's edit
 * link — this only works if `adminKey` matches the secret baked into the
 * `admin_list_pending` database function. Wrong key, or no key, just gets
 * back an empty list instead of an error.
 */
export async function getPendingRestaurants(adminKey: string): Promise<PendingRestaurant[]> {
  const { data, error } = await supabase.rpc("admin_list_pending", { p_key: adminKey });

  if (error) {
    console.error("getPendingRestaurants failed:", error.message);
    return [];
  }
  return (data ?? []) as unknown as PendingRestaurant[];
}

/** Publishes a restaurant — same effect as flipping is_approved to true by hand. */
export async function approveRestaurant(adminKey: string, id: string): Promise<boolean> {
  const { error } = await supabase.rpc("admin_approve_restaurant", {
    p_key: adminKey,
    p_id: id,
  });

  if (error) {
    console.error("approveRestaurant failed:", error.message);
    return false;
  }
  return true;
}

/** Permanently deletes a restaurant (and its menu items, categories) — for spam/test submissions. */
export async function rejectRestaurant(adminKey: string, id: string): Promise<boolean> {
  const { error } = await supabase.rpc("admin_reject_restaurant", {
    p_key: adminKey,
    p_id: id,
  });

  if (error) {
    console.error("rejectRestaurant failed:", error.message);
    return false;
  }
  return true;
}

export type NewRestaurantInput = {
  name: string;
  neighborhood: string;
  priceLevel: "$" | "$$" | "$$$";
  // Phone is the one every real restaurant has to have — same idea as the
  // "Call" button in Google's map pack, which shows up whether or not a
  // place has WhatsApp. WhatsApp is a bonus on top of that, not a
  // replacement for it.
  phoneNumber: string;
  whatsappNumber?: string;
  hoursText?: string;
  mapsLink?: string;
  blurb?: string;
  categoryIds: string[];
  hasDelivery: boolean;
  hasTakeout: boolean;
  hasDineIn: boolean;
};

function slugify(name: string): string {
  const base = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  // A random suffix sidesteps slug collisions (two "Donde Pepe"s, say)
  // without needing a retry-on-conflict dance.
  const suffix = Math.random().toString(36).slice(2, 6);
  return `${base || "restaurante"}-${suffix}`;
}

/**
 * Submits a new restaurant from the public "add your restaurant" form.
 * It always lands unapproved — the database function behind this never
 * touches is_approved or is_featured, so they stay on their defaults
 * (false) no matter what — a moderator has to publish it by hand in the
 * Supabase dashboard before shoppers ever see it.
 *
 * This goes through a database function (submit_restaurant) rather than a
 * plain table insert. A plain insert looked simpler, but Supabase hands
 * the newly-created row back by default, and Postgres re-checks that row
 * against the "only show approved restaurants" read rule before handing
 * it back — which a brand new, not-yet-approved submission can never
 * pass, so the whole save was silently failing. Doing the insert inside a
 * database function sidesteps that rule entirely, the same way the
 * private "manage my menu" functions already do.
 */
export async function submitRestaurant(
  input: NewRestaurantInput
): Promise<{ editToken: string } | { error: string }> {
  const { data, error } = await supabase.rpc("submit_restaurant", {
    p_name: input.name,
    p_slug: slugify(input.name),
    p_neighborhood: input.neighborhood,
    p_price_level: input.priceLevel,
    p_whatsapp_number: input.whatsappNumber || "",
    p_phone_number: input.phoneNumber,
    p_hours_text: input.hoursText || "",
    p_maps_link: input.mapsLink || "",
    p_blurb: input.blurb || "",
    p_category_ids: input.categoryIds,
    p_has_delivery: input.hasDelivery,
    p_has_takeout: input.hasTakeout,
    p_has_dine_in: input.hasDineIn,
  });

  if (error || !data) {
    console.error("submitRestaurant failed:", error?.message);
    return {
      error:
        "No pudimos guardar tu restaurante. Intenta de nuevo en un momento.",
    };
  }

  return { editToken: data };
}
