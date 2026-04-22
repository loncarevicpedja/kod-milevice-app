import { getFixedContactHoursLines } from "@/lib/fixedBusinessHours";

/** Radno vreme iz koda (`lib/fixedBusinessHours.ts`), ne iz baze. */
export function ContactHoursLines() {
  const hours = getFixedContactHoursLines();

  return (
    <>
      <p>{hours.line1}</p>
      <p>{hours.line2}</p>
    </>
  );
}
