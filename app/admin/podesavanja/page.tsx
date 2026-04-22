import Link from "next/link";
import { AdminSettingsForm } from "@/components/admin/AdminSettingsForm";

export default function AdminPodesavanjaPage() {
  return (
    <div>
      <Link href="/admin" className="text-sm text-gray-600 hover:text-rose">
        ← Dashboard
      </Link>
      <h1 className="mt-4 text-2xl font-semibold text-gray-800">
        Podešavanja (cena dostave, vremena)
      </h1>
      <p className="mt-1 text-sm text-gray-600">
        Ovde podešavaš cenu dostave, vremena pripreme/dostave i slično. Radno vreme
        za naručivanje i prikaz na sajtu je u kodu (
        <code className="text-xs">lib/fixedBusinessHours.ts</code>
        ). Ostale vrednosti se čuvaju u tabeli{" "}
        <code className="text-xs">restaurant_settings</code> u Supabase-u (jedan red
        po ključu).
      </p>
      <AdminSettingsForm />
    </div>
  );
}
