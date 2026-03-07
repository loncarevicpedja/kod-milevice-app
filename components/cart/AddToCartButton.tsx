"use client";

import { useState } from "react";
import { useCart, type CartAddon } from "./CartContext";

type Props = {
  productId: number;
  name: string;
  basePrice: number;
  isClassic?: boolean;
  availableAddons?: CartAddon[];
};

export function AddToCartButton({
  productId,
  name,
  basePrice,
  isClassic = false,
  availableAddons = [],
}: Props) {
  const { addItem } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedAddonIds, setSelectedAddonIds] = useState<Set<number>>(
    () => new Set(),
  );

  function animate() {
    setIsAdding(true);
    setTimeout(() => setIsAdding(false), 500);
  }

  function handleAdd() {
    if (isClassic && availableAddons.length > 0) {
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

  function confirmAddWithAddons() {
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
        onClick={handleAdd}
        className="relative inline-flex items-center justify-center rounded-full bg-rose px-4 py-2 text-xs font-semibold text-white shadow-md shadow-rose/40 transition hover:bg-rose/90"
      >
        <span className={isAdding ? "animate-bounce" : ""}>Dodaj u korpu</span>
      </button>

      {dialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-5">
          <div className="max-w-sm rounded-3xl bg-white p-5 shadow-xl">
            <h3 className="text-base font-semibold text-brown-soft">
              Odaberi dodatke
            </h3>
            <p className="mt-1 text-xs text-brown-soft/70">
              Dodaci se naplaćuju dodatno. Možeš izabrati više opcija ili
              preskočiti ovaj korak.
            </p>

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

