export type Location = {
  slug: string;
  region: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  image: string;
  hours: { label: string; time: string }[];
  summaryHours: string;
  offers: string[];
};

const hours = [
  { label: "Monday – Friday", time: "7:00am – 9:00pm" },
  { label: "Saturday", time: "7:00am – 8:00pm" },
  { label: "Sunday", time: "8:00am – 6:00pm" },
  { label: "Public Holidays", time: "8:00am – 7:00pm" },
];

export const locations: Location[] = [
  {
    slug: "hobart-airport",
    region: "Hobart",
    name: "Hobart Airport",
    address: "Strachan St, Cambridge TAS 7170",
    phone: "(03) 6200 0001",
    email: "airport@tasdrive.com.au",
    image: "/location-image.jpg",
    hours,
    summaryHours: "7:00am – 9:00pm",
    offers: ["Airport pickup & drop-off", "After-hours key collection", "Express returns", "Free shuttle to terminal"],
  },
  {
    slug: "hobart-cbd",
    region: "Hobart",
    name: "Hobart CBD",
    address: "78 Collins St, Hobart TAS 7000",
    phone: "(03) 6200 0002",
    email: "cbd@tasdrive.com.au",
    image: "/location-image.jpg",
    hours,
    summaryHours: "8:00am – 6:00pm",
    offers: ["City centre pickup & drop-off", "Easy walk from the waterfront", "Express returns", "Street-level vehicle handover"],
  },
  {
    slug: "launceston",
    region: "Launceston",
    name: "Launceston",
    address: "121 Brisbane St, Launceston TAS 7250",
    phone: "(03) 6200 0003",
    email: "launceston@tasdrive.com.au",
    image: "/location-image.jpg",
    hours,
    summaryHours: "8:00am – 6:00pm",
    offers: ["Central pickup & drop-off", "After-hours key collection", "One-way rentals available", "Local touring advice"],
  },
];