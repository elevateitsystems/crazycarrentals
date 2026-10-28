import Image from "next/image";
import Link from "next/link";
import { Check, ChevronRight, Clock, Mail, MapPin, Navigation, Phone } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DIRECTIONS_URL } from "@/lib/business";
import type { Location } from "@/lib/locations";
import { cn } from "@/lib/utils";

export default function LocationDetailCard({ location }: { location: Location }) {
  const { region, name, address, phone, email, image, hours, offers } = location;

  const contacts = [
    { icon: MapPin, label: "Address", text: address, href: DIRECTIONS_URL, external: true },
    { icon: Phone, label: "Phone", text: phone, href: `tel:${phone.replace(/[^\d+]/g, "")}` },
    { icon: Mail, label: "Email", text: email, href: `mailto:${email}` },
  ];

  return (
    <Card className="grid gap-0 overflow-hidden rounded-3xl border-border py-0 shadow-sm lg:grid-cols-[1.1fr_1fr]">
      <div className="relative min-h-72 lg:min-h-[32rem]">
        <Image
          src={image}
          alt={`${name} building and surroundings`}
          fill
          sizes="(min-width: 1024px) 640px, 100vw"
          className="object-cover"
        />
        <div aria-hidden className="absolute inset-0 bg-linear-to-t from-black/55 via-transparent to-transparent" />
        <span className="absolute bottom-5 left-5 inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
          <MapPin className="size-4" aria-hidden />
          {name}
        </span>
      </div>

      <div className="flex flex-col p-6 sm:p-8">
        <span className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">{region}</span>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-foreground">{name}</h2>

        <ul className="mt-6 space-y-4">
          {contacts.map(({ icon: Icon, label, text, href, external }) => (
            <li key={label} className="flex items-start gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                <Icon className="size-4" aria-hidden />
              </span>
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
                <a
                  href={href}
                  {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="break-words text-[15px] font-medium text-foreground underline-offset-4 transition-colors hover:text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {text}
                  {external && <span className="sr-only"> (opens directions in Google Maps)</span>}
                </a>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-7 flex items-center gap-2 text-base font-semibold text-foreground">
          <Clock className="size-4 text-primary" aria-hidden />
          Opening hours
        </div>
        <dl className="mt-2">
          {hours.map(({ label, time }) => (
            <div key={label} className="flex justify-between gap-4 border-b border-border py-2.5 text-sm last:border-b-0">
              <dt className="text-muted-foreground">{label}</dt>
              <dd className="font-semibold text-foreground">{time}</dd>
            </div>
          ))}
        </dl>

        <ul className="mt-5 space-y-2">
          {offers.map((offer) => (
            <li key={offer} className="flex items-center gap-2 text-sm text-muted-foreground">
              <Check className="size-4 shrink-0 text-primary" strokeWidth={3} aria-hidden />
              {offer}
            </li>
          ))}
        </ul>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <a
            href={DIRECTIONS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(buttonVariants(), "h-11 flex-1 gap-2 rounded-xl bg-primary text-sm font-semibold text-primary-foreground shadow-none hover:bg-primary/90")}
          >
            <Navigation className="size-4" aria-hidden />
            Get directions
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
          <Link
            href="/rent-a-car"
            className={cn(buttonVariants({ variant: "outline" }), "h-11 flex-1 gap-1.5 rounded-xl text-sm font-semibold shadow-none")}
          >
            Book a car
            <ChevronRight className="size-4" aria-hidden />
          </Link>
        </div>
      </div>
    </Card>
  );
}
