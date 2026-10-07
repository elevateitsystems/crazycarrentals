import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import SectionBadge from "./SectionBadge";

const paragraphs = [
  "TasDrive Rentals was founded with one simple goal: to give Tasmanians access to reliable, well-priced vehicles without the hassle that usually comes with car rental.",
  "As locals ourselves, we know that getting around Tasmania is different to the mainland. From winding mountain roads to coastal drives and everything in between — we know the roads, and we know what kind of vehicle you need.",
  "We've also built a dedicated accident replacement service to support Tasmanians who find themselves without a vehicle through no fault of their own. Our team handles the complexity so you can focus on what matters.",
];

export default function StorySection() {
  return (
    <section className="bg-card py-18">
      <div className="mx-auto grid max-w-7xl px-4 sm:px-6 md:px-0 items-center gap-10 lg:grid-cols-2 lg:gap-12">
        <div>
          <SectionBadge>Our Story</SectionBadge>

          <h1 className="mt-4 max-w-md text-[2.4rem] font-bold leading-[1.15] tracking-tight text-foreground">
            Built for Tasmania, by Tasmanians.
          </h1>

          <div className="mt-5 space-y-4">
            {paragraphs.map((text) => (
              <p key={text} className="text-sm leading-6.5 text-muted-foreground">
                {text}
              </p>
            ))}
          </div>

          <Link
            href="/fleet"
            className={cn(
              buttonVariants(),
              "mt-7 h-10.5 gap-2 rounded-[10px] bg-primary px-5 text-[13px] font-semibold text-primary-foreground shadow-none hover:bg-primary/90"
            )}
          >
            View Our Fleet
            <ChevronRight size={14} />
          </Link>
        </div>

        <div className="relative h-72 overflow-hidden rounded-2xl lg:h-84">
          <Image
            src="/our-story-car.jpg"
            alt="Silver SUV driving on a Tasmanian road"
            fill
            sizes="(min-width: 1024px) 488px, 100vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}