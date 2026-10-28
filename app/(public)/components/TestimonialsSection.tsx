import Image from "next/image";
import { Check, Star } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

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
    <section className="relative isolate overflow-hidden pb-21.5 pt-22">
      <Image
        src="/testimonials-section-car.jpg"
        alt=""
        fill
        className="-z-20 object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-black/80" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-0">
        <div className="text-center">
          <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#9cdc33]">
            Testimonials
          </span>
          <h2 className="mt-4 text-[2.4rem] font-bold leading-[1.15] tracking-tight text-white">
            Trusted by drivers across Tasmania.
          </h2>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {testimonials.map(({ name, location, quote }) => (
            <Card
              key={name}
              className="gap-0 rounded-2xl border-white/9 bg-white/6 py-0 shadow-none backdrop-blur-[2px]"
            >
              <CardContent className="px-6 pb-7 pt-7">
                <div className="flex gap-0.75 text-primary">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={13}
                      fill="currentColor"
                      strokeWidth={0}
                    />
                  ))}
                </div>

                <p className="mt-4.5 text-[13.5px] leading-5.75 text-[#c9ccca]">
                  &ldquo;{quote}&rdquo;
                </p>

                <div className="mt-5.5 flex items-center gap-3">
                  <div className="size-9">
                    <div className="bg-primary/20 flex items-center justify-center rounded-full size-9 text-[13px] font-semibold text-primary">
                      {name[0]}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold leading-4 text-white">
                      {name}
                    </p>
                    <p className="mt-0.75 text-[11px] leading-3.5 text-white/45">
                      {location}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-13 flex flex-wrap justify-center gap-x-8.5 gap-y-3 text-[13px] text-[#9ea19f]">
          {trustPoints.map((point) => (
            <span key={point} className="flex items-center gap-2">
              <Check size={14} className="text-primary" />
              {point}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
