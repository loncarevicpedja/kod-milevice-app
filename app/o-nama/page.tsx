import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="space-y-8">
      <section className="mt-2 rounded-3xl bg-white/90 p-5 shadow-sm ring-1 ring-rose/10">
        <h1 className="font-bakerie text-3xl text-brown-soft">O nama</h1>
        <p className="mt-3 text-sm leading-relaxed text-brown-soft/80">
          Kod Milevice je mala porodična palačinkarnica iz Pančeva nastala iz
          ljubavi prema domaćim receptima i toploj atmosferi. Prve palačinke
          pekli smo za porodicu i prijatelje, a danas ih svakodnevno vozimo po
          celom gradu – direktno na tvoju adresu.
        </p>
        <p className="mt-2 text-sm leading-relaxed text-brown-soft/80">
          Svaka palačinka i tortilja se pravi po porudžbini, od pažljivo
          biranih sastojaka, bez prečica i zamrznutih podloga. Testo pravimo po
          starom porodičnom receptu, a nadeve stalno osvežavamo novim
          kombinacijama.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="relative h-56 overflow-hidden rounded-3xl bg-cream">
          <Image
            src="/images/fica.jpg"
            alt="Dostavno vozilo Kod Milevice"
            fill
            className="object-cover"
          />
        </div>
        <div className="relative h-56 overflow-hidden rounded-3xl bg-cream">
          <Image
            src="/images/palacinke.png"
            alt="Palačinke"
            fill
            className="object-contain"
          />
        </div>
      </section>

      <section className="rounded-3xl bg-cream/70 p-5">
        <h2 className="text-lg font-semibold text-brown-soft">
          Naš fokus – domaći recepti
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-brown-soft/80">
          Verujemo da se najbolja hrana pravi jednostavno: od dobrih sastojaka,
          sa pažnjom i na licu mesta. Zato kod nas nema gotovih smesa i
          industrijskih punjenja – sve nadeve pripremamo sami, a palačinke
          pečemo tek kada naručiš.
        </p>
      </section>
    </div>
  );
}

