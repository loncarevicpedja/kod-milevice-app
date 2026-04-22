"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRestaurantSettings } from "@/components/settings/RestaurantSettingsContext";

type FormState = {
  delivery_fee_rsd: number;
  prep_time_minutes: number;
  delivery_extra_minutes: number;
  menu_cart_enabled: boolean;
  order_email_enabled: boolean;
};

function apiJsonToForm(data: Record<string, unknown>): FormState {
  const rawCart = data.menu_cart_enabled;
  const menuCartEnabled =
    typeof rawCart === "boolean"
      ? rawCart
      : String(rawCart ?? "true").toLowerCase() !== "false";

  const rawEmail = data.order_email_enabled;
  const orderEmailEnabled =
    typeof rawEmail === "boolean"
      ? rawEmail
      : ["true", "1"].includes(
          String(rawEmail ?? "").trim().toLowerCase(),
        );

  return {
    delivery_fee_rsd: Number(data.delivery_fee_rsd ?? 200),
    prep_time_minutes: Number(data.prep_time_minutes ?? 25),
    delivery_extra_minutes: Number(data.delivery_extra_minutes ?? 25),
    menu_cart_enabled: menuCartEnabled,
    order_email_enabled: orderEmailEnabled,
  };
}

export function AdminSettingsForm() {
  const { refresh: refreshPublicSettings } = useRestaurantSettings();
  const [form, setForm] = useState<FormState | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/admin/settings", { cache: "no-store" });
      if (!res.ok) {
        setMessage("Ne mogu da učitam podešavanja.");
        setLoading(false);
        return;
      }
      const data = (await res.json()) as Record<string, unknown>;
      setForm(apiJsonToForm(data));
      setLoading(false);
    })();
  }, []);

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    if (!form) return;
    setSaving(true);
    setMessage(null);
    const res = await fetch("/api/admin/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
      cache: "no-store",
    });
    setSaving(false);
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setMessage((j as { error?: string }).error ?? "Greška pri čuvanju.");
      return;
    }
    const saved = (await res.json()) as Record<string, unknown>;
    setForm(apiJsonToForm(saved));
    setMessage("Podešavanja su sačuvana.");
    await refreshPublicSettings();
  }

  if (loading || !form) {
    return <p className="text-sm text-gray-600">Učitavanje...</p>;
  }

  return (
    <form
      onSubmit={handleSave}
      className="mt-6 max-w-lg space-y-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
    >
      <div>
        <label className="block text-xs font-medium text-gray-600">
          Cena dostave (RSD)
        </label>
        <input
          type="number"
          min={0}
          className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
          value={form.delivery_fee_rsd}
          onChange={(e) =>
            setForm((f) =>
              f ? { ...f, delivery_fee_rsd: Number(e.target.value) } : f,
            )
          }
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600">
          Vreme pripreme (minuti)
        </label>
        <input
          type="number"
          min={0}
          className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
          value={form.prep_time_minutes}
          onChange={(e) =>
            setForm((f) =>
              f ? { ...f, prep_time_minutes: Number(e.target.value) } : f,
            )
          }
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600">
          Dodatno vreme za dostavu (minuti, sabira se u poruci uz pripremu)
        </label>
        <input
          type="number"
          min={0}
          className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
          value={form.delivery_extra_minutes}
          onChange={(e) =>
            setForm((f) =>
              f ? { ...f, delivery_extra_minutes: Number(e.target.value) } : f,
            )
          }
        />
      </div>

      <div className="flex items-start gap-3 rounded-xl border border-gray-200 bg-gray-50/80 p-4">
        <input
          id="menu_cart_enabled"
          type="checkbox"
          className="mt-0.5 h-4 w-4 rounded border-gray-300 text-rose focus:ring-rose"
          checked={form.menu_cart_enabled}
          onChange={(e) =>
            setForm((f) =>
              f ? { ...f, menu_cart_enabled: e.target.checked } : f,
            )
          }
        />
        <label htmlFor="menu_cart_enabled" className="text-sm text-gray-700">
          <span className="font-medium">Dozvoli dodavanje u korpu</span>
          <span className="mt-1 block text-xs text-gray-500">
            Isključeno: proizvodi na meniju i u čarobnjaku za naručivanje ostaju
            vidljivi, ali dugme „Dodaj u korpu“ je onemogućeno (samo pregled).
          </span>
        </label>
      </div>

      <div className="flex items-start gap-3 rounded-xl border border-amber-100 bg-amber-50/60 p-4">
        <input
          id="order_email_enabled"
          type="checkbox"
          className="mt-0.5 h-4 w-4 rounded border-gray-300 text-rose focus:ring-rose"
          checked={form.order_email_enabled}
          onChange={(e) =>
            setForm((f) =>
              f ? { ...f, order_email_enabled: e.target.checked } : f,
            )
          }
        />
        <label htmlFor="order_email_enabled" className="text-sm text-gray-700">
          <span className="font-medium">
            Rezerva: šalji porudžbinu i na email (pored POS štampača)
          </span>
          <span className="mt-1 block text-xs text-gray-600">
            <strong>Podrazumevano je isključeno</strong> – porudžbine se snimaju u
            bazu i idu na <strong>POS terminal / štampač</strong>. Uključi ovo ako
            terminal ne prima ili ne štampa: tada će kopija porudžbine stizati i na
            email restorana (Resend), dok POS ponovo ne proradi.
          </span>
        </label>
      </div>

      <p className="text-xs text-gray-500">
        Radno vreme (pon–pet i vikend) je{" "}
        <strong>zakucano u kodu</strong> u fajlu{" "}
        <code className="rounded bg-gray-100 px-1 text-[11px]">
          lib/fixedBusinessHours.ts
        </code>
        , ne iz ove forme.
      </p>

      {message && (
        <p className="text-sm text-gray-700" role="status">
          {message}
        </p>
      )}

      <button
        type="submit"
        disabled={saving}
        className="rounded-xl bg-rose px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
      >
        {saving ? "Čuvanje..." : "Sačuvaj"}
      </button>
    </form>
  );
}
