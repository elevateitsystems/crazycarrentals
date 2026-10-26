import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, BadgeCheck, CalendarCheck, MapPin } from "lucide-react";

const highlights = [
  { icon: CalendarCheck, text: "Free cancellation up to 24 hours before pickup" },
  { icon: BadgeCheck, text: "Pay now and save, or pay at the desk" },
  { icon: MapPin, text: "Local Tasmanian team, pickups across the state" },
];

/** Shared layout for sign-in, register and password reset: brand panel on large screens, form beside it. */
export default function AuthCard({
  title,
  description,
  children,
  footer,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen bg-background lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
      {/* Brand panel */}
      <aside className="relative hidden overflow-hidden bg-secondary text-secondary-foreground lg:block">
        <Image src="/generic-hero.jpg" alt="" fill priority sizes="50vw" className="object-cover opacity-45" />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-secondary via-secondary/70 to-secondary/30" />
        <div className="relative flex h-full flex-col justify-between p-12 xl:p-16">
          <Link href="/" aria-label="TasDrive Rentals home" className="w-fit">
            <Image src="/logo.avif" alt="TasDrive Rentals" width={200} height={300} priority className="h-20 w-auto rounded-lg" />
          </Link>
          <div>
            <h2 className="max-w-md text-4xl font-bold leading-tight tracking-tight xl:text-[2.6rem]">
              Your journey around Tasmania starts here.
            </h2>
            <ul className="mt-8 space-y-4">
              {highlights.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-3 text-[15px] text-secondary-foreground/85">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                    <Icon className="size-4" aria-hidden />
                  </span>
                  {text}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </aside>

      {/* Form */}
      <main className="flex flex-col px-5 py-8 sm:px-10">
        <div className="flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            <ArrowLeft className="size-4" aria-hidden /> Back to website
          </Link>
          <Link href="/" aria-label="TasDrive Rentals home" className="lg:hidden">
            <Image src="/logo.avif" alt="TasDrive Rentals" width={200} height={300} className="h-12 w-auto rounded-md" />
          </Link>
        </div>

        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-10">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-[2rem]">{title}</h1>
          <p className="mt-2.5 text-[15px] leading-relaxed text-muted-foreground">{description}</p>
          <div className="mt-8">{children}</div>
          {footer && <div className="mt-8 space-y-2.5 border-t border-border pt-6 text-center text-sm text-muted-foreground">{footer}</div>}
        </div>
      </main>
    </div>
  );
}

export const authInput = "h-11 rounded-lg";
export const authLabel = "text-xs font-semibold uppercase text-muted-foreground";
