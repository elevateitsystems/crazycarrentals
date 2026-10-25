"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { useAuth } from "@/lib/auth";

const linkClass = "text-sm font-medium text-secondary-foreground/90 transition-colors hover:text-primary";

export default function AccountMenu({ className }: { className?: string }) {
  const { status, user, logout } = useAuth();
  const router = useRouter();

  if (status === "loading") return null;

  if (status === "guest") {
    return (
      <Link href="/auth/signin" className={`${linkClass} ${className ?? ""}`}>
        Sign in
      </Link>
    );
  }

  return (
    <div className={`flex items-center gap-4 ${className ?? ""}`}>
      <Link href="/my-bookings" className={linkClass} title={user?.email}>
        My Bookings
      </Link>
      <button
        type="button"
        onClick={() => {
          logout();
          router.push("/");
        }}
        className={`${linkClass} inline-flex items-center gap-1.5`}
      >
        <LogOut className="size-4" />
        Logout
      </button>
    </div>
  );
}
