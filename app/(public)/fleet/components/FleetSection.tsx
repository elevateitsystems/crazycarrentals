import FleetBrowser from "@/components/FleetBrowser";

export default function FleetSection() {
  return (
    <section className="bg-background py-12 md:py-16 lg:py-20">
      <div className="mx-auto max-w-[88rem] px-4 sm:px-6 lg:px-8">
        <FleetBrowser />
      </div>
    </section>
  );
}
