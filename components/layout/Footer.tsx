import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-12 border-t border-sky/30 bg-sky/10">
      <div className="main-container flex flex-col gap-6 py-8 md:flex-row md:items-start md:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-brown-soft">Kod Milevice</h3>
          <p className="mt-2 text-sm text-brown-soft/80">
            Domaće palačinke i tortilje, pripremljene po porudžbini.
          </p>
          <div className="mt-3 space-y-1 text-sm text-brown-soft/80">
            <p>Adresa: Pančevo (unesi tačnu adresu)</p>
            <p>
              Telefon:{" "}
              <a
                href="tel:0601234567"
                className="font-semibold text-rose underline-offset-4 hover:underline"
              >
                060 123 4567
              </a>
            </p>
          </div>
        </div>

        <div className="flex-1">
          <h4 className="text-sm font-semibold text-brown-soft">Lokacija</h4>
          <div className="mt-2 overflow-hidden rounded-xl border border-sky/40 bg-white shadow-sm">
            <iframe
              title="Mapa - Kod Milevice"
              src="https://maps.google.com/maps?q=Pan%C4%8Devo&t=&z=13&ie=UTF8&iwloc=&output=embed"
              className="h-40 w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-brown-soft">Pratite nas</h4>
          <div className="mt-3 flex items-center gap-3">
            <Link
              href="https://instagram.com"
              target="_blank"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-sky text-white shadow-md transition hover:bg-sky/90"
              aria-label="Instagram profil"
            >
              <span className="text-lg font-semibold">IG</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-sky/20 py-3 text-center text-xs text-brown-soft/70">
        © {new Date().getFullYear()} Kod Milevice. Sva prava zadržana.
      </div>
    </footer>
  );
}

