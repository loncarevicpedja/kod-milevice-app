import Link from "next/link";
import { ContactHoursLines } from "@/components/contact/ContactHoursLines";

export function Footer() {
  return (
    <footer className="mt-12 border-t border-sky/30 bg-sky/10">
      <div className="main-container flex flex-col gap-6 py-8 md:flex-row md:items-stretch md:justify-between">
        <div className="md:flex md:flex-col md:justify-between">
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
            <ContactHoursLines />
          </div>

        </div>

        <div className="md:flex md:flex-col md:justify-between">
          <h4 className="text-sm font-semibold text-brown-soft">Pratite nas</h4>

          <div className="mt-3 flex w-full justify-evenly gap-4 md:mt-6 md:flex-1 md:flex-col md:items-center md:justify-evenly md:gap-6">
            <Link
              href="https://instagram.com"
              target="_blank"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-sky text-brown-soft shadow-md transition hover:bg-sky/90"
              aria-label="Instagram profil"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="h-6 w-6"
                aria-hidden="true"
              >
                <rect
                  x="3"
                  y="3"
                  width="18"
                  height="18"
                  rx="5"
                  ry="5"
                  className="fill-brown-soft"
                />
                <circle cx="12" cy="12" r="4" className="fill-sky" />
                <circle cx="17" cy="7" r="1.3" className="fill-sky" />
              </svg>
            </Link>

            <Link
              href="https://tiktok.com"
              target="_blank"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-sky text-brown-soft shadow-md transition hover:bg-sky/90"
              aria-label="TikTok profil"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="h-6 w-6"
                aria-hidden="true"
              >
                <path
                  d="M16 5.5c.6 1.1 1.6 1.9 2.8 2.1V10c-1.3-.1-2.5-.6-3.6-1.4v5.5a4.9 4.9 0 1 1-4.9-4.9V11a2.5 2.5 0 1 0 2.5 2.5V4h3.2v1.5z"
                  className="fill-brown-soft"
                />
              </svg>
            </Link>

            <Link
              href="https://facebook.com"
              target="_blank"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-sky text-brown-soft shadow-md transition hover:bg-sky/90"
              aria-label="Facebook profil"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="h-6 w-6"
                aria-hidden="true"
              >
                <path
                  d="M13.5 21v-7h2.3l.4-2.8h-2.7V9c0-.8.2-1.3 1.4-1.3h1.4V5.2C15.9 5.1 15 5 14 5c-2.3 0-3.9 1.4-3.9 4v2.2H8v2.8h2.1v7h3.4z"
                  className="fill-brown-soft"
                />
              </svg>
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

