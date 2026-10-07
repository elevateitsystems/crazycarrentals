import { cn } from "@/lib/utils";

export default function SectionBadge({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-[10px] font-semibold tracking-wide text-primary",
        className
      )}
    >
      <span className="size-1 rounded-full bg-primary" />
      {children}
    </span>
  );
}