import CommonHeroSection from "@/components/CommonHeroSection";
import ApplyGate from "./ApplyGate";

export default function ApplyPage() {
  return (
    <>
      <CommonHeroSection
        bedgeText="Accident Replacement Vehicles"
        title="Apply for a"
        hightlightTitle="replacement vehicle."
        image="/generic-hero.jpg"
        description="Confirm you're eligible, then tell us what happened and how to reach you. Our team will review your situation."
        isCtaOpen={false}
      />
      <section className="bg-background py-16">
        <div className="mx-auto max-w-2xl px-4 sm:px-6">
          <ApplyGate />
        </div>
      </section>
    </>
  );
}
