import Image from "next/image";
import Link from "next/link";
import { Check, ChevronRight, Clock, Mail, MapPin, Phone } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Location } from "@/lib/locations";
import { cn } from "@/lib/utils";

export default function LocationDetailCard({ location }: { location: Location }) {
  const { slug, region, name, address, phone, email, image, hours, offers } = location;

  const contacts = [
    { icon: Phone, text: phone, href: `tel:${phone.replace(/[^\d+]/g, "")}` },
    { icon: Mail, text: email, href: `mailto:${email}` },
  ];

  return (
    <Card className="grid gap-0 overflow-hidden rounded-2xl border-border py-0 shadow-sm lg:grid-cols-[1.55fr_1fr]">
      <div className="relative min-h-72 lg:min-h-0">
        <Image
          src={image}
          alt={`${name} pickup location`}
          fill
          sizes="(min-width: 1024px) 640px, 100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent" />

        <div className="absolute bottom-4 left-4">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-[12px] font-semibold text-primary-foreground">
            <MapPin size={12} />
            {name}
          </span>
          <p className="mt-2 text-[10px] text-white/80">{address}</p>
        </div>
      </div>

      <div className="flex flex-col p-6">
        <span className="text-[8px] font-semibold uppercase tracking-widest text-primary">{region}</span>
        <h2 className="mt-1.5 text-lg font-bold tracking-tight text-foreground">{name}</h2>
        <p className="mt-1 text-[11px] text-muted-foreground">{address}</p>

        <ul className="mt-4 space-y-2">
          {contacts.map(({ icon: Icon, text, href }) => (
            <li key={text}>
              <a
                href={href}
                className="flex items-center gap-2 text-[12px] font-medium text-foreground transition hover:text-primary"
              >
                <Icon className="size-3.5 text-primary" />
                {text}
              </a>
            </li>
          ))}
        </ul>

        <div className="mt-4 flex items-center gap-2 text-[13px] font-semibold text-foreground">
          <Clock className="size-3.5 text-primary" />
          Opening Hours
        </div>
        <dl className="mt-2">
          {hours.map(({ label, time }) => (
            <div
              key={label}
              className="flex justify-between border-b border-border py-1.5 text-[11px] last:border-b-0"
            >
              <dt className="text-muted-foreground">{label}</dt>
              <dd className="font-semibold text-foreground">{time}</dd>
            </div>
          ))}
        </dl>

        <h3 className="mt-4 text-[12px] font-semibold uppercase tracking-widest text-muted-foreground">
          This location offers
        </h3>
        <ul className="mt-2 space-y-1.5">
          {offers.map((offer) => (
            <li key={offer} className="flex items-center gap-2 text-[11px] text-muted-foreground">
              <Check className="size-3 shrink-0 text-primary" strokeWidth={3} />
              {offer}
            </li>
          ))}
        </ul>

        <Link
          href={`#`}
          className={cn(
            buttonVariants(),
            "mt-5 h-10 w-full gap-1.5 rounded-lg bg-primary text-[12px] font-semibold text-primary-foreground shadow-none hover:bg-primary/90"
          )}
        >
          Book at This Location
          <ChevronRight size={13} />
        </Link>
      </div>
    </Card>
  );
}