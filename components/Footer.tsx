import Image from "next/image";
import Link from "next/link";

import { contactInfo } from "@/lib/contact";

type FooterLink = { label: string; href: string };

const navbarItems =[
    {label:'Rent a Car',href:'/rent-a-car'},
    {label:'Our Fleet',href:'/fleet'},
    {label:'Locations',href:'/locations'},
    {label:'Rental FAQs',href:'/faqs'},
]

const accidentReplacementLinks: FooterLink[] = [
  { label: "How It Works", href: "/accident-replacement/how-it-works" },
  { label: "Eligibility", href: "/accident-replacement#eligibility" },
  { label: "Apply", href: "/accident-replacement/apply" },
  { label: "FAQs", href: "/accident-replacement/faqs" },
];

const companyLinks: FooterLink[] = [
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Locations", href: "/locations" },
];

const supportLinks: FooterLink[] = [
  { label: "Help & FAQs", href: "/faqs" },
  { label: "Contact", href: "/contact" },
  { label: "Terms & Conditions", href: "/terms-and-conditions" },
  { label: "My Bookings", href: "/my-bookings" },
  { label: "Sign in", href: "/auth/signin" },
];

// Same stroke weight and size for every icon (lucide has no brand marks), so the row reads as one set.
const svg = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" } as const;

const socials = [
  {
    name: "Facebook",
    href: "https://facebook.com",
    icon: <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />,
  },
  {
    name: "Instagram",
    href: "https://instagram.com",
    icon: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <path d="M17.5 6.5h.01" />
      </>
    ),
  },
  {
    name: "LinkedIn",
    href: "https://linkedin.com",
    icon: (
      <>
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </>
    ),
  },
];

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: readonly FooterLink[];
}) {
  return (
    <nav aria-label={title}>
      <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-secondary-foreground">
        {title}
        <span aria-hidden className="mt-2 block h-0.5 w-6 rounded-full bg-primary" />
      </h3>
      <ul className="mt-5 space-y-3">
        {links.map((link) => (
          <li key={`${link.label}-${link.href}`}>
            <Link
              href={link.href}
              className="inline-block text-sm text-secondary-foreground/65 transition-all hover:translate-x-0.5 hover:text-primary focus-visible:text-primary focus-visible:outline-none"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

// Solid #181617 is the logo file's own background colour (same as the navbar), so the logo blends in instead of showing as a box.
export default function Footer() {
  return (
    <footer className="border-t-2 border-primary/70 bg-[#181617] text-secondary-foreground">
      <div className="mx-auto w-full max-w-[88rem] px-4 pt-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.6fr_repeat(4,1fr)] lg:gap-10">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1 lg:max-w-xs">
            <Link href="/" aria-label="TasDrive Rentals home" className="inline-block">
              <Image
                src="/logo.avif"
                alt="TasDrive Rentals"
                width={200}
                height={300}
                className="h-20 w-auto py-1 sm:h-24"
              />
            </Link>
            <p className="mt-5 text-sm leading-relaxed text-secondary-foreground/65">
              Your local destination for car rental and accident replacement
              vehicles in Tasmania.
            </p>

            <ul className="mt-5 space-y-2.5 text-sm text-secondary-foreground/75">
              {contactInfo.map(({ icon: Icon, label, value, href }) => {
                return (
                <li key={label} className="flex items-start gap-2.5">
                  <Icon className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
                  {href ? (
                    <a href={href} {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="transition-colors hover:text-primary">{value}</a>
                  ) : (
                    <span>{value}</span>
                  )}
                </li>
                );
              })}
            </ul>

            <ul className="mt-6 flex items-center gap-3">
              {socials.map((social) => (
                <li key={social.name}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                    className="flex size-10 items-center justify-center rounded-full border border-secondary-foreground/20 text-secondary-foreground/80 transition-all hover:-translate-y-0.5 hover:border-primary hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    <svg {...svg} className="size-[18px]" aria-hidden>{social.icon}</svg>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <FooterColumn title="Rental" links={navbarItems} />
          <FooterColumn title="Accident Replacement" links={accidentReplacementLinks} />
          <FooterColumn title="Company" links={companyLinks} />
          <FooterColumn title="Support" links={supportLinks} />
        </div>

        {/* Bottom bar */}
        <div className="mt-14 flex flex-col gap-2 border-t border-secondary-foreground/10 py-6 text-xs text-secondary-foreground/55 sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {new Date().getFullYear()} TasDrive Rentals. All rights
            reserved. ABN XX XXX XXX XXX
          </p>
          <p>Tasmania, Australia</p>
        </div>
      </div>
    </footer>
  );
}