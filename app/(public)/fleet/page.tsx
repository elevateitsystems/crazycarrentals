import Image from "next/image";
import FleetSection from "./components/FleetSection";

export default function Page() {
  return (
    <>
      <section aria-labelledby="fleet-heading" className="relative isolate flex min-h-80 items-center overflow-hidden bg-white sm:min-h-[22rem] lg:min-h-[26rem]">
        <Image
          src="/fleet-hero.jpeg"
          alt="A coastal road winding along the water towards Tasmanian mountains at sunset"
          fill
          priority
          sizes="100vw"
          className="-z-20 object-cover object-[70%_center] sm:object-center"
        />
        {/* White fade on the left keeps the dark text readable over the sky and scrub. */}
        <div className="absolute inset-0 -z-10 bg-linear-to-r from-white/95 via-white/75 to-white/20 sm:from-white/90 sm:via-white/60 sm:to-transparent" />

        <div className="mx-auto w-full max-w-[88rem] px-4 py-10 sm:px-6 lg:px-8">
          <div className="max-w-xl">
            <h1 id="fleet-heading" className="text-balance font-heading text-3xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              The Right Vehicle <span className="text-[#4f9a0e]">For Every Journey</span>
            </h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-foreground/75">
              From compact city cars to premium SUVs and commercial trucks — we have a vehicle to match your needs.
            </p>
          </div>
        </div>
      </section>
      <FleetSection />
    </>
  );
}
