import CommonHeroSection from "@/components/CommonHeroSection";
import FaqSection from "../../faqs/components/FaqSection";
import StillHaveQuestionSection from "../../faqs/components/StillHaveQuestionSection";

export default function AccidentFaqsPage() {
  return (
    <>
      <CommonHeroSection
        bedgeText="Accident Replacement Vehicles"
        title="Accident replacement"
        hightlightTitle="questions."
        image="/generic-hero.jpg"
        description="Answers to common questions about replacement vehicles after an accident."
        isCtaOpen={false}
      />
      <FaqSection initialCategory="Accident Replacement" />
      <StillHaveQuestionSection />
    </>
  );
}
