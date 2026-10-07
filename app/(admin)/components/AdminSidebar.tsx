"use client";

import { Settings, LogOut, Car, Users, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function AdminSidebar() {
  const pathname = usePathname();

  const links = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/fleet-management", label: "Fleet Management", icon: Car },
    { href: "/customers", label: "Customers", icon: Users },
    { href: "/admin-settings", label: "Booking Settings", icon: Settings },
  ];

  return (
    <aside className="w-64 flex-col border-r bg-background hidden md:flex">
      <div className="flex h-16 items-center px-6 border-b">
        <Link href="/dashboard" className="flex items-center gap-2 font-bold text-lg tracking-tight">
          <span className="bg-[#86d72f] text-neutral-900 rounded px-1.5 py-0.5 text-sm">C</span>
          Admin Panel
        </Link>
      </div>
      
      <nav className="flex-1 space-y-1.5 p-4">
        {links.map((link) => {
          const isActive = pathname === link.href;
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

      <div className="p-4 border-t mt-auto">
        <Link href="/" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10">
          <LogOut className="size-4" />
          Logout
        </Link>
      </div>
    </aside>
  );
}
