import Link from "next/link";
import { BUSINESS_PHONE_HREF, BUSINESS_PHONE } from "@/lib/business";
import { Mail, Phone } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function StillHaveQuestionSection() {
  return (
    <section className="bg-card px-6 py-14">
      <div className="mx-auto flex max-w-4xl flex-col gap-6 rounded-2xl border border-border bg-background p-8 sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-80">
          <h2 className="text-xl font-bold tracking-tight text-foreground">Still have a question?</h2>
          <p className="mt-3 text-[13.5px] leading-6 text-muted-foreground">
            Our team is available Mon–Fri 8 AM–5 PM, Sat 9 AM–3 PM and Sun 9 AM–2 PM. We&apos;re happy to help with anything rental or
            accident related.
          </p>
        </div>

        <div className="flex w-full flex-col gap-2 sm:w-40">
          <a
            href={BUSINESS_PHONE_HREF}
            className={cn(
              buttonVariants(),
              "h-10 w-full gap-2 rounded-lg bg-primary px-3 text-xs font-semibold text-primary-foreground shadow-none hover:bg-primary/90"
            )}
          >
            <Phone size={13} />
            {BUSINESS_PHONE}
          </a>
          <Link
            href="/contact"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "h-10 w-full gap-2 rounded-lg border-border bg-card px-3 text-xs font-medium text-foreground shadow-none hover:bg-muted"
            )}
          >
            <Mail size={13} />
            Send a message
          </Link>
        </div>
      </div>
    </section>
  );
}