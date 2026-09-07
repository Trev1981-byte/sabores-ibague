import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

// These come from your Supabase project settings (Project Settings > API).
// They're read from environment variables so the real values never get
// committed to git — see .env.local.example for what you need to set.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Warn (don't throw) if these are missing. Throwing here crashes the whole
// build the moment any route imports this file — including during Next.js's
// build-time "collect page data" pass over dynamic routes like
// /categoria/[slug], which evaluates this module without necessarily having
// the env vars available in that specific phase. Real requests at runtime
// do have them (they're set in Vercel's Environment Variables), so a
// missing-value fallback here just needs to not blow up the build; actual
// Supabase calls with a bad URL/key simply error, and every call site in
// src/lib/queries.ts already catches that and returns an empty result.
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "Missing Supabase environment variables (NEXT_PUBLIC_SUPABASE_URL / " +
      "NEXT_PUBLIC_SUPABASE_ANON_KEY). Copy .env.local.example to .env.local " +
      "locally, or set them in the Vercel project's Environment Variables."
  );
}

// This client is safe to use in browser-facing code because it only ever
// uses the public "anon"/"publishable" key, which respects Supabase's row
// level security rules — see supabase/migrations/0001_initial_schema.sql
// for what those rules currently allow (read-only for restaurants marked
// approved; categories and menu items always readable; no public writes
// yet — see the note at the bottom of that file).
//
// Typed against the live schema (src/types/database.ts), so e.g.
// supabase.from("restaurants").select() knows its columns are `name`,
// `neighborhood`, `price_level`, etc.
export const supabase = createClient<Database>(
  supabaseUrl ?? "https://placeholder.invalid",
  supabaseAnonKey ?? "placeholder-anon-key"
);
