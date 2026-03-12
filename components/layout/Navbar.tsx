"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "Početna" },
  { href: "/menu", label: "Meni" },
  { href: "/narucivanje", label: "Naručivanje" },
  { href: "/o-nama", label: "O nama" },
  { href: "/kontakt", label: "Kontakt" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-sky/30 bg-cream/95 backdrop-blur">
      <div className="main-container flex items-center justify-between py-3">
        <div className="flex items-center gap-2">
          <Link href="/" aria-label="Kod Milevice početna">
            <Image
              src="/images/logo.jpg"
              alt="Kod Milevice logo"
              width={52}
              height={52}
              className="rounded-full border-2 border-sky/60 bg-white shadow-sm"
            />
          </Link>
        </div>

        <div className="flex flex-1 justify-center">
          <Image
            src="/images/natpis.png"
            alt="Kod Milevice"
            width={200}
            height={50}
            className="h-10 w-auto sm:h-12"
          />
        </div>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-rose/40 bg-white/70 text-rose shadow-sm md:hidden"
          aria-label="Otvori meni"
          aria-expanded={open}
        >
          <span className="sr-only">Meni</span>
          <div className="space-y-1.5">
            <span className="block h-0.5 w-5 rounded-full bg-rose" />
            <span className="block h-0.5 w-5 rounded-full bg-rose" />
            <span className="block h-0.5 w-5 rounded-full bg-rose" />
          </div>
        </button>

        <nav className="hidden items-center gap-6 text-sm font-medium text-brown-soft md:flex">
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors ${
                  active ? "text-rose" : "hover:text-rose"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {open && (
        <div className="border-t border-sky/20 bg-sky/10 py-3 md:hidden">
          <div className="main-container flex flex-col gap-2 text-base font-medium">
            {navLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-lg px-3 py-2 transition-colors ${
                    active
                      ? "bg-rose/10 text-rose"
                      : "hover:bg-rose/10 hover:text-rose"
                  }`}
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}

