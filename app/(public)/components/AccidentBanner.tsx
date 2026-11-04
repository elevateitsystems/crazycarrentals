import Image from "next/image";

/** Full promotional banner for the accident replacement service. The artwork carries its own text. */
export default function AccidentBanner() {
  return (
    <section className="px-4 py-12 sm:px-6 md:py-16" aria-label="Accident replacement vehicles across Tasmania">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[19px] shadow-[0_10px_40px_rgba(0,0,0,0.18)]">
        <Image
          src="/accident-replacement-banner.jpg"
          alt="Accident? Not your fault? TasDrive Rentals keeps you moving safely with statewide Tasmanian support, zero out-of-pocket costs and a premium like-for-like replacement fleet."
          width={1280}
          height={714}
          sizes="(min-width: 1280px) 1280px, 100vw"
          className="h-auto w-full"
        />
      </div>
    </section>
  );
}
