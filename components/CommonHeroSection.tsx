import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

type HeroSectionProp = {
  image?: string;
  hightlightTitle: string;
  title: string;
  bedgeText: string;
  description: string;
  isCtaOpen?: Boolean;
};

export default function CommonHeroSection({
  image,
  hightlightTitle,
  title,
  bedgeText,
  description,
  isCtaOpen = true,
}: HeroSectionProp) {
  return (
    <section className="relative flex w-full items-center min-h-[75vh]">
      <Image
        src={image || "/generic-hero.jpg"}
        alt="Dark sports car parked at sunset"
        fill
        priority
        quality={100}
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-linear-to-r from-secondary/85 via-secondary/45 to-transparent" />
      <div className="absolute inset-0 bg-linear-to-t from-secondary/50 via-transparent to-transparent" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 md:px-0 py-40">
        <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/15 px-3 py-1 text-[11px] font-medium text-primary backdrop-blur-sm">
          <span className="size-1.5 rounded-full bg-primary" />
          {bedgeText}
        </span>

        <h1 className="mt-5 font-heading text-5xl font-semibold leading-[1.1] tracking-tight text-secondary-foreground md:text-7xl">
          {title}
          <br />
          <span className="text-primary">{hightlightTitle}</span>
        </h1>

        <p className="mt-6 max-w-md text-base leading-relaxed text-secondary-foreground/70">
          {description}
        </p>

        {isCtaOpen && (
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="#"
              className="group inline-flex h-11 items-center gap-3 rounded-lg bg-primary py-1.5 pl-4 pr-1.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-secondary"
            >
              Check Eligibility
              <span className="flex size-8 items-center justify-center rounded-md bg-secondary text-primary transition-transform group-hover:scale-105">
                <ArrowUpRight className="size-4" />
              </span>
            </Link>

            <Link
              href="#"
              className="group inline-flex h-11 items-center gap-3 rounded-lg bg-secondary-foreground py-1.5 pl-4 pr-1.5 text-sm font-medium text-secondary transition-colors hover:bg-secondary-foreground/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-secondary"
            >
              How It Works
              <span className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground transition-transform group-hover:scale-105">
                <ArrowUpRight className="size-4" />
              </span>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
