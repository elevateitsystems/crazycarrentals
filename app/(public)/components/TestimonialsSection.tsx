import Image from "next/image";
import { Check, Quote, Star } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";

const testimonials = [
  {
    name: "Sarah M.",
    location: "Hobart, Tasmania",
    quote:
      "Booking was seamless from start to finish. The RAV4 was in perfect condition and the team was incredibly helpful. Will definitely use TasDrive again.",
  },
  {
    name: "James R.",
    location: "Launceston, Tasmania",
    quote:
      "After my accident I had no idea what to do. TasDrive walked me through the whole process and had me in a replacement vehicle within two days. Such a relief.",
  },
  {
    name: "Priya K.",
    location: "Devonport, Tasmania",
    quote:
      "Used TasDrive for a two-week road trip around Tassie. Great rates, clean car, and the local team actually knew the best routes. Proper Tasmanian service.",
  },
];

const trustPoints = [
  "4.9/5 average rating",
  "100% Tasmanian team",
  "500+ satisfied customers",
];

export default function TestimonialsSection() {
  return (
    <section className="relative isolate overflow-hidden bg-secondary py-16 sm:py-20 lg:py-24">
      <Image src="/testimonials-section-car.jpg" alt="" fill sizes="100vw" className="-z-20 object-cover opacity-40" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-linear-to-b from-secondary/90 via-secondary/85 to-secondary" />
      <div aria-hidden className="absolute inset-x-0 top-0 -z-10 h-72 bg-[radial-gradient(50%_100%_at_50%_0%,rgba(139,214,47,0.16),transparent_75%)]" />

      <div className="mx-auto max-w-[88rem] px-4 sm:px-6 lg:px-8">
        <SectionHeading tone="dark" eyebrow="Testimonials" title="Trusted by drivers across Tasmania." />

        <ul className="mt-12 grid gap-5 md:grid-cols-3 lg:mt-14">
          {testimonials.map(({ name, location, quote }) => (
            <li
              key={name}
              className="relative flex flex-col rounded-2xl border border-white/10 bg-white/[0.04] p-7 backdrop-blur-sm transition duration-300 hover:border-primary/40 hover:bg-white/[0.07] sm:p-8"
            >
              <Quote aria-hidden className="absolute right-6 top-6 size-9 text-primary/20" strokeWidth={1.5} />
              <div className="flex gap-1 text-primary" role="img" aria-label="Rated 5 out of 5 stars">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={15} fill="currentColor" strokeWidth={0} aria-hidden />
                ))}
              </div>

              <blockquote className="mt-5 flex-1 text-[15px] leading-7 text-white/80">&ldquo;{quote}&rdquo;</blockquote>

              <div className="mt-7 flex items-center gap-3.5 border-t border-white/10 pt-6">
                <div aria-hidden className="flex size-11 items-center justify-center rounded-full bg-linear-to-br from-primary to-[#4f9a0e] text-base font-bold text-secondary">
                  {name[0]}
                </div>
                <div>
                  <p className="text-sm font-semibold leading-5 text-white">{name}</p>
                  <p className="text-xs leading-5 text-white/50">{location}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <ul className="mx-auto mt-12 grid max-w-4xl divide-white/10 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] sm:grid-cols-3 sm:divide-x">
          {trustPoints.map((point) => (
            <li key={point} className="flex items-center justify-center gap-2.5 px-5 py-4 text-sm font-medium text-white/80 max-sm:border-t max-sm:border-white/10 max-sm:first:border-t-0">
              <span className="flex size-5 items-center justify-center rounded-full bg-primary/20 text-primary">
                <Check size={12} strokeWidth={3} aria-hidden />
              </span>
              {point}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
