import Image from "next/image";
import Link from "next/link";

import facebookIcon from "@/components/ui/icons/facebook.avif";
import linkedinIcon from "@/components/ui/icons/linkedin.webp";
import instagramIcon from "@/components/ui/icons/instagram.webp";

type FooterLink = { label: string; href: string };

const navbarItems =[
    {label:'Rent a Car',href:'/rent-a-car'},
    {label:'Our Fleet',href:'/fleet'},
    {label:'Locations',href:'/locations'},
    {label:'Rental FAQs',href:'/faqs'},
]

const accidentReplacementLinks: FooterLink[] = [
  { label: "How It Works", href: "/accident-replacement/how-it-works" },
  { label: "Eligibility", href: "/accident-replacement/eligibility" },
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
  { label: "My Bookings", href: "/my-bookings" },
  { label: "Sign in", href: "/auth/signin" },
];

const socials = [
  { name: "Facebook", href: "https://facebook.com", icon: facebookIcon },
  { name: "LinkedIn", href: "https://linkedin.com", icon: linkedinIcon },
  { name: "Instagram", href: "https://instagram.com", icon: instagramIcon },
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
      <h3 className="text-xs font-semibold uppercase tracking-wider text-secondary-foreground">
        {title}
      </h3>
      <ul className="mt-5 space-y-3">
        {links.map((link) => (
          <li key={`${link.label}-${link.href}`}>
            <Link
              href={link.href}
              className="text-sm text-secondary-foreground/60 transition-colors hover:text-primary focus-visible:outline-none focus-visible:text-primary"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="mx-auto w-full max-w-7xl px-4 pt-12 sm:px-6 lg:px-0">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_repeat(4,1fr)] lg:gap-8">
          {/* Brand */}
          <div className="max-w-xs">
            <Link href="/" aria-label="TasDrive Rentals home" className="inline-block">
              <Image
                src="/logo.avif"
                alt="TasDrive Rentals"
                width={200}
                height={300}
                className="h-16 md:h-24 w-auto rounded-md"
              />
            </Link>
            <p className="mt-5 text-sm leading-relaxed text-secondary-foreground/60">
              Your local destination for car rental and accident replacement
              vehicles in Tasmania.
            </p>

            <ul className="mt-6 flex items-center gap-3">
              {socials.map((social) => (
                <li key={social.name}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                    className="block overflow-hidden rounded-md transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <Image
                      src={social.icon}
                      alt={social.name}
                      width={28}
                      height={28}
                      className="size-7 object-cover"
                    />
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
        <div className="mt-12 flex flex-col gap-2 border-t border-secondary-foreground/10 py-6 text-xs text-secondary-foreground/50 sm:flex-row sm:items-center sm:justify-between">
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