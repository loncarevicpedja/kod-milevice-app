/**
 * „Classic“ / osnovne palačinke – isti uslov kao na meniju (naslov kategorije iz baze).
 */
export function isClassicPancakeCategory(categoryName: string | null | undefined) {
  const n = (categoryName ?? "").toLowerCase();
  const pal =
    n.includes("palač") || n.includes("palacin") || n.includes("palačin");
  const osnovneSlane = n.includes("osnovn") && n.includes("slan");
  return (
    (n.includes("osnovn") && pal) ||
    (n.includes("classic") && pal) ||
    osnovneSlane
  );
}
