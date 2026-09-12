import { supabase } from "@/lib/supabaseClient";
import { AdminTypesCategoriesManager } from "@/components/admin/AdminTypesCategoriesManager";
import type { ProductCategory, ProductType, TasteType } from "@/lib/dbTypes";

async function getProductTypes(): Promise<ProductType[]> {
  const { data, error } = await supabase
    .from("product_type")
    .select("id, name, is_active")
    .order("name", { ascending: true });
  if (error) {
    console.error("product_type error:", error);
    return [];
  }
  return (data ?? []) as ProductType[];
}

async function getTasteTypes(): Promise<TasteType[]> {
  const { data, error } = await supabase
    .from("taste_type")
    .select("id, name, is_active")
    .order("name", { ascending: true });
  if (error) {
    console.error("taste_type error:", error);
    return [];
  }
  return (data ?? []) as TasteType[];
}

async function getProductCategories(): Promise<ProductCategory[]> {
  const { data, error } = await supabase
    .from("product_category")
    .select("id, name, is_active")
    .order("name", { ascending: true });
  if (error) {
    console.error("product_category error:", error);
    return [];
  }
  return (data ?? []) as ProductCategory[];
}

export default async function AdminKategorijePage() {
  const [productTypes, tasteTypes, categories] = await Promise.all([
    getProductTypes(),
    getTasteTypes(),
    getProductCategories(),
  ]);

  return (
    <AdminTypesCategoriesManager
      initialProductTypes={productTypes}
      initialTasteTypes={tasteTypes}
      initialCategories={categories}
    />
  );
}
