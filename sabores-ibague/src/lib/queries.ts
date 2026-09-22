import { supabase } from "@/lib/supabase";
import type { Tables } from "@/types/database";

export type Category = Tables<"categories">;
export type Restaurant = Tables<"restaurants">;
export type MenuItem = Tables<"menu_items">;

/** Short label for each price tier — used anywhere the raw "$" / "$$" /
 *  "$$$" symbol needs to read as an actual feature instead of just a stray
 *  currency sign (the public restaurant page, category cards, etc). */
export const PRICE_LEVEL_LABELS: Record<string, string> = {
  "$": "Económico",
  "$$": "Precio medio",
  "$$$": "Gama alta",
};

/** The badge text shown on cards and the restaurant page: the raw "$"
 *  symbol (the at-a-glance scale people already know from Google/Yelp)
 *  paired with a plain-language label, so "$$$" reads as "$$$ · Gama
 *  alta" instead of a lone symbol, or the old "Más alto" wording, which
 *  read as vague out of context and, on a vendor's own listing, could
 *  land as "the website is calling my food expensive." "Gama alta"
 *  frames the same $$$ tier as upscale/high-end instead — a restaurant's
 *  own overall price positioning (same convention Google Maps uses), not
 *  a literal per-dish number, which is why it can stay a category rather
 *  than a computed price range even though individual dishes vary. */
export function priceLevelBadge(level: string): string {
  const label = PRICE_LEVEL_LABELS[level];
  return label ? `${level} · ${label}` : level;
}

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
 * Approved restaurants tagged with a given category, in a given city,
 * newest first. Restaurants aren't public until is_approved = true (see
 * supabase/migrations/0001_initial_schema.sql), so this only ever returns
 * what a shopper is actually meant to see.
 */
export async function getApprovedRestaurantsByCategory(
  categoryId: string,
  cityName: string
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
    .filter((r): r is Restaurant => r !== null && r.is_approved && r.city === cityName)
    // Alphabetical, not insertion order — makes the list predictable for a
    // shopper scanning it, and gives the restaurant page's prev/next
    // links (see getRestaurantNeighborsInCategory) something stable to
    // walk through in the same order this page shows them in.
    .sort((a, b) => a.name.localeCompare(b.name, "es"));
}

/**
 * One random approved restaurant in a city, for the "Sorpréndeme" button —
 * picked fresh on every call (each visitor's own click gets its own draw,
 * not a single shared pick everyone's funneled toward), which spreads
 * demand across every listing instead of concentrating it on whichever
 * place happened to be "featured" at that moment. Only fetches id+slug,
 * not full rows, since a redirect is all this needs.
 */
export async function getRandomApprovedRestaurant(
  cityName: string
): Promise<{ slug: string } | null> {
  const { data, error } = await supabase
    .from("restaurants")
    .select("slug")
    .eq("city", cityName)
    .eq("is_approved", true);

  if (error) {
    console.error("getRandomApprovedRestaurant failed:", error.message);
    return null;
  }
  if (!data || data.length === 0) return null;

  return data[Math.floor(Math.random() * data.length)];
}

export type CategoryRef = {
  id: string;
  slug: string;
  label: string;
  emoji: string;
};

/**
 * Every category a restaurant is tagged under, in the same order the home
 * page lists categories in (sort_order). A restaurant can belong to more
 * than one, so the restaurant page treats the first one here as its
 * "primary" category for the prev/next links at the bottom of the page.
 */
export async function getRestaurantCategories(restaurantId: string): Promise<CategoryRef[]> {
  const { data, error } = await supabase
    .from("restaurant_categories")
    .select("categories(id, slug, label, emoji, sort_order)")
    .eq("restaurant_id", restaurantId);

  if (error) {
    console.error("getRestaurantCategories failed:", error.message);
    return [];
  }

  return (data ?? [])
    .map((row) => row.categories)
    .filter((c): c is NonNullable<typeof c> => c !== null)
    .sort((a, b) => a.sort_order - b.sort_order);
}

export type RestaurantNeighbor = { name: string; slug: string };

/**
 * The restaurant immediately before and after this one within a given
 * category, alphabetically — the same order that category's own page
 * lists them in. Powers the "anterior / siguiente" links at the bottom of
 * a restaurant's page: real, crawlable links back into that category
 * instead of a dead end, which is also just better internal linking for
 * search engines. No wraparound — the first restaurant in a category
 * simply has no "anterior," same for "siguiente" on the last.
 */
export async function getRestaurantNeighborsInCategory(
  categoryId: string,
  cityName: string,
  currentSlug: string
): Promise<{ prev: RestaurantNeighbor | null; next: RestaurantNeighbor | null }> {
  const restaurants = await getApprovedRestaurantsByCategory(categoryId, cityName);
  const index = restaurants.findIndex((r) => r.slug === currentSlug);

  if (index === -1) {
    return { prev: null, next: null };
  }

  const prev = index > 0 ? restaurants[index - 1] : null;
  const next = index < restaurants.length - 1 ? restaurants[index + 1] : null;

  return {
    prev: prev ? { name: prev.name, slug: prev.slug } : null,
    next: next ? { name: next.name, slug: next.slug } : null,
  };
}

/**
 * A single approved restaurant by its slug within a given city, for its
 * public page — null if it doesn't exist, isn't approved yet, or belongs
 * to a different city than the URL claims.
 */
export async function getRestaurantBySlug(
  slug: string,
  cityName: string
): Promise<Restaurant | null> {
  const { data, error } = await supabase
    .from("restaurants")
    .select("*")
    .eq("slug", slug)
    .eq("city", cityName)
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

export type RestaurantInfoInput = {
  name: string;
  neighborhood: string;
  priceLevel: string;
  whatsappNumber?: string;
  phoneNumber: string;
  hoursText?: string;
  mapsLink?: string;
  blurb?: string;
  address: string;
  hasDelivery: boolean;
  hasTakeout: boolean;
  hasDineIn: boolean;
  categoryIds: string[];
};

/**
 * Lets a restaurant edit its own listing — name, phone, hours, address,
 * categories, everything except the slug, which is what its URL is built
 * from and never changes no matter what this saves (see
 * update_restaurant_info_by_token). Works the same way every other
 * token-scoped write on this page does: no login, just the private link
 * standing in for one.
 */
export async function updateRestaurantInfo(
  token: string,
  info: RestaurantInfoInput
): Promise<boolean> {
  const { data, error } = await supabase.rpc("update_restaurant_info_by_token", {
    p_token: token,
    p_name: info.name,
    p_neighborhood: info.neighborhood,
    p_price_level: info.priceLevel,
    p_whatsapp_number: info.whatsappNumber || "",
    p_phone_number: info.phoneNumber,
    p_hours_text: info.hoursText || "",
    p_maps_link: info.mapsLink || "",
    p_blurb: info.blurb || "",
    p_address: info.address,
    p_has_delivery: info.hasDelivery,
    p_has_takeout: info.hasTakeout,
    p_has_dine_in: info.hasDineIn,
    p_category_ids: info.categoryIds,
  });

  if (error) {
    console.error("updateRestaurantInfo failed:", error.message);
    return false;
  }
  return data === true;
}

/** The slugs of every approved restaurant in a given city — used to build the sitemap. */
export async function getApprovedRestaurantSlugs(cityName: string): Promise<string[]> {
  const { data, error } = await supabase
    .from("restaurants")
    .select("slug")
    .eq("is_approved", true)
    .eq("city", cityName);

  if (error) {
    console.error("getApprovedRestaurantSlugs failed:", error.message);
    return [];
  }
  return (data ?? []).map((row) => row.slug);
}

export type RestaurantSearchResult = {
  id: string;
  name: string;
  slug: string;
};

/**
 * Name + slug for every approved restaurant in a city — lightweight data
 * (no photos, no menu) for the home page's search bar, so typing a
 * restaurant's actual name finds that restaurant directly instead of only
 * matching category names.
 */
export async function getApprovedRestaurantsForSearch(
  cityName: string
): Promise<RestaurantSearchResult[]> {
  const { data, error } = await supabase
    .from("restaurants")
    .select("id, name, slug")
    .eq("is_approved", true)
    .eq("city", cityName);

  if (error) {
    console.error("getApprovedRestaurantsForSearch failed:", error.message);
    return [];
  }
  return data ?? [];
}

export type MenuSearchResult = {
  id: string;
  name: string;
  restaurantName: string;
  restaurantSlug: string;
};

type MenuItemSearchRow = {
  id: string;
  name: string;
  restaurants:
    | { name: string; slug: string; is_approved: boolean; city: string }
    | { name: string; slug: string; is_approved: boolean; city: string }[]
    | null;
};

/**
 * Every dish name in a city, each tagged with the restaurant that serves
 * it — lightweight data for the home page's search bar, so typing a
 * specific food (e.g. "cheeseburger") finds the restaurants that actually
 * serve it, not just a matching category. Joins straight through to
 * restaurants so only approved, in-city dishes ever come back.
 */
export async function getMenuItemsForSearch(cityName: string): Promise<MenuSearchResult[]> {
  const { data, error } = await supabase
    .from("menu_items")
    .select("id, name, restaurants!inner(name, slug, is_approved, city)")
    .eq("restaurants.is_approved", true)
    .eq("restaurants.city", cityName);

  if (error) {
    console.error("getMenuItemsForSearch failed:", error.message);
    return [];
  }

  return ((data ?? []) as unknown as MenuItemSearchRow[])
    .map((row) => {
      const restaurant = Array.isArray(row.restaurants) ? row.restaurants[0] : row.restaurants;
      if (!restaurant) return null;
      return {
        id: row.id,
        name: row.name,
        restaurantName: restaurant.name,
        restaurantSlug: restaurant.slug,
      };
    })
    .filter((r): r is MenuSearchResult => r !== null);
}

/** How many restaurants are live right now in a given city — used for that city's home page empty state. */
export async function getApprovedRestaurantCount(cityName: string): Promise<number> {
  const { count, error } = await supabase
    .from("restaurants")
    .select("*", { count: "exact", head: true })
    .eq("is_approved", true)
    .eq("city", cityName);

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
  address: string | null;
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

/**
 * Folds a duplicate pending submission into an already-published
 * restaurant instead of publishing it as a second listing — for when
 * someone resubmits a place that's already on the site (different name,
 * different number, same restaurant). Copies the submitter's fresh info
 * — plus the edit token they were already shown at submission — onto the
 * existing row, moves over any menu items they'd already added, and
 * discards the now-redundant pending row. See admin_merge_restaurant for
 * exactly what's preserved (the existing row's id, slug and stats never
 * change).
 */
export async function mergeRestaurant(
  adminKey: string,
  pendingId: string,
  existingId: string
): Promise<boolean> {
  const { data, error } = await supabase.rpc("admin_merge_restaurant", {
    p_key: adminKey,
    p_pending_id: pendingId,
    p_existing_id: existingId,
  });

  if (error) {
    console.error("mergeRestaurant failed:", error.message);
    return false;
  }
  return data === true;
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
  // No longer optional — every restaurant needs a real (even if informal)
  // location on file, delivery-only ones included, so a customer with a
  // problem has somewhere to start. Enforced again on the database side
  // (submit_restaurant / admin_create_restaurant reject a blank address),
  // this is just the type-level reminder that it's always expected here.
  address: string;
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
    .replace(/[̀-ͯ]/g, "")
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
    p_address: input.address,
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

/**
 * Same idea as submitRestaurant, but for you — it publishes the restaurant
 * immediately (is_approved = true from the moment it's created) instead of
 * landing in the review queue, since you're the one curating it, not a
 * stranger submitting through the public form. Gated by the same admin key
 * as the review page; a wrong or missing key returns no edit token instead
 * of throwing, so it fails quietly the same way the other admin functions
 * do.
 */
export async function adminCreateRestaurant(
  adminKey: string,
  input: NewRestaurantInput
): Promise<{ editToken: string } | { error: string }> {
  const { data, error } = await supabase.rpc("admin_create_restaurant", {
    p_key: adminKey,
    p_name: input.name,
    p_slug: slugify(input.name),
    p_neighborhood: input.neighborhood,
    p_price_level: input.priceLevel,
    p_whatsapp_number: input.whatsappNumber || "",
    p_phone_number: input.phoneNumber,
    p_hours_text: input.hoursText || "",
    p_maps_link: input.mapsLink || "",
    p_address: input.address,
    p_blurb: input.blurb || "",
    p_category_ids: input.categoryIds,
    p_has_delivery: input.hasDelivery,
    p_has_takeout: input.hasTakeout,
    p_has_dine_in: input.hasDineIn,
  });

  if (error || !data) {
    console.error("adminCreateRestaurant failed:", error?.message);
    return {
      error:
        "No pudimos guardar el restaurante. Intenta de nuevo en un momento.",
    };
  }

  return { editToken: data };
}

/**
 * Fire-and-forget: records one tap of "Llamar" o "Escribir por WhatsApp"
 * on a restaurant's public page. Never surfaces an error back to the
 * visitor — a failed analytics write should never get in the way of
 * someone actually trying to reach a restaurant.
 */
export async function logContactClick(
  restaurantId: string,
  kind: "call" | "whatsapp"
): Promise<void> {
  const { error } = await supabase.rpc("log_contact_click", {
    p_restaurant_id: restaurantId,
    p_kind: kind,
  });

  if (error) {
    console.error("logContactClick failed:", error.message);
  }
}

/**
 * Records one load of a restaurant's own public page — a "profile view."
 * Called server-side (see the restaurant page itself), scheduled with
 * Next's `after()` so it never adds latency to the page the visitor is
 * actually waiting on.
 */
export async function logRestaurantView(restaurantId: string): Promise<void> {
  const { error } = await supabase.rpc("log_restaurant_view", {
    p_restaurant_id: restaurantId,
  });

  if (error) {
    console.error("logRestaurantView failed:", error.message);
  }
}

/**
 * Records one "impression" for every restaurant card shown on a category
 * page in a single call, rather than one write per card. Also scheduled
 * with `after()` from the category page itself.
 */
export async function logRestaurantImpressions(restaurantIds: string[]): Promise<void> {
  if (restaurantIds.length === 0) return;

  const { error } = await supabase.rpc("log_restaurant_impressions", {
    p_restaurant_ids: restaurantIds,
  });

  if (error) {
    console.error("logRestaurantImpressions failed:", error.message);
  }
}

export type RestaurantStats = {
  callCount: number;
  whatsappCount: number;
  viewCount: number;
  impressionCount: number;
};

/**
 * All four numbers for a vendor's stats box in one call: calls, WhatsApp
 * taps, profile views, and category-page impressions. Same token-gated
 * pattern as the rest of the manage page — a bad token just comes back as
 * all zeros instead of an error.
 */
export async function getRestaurantStats(token: string): Promise<RestaurantStats> {
  const { data, error } = await supabase.rpc("get_restaurant_stats", {
    p_token: token,
  });

  if (error || !data || data.length === 0) {
    if (error) console.error("getRestaurantStats failed:", error.message);
    return { callCount: 0, whatsappCount: 0, viewCount: 0, impressionCount: 0 };
  }

  const row = data[0];
  return {
    callCount: row.call_count ?? 0,
    whatsappCount: row.whatsapp_count ?? 0,
    viewCount: row.view_count ?? 0,
    impressionCount: row.impression_count ?? 0,
  };
}

export type RestaurantLikeInfo = {
  likeCount: number;
  likedByMe: boolean;
};

/**
 * How many likes a restaurant has, and whether this exact browser (via its
 * device id, see LikeButton) has already liked it — so the heart renders
 * filled/unfilled correctly even after the page reloads.
 */
export async function getRestaurantLikeInfo(
  restaurantId: string,
  deviceId: string
): Promise<RestaurantLikeInfo> {
  const { data, error } = await supabase.rpc("get_restaurant_like_info", {
    p_restaurant_id: restaurantId,
    p_device_id: deviceId,
  });

  if (error || !data || data.length === 0) {
    if (error) console.error("getRestaurantLikeInfo failed:", error.message);
    return { likeCount: 0, likedByMe: false };
  }

  return {
    likeCount: data[0].like_count ?? 0,
    likedByMe: data[0].liked_by_me ?? false,
  };
}

/**
 * Likes or un-likes a restaurant for this browser's device id. Returns the
 * new liked state (true = now liked) so the button can trust the server's
 * answer over its own optimistic guess.
 */
export async function toggleRestaurantLike(
  restaurantId: string,
  deviceId: string
): Promise<boolean> {
  const { data, error } = await supabase.rpc("toggle_restaurant_like", {
    p_restaurant_id: restaurantId,
    p_device_id: deviceId,
  });

  if (error) {
    console.error("toggleRestaurantLike failed:", error.message);
    return false;
  }
  return Boolean(data);
}

export type CityVisitCount = {
  city: string;
  region: string;
  visitCount: number;
};

/**
 * How many page views came from each city, most recent stats window
 * first — this is what answers "is my ad actually reaching Ibagué"
 * without digging through GA4. The underlying data comes from
 * src/middleware.ts, which logs one row per real page view using
 * Vercel's own IP-geolocation headers.
 *
 * Same admin-key-gated pattern as the rest of the admin surface: wrong
 * or missing key just comes back as an empty list.
 */
export async function getAdminVisitsByCity(
  adminKey: string,
  sinceDays: number | null
): Promise<CityVisitCount[]> {
  const since = sinceDays === null ? null : daysAgoIso(sinceDays);

  const { data, error } = await supabase.rpc("admin_visits_by_city", {
    p_key: adminKey,
    p_since: since ?? undefined,
  });

  if (error) {
    console.error("getAdminVisitsByCity failed:", error.message);
    return [];
  }

  return (data ?? []).map((row) => ({
    city: row.city,
    region: row.region,
    visitCount: row.visit_count,
  }));
}

export type RestaurantEngagement = {
  restaurantId: string;
  name: string;
  slug: string;
  viewCount: number;
  impressionCount: number;
  callCount: number;
  whatsappCount: number;
};

/**
 * Per-restaurant engagement for every approved listing in one call:
 * profile views, category-card impressions, calls, and WhatsApp taps.
 * Powers the admin stats page's restaurant table — same idea as
 * getRestaurantStats, but for every restaurant at once instead of one
 * vendor's own listing.
 */
export async function getAdminEngagementByRestaurant(
  adminKey: string,
  sinceDays: number | null
): Promise<RestaurantEngagement[]> {
  const since = sinceDays === null ? null : daysAgoIso(sinceDays);

  const { data, error } = await supabase.rpc("admin_engagement_by_restaurant", {
    p_key: adminKey,
    p_since: since ?? undefined,
  });

  if (error) {
    console.error("getAdminEngagementByRestaurant failed:", error.message);
    return [];
  }

  return (data ?? []).map((row) => ({
    restaurantId: row.restaurant_id,
    name: row.name,
    slug: row.slug,
    viewCount: row.view_count,
    impressionCount: row.impression_count,
    callCount: row.call_count,
    whatsappCount: row.whatsapp_count,
  }));
}

function daysAgoIso(days: number): string {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
}
