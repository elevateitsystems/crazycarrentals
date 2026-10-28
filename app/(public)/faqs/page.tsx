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
        description="Answers about renting a car from our Launceston location, and about accident replacement vehicles delivered statewide across Tasmania."
      />

      <FaqSection />
      <StillHaveQuestionSection />

      <LocationHelpSection />
    </>
  );
}
