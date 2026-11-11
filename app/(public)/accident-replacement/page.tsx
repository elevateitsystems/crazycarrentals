import React from "react";
import EligibilityChecker from "@/components/EligibilityChecker";
import PageHeader from "@/components/PageHeader";
import SectionHeading from "@/components/SectionHeading";
import AccidentBenefitsSection from "../components/AccidentBenefitsSection";
import AccidentProcessSection from "../components/AccidentProcessSection";
import AccidentReplacementSection from "../components/AccidentReplacementSection";
import CtaSection from "../components/CtaSection";

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
      <PageHeader
        badge="Accident Replacement Vehicles"
        title="Accident Replacement Cars for Not-at-Fault Drivers"
        description="Had an accident? Let's get you moving again. We know how stressful the aftermath of a car accident can be. We're here to make your next step as simple as possible. If you were not at fault, you are legally entitled to a like-for-like replacement vehicle at zero out-of-pocket cost while yours is being repaired or until your total loss claim is settled."
        actions={[
          { label: "Check Eligibility", href: "/accident-replacement#eligibility" },
          { label: "How It Works", href: "/accident-replacement/how-it-works" },
        ]}
      />

      {/* The only place the eligibility questions appear. Every "Check Eligibility" button links here. */}
      <section id="eligibility" aria-labelledby="eligible-heading" className="scroll-mt-24 bg-white py-14 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="Eligibility"
            title={<span id="eligible-heading">Are You Eligible?</span>}
            description="Answer these three questions to find out instantly."
          />
          <div className="mt-10 rounded-3xl border border-border bg-background p-4 shadow-[0_30px_60px_-34px_rgba(17,21,18,0.3)] sm:p-8">
            <EligibilityChecker continueHref="/accident-replacement/apply" />
          </div>
        </div>
      </section>
      <AccidentProcessSection
        eyebrow="Three simple steps"
        heading="How It Works"
        subheading="Getting back on the road is as easy as 1, 2, 3."
        steps={steps}
      />
      <AccidentReplacementSection />
      <AccidentBenefitsSection />
      <div className="mx-auto my-16 max-w-[88rem] px-4 sm:px-6 lg:my-24 lg:px-8">
        <div className="overflow-hidden rounded-3xl border border-border">
          <CtaSection />
        </div>
      </div>
    </>
  );
}
