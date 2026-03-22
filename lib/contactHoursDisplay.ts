import type { RestaurantSettings } from "@/lib/restaurantSettingsTypes";

/** Tekst za footer i kontakt – uvek usklađen sa podešenim satima. */
export function getContactHoursLines(settings: RestaurantSettings): {
  line1: string;
  line2: string;
} {
  return {
    line1: `Pon - pet: ${settings.weekday_work_start} - ${settings.weekday_work_end}`,
    line2: `Sub - ned: ${settings.weekend_work_start} - ${settings.weekend_work_end}`,
  };
}
