import Link from "next/link";
import { BUSINESS_PHONE_HREF } from "@/lib/business";
import { Phone } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function LocationHelpSection() {
  return (
    <section className="bg-foreground px-6 py-20 text-background">
      <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
        <h2 className="text-[2rem] font-bold leading-[1.2] tracking-tight">
          Need a vehicle after an accident?
        </h2>
        <p className="mt-4 max-w-md text-[14px] leading-5 text-background/50">
          Accident replacement vehicles are delivered statewide across Tasmania. Contact our team and we&apos;ll
          arrange a vehicle wherever you are.
        </p>

        <div className="mt-7 flex flex-wrap justify-center gap-2.5">
          <a
            href={BUSINESS_PHONE_HREF}
            className={cn(
              buttonVariants(),
              "h-11 gap-2 rounded-lg bg-primary px-5 text-[12px] font-semibold text-primary-foreground shadow-none hover:bg-primary/90"
            )}
          >
            <Phone size={13} />
            Call Us
          </a>
          <Link
            href="/contact"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "h-11 rounded-lg border-background/20 bg-transparent px-5 text-[12px] font-medium text-background shadow-none hover:bg-background/10 hover:text-background"
            )}
          >
            Send us a message
          </Link>
        </div>
      </div>
    </section>
  );
}