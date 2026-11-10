import PageHeader from "@/components/PageHeader";
import ApplyGate from "./ApplyGate";

export default function ApplyPage() {
  return (
    <>
      <PageHeader
        badge="Accident Replacement Vehicles"
        title="Apply for a"
        highlight="replacement vehicle."
        description="Confirm you're eligible, then tell us what happened and how to reach you. Our team will review your situation."
      />
      <section className="bg-background py-16">
        <div className="mx-auto max-w-2xl px-4 sm:px-6">
          <ApplyGate />
        </div>
      </section>
    </>
  );
}
