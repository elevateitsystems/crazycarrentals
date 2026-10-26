import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Branded loader: the site logo inside a spinning ring. Use for waits that block a whole page or section
 * (route changes, session checks). For content that has a known shape prefer the skeletons in Feedback.tsx,
 * and for buttons use <Button loading>.
 */
export default function BrandLoader({
  label = "Loading…",
  fullScreen = false,
  className,
}: {
  label?: string;
  /** Fill the viewport (session checks) instead of a section-height block. */
  fullScreen?: boolean;
  className?: string;
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "flex flex-col items-center justify-center gap-5 px-6",
        fullScreen ? "min-h-screen bg-background" : "min-h-[50vh]",
        className,
      )}
    >
      <div className="relative flex size-28 items-center justify-center">
        <span aria-hidden className="absolute inset-0 rounded-full border-2 border-primary/20" />
        <span
          aria-hidden
          className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-primary motion-reduce:animate-none"
        />
        <Image
          src="/logo.avif"
          alt=""
          width={200}
          height={300}
          priority
          className="h-12 w-[4.5rem] animate-pulse rounded-lg object-cover motion-reduce:animate-none"
        />
      </div>
      <p className="text-sm font-medium tracking-wide text-muted-foreground">{label}</p>
    </div>
  );
}
