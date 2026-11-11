import { cn } from "@/lib/utils";

type Props = {
  eyebrow?: string;
  title: React.ReactNode;
  description?: string;
  align?: "center" | "left";
  /** "dark" is for sections on a dark background. */
  tone?: "light" | "dark";
  className?: string;
};

/** Shared heading block for the home page sections, so every section opens the same way. */
export default function SectionHeading({ eyebrow, title, description, align = "center", tone = "light", className }: Props) {
  const center = align === "center";
  const dark = tone === "dark";
  return (
    <div className={cn(center ? "mx-auto max-w-2xl text-center" : "max-w-2xl", className)}>
      {eyebrow && (
        <span className={cn("inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.2em]", dark ? "text-primary" : "text-[#4f9a0e]")}>
          <span aria-hidden className="h-px w-7 bg-current opacity-60" />
          {eyebrow}
          {center && <span aria-hidden className="h-px w-7 bg-current opacity-60" />}
        </span>
      )}
      <h2
        className={cn(
          "text-balance font-heading text-[2rem] font-bold leading-[1.12] tracking-tight sm:text-4xl lg:text-[2.75rem]",
          eyebrow && "mt-4",
          dark ? "text-white" : "text-foreground"
        )}
      >
        {title}
      </h2>
      {description && <p className={cn("mt-4 text-[15px] leading-7 sm:text-base", dark ? "text-white/65" : "text-muted-foreground")}>{description}</p>}
    </div>
  );
}
