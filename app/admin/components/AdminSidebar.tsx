"use client";

import { LogOut, Car, Users, LayoutDashboard, CalendarCheck, IdCard, CreditCard, PackagePlus, ShieldCheck, CalendarRange } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAdminAuth } from "@/lib/admin-auth";
import { enumLabel } from "@/lib/format";
import { cn } from "@/lib/utils";

export const adminLinks = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/bookings", label: "Bookings", icon: CalendarCheck },
  { href: "/admin/payments", label: "Payments", icon: CreditCard },
  { href: "/admin/fleet-management", label: "Fleet Management", icon: Car },
  { href: "/admin/drivers", label: "Drivers", icon: IdCard },
  { href: "/admin/calendar-prices", label: "Date Prices", icon: CalendarRange },
  { href: "/admin/extras", label: "Extras", icon: PackagePlus },
  { href: "/admin/protections", label: "Protection", icon: ShieldCheck },
  { href: "/admin/customers", label: "Customers", icon: Users },
];

export function useAdminLogout() {
  const router = useRouter();
  const { logout } = useAdminAuth();
  return async () => {
    await logout();
    router.replace("/auth/signin");
  };
}

export function AdminSidebar() {
  const pathname = usePathname();
  const { user } = useAdminAuth();
  const signOut = useAdminLogout();

  const links = adminLinks;

  return (
    <aside className="w-64 flex-col border-r bg-background hidden md:flex">
      <div className="flex h-20 items-center border-b px-6">
        <Link href="/admin/dashboard" aria-label="TasDrive Rentals admin dashboard">
          <Image src="/logo.avif" alt="TasDrive Rentals" width={200} height={300} priority className="h-14 w-auto rounded-md" />
        </Link>
      </div>

      <nav className="flex-1 space-y-1.5 p-4">
        {links.map((link) => {
          const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="size-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t mt-auto space-y-3">
        {user && (
          <div className="px-3 text-xs">
            <p className="truncate font-semibold text-foreground">{user.name ?? user.email}</p>
            <p className="truncate text-muted-foreground">{user.email} · {enumLabel(String(user.role ?? ""))}</p>
          </div>
        )}
        <button
          type="button"
          onClick={signOut}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
        >
          <LogOut className="size-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}
