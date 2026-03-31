import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { requireAdmin, unauthorizedResponse } from "@/lib/adminAuth";

export async function GET() {
  if (!(await requireAdmin())) return unauthorizedResponse();

  const { data, error } = await supabase
    .from("addon")
    .select(
      "id, name, price, is_active, taste_type_id, addon_kind, taste_type:taste_type_id(name)"
    )
    .order("name", { ascending: true });

  if (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data ?? []);
}

export async function POST(request: Request) {
  if (!(await requireAdmin())) return unauthorizedResponse();

  const body = await request.json();
  const { name, price, is_active, taste_type_id, addon_kind } = body;

  if (!name || price == null) {
    return NextResponse.json(
      { error: "Obavezni podaci: name, price" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("addon")
    .insert({
      name: String(name).trim(),
      price: Number(price),
      is_active: Boolean(is_active !== false),
      taste_type_id: taste_type_id ? Number(taste_type_id) : null,
      addon_kind:
        addon_kind === null || addon_kind === undefined || addon_kind === ""
          ? null
          : String(addon_kind),
    })
    .select("id")
    .single();

  if (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data, { status: 201 });
}
