import Link from "next/link";
import { Phone } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import { buttonVariants } from "@/components/ui/button";
import { BUSINESS_PHONE_HREF } from "@/lib/business";
import { cn } from "@/lib/utils";

export default function LocationHelpSection() {
  return (
    <section className="relative isolate overflow-hidden bg-secondary px-4 py-16 text-secondary-foreground sm:px-6 sm:py-20 lg:py-24">
      <div aria-hidden className="absolute inset-x-0 top-0 -z-10 h-72 bg-[radial-gradient(50%_100%_at_50%_0%,rgba(139,214,47,0.16),transparent_75%)]" />
      <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
        <SectionHeading
          tone="dark"
          title="Need a vehicle after an accident?"
          description="Accident replacement vehicles are delivered statewide across Tasmania. Contact our team and we'll arrange a vehicle wherever you are."
        />

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a
            href={BUSINESS_PHONE_HREF}
            className={cn(
              buttonVariants(),
              "h-12 gap-2 rounded-xl bg-primary px-7 text-sm font-semibold text-primary-foreground shadow-[0_12px_26px_-10px_rgba(139,214,47,0.8)] hover:bg-primary/90"
            )}
          >
            <Phone size={15} aria-hidden />
            Call Us
          </a>
          <Link
            href="/contact"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "h-12 rounded-xl border-white/20 bg-transparent px-7 text-sm font-semibold text-white shadow-none hover:border-white/50 hover:bg-white/5 hover:text-white"
            )}
          >
            Send us a message
          </Link>
        </div>
      </div>
    </section>
  );
}
