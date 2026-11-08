// Single source for the business details confirmed by the client. Import from here instead of hardcoding.

export const BUSINESS_PHONE = "0437 793 645";
export const BUSINESS_PHONE_HREF = "tel:0437793645";
export const BUSINESS_EMAIL = "info@tasdriverentals.com.au";
export const BUSINESS_ADDRESS = "201 Wellington St, Launceston TAS 7250, Australia";

export const BUSINESS_HOURS = [
  { label: "Monday – Friday", time: "8:00am – 5:00pm" },
  { label: "Saturday", time: "9:00am – 3:00pm" },
  { label: "Sunday", time: "9:00am – 2:00pm" },
];
export const BUSINESS_HOURS_SUMMARY = "Mon–Fri 8:00am–5:00pm, Sat 9:00am–3:00pm, Sun 9:00am–2:00pm";

export const DIRECTIONS_URL = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(BUSINESS_ADDRESS)}`;

/** Coordinates of the branch (geocoded from the address with OpenStreetMap). Used for the key-free map embed. */
export const BUSINESS_COORDS = { lat: -41.4464707, lon: 147.1396547 };
const pad = 0.004;
export const MAP_EMBED_URL = `https://www.openstreetmap.org/export/embed.html?bbox=${[
  BUSINESS_COORDS.lon - pad,
  BUSINESS_COORDS.lat - pad,
  BUSINESS_COORDS.lon + pad,
  BUSINESS_COORDS.lat + pad,
].join(",")}&layer=mapnik&marker=${BUSINESS_COORDS.lat},${BUSINESS_COORDS.lon}`;
