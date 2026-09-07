import { supabase } from "@/lib/supabase";
import type { Tables } from "@/types/database";

export type Category = Tables<"categories">;
export type Restaurant = Tables<"restaurants">;

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

export type NewRestaurantInput = {
  name: string;
  neighborhood: string;
  priceLevel: "$" | "$$" | "$$$";
  whatsappNumber: string;
  phoneNumber?: string;
  hoursText?: string;
  mapsLink?: string;
  blurb?: string;
  categoryIds: string[];
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
 * It always lands unapproved — `is_approved` defaults to false in the
 * database, and the public insert policy forces that regardless of what's
 * sent — so a moderator has to publish it by hand in the Supabase
 * dashboard before shoppers ever see it.
 */
export async function submitRestaurant(
  input: NewRestaurantInput
): Promise<{ editToken: string } | { error: string }> {
  const { data: restaurant, error: restaurantError } = await supabase
    .from("restaurants")
    .insert({
      name: input.name,
      slug: slugify(input.name),
      neighborhood: input.neighborhood,
      price_level: input.priceLevel,
      whatsapp_number: input.whatsappNumber,
      phone_number: input.phoneNumber || null,
      hours_text: input.hoursText || null,
      maps_link: input.mapsLink || null,
      blurb: input.blurb || null,
    })
    .select("id, edit_token")
    .single();

  if (restaurantError || !restaurant) {
    console.error("submitRestaurant failed:", restaurantError?.message);
    return {
      error:
        "No pudimos guardar tu restaurante. Intenta de nuevo en un momento.",
    };
  }

  if (input.categoryIds.length > 0) {
    const { error: linkError } = await supabase.from("restaurant_categories").insert(
      input.categoryIds.map((categoryId) => ({
        restaurant_id: restaurant.id,
        category_id: categoryId,
      }))
    );
    if (linkError) {
      // The restaurant itself was saved fine — only the category tags
      // didn't fully go through, so a moderator can fix that by hand
      // rather than losing the whole submission.
      console.error("submitRestaurant category link failed:", linkError.message);
    }
  }

  return { editToken: restaurant.edit_token };
}
