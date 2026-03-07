import { supabase } from "@/lib/supabaseClient";
import { AdminProductsManager } from "@/components/admin/AdminProductsManager";

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
      product_category:product_category_id ( name )
    `
    )
    .order("name", { ascending: true });

  if (error) {
    console.error("Admin proizvodi error:", error);
    return [];
  }
  type Rel = { name: string } | { name: string }[] | null;
  const rows = (data ?? []) as Array<{
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
  return rows.map((row) => ({
    ...row,
    product_type: Array.isArray(row.product_type)
      ? row.product_type[0] ?? null
      : row.product_type,
    taste_type: Array.isArray(row.taste_type)
      ? row.taste_type[0] ?? null
      : row.taste_type,
    product_category: Array.isArray(row.product_category)
      ? row.product_category[0] ?? null
      : row.product_category,
  })) as ProductRow[];
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
  const [products, productTypes, tasteTypes, productCategories] =
    await Promise.all([
      getProducts(),
      getProductTypes(),
      getTasteTypes(),
      getProductCategories(),
    ]);

  return (
    <AdminProductsManager
      initialProducts={products}
      productTypes={productTypes}
      tasteTypes={tasteTypes}
      productCategories={productCategories}
    />
  );
}
