export const ADDON_KIND_VALUES = [
  "",
  "pancake_sweet",
  "pancake_savory",
  "pancake_savory_meat",
  "pancake_savory_spread",
  "tortilla_meat",
  "tortilla_spread",
  "none",
] as const;

export type AddonKind = (typeof ADDON_KIND_VALUES)[number];

export const ADDON_KIND_LABELS: Record<string, string> = {
  "": "— (nije dodeljeno)",
  pancake_sweet: "Palačinka slatki dodaci",
  pancake_savory: "Palačinka slani dodaci (flat izbornik)",
  pancake_savory_meat: "Osnovne slane – meso (grupa u slotu)",
  pancake_savory_spread: "Osnovne slane – namazi (grupa u slotu)",
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
    s === "pancake_savory_meat" ||
    s === "pancake_savory_spread" ||
    s === "tortilla_meat" ||
    s === "tortilla_spread"
  ) {
    return s;
  }
  return null;
}
