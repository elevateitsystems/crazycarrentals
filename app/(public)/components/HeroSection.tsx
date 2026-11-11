import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Car, ShieldCheck } from "lucide-react";

const services = [
  {
    icon: Car,
    label: "SERVICE 01",
    title: "Rent a Car",
    description: "Flexible vehicles for everyday travel, holidays and business.",
    ctaLabel: "Find A Car",
    href: "/rent-a-car",
    button: "bg-[#9be33a] text-neutral-900 shadow-[0_6px_16px_rgba(155,227,58,0.45)]",
    arrow: "bg-neutral-900 text-[#9be33a]",
  },
  {
    icon: ShieldCheck,
    label: "SERVICE 02",
    title: "Accident Replacement",
    description: "Need a vehicle after an accident? We can help get you back on the road.",
    ctaLabel: "Check Eligibility",
    href: "/accident-replacement#eligibility",
    button: "bg-neutral-900 text-[#9be33a] shadow-[0_6px_16px_rgba(0,0,0,0.3)]",
    arrow: "bg-[#9be33a] text-neutral-900",
  },
];

export default function HeroSection() {
  return (
    // Not full-screen: the reservation form below should be visible without scrolling far.
    <section className="relative isolate flex w-full items-center overflow-hidden bg-neutral-900 md:min-h-[clamp(26rem,36vw,40rem)]">
      {/* The hero grows with the screen width (see min-h) so the photo is never zoomed in far enough to crop the car. */}
      {/* The photo has the car on the right and a dark wall on the left, where the text sits. */}
      {/* Never wider than the photo itself (1280px), so it is not stretched on big screens; the dark wall blends into the background. */}
      <div className="absolute inset-y-0 right-0 -z-20 w-full md:max-w-[1280px]">
        <Image
          src="/hero-toyota-rav4.jpg"
          alt="White Toyota RAV4 with a TasDrive number plate parked outside a modern building"
          fill
          priority
          sizes="(min-width: 1280px) 1280px, 100vw"
          className="object-cover object-[72%_70%] md:object-[right_72%]"
        />
        <div className="absolute inset-y-0 left-0 hidden w-1/4 bg-linear-to-r from-neutral-900 to-transparent md:block" />
      </div>
      <div className="absolute inset-0 -z-10 bg-linear-to-r from-black/75 via-black/45 to-black/5 md:from-black/70 md:via-black/30 md:to-transparent" />

      <div className="mx-auto w-full max-w-[88rem] px-4 py-8 sm:px-6 sm:py-9 lg:px-8 lg:py-10">
        <div className="max-w-2xl lg:max-w-[46%]">

          <h1 className="text-4xl font-semibold leading-[1.1] tracking-tight text-white sm:text-5xl">
            Need A Car?
            <br />
            <span className="text-[#8ed62c]">We&apos;ve Got You Covered.</span>
          </h1>

          <p className="mt-3 max-w-md text-sm leading-relaxed text-white/80">
            Rent a car for your next trip, or get a replacement vehicle after an
            accident — all from one trusted Tasmanian team.
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {services.map(({ icon: Icon, label, title, description, ctaLabel, href, button, arrow }) => (
              <div key={label} className="flex w-full flex-col rounded-2xl bg-white p-4 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#eefad9] text-[#5aa312]">
                    <Icon size={17} />
                  </div>
                  <div className="min-w-0">
                    <span className="block text-[10px] font-semibold tracking-widest text-[#5aa312]">{label}</span>
                    <h3 className="text-base font-semibold leading-tight text-neutral-900">{title}</h3>
                  </div>
                </div>
                <p className="mt-3 text-xs leading-relaxed text-neutral-600 md:hidden">{description}</p>

                <Link
                  href={href}
                  className={`mt-3 flex items-center justify-between rounded-lg py-2 pl-4 pr-2 text-sm font-medium transition hover:brightness-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9be33a] ${button}`}
                >
                  {ctaLabel}
                  <span className={`ml-4 flex h-7 w-7 items-center justify-center rounded-md ${arrow}`}>
                    <ArrowUpRight size={16} />
                  </span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
