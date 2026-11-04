import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

/**
 * Accident replacement hero. The artwork carries the visible headline and bullet points, so the same copy is
 * kept as screen-reader / search text here instead of being drawn on top of it a second time.
 */
export default function AccidentHero() {
  return (
    <section aria-labelledby="accident-hero-title" className="bg-[#161a1f]">
      <div className="relative mx-auto w-full max-w-[1920px]">
        <Image
          src="/accident-replacement-banner.jpg"
          alt=""
          width={1280}
          height={714}
          priority
          sizes="100vw"
          className="h-auto w-full"
        />
        <div className="sr-only">
          <h1 id="accident-hero-title">Accident? Not your fault? We keep you moving safely</h1>
          <ul>
            <li>Statewide Tasmanian support.</li>
            <li>Zero out-of-pocket costs.</li>
            <li>Premium, like-for-like replacement fleet.</li>
          </ul>
          <p>Tasmania, Australia. tasdrive.com.au</p>
        </div>
      </div>

      <div className="border-t border-white/10 px-4 py-6 sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-3 md:justify-start">
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
