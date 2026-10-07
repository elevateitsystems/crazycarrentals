import CommonHeroSection from "@/components/CommonHeroSection";
import React from "react";
import LocationHelpSection from "../locations/components/LocationHelpSection";
import FaqSection from "./components/FaqSection";
import StillHaveQuestionSection from "./components/StillHaveQuestionSection";

export default function Page() {
  return (
    <>
      <CommonHeroSection
        bedgeText="Accident Replacement  Vehicles"
        title="Frequently asked"
        hightlightTitle="questions."
        image="/rent-a-car-hero.jpg"
        description="Pick up and return your vehicle at convenient locations across Tasmania, including Hobart Airport."
      />

      <FaqSection />
      <StillHaveQuestionSection />

      <LocationHelpSection />
    </>
  );
}
