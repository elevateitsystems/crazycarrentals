import { AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function Notice({
  kind = "error",
  children,
  className,
}: {
  kind?: "error" | "success" | "info";
  children: React.ReactNode;
  className?: string;
}) {
  const Icon = kind === "success" ? CheckCircle2 : AlertCircle;
  return (
    <div
      role={kind === "error" ? "alert" : "status"}
      className={cn(
        "flex items-start gap-2 rounded-lg border px-3 py-2.5 text-sm",
        kind === "error" && "border-destructive/30 bg-destructive/10 text-destructive",
        kind === "success" && "border-green-600/30 bg-green-50 text-green-800",
        kind === "info" && "border-border bg-muted/60 text-muted-foreground",
        className,
      )}
    >
      <Icon className="mt-0.5 size-4 shrink-0" />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

/** Skeleton placeholder shown while data loads (kept under the old name so callers stay unchanged). */
export function Spinner({ label = "Loading…", className }: { label?: string; className?: string }) {
  return (
    <div role="status" aria-label={label} className={cn("space-y-3 p-6", className)}>
      <Skeleton className="h-5 w-1/3" />
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-12 w-4/5" />
      <span className="sr-only">{label}</span>
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="space-y-3 py-6">
      <Notice>{message}</Notice>
      {onRetry && (
        <Button variant="outline" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}

export function EmptyState({ children }: { children: React.ReactNode }) {
  return <p className="py-10 text-center text-sm text-muted-foreground">{children}</p>;
}
