import Link from "next/link";
import { ArrowUpRight, CircleHelp, ShieldCheck, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

// Each answer goes to the page that already handles it: the application form, the rental fleet, or the
// eligibility guide for anyone who isn't sure.
const options = [
  { label: "Yes, I was not at fault", href: "/accident-replacement/apply", icon: ShieldCheck, primary: true },
  { label: "No", href: "/rent-a-car", icon: XCircle, primary: false },
  { label: "Unsure", href: "/accident-replacement/eligibility", icon: CircleHelp, primary: false },
];

export default function EligibilityChoiceSection() {
  return (
    <section className="bg-white py-22" aria-labelledby="eligible-heading">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 md:px-0">
        <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#86d72f]">Eligibility</span>
        <h2 id="eligible-heading" className="mt-3 text-[2.4rem] font-bold leading-[1.15] tracking-tight text-neutral-900">
          Are You Eligible?
        </h2>
        <p className="mx-auto mt-3 max-w-md text-[15px] leading-6 text-neutral-500">
          Select an option below to find out instantly:
        </p>

        <ul className="mt-10 grid gap-4 sm:grid-cols-3">
          {options.map(({ label, href, icon: Icon, primary }) => (
            <li key={label}>
              <Link
                href={href}
                className={cn(
                  "group flex h-full min-h-24 items-center justify-between gap-3 rounded-2xl border-2 px-5 py-5 text-left text-base font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  primary
                    ? "border-[#9cdc33] bg-[#9cdc33]/15 text-neutral-900 hover:bg-[#9cdc33]/25"
                    : "border-[#e9e9e4] bg-[#f6f6f3] text-neutral-900 hover:border-neutral-400"
                )}
              >
                <span className="flex items-center gap-3">
                  <Icon className={cn("size-5 shrink-0", primary ? "text-[#5fa012]" : "text-neutral-500")} aria-hidden />
                  {label}
                </span>
                <ArrowUpRight className="size-4 shrink-0 text-neutral-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
