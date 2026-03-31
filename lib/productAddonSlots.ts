import type { CartAddon } from "@/components/cart/CartContext";

export type ProductAddonSlotNormalized = {
  id: number;
  sortOrder: number;
  label: string;
  maxSelect: number;
  addons: CartAddon[];
};

type Rel<T> = T | T[] | null;

type AddonEmbed = {
  id: number;
  name: string;
  price: number | string;
  is_active?: boolean;
};

type SlotAddonRow = {
  addon_id?: number;
  addon?: Rel<AddonEmbed>;
};

type SlotRow = {
  id: number;
  sort_order: number;
  label: string;
  max_select: number;
  product_addon_slot_addon?: Rel<SlotAddonRow>;
};

function one<T>(rel: Rel<T>): T | null {
  if (rel == null) return null;
  return Array.isArray(rel) ? rel[0] ?? null : rel;
}

function toCartAddon(embed: AddonEmbed | null | undefined): CartAddon | null {
  if (!embed || embed.is_active === false) return null;
  const price =
    typeof embed.price === "number" ? embed.price : Number(embed.price ?? 0);
  return { id: embed.id, name: embed.name, price };
}

/** Normalize Supabase nested `product_addon_slot` for menu / cart UI */
export function normalizeProductAddonSlots(
  raw: Rel<SlotRow> | null | undefined
): ProductAddonSlotNormalized[] {
  const slots = raw == null ? [] : Array.isArray(raw) ? raw : [raw];
  const out: ProductAddonSlotNormalized[] = [];

  for (const slot of slots) {
    if (!slot?.id) continue;
    const rows = slot.product_addon_slot_addon;
    const linkList = rows == null ? [] : Array.isArray(rows) ? rows : [rows];
    const addons: CartAddon[] = [];
    for (const link of linkList) {
      const row = link as SlotAddonRow & Record<string, unknown>;
      const emb =
        one(row.addon) ??
        one(row.addons as Rel<AddonEmbed> | undefined);
      const ca = toCartAddon(emb);
      if (ca) addons.push(ca);
    }
    addons.sort((a, b) => a.id - b.id);
    out.push({
      id: slot.id,
      sortOrder: slot.sort_order ?? 0,
      label: slot.label ?? "",
      maxSelect: Math.min(20, Math.max(1, Number(slot.max_select) || 1)),
      addons,
    });
  }

  out.sort((a, b) => a.sortOrder - b.sortOrder || a.id - b.id);
  return out;
}

export type AdminProductAddonSlot = {
  id?: number;
  sortOrder: number;
  label: string;
  maxSelect: number;
  addonIds: number[];
};

type SlotRowAdmin = {
  id: number;
  sort_order: number;
  label: string;
  max_select: number;
  product_addon_slot_addon?: Rel<{ addon_id: number }>;
};

/** Admin edit form: slot rows with selected addon ids */
export function normalizeAdminProductAddonSlots(
  raw: Rel<SlotRowAdmin> | null | undefined
): AdminProductAddonSlot[] {
  const slots = raw == null ? [] : Array.isArray(raw) ? raw : [raw];
  const out: AdminProductAddonSlot[] = [];

  for (const slot of slots) {
    if (!slot?.id) continue;
    const rows = slot.product_addon_slot_addon;
    const linkList = rows == null ? [] : Array.isArray(rows) ? rows : [rows];
    const addonIds = linkList
      .map((r) => r.addon_id)
      .filter((id): id is number => typeof id === "number" && id > 0);
    out.push({
      id: slot.id,
      sortOrder: slot.sort_order ?? 0,
      label: slot.label ?? "",
      maxSelect: Math.min(20, Math.max(1, Number(slot.max_select) || 1)),
      addonIds: [...new Set(addonIds)].sort((a, b) => a - b),
    });
  }

  out.sort((a, b) => a.sortOrder - b.sortOrder || (a.id ?? 0) - (b.id ?? 0));
  return out;
}

export type ProductAddonSlotApiPayload = {
  sort_order: number;
  label: string;
  max_select: number;
  addon_ids: number[];
};

/** Strip nested Supabase embed and attach `addon_slots` for admin UI / API */
export function mapProductRecordForAdmin(row: Record<string, unknown>) {
  const slots = normalizeAdminProductAddonSlots(
    row.product_addon_slot as Parameters<typeof normalizeAdminProductAddonSlots>[0]
  );
  const { product_addon_slot: _removed, ...rest } = row;
  return {
    ...rest,
    addon_slots: slots.map(
      (s): ProductAddonSlotApiPayload => ({
        sort_order: s.sortOrder,
        label: s.label,
        max_select: s.maxSelect,
        addon_ids: s.addonIds,
      })
    ),
  };
}
