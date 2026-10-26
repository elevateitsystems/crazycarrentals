import Link from "next/link";
import { Check, Phone } from "lucide-react";
import CommonHeroSection from "@/components/CommonHeroSection";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const points = [
  "You were involved in an accident and your vehicle is being repaired.",
  "You were not at fault. In that case you may be entitled to a replacement vehicle.",
  "Our team reviews your circumstances and requirements before arranging a vehicle.",
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
          <h2 className="text-2xl font-bold tracking-tight">Who can apply?</h2>
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
            <Link href="/accident-replacement/apply" className={cn(buttonVariants(), "h-10 px-5 font-semibold")}>
              Start an application
            </Link>
            <a href="tel:0362000000" className={cn(buttonVariants({ variant: "outline" }), "h-10 gap-2 px-5")}>
              <Phone /> (03) 6200 0000
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
