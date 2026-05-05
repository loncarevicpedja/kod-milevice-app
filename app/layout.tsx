import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartProvider } from "@/components/cart/CartContext";
import { BottomCartBar } from "@/components/cart/BottomCartBar";
import { RestaurantSettingsProvider } from "@/components/settings/RestaurantSettingsContext";
import { getCachedRestaurantSettings } from "@/lib/getCachedRestaurantSettings";

/** Uvek sveže podešavanja iz baze (bez statičkog HTML keša za ceo sajt). */
export const dynamic = "force-dynamic";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Kod Milevice | Domaće palačinke i tortilje",
  description:
    "Kod Milevice - domaće palačinke i tortilje sa dostavom u Pančevu. Slatke i slane palačinke, punjene tortilje, brza dostava na kućnu adresu.",
  keywords: [
    "Pančevo",
    "Pancevo",   
    "pancevo palacinke",   
    "pancevo tortilje",
    "pancevo slatke palacinke",
    "pancevo slane palacinke",
    "pancevo tortilje dostava",
    "pancevo tortilje dostava Pančevo",
    "pancevo tortilje dostava Pancevo",
    "pancevo tortilje dostava palačinki",
    "pancevo tortilje dostava palacinki",
    "dostava",
    "dostava hrane",
    "dostava Pančevo",
    "dostava Pancevo",
    "dostava palačinki",
    "dostava palacinki",
    "dostava tortilja",
    "palačinke",
    "palacinke",
    "palačinke",
    "palačinka",
    "palacinka",
    "slatke palačinke",
    "slatke palacinke",
    "slatka palačinka",
    "slatka palacinka",
    "slane palačinke",
    "slane palacinke",
    "slana palačinka",
    "slana palacinka",
    "tortilja",
    "tortilje",
    "punjene tortilje",
    "tortilje dostava Pančevo",
    "tortilje dostava Pancevo",
    "palačinke dostava Pančevo",
    "palacinke dostava Pancevo",
    "palacinke pancevo",
    "slane i slatke palačinke",
    "slane i slatke palacinke",
    "noćna dostava palačinki",
    "nocna dostava palacinki",
    "restoran palačinke Pančevo",
    "restoran palačinke Pancevo",
    "Kod Milevice",
    "Kod Milevice Pancevo",
  ],
  authors: [{ name: "Kod Milevice" }],
  openGraph: {
    title: "Kod Milevice | Domaće palačinke na tvojoj adresi",
    description:
      "Poruči domaće palačinke i tortilje sa brzom dostavom širom Pančeva.",
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const restaurantSettings = await getCachedRestaurantSettings();

  return (
    <html lang="sr">
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-5F75SJ3NTV"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-5F75SJ3NTV');
          `}
        </Script>
      </head>
      <body className={`${poppins.variable} antialiased bg-cream`}>
        <CartProvider>
          <RestaurantSettingsProvider initialSettings={restaurantSettings}>
            <Navbar />
            <main className="main-container py-6 pb-20">{children}</main>
            <Footer />
            <BottomCartBar />
          </RestaurantSettingsProvider>
        </CartProvider>
      </body>
    </html>
  );
}
