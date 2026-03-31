"use client";

import { useState } from "react";
import { useCart, type CartAddon } from "./CartContext";
import { useRestaurantSettings } from "@/components/settings/RestaurantSettingsContext";
import type { ProductAddonSlotNormalized } from "@/lib/productAddonSlots";

type Props = {
  productId: number;
  name: string;
  basePrice: number;
  isClassic?: boolean;
  availableAddons?: CartAddon[];
  addonSlots?: ProductAddonSlotNormalized[];
};

export function AddToCartButton({
  productId,
  name,
  basePrice,
  isClassic = false,
  availableAddons = [],
  addonSlots = [],
}: Props) {
  const { addItem } = useCart();
  const {
    settings,
    isOrderingOpen,
    loading: settingsLoading,
    closedMessage,
  } = useRestaurantSettings();

  const cartDisabledBySettings = !settings.menu_cart_enabled;
  const [isAdding, setIsAdding] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [closedModalOpen, setClosedModalOpen] = useState(false);
  const [selectedAddonIds, setSelectedAddonIds] = useState<Set<number>>(
    () => new Set(),
  );
  const [slotChoices, setSlotChoices] = useState<Record<number, number[]>>({});

  /** Ima bar jedan slot u bazi (Meso/Namaz…) – prikaži dijalog i ako su grupe prazne */
  const needsSlotDialog = addonSlots.length > 0;
  const needsClassicDialog =
    isClassic && availableAddons.length > 0 && !needsSlotDialog;

  function animate() {
    setIsAdding(true);
    setTimeout(() => setIsAdding(false), 500);
  }

  function openSlotDialog() {
    const init: Record<number, number[]> = {};
    for (const s of addonSlots) init[s.id] = [];
    setSlotChoices(init);
    setDialogOpen(true);
  }

  function handleAdd() {
    if (!settingsLoading && !isOrderingOpen) {
      setClosedModalOpen(true);
      return;
    }
    if (needsSlotDialog) {
      openSlotDialog();
      return;
    }
    if (needsClassicDialog) {
      setSelectedAddonIds(new Set());
      setDialogOpen(true);
      return;
    }

    addItem({
      productId,
      name,
      basePrice,
      addons: [],
      isClassic,
    });
    animate();
  }

  function toggleAddon(id: number) {
    setSelectedAddonIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function toggleSlotAddon(slotId: number, addonId: number, maxSelect: number) {
    setSlotChoices((prev) => {
      const cur = [...(prev[slotId] ?? [])];
      const idx = cur.indexOf(addonId);
      if (idx >= 0) {
        return {
          ...prev,
          [slotId]: cur.filter((id) => id !== addonId),
        };
      }
      if (cur.length >= maxSelect) return prev;
      return {
        ...prev,
        [slotId]: [...cur, addonId].sort((a, b) => a - b),
      };
    });
  }

  function confirmAddWithAddons() {
    if (cartDisabledBySettings) return;
    if (!settingsLoading && !isOrderingOpen) {
      setDialogOpen(false);
      setClosedModalOpen(true);
      return;
    }

    if (needsSlotDialog) {
      const addons: CartAddon[] = [];
      for (const slot of addonSlots) {
        const ids = slotChoices[slot.id] ?? [];
        for (const id of ids) {
          const a = slot.addons.find((x) => x.id === id);
          if (a) addons.push({ id: a.id, name: a.name, price: 0 });
        }
      }
      addItem({
        productId,
        name,
        basePrice,
        addons,
        isClassic: false,
      });
      setDialogOpen(false);
      animate();
      return;
    }

    const addons =
      availableAddons.filter((addon) => selectedAddonIds.has(addon.id)) ?? [];

    addItem({
      productId,
      name,
      basePrice,
      addons,
      isClassic,
    });
    setDialogOpen(false);
    animate();
  }

  return (
    <>
      <button
        type="button"
        disabled={settingsLoading || cartDisabledBySettings}
        title={
          cartDisabledBySettings
            ? "Dodavanje u korpu je isključeno (samo pregled menija)."
            : undefined
        }
        onClick={handleAdd}
        className={`relative inline-flex items-center justify-center rounded-full px-4 py-2 text-xs font-semibold shadow-md transition ${
          cartDisabledBySettings || settingsLoading
            ? "cursor-not-allowed bg-brown-soft/25 text-brown-soft/70 shadow-none"
            : "bg-rose text-white shadow-rose/40 hover:bg-rose/90"
        }`}
      >
        <span className={isAdding ? "animate-bounce" : ""}>
          {cartDisabledBySettings ? "Samo pregled" : "Dodaj u korpu"}
        </span>
      </button>

      {closedModalOpen && closedMessage && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 px-5">
          <div className="max-w-sm rounded-3xl bg-white p-5 text-center shadow-xl">
            <p className="text-sm text-brown-soft">{closedMessage}</p>
            <button
              type="button"
              onClick={() => setClosedModalOpen(false)}
              className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-rose px-5 py-2 text-sm font-semibold text-white"
            >
              Razumem
            </button>
          </div>
        </div>
      )}

      {dialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-5">
          <div className="max-h-[85vh] max-w-sm overflow-y-auto rounded-3xl bg-white p-5 shadow-xl">
            <h3 className="text-base font-semibold text-brown-soft">
              {needsSlotDialog ? "Odaberi dodatke" : "Odaberi dodatke"}
            </h3>
            <p className="mt-1 text-xs text-brown-soft/70">
              {needsSlotDialog
                ? "Po grupama važi maksimalan broj izbora."
                : "Dodaci se naplaćuju dodatno. Možeš izabrati više opcija ili preskočiti ovaj korak."}
            </p>

            {needsSlotDialog ? (
              <div className="mt-3 space-y-4">
                {addonSlots.map((slot) => {
                  const chosen = slotChoices[slot.id] ?? [];
                  return (
                    <div key={slot.id}>
                      <p className="text-xs font-semibold text-brown-soft">
                        {slot.label || "Dodaci"}{" "}
                        <span className="font-normal text-brown-soft/60">
                          (max {slot.maxSelect})
                        </span>
                      </p>
                      {slot.addons.length === 0 ? (
                        <p className="mt-2 rounded-2xl bg-amber-50 px-3 py-2 text-xs text-amber-900/90">
                          U admin panelu dodeli dodatke ovoj grupi (Proizvod →
                          grupe dodataka), ili proveri da li migracija i tip
                          dodatka (meso / namaz) odgovaraju.
                        </p>
                      ) : (
                        <div className="mt-2 max-h-40 space-y-2 overflow-y-auto">
                          {slot.addons.map((addon) => (
                            <label
                              key={addon.id}
                              className="flex items-center rounded-2xl bg-cream/60 px-3 py-2 text-xs"
                            >
                              <div className="flex min-w-0 flex-1 items-center gap-2">
                                <input
                                  type="checkbox"
                                  className="h-4 w-4 shrink-0 rounded border-rose/50 text-rose"
                                  checked={chosen.includes(addon.id)}
                                  disabled={
                                    !chosen.includes(addon.id) &&
                                    chosen.length >= slot.maxSelect
                                  }
                                  onChange={() =>
                                    toggleSlotAddon(
                                      slot.id,
                                      addon.id,
                                      slot.maxSelect,
                                    )
                                  }
                                />
                                <span className="truncate text-brown-soft">
                                  {addon.name}
                                </span>
                              </div>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="mt-3 max-h-60 space-y-2 overflow-y-auto">
                {availableAddons.map((addon) => (
                  <label
                    key={addon.id}
                    className="flex items-center justify-between rounded-2xl bg-cream/60 px-3 py-2 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-rose/50 text-rose"
                        checked={selectedAddonIds.has(addon.id)}
                        onChange={() => toggleAddon(addon.id)}
                      />
                      <span className="text-brown-soft">{addon.name}</span>
                    </div>
                    <span className="font-semibold text-brown-soft">
                      {addon.price.toFixed(0)} RSD
                    </span>
                  </label>
                ))}
              </div>
            )}

            <div className="mt-4 flex gap-2 text-xs">
              <button
                type="button"
                onClick={() => setDialogOpen(false)}
                className="inline-flex flex-1 items-center justify-center rounded-full border border-rose/40 px-3 py-2 font-semibold text-brown-soft"
              >
                Otkaži
              </button>
              <button
                type="button"
                onClick={confirmAddWithAddons}
                className="inline-flex flex-1 items-center justify-center rounded-full bg-rose px-3 py-2 font-semibold text-white shadow-md shadow-rose/40"
              >
                Dodaj u korpu
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
