import Link from "next/link";
import { AdminSettingsForm } from "@/components/admin/AdminSettingsForm";

export default function AdminPodesavanjaPage() {
  return (
    <div>
      <Link href="/admin" className="text-sm text-gray-600 hover:text-rose">
        ← Dashboard
      </Link>
      <h1 className="mt-4 text-2xl font-semibold text-gray-800">
        Podešavanja (cena dostave, vremena, radno vreme)
      </h1>
      <p className="mt-1 text-sm text-gray-600">
        Ovde podešavaš cenu dostave, vremena pripreme/dostave i{" "}
        <strong>radno vreme posebno za radne dane (pon–pet) i posebno za vikend</strong>{" "}
        (sub–ned). Vrednosti se čuvaju u tabeli{" "}
        <code className="text-xs">restaurant_settings</code> u Supabase-u (jedan red
        po ključu). Posle prvog deploya pokreni SQL iz{" "}
        <code className="text-xs">supabase/restaurant_settings.sql</code> ili{" "}
        <code className="text-xs">supabase/restaurant_settings_weekday_weekend.sql</code>{" "}
        ako ti fale novi ključevi.
      </p>
      <AdminSettingsForm />
    </div>
  );
}
