import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function AccidentREplacementHeroSection() {
  return (
    <section className="relative flex w-full items-center overflow-hidden">
      <Image
        src="/generic-hero.jpg"
        alt="Dark sports car parked at sunset"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-linear-to-r from-secondary/85 via-secondary/45 to-transparent" />
      <div className="absolute inset-0 bg-linear-to-t from-secondary/50 via-transparent to-transparent" />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 py-40 md:px-10">
        <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/15 px-3 py-1 text-[11px] font-medium text-primary backdrop-blur-sm">
          <span className="size-1.5 rounded-full bg-primary" />
          Accident Replacement Vehicles
        </span>

        <h1 className="mt-5 font-heading text-5xl font-semibold leading-[1.1] tracking-tight text-secondary-foreground md:text-7xl">
          Had An Accident?
          <br />
          <span className="text-primary">Let&apos;s Get You</span>
        </h1>

        <p className="mt-6 max-w-md text-sm leading-relaxed text-secondary-foreground/70">
          We&apos;re here to make the next step easier. If you were not at fault,
          you may be entitled to a replacement vehicle while yours is being
          repaired.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link
            href="/accident-replacement/eligibility"
            className="group inline-flex h-11 items-center gap-3 rounded-lg bg-primary py-1.5 pl-4 pr-1.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-secondary"
          >
            Check Eligibility
            <span className="flex size-8 items-center justify-center rounded-md bg-secondary text-primary transition-transform group-hover:scale-105">
              <ArrowUpRight className="size-4" />
            </span>
          </Link>

          <Link
            href="/accident-replacement/how-it-works"
            className="group inline-flex h-11 items-center gap-3 rounded-lg bg-secondary-foreground py-1.5 pl-4 pr-1.5 text-sm font-medium text-secondary transition-colors hover:bg-secondary-foreground/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-secondary"
          >
            How It Works
            <span className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground transition-transform group-hover:scale-105">
              <ArrowUpRight className="size-4" />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}