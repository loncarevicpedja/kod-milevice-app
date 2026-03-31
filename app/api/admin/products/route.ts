import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { requireAdmin, unauthorizedResponse } from "@/lib/adminAuth";
import { replaceProductAddonSlots } from "@/lib/adminProductAddonSlots";
import { mapProductRecordForAdmin } from "@/lib/productAddonSlots";

export async function GET() {
  if (!(await requireAdmin())) return unauthorizedResponse();

  const { data, error } = await supabase
    .from("product")
    .select(
      `
      id,
      name,
      description,
      price,
      image_url,
      is_active,
      product_type_id,
      taste_type_id,
      product_category_id,
      product_type:product_type_id(name),
      taste_type:taste_type_id(name),
      product_category:product_category_id(name),
      product_addon_slot(
        id,
        sort_order,
        label,
        max_select,
        product_addon_slot_addon(addon_id)
      )
    `
    )
    .order("name", { ascending: true });

  if (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const mapped = (data ?? []).map((row) =>
    mapProductRecordForAdmin(row as Record<string, unknown>)
  );

  return NextResponse.json(mapped);
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
    addon_slots,
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

  const newId = data?.id as number | undefined;
  if (newId != null && Array.isArray(addon_slots)) {
    try {
      await replaceProductAddonSlots(supabase, newId, addon_slots);
      if (addon_slots.length === 0) {
        const { data: pt } = await supabase
          .from("product_type")
          .select("name")
          .eq("id", Number(product_type_id))
          .maybeSingle();
        const typeName = pt?.name ? String(pt.name).toLowerCase() : "";
        if (typeName.includes("tort")) {
          await replaceProductAddonSlots(supabase, newId, [
            { sort_order: 0, label: "Meso", max_select: 3, addon_ids: [] },
            { sort_order: 1, label: "Namaz", max_select: 3, addon_ids: [] },
          ]);
        }
      }
    } catch (e) {
      console.error(e);
      return NextResponse.json(
        { error: e instanceof Error ? e.message : "Greška pri čuvanju slotova" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json(data, { status: 201 });
}
