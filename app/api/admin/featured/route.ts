import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/adminDb";
import { requireAdmin, unauthorizedResponse } from "@/lib/adminAuth";
import { parseOrderNo } from "@/lib/sortByOrderNo";

export async function GET() {
  if (!(await requireAdmin())) return unauthorizedResponse();

  const { data, error } = await getAdminDb()
    .from("featured_product")
    .select(
      `
      id,
      product_id,
      is_active,
      order_no,
      product:product_id ( id, name, price, image_url, is_active )
    `,
    )
    .order("order_no", { ascending: true });

  if (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data ?? []);
}

export async function POST(request: Request) {
  if (!(await requireAdmin())) return unauthorizedResponse();
  const body = await request.json();
  const productId = Number(body.product_id);
  if (!productId) {
    return NextResponse.json({ error: "Izaberi proizvod" }, { status: 400 });
  }

  const { data, error } = await getAdminDb()
    .from("featured_product")
    .insert({
      product_id: productId,
      is_active: Boolean(body.is_active !== false),
      order_no: parseOrderNo(body.order_no),
    })
    .select("id")
    .single();

  if (error) {
    console.error(error);
    const msg = error.message.includes("duplicate")
      ? "Proizvod je već u istaknutoj listi"
      : error.message;
    return NextResponse.json({ error: msg }, { status: 500 });
  }
  return NextResponse.json(data, { status: 201 });
}
