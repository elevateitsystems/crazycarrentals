import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-6 text-center">
      <span className="text-sm font-semibold uppercase tracking-widest text-primary">404</span>
      <h1 className="text-3xl font-bold tracking-tight">We couldn&apos;t find that page</h1>
      <p className="max-w-md text-sm text-muted-foreground">The link may be out of date, or the page may have moved.</p>
      <div className="mt-2 flex flex-wrap justify-center gap-3">
        <Link href="/" className={cn(buttonVariants(), "h-10 px-5")}>Go home</Link>
        <Link href="/rent-a-car" className={cn(buttonVariants({ variant: "outline" }), "h-10 px-5")}>Rent a car</Link>
      </div>
    </main>
  );
}
