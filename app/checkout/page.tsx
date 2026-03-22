"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/cart/CartContext";
import { useRestaurantSettings } from "@/components/settings/RestaurantSettingsContext";

type Mode = "delivery" | "pickup";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, orderNote, clearCart } = useCart();
  const { settings, loading: settingsLoading, isOrderingOpen, closedMessage } =
    useRestaurantSettings();
  const [mode, setMode] = useState<Mode>("delivery");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [apartment, setApartment] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const hasItems = items.length > 0;
  const deliveryCost = mode === "delivery" ? settings.delivery_fee_rsd : 0;
  const finalTotal = totalPrice + deliveryCost;

  async function handleSubmit() {
    if (!hasItems) return;

    if (!settingsLoading && !isOrderingOpen) {
      alert(closedMessage ?? "Trenutno nije moguće naručiti.");
      return;
    }

    if (!name.trim() || !phone.trim()) {
      alert("Molimo popunite obavezna polja.");
      return;
    }

    if (mode === "delivery" && !address.trim()) {
      alert("Unesite adresu za dostavu.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode,
          name,
          address: mode === "delivery" ? address : null,
          apartment: mode === "delivery" ? apartment : null,
          phone,
          deliveryFee: deliveryCost,
          totalPrice: finalTotal,
          items,
          orderNote: orderNote.trim() || null,
        }),
      });

      if (!res.ok) {
        let errText = "";
        try {
          const j = (await res.json()) as { error?: string };
          errText = j.error ?? "";
        } catch {
          errText = await res.text();
        }
        console.error(errText);
        alert(
          errText ||
            "Došlo je do greške prilikom slanja porudžbine.",
        );
        return;
      }

      const data: { orderId: number } = await res.json();

      clearCart();
      if (mode === "delivery") {
        const eta =
          settings.prep_time_minutes + settings.delivery_extra_minutes;
        setMessage(
          `Hvala na porudžbini!\n\nVaša porudžbina je uspešno poslata.\n\nOčekivano vreme dostave:\noko ${eta} minuta (priprema ${settings.prep_time_minutes} min + dostava ~${settings.delivery_extra_minutes} min)`,
        );
      } else {
        const prep = settings.prep_time_minutes;
        setMessage(
          `Hvala na porudžbini!\n\nVaša porudžbina je uspešno poslata.\n\nBroj porudžbine: #${data.orderId}\n\nPribližno vreme pripreme: oko ${prep} minuta.\nPorudžbinu možete preuzeti na adresi: Dr Žarka Fogaraša 1, Pančevo.`,
        );
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="mt-2 font-bakerie text-3xl text-brown-soft">Checkout</h1>

      {!hasItems && (
        <p className="text-sm text-brown-soft/80">
          Korpa je prazna. Dodaj proizvode pre slanja porudžbine.
        </p>
      )}

      <section className="rounded-3xl bg-white/90 p-4 shadow-sm ring-1 ring-rose/10">
        <h2 className="text-sm font-semibold text-brown-soft">
          Način preuzimanja
        </h2>
        <div className="mt-3 flex gap-3">
          <button
            type="button"
            onClick={() => setMode("delivery")}
            className={`flex-1 rounded-2xl border px-3 py-2 text-sm ${
              mode === "delivery"
                ? "border-rose bg-rose/10 text-brown-soft"
                : "border-rose/20 bg-cream/60 text-brown-soft/80"
            }`}
          >
            <span className="mr-2">🚗</span> Dostava
          </button>
          <button
            type="button"
            onClick={() => setMode("pickup")}
            className={`flex-1 rounded-2xl border px-3 py-2 text-sm ${
              mode === "pickup"
                ? "border-rose bg-rose/10 text-brown-soft"
                : "border-rose/20 bg-cream/60 text-brown-soft/80"
            }`}
          >
            <span className="mr-2">👤</span> Lično preuzimanje
          </button>
        </div>
      </section>

      <section className="rounded-3xl bg-white/90 p-4 shadow-sm ring-1 ring-rose/10">
        <h2 className="text-sm font-semibold text-brown-soft">
          Podaci za porudžbinu
        </h2>
        <div className="mt-3 space-y-3 text-sm">
          <div>
            <label className="mb-1 block text-xs text-brown-soft/80">
              Ime i prezime *
            </label>
            <input
              className="w-full rounded-xl border border-rose/20 bg-cream/40 px-3 py-2 text-sm outline-none focus:border-rose focus:ring-1 focus:ring-rose/60"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          {mode === "delivery" && (
            <>
              <div>
                <label className="mb-1 block text-xs text-brown-soft/80">
                  Ulica i broj *
                </label>
                <input
                  className="w-full rounded-xl border border-rose/20 bg-cream/40 px-3 py-2 text-sm outline-none focus:border-rose focus:ring-1 focus:ring-rose/60"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-brown-soft/80">
                  Broj stana (opciono)
                </label>
                <input
                  className="w-full rounded-xl border border-rose/20 bg-cream/40 px-3 py-2 text-sm outline-none focus:border-rose focus:ring-1 focus:ring-rose/60"
                  value={apartment}
                  onChange={(e) => setApartment(e.target.value)}
                />
              </div>
            </>
          )}
          <div>
            <label className="mb-1 block text-xs text-brown-soft/80">
              Broj telefona *
            </label>
            <input
              className="w-full rounded-xl border border-rose/20 bg-cream/40 px-3 py-2 text-sm outline-none focus:border-rose focus:ring-1 focus:ring-rose/60"
              value={phone}
              onChange={(e) =>
                setPhone(e.target.value.replace(/[^0-9]/g, ""))
              }
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="npr. 0641234567"
            />
          </div>
        </div>
      </section>

      <section className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-rose/10">
        <h2 className="text-sm font-semibold text-brown-soft">
          Pregled troškova
        </h2>
        <div className="mt-3 space-y-1 text-sm text-brown-soft/90">
          <div className="flex justify-between">
            <span>Cena porudžbine</span>
            <span>{totalPrice.toFixed(0)} RSD</span>
          </div>
          {mode === "delivery" && (
            <div className="flex justify-between">
              <span>Cena dostave</span>
              <span>
                {settingsLoading ? "…" : `${deliveryCost.toFixed(0)} RSD`}
              </span>
            </div>
          )}
          <div className="mt-2 flex justify-between border-t border-rose/20 pt-2 font-semibold">
            <span>Ukupno</span>
            <span>
              {settingsLoading ? "…" : `${finalTotal.toFixed(0)} RSD`}
            </span>
          </div>
        </div>
      </section>

      <button
        type="button"
        disabled={!hasItems || submitting || settingsLoading}
        onClick={handleSubmit}
        className="mb-4 inline-flex w-full items-center justify-center rounded-xl bg-rose px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-rose/40 disabled:cursor-not-allowed disabled:bg-rose/50"
      >
        {submitting ? "Slanje porudžbine..." : "PORUČI"}
      </button>

      {message && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6">
          <div className="max-w-sm rounded-3xl bg-white p-5 text-center shadow-xl">
            <p className="whitespace-pre-line text-sm text-brown-soft">
              {message}
            </p>
            <button
              type="button"
              onClick={() => {
                setMessage(null);
                router.push("/");
              }}
              className="mt-4 inline-flex items-center justify-center rounded-full bg-rose px-5 py-2 text-sm font-semibold text-white"
            >
              Zatvori
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

