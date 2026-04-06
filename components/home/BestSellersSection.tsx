import Image from "next/image";
import Link from "next/link";
import { PUBLIC_TORTILLAS_VISIBLE } from "@/lib/publicSiteFlags";

const bestsellers = [
  {
    src: "/images/palacinke1.png",
    alt: "Palačinke",
    title: "Palačinke",
    href: "/menu?type=palacinke",
  },
  {
    src: "/images/tortilje1.png",
    alt: "Tortilje",
    title: "Tortilje",
    href: "/menu?type=tortilje",
  },
];

export function BestSellersSection() {
  const items = PUBLIC_TORTILLAS_VISIBLE
    ? bestsellers
    : bestsellers.filter((b) => !b.href.includes("tortilje"));

  return (
    <section className="mt-10">
      <h2 className="text-xl font-semibold text-brown-soft">
        Najprodavaniji proizvodi
      </h2>
      <div
        className={`mt-4 grid gap-4 ${items.length === 1 ? "grid-cols-1 sm:max-w-xs sm:mx-auto" : "grid-cols-2"}`}
      >
        {items.map((item) => (
          <Link
            key={item.title}
            href={item.href}
            className="group overflow-hidden rounded-3xl bg-sky p-3 shadow-sm ring-1 ring-sky/60 transition hover:ring-brown-soft/20"
          >
            <div className="relative h-28 w-full">
              <Image
                src={item.src}
                alt={item.alt}
                fill
                className="object-contain transition-transform group-hover:scale-105"
              />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
