"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogIn, LogOut, UserRound } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";

const linkClass = "text-sm font-medium text-secondary-foreground/90 transition-colors hover:text-primary";
/** Desktop: icon + label, no box. Hover tints the icon chip and the text with the brand colour. */
const iconLinkClass =
  "group inline-flex items-center gap-2 text-sm font-medium text-secondary-foreground/90 transition-colors hover:text-primary";
const buttonClass =
  "inline-flex h-10 items-center justify-center gap-1.5 rounded-lg border border-secondary-foreground/25 px-4 text-sm font-medium text-secondary-foreground transition-colors hover:border-primary hover:text-primary";

/** `bar` is the compact desktop form; `menu` stacks full-width rows for the mobile sheet. */
export default function AccountMenu({ className, variant = "bar" }: { className?: string; variant?: "bar" | "menu" }) {
  const { status, user, logout } = useAuth();
  const router = useRouter();
  const menu = variant === "menu";

  if (status === "loading") return null;

  if (status === "guest") {
    if (menu) {
      return (
        <Link href="/auth/signin" className={cn(buttonClass, "w-full", className)}>
          Sign in
        </Link>
      );
    }
    return (
      <Link href="/auth/signin" className={cn(iconLinkClass, className)}>
        <span className="flex size-8 items-center justify-center rounded-full border border-secondary-foreground/25 transition-colors group-hover:border-primary group-hover:bg-primary/10">
          <LogIn className="size-4" aria-hidden />
        </span>
        Sign in
      </Link>
    );
  }

  return (
    <div className={cn("flex items-center gap-3", menu && "flex-col items-stretch", className)}>
      <Link href="/my-bookings" className={cn(menu ? buttonClass : iconLinkClass)} title={user?.email}>
        {!menu && (
          <span className="flex size-8 items-center justify-center rounded-full border border-secondary-foreground/25 transition-colors group-hover:border-primary group-hover:bg-primary/10">
            <UserRound className="size-4" aria-hidden />
          </span>
        )}
        My Bookings
      </Link>
      <button
        type="button"
        onClick={() => {
          logout();
          router.push("/");
        }}
        className={cn(menu ? buttonClass : linkClass, "inline-flex items-center gap-1.5")}
      >
        <LogOut className="size-4" />
        Logout
      </button>
    </div>
  );
}
