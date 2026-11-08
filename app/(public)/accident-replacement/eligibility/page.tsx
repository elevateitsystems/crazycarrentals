import { BUSINESS_PHONE_HREF, BUSINESS_PHONE } from "@/lib/business";
import { Check, Phone } from "lucide-react";
import CommonHeroSection from "@/components/CommonHeroSection";
import EligibilityChecker from "@/components/EligibilityChecker";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const points = [
  "You were not at fault in a multi vehicle accident.",
  "You have the at-fault driver's details.",
  "The at-fault driver has comprehensive or third-party car insurance.",
];

export default function EligibilityPage() {
  return (
    <>
      <CommonHeroSection
        bedgeText="Accident Replacement Vehicles"
        title="Check your"
        hightlightTitle="eligibility."
        image="/generic-hero.jpg"
        description="If you were not at fault, you may be entitled to a replacement vehicle while yours is being repaired."
        isCtaOpen={false}
      />
      <section className="bg-background py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold tracking-tight">Are you eligible?</h2>
          <p className="mt-2 text-sm text-muted-foreground">Answer these three questions to find out instantly.</p>
          <EligibilityChecker continueHref="/accident-replacement/apply" className="mt-6" />

          <h2 className="mt-14 text-2xl font-bold tracking-tight">Who can apply?</h2>
          <ul className="mt-6 space-y-3">
            {points.map((p) => (
              <li key={p} className="flex gap-3 rounded-xl border bg-card p-4 text-sm">
                <Check className="mt-0.5 size-4 shrink-0 text-primary" strokeWidth={3} />
                {p}
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-muted-foreground">
            Every situation is different, so eligibility is confirmed by our team after you apply.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href={BUSINESS_PHONE_HREF} className={cn(buttonVariants({ variant: "outline" }), "h-10 gap-2 px-5")}>
              <Phone /> {BUSINESS_PHONE}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
