"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Menu } from "lucide-react";
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { adminLinks, useAdminLogout } from "./AdminSidebar";

export function AdminMobileNav() {
  const pathname = usePathname();
  const signOut = useAdminLogout();

  return (
    <header className="flex h-16 items-center justify-between border-b bg-background px-4 md:hidden">
      <Link href="/admin/dashboard" aria-label="TasDrive Rentals admin dashboard">
        <Image src="/logo.avif" alt="TasDrive Rentals" width={200} height={300} priority className="h-11 w-auto rounded-md" />
      </Link>
      <Sheet>
        <SheetTrigger aria-label="Open menu" className="flex size-10 items-center justify-center rounded-lg hover:bg-muted">
          <Menu className="size-6" />
        </SheetTrigger>
        <SheetContent side="right" className="w-72">
          <SheetTitle className="sr-only">Admin navigation</SheetTitle>
          <nav className="mt-12 space-y-1 px-4">
            {adminLinks.map(({ href, label, icon: Icon }) => (
              <SheetClose key={href} className="flex w-full">
                <Link
                  href={href}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium",
                    pathname === href || pathname.startsWith(`${href}/`) ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"
                  )}
                >
                  <Icon className="size-4" />
                  {label}
                </Link>
              </SheetClose>
            ))}
            <button
              type="button"
              onClick={signOut}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/10"
            >
              <LogOut className="size-4" />
              Logout
            </button>
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  );
}
