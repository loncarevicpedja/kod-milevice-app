import type { SupabaseClient } from "@supabase/supabase-js";

export type AddonSlotPayload = {
  sort_order?: number;
  label?: string;
  max_select?: number;
  addon_ids?: number[];
};

function clampMax(n: number) {
  if (!Number.isFinite(n) || n < 1) return 1;
  return Math.min(20, Math.floor(n));
}

export async function replaceProductAddonSlots(
  supabase: SupabaseClient,
  productId: number,
  slots: AddonSlotPayload[] | null | undefined
) {
  if (slots == null) return;

  const { error: delErr } = await supabase
    .from("product_addon_slot")
    .delete()
    .eq("product_id", productId);
  if (delErr) throw delErr;

  for (let i = 0; i < slots.length; i++) {
    const s = slots[i];
    const label = String(s.label ?? "").trim() || `Grupa ${i + 1}`;
    const maxSelect = clampMax(Number(s.max_select ?? 3));
    const sortOrder =
      typeof s.sort_order === "number" && Number.isFinite(s.sort_order)
        ? Math.floor(s.sort_order)
        : i;

    const { data: slotRow, error: insSlot } = await supabase
      .from("product_addon_slot")
      .insert({
        product_id: productId,
        sort_order: sortOrder,
        label,
        max_select: maxSelect,
      })
      .select("id")
      .single();

    if (insSlot) throw insSlot;
    if (!slotRow?.id) throw new Error("slot insert returned no id");

    const rawIds = Array.isArray(s.addon_ids) ? s.addon_ids : [];
    const addonIds = [...new Set(rawIds.map((x) => Number(x)).filter((n) => n > 0))];

    if (addonIds.length > 0) {
      const { error: linkErr } = await supabase
        .from("product_addon_slot_addon")
        .insert(
          addonIds.map((addon_id) => ({
            slot_id: slotRow.id as number,
            addon_id,
          }))
        );
      if (linkErr) throw linkErr;
    }
  }
}
