import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import SectionBadge from "./SectionBadge";

const paragraphs = [
  "While TasDrive Rentals is a fresh name on the island, our team brings a proven history of industry expertise dating back to 2015.",
  "For over a decade, we have operated behind the scenes in the vehicle rental industry, perfecting what drivers truly value: reliable vehicles, transparent pricing, and a seamless experience. Our background spans comprehensive fleet management, streamlined customer service, and delivering exceptional service to thousands of customers.",
  "At TasDrive Rentals, we believe renting a vehicle should be simple, straightforward, and stress-free. We're committed to providing reliable vehicles, clear communication, and a personalised approach that puts our customers first.",
  "With years of experience behind us and a fresh approach to vehicle rental, we're here to make getting on the road as easy as possible.",
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
            src="/car-3.jpg"
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