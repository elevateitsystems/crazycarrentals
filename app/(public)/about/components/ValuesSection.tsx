import { Award, Check, Heart, Users } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
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
    <section className="bg-background py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-[88rem] px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="What We Stand For" title="Our values" />

        <ul className="mt-12 grid gap-4 sm:grid-cols-2 sm:gap-5 lg:mt-14 lg:grid-cols-4">
          {values.map((value, i) => (
            <ValueCard key={value.title} {...value} index={i + 1} />
          ))}
        </ul>
      </div>
    </section>
  );
}
