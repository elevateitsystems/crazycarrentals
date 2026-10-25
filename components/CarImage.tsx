import { cn } from "@/lib/utils";

/** Backend-hosted images come from an arbitrary origin, so a plain <img> avoids next/image host config. */
export default function CarImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} loading="lazy" className={cn("absolute inset-0 size-full object-cover", className)} />
  );
}
