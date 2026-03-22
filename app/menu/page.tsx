import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { MenuCartNotice } from "@/components/menu/MenuCartNotice";
import {
  type ProductRow,
  type AddonRow,
  isPancake,
  isTortilla,
  isSweet,
  isSavory,
  categoryKey,
  isSweetAddon,
  isSavoryAddon,
  toCartAddons,
} from "@/lib/menuUtils";
import type { CartAddon } from "@/components/cart/CartContext";

async function getProducts(): Promise<ProductRow[]> {
  const { data, error } = await supabase
    .from("product")
    .select(
      `
      id,
      name,
      description,
      price,
      image_url,
      product_type:product_type_id ( name ),
      taste_type:taste_type_id ( name ),
      product_category:product_category_id ( name )
    `,
    )
    .eq("is_active", true)
    .order("name", { ascending: true });

  if (error) {
    console.error("Error loading products", error);
    return [];
  }

  type Rel = { name: string } | { name: string }[] | null;
  const rows = (data ?? []) as Array<{
    id: number;
    name: string;
    description: string | null;
    price: number;
    image_url: string | null;
    product_type: Rel;
    taste_type: Rel;
    product_category: Rel;
  }>;
  return rows.map((row) => ({
    ...row,
    product_type: Array.isArray(row.product_type)
      ? row.product_type[0] ?? null
      : row.product_type,
    taste_type: Array.isArray(row.taste_type)
      ? row.taste_type[0] ?? null
      : row.taste_type,
    product_category: Array.isArray(row.product_category)
      ? row.product_category[0] ?? null
      : row.product_category,
  })) as ProductRow[];
}

async function getAddons(): Promise<AddonRow[]> {
  const { data, error } = await supabase
    .from("addon")
    .select(
      `
      id,
      name,
      price,
      taste_type:taste_type_id ( name )
    `,
    )
    .eq("is_active", true)
    .order("price", { ascending: true });

  if (error) {
    console.error("Error loading addons", error);
    return [];
  }

  type Rel = { name: string } | { name: string }[] | null;
  const rows = (data ?? []) as Array<{
    id: number;
    name: string;
    price: number | string;
    taste_type: Rel;
  }>;
  return rows.map((row) => ({
    ...row,
    taste_type: Array.isArray(row.taste_type)
      ? row.taste_type[0] ?? null
      : row.taste_type,
  })) as AddonRow[];
}

function Section({
  title,
  products,
  availableAddons,
  isClassicSection = false,
}: {
  title: string;
  products: ProductRow[];
  availableAddons?: CartAddon[];
  isClassicSection?: boolean;
}) {
  if (!products.length) return null;

  return (
    <section className="mt-6">
      <h3 className="text-lg font-semibold text-brown-soft">{title}</h3>
      <div className="mt-3 space-y-3">
        {products.map((p) => (
          <article
            key={p.id}
            className="flex gap-3 rounded-2xl bg-white/90 p-3 shadow-sm ring-1 ring-rose/10"
          >
            <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl bg-cream">
              {p.image_url ? (
                <Image
                  src={p.image_url}
                  alt={p.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xs text-brown-soft/50">
                  Bez slike
                </div>
              )}
            </div>
            <div className="flex min-h-20 flex-1 flex-col">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-semibold text-brown-soft">
                    {p.name}
                  </h4>
                  {p.description && (
                    <p className="mt-1 text-xs text-brown-soft/80">
                      {p.description}
                    </p>
                  )}
                </div>
                <div className="flex-shrink-0 text-right">
                  <p className="text-sm font-semibold text-brown-soft">
                    {p.price.toFixed(0)} RSD
                  </p>
                </div>
              </div>
              <div className="mt-auto flex justify-end pt-2">
                <AddToCartButton
                  productId={p.id}
                  name={p.name}
                  basePrice={p.price}
                  isClassic={isClassicSection && categoryKey(p) === "classic-palacinke"}
                  availableAddons={
                    isClassicSection ? availableAddons : undefined
                  }
                />
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default async function MenuPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const params = await searchParams;
  const filterType = params.type === "tortilje" ? "tortilje" : params.type === "palacinke" ? "palacinke" : null;

  const [products, addons] = await Promise.all([
    getProducts(),
    getAddons(),
  ]);

  const pancakes = products.filter(isPancake);
  const tortillas = products.filter(isTortilla);

  const pancakeSavory = pancakes.filter(isSavory);
  const pancakeSweet = pancakes.filter(isSweet);

  const groupedPancakeSavory = {
    classic: pancakeSavory.filter(
      (p) => categoryKey(p) === "classic-palacinke",
    ),
    mega: pancakeSavory.filter((p) => categoryKey(p) === "mega-palacinke"),
    mix: pancakeSavory.filter((p) => categoryKey(p) === "mix-palacinke"),
  };

  const groupedPancakeSweet = {
    classic: pancakeSweet.filter(
      (p) => categoryKey(p) === "classic-palacinke",
    ),
    mega: pancakeSweet.filter((p) => categoryKey(p) === "mega-palacinke"),
    mix: pancakeSweet.filter((p) => categoryKey(p) === "mix-palacinke"),
  };

  const classicTortilla = tortillas.filter(
    (p) => categoryKey(p) === "classic-tortilla",
  );
  const obrokTortilla = tortillas.filter(
    (p) => categoryKey(p) === "obrok-tortilla",
  );

  const sweetAddons = toCartAddons(addons.filter(isSweetAddon));
  const savoryAddons = toCartAddons(addons.filter(isSavoryAddon));

  const showOnlyPancakes = filterType === "palacinke";
  const showOnlyTortillas = filterType === "tortilje";

  return (
    <div>
      <h1 className="font-bakerie text-3xl text-brown-soft">
        {showOnlyPancakes
          ? "Palačinke"
          : showOnlyTortillas
            ? "Tortilje"
            : "Meni palačinki i tortilja"}
      </h1>
      <p className="mt-1 text-sm text-brown-soft/80">
        Odaberi omiljenu kombinaciju – sve pripremamo tek kada naručiš.
      </p>
      <MenuCartNotice />

      {(filterType === null || showOnlyPancakes) && (
      <section className="mt-6">
        <h2 className="text-xl font-semibold text-brown-soft">Palačinke</h2>

        <div className="mt-4 rounded-3xl bg-cream/70 p-4">
          <h3 className="text-sm font-semibold text-brown-soft/90">Slane</h3>
          <Section
            title="Classic palačinke"
            products={groupedPancakeSavory.classic}
            availableAddons={savoryAddons}
            isClassicSection
          />
          <Section
            title="Mega palačinke"
            products={groupedPancakeSavory.mega}
          />
          <Section
            title="Naš mix palačinke"
            products={groupedPancakeSavory.mix}
          />
        </div>

        <div className="mt-6 rounded-3xl bg-cream/70 p-4">
          <h3 className="text-sm font-semibold text-brown-soft/90">Slatke</h3>
          <Section
            title="Classic palačinke"
            products={groupedPancakeSweet.classic}
            availableAddons={sweetAddons}
            isClassicSection
          />
          <Section
            title="Mega palačinke"
            products={groupedPancakeSweet.mega}
          />
          <Section
            title="Naš mix palačinke"
            products={groupedPancakeSweet.mix}
          />
        </div>
      </section>
      )}

      {(filterType === null || showOnlyTortillas) && (
      <section className="mt-8">
        <h2 className="text-xl font-semibold text-brown-soft">Tortilje</h2>
        <div className="mt-4 rounded-3xl bg-cream/70 p-4">
          <Section title="Classic tortilla" products={classicTortilla} />
          <Section title="Obrok tortilla" products={obrokTortilla} />
        </div>
      </section>
      )}
    </div>
  );
}

