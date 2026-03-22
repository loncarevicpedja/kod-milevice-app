"use client";

import { useRestaurantSettings } from "@/components/settings/RestaurantSettingsContext";

/** Poruka kada je uključen samo pregled menija (bez korpe). */
export function MenuCartNotice() {
  const { settings } = useRestaurantSettings();

  if (settings.menu_cart_enabled) return null;

  return (
    <div
      className="mt-3 rounded-2xl border border-amber-200/80 bg-amber-50 px-4 py-3 text-sm text-amber-950"
      role="status"
    >
      <p className="font-medium">Samo pregled menija</p>
      <p className="mt-1 text-xs text-amber-900/90">
        Proizvodi su prikazani radi informacije. Dodavanje u korpu je trenutno
        isključeno u podešavanjima.
      </p>
    </div>
  );
}
