import BrandLoader from "@/components/BrandLoader";

// Shown inside the admin shell while a dashboard route is loading, so the sidebar never disappears.
export default function Loading() {
  return <BrandLoader label="Loading…" className="min-h-[50vh]" />;
}
