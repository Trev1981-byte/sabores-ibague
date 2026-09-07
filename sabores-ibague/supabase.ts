import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

// These come from your Supabase project settings (Project Settings > API).
// They're read from environment variables so the real values never get
// committed to git — see .env.local.example for what you need to set.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase environment variables. Copy .env.local.example to " +
      ".env.local and fill in your project's URL and anon key."
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
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
