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

/** Placeholder rows for a table that is loading for the first time. */
export function TableSkeleton({ rows = 6, label = "Loading…" }: { rows?: number; label?: string }) {
  return (
    <div role="status" aria-busy="true" aria-label={label} className="divide-y">
      <Skeleton className="h-11 rounded-none" />
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="flex items-center gap-4 px-6 py-4">
          <Skeleton className="size-9 shrink-0 rounded-full" />
          <Skeleton className="h-4 flex-1" />
          <Skeleton className="hidden h-4 w-1/5 sm:block" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
      ))}
      <span className="sr-only">{label}</span>
    </div>
  );
}

/** Placeholder cards for a vehicle grid, shaped like CarCard. */
export function CardGridSkeleton({ count = 6, label = "Loading…", className }: { count?: number; label?: string; className?: string }) {
  return (
    <div role="status" aria-busy="true" aria-label={label} className={cn("mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3", className)}>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="space-y-3 rounded-xl border bg-card p-3">
          <Skeleton className="aspect-video w-full rounded-lg" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-3 w-1/2" />
          <Skeleton className="h-9 w-full" />
        </div>
      ))}
      <span className="sr-only">{label}</span>
    </div>
  );
}

/** Keeps already-loaded content on screen (dimmed, with a progress bar) while it is being re-fetched. */
export function Refreshing({ active, children, className }: { active: boolean; children: React.ReactNode; className?: string }) {
  return (
    <div aria-busy={active} className={cn("relative", className)}>
      {active && (
        <div role="status" aria-label="Updating…" className="absolute inset-x-0 top-0 z-10 h-0.5 overflow-hidden rounded bg-primary/15">
          <div className="h-full w-1/3 animate-[refresh-bar_1s_ease-in-out_infinite] bg-primary motion-reduce:animate-none" />
        </div>
      )}
      <div className={cn("transition-opacity", active && "pointer-events-none opacity-60")}>{children}</div>
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
