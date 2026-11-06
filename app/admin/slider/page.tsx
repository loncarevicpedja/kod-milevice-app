import { supabase } from "@/lib/supabaseClient";
import { AdminSlidesManager } from "@/components/admin/AdminSlidesManager";

export default async function AdminSliderPage() {
  const [slidesRes, productsRes] = await Promise.all([
    supabase
      .from("home_slide")
      .select(
        "id, is_active, order_no, starts_at, ends_at, badge, title, subtitle, description, image_url, price_label, product_id",
      )
      .order("order_no"),
    supabase
      .from("product")
      .select("id, name, price, image_url, description")
      .eq("is_active", true)
      .order("name"),
  ]);

  return (
    <AdminSlidesManager
      initialSlides={slidesRes.data ?? []}
      products={productsRes.data ?? []}
    />
  );
}
