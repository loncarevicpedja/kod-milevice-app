import { supabase } from "@/lib/supabaseClient";
import { AdminAddonsManager } from "@/components/admin/AdminAddonsManager";

type AddonRow = {
  id: number;
  name: string;
  price: number | string;
  is_active: boolean;
  taste_type_id: number | null;
  taste_type: { name: string } | null;
};

async function getAddons(): Promise<AddonRow[]> {
  const { data, error } = await supabase
    .from("addon")
    .select(
      `
      id,
      name,
      price,
      is_active,
      taste_type_id,
      taste_type:taste_type_id ( name )
    `
    )
    .order("name", { ascending: true });

  if (error) {
    console.error("Admin dodaci error:", error);
    return [];
  }
  return (data ?? []) as AddonRow[];
}

async function getTasteTypes() {
  const { data } = await supabase
    .from("taste_type")
    .select("id, name")
    .order("name");
  return data ?? [];
}

export default async function AdminDodaciPage() {
  const [addons, tasteTypes] = await Promise.all([
    getAddons(),
    getTasteTypes(),
  ]);

  return (
    <AdminAddonsManager initialAddons={addons} tasteTypes={tasteTypes} />
  );
}
