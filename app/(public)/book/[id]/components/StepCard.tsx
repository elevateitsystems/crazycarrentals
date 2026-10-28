import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Notice } from "@/components/Feedback";
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
  submitting?: boolean;
  error?: string | null;
  footerNote?: React.ReactNode;
};

const footerButton = "h-11 rounded-xl px-5 text-sm font-medium shadow-none";

export default function StepCard({
  title,
  description,
  children,
  nextLabel = "Continue",
  onSubmit,
  onBack,
  backHref,
  backLabel = "Back",
  submitting = false,
  error,
  footerNote,
}: StepCardProps) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <Card className="gap-0 rounded-2xl border-border py-0 shadow-sm">
        <CardContent className="p-6 sm:p-10">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">{title}</h2>
          <p className="mt-2 text-[15px] leading-6 text-muted-foreground">{description}</p>

          <div className="mt-8">{children}</div>

          {error && (
            <Notice className="mt-5">
              {error}
              {footerNote}
            </Notice>
          )}

          <div className="mt-9 flex items-center justify-between border-t border-border pt-7">
            {backHref ? (
              <Link
                href={backHref}
                className={cn(buttonVariants({ variant: "outline" }), footerButton, "gap-1.5 border-border bg-card text-foreground hover:bg-muted")}
              >
                <ArrowLeft size={15} />
                {backLabel}
              </Link>
            ) : (
              <Button
                type="button"
                variant="outline"
                onClick={onBack}
                className={cn(footerButton, "gap-1.5 border-border bg-card text-foreground hover:bg-muted")}
              >
                <ArrowLeft size={15} />
                {backLabel}
              </Button>
            )}

            <Button
              type="submit"
              loading={submitting}
              className={cn(footerButton, "gap-1.5 bg-primary px-5 font-semibold text-primary-foreground hover:bg-primary/90")}
            >
              {submitting ? "Please wait…" : nextLabel}
              {!submitting && <ArrowRight size={15} />}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}