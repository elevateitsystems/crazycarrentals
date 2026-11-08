import { Car } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Backend-hosted images come from an arbitrary origin, so a plain <img> avoids next/image host config.
 * A car without an image shows a neutral placeholder instead of a stand-in photo.
 */
export default function CarImage({ src, alt, className }: { src?: string | null; alt: string; className?: string }) {
  if (!src) {
    return (
      <div role="img" aria-label={`${alt} (no photo yet)`} className={cn("absolute inset-0 flex size-full flex-col items-center justify-center gap-1.5 bg-muted text-muted-foreground", className)}>
        <Car className="size-8" aria-hidden />
        <span className="text-xs font-medium">No photo yet</span>
      </div>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} loading="lazy" className={cn("absolute inset-0 size-full object-cover", className)} />
  );
}
