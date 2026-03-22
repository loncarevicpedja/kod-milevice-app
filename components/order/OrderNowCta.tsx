"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRestaurantSettings } from "@/components/settings/RestaurantSettingsContext";

type Props = {
  className?: string;
  children?: ReactNode;
};

/**
 * Dugme „Naruči odmah“ – ako je van radnog vremena, prikaži poruku umesto navigacije.
 */
export function OrderNowCta({ className, children }: Props) {
  const router = useRouter();
  const { settings, isOrderingOpen, loading, closedMessage } =
    useRestaurantSettings();
  const [showModal, setShowModal] = useState(false);
  const [showCatalogOnlyModal, setShowCatalogOnlyModal] = useState(false);

  return (
    <>
      <button
        type="button"
        disabled={loading}
        onClick={() => {
          if (loading) return;
          if (!settings.menu_cart_enabled) {
            setShowCatalogOnlyModal(true);
            return;
          }
          if (!isOrderingOpen) {
            setShowModal(true);
            return;
          }
          router.push("/narucivanje");
        }}
        className={className}
      >
        {children ?? "Naruči odmah"}
      </button>

      {showModal && closedMessage && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/45 px-5">
          <div className="max-w-sm rounded-3xl bg-white p-5 text-center shadow-xl">
            <p className="text-sm text-brown-soft">{closedMessage}</p>
            <div className="mt-4 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="inline-flex items-center justify-center rounded-full bg-rose px-5 py-2 text-sm font-semibold text-white"
              >
                Razumem
              </button>
              <Link
                href="/menu"
                className="text-xs font-medium text-rose underline"
                onClick={() => setShowModal(false)}
              >
                Pogledaj meni
              </Link>
            </div>
          </div>
        </div>
      )}

      {showCatalogOnlyModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/45 px-5">
          <div className="max-w-sm rounded-3xl bg-white p-5 text-center shadow-xl">
            <p className="text-sm text-brown-soft">
              Online naručivanje i dodavanje u korpu su trenutno isključeni. Možeš
              da pregledaš meni i cene.
            </p>
            <div className="mt-4 flex flex-col gap-2">
              <Link
                href="/menu"
                className="inline-flex items-center justify-center rounded-full bg-rose px-5 py-2 text-sm font-semibold text-white"
                onClick={() => setShowCatalogOnlyModal(false)}
              >
                Pogledaj meni
              </Link>
              <button
                type="button"
                onClick={() => setShowCatalogOnlyModal(false)}
                className="text-xs font-medium text-brown-soft/80"
              >
                Zatvori
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
