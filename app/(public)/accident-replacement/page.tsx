import React from "react";
import AccidentProcessSection from "../components/AccidentProcessSection";
import AccidentReplacementSection from "../components/AccidentReplacementSection";
import CtaSection from "../components/CtaSection";
import AccidentREplacementHeroSection from "../../../components/CommonHeroSection";
import CommonHeroSection from "../../../components/CommonHeroSection";

export default function Page() {
  return (
    <>
      <CommonHeroSection 
      bedgeText="Accident Replacement  Vehicles"
      hightlightTitle="Let’s get you"
      title="Had an accident?"
      description="We're here to make the next step easier. If you were not at fault, you may be entitled to a replacement vehicle while yours is being repaired."
      image="/generic-hero.jpg"
      />
      <AccidentProcessSection />
      <AccidentReplacementSection />
      <div className="mx-auto max-w-7xl my-22 rounded-[19px] overflow-hidden">
        <CtaSection />
      </div>
    </>
  );
}
