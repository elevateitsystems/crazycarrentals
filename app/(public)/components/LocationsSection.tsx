import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const locations = [
  {
    name: "Hobart Airport",
    address: "Terminal Forecourt, Cambridge TAS 7170",
    hours: "Mon-Sun, 7:00am – 9:00pm",
    note: "Kerbside pickup, flight tracking on arrivals.",
  },
  {
    name: "Hobart CBD",
    address: "128 Murray Street, Hobart TAS 7000",
    hours: "Mon-Fri, 8:00am – 5:30pm · Sat 9:00am – 1:00pm",
    note: "Undercover parking, after-hours key return.",
  },
  {
    name: "Launceston Airport",
    address: "201 Evandale Road, Western Junction TAS 7212",
    hours: "Mon-Sun, 7:30am – 8:00pm",
    note: "Counter inside terminal, bays 4–9.",
  },
  {
    name: "Devonport",
    address: "44 Formby Road, Devonport TAS 7310",
    hours: "Mon-Fri, 8:00am – 5:00pm",
    note: "Close to the Spirit of Tasmania terminal.",
  },
];

export default function LocationsSection() {
  return (
    <section className="bg-background pb-22 pt-25">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-0">
        <h2 className="text-[2.2rem] font-bold leading-[1.15] tracking-tight text-secondary">
          Wherever you&rsquo;re headed, start here.
        </h2>

        <div className="mt-10.5 grid gap-6 lg:grid-cols-[1.1fr_1fr]">
          <div className="relative min-h-65 overflow-hidden rounded-2xl">
            <Image
              src="/hero-section-car.png"
              alt="SUV parked on a coastal road at sunset"
              fill
              className="object-cover"
            />
          </div>

          <div className="grid gap-x-4 gap-y-4.5 sm:grid-cols-2">
            {locations.map(({ name, address, hours, note }) => (
              <Card
                key={name}
                className="gap-0 rounded-2xl border-0 bg-white py-0 shadow-[0_4px_20px_rgba(17,21,18,0.06)]"
              >
                <CardContent className="px-4 pb-7.5 pt-4">
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="shrink-0 text-[#9cdc33]" />
                    <CardTitle className="text-sm font-semibold leading-5 text-secondary">
                      {name}
                    </CardTitle>
                  </div>
                  <CardDescription className="mt-3 text-[13.5px] leading-4.5 text-[#747d79]">
                    {address}
                  </CardDescription>
                  <p className="mt-2 text-[13.5px] font-medium leading-4.5 text-secondary">
                    {hours}
                  </p>
                  <p className="mt-2 text-[13.5px] leading-4.5 text-[#747d79]">{note}</p>
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