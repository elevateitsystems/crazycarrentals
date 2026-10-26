import FleetBrowser from "@/components/FleetBrowser";

export default function FleetSection() {
  return (
    <section className="bg-card py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-0">
        <FleetBrowser />
      </div>
    </section>
  );
}
