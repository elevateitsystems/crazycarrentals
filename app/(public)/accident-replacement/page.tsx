import React from "react";
import CommonHeroSection from "@/components/CommonHeroSection";
import AccidentBenefitsSection from "../components/AccidentBenefitsSection";
import AccidentProcessSection from "../components/AccidentProcessSection";
import AccidentReplacementSection from "../components/AccidentReplacementSection";
import CtaSection from "../components/CtaSection";
import EligibilitySection from "../components/EligibilitySection";

const steps = [
  {
    number: "01",
    title: "Tell us what happened",
    description: "Submit your accident details and contact information through our simple online form.",
  },
  {
    number: "02",
    title: "Fast review & approval",
    description: "Our team reviews your circumstances to secure your same-day approval during business hours.",
  },
  {
    number: "03",
    title: "Get back on the road",
    description: "Once approved, we will help arrange your vehicle and dispatch it within 15 minutes.",
  },
];

export default function Page() {
  return (
    <>
      <CommonHeroSection
        bedgeText="Accident Replacement  Vehicles"
        title="Accident Replacement Cars for Not-at-Fault Drivers"
        subtitle="Had an accident? Let's get you moving again."
        description="We know how stressful the aftermath of a car accident can be. We're here to make your next step as simple as possible. If you were not at fault, you are legally entitled to a like-for-like replacement vehicle at zero out-of-pocket cost while yours is being repaired or until your total loss claim is settled."
        image="/accident-hero.jpg"
        imageAlt="Tow truck carrying a replacement car along a wet city road at dusk"
      />
      <EligibilitySection />
      <AccidentProcessSection
        eyebrow="Three simple steps"
        heading="How It Works"
        subheading="Getting back on the road is as easy as 1, 2, 3."
        steps={steps}
      />
      <AccidentReplacementSection />
      <AccidentBenefitsSection />
      <div className="mx-auto max-w-7xl my-22 rounded-[19px] overflow-hidden">
        <CtaSection />
      </div>
    </>
  );
}
