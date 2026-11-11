import { stats } from "@/lib/team";
import StatItem from "./StatItem";

export default function StatsSection() {
  return (
    <section className="relative isolate overflow-hidden bg-secondary py-14 sm:py-16">
      <div aria-hidden className="absolute inset-x-0 top-0 -z-10 h-64 bg-[radial-gradient(50%_100%_at_50%_0%,rgba(139,214,47,0.16),transparent_75%)]" />
      <div className="mx-auto max-w-[88rem] px-4 sm:px-6 lg:px-8">
        <dl className="grid grid-cols-2 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] lg:grid-cols-4">
          {stats.map((stat) => (
            <StatItem key={stat.label} {...stat} />
          ))}
        </dl>
      </div>
    </section>
  );
}
