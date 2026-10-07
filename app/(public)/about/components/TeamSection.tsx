import { team } from "@/lib/team";
import SectionBadge from "./SectionBadge";
import TeamMemberCard from "./TeamMemberCard";

export default function TeamSection() {
  return (
    <section className="bg-card py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-0">
        <div className="text-center">
          <SectionBadge>Our Team</SectionBadge>
          <h2 className="mt-4 text-[2.4rem] font-bold leading-[1.15] tracking-tight text-foreground">
            The people behind TasDrive
          </h2>
          <p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-muted-foreground">
            A small, dedicated team passionate about helping Tasmanians stay mobile.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((member) => (
            <TeamMemberCard key={member.name} {...member} />
          ))}
        </div>
      </div>
    </section>
  );
}