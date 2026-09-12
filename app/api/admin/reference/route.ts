import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { requireAdmin, unauthorizedResponse } from "@/lib/adminAuth";

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
      .select("id, name, is_active")
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
  const { kind, name, is_active } = body;

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

  const { data, error } = await supabase
    .from(REFERENCE_TABLES[kind])
    .insert({
      name: trimmedName,
      is_active: Boolean(is_active !== false),
    })
    .select("id, name, is_active")
    .single();

  if (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
