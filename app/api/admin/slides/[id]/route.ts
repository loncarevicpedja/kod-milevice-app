import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/adminDb";
import { requireAdmin, unauthorizedResponse } from "@/lib/adminAuth";
import { parseOrderNo } from "@/lib/sortByOrderNo";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await requireAdmin())) return unauthorizedResponse();
  const { id } = await params;
  const body = await request.json();

  const updates: Record<string, unknown> = {};
  if (body.title !== undefined) updates.title = String(body.title).trim();
  if (body.subtitle !== undefined)
    updates.subtitle = body.subtitle ? String(body.subtitle).trim() : null;
  if (body.description !== undefined)
    updates.description = body.description
      ? String(body.description).trim()
      : null;
  if (body.badge !== undefined)
    updates.badge = body.badge ? String(body.badge).trim() : null;
  if (body.image_url !== undefined)
    updates.image_url = body.image_url ? String(body.image_url).trim() : null;
  if (body.price_label !== undefined)
    updates.price_label = body.price_label
      ? String(body.price_label).trim()
      : null;
  if (body.product_id !== undefined)
    updates.product_id = body.product_id ? Number(body.product_id) : null;
  if (body.is_active !== undefined)
    updates.is_active = Boolean(body.is_active !== false);
  if (body.order_no !== undefined) updates.order_no = parseOrderNo(body.order_no);
  if (body.starts_at !== undefined) updates.starts_at = body.starts_at || null;
  if (body.ends_at !== undefined) updates.ends_at = body.ends_at || null;

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "Nema podataka za izmenu" }, { status: 400 });
  }

  const { data, error } = await getAdminDb()
    .from("home_slide")
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
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await requireAdmin())) return unauthorizedResponse();
  const { id } = await params;
  const { error } = await getAdminDb().from("home_slide").delete().eq("id", id);
  if (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
