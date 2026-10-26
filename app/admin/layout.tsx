import { AdminAuthProvider } from "@/lib/admin-auth";
import AdminGuard from "./components/AdminGuard";
import { AdminSidebar } from "./components/AdminSidebar";
import { AdminMobileNav } from "./components/AdminMobileNav";
import "../globals.css";

export const metadata = {
  title: "Admin Dashboard - Crazy Car Rentals",
  description: "Admin panel for managing bookings, fleet, drivers and customers",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthProvider>
      <AdminGuard>
        <div className="flex min-h-screen bg-muted/20">
          <AdminSidebar />

          {/* Main Content */}
          <div className="flex min-w-0 flex-1 flex-col">
            <AdminMobileNav />
            <main className="flex-1 p-6 md:p-8 lg:p-10">
              <div className="mx-auto max-w-6xl">
                {children}
              </div>
            </main>
          </div>
        </div>
      </AdminGuard>
    </AdminAuthProvider>
  );
}
