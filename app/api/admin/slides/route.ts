import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/adminDb";
import { requireAdmin, unauthorizedResponse } from "@/lib/adminAuth";
import { parseOrderNo } from "@/lib/sortByOrderNo";

export async function GET() {
  if (!(await requireAdmin())) return unauthorizedResponse();

  const { data, error } = await getAdminDb()
    .from("home_slide")
    .select(
      "id, is_active, order_no, starts_at, ends_at, badge, title, subtitle, description, image_url, price_label, product_id",
    )
    .order("order_no", { ascending: true })
    .order("id", { ascending: true });

  if (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data ?? []);
}

export async function POST(request: Request) {
  if (!(await requireAdmin())) return unauthorizedResponse();

  const body = await request.json();
  const title = String(body.title ?? "").trim();
  if (!title) {
    return NextResponse.json({ error: "Naslov je obavezan" }, { status: 400 });
  }

  const { data, error } = await getAdminDb()
    .from("home_slide")
    .insert({
      title,
      subtitle: body.subtitle ? String(body.subtitle).trim() : null,
      description: body.description ? String(body.description).trim() : null,
      badge: body.badge ? String(body.badge).trim() : null,
      image_url: body.image_url ? String(body.image_url).trim() : null,
      price_label: body.price_label ? String(body.price_label).trim() : null,
      product_id: body.product_id ? Number(body.product_id) : null,
      is_active: Boolean(body.is_active !== false),
      order_no: parseOrderNo(body.order_no),
      starts_at: body.starts_at || null,
      ends_at: body.ends_at || null,
    })
    .select("id")
    .single();

  if (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data, { status: 201 });
}
