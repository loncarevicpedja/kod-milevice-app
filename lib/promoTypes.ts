import type { ProductRow } from "@/lib/menuUtils";

export type HomeSlideRow = {
  id: number;
  is_active: boolean;
  order_no: number;
  starts_at: string | null;
  ends_at: string | null;
  badge: string | null;
  title: string;
  subtitle: string | null;
  description: string | null;
  image_url: string | null;
  price_label: string | null;
  product_id: number | null;
};

export type ResolvedHomeSlide = {
  id: number;
  badge: string | null;
  title: string;
  subtitle: string | null;
  description: string | null;
  image_url: string | null;
  price_label: string | null;
  product_id: number | null;
};

export type FeaturedRow = {
  id: number;
  product_id: number;
  is_active: boolean;
  order_no: number;
};

export type CategoryHighlightRow = {
  id: number;
  product_id: number;
  is_active: boolean;
  order_no: number;
  badge: string | null;
  promo_title: string | null;
  promo_description: string | null;
  image_url: string | null;
};

export type ResolvedHighlight = {
  id: number;
  badge: string | null;
  title: string;
  description: string | null;
  image_url: string | null;
  taste: "slane" | "slatke" | null;
  product: ProductRow;
};
