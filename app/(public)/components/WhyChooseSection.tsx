import { Headphones, Tag, Truck, Zap } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";

const features = [
  {
    icon: Zap,
    title: "Easy Booking",
    description: "Find and book your vehicle online with a simple, straightforward process.",
  },
  {
    icon: Truck,
    title: "Flexible Fleet",
    description: "Choose from vehicles suited to everyday travel, business and more.",
  },
  {
    icon: Tag,
    title: "Clear Pricing",
    description: "Understand your rental costs before you book — no surprises.",
  },
  {
    icon: Headphones,
    title: "Local Support",
    description: "Get support from a team that understands Tasmania.",
  },
];

export default function WhyChooseSection() {
  return (
    <section className="relative overflow-hidden bg-white py-16 sm:py-20 lg:py-24">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-[radial-gradient(55%_100%_at_50%_0%,rgba(139,214,47,0.10),transparent_75%)]" />

      <div className="relative mx-auto max-w-[88rem] px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Why TasDrive" title="Everything you need to get moving." />

        <ul className="mt-12 grid gap-4 sm:grid-cols-2 sm:gap-5 lg:mt-14 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, description }, i) => (
            <li
              key={title}
              className="group relative overflow-hidden rounded-2xl border border-border bg-white p-6 shadow-[0_1px_2px_rgba(17,21,18,0.04)] transition duration-300 motion-safe:hover:-translate-y-1 hover:border-primary/50 hover:shadow-[0_18px_40px_-18px_rgba(17,21,18,0.25)] sm:p-7"
            >
              {/* lime accent that grows in along the top edge on hover */}
              <span aria-hidden className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-primary transition-transform duration-300 group-hover:scale-x-100" />
              <div className="flex items-start justify-between">
                <div className="flex size-12 items-center justify-center rounded-xl bg-secondary text-primary shadow-[0_8px_18px_-8px_rgba(17,21,18,0.6)]">
                  <Icon size={20} strokeWidth={1.75} aria-hidden />
                </div>
                <span aria-hidden className="text-sm font-semibold tabular-nums text-foreground/20">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="mt-6 text-[17px] font-semibold leading-snug tracking-tight text-foreground">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
