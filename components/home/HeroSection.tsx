import Image from "next/image";
import Link from "next/link";
import { OrderNowCta } from "@/components/order/OrderNowCta";
import { PUBLIC_TORTILLAS_VISIBLE } from "@/lib/publicSiteFlags";

export function HeroSection({
  deliveryFeeRsd,
}: {
  deliveryFeeRsd?: number;
} = {}) {
  return (
    <section className="mt-4 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-sky/20 md:flex md:items-center md:gap-8">
      <div className="relative mx-auto mb-4 h-44 w-full max-w-md overflow-hidden rounded-3xl bg-sky/20 ring-1 ring-sky/30 md:mb-0 md:flex-1">
        <Image
          src="/images/fica.jpg"
          alt="Dostavno vozilo Kod Milevice"
          fill
          className="object-cover"
          priority
        />
      </div>
      <div className="md:flex-1">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-rose">
          Pančevo · Dostava palačinki
        </p>
        <h1 className="font-bakerie mt-2 text-3xl font-bold leading-tight text-brown-soft sm:text-4xl">
          Domaće palačinke na tvojoj adresi
        </h1>
        <p className="mt-3 text-sm text-brown-soft/80 sm:text-base">
          {PUBLIC_TORTILLAS_VISIBLE ? (
            <>
              Sveže spremljene palačinke i tortilje, po originalnom domaćem
              receptu. Brza dostava širom Pančeva.
            </>
          ) : (
            <>
              Sveže spremljene palačinke po originalnom domaćem receptu. Brza
              dostava širom Pančeva.
            </>
          )}
        </p>
        <div className="mt-4 flex flex-nowrap items-center gap-2 sm:gap-3">
          <OrderNowCta className="flex-1 min-w-0 inline-flex items-center justify-center rounded-full bg-rose px-4 py-2.5 text-xs font-semibold text-white shadow-md transition hover:bg-rose/90 sm:flex-none sm:px-6 sm:text-sm" />
          <Link
            href="/menu"
            className="flex-1 min-w-0 inline-flex items-center justify-center rounded-full bg-sky px-4 py-2.5 text-xs font-semibold text-brown-soft shadow-md transition hover:bg-sky/90 sm:flex-none sm:px-5 sm:text-sm"
          >
            Pogledaj meni
          </Link>
        </div>
      </div>
    </section>
  );
}

