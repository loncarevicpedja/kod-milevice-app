/**
 * „Classic“ / osnovne palačinke – isti uslov kao na meniju (naslov kategorije iz baze).
 * U bazi često nema reči „palačinka“ u nazivu (npr. samo „Osnovne slatke“), ili je latinica bez dijakritika.
 */
export function isClassicPancakeCategory(categoryName: string | null | undefined) {
  const n = (categoryName ?? "").toLowerCase();
  const pal =
    n.includes("palač") ||
    n.includes("palacin") ||
    n.includes("palačin") ||
    n.includes("palac");
  const slatki = n.includes("slat") || n.includes("sweet");
  const osnovneSlane = n.includes("osnovn") && n.includes("slan");
  const osnovneSlatke = n.includes("osnovn") && slatki;
  const klasicniSlatki =
    (n.includes("klasi") || n.includes("classic")) && (pal || slatki);
  /** Kategorija „Rezanci“ – na /narucivanje nema posebne sekcije kao na /menu, pa ovde uključujemo slatke dodatke. */
  const rezanci =
    n.includes("rezan") || n.includes("резан");
  return (
    (n.includes("osnovn") && pal) ||
    (n.includes("classic") && pal) ||
    osnovneSlane ||
    osnovneSlatke ||
    klasicniSlatki ||
    rezanci
  );
}
