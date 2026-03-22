import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let cached: SupabaseClient | null = null;

/**
 * Supabase klijent sa service role ključem – zaobilazi RLS.
 * Koristi samo u Server Components / Route Handlers, nikad u browseru.
 *
 * Potreban je jer admin panel koristi cookie (`ADMIN_SECRET`), ne Supabase Auth,
 * pa anon ključ nema RLS politiku za INSERT/UPDATE na `restaurant_settings`.
 */
export function getSupabaseService(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !serviceRoleKey) return null;
  if (!cached) {
    cached = createClient(url, serviceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }
  return cached;
}
