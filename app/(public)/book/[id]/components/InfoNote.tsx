import { ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export default function InfoNote({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "flex items-start gap-2.5 rounded-xl border border-primary/30 bg-primary/10 px-4 py-3.5 text-sm leading-5 text-muted-foreground",
        className
      )}
    >
      <ShieldCheck className="mt-px size-5 shrink-0 text-primary" />
      <p>{children}</p>
    </div>
  );
}