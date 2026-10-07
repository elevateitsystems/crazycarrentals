import { AdminSidebar } from "./components/AdminSidebar";
import "../globals.css";

export const metadata = {
  title: "Admin Dashboard - Crazy Car Rentals",
  description: "Admin panel for managing settings",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-muted/20">
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b bg-background px-6 md:hidden">
          <span className="font-bold">Admin Panel</span>
        </header>
        <main className="flex-1 p-6 md:p-8 lg:p-10">
          <div className="mx-auto max-w-4xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
