import Image from "next/image";
import Link from "next/link";

const bestsellers = [
  {
    src: "/images/palacinke.png",
    alt: "Palačinke",
    title: "Palačinke",
    href: "/menu?type=palacinke",
  },
  {
    src: "/images/tortilje.png",
    alt: "Tortilje",
    title: "Tortilje",
    href: "/menu?type=tortilje",
  },
];

export function BestSellersSection() {
  return (
    <section className="mt-10">
      <h2 className="text-xl font-semibold text-brown-soft">
        Najprodavaniji proizvodi
      </h2>
      <div className="mt-4 grid grid-cols-2 gap-4">
        {bestsellers.map((item) => (
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
            <p className="mt-2 text-center text-sm font-semibold text-brown-soft">
              {item.title}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}

