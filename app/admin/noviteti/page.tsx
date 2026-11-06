import { supabase } from "@/lib/supabaseClient";
import { AdminHighlightsManager } from "@/components/admin/AdminHighlightsManager";

type Rel = { name: string } | { name: string }[] | null;

export default async function AdminNovitetiPage() {
  const [rowsRes, productsRes] = await Promise.all([
    supabase
      .from("category_highlight")
      .select(
        "id, product_id, is_active, order_no, badge, promo_title, promo_description, image_url",
      )
      .order("order_no"),
    supabase
      .from("product")
      .select("id, name, price, image_url, description, is_active, taste_type:taste_type_id ( name )")
      .order("name"),
  ]);

  const products = (productsRes.data ?? []).map((row) => {
    const taste = row.taste_type as Rel;
    return {
      ...row,
      taste_type: Array.isArray(taste) ? taste[0] ?? null : taste,
    };
  });

  return (
    <AdminHighlightsManager
      initialRows={rowsRes.data ?? []}
      products={products}
    />
  );
}
