import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartProvider } from "@/components/cart/CartContext";
import { BottomCartBar } from "@/components/cart/BottomCartBar";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Kod Milevice | Domaće palačinke i tortilje",
  description:
    "Dostava domaćih palačinki i tortilja u Pančevu. Brza dostava, sveže spremljeno, domaći recept.",
  keywords: [
    "palačinke",
    "tortilje",
    "dostava",
    "dostava hrane",
    "dostava palačinki",
    "pančevo palačinke",
    "Kod Milevice",
  ],
  authors: [{ name: "Kod Milevice" }],
  openGraph: {
    title: "Kod Milevice | Domaće palačinke na tvojoj adresi",
    description:
      "Poruči domaće palačinke i tortilje sa brzom dostavom širom Pančeva.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sr">
      <body className={`${poppins.variable} antialiased bg-cream`}>
        <CartProvider>
          <Navbar />
          <main className="main-container py-6 pb-20">{children}</main>
          <Footer />
          <BottomCartBar />
        </CartProvider>
      </body>
    </html>
  );
}
