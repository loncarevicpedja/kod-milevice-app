import { supabase } from "@/lib/supabaseClient";
import {
  normalizeAddonRows,
  normalizeProductRows,
  type AddonRow,
  type ProductRow,
} from "@/lib/menuUtils";
import { PRODUCT_PUBLIC_SELECT } from "@/lib/productSelect";
import { compareByOrderNo } from "@/lib/sortByOrderNo";

export async function loadPublicProducts(): Promise<ProductRow[]> {
  const withOrder = await supabase
    .from("product")
    .select(PRODUCT_PUBLIC_SELECT)
    .eq("is_active", true)
    .order("order_no", { ascending: true })
    .order("name", { ascending: true });

  if (!withOrder.error) {
    return normalizeProductRows(
      (withOrder.data ?? []) as Parameters<typeof normalizeProductRows>[0],
    );
  }

  console.error("Error loading products (order_no):", withOrder.error);

  const fallback = await supabase
    .from("product")
    .select(
      `
      id,
      name,
      description,
      price,
      image_url,
      product_category_id,
      product_type:product_type_id ( name ),
      taste_type:taste_type_id ( name ),
      product_category:product_category_id ( name ),
      product_addon_slot (
        id,
        sort_order,
        label,
        max_select,
        product_addon_slot_addon (
          addon_id,
          addon (
            id,
            name,
            price,
            is_active
          )
        )
      )
    `,
    )
    .eq("is_active", true)
    .order("name", { ascending: true });

  if (fallback.error) {
    console.error("Error loading products", fallback.error);
    return [];
  }

  return normalizeProductRows(
    (fallback.data ?? []) as Parameters<typeof normalizeProductRows>[0],
  );
}

export async function loadPublicAddons(): Promise<AddonRow[]> {
  const { data, error } = await supabase
    .from("addon")
    .select(
      `
      id,
      name,
      price,
      addon_kind,
      taste_type:taste_type_id ( name )
    `,
    )
    .eq("is_active", true)
    .order("price", { ascending: true });

  if (error) {
    console.error("Error loading addons", error);
    return [];
  }

  return normalizeAddonRows(
    (data ?? []) as Parameters<typeof normalizeAddonRows>[0],
  );
}

export function sortProducts(products: ProductRow[]): ProductRow[] {
  return [...products].sort(compareByOrderNo);
}
