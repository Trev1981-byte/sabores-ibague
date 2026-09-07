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
