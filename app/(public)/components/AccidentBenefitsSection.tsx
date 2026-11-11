import { CalendarClock, CarFront, CircleCheckBig, Repeat, ShieldCheck, Timer } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";

const benefits = [
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
    <section className="relative overflow-hidden bg-secondary py-16 sm:py-20 lg:py-24">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(50%_100%_at_50%_0%,rgba(139,214,47,0.16),transparent_75%)]" />

      <div className="relative mx-auto max-w-[88rem] px-4 sm:px-6 lg:px-8">
        <SectionHeading
          tone="dark"
          eyebrow="Why TasDrive"
          title="Why Choose TasDrive?"
          description="We are here to provide complete support so you can get back on the road with confidence."
        />

        <div className="mt-12 grid gap-4 sm:grid-cols-2 sm:gap-5 lg:mt-14 lg:grid-cols-3">
          {benefits.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="group rounded-2xl border border-white/10 bg-white/[0.04] p-6 sm:p-7 transition duration-300 hover:border-primary/40 hover:bg-white/[0.07] motion-safe:hover:-translate-y-0.5"
            >
              <span className="flex size-11 items-center justify-center rounded-xl bg-primary/15 text-primary">
                <Icon size={20} strokeWidth={1.75} aria-hidden />
              </span>
              <h3 className="mt-5 text-base font-semibold leading-snug tracking-tight text-white">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-white/60">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
