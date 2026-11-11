import Link from "next/link";
import { Check, ChevronRight, Clock, Mail, MapPin, Navigation, Phone } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { DIRECTIONS_URL, MAP_EMBED_URL } from "@/lib/business";
import type { Location } from "@/lib/locations";
import { cn } from "@/lib/utils";

export default function LocationDetailCard({ location }: { location: Location }) {
  const { region, name, address, phone, email, hours, offers } = location;

  const contacts = [
    { icon: MapPin, label: "Address", text: address, href: DIRECTIONS_URL, external: true },
    { icon: Phone, label: "Phone", text: phone, href: `tel:${phone.replace(/[^\d+]/g, "")}` },
    { icon: Mail, label: "Email", text: email, href: `mailto:${email}` },
  ];

  return (
    <article className="grid overflow-hidden rounded-3xl border border-border bg-white shadow-[0_30px_60px_-34px_rgba(17,21,18,0.35)] lg:grid-cols-[1.1fr_1fr]">
      <div className="relative min-h-72 lg:min-h-[34rem]">
        <iframe
          title={`Map showing ${name}, ${address}`}
          src={MAP_EMBED_URL}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0 size-full border-0"
        />
        <span className="pointer-events-none absolute left-5 top-5 inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-sm font-semibold text-primary shadow-lg">
          <MapPin className="size-4" aria-hidden />
          {name}
        </span>
      </div>

      <div className="flex flex-col p-6 sm:p-9">
        <span className="inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#4f9a0e]">
          <span aria-hidden className="h-px w-7 bg-current opacity-60" />
          {region}
        </span>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground">{name}</h2>

        <ul className="mt-7 space-y-4">
          {contacts.map(({ icon: Icon, label, text, href, external }) => (
            <li key={label} className="flex items-start gap-3.5">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
                <Icon className="size-[18px]" strokeWidth={1.75} aria-hidden />
              </span>
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
                <a
                  href={href}
                  {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="break-words text-[15px] font-semibold text-foreground underline-offset-4 transition-colors hover:text-[#4f9a0e] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {text}
                  {external && <span className="sr-only"> (opens directions in Google Maps)</span>}
                </a>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-8 rounded-2xl bg-muted/70 p-5">
          <div className="flex items-center gap-2 text-base font-semibold text-foreground">
            <Clock className="size-4 text-[#4f9a0e]" aria-hidden />
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
        </div>

        {offers.length > 0 && (
          <ul className="mt-5 space-y-2">
            {offers.map((offer) => (
              <li key={offer} className="flex items-center gap-2 text-sm text-muted-foreground">
                <Check className="size-4 shrink-0 text-primary" strokeWidth={3} aria-hidden />
                {offer}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <a
            href={DIRECTIONS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(buttonVariants(), "h-12 flex-1 gap-2 rounded-xl bg-primary text-sm font-semibold text-primary-foreground shadow-[0_12px_26px_-10px_rgba(139,214,47,0.8)] hover:bg-primary/90")}
          >
            <Navigation className="size-4" aria-hidden />
            Get directions
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
          <Link
            href="/rent-a-car"
            className={cn(buttonVariants({ variant: "outline" }), "h-12 flex-1 gap-1.5 rounded-xl border-foreground/15 bg-white text-sm font-semibold shadow-none hover:border-foreground/40 hover:bg-muted")}
          >
            Book a car
            <ChevronRight className="size-4" aria-hidden />
          </Link>
        </div>
      </div>
    </article>
  );
}
