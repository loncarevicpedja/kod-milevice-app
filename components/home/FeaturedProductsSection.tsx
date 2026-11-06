import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { PromoImage } from "@/components/media/PromoImage";
import { highlightIsClassic } from "@/lib/loadHomePromo";
import { isSavory, isSweet, type ProductRow } from "@/lib/menuUtils";
import type { CartAddon } from "@/components/cart/CartContext";

export function FeaturedProductsSection({
  products,
  sweetAddons = [],
  savoryAddons = [],
}: {
  products: ProductRow[];
  sweetAddons?: CartAddon[];
  savoryAddons?: CartAddon[];
}) {
  if (!products.length) return null;

  return (
    <section className="mt-10">
      <h2 className="text-xl font-semibold text-brown-soft">Izdvajamo</h2>
      <div className="mt-4 space-y-3">
        {products.map((p) => {
          const classic = highlightIsClassic(p);
          const addons = isSavory(p)
            ? savoryAddons
            : isSweet(p)
              ? sweetAddons
              : undefined;
          return (
            <article
              key={p.id}
              className="flex gap-3 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-mint/40"
            >
              <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl bg-cream">
                {p.image_url ? (
                  <PromoImage
                    src={p.image_url}
                    alt={p.name}
                    className="object-cover"
                    sizes="80px"
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
                    <h3 className="text-sm font-semibold text-brown-soft">
                      {p.name}
                    </h3>
                    {p.description && (
                      <p className="mt-1 text-xs text-brown-soft/80">
                        {p.description}
                      </p>
                    )}
                  </div>
                  <p className="flex-shrink-0 text-sm font-semibold text-brown-soft">
                    {p.price.toFixed(0)} RSD
                  </p>
                </div>
                <div className="mt-auto flex justify-end pt-2">
                  <AddToCartButton
                    productId={p.id}
                    name={p.name}
                    basePrice={p.price}
                    addonSlots={
                      p.addonSlots.length > 0 ? p.addonSlots : undefined
                    }
                    isClassic={classic}
                    availableAddons={classic ? addons : undefined}
                  />
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
