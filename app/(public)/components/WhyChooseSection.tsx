import { Headphones, Tag, Truck, Zap } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

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
    <section className="bg-white pb-20 pt-22">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-0">
        <div className="text-center">
          <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#86d72f]">
            Why TasDrive
          </span>
          <h2 className="mx-auto mt-3 max-w-md text-[2.4rem] font-bold leading-[1.15] tracking-tight text-neutral-900">
            Everything you need to get moving.
          </h2>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, description }) => (
            <Card
              key={title}
              className="gap-0 rounded-2xl border-[#e9e9e4] bg-[#f6f6f3] py-0 shadow-none"
            >
              <CardHeader className="gap-0 space-y-0 p-0 px-[26px] pt-7">
                <div className="mb-5 flex size-12 items-center justify-center rounded-xl bg-[#e7f6d3] text-[#86d72f]">
                  <Icon size={18} strokeWidth={1.5} />
                </div>
                <CardTitle className="text-base font-semibold leading-snug text-neutral-900">
                  {title}
                </CardTitle>
              </CardHeader>
              <CardContent className="px-[26px] pb-7 pt-2.5">
                <CardDescription className="text-[13.5px] leading-[22px] text-neutral-500">
                  {description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}