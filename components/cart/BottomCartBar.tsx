"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "./CartContext";

const HIDDEN_ON: string[] = ["/checkout", "/korpa"];

export function BottomCartBar() {
  const { totalItems, totalPrice } = useCart();
  const pathname = usePathname();

  if (totalItems === 0) return null;
  if (HIDDEN_ON.includes(pathname)) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 pb-4">
      <div className="mx-auto max-w-5xl px-4">
        <div className="flex items-center gap-3 rounded-2xl bg-brown-soft text-cream shadow-xl shadow-brown-soft/40">
          <div className="flex flex-1 items-center gap-3 px-4 py-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-rose text-xs font-semibold text-white">
              {totalItems}
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-cream/80">Ukupno</span>
              <span className="text-sm font-semibold">
                {totalPrice.toFixed(0)} RSD
              </span>
            </div>
          </div>
          <Link
            href="/korpa"
            className="mr-2 inline-flex items-center justify-center rounded-xl bg-sky px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky/90"
          >
            Pregledaj korpu
          </Link>
        </div>
      </div>
    </div>
  );
}

