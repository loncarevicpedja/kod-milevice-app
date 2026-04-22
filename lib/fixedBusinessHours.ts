import type { RestaurantSettings } from "@/lib/restaurantSettingsTypes";

/**
 * Zakucano radno vreme (Europe/Belgrade). Menja se ovde u kodu — ne kroz admin ni vrednosti u bazi.
 */
export const FIXED_BUSINESS_HOURS: Pick<
  RestaurantSettings,
  | "weekday_work_start"
  | "weekday_work_end"
  | "weekend_work_start"
  | "weekend_work_end"
> = {
  weekday_work_start: "12:00",
  weekday_work_end: "23:00",
  weekend_work_start: "14:00",
  weekend_work_end: "23:00",
};

/** Zamenjuje sate iz baze fiksnim intervalima (prikaz, API, provera naručivanja). */
export function applyFixedBusinessHours(
  settings: RestaurantSettings,
): RestaurantSettings {
  return { ...settings, ...FIXED_BUSINESS_HOURS };
}

export function getFixedContactHoursLines(): { line1: string; line2: string } {
  const {
    weekday_work_start,
    weekday_work_end,
    weekend_work_start,
    weekend_work_end,
  } = FIXED_BUSINESS_HOURS;
  return {
    line1: `Pon - pet: ${weekday_work_start} - ${weekday_work_end}`,
    line2: `Sub - ned: ${weekend_work_start} - ${weekend_work_end}`,
  };
}
