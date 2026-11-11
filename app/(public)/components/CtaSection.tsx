import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";

export default function CtaSection() {
  return (
    <section className="relative overflow-hidden bg-white text-foreground">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(55%_100%_at_50%_0%,rgba(139,214,47,0.14),transparent_75%)]" />
      <div className="relative mx-auto flex w-full max-w-6xl flex-col items-center px-4 pb-14 pt-14 text-center sm:px-6 sm:pb-16 sm:pt-16 lg:pb-20 lg:pt-20">

        <SectionHeading
          title={
            <>
              Wherever the road takes you, <span className="text-[#4f9a0e]">TasDrive</span> is by your side.
            </>
          }
          className="max-w-3xl"
        />

        {/* The photo has empty white space above the vehicles, so it is cropped to just the line-up. */}
        <div className="relative mt-8 aspect-[1779/390] w-full overflow-hidden">
          <Image
            src="/cta-vehicles.jpeg"
            alt="Six TasDrive vehicles in a row, from a hatchback and SUVs to a ute and a delivery truck"
            fill
            sizes="(min-width: 1152px) 1152px, 100vw"
            className="object-cover object-[center_72%]"
          />
        </div>

        <p className="mt-8 max-w-2xl text-[15px] leading-7 text-muted-foreground sm:text-base">
          We deliver vehicles to locations all over Tasmania and our team is here to help 24/7. Whether you need to book your next holiday rental or require immediate support after an accident, we&apos;ve got you covered.
        </p>

        <div className="mt-9 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row sm:gap-4">
          <Link
            href="/rent-a-car"
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-7 text-sm font-semibold text-primary-foreground shadow-[0_12px_26px_-10px_rgba(139,214,47,0.8)] transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 motion-safe:hover:-translate-y-0.5 sm:w-auto"
          >
            Book a Car
            <ChevronRight className="size-4" />
          </Link>

          <Link
            href="/accident-replacement#eligibility"
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-foreground/15 bg-white px-7 text-sm font-semibold text-foreground transition hover:border-foreground/40 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:w-auto"
          >
            Check My Eligibility
            <ChevronRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
