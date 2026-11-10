import PageHeader from "@/components/PageHeader";
import React from "react";
import LocationHelpSection from "../locations/components/LocationHelpSection";
import FaqSection from "./components/FaqSection";
import StillHaveQuestionSection from "./components/StillHaveQuestionSection";

export default function Page() {
  return (
    <>
      <PageHeader
        badge="FAQs"
        title="Frequently asked"
        highlight="questions."
        description="Answers about regular rentals and about accident replacement vehicles across Tasmania."
      />

      <FaqSection />
      <StillHaveQuestionSection />

      <LocationHelpSection />
    </>
  );
}
