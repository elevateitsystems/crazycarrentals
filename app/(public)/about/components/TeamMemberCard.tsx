import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import type { TeamMember } from "@/lib/team";

export default function TeamMemberCard({ name, role, image }: TeamMember) {
  return (
    <Card className="gap-0 overflow-hidden rounded-2xl border-border bg-card py-0 shadow-none">
      <div className="relative aspect-3/2 bg-muted">
        <Image
          src={image}
          alt={name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover"
        />
      </div>
      <CardContent className="px-5 pb-5 pt-4">
        <h3 className="text-sm font-semibold leading-5 text-foreground">{name}</h3>
        <p className="mt-1 text-xs text-primary">{role}</p>
      </CardContent>
    </Card>
  );
}