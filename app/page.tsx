import { HeroSection } from "@/components/home/HeroSection";
import { FeatureStrip } from "@/components/home/FeatureStrip";
import { BestSellersSection } from "@/components/home/BestSellersSection";
import { InfoSection } from "@/components/home/InfoSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeatureStrip />
      <BestSellersSection />
      <InfoSection />
    </>
  );
}
