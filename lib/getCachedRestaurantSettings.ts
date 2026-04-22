import { applyFixedBusinessHours } from "@/lib/fixedBusinessHours";
import { getRestaurantSettingsFromDb } from "@/lib/restaurantSettingsDb";

/**
 * Podešavanja za Server Components (layout, stranice).
 * Radno vreme uvek dolazi iz `fixedBusinessHours`, ne iz baze.
 */
export async function getCachedRestaurantSettings() {
  const raw = await getRestaurantSettingsFromDb();
  return applyFixedBusinessHours(raw);
}
