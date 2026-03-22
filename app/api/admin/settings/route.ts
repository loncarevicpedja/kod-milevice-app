import { NextResponse } from "next/server";
import { getSupabaseService } from "@/lib/supabaseService";

export const dynamic = "force-dynamic";
import { requireAdmin, unauthorizedResponse } from "@/lib/adminAuth";
import type { RestaurantSettings } from "@/lib/restaurantSettingsTypes";
import {
  getRestaurantSettingsFromDb,
  mergeRestaurantSettings,
  settingsToKeyValueRows,
} from "@/lib/restaurantSettingsDb";

export async function GET() {
  if (!(await requireAdmin())) return unauthorizedResponse();

  const settings = await getRestaurantSettingsFromDb();
  return NextResponse.json(settings);
}

export async function PATCH(request: Request) {
  if (!(await requireAdmin())) return unauthorizedResponse();

  const body = (await request.json()) as Partial<RestaurantSettings>;

  const base = await getRestaurantSettingsFromDb();
  const next = mergeRestaurantSettings(base, body);
  const now = new Date().toISOString();
  const rows = settingsToKeyValueRows(next, now);

  const supabaseService = getSupabaseService();
  if (!supabaseService) {
    return NextResponse.json(
      {
        error:
          "Nedostaje SUPABASE_SERVICE_ROLE_KEY u env (server). Dodaj ga u .env.local i Vercel – vidi GITHUB_I_DEPLOY.md. Bez njega RLS blokira upis u restaurant_settings.",
      },
      { status: 500 },
    );
  }

  const { error } = await supabaseService.from("restaurant_settings").upsert(rows, {
    onConflict: "key",
  });

  if (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const saved = await getRestaurantSettingsFromDb();
  return NextResponse.json(saved);
}
