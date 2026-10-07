import Link from "next/link";
import { Phone } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function LocationHelpSection() {
  return (
    <section className="bg-foreground px-6 py-20 text-background">
      <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
        <h2 className="text-[2rem] font-bold leading-[1.2] tracking-tight">
          Can&apos;t find a location near you?
        </h2>
        <p className="mt-4 max-w-md text-[14px] leading-5 text-background/50">
          Contact our team — we may be able to arrange an alternative pickup or delivery option depending on your
          location and requirements.
        </p>

        <div className="mt-7 flex flex-wrap justify-center gap-2.5">
          <a
            href="tel:0362000000"
            className={cn(
              buttonVariants(),
              "h-11 gap-2 rounded-lg bg-primary px-5 text-[12px] font-semibold text-primary-foreground shadow-none hover:bg-primary/90"
            )}
          >
            <Phone size={13} />
            Call Us
          </a>
          <Link
            href="#"
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