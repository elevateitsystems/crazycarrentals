import Link from "next/link";
import { Mail, MessageCircleQuestion, Phone } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { BUSINESS_PHONE, BUSINESS_PHONE_HREF } from "@/lib/business";
import { cn } from "@/lib/utils";

export default function StillHaveQuestionSection() {
  return (
    <section className="bg-background px-4 pb-16 sm:px-6 sm:pb-20">
      <div className="mx-auto flex max-w-4xl flex-col gap-8 rounded-3xl border border-border bg-white p-7 shadow-[0_30px_60px_-34px_rgba(17,21,18,0.3)] sm:p-10 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-5">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
            <MessageCircleQuestion className="size-6" strokeWidth={1.75} aria-hidden />
          </span>
          <div className="max-w-md">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">Still have a question?</h2>
            <p className="mt-3 text-[15px] leading-7 text-muted-foreground">
              Our team is available Mon–Fri 8 AM–5 PM, Sat 9 AM–3 PM and Sun 9 AM–2 PM. We&apos;re happy to help with anything rental or
              accident related.
            </p>
          </div>
        </div>

        <div className="flex w-full shrink-0 flex-col gap-3 md:w-52">
          <a
            href={BUSINESS_PHONE_HREF}
            className={cn(
              buttonVariants(),
              "h-12 w-full gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-[0_12px_26px_-10px_rgba(139,214,47,0.8)] hover:bg-primary/90"
            )}
          >
            <Phone size={15} aria-hidden />
            {BUSINESS_PHONE}
          </a>
          <Link
            href="/contact"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "h-12 w-full gap-2 rounded-xl border-foreground/15 bg-white px-4 text-sm font-semibold text-foreground shadow-none hover:border-foreground/40 hover:bg-muted"
            )}
          >
            <Mail size={15} aria-hidden />
            Send a message
          </Link>
        </div>
      </div>
    </section>
  );
}
