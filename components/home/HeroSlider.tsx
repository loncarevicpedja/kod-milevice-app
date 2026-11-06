"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { PromoImage } from "@/components/media/PromoImage";
import type { ResolvedHomeSlide } from "@/lib/promoTypes";

const INTERVAL_MS = 5500;

export function HeroSlider({ slides }: { slides: ResolvedHomeSlide[] }) {
  const items = slides.length > 0 ? slides : [];
  const [index, setIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const paused = useRef(false);

  const go = useCallback(
    (next: number) => {
      if (items.length === 0) return;
      setIndex((current) => {
        const n = ((next % items.length) + items.length) % items.length;
        return n;
      });
    },
    [items.length],
  );

  const next = useCallback(() => go(index + 1), [go, index]);
  const prev = useCallback(() => go(index - 1), [go, index]);

  useEffect(() => {
    if (items.length < 2) return;
    const id = window.setInterval(() => {
      if (paused.current) return;
      setIndex((current) => (current + 1) % items.length);
    }, INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [items.length]);

  if (items.length === 0) return null;

  const slide = items[index];

  return (
    <div
      className="relative overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-sky/25"
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
      <div className="grid min-h-[190px] grid-cols-2 sm:min-h-[240px] md:min-h-[300px]">
        <div className="flex flex-col justify-center py-4 pl-11 pr-3 sm:px-6 md:pl-14 md:pr-8">
          {slide.badge && (
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-rose sm:text-xs">
              {slide.badge}
            </p>
          )}
          <h1 className="font-bakerie mt-1 text-lg leading-snug text-brown-soft sm:text-3xl md:text-4xl">
            {slide.title}
          </h1>
          {slide.subtitle && (
            <p className="mt-1 text-xs font-medium text-rose sm:text-sm">
              {slide.subtitle}
            </p>
          )}
          {slide.description && (
            <p className="mt-2 line-clamp-4 text-[11px] leading-relaxed text-brown-soft/80 sm:line-clamp-none sm:text-sm">
              {slide.description}
            </p>
          )}
          {slide.price_label && (
            <p className="mt-2 text-sm font-semibold text-brown-soft">
              {slide.price_label}
            </p>
          )}
        </div>

        <div className="relative min-h-[190px] bg-sky/15 sm:min-h-[240px] md:min-h-[300px]">
          {slide.image_url ? (
            <PromoImage
              src={slide.image_url}
              alt={slide.title}
              className="object-cover"
              priority
              sizes="(max-width: 768px) 50vw, 480px"
            />
          ) : null}
        </div>
      </div>

      {items.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Prethodni slajd"
            onClick={prev}
            className="absolute left-2 top-[42%] z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-lg leading-none text-brown-soft shadow-sm ring-1 ring-black/10"
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Sledeći slajd"
            onClick={next}
            className="absolute right-2 top-[42%] z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-lg leading-none text-brown-soft shadow-sm ring-1 ring-black/10"
          >
            ›
          </button>
        </>
      )}

      {items.length > 1 && (
        <div className="flex justify-center gap-1.5 py-2.5">
          {items.map((item, i) => (
            <button
              key={item.id}
              type="button"
              aria-label={`Slajd ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-2 w-2 rounded-full transition ${
                i === index ? "bg-rose" : "bg-sky"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
