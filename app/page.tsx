import { HeroSection } from "@/components/home/HeroSection";
import { FeatureStrip } from "@/components/home/FeatureStrip";
import { BestSellersSection } from "@/components/home/BestSellersSection";
import { InfoSection } from "@/components/home/InfoSection";
import { getCachedRestaurantSettings } from "@/lib/getCachedRestaurantSettings";

export default async function HomePage() {
  const settings = await getCachedRestaurantSettings();

  return (
    <>
      <HeroSection deliveryFeeRsd={settings.delivery_fee_rsd} />
      <FeatureStrip />
      <BestSellersSection />
      <InfoSection />
    </>
  );
}
