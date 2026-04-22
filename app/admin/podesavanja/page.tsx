import Link from "next/link";
import { AdminSettingsForm } from "@/components/admin/AdminSettingsForm";

export default function AdminPodesavanjaPage() {
  return (
    <div>
      <Link href="/admin" className="text-sm text-gray-600 hover:text-rose">
        ← Dashboard
      </Link>
      <h1 className="mt-4 text-2xl font-semibold text-gray-800">
        Podešavanja (cena dostave, vremena, naručivanje)
      </h1>
      <p className="mt-1 text-sm text-gray-600">
        Cena dostave, vremena pripreme/dostave i{" "}
        <strong>interval kada se na sajtu sme naručiti</strong> (pon–pet i vikend,
        zona Belgrade). Footer i kontakt prikazuju fiksno radno vreme do 23:00; u
        formi ispod podešavaš stvarni kraj naručivanja (npr. 22:45). Vrednosti se
        čuvaju u tabeli{" "}
        <code className="text-xs">restaurant_settings</code> u Supabase-u.
      </p>
      <AdminSettingsForm />
    </div>
  );
}
