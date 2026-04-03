import { supabase } from "@/lib/supabaseClient";
import type { CartItem } from "@/components/cart/CartContext";

type SlotRow = {
  id: number;
  product_id: number;
  label: string;
  max_select: number;
  product_addon_slot_addon:
    | { addon_id: number }
    | { addon_id: number }[]
    | null;
};

function flattenLinks(
  links: SlotRow["product_addon_slot_addon"]
): { addon_id: number }[] {
  if (links == null) return [];
  return Array.isArray(links) ? links : [links];
}

/**
 * Ensures addons on cart lines match product slot rules (allowed ids + max per slot).
 * Returns an error message in Serbian or null if OK.
 */
export async function validateOrderAddonSlots(
  items: CartItem[]
): Promise<string | null> {
  const productIds = [...new Set(items.map((i) => i.productId))];
  if (productIds.length === 0) return null;

  const { data: slots, error } = await supabase
    .from("product_addon_slot")
    .select(
      `
      id,
      product_id,
      label,
      max_select,
      product_addon_slot_addon ( addon_id )
    `
    )
    .in("product_id", productIds);

  if (error) {
    console.error(error);
    return "Greška pri proveri dodataka. Pokušaj ponovo.";
  }

  const rulesByProduct = new Map<number, SlotRow[]>();
  for (const pid of productIds) {
    rulesByProduct.set(pid, []);
  }
  for (const row of (slots ?? []) as SlotRow[]) {
    const list = rulesByProduct.get(row.product_id) ?? [];
    list.push(row);
    rulesByProduct.set(row.product_id, list);
  }

  for (const item of items) {
    const rules = rulesByProduct.get(item.productId) ?? [];
    if (rules.length === 0) continue;

    const addonToSlot = new Map<
      number,
      { slotId: number; maxSelect: number; label: string }
    >();

    for (const rule of rules) {
      for (const L of flattenLinks(rule.product_addon_slot_addon)) {
        const aid = L.addon_id;
        if (typeof aid === "number" && aid > 0) {
          addonToSlot.set(aid, {
            slotId: rule.id,
            maxSelect: rule.max_select,
            label: rule.label || "Grupa",
          });
        }
      }
    }

    /** Nema nijedne veze slot–dodatak: ne primenjuj slot pravila (npr. samo „standardni“ dodaci). */
    if (addonToSlot.size === 0) {
      continue;
    }

    const countBySlot = new Map<number, number>();
    for (const addon of item.addons) {
      const meta = addonToSlot.get(addon.id);
      if (meta) {
        countBySlot.set(meta.slotId, (countBySlot.get(meta.slotId) ?? 0) + 1);
      } else if (!item.isClassic) {
        return `Proizvod „${item.name}”: dodatak „${addon.name}” nije dozvoljen.`;
      }
    }

    for (const rule of rules) {
      const n = countBySlot.get(rule.id) ?? 0;
      if (n > rule.max_select) {
        return `Proizvod „${item.name}”: u grupi „${rule.label || "Dodaci"}” možete najviše ${rule.max_select} dodataka.`;
      }
    }
  }

  return null;
}
