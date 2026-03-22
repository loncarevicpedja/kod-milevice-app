"use client";

import { useRestaurantSettings } from "@/components/settings/RestaurantSettingsContext";
import { getContactHoursLines } from "@/lib/contactHoursDisplay";

/**
 * Radno vreme iz konteksta (isti izvor kao API / baza), da se odmah ažurira
 * posle admina i da ne zavisi od keširanog server HTML-a u footeru.
 */
export function ContactHoursLines() {
  const { settings } = useRestaurantSettings();
  const hours = getContactHoursLines(settings);

  return (
    <>
      <p>{hours.line1}</p>
      <p>{hours.line2}</p>
    </>
  );
}
