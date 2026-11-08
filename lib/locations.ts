import { BUSINESS_ADDRESS, BUSINESS_EMAIL, BUSINESS_HOURS, BUSINESS_HOURS_SUMMARY, BUSINESS_PHONE } from "@/lib/business";

export type Location = {
  slug: string;
  region: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  hours: { label: string; time: string }[];
  summaryHours: string;
  offers: string[];
};

/** Regular car rentals operate from this single location. Do not list other pickup points for rentals. */
export const RENTAL_ADDRESS = BUSINESS_ADDRESS;

/** How the pickup location reads on the reservation form (client wording). */
export const RENTAL_LOCATION_LABEL = "Launceston Downtown, Tasmania Australia";

/** Accident replacement vehicles are delivered anywhere in Tasmania. */
export const ACCIDENT_SERVICE_AREA = "Statewide across Tasmania";

export const locations: Location[] = [
  {
    slug: "launceston",
    region: "Launceston",
    name: "Launceston Branch",
    address: BUSINESS_ADDRESS,
    phone: BUSINESS_PHONE,
    email: BUSINESS_EMAIL,
    hours: BUSINESS_HOURS,
    summaryHours: BUSINESS_HOURS_SUMMARY,
    offers: [],
  },
];
