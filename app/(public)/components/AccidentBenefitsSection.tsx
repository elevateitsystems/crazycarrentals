import { BadgeDollarSign, CalendarClock, CarFront, CircleCheckBig, Repeat, ShieldCheck, Timer } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const benefits = [
  {
    icon: BadgeDollarSign,
    title: "No Out-of-Pocket Costs",
    description: "Vehicle hire costs are legally payable by the at-fault driver's insurer, meaning you pay nothing.",
  },
  {
    icon: CircleCheckBig,
    title: "Same-Day Approval",
    description: "Submit your details during business hours and receive approval on the same day.",
  },
  {
    icon: Timer,
    title: "15-Minute Dispatch",
    description: "Once your application is approved, we will dispatch your replacement car to your location within 15 minutes.",
  },
  {
    icon: Repeat,
    title: "Like-for-Like Replacement",
    description: "Enjoy the familiarity and comfort of a vehicle comparable to your own.",
  },
  {
    icon: CarFront,
    title: "Fleet Options Available",
    description: "From compact cars and SUVs to luxury and commercial vehicles, we have the right match for you.",
  },
  {
    icon: CalendarClock,
    title: "Flexible Hire Periods",
    description: "Keep the hire vehicle until your car is completely repaired, or until your total loss claim is settled.",
  },
  {
    icon: ShieldCheck,
    title: "Total Peace of Mind",
    description: "Drive with confidence knowing all of our replacement vehicles include free Roadside Assistance.",
  },
];

export default function AccidentBenefitsSection() {
  return (
    <section className="bg-white pb-22 pt-22">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-0">
        <div className="text-center">
          <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#86d72f]">Why TasDrive</span>
          <h2 className="mx-auto mt-3 max-w-xl text-[2.4rem] font-bold leading-[1.15] tracking-tight text-neutral-900">
            Why Choose TasDrive?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-[15px] leading-6 text-neutral-500">
            We are here to provide complete support so you can get back on the road with confidence.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map(({ icon: Icon, title, description }) => (
            <Card key={title} className="gap-0 rounded-2xl border-[#e9e9e4] bg-[#f6f6f3] py-0 shadow-none">
              <CardHeader className="gap-0 space-y-0 p-0 px-[26px] pt-7">
                <div className="mb-5 flex size-12 items-center justify-center rounded-xl bg-[#e7f6d3] text-[#86d72f]">
                  <Icon size={18} strokeWidth={1.5} />
                </div>
                <CardTitle className="text-base font-semibold leading-snug text-neutral-900">{title}</CardTitle>
              </CardHeader>
              <CardContent className="px-[26px] pb-7 pt-2.5">
                <CardDescription className="text-[13.5px] leading-[22px] text-neutral-500">{description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
