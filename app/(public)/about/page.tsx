import CommonHeroSection from "@/components/CommonHeroSection";
import React from "react";
import StorySection from "./components/StorySection";
import ValuesSection from "./components/ValuesSection";
import StatsSection from "./components/StatsSection";
import TeamSection from "./components/TeamSection";
import ContactSection from "./components/ContactSection";

export default function Page() {
  return (
    <>
      <CommonHeroSection
        bedgeText="Accident Replacement  Vehicles"
        title="Tasmania's local"
        hightlightTitle="vehicle partner."
        image="/rent-a-car-hero.jpg"
        description="TasDrive Rentals is a Tasmanian-owned and operated automotive
        mobility company dedicated to making vehicle access simple —
        whether you need to rent a car or get back on the road after an
        accident."
      />

      <StorySection />
      <ValuesSection />
      <StatsSection />
      <TeamSection />
      <ContactSection />
    </>
  );
}
