import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import VehicleTypes from "@/components/VehicleTypes";

export default function FleetSection() {
  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-[88rem] px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading
            align="left"
            eyebrow="Our Fleet"
            title="Vehicle Types"
            description="Choose a category to see the vehicles available, for travel, business and everyday needs."
          />

          <Link
            href="/fleet"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "h-11 shrink-0 gap-2 rounded-xl border-foreground/15 bg-white px-5 text-sm font-semibold text-foreground shadow-none transition hover:border-foreground/40 hover:bg-muted"
            )}
          >
            View full fleet
            <ArrowRight size={15} aria-hidden />
          </Link>
        </div>

        <VehicleTypes className="mt-10 lg:mt-12" />
      </div>
    </section>
  );
}
