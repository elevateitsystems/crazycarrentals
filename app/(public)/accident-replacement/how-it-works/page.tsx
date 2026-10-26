import CommonHeroSection from "@/components/CommonHeroSection";
import AccidentProcessSection from "../../components/AccidentProcessSection";
import CtaSection from "../../components/CtaSection";

export default function HowItWorksPage() {
  return (
    <>
      <CommonHeroSection
        bedgeText="Accident Replacement Vehicles"
        title="How it"
        hightlightTitle="works."
        image="/generic-hero.jpg"
        description="Three simple steps from your accident to a replacement vehicle."
        isCtaOpen={false}
      />
      <AccidentProcessSection />
      <div className="mx-auto my-22 max-w-7xl overflow-hidden rounded-[19px]">
        <CtaSection />
      </div>
    </>
  );
}
