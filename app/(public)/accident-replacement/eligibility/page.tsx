import type { Metadata } from "next";
import EligibilityChecker from "@/components/EligibilityChecker";
import PageHeader from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "Check My Eligibility | TasDrive Rentals",
  description: "Answer three quick questions to find out if you're eligible for an accident replacement vehicle.",
};

export default function EligibilityPage() {
  return (
    <>
      <PageHeader
        badge="Accident Replacement Vehicles"
        title="Check your"
        highlight="eligibility."
        description="Answer these three questions to find out instantly."
      />
      <section className="bg-background py-8 sm:py-10">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <EligibilityChecker continueHref="/accident-replacement/apply" />
        </div>
      </section>
    </>
  );
}
