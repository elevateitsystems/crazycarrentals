import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Car, MapPin, Truck } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { ACCIDENT_SERVICE_AREA, RENTAL_ADDRESS } from "@/lib/locations";
import { cn } from "@/lib/utils";

// The two services are deliberately separate: rentals run from one location, accident replacement is statewide.
const services = [
  {
    icon: Car,
    label: "Car rentals",
    title: "Launceston",
    detail: RENTAL_ADDRESS,
    note: "Pick up and return your rental here.",
    href: "/locations",
    cta: "Location & hours",
  },
  {
    icon: Truck,
    label: "Accident replacement vehicles",
    title: ACCIDENT_SERVICE_AREA,
    detail: "Delivered to you anywhere in Tasmania.",
    note: "If you were not at fault, we bring the replacement vehicle to you.",
    href: "/accident-replacement/eligibility",
    cta: "Check eligibility",
  },
];

export default function LocationsSection() {
  return (
    <section className="bg-background pb-22 pt-25">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-[2.2rem] font-bold leading-[1.15] tracking-tight text-secondary">
          Wherever you&rsquo;re headed, start here.
        </h2>

        <div className="mt-10.5 grid gap-6 lg:grid-cols-[1.1fr_1fr]">
          <div className="relative min-h-72 overflow-hidden rounded-2xl">
            <Image
              src="/hero-section-car.png"
              alt="SUV parked on a coastal road at sunset"
              fill
              sizes="(min-width: 1024px) 55vw, 100vw"
              className="object-cover"
            />
          </div>

          <div className="grid gap-5">
            {services.map(({ icon: Icon, label, title, detail, note, href, cta }) => (
              <Card key={label} className="gap-0 rounded-2xl border-0 bg-white py-0 shadow-[0_4px_20px_rgba(17,21,18,0.06)]">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2.5">
                    <span className="flex size-9 items-center justify-center rounded-full bg-primary/15 text-primary">
                      <Icon className="size-4.5" aria-hidden />
                    </span>
                    <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#747d79]">{label}</span>
                  </div>
                  <CardTitle className="mt-4 text-xl font-bold leading-6 text-secondary">{title}</CardTitle>
                  <CardDescription className="mt-2 flex items-start gap-1.5 text-[14.5px] font-medium leading-5 text-secondary">
                    <MapPin className="mt-0.5 size-4 shrink-0 text-[#9cdc33]" aria-hidden />
                    {detail}
                  </CardDescription>
                  <p className="mt-2 text-[14px] leading-5 text-[#747d79]">{note}</p>
                  <Link
                    href={href}
                    className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-secondary underline-offset-4 hover:underline"
                  >
                    {cta} <ArrowUpRight className="size-4 text-primary" aria-hidden />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Link
          href="/rent-a-car"
          className={cn(
            buttonVariants(),
            "mt-7 h-10.5 gap-2 rounded-[10px] bg-primary pl-5.5 pr-2 text-[13.5px] font-medium text-secondary shadow-[0_6px_16px_rgba(156,220,51,0.45)] hover:bg-primary"
          )}
        >
          Find A Car
          <span className="flex size-7 items-center justify-center rounded-md bg-secondary text-primary">
            <ArrowUpRight size={14} />
          </span>
        </Link>
      </div>
    </section>
  );
}
