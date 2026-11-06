import { HeroSection } from "@/components/home/HeroSection";
import { FeatureStrip } from "@/components/home/FeatureStrip";
import { BestSellersSection } from "@/components/home/BestSellersSection";
import { InfoSection } from "@/components/home/InfoSection";
import { FeaturedProductsSection } from "@/components/home/FeaturedProductsSection";
import {
  loadActiveFeaturedProducts,
  loadResolvedHomeSlides,
} from "@/lib/loadHomePromo";
import { loadPublicAddons } from "@/lib/loadPublicCatalog";
import {
  isSavoryAddon,
  isSweetAddon,
  toCartAddons,
} from "@/lib/menuUtils";

export default async function HomePage() {
  const [slides, featured, addons] = await Promise.all([
    loadResolvedHomeSlides(),
    loadActiveFeaturedProducts(),
    loadPublicAddons(),
  ]);

  const sweetAddons = toCartAddons(addons.filter(isSweetAddon));
  const savoryAddons = toCartAddons(addons.filter(isSavoryAddon));

  return (
    <>
      <HeroSection slides={slides} />
      <FeatureStrip />
      <FeaturedProductsSection
        products={featured}
        sweetAddons={sweetAddons}
        savoryAddons={savoryAddons}
      />
      <BestSellersSection />
      <InfoSection />
    </>
  );
}
