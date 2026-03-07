import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { requireAdmin, unauthorizedResponse } from "@/lib/adminAuth";

export async function GET() {
  if (!(await requireAdmin())) return unauthorizedResponse();

  const [pt, tt, pc] = await Promise.all([
    supabase.from("product_type").select("id, name").order("name"),
    supabase.from("taste_type").select("id, name").order("name"),
    supabase.from("product_category").select("id, name").order("name"),
  ]);

  return NextResponse.json({
    productTypes: pt.data ?? [],
    tasteTypes: tt.data ?? [],
    productCategories: pc.data ?? [],
  });
}
