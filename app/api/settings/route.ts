import { NextResponse } from "next/server";
import { applyFixedBusinessHours } from "@/lib/fixedBusinessHours";
import { getRestaurantSettingsFromDb } from "@/lib/restaurantSettingsDb";

export const dynamic = "force-dynamic";

export async function GET() {
  const raw = await getRestaurantSettingsFromDb();
  const payload = applyFixedBusinessHours(raw);

  return NextResponse.json(payload, {
    headers: {
      "Cache-Control": "private, no-store, must-revalidate",
    },
  });
}
