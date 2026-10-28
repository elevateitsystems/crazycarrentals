import { Mail, MapPin, Phone, type LucideIcon } from "lucide-react";
import { BUSINESS_ADDRESS, BUSINESS_EMAIL, BUSINESS_HOURS_SUMMARY, BUSINESS_PHONE, BUSINESS_PHONE_HREF, DIRECTIONS_URL } from "@/lib/business";

export type ContactInfo = {
  icon: LucideIcon;
  label: string;
  value: string;
  caption: string;
  href?: string;
};

export const contactInfo: ContactInfo[] = [
  {
    icon: Phone,
    label: "Phone",
    value: BUSINESS_PHONE,
    caption: BUSINESS_HOURS_SUMMARY,
    href: BUSINESS_PHONE_HREF,
  },
  {
    icon: Mail,
    label: "Email",
    value: BUSINESS_EMAIL,
    caption: "We respond within 1 business day",
    href: `mailto:${BUSINESS_EMAIL}`,
  },
  {
    icon: MapPin,
    label: "Address",
    value: BUSINESS_ADDRESS,
    caption: "Launceston branch · walk-ins welcome during opening hours",
    href: DIRECTIONS_URL,
  },
];