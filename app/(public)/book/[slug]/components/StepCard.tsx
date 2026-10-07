import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type StepCardProps = {
  title: string;
  description: string;
  children: React.ReactNode;
  nextLabel?: string;
  onSubmit: () => void;
  onBack?: () => void;
  backHref?: string;
  backLabel?: string;
};

const footerButton = "h-9 rounded-lg px-4 text-xs font-medium shadow-none";

export default function StepCard({
  title,
  description,
  children,
  nextLabel = "Continue",
  onSubmit,
  onBack,
  backHref,
  backLabel = "Back",
}: StepCardProps) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <Card className="gap-0 rounded-2xl border-border py-0 shadow-sm">
        <CardContent className="p-8">
          <h2 className="text-xl font-bold tracking-tight text-foreground">{title}</h2>
          <p className="mt-1.5 text-xs text-muted-foreground">{description}</p>

          <div className="mt-6">{children}</div>

          <div className="mt-7 flex items-center justify-between border-t border-border pt-6">
            {backHref ? (
              <Link
                href={backHref}
                className={cn(buttonVariants({ variant: "outline" }), footerButton, "gap-1.5 border-border bg-card text-foreground hover:bg-muted")}
              >
                <ArrowLeft size={12} />
                {backLabel}
              </Link>
            ) : (
              <Button
                type="button"
                variant="outline"
                onClick={onBack}
                className={cn(footerButton, "gap-1.5 border-border bg-card text-foreground hover:bg-muted")}
              >
                <ArrowLeft size={12} />
                {backLabel}
              </Button>
            )}

            <Button
              type="submit"
              className={cn(footerButton, "gap-1.5 bg-primary px-5 font-semibold text-primary-foreground hover:bg-primary/90")}
            >
              {nextLabel}
              <ArrowRight size={12} />
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}