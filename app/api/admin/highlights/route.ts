import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/adminDb";
import { requireAdmin, unauthorizedResponse } from "@/lib/adminAuth";
import { parseOrderNo } from "@/lib/sortByOrderNo";

export async function GET() {
  if (!(await requireAdmin())) return unauthorizedResponse();

  const { data, error } = await getAdminDb()
    .from("category_highlight")
    .select(
      `
      id,
      product_id,
      is_active,
      order_no,
      badge,
      promo_title,
      promo_description,
      image_url,
      product:product_id (
        id,
        name,
        price,
        image_url,
        is_active,
        taste_type:taste_type_id ( name )
      )
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
    .from("category_highlight")
    .insert({
      product_id: productId,
      is_active: Boolean(body.is_active !== false),
      order_no: parseOrderNo(body.order_no),
      badge: body.badge ? String(body.badge).trim() : "NOVO U PONUDI",
      promo_title: body.promo_title ? String(body.promo_title).trim() : null,
      promo_description: body.promo_description
        ? String(body.promo_description).trim()
        : null,
      image_url: body.image_url ? String(body.image_url).trim() : null,
    })
    .select("id")
    .single();

  if (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data, { status: 201 });
}
