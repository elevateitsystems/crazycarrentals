// Single source for the business details confirmed by the client. Import from here instead of hardcoding.

export const BUSINESS_PHONE = "0437 793 645";
export const BUSINESS_PHONE_HREF = "tel:0437793645";
export const BUSINESS_EMAIL = "info@tasdriverentals.com.au";
export const BUSINESS_ADDRESS = "201 Wellington St, Launceston TAS 7250, Australia";

export const BUSINESS_HOURS = [
  { label: "Monday – Friday", time: "8 AM – 5 PM" },
  { label: "Saturday", time: "9 AM – 3 PM" },
  { label: "Sunday", time: "9 AM – 2 PM" },
];
export const BUSINESS_HOURS_SUMMARY = "Mon–Fri 8 AM–5 PM, Sat 9 AM–3 PM, Sun 9 AM–2 PM";

export const DIRECTIONS_URL = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(BUSINESS_ADDRESS)}`;
