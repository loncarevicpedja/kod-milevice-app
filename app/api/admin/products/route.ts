import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { requireAdmin, unauthorizedResponse } from "@/lib/adminAuth";

export async function GET() {
  if (!(await requireAdmin())) return unauthorizedResponse();

  const { data, error } = await supabase
    .from("product")
    .select(
      "id, name, description, price, image_url, is_active, product_type_id, taste_type_id, product_category_id, product_type:product_type_id(name), taste_type:taste_type_id(name), product_category:product_category_id(name)"
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

  if (!name || price == null || !product_type_id || !product_category_id) {
    return NextResponse.json(
      { error: "Obavezni podaci: name, price, product_type_id, product_category_id" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("product")
    .insert({
      name: String(name).trim(),
      description: description ? String(description).trim() : null,
      price: Number(price),
      image_url: image_url ? String(image_url).trim() : null,
      is_active: Boolean(is_active !== false),
      product_type_id: Number(product_type_id),
      taste_type_id: taste_type_id ? Number(taste_type_id) : null,
      product_category_id: Number(product_category_id),
      order_status: "available",
    })
    .select("id")
    .single();

  if (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data, { status: 201 });
}
