/**
 * Fiksiran prikaz radnog vremena (footer, kontakt) — uvek do 23:00.
 * Do kada se na sajtu sme naručiti zavisi od intervala u admin podešavanjima.
 */
export function ContactHoursLines() {
  return (
    <div className="space-y-1">
      <p>Pon – pet: 12:00 – 23:00</p>
      <p>Sub – ned: 14:00 – 23:00</p>
    </div>
  );
}
