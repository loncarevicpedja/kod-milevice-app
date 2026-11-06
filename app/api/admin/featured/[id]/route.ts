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
  if (body.is_active !== undefined)
    updates.is_active = Boolean(body.is_active !== false);
  if (body.order_no !== undefined) updates.order_no = parseOrderNo(body.order_no);
  if (body.product_id !== undefined) updates.product_id = Number(body.product_id);

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "Nema podataka za izmenu" }, { status: 400 });
  }

  const { data, error } = await getAdminDb()
    .from("featured_product")
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
  const { error } = await getAdminDb()
    .from("featured_product")
    .delete()
    .eq("id", id);
  if (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
