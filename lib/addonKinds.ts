export const ADDON_KIND_VALUES = [
  "",
  "pancake_sweet",
  "pancake_savory",
  "tortilla_meat",
  "tortilla_spread",
  "none",
] as const;

export type AddonKind = (typeof ADDON_KIND_VALUES)[number];

export const ADDON_KIND_LABELS: Record<string, string> = {
  "": "— (nije dodeljeno)",
  pancake_sweet: "Palačinka slatki dodaci",
  pancake_savory: "Palačinka slani dodaci",
  tortilla_meat: "Tortilja – meso / punjenje",
  tortilla_spread: "Tortilja – namazi",
  none: "Bez kategorije (meni)",
};

export function parseAddonKind(v: unknown): AddonKind | null {
  if (v == null || v === "") return null;
  const s = String(v);
  if (s === "none") return "none";
  if (
    s === "pancake_sweet" ||
    s === "pancake_savory" ||
    s === "tortilla_meat" ||
    s === "tortilla_spread"
  ) {
    return s;
  }
  return null;
}
