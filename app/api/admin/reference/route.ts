import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { requireAdmin, unauthorizedResponse } from "@/lib/adminAuth";
import { parseOrderNo } from "@/lib/sortByOrderNo";

const REFERENCE_TABLES = {
  product_type: "product_type",
  taste_type: "taste_type",
  product_category: "product_category",
} as const;

type ReferenceKind = keyof typeof REFERENCE_TABLES;

function isReferenceKind(value: unknown): value is ReferenceKind {
  return (
    typeof value === "string" &&
    Object.prototype.hasOwnProperty.call(REFERENCE_TABLES, value)
  );
}

export async function GET() {
  if (!(await requireAdmin())) return unauthorizedResponse();

  const [pt, tt, pc] = await Promise.all([
    supabase
      .from("product_type")
      .select("id, name, is_active")
      .order("name"),
    supabase.from("taste_type").select("id, name, is_active").order("name"),
    supabase
      .from("product_category")
      .select("id, name, is_active, order_no")
      .order("order_no")
      .order("name"),
  ]);

  return NextResponse.json({
    productTypes: pt.data ?? [],
    tasteTypes: tt.data ?? [],
    productCategories: pc.data ?? [],
  });
}

export async function POST(request: Request) {
  if (!(await requireAdmin())) return unauthorizedResponse();

  const body = await request.json();
  const { kind, name, is_active, order_no } = body;

  if (!isReferenceKind(kind)) {
    return NextResponse.json(
      {
        error:
          "Nepoznat tip. kind mora biti product_type, taste_type ili product_category",
      },
      { status: 400 }
    );
  }

  const trimmedName = typeof name === "string" ? name.trim() : "";
  if (!trimmedName) {
    return NextResponse.json({ error: "Naziv je obavezan" }, { status: 400 });
  }

  const insert: Record<string, unknown> = {
    name: trimmedName,
    is_active: Boolean(is_active !== false),
  };
  if (kind === "product_category") {
    insert.order_no = parseOrderNo(order_no);
  }

  const { data, error } = await supabase
    .from(REFERENCE_TABLES[kind])
    .insert(insert)
    .select(
      kind === "product_category"
        ? "id, name, is_active, order_no"
        : "id, name, is_active",
    )
    .single();

  if (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}

export async function PATCH(request: Request) {
  if (!(await requireAdmin())) return unauthorizedResponse();

  const body = await request.json();
  const { kind, id, name, is_active, order_no } = body;

  if (!isReferenceKind(kind)) {
    return NextResponse.json({ error: "Nepoznat tip" }, { status: 400 });
  }
  if (id == null) {
    return NextResponse.json({ error: "ID je obavezan" }, { status: 400 });
  }

  const updates: Record<string, unknown> = {};
  if (name !== undefined) {
    const trimmed = String(name).trim();
    if (!trimmed) {
      return NextResponse.json({ error: "Naziv je obavezan" }, { status: 400 });
    }
    updates.name = trimmed;
  }
  if (is_active !== undefined) updates.is_active = Boolean(is_active !== false);
  if (kind === "product_category" && order_no !== undefined) {
    updates.order_no = parseOrderNo(order_no);
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "Nema podataka za izmenu" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from(REFERENCE_TABLES[kind])
    .update(updates)
    .eq("id", id)
    .select(
      kind === "product_category"
        ? "id, name, is_active, order_no"
        : "id, name, is_active",
    )
    .single();

  if (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}
