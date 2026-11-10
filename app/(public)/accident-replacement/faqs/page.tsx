import PageHeader from "@/components/PageHeader";
import FaqSection from "../../faqs/components/FaqSection";
import StillHaveQuestionSection from "../../faqs/components/StillHaveQuestionSection";

export default function AccidentFaqsPage() {
  return (
    <>
      <PageHeader
        badge="Accident Replacement Vehicles"
        title="Accident replacement"
        highlight="questions."
        description="Answers to common questions about replacement vehicles after an accident."
      />
      <FaqSection initialCategory="Accident Replacement Vehicles" />
      <StillHaveQuestionSection />
    </>
  );
}
