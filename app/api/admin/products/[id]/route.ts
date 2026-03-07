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
  const {
    name,
    description,
    price,
    image_url,
    is_active,
    product_type_id,
    taste_type_id,
    product_category_id,
  } = body;

  const updates: Record<string, unknown> = {};
  if (name !== undefined) updates.name = String(name).trim();
  if (description !== undefined)
    updates.description = description ? String(description).trim() : null;
  if (price !== undefined) updates.price = Number(price);
  if (image_url !== undefined)
    updates.image_url = image_url ? String(image_url).trim() : null;
  if (is_active !== undefined) updates.is_active = Boolean(is_active !== false);
  if (product_type_id !== undefined)
    updates.product_type_id = Number(product_type_id);
  if (taste_type_id !== undefined)
    updates.taste_type_id = taste_type_id ? Number(taste_type_id) : null;
  if (product_category_id !== undefined)
    updates.product_category_id = Number(product_category_id);

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "Nema podataka za izmenu" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("product")
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

  const { error } = await supabase.from("product").delete().eq("id", id);

  if (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
