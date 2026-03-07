import type { CartAddon } from "@/components/cart/CartContext";

export type ProductRow = {
  id: number;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  product_type: { name: string } | null;
  taste_type: { name: string } | null;
  product_category: { name: string } | null;
};

export type AddonRow = {
  id: number;
  name: string;
  price: number | string;
  taste_type: { name: string } | null;
};

export function isPancake(row: ProductRow) {
  return row.product_type?.name.toLowerCase().includes("pala") ?? false;
}

export function isTortilla(row: ProductRow) {
  return row.product_type?.name.toLowerCase().includes("tort") ?? false;
}

export function isSweet(row: ProductRow) {
  return row.taste_type?.name.toLowerCase().includes("slat") ?? false;
}

export function isSavory(row: ProductRow) {
  return row.taste_type?.name.toLowerCase().includes("slan") ?? false;
}

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
  return row.taste_type?.name.toLowerCase().includes("slat") ?? false;
}

export function isSavoryAddon(row: AddonRow) {
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
    return [
      {
        title: "Classic tortilla",
        products: tortillas.filter((p) => categoryKey(p) === "classic-tortilla"),
        isClassicSection: false,
      },
      {
        title: "Obrok tortilla",
        products: tortillas.filter((p) => categoryKey(p) === "obrok-tortilla"),
        isClassicSection: false,
      },
    ];
  }

  const pancakes = products.filter(isPancake);
  const savory = pancakes.filter(isSavory);
  const sweet = pancakes.filter(isSweet);

  if (taste === "slane") {
    return [
      {
        title: "Classic palačinke",
        products: savory.filter((p) => categoryKey(p) === "classic-palacinke"),
        availableAddons: savoryAddons,
        isClassicSection: true,
      },
      {
        title: "Mega palačinke",
        products: savory.filter((p) => categoryKey(p) === "mega-palacinke"),
        isClassicSection: false,
      },
      {
        title: "Naš mix palačinke",
        products: savory.filter((p) => categoryKey(p) === "mix-palacinke"),
        isClassicSection: false,
      },
    ];
  }

  return [
    {
      title: "Classic palačinke",
      products: sweet.filter((p) => categoryKey(p) === "classic-palacinke"),
      availableAddons: sweetAddons,
      isClassicSection: true,
    },
    {
      title: "Mega palačinke",
      products: sweet.filter((p) => categoryKey(p) === "mega-palacinke"),
      isClassicSection: false,
    },
    {
      title: "Naš mix palačinke",
      products: sweet.filter((p) => categoryKey(p) === "mix-palacinke"),
      isClassicSection: false,
    },
  ];
}
