import { getRestaurantSettingsFromDb } from "@/lib/restaurantSettingsDb";

/**
 * Podešavanja za Server Components (layout, stranice).
 * Bez React cache / noStore – izvor je `getRestaurantSettingsFromDb`.
 */
export async function getCachedRestaurantSettings() {
  return getRestaurantSettingsFromDb();
}
