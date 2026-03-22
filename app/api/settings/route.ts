import { NextResponse } from "next/server";
import { getRestaurantSettingsFromDb } from "@/lib/restaurantSettingsDb";

export const dynamic = "force-dynamic";

export async function GET() {
  const payload = await getRestaurantSettingsFromDb();

  return NextResponse.json(payload, {
    headers: {
      "Cache-Control": "private, no-store, must-revalidate",
    },
  });
}
