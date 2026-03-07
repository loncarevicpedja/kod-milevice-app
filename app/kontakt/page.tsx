export default function KontaktPage() {
  return (
    <div className="space-y-6">
      <section className="mt-2 rounded-3xl bg-white/90 p-5 shadow-sm ring-1 ring-rose/10">
        <h1 className="font-bakerie text-3xl text-brown-soft">Kontakt</h1>
        <div className="mt-4 space-y-2 text-sm text-brown-soft/85">
          <p>
            <span className="font-semibold">Adresa:</span> Pančevo (upiši tačnu
            adresu)
          </p>
          <p>
            <span className="font-semibold">Telefon:</span>{" "}
            <a
              href="tel:0601234567"
              className="font-semibold text-rose underline-offset-4 hover:underline"
            >
              060 123 4567
            </a>
          </p>
          <p>
            <span className="font-semibold">Radno vreme:</span> svaki dan od
            16–00h (prilagodi po potrebi)
          </p>
        </div>
      </section>

      <section className="rounded-3xl bg-cream/70 p-4">
        <h2 className="text-sm font-semibold text-brown-soft">Lokacija</h2>
        <div className="mt-3 overflow-hidden rounded-2xl border border-mint/50 bg-white shadow-sm">
          <iframe
            title="Mapa - Kod Milevice"
            src="https://maps.google.com/maps?q=Pan%C4%8Devo&t=&z=13&ie=UTF8&iwloc=&output=embed"
            className="h-64 w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>
    </div>
  );
}

