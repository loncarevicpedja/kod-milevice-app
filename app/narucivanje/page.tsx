"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import {
  getFilteredSections,
  type ProductRow,
  type AddonRow,
  normalizeProductRows,
  normalizeAddonRows,
} from "@/lib/menuUtils";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { MenuCartNotice } from "@/components/menu/MenuCartNotice";

type Step = 0 | 1 | 2;

const STEPS_PALACINKE = [
  { label: "Tip hrane", step: 0 as Step },
  { label: "Ukus", step: 1 as Step },
  { label: "Proizvod", step: 2 as Step },
];

const STEPS_TORTILJE = [
  { label: "Tip hrane", step: 0 as Step },
  { label: "Proizvod", step: 2 as Step },
];

export default function NarucivanjePage() {
  const [step, setStep] = useState<Step>(0);
  const [type, setType] = useState<"palacinke" | "tortilje" | null>(null);
  const [taste, setTaste] = useState<"slane" | "slatke" | null>(null);
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [addons, setAddons] = useState<AddonRow[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const progressSteps = type === "tortilje" ? STEPS_TORTILJE : STEPS_PALACINKE;
  const currentProgressStep = type === "tortilje" ? (step === 0 ? 0 : 1) : step;

  useEffect(() => {
    if (step !== 2) return;

    let cancelled = false;
    setLoading(true);

    async function load() {
      const [prodRes, addonRes] = await Promise.all([
        supabase
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
          .order("name", { ascending: true }),
        supabase
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
          .order("id", { ascending: true }),
      ]);

      if (cancelled) return;
      if (!prodRes.error)
        setProducts(
          normalizeProductRows(
            (prodRes.data ?? []) as Parameters<typeof normalizeProductRows>[0],
          ),
        );
      if (!addonRes.error)
        setAddons(
          normalizeAddonRows(
            (addonRes.data ?? []) as Parameters<typeof normalizeAddonRows>[0],
          ),
        );
      setLoading(false);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [step, type, taste]);

  function goToStep(targetStep: Step) {
    if (targetStep === 0) {
      setStep(0);
      setType(null);
      setTaste(null);
    } else if (targetStep === 1) {
      setStep(1);
      setTaste(null);
    } else {
      setStep(2);
    }
  }

  function goBack() {
    if (step === 0) {
      router.push("/");
      return;
    }
    if (step === 1) {
      goToStep(0);
      return;
    }
    if (step === 2) {
      if (type === "palacinke") goToStep(1);
      else goToStep(0);
    }
  }

  const sections =
    step === 2 && type && (type === "tortilje" || taste)
      ? getFilteredSections(
          products,
          addons,
          type,
          type === "palacinke" ? taste : null,
        )
      : [];

  const hasAnyProducts = sections.some((s) => s.products.length > 0);

  return (
    <div className="space-y-6">
      <header className="mt-2 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={goBack}
          className="rounded-full bg-cream/80 px-3 py-1.5 text-xs font-medium text-brown-soft shadow-sm"
        >
          ← Nazad
        </button>

        <nav className="flex flex-1 items-center justify-center gap-1">
          {progressSteps.map((item, idx) => {
            const isCurrent = idx === currentProgressStep;
            const isPast =
              type === "tortilje" ? idx < currentProgressStep : idx < step;

            let allowed = true;
            if (item.step === 0) {
              allowed = true;
            } else if (item.step === 1) {
              // Ukus ima smisla samo za palačinke
              allowed = type === "palacinke";
            } else if (item.step === 2) {
              if (type === "tortilje") {
                allowed = true;
              } else if (type === "palacinke") {
                allowed = !!taste;
              } else {
                allowed = false;
              }
            }

            return (
              <button
                key={item.step}
                type="button"
                onClick={allowed ? () => goToStep(item.step) : undefined}
                aria-disabled={!allowed}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                  isCurrent
                    ? "bg-rose text-white shadow-md"
                    : isPast
                      ? "bg-rose/20 text-brown-soft hover:bg-rose/30"
                      : `bg-cream/80 text-brown-soft/50 ${
                          !allowed ? "cursor-not-allowed opacity-60" : ""
                        }`
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        <button
          type="button"
          onClick={() => router.push("/")}
          className="rounded-full bg-cream/80 px-3 py-1.5 text-xs font-medium text-brown-soft shadow-sm"
          aria-label="Zatvori"
        >
          ×
        </button>
      </header>

      <MenuCartNotice />

      {step === 0 && (
        <section className="rounded-3xl bg-white/90 p-5 shadow-sm ring-1 ring-rose/10">
          <h1 className="font-bakerie text-3xl text-brown-soft">
            Šta želiš da naručiš?
          </h1>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => {
                setType("palacinke");
                setStep(1);
              }}
              className="flex flex-col items-center rounded-3xl bg-cream/80 p-4 text-sm font-semibold text-brown-soft shadow-sm hover:bg-cream"
            >
              <div className="relative mb-2 h-24 w-full overflow-hidden rounded-2xl">
                <Image
                  src="/images/palacinke.jpeg"
                  alt="Palačinke"
                  fill
                  className="object-cover"
                />
              </div>
              Palačinke
            </button>
            <button
              type="button"
              onClick={() => {
                setType("tortilje");
                setStep(2);
              }}
              className="flex flex-col items-center rounded-3xl bg-cream/80 p-4 text-sm font-semibold text-brown-soft shadow-sm hover:bg-cream"
            >
              <div className="relative mb-2 h-24 w-full overflow-hidden rounded-2xl">
                <Image
                  src="/images/tortilje.jpeg"
                  alt="Tortilje"
                  fill
                  className="object-cover"
                />
              </div>
              Tortilje
            </button>
          </div>
        </section>
      )}

      {step === 1 && type === "palacinke" && (
        <section className="rounded-3xl bg-white/90 p-5 shadow-sm ring-1 ring-rose/10">
          <h2 className="text-lg font-semibold text-brown-soft">
            Da li želiš slane ili slatke palačinke?
          </h2>
          <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <button
              type="button"
              onClick={() => {
                setTaste("slane");
                setStep(2);
              }}
              className="flex flex-col items-center rounded-3xl bg-cream/80 p-4 font-semibold text-brown-soft shadow-sm hover:bg-cream"
            >
              <div className="relative mb-2 h-24 w-full overflow-hidden rounded-2xl">
                <Image
                  src="/images/cl-slana.jpeg"
                  alt="Slane palačinke"
                  fill
                  className="object-cover"
                />
              </div>
              Slane
            </button>
            <button
              type="button"
              onClick={() => {
                setTaste("slatke");
                setStep(2);
              }}
              className="flex flex-col items-center rounded-3xl bg-cream/80 p-4 font-semibold text-brown-soft shadow-sm hover:bg-cream"
            >
              <div className="relative mb-2 h-24 w-full overflow-hidden rounded-2xl">
                <Image
                  src="/images/cl-slatka.jpeg"
                  alt="Slatke palačinke"
                  fill
                  className="object-cover"
                />
              </div>
              Slatke
            </button>
          </div>
        </section>
      )}

      {step === 2 && (
        <section className="space-y-6">
          <h2 className="font-bakerie text-2xl text-brown-soft">
            {type === "palacinke"
              ? taste === "slane"
                ? "Slane palačinke"
                : "Slatke palačinke"
              : "Tortilje"}
          </h2>

          {loading ? (
            <p className="text-sm text-brown-soft/70">
              Učitavanje proizvoda...
            </p>
          ) : !hasAnyProducts ? (
            <p className="text-sm text-brown-soft/70">
              Nema proizvoda u ovoj kategoriji.
            </p>
          ) : (
            <div className="space-y-6">
              {sections.map(
                (sec) =>
                  sec.products.length > 0 && (
                    <div key={sec.sectionKey ?? sec.title}>
                      <h3 className="text-lg font-semibold text-brown-soft">
                        {sec.title}
                      </h3>
                      <div className="mt-3 space-y-3">
                        {sec.products.map((p) => (
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
                                    p.addonSlots.length > 0
                                      ? p.addonSlots
                                      : undefined
                                  }
                                  isClassic={sec.isClassicSection}
                                  availableAddons={sec.availableAddons}
                                />
                              </div>
                            </div>
                          </article>
                        ))}
                      </div>
                    </div>
                  ),
              )}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
