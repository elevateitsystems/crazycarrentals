import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Action = { label: string; href: string };

type Props = {
  /** Small label above the heading. */
  badge?: string;
  title: string;
  /** Second heading line, shown in the accent colour. */
  highlight?: string;
  description?: string;
  /** Up to two buttons: the first is the primary one. */
  actions?: Action[];
  className?: string;
};

/**
 * Compact heading for inner pages: text only, no banner image, so the page content starts right under the navbar.
 * (The home page keeps its own full-size hero.)
 */
export default function PageHeader({ badge, title, highlight, description, actions, className }: Props) {
  return (
    <header className={cn("border-b border-border bg-background", className)}>
      <div className="mx-auto w-full max-w-[88rem] px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        {badge && (
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-[11px] font-semibold text-[#4f9a0e]">
            <span className="size-1.5 rounded-full bg-primary" aria-hidden />
            {badge}
          </span>
        )}
        <h1 className={cn("font-heading text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl", badge && "mt-3")}>
          {title}
          {highlight && (
            <>
              {" "}
              <span className="text-[#4f9a0e]">{highlight}</span>
            </>
          )}
        </h1>
        {description && <p className="mt-3 max-w-3xl text-[15px] leading-relaxed text-muted-foreground">{description}</p>}
        {actions && actions.length > 0 && (
          <div className="mt-5 flex flex-wrap items-center gap-3">
            {actions.map((a, i) => (
              <Link
                key={a.href}
                href={a.href}
                className={cn(
                  "group inline-flex h-10 items-center gap-2 rounded-lg px-4 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  i === 0 ? "bg-primary text-primary-foreground hover:bg-primary/90" : "border border-border bg-card text-foreground hover:bg-muted"
                )}
              >
                {a.label}
                <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
