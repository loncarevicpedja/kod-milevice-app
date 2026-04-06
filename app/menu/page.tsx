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
  isSweetAddon,
  isSavoryAddon,
  toCartAddons,
  normalizeProductRows,
  groupProductsByCategory,
  isRezanciCategoryProduct,
  isClassicPancakeCategory,
} from "@/lib/menuUtils";
import type { CartAddon } from "@/components/cart/CartContext";
import { PUBLIC_TORTILLAS_VISIBLE } from "@/lib/publicSiteFlags";

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
      product_category_id,
      product_type:product_type_id ( name ),
      taste_type:taste_type_id ( name ),
      product_category:product_category_id ( name ),
      product_addon_slot (
        id,
        sort_order,
        label,
        max_select,
        product_addon_slot_addon (
          addon_id,
          addon (
            id,
            name,
            price,
            is_active
          )
        )
      )
    `,
    )
    .eq("is_active", true)
    .order("name", { ascending: true });

  if (error) {
    console.error("Error loading products", error);
    return [];
  }

  return normalizeProductRows(
    (data ?? []) as Parameters<typeof normalizeProductRows>[0],
  );
}

async function getAddons(): Promise<AddonRow[]> {
  const { data, error } = await supabase
    .from("addon")
    .select(
      `
      id,
      name,
      price,
      addon_kind,
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
    addon_kind: string | null;
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
                  addonSlots={
                    p.addonSlots.length > 0 ? p.addonSlots : undefined
                  }
                  isClassic={isClassicSection}
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
  const filterType =
    params.type === "tortilje"
      ? "tortilje"
      : params.type === "palacinke"
        ? "palacinke"
        : null;

  const [products, addons] = await Promise.all([
    getProducts(),
    getAddons(),
  ]);

  const pancakes = products
    .filter(isPancake)
    .filter((p) => !isRezanciCategoryProduct(p));
  const tortillas = products.filter(isTortilla);
  const rezanci = products.filter(isRezanciCategoryProduct);

  const pancakeSavory = pancakes.filter(isSavory);
  const pancakeSweet = pancakes.filter(isSweet);

  const savorySections = groupProductsByCategory(pancakeSavory);
  const sweetSections = groupProductsByCategory(pancakeSweet);
  const tortillaSections = groupProductsByCategory(tortillas);
  const rezanciSections = groupProductsByCategory(rezanci);

  const sweetAddons = toCartAddons(addons.filter(isSweetAddon));
  const savoryAddons = toCartAddons(addons.filter(isSavoryAddon));
  const showOnlyPancakes = filterType === "palacinke";
  const showOnlyTortillas = filterType === "tortilje";
  const showTortillaSection =
    PUBLIC_TORTILLAS_VISIBLE && (filterType === null || showOnlyTortillas);
  const showPancakeSection =
    filterType === null ||
    showOnlyPancakes ||
    (showOnlyTortillas && !PUBLIC_TORTILLAS_VISIBLE);

  return (
    <div>
      <h1 className="font-bakerie text-3xl text-brown-soft">
        {showOnlyPancakes
          ? "Palačinke"
          : showOnlyTortillas && PUBLIC_TORTILLAS_VISIBLE
            ? "Tortilje"
            : "Meni"}
      </h1>
      <p className="mt-1 text-sm text-brown-soft/80">
        Odaberi omiljenu kombinaciju – sve pripremamo tek kada naručiš.
      </p>
      <MenuCartNotice />

      {showPancakeSection && (
        <section className="mt-6">
          <h2 className="text-xl font-semibold text-brown-soft">Palačinke</h2>

          <div className="mt-4 rounded-3xl bg-cream/70 p-4">
            <h3 className="text-sm font-semibold text-brown-soft/90">Slane</h3>
            {savorySections.map((g) => {
              const classic = isClassicPancakeCategory(g.categoryName);
              return (
                <Section
                  key={`sav-${g.categoryId ?? g.categoryName}`}
                  title={g.categoryName}
                  products={g.products}
                  availableAddons={classic ? savoryAddons : undefined}
                  isClassicSection={classic}
                />
              );
            })}
          </div>

          <div className="mt-6 rounded-3xl bg-cream/70 p-4">
            <h3 className="text-sm font-semibold text-brown-soft/90">Slatke</h3>
            {sweetSections.map((g) => {
              const classic = isClassicPancakeCategory(g.categoryName);
              return (
                <Section
                  key={`swe-${g.categoryId ?? g.categoryName}`}
                  title={g.categoryName}
                  products={g.products}
                  availableAddons={classic ? sweetAddons : undefined}
                  isClassicSection={classic}
                />
              );
            })}
          </div>
        </section>
      )}

      {showTortillaSection && (
        <section className="mt-8">
          <h2 className="text-xl font-semibold text-brown-soft">Tortilje</h2>
          <div className="mt-4 rounded-3xl bg-cream/70 p-4">
            {tortillaSections.map((g) => (
              <Section
                key={`tort-${g.categoryId ?? g.categoryName}`}
                title={g.categoryName}
                products={g.products}
              />
            ))}
          </div>
        </section>
      )}

      {(filterType === null || filterType === "palacinke") &&
        rezanci.length > 0 && (
          <section className="mt-8">
            <h2 className="text-xl font-semibold text-brown-soft">Rezanci</h2>
            <div className="mt-4 rounded-3xl bg-cream/70 p-4">
              {rezanciSections.map((g) => (
                <Section
                  key={`rez-${g.categoryId ?? g.categoryName}`}
                  title={g.categoryName}
                  products={g.products}
                  availableAddons={sweetAddons}
                  isClassicSection
                />
              ))}
            </div>
          </section>
        )}
    </div>
  );
}
