import type { LucideIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";

type Props = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export default function ValueCard({ icon: Icon, title, description }: Props) {
  return (
    <Card className="gap-0 rounded-2xl border-border bg-card py-0 shadow-none">
      <CardContent className="p-5.5">
        <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon size={17} strokeWidth={1.5} />
        </div>
        <CardTitle className="mt-4 text-[15px] font-semibold leading-5 text-foreground">{title}</CardTitle>
        <CardDescription className="mt-2.5 text-[13px] leading-5.5 text-muted-foreground">
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  );
}