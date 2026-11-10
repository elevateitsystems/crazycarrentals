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
    href: "/accident-replacement/eligibility",
    button: "bg-neutral-900 text-[#9be33a] shadow-[0_6px_16px_rgba(0,0,0,0.3)]",
    arrow: "bg-[#9be33a] text-neutral-900",
  },
];

export default function HeroSection() {
  return (
    <section className="relative flex min-h-screen w-full items-center overflow-hidden">
      <Image
        src="/hero-section-car.png"
        alt="SUV parked on a coastal road at sunset"
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-linear-to-r from-black/60 via-black/25 to-transparent" />

      <div className="relative z-10 mx-auto w-full max-w-7xl py-20 px-4 sm:px-6 md:px-0">
        <span className="inline-flex items-center gap-2 rounded-full border border-[#9be33a]/40 bg-[#9be33a]/15 px-3 py-1 text-[11px] font-medium text-[#9be33a] backdrop-blur-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-[#9be33a]" />
          Tasmania&apos;s Trusted Vehicle Partner
        </span>

        <h1 className="mt-5 text-5xl font-semibold leading-[1.1] tracking-tight text-white md:text-7xl">
          Need A Car?
          <br />
          <span className="text-[#8ed62c]">We&apos;ve Got</span>
          <br />
          You Covered.
        </h1>

        <p className="mt-6 max-w-md text-sm leading-relaxed text-white/80">
          Rent a car for your next trip, or get a replacement vehicle after an
          accident — all from one trusted Tasmanian team.
        </p>

        <div className="mt-8 grid md:max-w-1/2 gap-3 sm:grid-cols-2">
          {services.map(({ icon: Icon, label, title, description, ctaLabel, href, button, arrow }) => (
            <div key={label} className="flex w-full flex-col rounded-2xl bg-white p-5 shadow-xl">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#eefad9] text-[#5aa312]">
                <Icon size={18} />
              </div>

              <span className="text-[10px] font-semibold tracking-widest text-[#5aa312]">{label}</span>
              <h3 className="mt-1 text-lg font-semibold text-neutral-900">{title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-neutral-600">{description}</p>

              <Link
                href={href}
                className={`mt-4 flex items-center justify-between rounded-lg py-2 pl-4 pr-2 text-sm font-medium transition hover:brightness-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9be33a] ${button}`}
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
    </section>
  );
}