import { supabase } from "@/lib/supabaseClient";
import { AdminProductsManager } from "@/components/admin/AdminProductsManager";
import { mapProductRecordForAdmin } from "@/lib/productAddonSlots";

type ProductRow = {
  id: number;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  is_active: boolean;
  product_type_id: number;
  taste_type_id: number | null;
  product_category_id: number;
  product_type: { name: string } | null;
  taste_type: { name: string } | null;
  product_category: { name: string } | null;
  addon_slots: {
    sort_order: number;
    label: string;
    max_select: number;
    addon_ids: number[];
  }[];
};

type CatalogAddon = {
  id: number;
  name: string;
  price: number;
  is_active: boolean;
  addon_kind: string | null;
};

async function getProducts(): Promise<ProductRow[]> {
  const { data, error } = await supabase
    .from("product")
    .select(
      `
      id,
      name,
      description,
      price,
      image_url,
      is_active,
      product_type_id,
      taste_type_id,
      product_category_id,
      product_type:product_type_id ( name ),
      taste_type:taste_type_id ( name ),
      product_category:product_category_id ( name ),
      product_addon_slot(
        id,
        sort_order,
        label,
        max_select,
        product_addon_slot_addon(addon_id)
      )
    `
    )
    .order("name", { ascending: true });

  if (error) {
    console.error("Admin proizvodi error:", error);
    return [];
  }
  type Rel = { name: string } | { name: string }[] | null;
  const rows = (data ?? []) as Array<Record<string, unknown> & {
    id: number;
    name: string;
    description: string | null;
    price: number;
    image_url: string | null;
    is_active: boolean;
    product_type_id: number;
    taste_type_id: number | null;
    product_category_id: number;
    product_type: Rel;
    taste_type: Rel;
    product_category: Rel;
  }>;

  return rows.map((row) => {
    const mapped = mapProductRecordForAdmin(row);
    const product_type = Array.isArray(row.product_type)
      ? row.product_type[0] ?? null
      : row.product_type;
    const taste_type = Array.isArray(row.taste_type)
      ? row.taste_type[0] ?? null
      : row.taste_type;
    const product_category = Array.isArray(row.product_category)
      ? row.product_category[0] ?? null
      : row.product_category;
    return {
      id: row.id,
      name: row.name,
      description: row.description,
      price: row.price,
      image_url: row.image_url,
      is_active: row.is_active,
      product_type_id: row.product_type_id,
      taste_type_id: row.taste_type_id,
      product_category_id: row.product_category_id,
      product_type,
      taste_type,
      product_category,
      addon_slots: mapped.addon_slots as ProductRow["addon_slots"],
    };
  });
}

async function getCatalogAddons(): Promise<CatalogAddon[]> {
  const { data, error } = await supabase
    .from("addon")
    .select("id, name, price, is_active, addon_kind")
    .order("name", { ascending: true });

  if (error) {
    console.error("Admin katalog dodataka:", error);
    return [];
  }
  return (data ?? []).map((a) => ({
    ...a,
    price: Number(a.price ?? 0),
  })) as CatalogAddon[];
}

async function getProductTypes() {
  const { data } = await supabase
    .from("product_type")
    .select("id, name")
    .order("name");
  return data ?? [];
}

async function getTasteTypes() {
  const { data } = await supabase
    .from("taste_type")
    .select("id, name")
    .order("name");
  return data ?? [];
}

async function getProductCategories() {
  const { data } = await supabase
    .from("product_category")
    .select("id, name")
    .order("name");
  return data ?? [];
}

export default async function AdminProizvodiPage() {
  const [products, catalogAddons, productTypes, tasteTypes, productCategories] =
    await Promise.all([
      getProducts(),
      getCatalogAddons(),
      getProductTypes(),
      getTasteTypes(),
      getProductCategories(),
    ]);

  return (
    <AdminProductsManager
      initialProducts={products}
      catalogAddons={catalogAddons}
      productTypes={productTypes}
      tasteTypes={tasteTypes}
      productCategories={productCategories}
    />
  );
}
