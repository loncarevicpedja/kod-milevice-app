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
            <p>Adresa: Dr Žarka Fogaraša 1, 26000 Pančevo</p>
            <p>
              Telefon:{" "}
              <a
                href="tel:+38169712612"
                className="font-semibold text-rose underline-offset-4 hover:underline"
              >
                +381 69 712 612
              </a>
            </p>
          </div>
          
          <div className="mt-3 space-y-1 text-sm text-brown-soft/80">
            <p className="text-lg font-semibold text-brown-soft">Radno vreme:</p>
            <p>Pon - pet: 12:00 - 23:00</p>
            <p>Sub - ned: 14:00 - 23:00</p>
          </div>

        </div>

        <div>
          <h4 className="text-sm font-semibold text-brown-soft">Pratite nas</h4>
          
          <div className="mt-3 flex items-center gap-3">
            <Link
              href="https://instagram.com"
              target="_blank"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-sky text-brown-soft shadow-md transition hover:bg-sky/90"
              aria-label="Instagram profil"
            >
              <span className="text-lg font-semibold">IG</span>
            </Link>
          </div>

          <div className="mt-3 flex items-center gap-3">
            <Link
              href="https://tiktok.com"
              target="_blank"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-sky text-brown-soft shadow-md transition hover:bg-sky/90"
              aria-label="TikTok profil"
            >
              <span className="text-lg font-semibold">TT</span>
            </Link>
          </div>

          <div className="mt-3 flex items-center gap-3">
            <Link
              href="https://facebook.com"
              target="_blank"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-sky text-brown-soft shadow-md transition hover:bg-sky/90"
              aria-label="Facebook profil"
            >
              <span className="text-lg font-semibold">FB</span>
            </Link>
          </div>
        </div>

        <div className="flex-1">
          <h4 className="text-sm font-semibold text-brown-soft">Lokacija</h4>
          <div className="mt-2 overflow-hidden rounded-xl border border-sky/40 bg-white shadow-sm">
            <iframe
              title="Mapa - Kod Milevice"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4348.464153058809!2d20.643361!3d44.866561499999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x475a7ec19224c889%3A0x72120b223203574d!2z0JTRgCDQltCw0YDQutCwINCk0L7Qs9Cw0YDQsNGI0LAgMSwg0J_QsNC90YfQtdCy0L4!5e1!3m2!1ssr!2srs!4v1773251197927!5m2!1ssr!2srs"
              className="h-45 w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>

      <div className="border-t border-sky/20 py-3 text-center text-xs text-brown-soft/70">
        © {new Date().getFullYear()} Kod Milevice. Sva prava zadržana.
      </div>
    </footer>
  );
}

