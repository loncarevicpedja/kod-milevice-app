import type { CartAddon } from "@/components/cart/CartContext";
import type { ProductAddonSlotNormalized } from "@/lib/productAddonSlots";
import { normalizeProductAddonSlots } from "@/lib/productAddonSlots";

export type ProductRow = {
  id: number;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  product_type: { name: string } | null;
  taste_type: { name: string } | null;
  product_category_id: number | null;
  product_category: { name: string } | null;
  /** Per-product addon groups from DB (tortilje); empty = no picker */
  addonSlots: ProductAddonSlotNormalized[];
};

export type AddonRow = {
  id: number;
  name: string;
  price: number | string;
  taste_type: { name: string } | null;
  addon_kind?: string | null;
};

type Rel = { name: string } | { name: string }[] | null;

export function normalizeProductRows(
  rows: Array<{
    id: number;
    name: string;
    description: string | null;
    price: number;
    image_url: string | null;
    product_type_id?: number;
    product_category_id?: number | null;
    product_type?: Rel;
    taste_type?: Rel;
    product_category?: Rel;
    product_addon_slot?: unknown;
  }>
): ProductRow[] {
  return rows.map((row) => {
    const slots = normalizeProductAddonSlots(
      row.product_addon_slot as Parameters<typeof normalizeProductAddonSlots>[0]
    );
    return {
      id: row.id,
      name: row.name,
      description: row.description,
      price: row.price,
      image_url: row.image_url,
      product_category_id:
        row.product_category_id != null ? Number(row.product_category_id) : null,
      product_type: Array.isArray(row.product_type)
        ? row.product_type[0] ?? null
        : row.product_type ?? null,
      taste_type: Array.isArray(row.taste_type)
        ? row.taste_type[0] ?? null
        : row.taste_type ?? null,
      product_category: Array.isArray(row.product_category)
        ? row.product_category[0] ?? null
        : row.product_category ?? null,
      addonSlots: slots,
    };
  });
}

export function normalizeAddonRows(
  rows: Array<{
    id: number;
    name: string;
    price: number | string;
    taste_type?: Rel;
    addon_kind?: string | null;
  }>
): AddonRow[] {
  return rows.map((row) => ({
    ...row,
    taste_type: Array.isArray(row.taste_type)
      ? row.taste_type[0] ?? null
      : row.taste_type ?? null,
  }));
}

/** Dodaci samo za tortilje (slotovi), ne za listu classic palačinki */
export function isTortillaOnlyAddon(row: AddonRow) {
  const k = (row.addon_kind ?? "").trim();
  return k === "tortilla_meat" || k === "tortilla_spread";
}

export function isTortilla(row: ProductRow) {
  const t = row.product_type?.name.toLowerCase() ?? "";
  if (t.includes("tort")) return true;
  const c = row.product_category?.name.toLowerCase() ?? "";
  return c.includes("tort");
}

/** Palačinke u meniju – ne uključuje tortilje čak i ako je tip u bazi „palačinka“ a kategorija tortilja */
export function isPancake(row: ProductRow) {
  const t = row.product_type?.name.toLowerCase() ?? "";
  if (!t.includes("pala")) return false;
  if (isTortilla(row) && !t.includes("tort")) return false;
  return true;
}

export function isSweet(row: ProductRow) {
  return row.taste_type?.name.toLowerCase().includes("slat") ?? false;
}

export function isSavory(row: ProductRow) {
  return row.taste_type?.name.toLowerCase().includes("slan") ?? false;
}

/** Kategorija „Rezanci“ – posebna sekcija na meniju */
export function isRezanciCategoryProduct(row: ProductRow) {
  const n = (row.product_category?.name ?? "").toLowerCase();
  return n.includes("rezan");
}

/**
 * „Classic“ palačinke sa izbornikom dodataka (Osnovne / staro Classic) – po nazivu kategorije.
 */
export function isClassicPancakeCategory(categoryName: string | null | undefined) {
  const n = (categoryName ?? "").toLowerCase();
  const pal =
    n.includes("palač") || n.includes("palacin") || n.includes("palačin");
  return (
    (n.includes("osnovn") && pal) ||
    (n.includes("classic") && pal)
  );
}

/** Grupisanje proizvoda po kategoriji iz baze (naslov sekcije = naziv kategorije) */
export function groupProductsByCategory(products: ProductRow[]): {
  categoryId: number | null;
  categoryName: string;
  products: ProductRow[];
}[] {
  const buckets = new Map<
    string,
    { categoryId: number | null; name: string; products: ProductRow[] }
  >();

  for (const p of products) {
    const id = p.product_category_id;
    const embeddedName = p.product_category?.name?.trim() || "";
    const name = embeddedName || "Bez kategorije";
    const key =
      id != null && !Number.isNaN(Number(id))
        ? `id:${Number(id)}`
        : `name:${name}`;
    if (!buckets.has(key)) {
      buckets.set(key, {
        categoryId: id != null && !Number.isNaN(Number(id)) ? Number(id) : null,
        name,
        products: [],
      });
    }
    buckets.get(key)!.products.push(p);
  }

  const out = [...buckets.values()].map((v) => ({
    categoryId: v.categoryId,
    categoryName: v.name,
    products: v.products,
  }));

  out.sort((a, b) =>
    a.categoryName.localeCompare(b.categoryName, "sr-Latn", {
      sensitivity: "base",
    })
  );
  return out;
}

/** @deprecated Zadržano za kompatibilnost; koristi groupProductsByCategory */
export function categoryKey(row: ProductRow) {
  const name = row.product_category?.name.toLowerCase() ?? "";
  if (name.includes("classic") && name.includes("tort"))
    return "classic-tortilla";
  if (name.includes("obrok")) return "obrok-tortilla";
  if (name.includes("classic")) return "classic-palacinke";
  if (name.includes("mega")) return "mega-palacinke";
  if (name.includes("mix") || name.includes("naš") || name.includes("nas"))
    return "mix-palacinke";
  return "other";
}

export function isSweetAddon(row: AddonRow) {
  if (isTortillaOnlyAddon(row)) return false;
  return row.taste_type?.name.toLowerCase().includes("slat") ?? false;
}

export function isSavoryAddon(row: AddonRow) {
  if (isTortillaOnlyAddon(row)) return false;
  return row.taste_type?.name.toLowerCase().includes("slan") ?? false;
}

export function toCartAddons(rows: AddonRow[]): CartAddon[] {
  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    price: typeof row.price === "number" ? row.price : Number(row.price ?? 0),
  }));
}

export type ProductSection = {
  title: string;
  /** Za stabilan React key kad ima više sekcija */
  sectionKey?: string;
  products: ProductRow[];
  availableAddons?: CartAddon[];
  isClassicSection: boolean;
};

export function getFilteredSections(
  products: ProductRow[],
  addons: AddonRow[],
  type: "palacinke" | "tortilje",
  taste: "slane" | "slatke" | null
): ProductSection[] {
  const sweetAddons = toCartAddons(addons.filter(isSweetAddon));
  const savoryAddons = toCartAddons(addons.filter(isSavoryAddon));

  if (type === "tortilje") {
    const tortillas = products.filter(isTortilla);
    return groupProductsByCategory(tortillas).map((g) => ({
      title: g.categoryName,
      sectionKey:
        g.categoryId != null ? `tort-cat-${g.categoryId}` : `tort-${g.categoryName}`,
      products: g.products,
      isClassicSection: false,
    }));
  }

  const pancakes = products
    .filter(isPancake)
    .filter((p) => !isRezanciCategoryProduct(p));
  const savory = pancakes.filter(isSavory);
  const sweet = pancakes.filter(isSweet);

  const addonList =
    taste === "slane" ? savoryAddons : taste === "slatke" ? sweetAddons : [];

  const pool = taste === "slane" ? savory : taste === "slatke" ? sweet : [];

  return groupProductsByCategory(pool).map((g) => {
    const classic = isClassicPancakeCategory(g.categoryName);
    return {
      title: g.categoryName,
      sectionKey:
        g.categoryId != null ? `pal-cat-${g.categoryId}` : `pal-${g.categoryName}`,
      products: g.products,
      availableAddons: classic ? addonList : undefined,
      isClassicSection: classic,
    };
  });
}
