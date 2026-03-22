import Link from "next/link";

const links = [
  { href: "/admin/proizvodi", label: "Proizvodi", desc: "Palačinke, tortilje" },
  { href: "/admin/dodaci", label: "Dodaci", desc: "Slatki i slani dodaci" },
  {
    href: "/admin/kategorije",
    label: "Tipovi i kategorije",
    desc: "Product type, ukus, kategorija",
  },
  { href: "/admin/porudzbine", label: "Porudžbine", desc: "Pregled i status" },
  {
    href: "/admin/podesavanja",
    label: "Podešavanja",
    desc: "Cena dostave, radno vreme pon–pet i vikend, vremena",
  },
];

export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-800">
        Upravljanje sadržajem
      </h1>
      <p className="mt-1 text-sm text-gray-600">
        Izaberi sekciju za uređivanje proizvoda, dodataka i porudžbina.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {links.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-rose/40 hover:shadow-md"
          >
            <h2 className="font-semibold text-gray-800">{item.label}</h2>
            <p className="mt-1 text-sm text-gray-500">{item.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
