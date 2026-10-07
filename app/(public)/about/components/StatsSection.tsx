import { stats } from "@/lib/team";
import StatItem from "./StatItem";

export default function StatsSection() {
  return (
    <section className="bg-foreground py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-0">
        <div className="grid grid-cols-2 overflow-hidden rounded-2xl border border-background/10 bg-background/5 lg:grid-cols-4">
          {stats.map((stat) => (
            <StatItem key={stat.label} {...stat} />
          ))}
        </div>
      </div>
    </section>
  );
}