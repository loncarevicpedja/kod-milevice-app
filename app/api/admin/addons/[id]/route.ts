import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { requireAdmin, unauthorizedResponse } from "@/lib/adminAuth";

export async function PATCH(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireAdmin())) return unauthorizedResponse();

  const { id } = await params;
  const body = await _request.json();
  const { name, price, is_active, taste_type_id, addon_kind } = body;

  const updates: Record<string, unknown> = {};
  if (name !== undefined) updates.name = String(name).trim();
  if (price !== undefined) updates.price = Number(price);
  if (is_active !== undefined) updates.is_active = Boolean(is_active !== false);
  if (taste_type_id !== undefined)
    updates.taste_type_id = taste_type_id ? Number(taste_type_id) : null;
  if (addon_kind !== undefined)
    updates.addon_kind =
      addon_kind === null || addon_kind === "" ? null : String(addon_kind);

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "Nema podataka za izmenu" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("addon")
    .update(updates)
    .eq("id", id)
    .select("id")
    .single();

  if (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireAdmin())) return unauthorizedResponse();

  const { id } = await params;

  const { error } = await supabase.from("addon").delete().eq("id", id);

  if (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
