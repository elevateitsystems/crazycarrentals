import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const steps = [
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

export default function AccidentProcessSection() {
  return (
    <section className="bg-background px-6 py-22">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#9cdc33]">
            The Process
          </span>
          <h2 className="mt-4 text-[2.4rem] font-bold leading-[1.15] tracking-tight text-[#131414]">
            How accident replacement works
          </h2>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {steps.map(({ number, title, description }) => (
            <Card
              key={number}
              className="gap-0 rounded-2xl border-[#e9ede7] bg-white py-0 shadow-none"
            >
              <CardContent className="px-6 pb-8 pt-8">
                <div className="flex items-center gap-7.25">
                  <span className="text-[32px] font-bold leading-9 text-[#9cdc33]">
                    {number}
                  </span>
                  <span className="h-px flex-1 bg-linear-to-r from-[#e7f5f5] to-transparent" />
                </div>
                <CardTitle className="mt-4 text-base font-semibold leading-5.5 text-[#131414]">
                  {title}
                </CardTitle>
                <CardDescription className="mt-2.5 text-[13.5px] leading-5.5 text-[#747d79]">
                  {description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Link
            href="/accident-replacement"
            className={cn(
              buttonVariants(),
              "h-10.5 gap-2 rounded-[10px] bg-[#9cdc33] pl-5.5 pr-2 text-[13.5px] font-medium text-[#111512] shadow-[0_6px_16px_rgba(156,220,51,0.45)] hover:bg-[#8fce2b]"
            )}
          >
            Check Eligibility
            <span className="flex size-7 items-center justify-center rounded-md bg-[#111512] text-[#9cdc33]">
              <ArrowUpRight size={14} />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}