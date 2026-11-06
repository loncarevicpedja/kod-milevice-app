import Link from "next/link";
import { OrderNowCta } from "@/components/order/OrderNowCta";
import { HeroSlider } from "@/components/home/HeroSlider";
import type { ResolvedHomeSlide } from "@/lib/promoTypes";

export function HeroSection({ slides }: { slides: ResolvedHomeSlide[] }) {
  return (
    <section className="mt-4">
      <HeroSlider slides={slides} />
      <div className="mt-4 flex items-center gap-3">
        <OrderNowCta className="flex-1 inline-flex items-center justify-center rounded-full bg-rose px-4 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-rose/90" />
        <Link
          href="/menu"
          className="flex-1 inline-flex items-center justify-center rounded-full bg-sky px-4 py-3 text-sm font-semibold text-brown-soft shadow-md transition hover:bg-sky/90"
        >
          Pogledaj meni
        </Link>
      </div>
    </section>
  );
}
