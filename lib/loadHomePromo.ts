import { supabase } from "@/lib/supabaseClient";
import {
  isClassicPancakeCategory,
  isSavory,
  isSweet,
  normalizeProductRows,
  type ProductRow,
} from "@/lib/menuUtils";
import { PRODUCT_PUBLIC_SELECT } from "@/lib/productSelect";
import { compareByOrderNo } from "@/lib/sortByOrderNo";
import type {
  CategoryHighlightRow,
  FeaturedRow,
  HomeSlideRow,
  ResolvedHighlight,
  ResolvedHomeSlide,
} from "@/lib/promoTypes";

const FALLBACK_SLIDE: ResolvedHomeSlide = {
  id: 0,
  badge: "PANČEVO · DOSTAVA PALAČINKI",
  title: "Domaće palačinke na tvojoj adresi",
  subtitle: null,
  description:
    "Sveže spremljene palačinke po originalnom domaćem receptu. Brza dostava širom Pančeva.",
  image_url: "/images/fica.jpg",
  price_label: null,
  product_id: null,
};

function isSlideInWindow(slide: HomeSlideRow, now: Date): boolean {
  if (slide.starts_at) {
    const start = new Date(slide.starts_at);
    if (!Number.isNaN(start.getTime()) && now < start) return false;
  }
  if (slide.ends_at) {
    const end = new Date(slide.ends_at);
    if (!Number.isNaN(end.getTime()) && now > end) return false;
  }
  return true;
}

function tasteOf(product: ProductRow): "slane" | "slatke" | null {
  if (isSavory(product)) return "slane";
  if (isSweet(product)) return "slatke";
  return null;
}

export async function loadResolvedHomeSlides(): Promise<ResolvedHomeSlide[]> {
  const { data, error } = await supabase
    .from("home_slide")
    .select(
      `
      id,
      is_active,
      order_no,
      starts_at,
      ends_at,
      badge,
      title,
      subtitle,
      description,
      image_url,
      price_label,
      product_id
    `,
    )
    .eq("is_active", true)
    .order("order_no", { ascending: true });

  if (error) {
    console.error("home_slide load error:", error);
    return [FALLBACK_SLIDE];
  }

  const rows = (data ?? []) as HomeSlideRow[];
  const now = new Date();
  const active = rows.filter((s) => isSlideInWindow(s, now));
  if (active.length === 0) return [FALLBACK_SLIDE];

  const productIds = [
    ...new Set(
      active
        .map((s) => s.product_id)
        .filter((id): id is number => id != null),
    ),
  ];
  const products = await loadProductsByIds(productIds);
  const byId = new Map(products.map((p) => [p.id, p]));

  return active.map((slide) => {
    const product = slide.product_id != null ? byId.get(slide.product_id) : null;
    const title = slide.title.trim() || product?.name || "";
    const description =
      (slide.description ?? "").trim() || product?.description || null;
    const image_url = (slide.image_url ?? "").trim() || product?.image_url || null;
    const price_label =
      (slide.price_label ?? "").trim() ||
      (product ? `${product.price.toFixed(0)} RSD` : null);
    return {
      id: slide.id,
      badge: slide.badge,
      title,
      subtitle: slide.subtitle,
      description,
      image_url,
      price_label,
      product_id: slide.product_id,
    };
  });
}

export async function loadActiveFeaturedProducts(): Promise<ProductRow[]> {
  const { data, error } = await supabase
    .from("featured_product")
    .select("id, product_id, is_active, order_no")
    .eq("is_active", true)
    .order("order_no", { ascending: true });

  if (error) {
    console.error("featured_product load error:", error);
    return [];
  }

  const rows = ((data ?? []) as FeaturedRow[]).sort(compareByOrderNo);
  const products = await loadProductsByIds(rows.map((r) => r.product_id));
  const byId = new Map(products.map((p) => [p.id, p]));
  return rows
    .map((r) => byId.get(r.product_id))
    .filter((p): p is ProductRow => p != null && p.id != null);
}

export async function loadActiveHighlights(): Promise<ResolvedHighlight[]> {
  const { data, error } = await supabase
    .from("category_highlight")
    .select(
      "id, product_id, is_active, order_no, badge, promo_title, promo_description, image_url",
    )
    .eq("is_active", true)
    .order("order_no", { ascending: true });

  if (error) {
    console.error("category_highlight load error:", error);
    return [];
  }

  const rows = ((data ?? []) as CategoryHighlightRow[]).sort(compareByOrderNo);
  const products = await loadProductsByIds(rows.map((r) => r.product_id));
  const byId = new Map(products.map((p) => [p.id, p]));

  const resolved: ResolvedHighlight[] = [];

  for (const row of rows) {
    const product = byId.get(row.product_id);
    if (!product) continue;
    resolved.push({
      id: row.id,
      badge: row.badge?.trim() || "NOVO U PONUDI",
      title: row.promo_title?.trim() || product.name,
      description:
        row.promo_description?.trim() || product.description || null,
      image_url: row.image_url?.trim() || product.image_url,
      taste: tasteOf(product),
      product,
    });
  }

  return resolved;
}

export function highlightIsClassic(product: ProductRow): boolean {
  return isClassicPancakeCategory(product.product_category?.name);
}

async function loadProductsByIds(ids: number[]): Promise<ProductRow[]> {
  const unique = [...new Set(ids.filter((id) => Number.isFinite(id)))];
  if (unique.length === 0) return [];

  const { data, error } = await supabase
    .from("product")
    .select(PRODUCT_PUBLIC_SELECT)
    .in("id", unique)
    .eq("is_active", true);

  if (error) {
    console.error("products by id error:", error);
    return [];
  }

  return normalizeProductRows(
    (data ?? []) as Parameters<typeof normalizeProductRows>[0],
  );
}
