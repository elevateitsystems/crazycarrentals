import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function AccidentReplacementSection() {
  return (
    <section className="grid lg:h-122 lg:grid-cols-2">
      <div className="relative h-72 lg:h-full">
        <Image
          src="/accident-replacement.jpg"
          alt="Service agent handing car keys to a customer"
          fill
          className="object-cover"
        />
      </div>

      <div className="flex items-center bg-[#a1dd3e] px-6 py-12 lg:pl-21.25 lg:pr-10">
        <div className="max-w-130">
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-neutral-900">
            Accident Replacement
          </span>

          <h2 className="mt-4 text-[2.4rem] font-bold leading-[1.4] tracking-tight text-neutral-900">
            Not at fault in an accident?
          </h2>

          <p className="mt-3 text-[14.5px] leading-6.25 text-neutral-900/70">
            TasDrive can get you into a replacement vehicle while yours is being repaired or until your
            total-loss claim is paid out.
          </p>

          <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-neutral-900/10 px-3.5 py-1.5 text-[13px] font-semibold text-neutral-900">
            <MapPin className="size-4" aria-hidden />
            Delivered statewide across Tasmania
          </p>

          <Link
            href="/accident-replacement"
            className={cn(
              buttonVariants({ variant: "secondary" }),
              "mt-7 h-10.5 gap-2 rounded-[10px] bg-white pl-5.5 pr-2 text-sm font-medium text-neutral-900 shadow-[0_4px_14px_rgba(0,0,0,0.12)] hover:bg-white/90"
            )}
          >
            Check Eligibility
            <span className="flex size-7 items-center justify-center rounded bg-neutral-900 text-[#86d72f]">
              <ArrowUpRight size={14} />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}