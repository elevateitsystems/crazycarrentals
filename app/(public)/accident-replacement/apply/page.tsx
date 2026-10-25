import CommonHeroSection from "@/components/CommonHeroSection";
import ApplyForm from "./ApplyForm";

export default function ApplyPage() {
  return (
    <>
      <CommonHeroSection
        bedgeText="Accident Replacement Vehicles"
        title="Apply for a"
        hightlightTitle="replacement vehicle."
        image="/generic-hero.jpg"
        description="Tell us what happened and how to reach you. Our team will review your situation."
        isCtaOpen={false}
      />
      <section className="bg-background py-16">
        <div className="mx-auto max-w-2xl px-4 sm:px-6">
          <ApplyForm />
        </div>
      </section>
    </>
  );
}
