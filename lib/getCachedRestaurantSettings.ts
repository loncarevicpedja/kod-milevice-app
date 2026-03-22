import { getRestaurantSettingsFromDb } from "@/lib/restaurantSettingsDb";

/**
 * Podešavanja za Server Components (layout, stranice).
 * Bez React cache / noStore – jedan izvor istine je `getRestaurantSettingsFromDb`
 * (service role kada je podešen u .env).
 */
export async function getCachedRestaurantSettings() {
  return getRestaurantSettingsFromDb();
}
