import { supabase } from "@/lib/supabaseClient";
import { getSupabaseService } from "@/lib/supabaseService";
import type { SupabaseClient } from "@supabase/supabase-js";

/** Admin upisi: service role ako postoji, inače anon (kao proizvodi). */
export function getAdminDb(): SupabaseClient {
  return getSupabaseService() ?? supabase;
}
