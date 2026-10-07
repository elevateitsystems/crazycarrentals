import { Mail, MapPin, Phone, type LucideIcon } from "lucide-react";

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
    value: "(03) 6200 0000",
    caption: "Mon–Fri 8am–6pm, Sat 9am–1pm",
    href: "tel:0362000000",
  },
  {
    icon: Mail,
    label: "Email",
    value: "hello@tasdrive.com.au",
    caption: "We respond within 1 business day",
    href: "mailto:hello@tasdrive.com.au",
  },
  {
    icon: MapPin,
    label: "Head Office",
    value: "78 Collins St, Hobart TAS 7000",
    caption: "Walk-ins welcome during business hours",
  },
];