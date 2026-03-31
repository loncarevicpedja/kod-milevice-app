import { supabase } from "@/lib/supabaseClient";
import { AdminAddonsManager } from "@/components/admin/AdminAddonsManager";

type AddonRow = {
  id: number;
  name: string;
  price: number | string;
  is_active: boolean;
  taste_type_id: number | null;
  addon_kind: string | null;
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
      addon_kind,
      taste_type:taste_type_id ( name )
    `
    )
    .order("name", { ascending: true });

  if (error) {
    console.error("Admin dodaci error:", error);
    return [];
  }
  const rows = (data ?? []) as Array<{
    id: number;
    name: string;
    price: number | string;
    is_active: boolean;
    taste_type_id: number | null;
    addon_kind: string | null;
    taste_type: { name: string } | { name: string }[] | null;
  }>;
  return rows.map((row) => ({
    ...row,
    taste_type: Array.isArray(row.taste_type)
      ? row.taste_type[0] ?? null
      : row.taste_type,
  })) as AddonRow[];
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
