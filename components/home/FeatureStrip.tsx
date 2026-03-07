import Image from "next/image";

const features = [
  {
    src: "/images/brza-dostava.png",
    alt: "Brza dostava",
    label: "Brza dostava",
  },
  {
    src: "/images/sveze-spremljeno.png",
    alt: "Sveže spremljeno",
    label: "Sveže spremljeno",
  },
  {
    src: "/images/domaci-recept.png",
    alt: "Domaći recept",
    label: "Domaći recept",
  },
];

export function FeatureStrip() {
  return (
    <section className="mt-8">
      <h2 className="sr-only">Zašto Kod Milevice</h2>
      <div className="grid grid-cols-3 gap-3">
        {features.map((item, i) => (
          <div
            key={item.label}
            className={`flex flex-col items-center rounded-2xl p-3 shadow-sm ring-1 ${
              i === 1 ? "bg-sky/30 ring-sky/50" : "bg-white ring-sky/30"
            }`}
          >
            <div className="relative mb-2 h-16 w-16">
              <Image
                src={item.src}
                alt={item.alt}
                fill
                className="object-contain"
              />
            </div>
            <p className="text-center text-xs font-semibold text-brown-soft">
              {item.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

