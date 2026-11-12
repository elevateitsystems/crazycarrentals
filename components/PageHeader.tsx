import Image from "next/image";
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
  /** Optional picture shown beside the text (below it on phones). */
  image?: { src: string; alt: string };
  className?: string;
};

/**
 * Compact heading for inner pages: text only, no banner image, so the page content starts right under the navbar.
 * (The home page keeps its own full-size hero.)
 */
export default function PageHeader({ badge, title, highlight, description, actions, image, className }: Props) {
  return (
    <header className={cn("relative isolate overflow-hidden border-b border-border bg-white", className)}>
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_130%_at_88%_-30%,rgba(139,214,47,0.18),transparent_70%)]" />
      <div className={cn("mx-auto w-full max-w-[88rem] px-4 py-10 sm:px-6 sm:py-14 lg:px-8", image && "grid items-center gap-8 lg:grid-cols-[1.15fr_1fr] lg:gap-14")}>
        <div>
        {badge && (
          <span className="inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#4f9a0e]">
            <span aria-hidden className="h-px w-7 bg-current opacity-60" />
            {badge}
          </span>
        )}
        <h1 className={cn("text-balance font-heading text-3xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-4xl lg:text-5xl", badge && "mt-4")}>
          {title}
          {highlight && (
            <>
              {" "}
              <span className="text-[#4f9a0e]">{highlight}</span>
            </>
          )}
        </h1>
        {description && <p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground">{description}</p>}
        {actions && actions.length > 0 && (
          <div className="mt-6 flex flex-wrap items-center gap-3">
            {actions.map((a, i) => (
              <Link
                key={a.href}
                href={a.href}
                className={cn(
                  "group inline-flex h-11 items-center gap-2 rounded-xl px-5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  i === 0
                    ? "bg-primary text-primary-foreground shadow-[0_10px_24px_-10px_rgba(139,214,47,0.8)] hover:bg-primary/90"
                    : "border border-foreground/15 bg-white text-foreground hover:border-foreground/40 hover:bg-muted"
                )}
              >
                {a.label}
                <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
              </Link>
            ))}
          </div>
        )}
        </div>

        {image && (
          <div className="relative aspect-[16/10] overflow-hidden rounded-3xl shadow-[0_30px_60px_-30px_rgba(17,21,18,0.45)] ring-1 ring-black/5">
            <Image src={image.src} alt={image.alt} fill priority sizes="(min-width: 1024px) 42vw, 100vw" className="object-cover" />
          </div>
        )}
      </div>
    </header>
  );
}
