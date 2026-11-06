"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { PromoImage } from "@/components/media/PromoImage";
import { highlightIsClassic } from "@/lib/loadHomePromo";
import type { ResolvedHighlight } from "@/lib/promoTypes";
import type { CartAddon } from "@/components/cart/CartContext";

const INTERVAL_MS = 5500;

export function PromoHighlightSlider({
  highlights,
  availableAddons,
}: {
  highlights: ResolvedHighlight[];
  availableAddons?: CartAddon[];
}) {
  const items = highlights;
  const [index, setIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const paused = useRef(false);

  const go = useCallback(
    (next: number) => {
      if (items.length === 0) return;
      setIndex((current) => ((next % items.length) + items.length) % items.length);
    },
    [items.length],
  );

  const next = useCallback(() => go(index + 1), [go, index]);
  const prev = useCallback(() => go(index - 1), [go, index]);

  useEffect(() => {
    if (index >= items.length) setIndex(0);
  }, [items.length, index]);

  useEffect(() => {
    if (items.length < 2) return;
    const id = window.setInterval(() => {
      if (paused.current) return;
      setIndex((current) => (current + 1) % items.length);
    }, INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [items.length]);

  if (items.length === 0) return null;

  const highlight = items[index] ?? items[0];
  const p = highlight.product;
  const classic = highlightIsClassic(p);

  return (
    <article
      className="relative mb-5 overflow-hidden rounded-3xl shadow-sm ring-1 ring-rose/30"
      onMouseEnter={() => {
        paused.current = true;
      }}
      onMouseLeave={() => {
        paused.current = false;
      }}
      onTouchStart={(e) => {
        touchStartX.current = e.changedTouches[0]?.clientX ?? null;
      }}
      onTouchEnd={(e) => {
        const start = touchStartX.current;
        const end = e.changedTouches[0]?.clientX;
        touchStartX.current = null;
        if (start == null || end == null) return;
        const delta = end - start;
        if (Math.abs(delta) < 40) return;
        if (delta < 0) next();
        else prev();
      }}
    >
      <div className="grid min-h-[170px] grid-cols-2 sm:min-h-[220px] md:min-h-[260px]">
        <div className="flex flex-col justify-center bg-rose/15 py-4 pl-11 pr-3 sm:pl-12 sm:pr-6">
          {highlight.badge && (
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-rose">
              {highlight.badge}
            </p>
          )}
          <h3 className="font-bakerie mt-1 text-lg leading-snug text-brown-soft sm:text-2xl md:text-3xl">
            {highlight.title}
          </h3>
          {highlight.description && (
            <p className="mt-2 line-clamp-4 text-[11px] leading-relaxed text-brown-soft/80 sm:line-clamp-none sm:text-sm">
              {highlight.description}
            </p>
          )}
        </div>
        <div className="relative min-h-[170px] bg-sky/20 sm:min-h-[220px] md:min-h-[260px]">
          {highlight.image_url ? (
            <PromoImage
              src={highlight.image_url}
              alt={highlight.title}
              className="object-cover"
              sizes="(max-width: 768px) 50vw, 480px"
            />
          ) : null}
        </div>
      </div>

      {items.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Prethodni novitet"
            onClick={prev}
            className="absolute left-2 top-[38%] z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-lg leading-none text-brown-soft shadow-sm ring-1 ring-black/10"
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Sledeći novitet"
            onClick={next}
            className="absolute right-2 top-[38%] z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-lg leading-none text-brown-soft shadow-sm ring-1 ring-black/10"
          >
            ›
          </button>
        </>
      )}

      {items.length > 1 && (
        <div className="flex justify-center gap-1.5 bg-rose/15 pt-2">
          {items.map((item, i) => (
            <button
              key={item.id}
              type="button"
              aria-label={`Novitet ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-2 w-2 rounded-full transition ${
                i === index ? "bg-rose" : "bg-brown-soft/25"
              }`}
            />
          ))}
        </div>
      )}

      <div className="flex items-center justify-between gap-3 bg-rose/15 py-3 pl-11 pr-3 sm:pl-12 sm:pr-6">
        <p className="shrink-0 text-sm font-semibold text-brown-soft sm:text-base">
          {p.price.toFixed(0)} RSD
        </p>
        <AddToCartButton
          productId={p.id}
          name={p.name}
          basePrice={p.price}
          addonSlots={p.addonSlots.length > 0 ? p.addonSlots : undefined}
          isClassic={classic}
          availableAddons={classic ? availableAddons : undefined}
        />
      </div>
    </article>
  );
}

/** @deprecated Use PromoHighlightSlider */
export function PromoHighlightCard({
  highlight,
  availableAddons,
}: {
  highlight: ResolvedHighlight;
  availableAddons?: CartAddon[];
}) {
  return (
    <PromoHighlightSlider
      highlights={[highlight]}
      availableAddons={availableAddons}
    />
  );
}
