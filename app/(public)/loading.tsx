import BrandLoader from "@/components/BrandLoader";

// Shown by Next.js while a public route segment is loading; the navbar and footer stay on screen.
export default function Loading() {
  return <BrandLoader className="min-h-[60vh]" />;
}
