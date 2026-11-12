import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Car, MapPin, Truck } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import SectionHeading from "@/components/SectionHeading";
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
    href: "/accident-replacement#eligibility",
    cta: "Check eligibility",
  },
];

export default function LocationsSection() {
  return (
    <section className="bg-background py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-[88rem] px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading align="left" eyebrow="Our Locations" title="Wherever you’re headed, start here." />

          <Link
            href="/rent-a-car"
            className={cn(
              buttonVariants(),
              "h-11 shrink-0 gap-3 rounded-xl bg-primary pl-6 pr-1.5 text-sm font-semibold text-primary-foreground shadow-[0_10px_24px_-8px_rgba(139,214,47,0.7)] transition hover:bg-primary/90 motion-safe:hover:-translate-y-0.5"
            )}
          >
            Find A Car
            <span className="flex size-8 items-center justify-center rounded-lg bg-secondary text-primary">
              <ArrowUpRight size={15} aria-hidden />
            </span>
          </Link>
        </div>

        <div className="mt-10 grid gap-5 lg:mt-12 lg:grid-cols-[1.1fr_1fr] lg:gap-6">
          <div className="relative min-h-72 overflow-hidden rounded-3xl shadow-[0_30px_60px_-30px_rgba(17,21,18,0.45)] ring-1 ring-black/5 lg:min-h-full">
            <Image
              src="/locations-forest-road.jpg"
              alt="A sealed road curving through tall Tasmanian eucalyptus forest"
              fill
              sizes="(min-width: 1024px) 55vw, 100vw"
              className="object-cover transition-transform duration-700 motion-safe:hover:scale-105"
            />
            <div aria-hidden className="absolute inset-0 bg-linear-to-t from-secondary/40 via-transparent to-transparent" />
          </div>

          <ul className="grid gap-5">
            {services.map(({ icon: Icon, label, title, detail, note, href, cta }) => (
              <li
                key={label}
                className="group flex flex-col rounded-3xl border border-border bg-white p-6 shadow-[0_1px_2px_rgba(17,21,18,0.04)] transition duration-300 hover:border-primary/50 hover:shadow-[0_22px_44px_-22px_rgba(17,21,18,0.3)] sm:p-8"
              >
                <div className="flex items-center gap-3">
                  <span className="flex size-11 items-center justify-center rounded-xl bg-secondary text-primary shadow-[0_8px_18px_-8px_rgba(17,21,18,0.6)]">
                    <Icon className="size-5" strokeWidth={1.75} aria-hidden />
                  </span>
                  <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">{label}</span>
                </div>

                <h3 className="mt-6 text-2xl font-bold leading-tight tracking-tight text-foreground">{title}</h3>
                <p className="mt-3 flex items-start gap-2 text-[15px] font-medium leading-6 text-foreground">
                  <MapPin className="mt-1 size-4 shrink-0 text-[#4f9a0e]" aria-hidden />
                  {detail}
                </p>
                <p className="mt-2 flex-1 text-sm leading-6 text-muted-foreground">{note}</p>

                <Link
                  href={href}
                  className="mt-6 inline-flex h-11 w-fit items-center gap-2 rounded-xl border border-foreground/15 px-5 text-sm font-semibold text-foreground transition group-hover:border-foreground/40 hover:bg-muted"
                >
                  {cta}
                  <ArrowUpRight className="size-4 text-[#4f9a0e]" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
