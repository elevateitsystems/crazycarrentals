import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function FleetHeroSection() {
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
          Replacement
        </span>

        <h1 className="mt-5 font-heading text-5xl font-semibold leading-[1.1] tracking-tight text-secondary-foreground md:text-7xl">
          The Right Vehicle
          <br />
          <span className="text-primary">For Every Journey</span>
        </h1>

        <p className="mt-6 max-w-md text-sm leading-relaxed text-secondary-foreground/70">
         From compact city cars to premium SUVs and commercial trucks — we have a vehicle to match your needs.
        </p>
      </div>
    </section>
  );
}