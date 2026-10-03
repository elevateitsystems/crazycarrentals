import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function PublicLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
}
