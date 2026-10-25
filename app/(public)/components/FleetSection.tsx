import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import FleetBrowser from "@/components/FleetBrowser";

export default function FleetSection() {
  return (
    <section className="bg-card py-27.5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-0">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <h2 className="max-w-140 text-[2.4rem] font-bold leading-[1.4] tracking-tight text-foreground">
              Find the right vehicle for your journey.
            </h2>
            <p className="mt-3 max-w-md text-[14.5px] leading-5 text-muted-foreground">
              Choose from a growing range of vehicles for travel, business and everyday needs.
            </p>
          </div>

          <Link
            href="/fleet"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "h-9.5 shrink-0 gap-2 rounded-[14px] border-border bg-card px-5.5 text-xs font-medium text-foreground shadow-none hover:bg-muted has-[>svg]:px-5.5"
            )}
          >
            View full fleet
            <ArrowRight size={14} />
          </Link>
        </div>

        <FleetBrowser limit={12} className="mt-8" />
      </div>
    </section>
  );
}