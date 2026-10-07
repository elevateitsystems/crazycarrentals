import type { Car } from "@/components/CarCard";

export const steps = ["Vehicle", "Extras", "Your Details", "Driver", "Payment", "Confirmation"] as const;

export const DEFAULT_DAYS = 4;

export const extrasList = [
  { id: "additional-driver", title: "Additional Driver", description: "Add a second authorised driver to your rental.", pricePerDay: 12 },
  { id: "child-seat", title: "Child Seat", description: "Approved restraint for children 0–4 years. Fitted by our team.", pricePerDay: 8 },
  { id: "gps", title: "GPS Navigation", description: "Dedicated GPS unit — great for exploring regional Tasmania.", pricePerDay: 10 },
  { id: "roadside", title: "Roadside Assistance Plus", description: "24/7 emergency roadside support throughout your rental.", pricePerDay: 6 },
  { id: "toll-pass", title: "Toll Pass", description: "Prepaid toll pass for convenient bridge and road crossings.", pricePerDay: 5 },
  { id: "wifi", title: "Portable Wi-Fi", description: "Stay connected with a portable Wi-Fi hotspot in the vehicle.", pricePerDay: 9 },
];

export type BookingData = {
  pickupLocation: string;
  returnLocation: string;
  pickupDate: string;
  pickupTime: string;
  returnDate: string;
  returnTime: string;
  extras: string[];
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dob: string;
  licenceState: string;
  licenceNumber: string;
  licenceExpiry: string;
  paymentMethod: "credit" | "debit";
  cardNumber: string;
  cardName: string;
  cardExpiry: string;
  cardCvc: string;
  street: string;
  suburb: string;
  state: string;
  postcode: string;
};

export const initialBooking: BookingData = {
  pickupLocation: "Hobart Airport",
  returnLocation: "",
  pickupDate: "",
  pickupTime: "",
  returnDate: "",
  returnTime: "",
  extras: [],
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  dob: "",
  licenceState: "",
  licenceNumber: "",
  licenceExpiry: "",
  paymentMethod: "credit",
  cardNumber: "",
  cardName: "",
  cardExpiry: "",
  cardCvc: "",
  street: "",
  suburb: "",
  state: "",
  postcode: "",
};

export type StepProps = {
  data: BookingData;
  update: (patch: Partial<BookingData>) => void;
  onNext: () => void;
  onBack: () => void;
};

export function getPricing(car: Car, data: BookingData) {
  let days = DEFAULT_DAYS;
  if (data.pickupDate && data.returnDate) {
    const diff = (new Date(data.returnDate).getTime() - new Date(data.pickupDate).getTime()) / 86_400_000;
    days = Math.max(1, Math.ceil(diff));
  }
  const base = days * car.price;
  const selected = extrasList
    .filter((e) => data.extras.includes(e.id))
    .map((e) => ({ ...e, total: e.pricePerDay * days }));
  const total = base + selected.reduce((sum, e) => sum + e.total, 0);
  return { days, base, selected, total };
}

export type Pricing = ReturnType<typeof getPricing>;