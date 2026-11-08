import EligibilityChecker from "@/components/EligibilityChecker";

export default function EligibilitySection() {
  return (
    <section className="bg-white py-22" aria-labelledby="eligible-heading">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 md:px-0">
        <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#86d72f]">Eligibility</span>
        <h2 id="eligible-heading" className="mt-3 text-[2.4rem] font-bold leading-[1.15] tracking-tight text-neutral-900">
          Are You Eligible?
        </h2>
        <p className="mx-auto mt-3 max-w-md text-[15px] leading-6 text-neutral-500">Select an option below to find out instantly:</p>
        <EligibilityChecker continueHref="/accident-replacement/apply" className="mt-10" />
      </div>
    </section>
  );
}
