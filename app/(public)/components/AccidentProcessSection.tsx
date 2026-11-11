import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Step = { number: string; title: string; description: string };

const defaultSteps: Step[] = [
  {
    number: "01",
    title: "Tell us what happened",
    description: "Submit your accident and contact information through our simple online form.",
  },
  {
    number: "02",
    title: "We review your situation",
    description: "Our team reviews your circumstances and requirements to assess your eligibility.",
  },
  {
    number: "03",
    title: "Get back on the road",
    description: "If eligible, we'll help arrange a suitable replacement vehicle for you.",
  },
];

type Props = {
  eyebrow?: string;
  heading?: string;
  subheading?: string;
  steps?: Step[];
};

export default function AccidentProcessSection({
  eyebrow = "The Process",
  heading = "How accident replacement works",
  subheading,
  steps = defaultSteps,
}: Props) {
  // The dashed line joins the centres of the first and last step circles (md and up).
  const inset = `${50 / steps.length}%`;
  return (
    <section className="bg-background py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-[88rem] px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow={eyebrow} title={heading} description={subheading} />

        <div className="relative mt-14 lg:mt-16">
          <div aria-hidden className="absolute top-7 hidden border-t border-dashed border-foreground/20 md:block" style={{ left: inset, right: inset }} />
          <ol className="relative grid gap-x-6 gap-y-12 md:grid-cols-[repeat(var(--steps),minmax(0,1fr))]" style={{ ["--steps" as string]: steps.length }}>
            {steps.map(({ number, title, description }) => (
              <li key={number} className="relative">
                <div className="relative z-10 mx-auto flex size-14 items-center justify-center rounded-full bg-secondary font-heading text-lg font-bold tabular-nums text-primary shadow-[0_0_0_6px_var(--background),0_10px_24px_-8px_rgba(17,21,18,0.5)]">
                  {number}
                </div>
                <div className="-mt-7 rounded-2xl border border-border bg-white px-6 pb-8 pt-12 text-center shadow-[0_1px_2px_rgba(17,21,18,0.04),0_16px_36px_-24px_rgba(17,21,18,0.28)]">
                  <h3 className="text-[17px] font-semibold leading-snug tracking-tight text-foreground">{title}</h3>
                  <p className="mx-auto mt-2.5 max-w-xs text-sm leading-6 text-muted-foreground">{description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-12 flex justify-center">
          <Link
            href="/accident-replacement#eligibility"
            className={cn(
              buttonVariants(),
              "h-11 gap-3 rounded-xl bg-primary pl-6 pr-1.5 text-sm font-semibold text-primary-foreground shadow-[0_10px_24px_-8px_rgba(139,214,47,0.7)] transition hover:bg-primary/90 motion-safe:hover:-translate-y-0.5"
            )}
          >
            Check Eligibility
            <span className="flex size-8 items-center justify-center rounded-lg bg-secondary text-primary">
              <ArrowUpRight size={15} aria-hidden />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
