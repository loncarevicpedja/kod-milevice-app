import { supabase } from "@/lib/supabaseClient";
import { AdminFeaturedManager } from "@/components/admin/AdminFeaturedManager";

export default async function AdminIstaknutoPage() {
  const [featuredRes, productsRes] = await Promise.all([
    supabase
      .from("featured_product")
      .select(
        "id, product_id, is_active, order_no, product:product_id ( id, name, price, image_url, is_active )",
      )
      .order("order_no"),
    supabase
      .from("product")
      .select("id, name, price, image_url, is_active")
      .order("name"),
  ]);

  return (
    <AdminFeaturedManager
      initialRows={featuredRes.data ?? []}
      products={productsRes.data ?? []}
    />
  );
}
