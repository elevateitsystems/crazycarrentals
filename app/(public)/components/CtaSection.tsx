import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function CtaSection() {
  return (
    <section className="relative isolate flex min-h-[420px] items-center justify-center overflow-hidden text-secondary-foreground sm:min-h-[480px] lg:min-h-[560px]">
      {/* Background image */}
      <Image
        src="/cta-section-car.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="-z-20 object-cover object-center"
      />

      {/* Dark overlay for text contrast (uses the secondary token) */}
      <div className="absolute inset-0 -z-10 bg-secondary/55" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-secondary/60 via-transparent to-secondary/20" />

      <div className="mx-auto flex w-full max-w-4xl flex-col items-center px-4 py-16 text-center sm:px-6 lg:py-24">
        {/* Badge */}
        <span className="inline-flex items-center gap-2 rounded-full border border-secondary-foreground/15 bg-secondary/40 px-3 py-1.5 text-xs font-medium text-secondary-foreground/90 backdrop-blur-md">
          <span className="size-1.5 rounded-full bg-primary shadow-[0_0_8px_var(--primary)]" />
          Tasmania&apos;s Vehicle Partner
        </span>

        {/* Heading */}
        <h2 className="mt-6 max-w-3xl text-balance font-heading text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
          Wherever the road takes you,{" "}
          <span className="text-primary">TasDrive</span> can help.
        </h2>

        {/* Description */}
        <p className="mt-4 max-w-xl text-sm text-secondary-foreground/70 sm:text-base">
          Book your next rental or get support after an accident.
        </p>

        {/* Actions */}
        <div className="mt-8 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row sm:gap-4">
          <Link
            href="/cars"
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-secondary sm:w-auto"
          >
            Book a Car
            <ChevronRight className="size-4" />
          </Link>

          <Link
            href="/accident-replacement"
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-secondary-foreground/15 bg-secondary/60 px-6 text-sm font-medium text-secondary-foreground backdrop-blur-md transition-colors hover:bg-secondary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-secondary sm:w-auto"
          >
            Accident Replacement
            <ChevronRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}