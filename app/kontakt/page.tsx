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
            <p>Pon - pet: 12:00 - 23:00</p>
            <p>Sub - ned: 14:00 - 23:00</p>
          </div>
        </div>
      </section>

      <section className="rounded-3xl bg-cream/70 p-4">
        <h2 className="text-sm font-semibold text-brown-soft">Lokacija</h2>
        <div className="mt-3 overflow-hidden rounded-2xl border border-mint/50 bg-white shadow-sm">
          <iframe
            title="Mapa - Kod Milevice"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4348.464153058809!2d20.643361!3d44.866561499999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x475a7ec19224c889%3A0x72120b223203574d!2z0JTRgCDQltCw0YDQutCwINCk0L7Qs9Cw0YDQsNGI0LAgMSwg0J_QsNC90YfQtdCy0L4!5e1!3m2!1ssr!2srs!4v1773251197927!5m2!1ssr!2srso&t=&z=13&ie=UTF8&iwloc=&output=embed"
            className="h-64 w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>
    </div>
  );
}

