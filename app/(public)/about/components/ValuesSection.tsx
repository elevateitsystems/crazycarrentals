import { Award, Check, Heart, Users } from "lucide-react";
import SectionBadge from "./SectionBadge";
import ValueCard from "./ValueCard";

const values = [
  {
    icon: Users,
    title: "People first",
    description:
      "Every decision we make starts with the customer. We aim to be helpful, honest and easy to work with.",
  },
  {
    icon: Award,
    title: "Quality over shortcuts",
    description:
      "We maintain our fleet to the highest standard and set clear expectations — no surprises.",
  },
  {
    icon: Heart,
    title: "Genuinely local",
    description:
      "We're Tasmanian through and through. We support local businesses and know the island well.",
  },
  {
    icon: Check,
    title: "Clear and fair pricing",
    description:
      "What you see is what you pay. We believe in transparent pricing with no hidden costs.",
  },
];

export default function ValuesSection() {
  return (
    <section className="bg-background py-18">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-0">
        <div className="text-center">
          <SectionBadge>What We Stand For</SectionBadge>
          <h2 className="mt-4 text-[2.4rem] font-bold leading-[1.15] tracking-tight text-foreground">
            Our values
          </h2>
        </div>

        <div className="mt-12 grid gap-4.5 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((value) => (
            <ValueCard key={value.title} {...value} />
          ))}
        </div>
      </div>
    </section>
  );
}