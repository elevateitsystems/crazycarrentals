import PageHeader from "@/components/PageHeader";
import AccidentProcessSection from "../../components/AccidentProcessSection";
import CtaSection from "../../components/CtaSection";

export default function HowItWorksPage() {
  return (
    <>
      <PageHeader
        badge="Accident Replacement Vehicles"
        title="How it"
        highlight="works."
        description="Three simple steps from your accident to a replacement vehicle."
      />
      <AccidentProcessSection />
      <div className="mx-auto my-22 max-w-7xl overflow-hidden rounded-[19px]">
        <CtaSection />
      </div>
    </>
  );
}
