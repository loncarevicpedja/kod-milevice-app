"use client";

import { useCart } from "@/components/cart/CartContext";
import Link from "next/link";
import { OrderNowCta } from "@/components/order/OrderNowCta";

export default function KorpaPage() {
  const {
    items,
    totalPrice,
    updateQuantity,
    updateOrderNote,
    orderNote,
    removeItem,
  } = useCart();

  if (items.length === 0) {
    return (
      <div className="mt-4 rounded-3xl bg-white/90 p-5 text-center shadow-sm ring-1 ring-rose/10">
        <h1 className="font-bakerie text-3xl text-brown-soft">Tvoja korpa</h1>
        <p className="mt-3 text-sm text-brown-soft/80">
          Korpa je prazna. Dodaj palačinke ili tortilje iz menija ili preko
          stranice za naručivanje.
        </p>
        <div className="mt-4 flex justify-center gap-3">
          <Link
            href="/menu"
            className="rounded-full bg-rose px-5 py-2 text-sm font-semibold text-white shadow-md shadow-rose/40"
          >
            Idi na meni
          </Link>
          <OrderNowCta className="rounded-full border border-rose/50 px-5 py-2 text-sm font-semibold text-rose" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <h1 className="mt-2 font-bakerie text-3xl text-brown-soft">
        Tvoja korpa
      </h1>

      <div className="space-y-3">
        {items.map((item) => {
          const addonsTotal = item.addons.reduce(
            (sum, addon) => sum + addon.price,
            0,
          );
          const unitPrice = item.basePrice + addonsTotal;
          const lineTotal = unitPrice * item.quantity;

          return (
            <article
              key={item.id}
              className="rounded-2xl bg-white/90 p-4 shadow-sm ring-1 ring-rose/10"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-sm font-semibold text-brown-soft">
                    {item.name}
                  </h2>
                  {item.isClassic && item.addons.length > 0 && (
                    <p className="mt-1 text-xs text-brown-soft/70">
                      Dodaci:{" "}
                      {item.addons.map((a) => a.name).join(", ")}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  className="text-xs font-semibold text-brown-soft/60 hover:text-rose"
                >
                  ×
                </button>
              </div>

              <div className="mt-3 flex items-center justify-between text-sm">
                <div className="inline-flex items-center gap-2 rounded-full bg-cream/80 px-2 py-1">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="h-6 w-6 rounded-full bg-white text-center text-sm font-semibold text-brown-soft shadow-sm"
                  >
                    -
                  </button>
                  <span className="w-6 text-center text-xs font-semibold">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="h-6 w-6 rounded-full bg-white text-center text-sm font-semibold text-brown-soft shadow-sm"
                  >
                    +
                  </button>
                </div>

                <div className="text-right">
                  <p className="text-xs text-brown-soft/70">
                    Cena po komadu: {unitPrice.toFixed(0)} RSD
                  </p>
                  <p className="text-sm font-semibold text-brown-soft">
                    Ukupno: {lineTotal.toFixed(0)} RSD
                  </p>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <section className="rounded-2xl bg-white/90 p-4 shadow-sm ring-1 ring-rose/10">
        <h2 className="text-sm font-semibold text-brown-soft">
          Napomena uz porudžbinu (opciono)
        </h2>
        <textarea
          rows={3}
          className="mt-2 w-full rounded-xl border border-rose/20 bg-cream/40 px-3 py-2 text-xs outline-none focus:border-rose focus:ring-1 focus:ring-rose/50"
          value={orderNote}
          onChange={(e) => updateOrderNote(e.target.value)}
        />
      </section>

      <div className="mt-4 rounded-2xl bg-brown-soft p-4 text-cream">
        <div className="flex items-center justify-between text-sm">
          <span>Ukupna cena</span>
          <span className="text-lg font-semibold">
            {totalPrice.toFixed(0)} RSD
          </span>
        </div>
        <Link
          href="/checkout"
          className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-rose px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-rose/40"
        >
          Nastavi dalje 
        </Link>
      </div>
    </div>
  );
}

