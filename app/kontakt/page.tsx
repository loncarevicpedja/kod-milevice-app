import { ContactHoursLines } from "@/components/contact/ContactHoursLines";

export default function KontaktPage() {
  return (
    <div className="space-y-6">
      <section className="mt-2 rounded-3xl bg-white/90 p-5 shadow-sm ring-1 ring-rose/10">
        <h1 className="font-bakerie text-3xl text-brown-soft">Kontakt</h1>
        <div className="mt-4 space-y-2 text-sm text-brown-soft/85">
          <p>
            <span className="font-semibold">Adresa:</span> Dr Žarka Fogaraša 1, 26000 Pančevo
          </p>
          <p>
            <span className="font-semibold">Telefon:</span>{" "}
            <a
              href="tel:+38169712612"
              className="font-semibold text-rose underline-offset-4 hover:underline"
            >
              +381 69 712 612
            </a>
          </p>
          <p>
            <span className="font-semibold">Radno vreme:</span> 
          </p>
          <div>
            <ContactHoursLines />
          </div>
        </div>
      </section>

      <section className="rounded-3xl bg-cream/70 p-4">
        <h2 className="text-sm font-semibold text-brown-soft">Lokacija</h2>
        <div className="mt-3 overflow-hidden rounded-2xl border border-mint/50 bg-white shadow-sm">
          <iframe
            title="Mapa - Kod Milevice"
            src="https://maps.app.goo.gl/ksRhFZ98s5cz8KRS6"
            className="h-64 w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>
    </div>
  );
}

