import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const paragraphs = [
  "While TasDrive Rentals is a fresh name on the island, our team brings a proven history of industry expertise dating back to 2015.",
  "For over a decade, we have operated behind the scenes in the vehicle rental industry, perfecting what drivers truly value: reliable vehicles, transparent pricing, and a seamless experience. Our background spans comprehensive fleet management, streamlined customer service, and delivering exceptional service to thousands of customers.",
  "At TasDrive Rentals, we believe renting a vehicle should be simple, straightforward, and stress-free. We're committed to providing reliable vehicles, clear communication, and a personalised approach that puts our customers first.",
  "With years of experience behind us and a fresh approach to vehicle rental, we're here to make getting on the road as easy as possible.",
];

export default function StorySection() {
  const [lead, ...rest] = paragraphs;
  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="mx-auto grid max-w-[88rem] items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_1.05fr] lg:gap-16 lg:px-8">
        <div>
          <SectionHeading align="left" eyebrow="Our Story" title="Built for Tasmania, by Tasmanians." />

          <p className="mt-6 text-lg font-medium leading-8 text-foreground">{lead}</p>
          <div className="mt-4 space-y-4">
            {rest.map((text) => (
              <p key={text} className="text-[15px] leading-7 text-muted-foreground">
                {text}
              </p>
            ))}
          </div>

          <Link
            href="/fleet"
            className={cn(
              buttonVariants(),
              "mt-8 h-12 gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-[0_12px_26px_-10px_rgba(139,214,47,0.8)] transition hover:bg-primary/90 motion-safe:hover:-translate-y-0.5"
            )}
          >
            View Our Fleet
            <ChevronRight size={16} aria-hidden />
          </Link>
        </div>

        <div className="relative">
          <div aria-hidden className="absolute -bottom-4 -right-4 -z-10 size-3/4 rounded-3xl bg-primary/25" />
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-[0_30px_60px_-30px_rgba(17,21,18,0.45)] ring-1 ring-black/5">
            <Image
              src="/about-welcome-sign.jpg"
              alt="Welcome to TAS Drive Rentals sign outside the branch, with a white SUV parked behind it"
              fill
              sizes="(min-width: 1024px) 640px, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
